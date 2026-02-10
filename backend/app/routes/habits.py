from datetime import date, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import Habit, HabitCompletion, get_db
from app.models import HabitCompletionModel, HabitModel

router = APIRouter(prefix="/api/habits", tags=["habits"])


class HabitCreate(BaseModel):
    name: str
    category: str
    difficulty: str


class HabitCompleteRequest(BaseModel):
    habit_id: int
    duration: float


@router.get("", response_model=list[HabitModel], status_code=status.HTTP_200_OK)
def get_habits(db: Session = Depends(get_db)):
    return db.query(Habit).order_by(Habit.created_at.desc()).all()


@router.post("", response_model=HabitModel, status_code=status.HTTP_201_CREATED)
def create_habit(payload: HabitCreate, db: Session = Depends(get_db)):
    habit = Habit(
        name=payload.name.strip(),
        category=payload.category.strip() or "other",
        difficulty=payload.difficulty.strip() or "medium",
    )
    db.add(habit)
    db.commit()
    db.refresh(habit)
    return habit


@router.post(
    "/complete",
    response_model=HabitCompletionModel,
    status_code=status.HTTP_201_CREATED,
)
def complete_habit(payload: HabitCompleteRequest, db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.id == payload.habit_id).first()
    if not habit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")

    completion = HabitCompletion(
        habit_id=payload.habit_id,
        date=date.today(),
        time=datetime.now().time(),
        duration=payload.duration,
    )
    db.add(completion)
    db.commit()
    db.refresh(completion)
    return completion


@router.get("/today", response_model=list[HabitCompletionModel], status_code=status.HTTP_200_OK)
def get_today_completions(db: Session = Depends(get_db)):
    today = date.today()
    return (
        db.query(HabitCompletion)
        .filter(HabitCompletion.date == today)
        .order_by(HabitCompletion.time.asc())
        .all()
    )
