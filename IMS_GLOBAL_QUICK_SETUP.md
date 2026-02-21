# IMS Global LTI-RI Quick Setup Guide

## Your ngrok URL
```
https://zora-preterminal-juliane.ngrok-free.dev
```

---

## Step 1: Fill Out IMS Global Form

### Form Fields:

| Field | Value |
|-------|-------|
| **Name** | `RollKnow demo` |
| **Client** | `rollknow_demo_client_001` |
| **Audience** | `https://zora-preterminal-juliane.ngrok-free.dev` |
| **Tool Deep Link Service Endpoint** | Leave blank (or use placeholder) |
| **Platform Public Key** | Leave blank (auto-generated) |
| **Platform Private Key** | Leave blank (auto-generated) |
| **Tool Public Key** | Leave blank |
| **JWT Key Set URL** | `https://zora-preterminal-juliane.ngrok-free.dev/.well-known/jwks.json` ✅ |

Click **Submit** or **Save**

---

## Step 2: Get Platform Details from IMS Global

After registration, IMS Global will provide:

- **Issuer**: `https://lti-ri.imsglobal.org` (or similar)
- **Authorization URL**: `https://lti-ri.imsglobal.org/platforms/{id}/authorizations/new`
- **Token URL**: `https://lti-ri.imsglobal.org/platforms/{id}/access_tokens`
- **JWKS URL**: `https://lti-ri.imsglobal.org/.well-known/jwks.json`
- **Deployment ID**: `1` (or a UUID)

**Copy these values!** You'll need them for Django.

---

## Step 3: Configure Django Admin

### 3A. Create LTI Registration

1. Go to: `https://zora-preterminal-juliane.ngrok-free.dev/admin/`
2. Login to Django admin
3. Navigate to: **LTI Tool** → **Lti Registrations**
4. Click **Add Lti Registration**
5. Fill in:

```
Name: IMS Global LTI-RI
Issuer: [paste issuer from IMS Global]
Client ID: rollknow_demo_client_001
Auth URL: [paste authorization URL from IMS Global]
Token URL: [paste token URL from IMS Global]
Keyset URL: [paste JWKS URL from IMS Global]
```

6. ✅ Check **Is active**
7. Click **Save**
8. **Copy the UUID** from the URL (e.g., `c8048656-39ca-4044-b138-059fd723327e`)

### 3B. Create LTI Deployment

1. Still in Django admin, go to: **LTI Tool** → **Lti Deployments**
2. Click **Add Lti Deployment**
3. Fill in:

```
Registration: [Select "IMS Global LTI-RI" from dropdown]
Deployment ID: [paste deployment ID from IMS Global]
```

4. ✅ Check **Is active**
5. Click **Save**

---

## Step 4: Update IMS Global with OIDC Login URL

### Important! Add the Registration UUID

IMS Global also needs to know your **OIDC Login URL**.

Go back to IMS Global and add this URL:

```
OIDC Login URL: https://zora-preterminal-juliane.ngrok-free.dev/init/YOUR-REGISTRATION-UUID/
```

**Replace `YOUR-REGISTRATION-UUID`** with the UUID you copied from Step 3A.

Example:
```
https://zora-preterminal-juliane.ngrok-free.dev/init/c8048656-39ca-4044-b138-059fd723327e/
```

You may also need to add:

```
Launch URL: https://zora-preterminal-juliane.ngrok-free.dev/api/lti/launch/
Redirect URL: https://zora-preterminal-juliane.ngrok-free.dev/api/lti/launch/
```

---

## Step 5: Test the Launch!

1. In IMS Global, find your registered tool
2. Click **"Launch"** or **"Test"**
3. Watch the flow:
   - IMS Global → Your Django OIDC Login
   - Your Django → IMS Global Authorization
   - IMS Global → Your Django Launch
   - Your Django → **Google.com** ✅

**Success!** If Google loads, your LTI implementation is compliant!

---

## Troubleshooting

### Error: "Could not find registration details"

**Check:**
1. Django admin registration has correct **Issuer**
2. Django admin deployment has correct **Deployment ID**
3. Both are marked **Active**

### Error: "State not found"

**Check:**
1. Using HTTPS (ngrok) - not HTTP localhost
2. Cookies are enabled in browser
3. Django server is running

### Error: "Invalid JWT signature"

**Check:**
1. JWKS URL is accessible: `curl https://zora-preterminal-juliane.ngrok-free.dev/.well-known/jwks.json`
2. Should return JSON with public keys
3. IMS Global can access your ngrok URL (not blocked by firewall)

### Error: "The token is not yet valid (iat)"

Your JWT leeway should handle this automatically. If not, check your `LTI_JWT_LEEWAY` setting in `core/settings/base.py`.

---

## After Success

Once testing is complete, remember to:

1. **Revert the Google redirect** in `views.py`:
   ```python
   # Comment out:
   # return redirect('https://www.google.com')

   # Uncomment:
   frontend_url = getattr(settings, 'LTI_FRONTEND_URL', '/')
   return redirect(frontend_url)
   ```

2. **You can now claim LTI 1.3 compliance!** ✅

---

## Quick Reference

### Your URLs (for IMS Global)

```
Base URL: https://zora-preterminal-juliane.ngrok-free.dev
OIDC Login: https://zora-preterminal-juliane.ngrok-free.dev/init/{UUID}/
Launch URL: https://zora-preterminal-juliane.ngrok-free.dev/api/lti/launch/
JWKS URL: https://zora-preterminal-juliane.ngrok-free.dev/.well-known/jwks.json
Admin: https://zora-preterminal-juliane.ngrok-free.dev/admin/
```

### Django Settings

```python
# core/settings/base.py
LTI_JWT_LEEWAY = 300  # 5 minutes tolerance
```

### Test Redirect

```python
# apps/learning_tools_interoperability/views.py
return redirect('https://www.google.com')  # TESTING ONLY
```

Good luck! 🚀
