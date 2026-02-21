"""
Django REST Framework Serializers for Gamification API

Provides serialization and validation for:
- Student profiles with progression tracking
- Challenges and challenge catalog
- Challenge submissions and reviews
- Roll sessions and dice rolls
"""
from rest_framework import serializers
from .models import StudentProfile, Challenge, ChallengeSubmission, RollSession, DiceRoll


class StudentProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for student profiles with calculated fields.

    Includes progression metrics, skill tree status, and activity streaks.
    """
    # Calculated fields using model properties
    next_level_xp = serializers.IntegerField(source='next_level_xp', read_only=True)
    progress_percentage = serializers.FloatField(source='xp_progress_percentage', read_only=True)

    # Related user information
    lti_user_name = serializers.CharField(source='lti_user.name', read_only=True)
    lti_user_email = serializers.EmailField(source='lti_user.email', read_only=True)
    context_title = serializers.CharField(source='context.title', read_only=True)

    class Meta:
        model = StudentProfile
        fields = [
            'id',
            'lti_user',
            'lti_user_name',
            'lti_user_email',
            'context',
            'context_title',
            'xp',
            'level',
            'next_level_xp',
            'progress_percentage',
            'current_streak',
            'longest_streak',
            'last_activity_date',
            'research_tier',
            'research_points',
            'collaboration_tier',
            'collaboration_points',
            'creation_tier',
            'creation_points',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'lti_user',
            'context',
            'xp',
            'level',
            'created_at',
            'updated_at',
            'last_activity_date',
        ]


class ChallengeListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for challenge lists.

    Excludes heavy fields like objectives and success_criteria.
    """
    rarity_display = serializers.CharField(source='get_rarity_display', read_only=True)
    skill_tree_display = serializers.CharField(source='get_skill_tree_display', read_only=True)
    required_tier_display = serializers.CharField(source='get_required_tier_display', read_only=True)

    class Meta:
        model = Challenge
        fields = [
            'id',
            'title',
            'description',
            'rarity',
            'rarity_display',
            'skill_tree',
            'skill_tree_display',
            'required_tier',
            'required_tier_display',
            'estimated_hours',
            'xp_reward',
            'skill_points',
            'is_active',
            'created_at',
        ]


class ChallengeSerializer(serializers.ModelSerializer):
    """
    Full serializer for challenge details.

    Includes all fields, submission counts, and display values.
    """
    rarity_display = serializers.CharField(source='get_rarity_display', read_only=True)
    skill_tree_display = serializers.CharField(source='get_skill_tree_display', read_only=True)
    required_tier_display = serializers.CharField(source='get_required_tier_display', read_only=True)
    submission_count = serializers.SerializerMethodField()
    user_has_submitted = serializers.SerializerMethodField()

    class Meta:
        model = Challenge
        fields = [
            'id',
            'context',
            'title',
            'description',
            'rarity',
            'rarity_display',
            'skill_tree',
            'skill_tree_display',
            'required_tier',
            'required_tier_display',
            'estimated_hours',
            'xp_reward',
            'skill_points',
            'objectives',
            'success_criteria',
            'created_at',
            'is_active',
            'submission_count',
            'user_has_submitted',
        ]
        read_only_fields = ['id', 'context', 'created_at', 'submission_count']

    def get_submission_count(self, obj):
        """Get total number of submissions for this challenge"""
        # Use annotate in viewset for better performance
        if hasattr(obj, 'submission_count_annotated'):
            return obj.submission_count_annotated
        return obj.submissions.count()

    def get_user_has_submitted(self, obj):
        """Check if current user has a submission for this challenge"""
        request = self.context.get('request')
        if not request or not hasattr(request, 'user'):
            return False

        # Try to get from prefetched data first
        if hasattr(obj, 'user_submissions'):
            return len(obj.user_submissions) > 0

        # Fallback to query
        try:
            profile = StudentProfile.objects.get(
                lti_user=request.user,
                context=obj.context
            )
            return obj.submissions.filter(profile=profile).exists()
        except StudentProfile.DoesNotExist:
            return False


