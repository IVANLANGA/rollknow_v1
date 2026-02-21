# LTI 1.3 Implementation Notes

## Overview

This document covers the technical implementation details, edge cases, and platform-specific workarounds discovered during integration with Sakai, Moodle, and Canvas LMS platforms.

## Architecture

RollKnow implements LTI 1.3 (Learning Tools Interoperability) using:
- Backend: Django with `pylti1p3` library
- Frontend: React/Vite application
- Authentication: OIDC (OpenID Connect) flow with JWT validation

## Platform-Specific Edge Cases

### 1. JWT Clock Skew (Affects: Sakai, Moodle)

**Problem**: LMS server and Django server clocks may not be perfectly synchronized, causing JWT validation errors:
```
Can't decode id_token: The token is not yet valid (iat)
```

**Root Cause**: PyJWT validates the `iat` (issued-at) timestamp strictly. If the LMS server clock is even slightly ahead, the token appears to be issued in the future.

**Solution**: Implemented JWT leeway tolerance using monkey-patching approach in `views.py`:

```python
def get_launch_with_leeway(request):
    """
    Custom launch function that handles clock skew between LMS and Django.
    Adds JWT leeway to tolerate time differences.
    """
    import jwt
    from functools import wraps

    # Get leeway from settings (default 5 minutes)
    leeway = getattr(settings, 'LTI_JWT_LEEWAY', 300)

    # Monkey-patch jwt.decode to include leeway
    original_decode = jwt.decode

    @wraps(original_decode)
    def decode_with_leeway(*args, **kwargs):
        if 'leeway' not in kwargs:
            kwargs['leeway'] = leeway
        return original_decode(*args, **kwargs)

    jwt.decode = decode_with_leeway

    try:
        # Create and validate message launch
        message_launch = DjangoMessageLaunch(request, tool_conf, launch_data_storage=launch_data_storage)
        message_launch.validate()
        return LtiLaunch(message_launch)
    finally:
        # Restore original jwt.decode
        jwt.decode = original_decode
```

**Configuration**: Set `LTI_JWT_LEEWAY = 300` in `core/settings/base.py` (5 minutes tolerance).

---

### 2. Missing Client ID (Affects: Sakai)

**Problem**: Sakai does not include `client_id` in the OIDC login initiation request, causing registration lookup to fail.

**Solution**: The `DjangoOIDCLogin` class automatically injects the client ID from the registration when missing:

```python
oidc_login = DjangoOIDCLogin(request, tool_conf, launch_data_storage=launch_data_storage)
```

The library handles this internally by looking up the registration and using its configured client ID.

**Note**: Ensure the registration has the correct client ID configured in the database.

---

### 3. Missing Platform GUID (Affects: Sakai)

**Problem**: Sakai doesn't send a `guid` value in the platform claim, which some LTI implementations use for platform identification.

**Solution**: The code uses the issuer as a fallback for platform identification. The `get_or_create` logic handles this gracefully:

```python
# Platform is identified by issuer if GUID is not present
platform, created = Platform.objects.get_or_create(
    issuer=deployment.registration.issuer,
    defaults={'name': lti_launch.platform_name or deployment.registration.issuer}
)
```

---

### 4. Missing LTI 1.1 Migration Claims (Affects: Canvas)

**Problem**: Canvas is pure LTI 1.3 and does not send LTI 1.1 migration claims (`oauth_consumer_key`, etc.). Code that assumes these claims exist will fail with `KeyError`.

**Solution**: Gracefully handle missing migration claims with try/except:

```python
# Get LTI 1.1 secret for backward compatibility (if applicable)
lti1p1_secret = None
try:
    lti1p1_consumer_key = lti_launch.lti1p1_consumer_key
    lti1p1_secret = self.get_lti1p1_secret(lti1p1_consumer_key)
except (KeyError, AttributeError):
    # Pure LTI 1.3 launch - no migration data present
    pass
```

**Note**: Most modern LMS platforms are pure LTI 1.3. Only handle LTI 1.1 migration if the platform explicitly sends migration claims.

---

### 5. Canvas Issuer vs OAuth Endpoints (Affects: Canvas)

**Problem**: Canvas identifies itself with a global issuer (`https://canvas.instructure.com`) but OAuth endpoints use the local hostname.

