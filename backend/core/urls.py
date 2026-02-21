"""
Root URL Configuration

Defines the main URL routing for the LTI tool application.
"""
from django.contrib import admin
from django.urls import path, include
from lti_tool.views import jwks
from apps.learning_tools_interoperability.views import OIDCLoginView

urlpatterns = [
    # JWKS endpoint - provides public keys for JWT validation
    path('.well-known/jwks.json', jwks, name='jwks'),

    # OIDC Login Initiation endpoints
    path('init/', OIDCLoginView.as_view(), name='oidc-login'),
    path('init/<uuid:registration_uuid>/', OIDCLoginView.as_view(), name='oidc-login-with-uuid'),

    # Django admin
    path('admin/', admin.site.urls),

    # LTI application endpoints
    path('api/lti/', include('apps.learning_tools_interoperability.urls', namespace='learning_tools_interoperability')),
]
