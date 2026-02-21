# RollKnow LTI 1.3 Integration Guide for LMS Administrators

This guide provides step-by-step instructions for integrating RollKnow with your Learning Management System (LMS) using the LTI 1.3 (Learning Tools Interoperability) standard.

## Table of Contents

- [Introduction](#introduction)
- [What is LTI 1.3?](#what-is-lti-13)
- [Prerequisites](#prerequisites)
- [Integration Overview](#integration-overview)
- [Step 1: Obtain RollKnow Tool Configuration](#step-1-obtain-rollknow-tool-configuration)
- [Step 2: Register RollKnow in Your LMS](#step-2-register-rollknow-in-your-lms)
  - [Sakai LMS](#sakai-lms)
  - [Canvas LMS](#canvas-lms)
  - [Moodle](#moodle)
  - [Blackboard Learn](#blackboard-learn)
  - [D2L Brightspace](#d2l-brightspace)
- [Step 3: Activate the Deployment](#step-3-activate-the-deployment)
- [Step 4: Add RollKnow to Courses](#step-4-add-rollknow-to-courses)
- [Step 5: Test the Integration](#step-5-test-the-integration)
- [Troubleshooting](#troubleshooting)
- [Security & Privacy](#security--privacy)
- [Support](#support)

---

## Introduction

RollKnow is a learning analytics and assessment tool that integrates seamlessly with your LMS through the LTI 1.3 standard. This integration allows students and instructors to access RollKnow directly from within your LMS courses without requiring separate logins.

## What is LTI 1.3?

**LTI (Learning Tools Interoperability)** is an industry-standard protocol developed by IMS Global Learning Consortium that allows secure integration between learning platforms and external tools.

**LTI 1.3** is the latest version, which uses:
- **OpenID Connect (OIDC)** for authentication
- **JSON Web Tokens (JWT)** for secure message passing
- **OAuth 2.0** for authorization

**Benefits:**
- Single Sign-On (SSO) - Students don't need separate passwords
- Automatic roster synchronization
- Grade passback to your LMS gradebook
- Secure, encrypted communication

---

## Prerequisites

Before you begin, ensure you have:

1. **LMS Administrator Access** - Permissions to install external tools
2. **HTTPS Access** - Your LMS must be accessible via HTTPS (required for LTI 1.3)
3. **RollKnow Account** - Contact RollKnow support to obtain your institutional account
4. **Tool Configuration Details** - You'll receive these from RollKnow

### Information You'll Need from RollKnow

RollKnow support will provide you with:

- **Tool URL (Launch URL)**: `https://rollknow.co.za/api/lti/launch/`
- **OIDC Login URL**: `https://rollknow.co.za/init/<your-registration-uuid>/`
- **Public JWK Set URL**: `https://rollknow.co.za/.well-known/jwks.json`
- **Registration UUID**: A unique identifier for your institution

---

## Integration Overview

The LTI 1.3 integration process involves these main steps:

```
1. Obtain configuration details from RollKnow
   ↓
2. Register RollKnow as an external tool in your LMS
   ↓
3. Activate the deployment in RollKnow
   ↓
4. Add RollKnow to your courses
   ↓
5. Test the integration
```

**Estimated Time:** 15-30 minutes

---

## Step 1: Obtain RollKnow Tool Configuration

**Action Required:** Contact RollKnow support to set up your institutional account.

**Contact Information:**
- Email: support@rollknow.co.za
- Web: https://rollknow.co.za/contact

**What to Provide:**
- Institution name
- LMS platform and version (e.g., "Sakai 23", "Canvas Cloud")
- Technical contact email
- Estimated number of users

**What You'll Receive:**

```
Tool Configuration:
├── Tool URL (Launch URL): https://rollknow.co.za/api/lti/launch/
├── OIDC Login URL: https://rollknow.co.za/init/<uuid>/
├── Public JWK Set URL: https://rollknow.co.za/.well-known/jwks.json
├── Registration UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
└── Redirect URLs: https://rollknow.co.za/api/lti/launch/
```

**Keep this information secure and readily available for the next steps.**

---

## Step 2: Register RollKnow in Your LMS

Choose your LMS platform from the options below:

### Sakai LMS

#### 2.1 Access External Tools Administration

1. Log in to Sakai as an administrator
2. Navigate to **Administration Workspace**
3. Click on **External Tools** (or **LTI Admin**)
4. Click **Install LTI 1.3 Tool**

#### 2.2 Configure the Tool Registration

Fill in the following fields:

| Field | Value |
|-------|-------|
| **Tool Name** | `RollKnow` |
| **Description** | `Learning analytics and assessment tool` |
| **Client ID** | *(Leave blank - Sakai will generate this)* |
| **OpenID Connect/Initialization Endpoint** | `https://rollknow.co.za/init/<your-uuid>/` |
| **Tool Redirect Endpoint(s)** | `https://rollknow.co.za/api/lti/launch/` |
| **Tool JWK Set URL** | `https://rollknow.co.za/.well-known/jwks.json` |

**Advanced Settings (if available):**

| Field | Value |
|-------|-------|
| **LTI Version** | `LTI 1.3` |
| **Site Visibility** | `Visible to all sites` or `Selected sites` |
| **Privacy Settings** | Enable: Send Names, Send Email Addresses |
| **Services** | Enable: Assignment and Grade Services, Names and Role Provisioning |

#### 2.3 Save and Note the Client ID

1. Click **Save** or **Register Tool**
2. Sakai will generate a **Client ID** (e.g., `4d3c7e9e-99e8-4482-b4a9-cd7f77ee9f2c`)
3. **Important:** Copy this Client ID - you'll need to provide it to RollKnow support

#### 2.4 Obtain Sakai Platform Configuration

You'll need to provide the following to RollKnow:

| Information | Where to Find It |
|-------------|------------------|
| **Platform Issuer URL** | Your Sakai base URL (e.g., `https://sakai.university.edu`) |
| **Platform Authorization Endpoint** | `https://sakai.university.edu/imsoidc/lti13/oidc_auth` |
| **Platform Token Endpoint** | `https://sakai.university.edu/imsoidc/lti13/token/<your-client-id>` |
| **Platform JWK Set URL** | `https://sakai.university.edu/imsoidc/lti13/jwks` |
| **Client ID** | *(The one generated in step 2.3)* |
| **Deployment ID** | Usually `1` (check in External Tools list) |

**Send this information to RollKnow support.**

---

### Canvas LMS

#### 2.1 Access Developer Keys

1. Log in to Canvas as an administrator
2. Navigate to **Admin** → **Developer Keys**
3. Click **+ Developer Key** → **+ LTI Key**

#### 2.2 Configure the Developer Key

**Method 1: JSON Configuration (Recommended)**

1. Select **Enter URL** or **Paste JSON**
2. If your Canvas version supports it, you can request a JSON configuration file from RollKnow
3. Paste the JSON and click **Save**

**Method 2: Manual Configuration**

Fill in these fields:

| Field | Value |
|-------|-------|
| **Key Name** | `RollKnow` |
| **Owner Email** | Your technical contact email |
| **Redirect URIs** | `https://rollknow.co.za/api/lti/launch/` |
| **Method** | `Manual Entry` |
| **Title** | `RollKnow` |
| **Description** | `Learning analytics and assessment tool` |
| **Target Link URI** | `https://rollknow.co.za/api/lti/launch/` |
| **OpenID Connect Initiation Url** | `https://rollknow.co.za/init/<your-uuid>/` |
| **JWK Method** | `Public JWK URL` |
| **Public JWK URL** | `https://rollknow.co.za/.well-known/jwks.json` |

**LTI Advantage Services:**
- ✅ Can create and view assignment data in the gradebook
- ✅ Can view assignment data in the gradebook
- ✅ Can retrieve user data associated with the context
- ✅ Can view names and role information

**Placements:**
- ✅ Course Navigation
- ✅ Assignment Selection

#### 2.3 Enable the Developer Key

1. After saving, the key will appear in the **Developer Keys** list
2. Change the state from **Off** to **On**
3. Copy the **Client ID** (numeric value)

#### 2.4 Install the Tool in Your Account

1. Navigate to **Admin** → **Settings**
2. Click the **Apps** tab
3. Click **+ App**
4. Select **By Client ID**
5. Paste the Client ID from step 2.3
6. Click **Submit**

#### 2.5 Provide Configuration to RollKnow

Send the following to RollKnow support:

- **Client ID** (from Developer Key)
- **Canvas Platform Issuer**: `https://canvas.instructure.com` (for Canvas Cloud) or your institution's Canvas URL
- **Deployment ID**: Found in the app configuration after installation

---

### Moodle

#### 2.1 Access External Tool Configuration

1. Log in to Moodle as an administrator
2. Navigate to **Site Administration** → **Plugins** → **Activity modules** → **External tool**
3. Click **Manage tools**
4. Click **Configure a tool manually**

#### 2.2 Configure the Tool

| Field | Value |
|-------|-------|
| **Tool name** | `RollKnow` |
| **Tool URL** | `https://rollknow.co.za/api/lti/launch/` |
| **LTI version** | `LTI 1.3` |
| **Public key type** | `Keyset URL` |
| **Public keyset** | `https://rollknow.co.za/.well-known/jwks.json` |
| **Initiate login URL** | `https://rollknow.co.za/init/<your-uuid>/` |
| **Redirection URI(s)** | `https://rollknow.co.za/api/lti/launch/` |

**Default launch container:** `New window` or `Embed`

**Services:**
- ✅ IMS LTI Assignment and Grade Services
- ✅ IMS LTI Names and Role Provisioning
- ✅ Tool Settings

**Privacy:**
- ✅ Share launcher's name with tool
- ✅ Share launcher's email with tool

#### 2.3 Save and View Tool Details

1. Click **Save changes**
2. Click **View configurations** for the RollKnow tool
3. Note the following details:

| Information | Location |
|-------------|----------|
| **Platform ID** | Shown in tool details |
| **Client ID** | Shown in tool details |
| **Deployment ID** | Shown in tool details |
| **Public keyset URL** | `https://your-moodle.edu/mod/lti/certs.php` |
| **Access token URL** | `https://your-moodle.edu/mod/lti/token.php` |
| **Authentication request URL** | `https://your-moodle.edu/mod/lti/auth.php` |

**Send this information to RollKnow support.**

---

### Blackboard Learn

#### 2.1 Access LTI Tool Providers

1. Log in to Blackboard Learn as an administrator
2. Navigate to **System Admin** → **Integrations** → **LTI Tool Providers**
3. Click **Register LTI 1.3 Tool**

#### 2.2 Configure the Tool Provider

| Field | Value |
|-------|-------|
| **Client ID** | *(Blackboard will generate this)* |
| **Tool Status** | `Approved` |
| **Tool Name** | `RollKnow` |
| **Description** | `Learning analytics and assessment tool` |
| **Provider Domain** | `rollknow.co.za` |
| **Tool Provider URL** | `https://rollknow.co.za/api/lti/launch/` |
| **Tool Provider Custom Parameters** | *(Leave blank unless specified by RollKnow)* |

**OpenID Connect Configuration:**
- **Login Initiation URL**: `https://rollknow.co.za/init/<your-uuid>/`
- **Tool Redirect URL(s)**: `https://rollknow.co.za/api/lti/launch/`
- **Tool Keyset URL**: `https://rollknow.co.za/.well-known/jwks.json`

**Institution Policies:**
- ✅ Send User Data (Role in Course, Name, Email Address)
- ✅ Allow Membership Service Access
- ✅ Allow Grade Service Access

#### 2.3 Save and Note Configuration Details

1. Click **Submit**
2. Note the **Client ID** generated by Blackboard
3. Access **Blackboard Platform Information** (usually in System Admin → Integrations)

**Send the following to RollKnow support:**
- Client ID
- Issuer URL (e.g., `https://blackboard.university.edu`)
- Authorization Endpoint
- Token Endpoint
- JWK Set URL

---

### D2L Brightspace

#### 2.1 Access External Learning Tools

1. Log in to D2L Brightspace as an administrator
2. Navigate to **Admin Tools** (gear icon in the top right)
3. Select **Manage Extensibility** under **Organization Related**
4. Click **LTI Advantage** tab
5. Click **Register Tool**

#### 2.2 Configure the Tool Registration

**Method 1: Standard Registration (Recommended)**

| Field | Value |
|-------|-------|
| **Name** | `RollKnow` |
| **Description** | `Learning analytics and assessment tool` |
| **Domain** | `rollknow.co.za` |
| **Redirect URLs** | `https://rollknow.co.za/api/lti/launch/` |
| **OpenID Connect Login URL** | `https://rollknow.co.za/init/<your-uuid>/` |
| **Target Link URL** | `https://rollknow.co.za/api/lti/launch/` |
| **Keyset URL** | `https://rollknow.co.za/.well-known/jwks.json` |

**Extensions:**
- ✅ Assignment and Grade Services
- ✅ Names and Role Provisioning Services

**Security Settings:**
- ✅ Send user name
- ✅ Send user email
- ✅ Send org defined ID
- ✅ Send role

**Method 2: Dynamic Registration (If Supported)**

1. Select **Dynamic Registration**
2. Enter the registration URL provided by RollKnow support
3. D2L will automatically configure the tool

#### 2.3 Configure Deployment

After registering the tool:

1. Click **Deployments** tab for the RollKnow tool
2. Click **Create Deployment**
3. Configure the deployment:

| Field | Value |
|-------|-------|
| **Name** | `RollKnow - Institution Name` |
| **Organization Unit** | Select your institution (typically the root org) |
| **Security** | Default settings |

**Tool Settings:**
- ✅ Allow tool to access names and roles
- ✅ Allow tool to submit grades
- ✅ Send system username
- ✅ Send org defined ID

**Link Settings:**
- ✅ Enable custom parameters (if needed)
- Launch Point: `Quicklink` and/or `Content`

#### 2.4 Obtain D2L Platform Configuration

After registration and deployment, gather the following information:

| Information | Where to Find It |
|-------------|------------------|
| **Issuer/Platform ID** | Shown in tool registration details |
| **Client ID** | Shown in tool registration details |
| **Deployment ID** | Shown in deployment details |
| **Brightspace Instance URL** | Your D2L URL (e.g., `https://university.brightspace.com`) |
| **Authorization Endpoint** | `https://your-instance.brightspace.com/d2l/lti/authenticate` |
| **Token Endpoint** | `https://your-instance.brightspace.com/d2l/lti/token` |
| **JWKS Endpoint** | `https://your-instance.brightspace.com/d2l/.well-known/jwks` |

#### 2.5 Enable Tool Access

1. Navigate back to **Manage Extensibility**
2. Ensure RollKnow tool status is **Enabled**
3. Under **Org Unit Access**, configure which org units can use the tool:
   - Select **All Org Units** for institution-wide access
   - Or select specific departments/courses

**Send all configuration details to RollKnow support.**

---

## Step 3: Activate the Deployment

After registering RollKnow in your LMS:

1. **Send Configuration Details to RollKnow Support**
   - Include all the information from Step 2.4 (Platform URLs, Client ID, Deployment ID)
   - RollKnow will register your LMS platform in their system

2. **Wait for Activation Confirmation**
   - RollKnow support will activate your deployment
   - You'll receive confirmation via email (typically within 24 hours)

3. **Deployment Status**
   - Once activated, instructors can add RollKnow to their courses
   - If you test before activation, you'll see: "This deployment is not active"

---

## Step 4: Add RollKnow to Courses

After deployment activation, instructors can add RollKnow to their courses:

### Sakai

1. Go to your course site
2. Click **Site Info** → **Manage Tools**
3. Check **RollKnow** (or **External Tool** if configured that way)
4. Click **Continue** → **Finish**
5. RollKnow will appear in your course navigation

### Canvas

1. Go to your course
2. Click **Settings** → **Apps**
3. Click **+ App** → **RollKnow**
4. Or add via **Modules**: Add → External Tool → RollKnow

### Moodle

1. Turn editing on in your course
2. Click **Add an activity or resource**
3. Select **External tool**
4. Choose **RollKnow** from the preconfigured tools
5. Click **Add**

### Blackboard Learn

1. Go to your course
2. Navigate to **Content** area
3. Click **Build Content** → **LTI Tool**
4. Select **RollKnow**
5. Click **Submit**

### D2L Brightspace

**Method 1: Add as Course Link (Recommended)**

1. Go to your course
2. Click **Edit Course** (gear icon)
3. Navigate to **Course Tools** or **External Learning Tools**
4. Click **New Link**
5. Select **Existing Tool** → **RollKnow**
6. Configure:
   - **Name**: `RollKnow`
   - **Visible in Navigation**: ✅ Checked
7. Click **Save and Close**
8. RollKnow will appear in your course navigation bar

**Method 2: Add as Content Item**

1. Go to your course
2. Navigate to **Content** → select a module
3. Click **Existing Activities** → **External Learning Tools**
4. Select **RollKnow**
5. Click **Insert**

**Method 3: Add via Quicklink**

1. Go to your course
2. Click **Insert Quicklink** (+ icon in navbar)
3. Select **External Learning Tools** → **RollKnow**
4. Click **Insert**

---

## Step 5: Test the Integration

### Initial Test Checklist

1. **Test as Instructor**
   - Add RollKnow to a test course
   - Click the RollKnow link
   - Verify you're redirected to RollKnow without being asked to log in again
   - Check that your name and email are displayed correctly

2. **Test as Student**
   - Log in as a test student (or ask a colleague)
   - Access the test course
   - Click the RollKnow link
   - Verify seamless access

3. **Verify Data Synchronization**
   - Check that the course roster appears in RollKnow
   - Verify user roles are correct (Instructor vs. Student)
   - Test creating an assignment and posting grades (if applicable)

### Expected Behavior

✅ **Successful Launch:**
- User clicks RollKnow link in LMS
- Redirected to RollKnow automatically
- RollKnow displays without requiring separate login
- User sees their course context

❌ **Common Issues to Check:**
- "Deployment is not active" → Wait for RollKnow to activate deployment
- "State not found" → Cookie/HTTPS issue (contact RollKnow support)
- "Unauthorized" → Client ID mismatch (verify configuration)

---

## Troubleshooting

### Issue: "This deployment is not active"

**Cause:** RollKnow hasn't activated your deployment yet

**Solution:**
1. Verify you sent the platform configuration to RollKnow support
2. Contact RollKnow support if you haven't received activation confirmation
3. Check that the Client ID you provided matches the one in your LMS

---

### Issue: Users see "Authentication failed" or "Unauthorized"

**Cause:** Client ID or configuration mismatch

**Solution:**
1. Verify the Client ID in your LMS matches what you sent to RollKnow
2. Check that all URLs are correct (no typos, correct HTTPS)
3. Ensure the Registration UUID in the OIDC Login URL is correct
4. Contact RollKnow support with error details

---

### Issue: Cookies or session errors

**Cause:** Browser cookie restrictions or HTTPS issues

**Solution:**
1. **Verify HTTPS:** Both your LMS and RollKnow must use HTTPS
2. **Browser Settings:** Ensure third-party cookies are enabled
3. **LMS Configuration:** Check that your LMS cookie settings allow cross-origin cookies with SameSite=None
4. **Test Different Browsers:** Try Chrome, Firefox, or Edge

---

### Issue: User information not appearing in RollKnow

**Cause:** Privacy settings in LMS

**Solution:**
1. In your LMS tool configuration, ensure:
   - "Send user names" is enabled
   - "Send email addresses" is enabled
2. Check that privacy policies allow sharing user data with external tools
3. Re-save the tool configuration

---

### Issue: Grades not syncing back to LMS

**Cause:** Assignment and Grade Services not enabled

**Solution:**
1. In your LMS tool configuration, enable:
   - "Assignment and Grade Services" (LTI-AGS)
   - "Can create and view assignment data"
2. Verify the tool has permission to access the gradebook
3. Re-test grade submission

---

### Getting Help

If you encounter issues not covered here:

1. **Check LMS Logs:**
   - Most LMS platforms have external tool integration logs
   - Look for error messages related to RollKnow or LTI

2. **Gather Information:**
   - Screenshot of error message
   - Browser and version
   - LMS platform and version
   - Steps to reproduce the issue

3. **Contact Support:**
   - **RollKnow Support:** support@rollknow.co.za
   - **Your LMS Support:** Consult your LMS vendor documentation

---

## Security & Privacy

### Data Shared with RollKnow

RollKnow receives the following information via LTI:

**User Information:**
- User ID (anonymized LMS identifier)
- Full name
- Email address
- Role (Instructor, Student, TA, etc.)

**Course Information:**
- Course ID
- Course name
- Course code

**Launch Context:**
- Resource link information
- Timestamp

### Security Measures

**LTI 1.3 Security Features:**
- ✅ OAuth 2.0 authentication
- ✅ JWT signature verification
- ✅ Time-limited tokens (expire after 1 hour)
- ✅ State and nonce validation (prevents replay attacks)
- ✅ HTTPS encryption (all communication encrypted)

**RollKnow Security:**
- All data stored in encrypted databases
- SOC 2 Type II compliant
- GDPR and FERPA compliant
- Regular security audits

### Privacy Compliance

RollKnow is compliant with:
- **FERPA** (Family Educational Rights and Privacy Act)
- **GDPR** (General Data Protection Regulation)
- **COPPA** (Children's Online Privacy Protection Act)

**Data Retention:**
- User data retained only while actively using the service
- Data deletion available upon request
- Export your data at any time

---

## Frequently Asked Questions

### Do students need to create RollKnow accounts?

**No.** Students access RollKnow through single sign-on (SSO) via your LMS. They use their existing LMS credentials.

### Can instructors use RollKnow without LTI integration?

**Yes,** but LTI integration provides a much better experience with automatic roster sync and grade passback.

### What happens if a student is added to a course after initial sync?

The roster syncs automatically every time a user launches RollKnow from the LMS. New students will be added on their first access.

### Can we use RollKnow in multiple courses?

**Yes.** Once configured at the institution level, any instructor can add RollKnow to their courses.

### What LMS versions are supported?

**Sakai:** 20.x and higher
**Canvas:** Cloud and self-hosted
**Moodle:** 3.9 and higher
**Blackboard Learn:** 3900.0.0 and higher
**D2L Brightspace:** 10.8.0 and higher (all cloud instances supported)

### Is there a cost for LTI integration?

Contact RollKnow sales for institutional pricing: sales@rollknow.co.za

---

## Support

### RollKnow Support

- **Email:** support@rollknow.co.za
- **Phone:** +27 XX XXX XXXX
- **Documentation:** https://docs.rollknow.co.za
- **Status Page:** https://status.rollknow.co.za

**Support Hours:**
- Monday - Friday: 8:00 AM - 6:00 PM SAST
- Emergency support: Available 24/7 for critical issues

### Additional Resources

- **LTI 1.3 Specification:** https://www.imsglobal.org/spec/lti/v1p3/
- **IMS Global:** https://www.imsglobal.org/
- **Video Tutorial:** *(Request from RollKnow support)*

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2025-12-13 | 1.0 | Initial release |

---

**Document maintained by:** RollKnow Technical Team
**Last updated:** December 13, 2025
**Next review:** March 2026

---

## Appendix: Technical Details

### LTI 1.3 Endpoints

| Endpoint | URL | Purpose |
|----------|-----|---------|
| **OIDC Login** | `https://rollknow.co.za/init/<uuid>/` | Initiates authentication flow |
| **Launch** | `https://rollknow.co.za/api/lti/launch/` | Receives authenticated launch requests |
| **JWK Set** | `https://rollknow.co.za/.well-known/jwks.json` | Public keys for JWT verification |

### Required LTI Claims

RollKnow requires these standard LTI 1.3 claims:

```json
{
  "iss": "Platform issuer URL",
  "aud": "Client ID",
  "sub": "User identifier",
  "https://purl.imsglobal.org/spec/lti/claim/deployment_id": "Deployment ID",
  "https://purl.imsglobal.org/spec/lti/claim/message_type": "LtiResourceLinkRequest",
  "https://purl.imsglobal.org/spec/lti/claim/version": "1.3.0",
  "https://purl.imsglobal.org/spec/lti/claim/roles": ["Instructor or Learner"],
  "https://purl.imsglobal.org/spec/lti/claim/context": {...},
  "https://purl.imsglobal.org/spec/lti/claim/resource_link": {...}
}
```

### Platform-Specific Notes

**Sakai:**
- May not send `client_id` in OIDC init (RollKnow handles this automatically)
- May not send `guid` in platform claim (RollKnow uses issuer as fallback)

**Canvas:**
- Fully standards-compliant
- Supports JSON configuration import

**Moodle:**
- Ensure External Tool activity module is enabled
- Some versions require manual keyset configuration

**Blackboard:**
- Ultra and Original Experience both supported
- May require administrator approval workflow

**D2L Brightspace:**
- Fully standards-compliant with LTI 1.3
- Supports both standard and dynamic registration
- Deployment must be configured at organization unit level
- Excellent support for LTI Advantage services (AGS, NRPS)
- Recommend using Quicklink placement for best user experience

---

**Thank you for choosing RollKnow!**

For questions or assistance with this integration guide, please contact our support team.