**Configuration Pattern**:
```python
# Canvas Registration Example
issuer: https://canvas.instructure.com  # Canvas's global identity
auth_url: http://canvas.docker:7000/api/lti/authorize_redirect  # Local endpoint
token_url: http://canvas.docker:7000/login/oauth2/token  # Local endpoint
keyset_url: http://canvas.docker:7000/api/lti/security/jwks  # Local endpoint
```

**Important**: The issuer must match what Canvas sends in JWT tokens, while OAuth endpoints must use the actual accessible hostname.

---

### 6. Canvas Deployment ID Format (Affects: Canvas)

**Problem**: Canvas uses a unique deployment ID format that includes a prefix and hash.

**Example**: `2:4dde05e8ca1973bcca9bffc13e1548820eee93a3`

**Solution**: Copy the exact deployment ID from Canvas's LTI configuration. Do not modify or truncate it.

---

### 7. Content Security Policy (Affects: Canvas)

**Problem**: Canvas enforces strict CSP (Content Security Policy) that blocks iframe content from unauthorized domains.

**Error Symptoms**:
- Blank iframe in Canvas
- Browser console error: `Refused to frame ... violates Content Security Policy directive "frame-src ..."`

**Solution Options**:

1. **Canvas Source Code Modification** (Used for localhost development):
   - Edit `~/canvas-lms/app/helpers/application_helper.rb`
   - Add your domain to the `frame-src` directive in the `add_csp_for_root` method
   - Example: `directives = "frame-src 'self' blob: #{allow_list_domains(include_tools: true)} localhost:3000 http://localhost:3000; "`

2. **Canvas Admin Configuration** (Production):
   - Add your tool domain to Canvas's "Allowable iframe Sources" in admin settings
   - This is the preferred method for production deployments

**Frontend Configuration**: Ensure your Vite dev server allows iframe embedding:
```typescript
// vite.config.ts
server: {
  headers: {
    'X-Frame-Options': 'ALLOWALL',
    'Content-Security-Policy': "frame-ancestors *"
  }
}
```

---

## Cookie Configuration

LTI launches require proper cookie handling for cross-origin iframe contexts.

### Development (HTTP localhost)

For localhost testing where both LMS and Django are on `localhost`:

```python
# core/settings/local.py
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SAMESITE = None  # Disable SameSite for cross-port testing
CSRF_COOKIE_SAMESITE = None
SESSION_COOKIE_HTTPONLY = False  # Critical for iframe context
CSRF_COOKIE_HTTPONLY = False
SESSION_COOKIE_DOMAIN = None
CSRF_COOKIE_DOMAIN = None
```

### Production (HTTPS)

For production with HTTPS (required for cross-origin iframe embeds):

```python
# core/settings/base.py
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = 'None'  # Required for cross-origin
CSRF_COOKIE_SAMESITE = 'None'
SESSION_COOKIE_HTTPONLY = False  # Still False for LTI iframe context
CSRF_COOKIE_HTTPONLY = False
```

**Important**: `HTTPOnly = False` is required for LTI because cookies need to be accessible in iframe contexts.

---

## CORS Configuration

For localhost cross-origin testing:

```python
CORS_ALLOW_ALL_ORIGINS = True  # Only for localhost testing!
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:8080',   # Sakai
    'http://localhost:8888',   # Moodle
    'http://localhost:7000',   # Canvas
    'http://canvas.docker:7000',  # Canvas Docker hostname
]
```

For production, configure `CORS_ALLOWED_ORIGINS` with specific domains only.

---

## Registration Configuration Requirements

Each LMS registration requires:

1. **Registration UUID**: Unique identifier for the tool registration
2. **Client ID**: OAuth client identifier provided by the LMS
3. **Issuer**: The LMS's identity (may differ from hostname - see Canvas edge case)
4. **Auth URL**: OIDC authentication endpoint
5. **Token URL**: OAuth token exchange endpoint
6. **Keyset URL**: JWKS endpoint for public key verification
7. **Deployment ID(s)**: One or more deployment identifiers

**Verification**: After configuration, verify in Django admin that:
- Registration `is_active = True`
- Deployment `is_active = True`
- URLs are accessible from Django server
- Issuer exactly matches what LMS sends in JWT tokens

---

## Common Troubleshooting

### "Could not find registration details"

