"""
LTI 1.3 Views

Implements OIDC login initiation and LTI launch handling for Learning Tools Interoperability.

References:
- LTI 1.3 Core: https://www.imsglobal.org/spec/lti/v1p3/
- LTI Advantage: https://www.imsglobal.org/spec/lti/v1p3/impl
"""
import logging

from django.conf import settings
from django.http import HttpResponseBadRequest
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from lti_tool.utils import DjangoToolConfig
from lti_tool.views import LtiLaunchBaseView, OIDCLoginInitView
from pylti1p3.contrib.django import DjangoCacheDataStorage, DjangoOIDCLogin, DjangoMessageLaunch
from pylti1p3.exception import LtiException

logger = logging.getLogger(__name__)


def get_launch_with_leeway(request):
    """
    Custom launch function that handles clock skew between LMS and Django.

    Adds JWT leeway to tolerate time differences that cause "token not yet valid (iat)" errors.
    """
    import jwt
    from functools import wraps

    tool_conf = DjangoToolConfig()
    launch_data_storage = DjangoCacheDataStorage()

    # Get leeway from settings (default 5 minutes)
    leeway = getattr(settings, 'LTI_JWT_LEEWAY', 300)

    # Monkey-patch jwt.decode to include leeway
    original_decode = jwt.decode

    @wraps(original_decode)
    def decode_with_leeway(*args, **kwargs):
        # Add leeway to kwargs if not already present
        if 'leeway' not in kwargs:
            kwargs['leeway'] = leeway
        return original_decode(*args, **kwargs)

    # Temporarily replace jwt.decode
    jwt.decode = decode_with_leeway

    try:
        # Create message launch
        message_launch = DjangoMessageLaunch(
            request,
            tool_conf,
            launch_data_storage=launch_data_storage
        )

        # Validate with leeway applied
        message_launch.validate()

        # Return LtiLaunch wrapper
        from lti_tool.utils import LtiLaunch
        return LtiLaunch(message_launch)
    finally:
        # Restore original jwt.decode
        jwt.decode = original_decode


@method_decorator(csrf_exempt, name='dispatch')
class OIDCLoginView(OIDCLoginInitView):
    """
    OIDC Login Initiation View

    Handles the first step of the LTI 1.3 launch flow (OIDC login).
    Accepts login initiation requests from the platform and redirects
    to the platform's authentication endpoint.

    Spec: https://www.imsglobal.org/spec/security/v1p0/#step-2-authentication-request

    Note: CSRF exempted because platforms POST from external domains.
    This is a public OIDC endpoint that accepts cross-origin requests.
    """

    def get(self, request, *args, **kwargs):
        """Handle GET requests for OIDC login initiation."""
        registration_uuid = kwargs.get('registration_uuid')
        return self._handle_login(request, registration_uuid, request.GET)

    def post(self, request, *args, **kwargs):
        """Handle POST requests for OIDC login initiation."""
        registration_uuid = kwargs.get('registration_uuid')
        return self._handle_login(request, registration_uuid, request.POST)

    def _handle_login(self, request, registration_uuid, params):
        """
        Process OIDC login initiation.

        Handles client_id injection for platforms that don't send it (e.g., Sakai).
        Ensures proper state cookie generation for cross-origin iframe launches.
        """
        from lti_tool.models import LtiRegistration

        try:
            client_id = params.get('client_id')
            target_link_uri = params.get('target_link_uri')

            if not target_link_uri:
                return HttpResponseBadRequest("Missing required parameter: target_link_uri")

            # Initialize tool configuration
            tool_conf = DjangoToolConfig(registration_uuid)

            # WORKAROUND: Some LMS platforms (e.g., Sakai) don't send client_id
            # Inject it from the registration if missing
            if not client_id and registration_uuid:
                try:
                    registration = LtiRegistration.objects.get(uuid=registration_uuid)
                    client_id = registration.client_id

                    # Inject client_id into request parameters
                    if request.method == 'GET':
                        request.GET = request.GET.copy()
                        request.GET['client_id'] = client_id
                    else:
                        request.POST = request.POST.copy()
                        request.POST['client_id'] = client_id

                    logger.info(f"Client ID injected from registration: {client_id}")
                except LtiRegistration.DoesNotExist:
                    logger.error(f"LTI Registration not found for UUID: {registration_uuid}")
                    return HttpResponseBadRequest("LTI Registration not found")

            # Initialize OIDC login with cache storage
            launch_data_storage = DjangoCacheDataStorage()
            oidc_login = DjangoOIDCLogin(
                request, tool_conf, launch_data_storage=launch_data_storage
            )

            # Get redirect URL
            redirect_url = self.get_redirect_url(target_link_uri)

            # CRITICAL: Use get_redirect_object().do_redirect() to properly set state cookies
            # Direct use of _prepare_redirect_url() bypasses the cookie-setting mechanism
            redirect_obj = oidc_login.get_redirect_object(redirect_url)

            return redirect_obj.do_redirect()

        except LtiException as e:
            logger.error(f"LTI error during OIDC login: {str(e)}")
            return HttpResponseBadRequest(f"LTI configuration error: {str(e)}")
        except Exception as e:
            logger.exception("Unexpected error during OIDC login")
            return HttpResponseBadRequest(f"An error occurred during login initialization: {str(e)}")