class ChallengeSubmissionSerializer(serializers.ModelSerializer):
    """
    Serializer for challenge submissions.

    Includes status tracking, timestamps, and review information.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    challenge_title = serializers.CharField(source='challenge.title', read_only=True)
    challenge_xp_reward = serializers.IntegerField(source='challenge.xp_reward', read_only=True)
    challenge_skill_tree = serializers.CharField(source='challenge.skill_tree', read_only=True)
    student_name = serializers.CharField(source='profile.lti_user.name', read_only=True)
    reviewer_name = serializers.CharField(source='reviewer.name', read_only=True, allow_null=True)

    # Calculated properties
    time_to_submit = serializers.SerializerMethodField()
    time_to_complete = serializers.SerializerMethodField()

    class Meta:
        model = ChallengeSubmission
        fields = [
            'id',
            'profile',
            'challenge',
            'challenge_title',
            'challenge_xp_reward',
            'challenge_skill_tree',
            'student_name',
            'status',
            'status_display',
            'started_at',
            'submitted_at',
            'completed_at',
            'submission_notes',
            'submission_files',
            'reviewer',
            'reviewer_name',
            'reviewer_feedback',
            'time_to_submit',
            'time_to_complete',
        ]
        read_only_fields = [
            'id',
            'profile',
            'started_at',
            'submitted_at',
            'completed_at',
        ]

    def get_time_to_submit(self, obj):
        """Get time taken to submit (in seconds)"""
        time_delta = obj.time_to_submit
        return int(time_delta.total_seconds()) if time_delta else None

    def get_time_to_complete(self, obj):
        """Get time taken to complete (in seconds)"""
        time_delta = obj.time_to_complete
        return int(time_delta.total_seconds()) if time_delta else None

    def validate(self, data):
        """Validate submission data and status transitions"""
        if self.instance:
            old_status = self.instance.status
            new_status = data.get('status', old_status)

            # Validate ACTIVE -> PENDING transition
            if old_status == ChallengeSubmission.Status.ACTIVE and new_status == ChallengeSubmission.Status.PENDING:
                if not data.get('submission_notes') and not self.instance.submission_notes:
                    raise serializers.ValidationError({
                        'submission_notes': 'Submission notes are required when submitting for review.'
                    })

            # Validate PENDING -> COMPLETED transition
            if old_status == ChallengeSubmission.Status.PENDING and new_status == ChallengeSubmission.Status.COMPLETED:
                if not data.get('reviewer') and not self.instance.reviewer:
                    raise serializers.ValidationError({
                        'reviewer': 'Reviewer is required when completing a submission.'
                    })

                if not data.get('reviewer_feedback'):
                    raise serializers.ValidationError({
                        'reviewer_feedback': 'Reviewer feedback is required when completing a submission.'
                    })

        return data


class RollSessionSerializer(serializers.ModelSerializer):
    """
    Serializer for roll sessions.

    Includes participant and roll statistics.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    instructor_name = serializers.CharField(source='instructor.name', read_only=True)
    context_title = serializers.CharField(source='context.title', read_only=True)
    participant_count = serializers.SerializerMethodField()
    roll_count = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()

    class Meta:
        model = RollSession
        fields = [
            'id',
            'context',
            'context_title',
            'instructor',
            'instructor_name',
            'title',
            'description',
            'status',
            'status_display',
            'scheduled_start',
            'scheduled_end',
            'actual_start',
            'actual_end',
            'created_at',
            'participant_count',
            'roll_count',
            'duration',
        ]
        read_only_fields = [
            'id',
            'context',
            'instructor',
            'created_at',
            'actual_start',
            'actual_end',
        ]

    def get_participant_count(self, obj):
        """Get number of unique participants in this session"""
        # Use annotate in viewset for better performance
        if hasattr(obj, 'participant_count_annotated'):
            return obj.participant_count_annotated
        return obj.rolls.values('profile').distinct().count()

    def get_roll_count(self, obj):
        """Get total number of rolls in this session"""
        # Use annotate in viewset for better performance
        if hasattr(obj, 'roll_count_annotated'):
            return obj.roll_count_annotated
        return obj.rolls.count()

    def get_duration(self, obj):
        """Get actual session duration in seconds"""
        if obj.actual_start and obj.actual_end:
            return int((obj.actual_end - obj.actual_start).total_seconds())
        return None

    def validate(self, data):
        """Validate session dates"""
        scheduled_start = data.get('scheduled_start', getattr(self.instance, 'scheduled_start', None))
        scheduled_end = data.get('scheduled_end', getattr(self.instance, 'scheduled_end', None))

        if scheduled_start and scheduled_end:
            if scheduled_end <= scheduled_start:
                raise serializers.ValidationError({
                    'scheduled_end': 'Session end time must be after start time.'
                })

        return data


class DiceRollSerializer(serializers.ModelSerializer):
    """
    Serializer for dice rolls.

    Includes student and challenge information.
    """
    student_name = serializers.CharField(source='profile.lti_user.name', read_only=True)
    challenge_title = serializers.CharField(source='challenge.title', read_only=True)
    challenge_rarity = serializers.CharField(source='challenge.rarity', read_only=True)
    session_title = serializers.CharField(source='session.title', read_only=True)

    class Meta:
        model = DiceRoll
        fields = [
            'id',
            'session',
            'session_title',
            'profile',
            'student_name',
            'challenge',
            'challenge_title',
            'challenge_rarity',
            'roll_value',
            'rolled_at',
        ]
        read_only_fields = ['id', 'rolled_at']


class DiceRollCreateSerializer(serializers.Serializer):
    """
    Serializer for creating dice rolls via WebSocket.

    Validates challenge availability and session status.
    """
    challenge_id = serializers.IntegerField()

    def validate_challenge_id(self, value):
        """Ensure challenge exists and is active"""
        if not Challenge.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError("Challenge not found or not active")
        return value

    def create(self, validated_data):
        """
        Not used - rolls are created via WebSocket consumer.

        Args:
            validated_data: Validated data (not used)
        """
        raise NotImplementedError("Use WebSocket consumer to create rolls")