**Causes**:
1. Issuer mismatch between Django config and LMS JWT token
2. Deployment ID mismatch
3. Inactive registration or deployment

**Solution**: Check Django admin for exact issuer and deployment ID, compare with JWT payload.

---

### "The token is not yet valid (iat)"

**Cause**: Clock skew between LMS and Django server

**Solution**: Ensure `LTI_JWT_LEEWAY = 300` is set in settings and `get_launch_with_leeway()` is used.

---

### Blank iframe in LMS

**Causes**:
1. CSP blocking (check browser console)
2. Frontend not configured for iframe embedding
3. Frontend URL mismatch in `LTI_FRONTEND_URL` setting

**Solution**:
1. Add domain to LMS's CSP whitelist
2. Configure Vite headers for iframe embedding
3. Verify `LTI_FRONTEND_URL` in settings matches actual frontend URL

---

### Missing user data in launch

**Cause**: Privacy settings in LMS or missing scopes in tool configuration

**Solution**: Ensure tool is configured with required LTI scopes:
- `https://purl.imsglobal.org/spec/lti-ags/scope/lineitem` (Assignments and Grades)
- `https://purl.imsglobal.org/spec/lti-nrps/scope/contextmembership.readonly` (Names and Role)

---

## Security Considerations

1. **Always use HTTPS in production**: HTTP is only acceptable for localhost development
2. **Validate JWT signatures**: The `pylti1p3` library handles this automatically
3. **Use proper SameSite settings**: `SameSite=None` with `Secure=True` for production
4. **Store secrets securely**: Never commit client secrets or private keys to version control
5. **Validate launch data**: Always validate that users and contexts exist before granting access
6. **Implement proper error handling**: Never expose internal errors to users

---

## Testing Checklist

When integrating with a new LMS platform:

- [ ] LTI registration created in LMS admin
- [ ] Django registration configured with correct client ID and issuer
- [ ] Django deployment created and marked active
- [ ] OIDC login initiates without errors
- [ ] JWT validation succeeds (check for clock skew errors)
- [ ] User data extracted correctly (name, email, roles)
- [ ] Course/context data extracted correctly
- [ ] Frontend loads in iframe without CSP errors
- [ ] User authenticated in frontend
- [ ] Return URL redirects work correctly
- [ ] Deep linking (content selection) works if applicable

---

## Platform Compatibility Matrix

| Feature | Sakai | Moodle | Canvas | Notes |
|---------|-------|--------|--------|-------|
| Client ID in OIDC login | L |  |  | Sakai requires injection |
| Platform GUID | L |  |  | Use issuer fallback for Sakai |
| LTI 1.1 Migration Claims |  |  | L | Canvas is pure LTI 1.3 |
| Clock Skew Tolerance |   |   |  | Requires JWT leeway |
| Standard Issuer Format |  |  | L | Canvas uses global issuer |
| CSP Configuration | N/A | N/A |   | Canvas requires whitelist |

 = Works without modification
L = Missing, handled with fallback
  = Requires specific configuration
N/A = Not applicable

---

## Code Organization

### Core Files

- [apps/learning_tools_interoperability/views.py](apps/learning_tools_interoperability/views.py): LTI launch handling and edge case logic
- [apps/learning_tools_interoperability/utils.py](apps/learning_tools_interoperability/utils.py): LTI utility functions and wrappers
- [core/settings/base.py](core/settings/base.py): Production settings including JWT leeway
- [core/settings/local.py](core/settings/local.py): Development settings for localhost testing
- [frontend/vite.config.ts](frontend/vite.config.ts): Frontend server configuration for iframe embedding

### Key Functions

- **`get_launch_with_leeway(request)`**: Handles JWT clock skew with leeway
- **`LtiLaunchView.post()`**: Main LTI launch endpoint with exception handling
- **`validate_lti_launch(lti_launch)`**: Validates and extracts launch data with platform-specific fallbacks

---

## Additional Resources

- [IMS Global LTI 1.3 Specification](https://www.imsglobal.org/spec/lti/v1p3/)
- [pylti1p3 Documentation](https://github.com/dmitry-viskov/pylti1.3-django)
- LMS-specific documentation included in [LTI_INTEGRATION_GUIDE.md](LTI_INTEGRATION_GUIDE.md)
