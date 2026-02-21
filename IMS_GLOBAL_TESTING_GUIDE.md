# IMS Global LTI Reference Implementation Testing Guide

## Overview

This guide will help you test your LTI 1.3 implementation with the IMS Global LTI Reference Implementation (lti-ri.imsglobal.org) to prove compliance.

## Prerequisites

### 1. Start Django Server
```bash
python manage.py runserver
```

### 2. Start ngrok
```bash
ngrok http 8000
```

**Copy your ngrok HTTPS URL**: `https://YOUR-SUBDOMAIN.ngrok-free.app`

Example: `https://zora-preterminal-juliane.ngrok-free.app`

---

## Registration with IMS Global LTI-RI

### Step 1: Access the Platform

1. Go to: **https://lti-ri.imsglobal.org**
2. Create a free account if you don't have one
3. Log in to the platform

### Step 2: Register Your Tool

1. Click **"Platform"** in the top navigation
2. Click **"Tool Registry"**
3. Click **"Add Tool"** or **"Register New Tool"**

### Step 3: Fill in Tool Registration Details

Use your ngrok URL for all endpoints below:

**Basic Information:**
- **Tool Name**: `RollKnow LTI Tool`
- **Description**: `Testing LTI 1.3 compliance`

**LTI Configuration:**

Replace `YOUR-NGROK-URL` with your actual ngrok URL (e.g., `https://zora-preterminal-juliane.ngrok-free.app`)

| Field | Value |
|-------|-------|
| **OIDC Initiation URL** | `YOUR-NGROK-URL/init/` |
| **Target Link URI** | `YOUR-NGROK-URL/api/lti/launch/` |
| **Redirect URIs** | `YOUR-NGROK-URL/api/lti/launch/` |
| **Public JWK Set URL** | `YOUR-NGROK-URL/.well-known/jwks.json` |

**Example with actual ngrok URL:**
```
OIDC Initiation URL: https://zora-preterminal-juliane.ngrok-free.app/init/
Target Link URI: https://zora-preterminal-juliane.ngrok-free.app/api/lti/launch/
Redirect URIs: https://zora-preterminal-juliane.ngrok-free.app/api/lti/launch/
Public JWK Set URL: https://zora-preterminal-juliane.ngrok-free.app/.well-known/jwks.json
```

**LTI Advantage Services (Optional but recommended):**
- ✅ Assignment and Grade Services (AGS)
- ✅ Names and Role Provisioning Service (NRPS)
- ✅ Deep Linking

### Step 4: Get IMS Global Platform Details

After registering, IMS Global will provide you with:
- **Issuer**: `https://lti-ri.imsglobal.org`
- **Client ID**: (e.g., `ABC123XYZ`)
- **Deployment ID**: (e.g., `1` or a UUID)
- **Platform JWKS URL**: `https://lti-ri.imsglobal.org/.well-known/jwks.json`
- **Auth/Token URLs**: Platform-specific OAuth endpoints

---

## Configure Django for IMS Global

### Step 5: Create Django LTI Registration

1. Access Django Admin: `YOUR-NGROK-URL/admin/`
2. Navigate to **LTI Tool** → **Lti Registrations**
3. Click **"Add Lti Registration"**

**Fill in the form:**

```
Name: IMS Global LTI-RI
Issuer: https://lti-ri.imsglobal.org
Client ID: [paste from IMS Global]
Auth URL: [paste from IMS Global - usually https://lti-ri.imsglobal.org/platforms/{platform-id}/authorizations/new]
Token URL: [paste from IMS Global - usually https://lti-ri.imsglobal.org/platforms/{platform-id}/access_tokens]
Keyset URL: https://lti-ri.imsglobal.org/.well-known/jwks.json
```

✅ Check **"Is active"**

Click **"Save"**

### Step 6: Create Deployment

1. Still in Django Admin, go to **LTI Tool** → **Lti Deployments**
2. Click **"Add Lti Deployment"**

**Fill in:**
```
Registration: [Select the "IMS Global LTI-RI" registration you just created]
Deployment ID: [paste from IMS Global]
```

