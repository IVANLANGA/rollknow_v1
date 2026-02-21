"""
Django Admin Configuration

LTI-related models are registered in the lti_tool package admin.
Access the admin interface at /admin/ to manage:
    - LTI Registrations (platform configurations)
    - Keys (RSA keypairs for JWT signing)
    - Platform Instances
    - Contexts (courses)
    - Users
    - Launch Events

Gamification models are registered below.
"""
from django.contrib import admin
from .models import StudentProfile, Challenge, ChallengeSubmission, RollSession, DiceRoll


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    """Admin interface for student profiles"""
    list_display = [
        'lti_user',
        'context',
        'level',
        'xp',
        'current_streak',
        'research_tier',
        'collaboration_tier',
        'creation_tier',
    ]
    list_filter = ['context', 'level', 'research_tier', 'collaboration_tier', 'creation_tier']
    search_fields = ['lti_user__name', 'lti_user__email']
    readonly_fields = ['created_at', 'updated_at', 'last_activity_date']

    fieldsets = (
        ('User Information', {
            'fields': ('lti_user', 'context')
        }),
        ('Progression', {
            'fields': ('xp', 'level', 'current_streak', 'longest_streak', 'last_activity_date')
        }),
        ('Research Skills', {
            'fields': ('research_tier', 'research_points')
        }),
        ('Collaboration Skills', {
            'fields': ('collaboration_tier', 'collaboration_points')
        }),
        ('Creation Skills', {
            'fields': ('creation_tier', 'creation_points')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    """Admin interface for challenges"""
    list_display = [
        'title',
        'context',
        'rarity',
        'skill_tree',
        'xp_reward',
        'skill_points',
        'is_active',
    ]
    list_filter = ['context', 'rarity', 'skill_tree', 'is_active']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at']

    fieldsets = (
        ('Basic Information', {
            'fields': ('context', 'title', 'description', 'is_active')
        }),
        ('Challenge Properties', {
            'fields': ('rarity', 'skill_tree', 'required_tier', 'estimated_hours')
        }),
        ('Rewards', {
            'fields': ('xp_reward', 'skill_points')
        }),
        ('Requirements', {
            'fields': ('objectives', 'success_criteria'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(ChallengeSubmission)
class ChallengeSubmissionAdmin(admin.ModelAdmin):
    """Admin interface for challenge submissions"""
    list_display = [
        'profile',
        'challenge',
        'status',
        'started_at',
        'submitted_at',
        'completed_at',
    ]
    list_filter = ['status', 'challenge__skill_tree', 'started_at', 'completed_at']
    search_fields = [
        'profile__lti_user__name',
        'profile__lti_user__email',
        'challenge__title',
    ]
    readonly_fields = ['started_at', 'submitted_at', 'completed_at']

    fieldsets = (
        ('Submission Information', {
            'fields': ('profile', 'challenge', 'status')
        }),
        ('Student Submission', {
            'fields': ('submission_notes', 'submission_files')
        }),
        ('Review', {
            'fields': ('reviewer', 'reviewer_feedback')
        }),
        ('Timestamps', {
            'fields': ('started_at', 'submitted_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(RollSession)
class RollSessionAdmin(admin.ModelAdmin):
    """Admin interface for roll sessions"""
    list_display = [
        'title',
        'context',
        'instructor',
        'status',
        'scheduled_start',
        'scheduled_end',
    ]
    list_filter = ['status', 'context', 'scheduled_start']
    search_fields = ['title', 'description', 'instructor__name']
    readonly_fields = ['created_at', 'actual_start', 'actual_end']

    fieldsets = (
        ('Session Information', {
            'fields': ('context', 'instructor', 'title', 'description', 'status')
        }),
        ('Schedule', {
            'fields': ('scheduled_start', 'scheduled_end', 'actual_start', 'actual_end')
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(DiceRoll)
class DiceRollAdmin(admin.ModelAdmin):
    """Admin interface for dice rolls"""
    list_display = [
        'profile',
        'session',
        'challenge',
        'roll_value',
        'rolled_at',
    ]
    list_filter = ['session', 'rolled_at']
    search_fields = [
        'profile__lti_user__name',
        'challenge__title',
        'session__title',
    ]
    readonly_fields = ['rolled_at']

    fieldsets = (
        ('Roll Information', {
            'fields': ('session', 'profile', 'challenge', 'roll_value')
        }),
        ('Metadata', {
            'fields': ('rolled_at',),
            'classes': ('collapse',)
        }),
    )
