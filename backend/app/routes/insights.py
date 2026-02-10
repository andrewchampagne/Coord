from collections import Counter
from datetime import date, timedelta
from itertools import combinations

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import Habit, HabitCompletion, get_db
from app.models import InsightModel

router = APIRouter(prefix="/api/insights", tags=["insights"])


@router.get("", response_model=list[InsightModel], status_code=status.HTTP_200_OK)
def get_insights(db: Session = Depends(get_db)):
    completions = db.query(HabitCompletion).order_by(HabitCompletion.date.asc()).all()
    if not completions:
        return [
            InsightModel(
                type="suggestion",
                text="Start logging habits to unlock constellation insights.",
                confidence=0.4,
            )
        ]

    dates = sorted({completion.date for completion in completions})
    if len(dates) < 7:
        return [
            InsightModel(
                type="suggestion",
                text="Great start! Keep logging habits for 7 days to unlock deeper insights.",
                confidence=0.5,
            )
        ]

    insights: list[InsightModel] = []

    # Streak detection
    max_streak = 1
    current_streak = 1
    for idx in range(1, len(dates)):
        if dates[idx] == dates[idx - 1] + timedelta(days=1):
            current_streak += 1
            max_streak = max(max_streak, current_streak)
        else:
            current_streak = 1
    if max_streak >= 3:
        insights.append(
            InsightModel(
                type="achievement",
                text=f"You're on fire! Your longest streak is {max_streak} days.",
                confidence=min(0.9, 0.5 + max_streak / 20),
            )
        )

    # Weak day detection
    weekday_counts = Counter()
    for completion in completions:
        weekday_counts[completion.date.strftime("%A")] += 1
    if weekday_counts:
        weakest_day, weakest_count = min(weekday_counts.items(), key=lambda item: item[1])
        insights.append(
            InsightModel(
                type="suggestion",
                text=f"{weakest_day} tends to be quieter. Try a small habit boost that day.",
                confidence=0.6 if weakest_count < 3 else 0.45,
            )
        )

    # Co-occurrence patterns
    completions_by_date: dict[date, set[int]] = {}
    for completion in completions:
        completions_by_date.setdefault(completion.date, set()).add(completion.habit_id)

    pair_counts = Counter()
    for habit_ids in completions_by_date.values():
        for pair in combinations(sorted(habit_ids), 2):
            pair_counts[pair] += 1
    if pair_counts:
        (habit_a, habit_b), count = pair_counts.most_common(1)[0]
        if count >= 3:
            habit_names = {
                habit.id: habit.name
                for habit in db.query(Habit).filter(Habit.id.in_([habit_a, habit_b])).all()
            }
            name_a = habit_names.get(habit_a, "Habit A")
            name_b = habit_names.get(habit_b, "Habit B")
            insights.append(
                InsightModel(
                    type="correlation",
                    text=f"{name_a} and {name_b} often light up together. Try stacking them.",
                    confidence=min(0.85, 0.4 + count / 10),
                )
            )

    if not insights:
        insights.append(
            InsightModel(
                type="suggestion",
                text="Keep exploring new habit combos to reveal your constellation patterns.",
                confidence=0.45,
            )
        )

    return insights[:3]
