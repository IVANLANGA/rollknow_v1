"""
LTI 1.3 URL Configuration

Defines the URL patterns for LTI 1.3 endpoints and gamification API.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views
from . import api_views

app_name = 'learning_tools_interoperability'

# DRF Router for API endpoints
router = DefaultRouter()
router.register(r'profiles', api_views.StudentProfileViewSet, basename='profile')
router.register(r'challenges', api_views.ChallengeViewSet, basename='challenge')
router.register(r'submissions', api_views.SubmissionViewSet, basename='submission')
router.register(r'sessions', api_views.RollSessionViewSet, basename='session')

urlpatterns = [
    # LTI Launch endpoint - receives the authentication response
    path('launch/', views.LtiLaunchView.as_view(), name='launch'),

    # Gamification API endpoints
    path('api/', include(router.urls)),
]