@method_decorator(csrf_exempt, name='dispatch')
class LtiLaunchView(LtiLaunchBaseView):
    """
    LTI 1.3 Launch Handler

    Processes the LTI launch request after OIDC authentication.
    Validates the JWT, extracts user and context information,
    and redirects to the appropriate handler based on message type.

    Spec: https://www.imsglobal.org/spec/lti/v1p3/#lti-message-general-details

    Note: CSRF exempted because platforms POST from external domains.
    Security is handled via LTI 1.3 JWT signature validation.
    """

    def post(self, request, *args, **kwargs):
        """
        Override post to handle platform-specific workarounds and data synchronization.

        Handles:
        - Missing GUID in platform claim (e.g., Sakai)
        - Proper sync function call ordering with correct arguments
        - Comprehensive error handling for each sync step
        """
        from lti_tool.utils import (
            sync_user_from_launch,
            sync_context_from_launch,
            sync_membership_from_launch,
            sync_resource_link_from_launch
        )
        from lti_tool.views import SESSION_KEY

        try:
            # Clear session and get launch with clock skew tolerance
            request.session.clear()
            lti_launch = get_launch_with_leeway(request)

            # WORKAROUND: Some platforms (e.g., Sakai) don't send 'guid' in platform claim
            # Use issuer as fallback to ensure compatibility
            platform_claim = lti_launch.platform_instance_claim
            if platform_claim and 'guid' not in platform_claim:
                issuer = lti_launch.get_claim("iss")
                platform_claim['guid'] = issuer
                logger.info(f"GUID fallback applied: using issuer as GUID ({issuer})")

            # Get LTI 1.1 secret for backward compatibility (if applicable)
            # Some platforms (e.g., Canvas) don't send migration claims, so handle gracefully
            lti1p1_secret = None
            try:
                lti1p1_consumer_key = lti_launch.lti1p1_consumer_key
                lti1p1_secret = self.get_lti1p1_secret(lti1p1_consumer_key)
                logger.info(f"LTI 1.1 migration detected: consumer_key={lti1p1_consumer_key}")
            except (KeyError, AttributeError):
                logger.info("No LTI 1.1 migration data present (pure LTI 1.3 launch)")

            # Sync user
            try:
                user = sync_user_from_launch(lti_launch, lti1p1_secret)
                if user is None:
                    raise ValueError("sync_user_from_launch returned None")
            except Exception as e:
                logger.error(f"Failed to sync user: {e}")
                raise

            # Sync platform, context, membership, and resource link
            if not lti_launch.is_data_privacy_launch:
                try:
                    self._sync_platform_instance_with_guid_fallback(lti_launch, lti1p1_secret)
                except Exception as e:
                    logger.error(f"Failed to sync platform instance: {e}")
                    raise

                try:
                    context = sync_context_from_launch(lti_launch, lti1p1_secret)
                    if context is None:
                        raise ValueError("sync_context_from_launch returned None")
                except Exception as e:
                    logger.error(f"Failed to sync context: {e}")
                    raise

                try:
                    sync_membership_from_launch(lti_launch, user, context)
                except Exception as e:
                    logger.error(f"Failed to sync membership: {e}")
                    raise

                try:
                    sync_resource_link_from_launch(lti_launch, context, lti1p1_secret)
                except Exception as e:
                    logger.error(f"Failed to sync resource link: {e}")
                    raise

            # Setup and continue with normal flow
            self.launch_setup(request, lti_launch)

            # Check deployment activation
            if not lti_launch.deployment.is_active:
                logger.warning(f"Inactive deployment attempted: {lti_launch.deployment.id}")
                return self.handle_inactive_deployment(request, lti_launch)

            request.session[SESSION_KEY] = lti_launch.get_launch_id()
            request.lti_launch = lti_launch

            # Route to appropriate handler based on message type
            if request.lti_launch.is_resource_launch:
                return self.handle_resource_launch(request, lti_launch)
            if request.lti_launch.is_deep_link_launch:
                return self.handle_deep_linking_launch(request, lti_launch)
            if request.lti_launch.is_submission_review_launch:
                return self.handle_submission_review_launch(request, lti_launch)
            if request.lti_launch.is_data_privacy_launch:
                return self.handle_data_privacy_launch(request, lti_launch)

            return HttpResponseBadRequest("Unknown message type")

        except Exception as e:
            logger.exception(f"Error during LTI launch: {e}")
            raise

    def _sync_platform_instance_with_guid_fallback(self, lti_launch, lti1p1_secret):
        """
        Sync platform instance with GUID fallback.

        Some platforms (e.g., Sakai) don't send 'guid' in the platform claim.
        This method uses the issuer URL as a fallback to ensure compatibility.
        """
        from lti_tool.models import LtiPlatformInstance

        platform_instance_claim = lti_launch.platform_instance_claim
        if platform_instance_claim is None:
            return None

        # Use GUID from claim, fallback to issuer if missing
        guid = platform_instance_claim.get("guid", lti_launch.get_claim("iss"))

        defaults = {
            "contact_email": platform_instance_claim.get("contact_email", ""),
            "description": platform_instance_claim.get("description", ""),
            "name": platform_instance_claim.get("name", ""),
            "url": platform_instance_claim.get("url", ""),
            "product_family_code": platform_instance_claim.get("product_family_code", ""),
            "version": platform_instance_claim.get("version", ""),
        }

        if lti1p1_secret is not None and lti_launch.has_valid_migration_claim(lti1p1_secret):
            defaults["lti1p1_id_on_platform"] = lti_launch.migration_claim.get(
                "tool_consumer_instance_guid", guid
            )

        platform_instance, _created = LtiPlatformInstance.objects.update_or_create(
            issuer=lti_launch.get_claim("iss"),
            guid=guid,
            defaults=defaults,
        )

        deployment = lti_launch.deployment
        deployment.platform_instance = platform_instance
        deployment.save(update_fields=["platform_instance"])
        return platform_instance

    def handle_resource_launch(self, request, lti_launch):
        """
        Handle LTI Resource Link launch.

        Creates/updates student profile, generates JWT token,
        and redirects to the frontend application.
        """
        from .models import StudentProfile
        import jwt
        from datetime import datetime, timedelta

        # Extract user information
        user_name = lti_launch.get_claim('name')
        user_email = lti_launch.get_claim('email')
        roles = lti_launch.roles_claim

        # Store in session
        request.session['lti_user_name'] = user_name
        request.session['lti_user_email'] = user_email
        request.session['lti_user_roles'] = roles

        logger.info(f"LTI Launch - User: {user_name}, Email: {user_email}, Roles: {roles}")

        # Get user and context from LTI launch
        try:
            # Get the synced user and context from the launch object
            # These were already synced in the post() method
            user = lti_launch.user
            context = lti_launch.context if not lti_launch.is_data_privacy_launch else None

            if not user:
                logger.error("Could not find user after LTI sync")
                return HttpResponseBadRequest("User not found")

            if not context and not lti_launch.is_data_privacy_launch:
                logger.error("Could not find context after LTI sync")
                return HttpResponseBadRequest("Context not found")

            # Create or get student profile
            profile, created = StudentProfile.objects.get_or_create(
                lti_user=user,
                context=context,
                defaults={
                    'xp': 0,
                    'level': 1,
                }
            )

            if created:
                logger.info(f"Created new student profile for user {user.name} in context {context.title}")

            # Generate JWT token
            jwt_secret = getattr(settings, 'JWT_SECRET_KEY', settings.SECRET_KEY)
            token = jwt.encode({
                'user_id': user.id,
                'context_id': context.id,
                'exp': datetime.utcnow() + timedelta(days=1),
                'iat': datetime.utcnow(),
            }, jwt_secret, algorithm='HS256')

            # Redirect to frontend with token
            frontend_url = getattr(settings, 'LTI_FRONTEND_URL', 'http://localhost:5173')
            redirect_url = f"{frontend_url}?lti_token={token}"

            logger.info(f"Redirecting to frontend: {redirect_url}")
            return redirect(redirect_url)

        except Exception as e:
            logger.exception(f"Error during resource launch handling: {e}")
            return HttpResponseBadRequest(f"Error processing launch: {str(e)}")
