from datetime import date, time
from typing import List

from pydantic import BaseModel


class HabitModel(BaseModel):
    id: int
    name: str
    category: str
    difficulty: str
    created_at: date

    class Config:
        orm_mode = True


class HabitCompletionModel(BaseModel):
    id: int
    habit_id: int
    date: date
    time: time
    duration: float

    class Config:
        orm_mode = True


class ConstellationNode(BaseModel):
    id: int
    label: str
    category: str
    size: float
    completed: bool


class ConstellationEdge(BaseModel):
    source: int
    target: int
    weight: float


class ConstellationResponse(BaseModel):
    nodes: List[ConstellationNode]
    edges: List[ConstellationEdge]
    date: str


class InsightModel(BaseModel):
    type: str
    text: str
    confidence: float
