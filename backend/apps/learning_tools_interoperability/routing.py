"""
WebSocket URL routing for Channels

Defines WebSocket URL patterns for:
- Roll session connections
"""
from django.urls import re_path
from .consumers import RollSessionConsumer


websocket_urlpatterns = [
    re_path(r'ws/session/(?P<session_id>\d+)/$', RollSessionConsumer.as_asgi()),
]
