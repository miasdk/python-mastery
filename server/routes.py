from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from .database import get_db
from .models import User, Section, Lesson, Problem, UserProgress, CodeSubmission
from .code_executor import SecureCodeExecutor
from .curriculum import CurriculumGenerator
from .progress_tracker import ProgressTracker
from datetime import datetime

router = APIRouter()

# Pydantic models
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    current_streak: int
    total_problems: int
    total_xp: int

class CodeSubmissionRequest(BaseModel):
    problem_id: int
    code: str

class CodeExecutionRequest(BaseModel):
    code: str
    test_cases: List[Dict[str, Any]]

# Initialize services
code_executor = SecureCodeExecutor()
curriculum_generator = CurriculumGenerator()

@router.post("/users", response_model=UserResponse)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """Create a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists"
        )
    
    # Create new user (in production, hash the password)
    db_user = User(
        username=user.username,
        email=user.email,
        password_hash=user.password  # In production, use proper password hashing
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Initialize curriculum if not exists
    await initialize_curriculum(db)
    
    return db_user

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/dashboard/{user_id}")
async def get_dashboard(user_id: int, db: Session = Depends(get_db)):
    """Get user dashboard with progress and curriculum"""
    progress_tracker = ProgressTracker(db)
    dashboard_data = progress_tracker.get_user_progress_summary(user_id)
    
    if not dashboard_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get curriculum sections with progress
    sections = db.query(Section).order_by(Section.order_index).all()
    sections_with_progress = []
    
    for section in sections:
        lessons = db.query(Lesson).filter(
            Lesson.section_id == section.id
        ).order_by(Lesson.order_index).all()
        
        lessons_with_progress = []
        for lesson in lessons:
            problems = db.query(Problem).filter(
                Problem.lesson_id == lesson.id
            ).order_by(Problem.order_index).all()
            
            problems_with_progress = []
            for problem in problems:
                progress = db.query(UserProgress).filter(
                    UserProgress.user_id == user_id,
                    UserProgress.problem_id == problem.id
                ).first()
                
                problem_data = {
                    "id": problem.id,
                    "title": problem.title,
                    "description": problem.description,
                    "difficulty": problem.difficulty,
                    "order_index": problem.order_index,
                    "xp_reward": problem.xp_reward,
                    "is_completed": progress.is_completed if progress else False,
                    "attempts": progress.attempts if progress else 0,
                    "best_time": progress.best_time if progress else None
                }
                problems_with_progress.append(problem_data)
            
            completed_problems = sum(1 for p in problems_with_progress if p["is_completed"])
            lesson_data = {
                "id": lesson.id,
                "title": lesson.title,
                "description": lesson.description,
                "order_index": lesson.order_index,
                "is_locked": lesson.is_locked,
                "problems": problems_with_progress,
                "completed_problems": completed_problems,
                "total_problems": len(problems_with_progress)
            }
            lessons_with_progress.append(lesson_data)
        
        completed_lessons = sum(1 for l in lessons_with_progress if l["completed_problems"] == l["total_problems"] and l["total_problems"] > 0)
        section_data = {
            "id": section.id,
            "title": section.title,
            "description": section.description,
            "order_index": section.order_index,
            "is_locked": section.is_locked,
            "lessons": lessons_with_progress,
            "completed_lessons": completed_lessons,
            "total_lessons": len(lessons_with_progress)
        }
        sections_with_progress.append(section_data)
    
    dashboard_data["sections"] = sections_with_progress
    
    # Get current problem (first incomplete problem)
    current_problem = None
    for section in sections_with_progress:
        if not section["is_locked"]:
            for lesson in section["lessons"]:
                if not lesson["is_locked"]:
                    for problem in lesson["problems"]:
                        if not problem["is_completed"]:
                            current_problem = problem
                            break
                    if current_problem:
                        break
            if current_problem:
                break
    
    dashboard_data["current_problem"] = current_problem
    
    return dashboard_data

@router.get("/problems/{problem_id}")
async def get_problem(problem_id: int, user_id: int, db: Session = Depends(get_db)):
    """Get problem details with user progress"""
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    # Get user progress
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == user_id,
        UserProgress.problem_id == problem_id
    ).first()
    
    # Get lesson and section info for breadcrumb
    lesson = db.query(Lesson).filter(Lesson.id == problem.lesson_id).first()
    section = db.query(Section).filter(Section.id == lesson.section_id).first()
    
    return {
        "id": problem.id,
        "title": problem.title,
        "description": problem.description,
        "difficulty": problem.difficulty,
        "starter_code": problem.starter_code,
        "hints": problem.hints,
        "xp_reward": problem.xp_reward,
        "test_cases": problem.test_cases,
        "progress": {
            "is_completed": progress.is_completed if progress else False,
            "attempts": progress.attempts if progress else 0,
            "best_time": progress.best_time if progress else None,
            "hints_used": progress.hints_used if progress else 0
        },
        "breadcrumb": {
            "section": section.title,
            "lesson": lesson.title
        }
    }

@router.post("/execute-code")
async def execute_code(request: CodeExecutionRequest):
    """Execute Python code securely"""
    result = code_executor.execute_code(request.code, request.test_cases)
    return result

@router.post("/submit-solution")
async def submit_solution(request: CodeSubmissionRequest, user_id: int, db: Session = Depends(get_db)):
    """Submit a solution for a problem"""
    # Get problem details
    problem = db.query(Problem).filter(Problem.id == request.problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    # Execute the code
    result = code_executor.execute_code(request.code, problem.test_cases)
    
    # Record the submission
    submission = CodeSubmission(
        user_id=user_id,
        problem_id=request.problem_id,
        code=request.code,
        is_correct=result["success"],
        execution_time=result.get("execution_time", 0),
        output=result.get("output", ""),
        error=result.get("error", "")
    )
    db.add(submission)
    db.commit()
    
    # Update user progress
    progress_tracker = ProgressTracker(db)
    progress_update = progress_tracker.update_user_progress(
        user_id=user_id,
        problem_id=request.problem_id,
        is_correct=result["success"],
        execution_time=result.get("execution_time", 0)
    )
    
    return {
        **result,
        "progress": progress_update
    }

@router.post("/hint-used/{problem_id}")
async def hint_used(problem_id: int, user_id: int, db: Session = Depends(get_db)):
    """Record that user used a hint"""
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == user_id,
        UserProgress.problem_id == problem_id
    ).first()
    
    if not progress:
        progress = UserProgress(
            user_id=user_id,
            problem_id=problem_id,
            attempts=0,
            hints_used=1
        )
        db.add(progress)
    else:
        progress.hints_used += 1
    
    db.commit()
    return {"hints_used": progress.hints_used}

@router.post("/validate-syntax")
async def validate_syntax(code: str):
    """Validate Python code syntax"""
    result = code_executor.validate_syntax(code)
    return result

async def initialize_curriculum(db: Session):
    """Initialize curriculum data if not exists"""
    if db.query(Section).count() > 0:
        return  # Already initialized
    
    curriculum_data = curriculum_generator.get_curriculum_data()
    
    for section_idx, section_data in enumerate(curriculum_data):
        # Create section
        section = Section(
            title=section_data["title"],
            description=section_data["description"],
            order_index=section_idx + 1,
            is_locked=section_idx > 0  # First section unlocked
        )
        db.add(section)
        db.flush()  # Get the ID
        
        for lesson_idx, lesson_data in enumerate(section_data["lessons"]):
            # Create lesson
            lesson = Lesson(
                section_id=section.id,
                title=lesson_data["title"],
                description=lesson_data["description"],
                order_index=lesson_idx + 1,
                is_locked=lesson_idx > 0 or section_idx > 0  # First lesson of first section unlocked
            )
            db.add(lesson)
            db.flush()  # Get the ID
            
            for problem_idx, problem_data in enumerate(lesson_data["problems"]):
                # Create problem
                problem = Problem(
                    lesson_id=lesson.id,
                    title=problem_data["title"],
                    description=problem_data["description"],
                    difficulty=problem_data["difficulty"],
                    order_index=problem_idx + 1,
                    starter_code=problem_data["starter_code"],
                    solution=problem_data["solution"],
                    test_cases=problem_data["test_cases"],
                    hints=problem_data["hints"],
                    xp_reward=problem_data["xp_reward"]
                )
                db.add(problem)
    
    db.commit()
