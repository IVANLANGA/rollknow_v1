"""
LTI Integration Models with Gamification Features

This module extends the LTI tool package with gamification models:
- StudentProfile: Student progression and skill tracking
- Challenge: Course-scoped learning challenges
- ChallengeSubmission: Student challenge progress and submissions
- RollSession: Live dice rolling session management
- DiceRoll: Individual dice roll records

Note: This application uses models provided by the lti_tool package:
    - LtiRegistration: Platform registration details
    - Key: RSA keypairs for JWT signing
    - LtiPlatformInstance: Platform instance information
    - LtiContext: Course/context information
    - LtiUser: User information
    - LtiLaunch: Launch event records
"""
import math
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone


class SkillTier(models.TextChoices):
    """Skill tree progression tiers"""
    NOVICE = 'NOVICE', 'Novice'
    APPRENTICE = 'APPRENTICE', 'Apprentice'
    ADEPT = 'ADEPT', 'Adept'
    EXPERT = 'EXPERT', 'Expert'
    MASTER = 'MASTER', 'Master'


class StudentProfileQuerySet(models.QuerySet):
    """Custom QuerySet for StudentProfile with common queries"""

    def for_context(self, context):
        """Filter profiles by context"""
        return self.filter(context=context)

    def top_by_xp(self, limit=10):
        """Get top students by XP"""
        return self.order_by('-xp')[:limit]

    def with_active_streak(self):
        """Filter students with active streaks"""
        return self.filter(current_streak__gt=0)


class StudentProfileManager(models.Manager):
    """Custom manager for StudentProfile"""

    def get_queryset(self):
        return StudentProfileQuerySet(self.model, using=self._db)

    def for_context(self, context):
        return self.get_queryset().for_context(context)

    def get_or_create_for_launch(self, lti_user, context):
        """Get or create profile for LTI launch"""
        return self.get_or_create(
            lti_user=lti_user,
            context=context,
            defaults={
                'xp': 0,
                'level': 1,
            }
        )


class StudentProfile(models.Model):
    """
    Student profile with gamification data.

    Each student has one profile per course (LTI context).
    Tracks XP progression, activity streaks, and skill tree advancement.
    """
    # LTI references
    lti_user = models.ForeignKey(
        'lti_tool.LtiUser',
        on_delete=models.CASCADE,
        related_name='profiles',
        help_text="Reference to LTI User"
    )
    context = models.ForeignKey(
        'lti_tool.LtiContext',
        on_delete=models.CASCADE,
        related_name='profiles',
        help_text="Reference to LTI Context (course)"
    )

    # Core progression
    xp = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Total experience points"
    )
    level = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        help_text="Current level"
    )

    # Streaks
    current_streak = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Current consecutive days active"
    )
    longest_streak = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Longest consecutive days active"
    )
    last_activity_date = models.DateField(
        auto_now=True,
        help_text="Last activity date"
    )

    # Research skill tree
    research_tier = models.CharField(
        max_length=20,
        choices=SkillTier.choices,
        default=SkillTier.APPRENTICE,
        help_text="Research skill tier"
    )
    research_points = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Research skill points"
    )

    # Collaboration skill tree
    collaboration_tier = models.CharField(
        max_length=20,
        choices=SkillTier.choices,
        default=SkillTier.APPRENTICE,
        help_text="Collaboration skill tier"
    )
    collaboration_points = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Collaboration skill points"
    )

    # Creation skill tree
    creation_tier = models.CharField(
        max_length=20,
        choices=SkillTier.choices,
        default=SkillTier.NOVICE,
        help_text="Creation skill tier"
    )
    creation_points = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Creation skill points"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = StudentProfileManager()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['lti_user', 'context'],
                name='unique_profile_per_user_context'
            )
        ]
        indexes = [
            models.Index(fields=['context', 'lti_user']),
            models.Index(fields=['context', '-xp']),
            models.Index(fields=['last_activity_date']),
        ]
        verbose_name = "Student Profile"
        verbose_name_plural = "Student Profiles"
        ordering = ['-xp']

    def __str__(self):
        return f"{self.lti_user} - Level {self.level} ({self.xp} XP)"

    def add_xp(self, amount):
        """
        Add XP and handle level-ups.

        Uses sqrt formula: level = floor(sqrt(xp/100)) + 1
        Returns the new level.
        """
        if amount < 0:
            raise ValueError("Cannot add negative XP")

        self.xp += amount
        new_level = math.floor(math.sqrt(self.xp / 100)) + 1

        if new_level > self.level:
            self.level = new_level

        self.save(update_fields=['xp', 'level', 'updated_at'])
        return self.level

    @property
    def next_level_xp(self):
        """Calculate XP needed for next level"""
        next_level = self.level + 1
        return (next_level - 1) ** 2 * 100

    @property
    def xp_progress_percentage(self):
        """Calculate progress to next level as percentage"""
        current_level_xp = (self.level - 1) ** 2 * 100
        next_level_xp = self.level ** 2 * 100
        level_xp_range = next_level_xp - current_level_xp

        if level_xp_range == 0:
            return 100.0

        progress_in_level = self.xp - current_level_xp
        percentage = (progress_in_level / level_xp_range) * 100
        return round(min(100.0, max(0.0, percentage)), 1)

    def update_streak(self):
        """Update activity streak based on current date"""
        today = timezone.now().date()

        if self.last_activity_date == today:
            return  # Already counted today

        # Check if streak continues (yesterday)
        if self.last_activity_date == today - timezone.timedelta(days=1):
            self.current_streak += 1
            if self.current_streak > self.longest_streak:
                self.longest_streak = self.current_streak
        else:
            # Streak broken
            self.current_streak = 1

        self.save(update_fields=['current_streak', 'longest_streak', 'last_activity_date', 'updated_at'])