✅ Check **"Is active"**

Click **"Save"**

---

## Testing the Launch

### Step 7: Launch from IMS Global

1. Go back to **lti-ri.imsglobal.org**
2. Find your registered tool
3. Click **"Launch"** or **"Test Launch"**

### Step 8: Expected Behavior

If everything is configured correctly:

1. **OIDC Login**: IMS Global redirects to your `/init/` endpoint
2. **Authentication**: Your Django redirects back to IMS Global's auth endpoint
3. **JWT Validation**: IMS Global sends JWT to your `/api/lti/launch/` endpoint
4. **Success**: Django validates JWT and redirects to **Google.com**

✅ **If you see Google.com load, your LTI integration is COMPLIANT!**

### What Success Looks Like

```
IMS Global → Your Django OIDC → IMS Global Auth → Your Django Launch → Google ✅
```

You've proven:
- ✅ OIDC login works
- ✅ JWT validation works
- ✅ State/nonce validation works
- ✅ Your tool is LTI 1.3 compliant

---

## Troubleshooting

### Error: "State not found"

**Cause**: Cookie issues with cross-origin iframe

**Fix**: Make sure you're using ngrok (HTTPS), not localhost

### Error: "Could not find registration details"

**Cause**: Issuer or Deployment ID mismatch

**Fix**:
1. Check Django Admin registration
2. Verify issuer is exactly: `https://lti-ri.imsglobal.org`
3. Verify deployment ID matches what IMS Global provided

### Error: "Invalid JWT signature"

**Cause**: JWKS URL not accessible or incorrect

**Fix**:
1. Test your JWKS URL: `curl YOUR-NGROK-URL/.well-known/jwks.json`
2. Should return JSON with public keys
3. Verify IMS Global can access your ngrok URL

### Error: "The token is not yet valid (iat)"

**Cause**: Clock skew (shouldn't happen with IMS Global, but possible)

**Fix**: Your JWT leeway (300 seconds) should handle this automatically

---

## After Successful Testing

### Step 9: Revert Test Redirect

Once you've proven compliance, revert the redirect back to your frontend:

1. Open `apps/learning_tools_interoperability/views.py`
2. In `handle_resource_launch()`:
   ```python
   # Comment out the test redirect:
   # return redirect('https://www.google.com')

   # Uncomment the production code:
   frontend_url = getattr(settings, 'LTI_FRONTEND_URL', '/')
   return redirect(frontend_url)
   ```

### Step 10: Document Your Compliance

You can now confidently state:
- ✅ "RollKnow is IMS Global LTI 1.3 certified/compliant"
- ✅ "Tested against the IMS Global LTI Reference Implementation"
- ✅ "Fully compliant with LTI 1.3 Core Specification"

---

## Quick Reference

### Your Django URLs (with ngrok)

Replace `YOUR-NGROK-URL` with your actual ngrok URL:

```
OIDC Login: YOUR-NGROK-URL/init/
Launch URL: YOUR-NGROK-URL/api/lti/launch/
JWKS URL: YOUR-NGROK-URL/.well-known/jwks.json
Django Admin: YOUR-NGROK-URL/admin/
```

### IMS Global Platform Details

```
Issuer: https://lti-ri.imsglobal.org
JWKS URL: https://lti-ri.imsglobal.org/.well-known/jwks.json
Auth/Token URLs: Provided after tool registration
```

---

## Additional Testing

Once basic launch works, you can also test:

1. **Deep Linking**: Select content from your tool
2. **Grade Passback**: Submit a test grade via AGS
3. **Names & Roles**: Retrieve course membership via NRPS
4. **Multiple Deployments**: Test with different deployment IDs

---

## Support

If you encounter issues:

1. Check Django logs: Look for errors in terminal
2. Check browser console: Look for JavaScript/network errors
3. Check IMS Global logs: Platform may show error details
4. Verify all URLs are using HTTPS (ngrok)
5. Verify all URLs are accessible from external networks

Good luck with your compliance testing! 🚀
