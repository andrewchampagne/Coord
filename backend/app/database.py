from datetime import date, time

from sqlalchemy import Boolean, Column, Date, Float, ForeignKey, Integer, String, Time
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy import create_engine

DATABASE_URL = "sqlite:///./habits.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False, default="other")
    difficulty = Column(String, nullable=False, default="medium")
    created_at = Column(Date, nullable=False, default=date.today)


class HabitCompletion(Base):
    __tablename__ = "completions"

    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, ForeignKey("habits.id"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    time = Column(Time, nullable=False)
    duration = Column(Float, nullable=False, default=0.0)


class UserStats(Base):
    __tablename__ = "user_stats"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False, unique=True, index=True)
    habits_completed = Column(Integer, nullable=False, default=0)
    streak_count = Column(Integer, nullable=False, default=0)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
