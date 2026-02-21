"""
LTI Advantage Services

Provides helper functions for interacting with LTI Advantage services:
- Assignment and Grade Services (AGS)
- Names and Role Provisioning Services (NRPS)
- Deep Linking (Content Item Message)

References:
- AGS: https://www.imsglobal.org/spec/lti-ags/v2p0
- NRPS: https://www.imsglobal.org/spec/lti-nrps/v2p0
- Deep Linking: https://www.imsglobal.org/spec/lti-dl/v2p0
"""
import logging
from typing import Dict, List, Optional

from pylti1p3.grade import Grade
from pylti1p3.lineitem import LineItem

logger = logging.getLogger(__name__)


class AssignmentGradeService:
    """
    Helper class for LTI Assignment and Grade Services (AGS).

    Enables tools to create line items (assignments) in the platform
    gradebook and submit scores for students.
    """

    def __init__(self, lti_launch):
        """
        Initialize AGS service.

        Args:
            lti_launch: Validated LTI launch object
        """
        self.lti_launch = lti_launch

    def is_available(self) -> bool:
        """
        Check if AGS is available for this launch.

        Returns:
            bool: True if AGS endpoint is available
        """
        return self.lti_launch.has_ags()

    def get_lineitem_url(self) -> Optional[str]:
        """
        Get the line item URL for this resource link.

        Returns:
            Optional[str]: Line item URL or None if not available
        """
        if not self.is_available():
            return None

        ags = self.lti_launch.get_ags()
        return ags.get_lineitem()

    def create_lineitem(
        self,
        label: str,
        score_maximum: float,
        resource_id: Optional[str] = None,
        resource_link_id: Optional[str] = None,
        tag: Optional[str] = None,
    ) -> Optional[Dict]:
        """
        Create a new line item (assignment) in the platform gradebook.

        Args:
            label: Display name for the line item
            score_maximum: Maximum possible score
            resource_id: Optional resource identifier
            resource_link_id: Optional resource link identifier
            tag: Optional tag for filtering

        Returns:
            Optional[Dict]: Created line item data or None if failed
        """
        if not self.is_available():
            logger.warning("AGS not available for this launch")
            return None

        try:
            ags = self.lti_launch.get_ags()
            lineitem = LineItem()
            lineitem.set_label(label)
            lineitem.set_score_maximum(score_maximum)

            if resource_id:
                lineitem.set_resource_id(resource_id)
            if resource_link_id:
                lineitem.set_resource_link_id(resource_link_id)
            if tag:
                lineitem.set_tag(tag)

            result = ags.put_lineitem(lineitem)
            logger.info(f"Created line item: {label}")
            return result

        except Exception:
            logger.exception("Failed to create line item")
            return None

    def submit_grade(
        self,
        score_given: float,
        score_maximum: float,
        user_id: Optional[str] = None,
        activity_progress: str = "Completed",
        grading_progress: str = "FullyGraded",
        comment: Optional[str] = None,
    ) -> bool:
        """
        Submit a grade for a student.

        Args:
            score_given: Score achieved by the student
            score_maximum: Maximum possible score
            user_id: Optional user ID (defaults to current user)
            activity_progress: Activity status (Initialized, Started, InProgress, Submitted, Completed)
            grading_progress: Grading status (FullyGraded, Pending, PendingManual, Failed, NotReady)
            comment: Optional comment for the grade

        Returns:
            bool: True if grade was successfully submitted
        """
        if not self.is_available():
            logger.warning("AGS not available for this launch")
            return False

        try:
            ags = self.lti_launch.get_ags()

            grade = Grade()
            grade.set_score_given(score_given)
            grade.set_score_maximum(score_maximum)
            grade.set_activity_progress(activity_progress)
            grade.set_grading_progress(grading_progress)

            if user_id:
                grade.set_user_id(user_id)

            if comment:
                grade.set_comment(comment)

            ags.put_grade(grade)
            logger.info(f"Submitted grade: {score_given}/{score_maximum}")
            return True

        except Exception:
            logger.exception("Failed to submit grade")
            return False

    def get_lineitems(self) -> Optional[List[Dict]]:
        """
        Retrieve all line items for the current context.

        Returns:
            Optional[List[Dict]]: List of line items or None if failed
        """
        if not self.is_available():
            logger.warning("AGS not available for this launch")
            return None

        try:
            ags = self.lti_launch.get_ags()
            lineitems = ags.get_lineitems()
            return lineitems

        except Exception:
            logger.exception("Failed to retrieve line items")
            return None


class NamesRoleService:
    """
    Helper class for LTI Names and Role Provisioning Service (NRPS).

    Enables tools to retrieve membership information for the current context.
    """

    def __init__(self, lti_launch):
        """
        Initialize NRPS service.

        Args:
            lti_launch: Validated LTI launch object
        """
        self.lti_launch = lti_launch

    def is_available(self) -> bool:
        """
        Check if NRPS is available for this launch.

        Returns:
            bool: True if NRPS endpoint is available
        """
        return self.lti_launch.has_nrps()

    def get_members(self) -> Optional[List[Dict]]:
        """
        Retrieve all members of the current context.

        Returns:
            Optional[List[Dict]]: List of members with their roles and information
        """
        if not self.is_available():
            logger.warning("NRPS not available for this launch")
            return None

        try:
            nrps = self.lti_launch.get_nrps()
            members = nrps.get_members()
            logger.info(f"Retrieved {len(members)} members")
            return members

        except Exception:
            logger.exception("Failed to retrieve members")
            return None


def get_ags_service(lti_launch) -> AssignmentGradeService:
    """
    Factory function to create AGS service instance.

    Args:
        lti_launch: Validated LTI launch object

    Returns:
        AssignmentGradeService: AGS service instance
    """
    return AssignmentGradeService(lti_launch)


def get_nrps_service(lti_launch) -> NamesRoleService:
    """
    Factory function to create NRPS service instance.

    Args:
        lti_launch: Validated LTI launch object

    Returns:
        NamesRoleService: NRPS service instance
    """
    return NamesRoleService(lti_launch)