class ChallengeQuerySet(models.QuerySet):
    """Custom QuerySet for Challenge with common queries"""

    def active(self):
        """Filter only active challenges"""
        return self.filter(is_active=True)

    def for_context(self, context):
        """Filter challenges by context"""
        return self.filter(context=context)

    def by_skill_tree(self, skill_tree):
        """Filter by skill tree"""
        return self.filter(skill_tree=skill_tree)

    def by_rarity(self, rarity):
        """Filter by rarity"""
        return self.filter(rarity=rarity)


class ChallengeManager(models.Manager):
    """Custom manager for Challenge"""

    def get_queryset(self):
        return ChallengeQuerySet(self.model, using=self._db)

    def active(self):
        return self.get_queryset().active()

    def for_context(self, context):
        return self.get_queryset().for_context(context)


class Challenge(models.Model):
    """
    Challenge catalog (course-scoped).

    Challenges are learning activities that students can accept and complete
    to earn XP and skill points in specific skill trees.
    """

    class Rarity(models.TextChoices):
        COMMON = 'COMMON', 'Common'
        UNCOMMON = 'UNCOMMON', 'Uncommon'
        LEGENDARY = 'LEGENDARY', 'Legendary'

    class SkillTree(models.TextChoices):
        RESEARCH = 'RESEARCH', 'Research'
        COLLABORATION = 'COLLABORATION', 'Collaboration'
        CREATION = 'CREATION', 'Creation'

    context = models.ForeignKey(
        'lti_tool.LtiContext',
        on_delete=models.CASCADE,
        related_name='challenges',
        help_text="Course context this challenge belongs to"
    )
    title = models.CharField(
        max_length=255,
        help_text="Challenge title"
    )
    description = models.TextField(
        help_text="Detailed challenge description"
    )
    rarity = models.CharField(
        max_length=20,
        choices=Rarity.choices,
        default=Rarity.COMMON,
        help_text="Challenge rarity/difficulty"
    )
    skill_tree = models.CharField(
        max_length=20,
        choices=SkillTree.choices,
        help_text="Which skill tree this challenge belongs to"
    )
    required_tier = models.CharField(
        max_length=20,
        choices=SkillTier.choices,
        default=SkillTier.APPRENTICE,
        help_text="Minimum tier required to attempt"
    )
    estimated_hours = models.PositiveIntegerField(
        default=2,
        validators=[MinValueValidator(1), MaxValueValidator(168)],  # Max 1 week
        help_text="Estimated hours to complete"
    )
    xp_reward = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        help_text="XP awarded upon completion"
    )
    skill_points = models.PositiveIntegerField(
        default=10,
        validators=[MinValueValidator(1)],
        help_text="Skill points awarded upon completion"
    )
    objectives = models.JSONField(
        default=list,
        blank=True,
        help_text="List of challenge objectives"
    )
    success_criteria = models.JSONField(
        default=list,
        blank=True,
        help_text="Success criteria for challenge completion"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this challenge is currently available"
    )

    objects = ChallengeManager()

    class Meta:
        ordering = ['rarity', 'title']
        indexes = [
            models.Index(fields=['context', 'skill_tree', 'is_active']),
            models.Index(fields=['context', 'is_active', '-created_at']),
        ]
        verbose_name = "Challenge"
        verbose_name_plural = "Challenges"

    def __str__(self):
        return f"{self.title} ({self.get_rarity_display()})"

    def clean(self):
        """Validate challenge data"""
        if self.xp_reward and self.skill_points:
            # Ensure rewards scale with rarity
            min_xp_by_rarity = {
                self.Rarity.COMMON: 50,
                self.Rarity.UNCOMMON: 100,
                self.Rarity.LEGENDARY: 200,
            }
            min_xp = min_xp_by_rarity.get(self.rarity, 50)

            if self.xp_reward < min_xp:
                raise ValidationError({
                    'xp_reward': f'{self.get_rarity_display()} challenges must award at least {min_xp} XP'
                })


