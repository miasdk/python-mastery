from sqlalchemy.orm import Session
from .models import User, UserProgress, Achievement, CodeSubmission
from .database import get_db
from datetime import datetime, timedelta
from typing import Dict, Any, List

class ProgressTracker:
    def __init__(self, db: Session):
        self.db = db

    def update_user_progress(self, user_id: int, problem_id: int, is_correct: bool, execution_time: int) -> Dict[str, Any]:
        """Update user progress when they submit a solution"""
        
        # Get or create user progress record
        progress = self.db.query(UserProgress).filter(
            UserProgress.user_id == user_id,
            UserProgress.problem_id == problem_id
        ).first()
        
        if not progress:
            progress = UserProgress(
                user_id=user_id,
                problem_id=problem_id,
                attempts=0,
                hints_used=0
            )
            self.db.add(progress)
        
        # Update attempts
        progress.attempts += 1
        progress.last_attempt_at = datetime.utcnow()
        
        # If correct and not previously completed
        if is_correct and not progress.is_completed:
            progress.is_completed = True
            progress.completed_at = datetime.utcnow()
            
            # Update best time
            if not progress.best_time or execution_time < progress.best_time:
                progress.best_time = execution_time
            
            # Update user stats
            user = self.db.query(User).filter(User.id == user_id).first()
            if user:
                user.total_problems += 1
                # Award XP (base 50 + bonus for efficiency)
                xp_bonus = max(0, 50 - progress.attempts * 5)  # Bonus for fewer attempts
                user.total_xp += 50 + xp_bonus
                
                # Update streak
                self._update_streak(user)
                
                # Check for achievements
                self._check_achievements(user)
        
        self.db.commit()
        
        return {
            "progress_updated": True,
            "is_completed": progress.is_completed,
            "attempts": progress.attempts,
            "best_time": progress.best_time
        }

    def _update_streak(self, user: User):
        """Update user's current streak"""
        today = datetime.utcnow().date()
        yesterday = today - timedelta(days=1)
        
        # Check if user solved a problem today
        completed_today = self.db.query(UserProgress).filter(
            UserProgress.user_id == user.id,
            UserProgress.is_completed == True,
            UserProgress.completed_at >= datetime.combine(today, datetime.min.time())
        ).first()
        
        if completed_today:
            # Check if user solved a problem yesterday
            completed_yesterday = self.db.query(UserProgress).filter(
                UserProgress.user_id == user.id,
                UserProgress.is_completed == True,
                UserProgress.completed_at >= datetime.combine(yesterday, datetime.min.time()),
                UserProgress.completed_at < datetime.combine(today, datetime.min.time())
            ).first()
            
            if completed_yesterday:
                user.current_streak += 1
            else:
                user.current_streak = 1
        
    def _check_achievements(self, user: User):
        """Check and award achievements"""
        achievements_to_award = []
        
        # Streak achievements
        if user.current_streak == 7:
            achievements_to_award.append({
                "type": "streak",
                "title": "Week Warrior",
                "description": "Solved problems for 7 days in a row",
                "icon": "fas fa-fire"
            })
        elif user.current_streak == 30:
            achievements_to_award.append({
                "type": "streak",
                "title": "Monthly Master",
                "description": "Solved problems for 30 days in a row",
                "icon": "fas fa-crown"
            })
        
        # Problem count achievements
        if user.total_problems == 10:
            achievements_to_award.append({
                "type": "problems_solved",
                "title": "Problem Solver",
                "description": "Solved your first 10 problems",
                "icon": "fas fa-trophy"
            })
        elif user.total_problems == 50:
            achievements_to_award.append({
                "type": "problems_solved",
                "title": "Code Warrior",
                "description": "Solved 50 problems",
                "icon": "fas fa-medal"
            })
        elif user.total_problems == 100:
            achievements_to_award.append({
                "type": "problems_solved",
                "title": "Python Master",
                "description": "Solved 100 problems",
                "icon": "fas fa-star"
            })
        
        # Award new achievements
        for achievement_data in achievements_to_award:
            # Check if user already has this achievement
            existing = self.db.query(Achievement).filter(
                Achievement.user_id == user.id,
                Achievement.type == achievement_data["type"],
                Achievement.title == achievement_data["title"]
            ).first()
            
            if not existing:
                achievement = Achievement(
                    user_id=user.id,
                    **achievement_data
                )
                self.db.add(achievement)

    def get_user_progress_summary(self, user_id: int) -> Dict[str, Any]:
        """Get a summary of user's progress"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return {}
        
        # Get recent achievements
        recent_achievements = self.db.query(Achievement).filter(
            Achievement.user_id == user_id
        ).order_by(Achievement.earned_at.desc()).limit(5).all()
        
        # Calculate progress percentage (assuming 200 total problems in curriculum)
        total_curriculum_problems = 200
        progress_percentage = min(100, (user.total_problems / total_curriculum_problems) * 100)
        
        return {
            "user": {
                "id": user.id,
                "username": user.username,
                "current_streak": user.current_streak,
                "total_problems": user.total_problems,
                "total_xp": user.total_xp,
                "current_section": user.current_section,
                "current_lesson": user.current_lesson
            },
            "stats": {
                "progress_percentage": round(progress_percentage, 1),
                "problems_solved": user.total_problems,
                "current_streak": user.current_streak,
                "total_xp": user.total_xp
            },
            "recent_achievements": [
                {
                    "title": achievement.title,
                    "description": achievement.description,
                    "icon": achievement.icon,
                    "earned_at": achievement.earned_at.isoformat()
                }
                for achievement in recent_achievements
            ]
        }
