"""
JWT Authentication for Gamification API

This module provides JWT-based authentication for the gamification API endpoints.
The JWT tokens are generated during LTI launch and contain user and context information.
"""
import jwt
from django.conf import settings
from rest_framework import authentication
from rest_framework import exceptions


class JWTAuthentication(authentication.BaseAuthentication):
    """
    JWT Authentication for API endpoints.

    Extracts and validates JWT tokens from the Authorization header.
    Sets request.user and request.context from the decoded token.
    """

    def authenticate(self, request):
        """
        Authenticate the request using JWT token.

        Returns:
            tuple: (user, auth) where auth contains context info
            None: If no authentication credentials provided

        Raises:
            AuthenticationFailed: If authentication fails
        """
        # Get the authorization header
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')

        if not auth_header:
            return None

        # Check for Bearer token
        parts = auth_header.split()

        if len(parts) != 2 or parts[0].lower() != 'bearer':
            raise exceptions.AuthenticationFailed('Invalid authorization header format')

        token = parts[1]

        try:
            # Decode JWT token
            secret_key = getattr(settings, 'JWT_SECRET_KEY', settings.SECRET_KEY)
            payload = jwt.decode(
                token,
                secret_key,
                algorithms=['HS256']
            )

            # Extract user and context IDs
            user_id = payload.get('user_id')
            context_id = payload.get('context_id')

            if not user_id or not context_id:
                raise exceptions.AuthenticationFailed('Invalid token payload')

            # Get user and context from database
            from lti_tool.models import LtiUser, LtiContext

            try:
                user = LtiUser.objects.get(id=user_id)
            except LtiUser.DoesNotExist:
                raise exceptions.AuthenticationFailed('User not found')

            try:
                context = LtiContext.objects.get(id=context_id)
            except LtiContext.DoesNotExist:
                raise exceptions.AuthenticationFailed('Context not found')

            # Attach context to request for easy access
            request.context = context

            # Return user and auth info
            return (user, {'context': context})

        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired')

        except jwt.InvalidTokenError as e:
            raise exceptions.AuthenticationFailed(f'Invalid token: {str(e)}')

        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Authentication failed: {str(e)}')

    def authenticate_header(self, request):
        """
        Return WWW-Authenticate header value for 401 responses.

        Args:
            request: The HTTP request (required by DRF interface)
        """
        return 'Bearer realm="api"'
