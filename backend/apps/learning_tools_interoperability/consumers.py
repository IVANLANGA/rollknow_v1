"""
Django Channels WebSocket Consumers for Real-time Dice Rolling

Provides WebSocket functionality for:
- Live dice rolling sessions
- Real-time roll broadcasting
- Session management
"""
import json
import random
import jwt
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.conf import settings


class RollSessionConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for dice rolling sessions.

    Handles:
    - Authentication via JWT token
    - Joining/leaving roll session groups
    - Broadcasting dice rolls to all participants
    - Saving rolls to database
    """

    async def connect(self):
        """
        Handle WebSocket connection.

        Validates JWT token and joins session group.
        """
        self.session_id = self.scope['url_route']['kwargs']['session_id']
        self.session_group_name = f'roll_session_{self.session_id}'

        # Authenticate user from query string token
        query_string = self.scope.get('query_string', b'').decode()
        token = None

        # Parse query string for token
        for param in query_string.split('&'):
            if '=' in param:
                key, value = param.split('=', 1)
                if key == 'token':
                    token = value
                    break

        if not token:
            await self.close(code=4001)
            return

        # Validate token and get user
        user, context = await self.authenticate_token(token)

        if not user or not context:
            await self.close(code=4002)
            return

        # Store in scope
        self.user = user
        self.context = context

        # Verify session exists and belongs to context
        session_valid = await self.verify_session()
        if not session_valid:
            await self.close(code=4003)
            return

        # Get or create student profile
        self.profile = await self.get_or_create_profile()

        # Join session group
        await self.channel_layer.group_add(
            self.session_group_name,
            self.channel_name
        )

        await self.accept()

        # Send welcome message
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to roll session',
            'session_id': self.session_id
        }))

    async def disconnect(self, close_code):
        """
        Handle WebSocket disconnection.

        Leaves the session group.
        """
        if hasattr(self, 'session_group_name'):
            await self.channel_layer.group_discard(
                self.session_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        """
        Handle incoming WebSocket messages.

        Expected message format:
        {
            "action": "roll",
            "challenge_id": <int>
        }
        """
        try:
            data = json.loads(text_data)
            action = data.get('action')

            if action == 'roll':
                await self.handle_roll(data)
            else:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': f'Unknown action: {action}'
                }))

        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON'
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': str(e)
            }))

    async def handle_roll(self, data):
        """
        Handle a dice roll request.

        Generates random roll, saves to database, and broadcasts to group.
        """
        challenge_id = data.get('challenge_id')

        if not challenge_id:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'challenge_id is required'
            }))
            return

        # Verify challenge exists and is active
        challenge = await self.get_challenge(challenge_id)
        if not challenge:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Challenge not found or inactive'
            }))
            return

        # Generate roll (d20)
        roll_value = random.randint(1, 20)

        # Save to database
        dice_roll = await self.save_roll(challenge_id, roll_value)

        if not dice_roll:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Failed to save roll'
            }))
            return

        # Broadcast to group
        await self.channel_layer.group_send(
            self.session_group_name,
            {
                'type': 'roll_broadcast',
                'roll_id': dice_roll['id'],
                'student_name': dice_roll['student_name'],
                'challenge_title': dice_roll['challenge_title'],
                'roll_value': roll_value,
                'timestamp': dice_roll['timestamp']
            }
        )

    async def roll_broadcast(self, event):
        """
        Send roll broadcast to WebSocket client.

        Called when a roll is broadcast to the group.
        """
        await self.send(text_data=json.dumps({
            'type': 'roll',
            'roll_id': event['roll_id'],
            'student_name': event['student_name'],
            'challenge_title': event['challenge_title'],
            'roll_value': event['roll_value'],
            'timestamp': event['timestamp']
        }))

    @database_sync_to_async
    def authenticate_token(self, token):
        """
        Authenticate JWT token and return user and context.

        Returns:
            tuple: (LtiUser, LtiContext) or (None, None) if invalid
        """
        try:
            from lti_tool.models import LtiUser, LtiContext

            secret_key = getattr(settings, 'JWT_SECRET_KEY', settings.SECRET_KEY)
            payload = jwt.decode(token, secret_key, algorithms=['HS256'])

            user_id = payload.get('user_id')
            context_id = payload.get('context_id')

            if not user_id or not context_id:
                return None, None

            user = LtiUser.objects.get(id=user_id)
            context = LtiContext.objects.get(id=context_id)

            return user, context

        except (jwt.InvalidTokenError, LtiUser.DoesNotExist, LtiContext.DoesNotExist):
            return None, None

    @database_sync_to_async
    def verify_session(self):
        """
        Verify that the roll session exists and belongs to the user's context.

        Returns:
            bool: True if valid, False otherwise
        """
        from .models import RollSession

        return RollSession.objects.filter(
            id=self.session_id,
            context=self.context,
            status=RollSession.STATUS_ACTIVE
        ).exists()

    @database_sync_to_async
    def get_or_create_profile(self):
        """
        Get or create student profile for the user.

        Returns:
            StudentProfile: The user's profile
        """
        from .models import StudentProfile

        profile, created = StudentProfile.objects.get_or_create(
            lti_user=self.user,
            context=self.context,
            defaults={'xp': 0, 'level': 1}
        )
        return profile

    @database_sync_to_async
    def get_challenge(self, challenge_id):
        """
        Get challenge by ID if it exists and is active.

        Returns:
            Challenge or None
        """
        from .models import Challenge

        try:
            return Challenge.objects.get(
                id=challenge_id,
                context=self.context,
                is_active=True
            )
        except Challenge.DoesNotExist:
            return None

    @database_sync_to_async
    def save_roll(self, challenge_id, roll_value):
        """
        Save dice roll to database.

        Returns:
            dict: Roll data with id, student_name, challenge_title, timestamp
        """
        from .models import DiceRoll, RollSession

        try:
            session = RollSession.objects.get(id=self.session_id)
            challenge = self.context.challenges.get(id=challenge_id)

            dice_roll = DiceRoll.objects.create(
                session=session,
                profile=self.profile,
                challenge=challenge,
                roll_value=roll_value
            )

            return {
                'id': dice_roll.id,
                'student_name': self.user.name,
                'challenge_title': challenge.title,
                'timestamp': dice_roll.rolled_at.isoformat()
            }

        except Exception:
            return None