class ChallengeSubmissionQuerySet(models.QuerySet):
    """Custom QuerySet for ChallengeSubmission"""

    def active(self):
        """Filter active submissions"""
        return self.filter(status=ChallengeSubmission.Status.ACTIVE)

    def pending(self):
        """Filter pending submissions"""
        return self.filter(status=ChallengeSubmission.Status.PENDING)

    def completed(self):
        """Filter completed submissions"""
        return self.filter(status=ChallengeSubmission.Status.COMPLETED)

    def for_profile(self, profile):
        """Filter by student profile"""
        return self.filter(profile=profile)


class ChallengeSubmissionManager(models.Manager):
    """Custom manager for ChallengeSubmission"""

    def get_queryset(self):
        return ChallengeSubmissionQuerySet(self.model, using=self._db)


class ChallengeSubmission(models.Model):
    """
    Student challenge progress and submission.

    Tracks a student's journey through a challenge from acceptance
    through submission to completion and instructor review.
    """

    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        PENDING = 'PENDING', 'Pending Review'
        COMPLETED = 'COMPLETED', 'Completed'

    profile = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name='submissions',
        help_text="Student profile"
    )
    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.CASCADE,
        related_name='submissions',
        help_text="Challenge being attempted"
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
        help_text="Current submission status"
    )

    # Timestamps
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When student submitted for review"
    )
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When challenge was marked complete"
    )

    # Student submission
    submission_notes = models.TextField(
        blank=True,
        help_text="Student's notes about their submission"
    )
    submission_files = models.JSONField(
        default=list,
        blank=True,
        help_text="List of file attachments/URLs"
    )

    # Instructor review
    reviewer = models.ForeignKey(
        'lti_tool.LtiUser',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_submissions',
        help_text="Instructor who reviewed this submission"
    )
    reviewer_feedback = models.TextField(
        blank=True,
        help_text="Feedback from reviewer"
    )

    objects = ChallengeSubmissionManager()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['profile', 'challenge'],
                name='unique_submission_per_profile_challenge'
            )
        ]
        ordering = ['-started_at']
        indexes = [
            models.Index(fields=['profile', 'status']),
            models.Index(fields=['challenge', 'status']),
            models.Index(fields=['status', '-submitted_at']),
        ]
        verbose_name = "Challenge Submission"
        verbose_name_plural = "Challenge Submissions"

    def __str__(self):
        return f"{self.profile.lti_user} - {self.challenge.title} ({self.get_status_display()})"

    def clean(self):
        """Validate submission data"""
        # Ensure profile and challenge are in the same context
        if self.profile.context_id != self.challenge.context_id:
            raise ValidationError(
                "Profile and challenge must be in the same context"
            )

    @property
    def time_to_submit(self):
        """Calculate time from start to submission"""
        if self.submitted_at and self.started_at:
            return self.submitted_at - self.started_at
        return None

    @property
    def time_to_complete(self):
        """Calculate time from start to completion"""
        if self.completed_at and self.started_at:
            return self.completed_at - self.started_at
        return None


