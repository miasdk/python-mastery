from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime
from typing import Dict, Any, List
from .models import User, UserProgress, Problem, Achievement

class ProgressTracker:
    def __init__(self, db: Session):
        self.db = db

    def update_user_progress(self, user_id: int, problem_id: int, is_correct: bool, execution_time: int) -> Dict[str, Any]:
        """Update user progress when they submit a solution"""
        # Get or create user progress using raw SQL to avoid ORM issues
        result = self.db.execute(
            text("SELECT * FROM user_progress WHERE user_id = :user_id AND problem_id = :problem_id"),
            {"user_id": user_id, "problem_id": problem_id}
        ).fetchone()
        
        if not result:
            # Create new progress record
            self.db.execute(
                text("""
                    INSERT INTO user_progress (user_id, problem_id, is_completed, attempts, hints_used, last_attempt_at) 
                    VALUES (:user_id, :problem_id, false, 0, 0, NOW())
                """),
                {"user_id": user_id, "problem_id": problem_id}
            )
            self.db.commit()
        
        # Update attempts
        self.db.execute(
            text("UPDATE user_progress SET attempts = attempts + 1, last_attempt_at = NOW() WHERE user_id = :user_id AND problem_id = :problem_id"),
            {"user_id": user_id, "problem_id": problem_id}
        )
        
        xp_gained = 0
        new_achievements = []
        
        if is_correct:
            # Check if already completed
            completed_check = self.db.execute(
                text("SELECT is_completed FROM user_progress WHERE user_id = :user_id AND problem_id = :problem_id"),
                {"user_id": user_id, "problem_id": problem_id}
            ).fetchone()
            
            if completed_check and not completed_check.is_completed:
                # Mark as completed
                self.db.execute(
                    text("""
                        UPDATE user_progress 
                        SET is_completed = true, completed_at = NOW(), best_time = :execution_time 
                        WHERE user_id = :user_id AND problem_id = :problem_id
                    """),
                    {"user_id": user_id, "problem_id": problem_id, "execution_time": execution_time}
                )
                
                # Update user stats
                self.db.execute(
                    text("UPDATE users SET total_problems = total_problems + 1 WHERE id = :user_id"),
                    {"user_id": user_id}
                )
                
                # Award XP
                base_xp = 50
                attempts = self.db.execute(
                    text("SELECT attempts FROM user_progress WHERE user_id = :user_id AND problem_id = :problem_id"),
                    {"user_id": user_id, "problem_id": problem_id}
                ).fetchone().attempts
                
                efficiency_bonus = max(0, 45 - (attempts - 1) * 5)
                xp_gained = base_xp + efficiency_bonus
                
                # Update user XP
                self.db.execute(
                    text("UPDATE users SET total_xp = total_xp + :xp_gained WHERE id = :user_id"),
                    {"user_id": user_id, "xp_gained": xp_gained}
                )
                
                # Update streak
                self._update_streak(user_id)
                
                # Check achievements
                new_achievements = self._check_achievements(user_id)
        
        self.db.commit()
        
        return {
            "xp_gained": xp_gained,
            "new_achievements": new_achievements,
            "is_completed": is_correct
        }

    def _update_streak(self, user_id: int):
        """Update user's current streak"""
        # Get user's last completed problem date
        last_completion = self.db.execute(
            text("""
                SELECT MAX(completed_at) as last_date 
                FROM user_progress 
                WHERE user_id = :user_id AND is_completed = true
            """),
            {"user_id": user_id}
        ).fetchone()
        
        if last_completion and last_completion.last_date:
            # Check if within 24 hours of previous completion
            time_diff = datetime.utcnow() - last_completion.last_date
            if time_diff.days <= 1:
                self.db.execute(
                    text("UPDATE users SET current_streak = current_streak + 1 WHERE id = :user_id"),
                    {"user_id": user_id}
                )
            else:
                self.db.execute(
                    text("UPDATE users SET current_streak = 1 WHERE id = :user_id"),
                    {"user_id": user_id}
                )
        else:
            self.db.execute(
                text("UPDATE users SET current_streak = 1 WHERE id = :user_id"),
                {"user_id": user_id}
            )

    def _check_achievements(self, user_id: int) -> List[Dict[str, Any]]:
        """Check and award achievements"""
        new_achievements = []
        
        # Get user stats
        user_stats = self.db.execute(
            text("SELECT total_problems, current_streak, total_xp FROM users WHERE id = :user_id"),
            {"user_id": user_id}
        ).fetchone()
        
        # Define achievements to check
        achievements_to_check = [
            {"type": "first_problem", "threshold": 1, "title": "First Steps", "description": "Completed your first problem!", "icon": "🎯"},
            {"type": "problem_count", "threshold": 5, "title": "Getting Started", "description": "Completed 5 problems", "icon": "⭐"},
            {"type": "problem_count", "threshold": 10, "title": "Python Apprentice", "description": "Completed 10 problems", "icon": "🐍"},
            {"type": "streak", "threshold": 3, "title": "On Fire", "description": "3-day streak!", "icon": "🔥"},
            {"type": "streak", "threshold": 7, "title": "Unstoppable", "description": "7-day streak!", "icon": "⚡"},
        ]
        
        for achievement in achievements_to_check:
            # Check if already earned
            existing = self.db.execute(
                text("SELECT id FROM achievements WHERE user_id = :user_id AND type = :type"),
                {"user_id": user_id, "type": achievement["type"]}
            ).fetchone()
            
            if not existing:
                # Check if threshold met
                threshold_met = False
                if achievement["type"] == "first_problem" or achievement["type"] == "problem_count":
                    threshold_met = user_stats.total_problems >= achievement["threshold"]
                elif achievement["type"] == "streak":
                    threshold_met = user_stats.current_streak >= achievement["threshold"]
                
                if threshold_met:
                    self.db.execute(
                        text("""
                            INSERT INTO achievements (user_id, type, title, description, icon, earned_at) 
                            VALUES (:user_id, :type, :title, :description, :icon, NOW())
                        """),
                        {
                            "user_id": user_id,
                            "type": achievement["type"],
                            "title": achievement["title"],
                            "description": achievement["description"],
                            "icon": achievement["icon"]
                        }
                    )
                    new_achievements.append(achievement)
        
        return new_achievements

    def get_user_progress_summary(self, user_id: int) -> Dict[str, Any]:
        """Get a summary of user's progress"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return {}
        
        total_problems = self.db.execute(text("SELECT COUNT(*) as count FROM problems")).fetchone().count
        completed_problems = self.db.execute(
            text("SELECT COUNT(*) as count FROM user_progress WHERE user_id = :user_id AND is_completed = true"),
            {"user_id": user_id}
        ).fetchone().count
        
        progress_percentage = (completed_problems / total_problems * 100) if total_problems > 0 else 0
        
        return {
            "progress_percentage": round(progress_percentage, 1),
            "problems_solved": completed_problems,
            "current_streak": user.current_streak,
            "total_xp": user.total_xp
        }