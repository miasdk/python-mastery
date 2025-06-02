from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    current_streak = Column(Integer, default=0)
    total_problems = Column(Integer, default=0)
    total_xp = Column(Integer, default=0)
    current_section = Column(Integer, default=1)
    current_lesson = Column(Integer, default=1)

class Section(Base):
    __tablename__ = "sections"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    order_index = Column(Integer, nullable=False)
    is_locked = Column(Boolean, default=True)

class Lesson(Base):
    __tablename__ = "lessons"
    
    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    order_index = Column(Integer, nullable=False)
    is_locked = Column(Boolean, default=True)

class Problem(Base):
    __tablename__ = "problems"
    
    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String, nullable=False)
    order_index = Column(Integer, nullable=False)
    starter_code = Column(Text, nullable=False)
    solution = Column(Text, nullable=False)
    test_cases = Column(JSON, nullable=False)
    hints = Column(JSON, nullable=False)
    xp_reward = Column(Integer, default=50)

class UserProgress(Base):
    __tablename__ = "user_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    is_completed = Column(Boolean, default=False)
    attempts = Column(Integer, default=0)
    best_time = Column(Integer)  # in seconds
    hints_used = Column(Integer, default=0)
    completed_at = Column(DateTime)
    last_attempt_at = Column(DateTime, default=datetime.utcnow)

class CodeSubmission(Base):
    __tablename__ = "code_submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    code = Column(Text, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    execution_time = Column(Integer)  # in milliseconds
    output = Column(Text)
    error = Column(Text)
    submitted_at = Column(DateTime, default=datetime.utcnow)

class Achievement(Base):
    __tablename__ = "achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String, nullable=False)
    earned_at = Column(DateTime, default=datetime.utcnow)