class RollSessionQuerySet(models.QuerySet):
    """Custom QuerySet for RollSession"""

    def active(self):
        """Filter active sessions"""
        return self.filter(status=RollSession.Status.ACTIVE)

    def upcoming(self):
        """Filter upcoming sessions"""
        return self.filter(status=RollSession.Status.UPCOMING)

    def for_context(self, context):
        """Filter by context"""
        return self.filter(context=context)


class RollSessionManager(models.Manager):
    """Custom manager for RollSession"""

    def get_queryset(self):
        return RollSessionQuerySet(self.model, using=self._db)

    def active(self):
        return self.get_queryset().active()


class RollSession(models.Model):
    """
    Live dice rolling session.

    Represents a scheduled live session where students roll dice
    to determine which challenges they will work on.
    """

    class Status(models.TextChoices):
        UPCOMING = 'UPCOMING', 'Upcoming'
        ACTIVE = 'ACTIVE', 'Active'
        COMPLETED = 'COMPLETED', 'Completed'

    context = models.ForeignKey(
        'lti_tool.LtiContext',
        on_delete=models.CASCADE,
        related_name='roll_sessions',
        help_text="Course context"
    )
    instructor = models.ForeignKey(
        'lti_tool.LtiUser',
        on_delete=models.CASCADE,
        related_name='created_sessions',
        help_text="Instructor who created this session"
    )
    title = models.CharField(
        max_length=255,
        help_text="Session title"
    )
    description = models.TextField(
        help_text="Session description"
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.UPCOMING,
        help_text="Current session status"
    )

    # Scheduling
    scheduled_start = models.DateTimeField(
        help_text="When session is scheduled to start"
    )
    scheduled_end = models.DateTimeField(
        help_text="When session is scheduled to end"
    )
    actual_start = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When session actually started"
    )
    actual_end = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When session actually ended"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    objects = RollSessionManager()

    class Meta:
        ordering = ['-scheduled_start']
        indexes = [
            models.Index(fields=['context', 'status']),
            models.Index(fields=['status', 'scheduled_start']),
        ]
        verbose_name = "Roll Session"
        verbose_name_plural = "Roll Sessions"

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"

    def clean(self):
        """Validate session dates"""
        if self.scheduled_end <= self.scheduled_start:
            raise ValidationError(
                "Session end time must be after start time"
            )

        if self.actual_end and self.actual_start:
            if self.actual_end <= self.actual_start:
                raise ValidationError(
                    "Actual end time must be after actual start time"
                )


class DiceRoll(models.Model):
    """
    Individual dice roll record.

    Represents a single dice roll made by a student during a live session.
    """
    MIN_ROLL = 1
    MAX_ROLL = 20

    session = models.ForeignKey(
        RollSession,
        on_delete=models.CASCADE,
        related_name='rolls',
        help_text="Roll session this belongs to"
    )
    profile = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name='rolls',
        help_text="Student who made the roll"
    )
    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.CASCADE,
        related_name='rolls',
        help_text="Challenge that was rolled for"
    )
    roll_value = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(MIN_ROLL), MaxValueValidator(MAX_ROLL)],
        help_text="The dice roll result (1-20)"
    )
    rolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-rolled_at']
        indexes = [
            models.Index(fields=['session', '-rolled_at']),
            models.Index(fields=['profile', '-rolled_at']),
        ]
        verbose_name = "Dice Roll"
        verbose_name_plural = "Dice Rolls"

    def __str__(self):
        return f"{self.profile.lti_user} rolled {self.roll_value} for {self.challenge.title}"

    def clean(self):
        """Validate roll data"""
        # Ensure all entities are in the same context
        if self.profile.context_id != self.session.context_id:
            raise ValidationError(
                "Profile and session must be in the same context"
            )

        if self.challenge.context_id != self.session.context_id:
            raise ValidationError(
                "Challenge and session must be in the same context"
            )

        # Ensure session is active
        if self.session.status != RollSession.Status.ACTIVE:
            raise ValidationError(
                "Can only roll dice in active sessions"
            )
