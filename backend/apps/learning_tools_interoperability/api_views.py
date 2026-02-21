"""
Django REST Framework ViewSets for Gamification API

Provides REST API endpoints for:
- Student profiles
- Challenges
- Challenge submissions
- Roll sessions
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import StudentProfile, Challenge, ChallengeSubmission, RollSession, DiceRoll
from .serializers import (
    StudentProfileSerializer,
    ChallengeSerializer,
    ChallengeSubmissionSerializer,
    RollSessionSerializer,
    DiceRollSerializer,
)
from .authentication import JWTAuthentication


class StudentProfileViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for student profiles.

    Provides read-only access to the current user's profile.
    Profile is automatically filtered by authenticated user and context.
    """
    serializer_class = StudentProfileSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return profile for current user and context"""
        if not hasattr(self.request, 'context'):
            return StudentProfile.objects.none()

        return StudentProfile.objects.filter(
            lti_user=self.request.user,
            context=self.request.context
        )

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's profile"""
        profile, created = StudentProfile.objects.get_or_create(
            lti_user=request.user,
            context=request.context,
            defaults={
                'xp': 0,
                'level': 1,
            }
        )
        serializer = self.get_serializer(profile)
        return Response(serializer.data)


class ChallengeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for challenges.

    Provides read-only access to challenges in the current context.
    Students can view and accept challenges.
    """
    serializer_class = ChallengeSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return challenges for current context"""
        if not hasattr(self.request, 'context'):
            return Challenge.objects.none()

        return Challenge.objects.filter(
            context=self.request.context,
            is_active=True
        )

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """
        Accept a challenge (create a submission).

        Creates a new ChallengeSubmission with status ACTIVE.
        """
        challenge = self.get_object()

        # Get or create student profile
        profile, _ = StudentProfile.objects.get_or_create(
            lti_user=request.user,
            context=request.context,
            defaults={'xp': 0, 'level': 1}
        )

        # Check if already accepted
        existing = ChallengeSubmission.objects.filter(
            profile=profile,
            challenge=challenge
        ).first()

        if existing:
            return Response(
                {'error': 'Challenge already accepted'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create submission
        submission = ChallengeSubmission.objects.create(
            profile=profile,
            challenge=challenge,
            status=ChallengeSubmission.STATUS_ACTIVE
        )

        serializer = ChallengeSubmissionSerializer(submission)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SubmissionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for challenge submissions.

    Provides CRUD operations for submissions.
    Students can view their own submissions, submit for review, and add notes.
    Instructors can review and complete submissions.
    """
    serializer_class = ChallengeSubmissionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return submissions for current user and context"""
        if not hasattr(self.request, 'context'):
            return ChallengeSubmission.objects.none()

        # Get student profile
        try:
            profile = StudentProfile.objects.get(
                lti_user=self.request.user,
                context=self.request.context
            )
        except StudentProfile.DoesNotExist:
            return ChallengeSubmission.objects.none()

        return ChallengeSubmission.objects.filter(
            profile=profile
        ).select_related('challenge', 'profile__lti_user', 'reviewer')

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """
        Submit a challenge for review.

        Changes status from ACTIVE to PENDING and sets submitted_at timestamp.
        """
        submission = self.get_object()

        # Validate current status
        if submission.status != ChallengeSubmission.STATUS_ACTIVE:
            return Response(
                {'error': 'Can only submit challenges with ACTIVE status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update status
        submission.status = ChallengeSubmission.STATUS_PENDING
        submission.submitted_at = timezone.now()

        # Update notes if provided
        notes = request.data.get('submission_notes')
        if notes:
            submission.submission_notes = notes

        # Update files if provided
        files = request.data.get('submission_files')
        if files:
            submission.submission_files = files

        submission.save()

        serializer = self.get_serializer(submission)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """
        Complete a submission (instructor only).

        Changes status from PENDING to COMPLETED, awards XP and skill points.
        """
        submission = self.get_object()

        # Validate current status
        if submission.status != ChallengeSubmission.STATUS_PENDING:
            return Response(
                {'error': 'Can only complete submissions with PENDING status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get feedback from request
        feedback = request.data.get('reviewer_feedback', '')

        # Update submission
        submission.status = ChallengeSubmission.STATUS_COMPLETED
        submission.completed_at = timezone.now()
        submission.reviewer = request.user
        submission.reviewer_feedback = feedback
        submission.save()

        # Award XP
        profile = submission.profile
        profile.add_xp(submission.challenge.xp_reward)

        # Award skill points
        skill_tree = submission.challenge.skill_tree
        if skill_tree == Challenge.SKILL_RESEARCH:
            profile.research_points += submission.challenge.skill_points
        elif skill_tree == Challenge.SKILL_COLLABORATION:
            profile.collaboration_points += submission.challenge.skill_points
        elif skill_tree == Challenge.SKILL_CREATION:
            profile.creation_points += submission.challenge.skill_points

        profile.save()

        serializer = self.get_serializer(submission)
        return Response(serializer.data)


class RollSessionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for roll sessions.

    Provides read-only access to roll sessions in the current context.
    Students can view active and upcoming sessions.
    """
    serializer_class = RollSessionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return sessions for current context"""
        if not hasattr(self.request, 'context'):
            return RollSession.objects.none()

        return RollSession.objects.filter(
            context=self.request.context
        ).select_related('instructor')

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get currently active session"""
        session = self.get_queryset().filter(
            status=RollSession.STATUS_ACTIVE
        ).first()

        if not session:
            return Response(
                {'error': 'No active session'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(session)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def rolls(self, request, pk=None):
        """Get all rolls for a session"""
        session = self.get_object()
        rolls = DiceRoll.objects.filter(session=session).select_related(
            'profile__lti_user',
            'challenge'
        )
        serializer = DiceRollSerializer(rolls, many=True)
        return Response(serializer.data)
