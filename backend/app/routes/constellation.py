from datetime import date
from itertools import combinations

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import Habit, HabitCompletion, get_db
from app.models import ConstellationEdge, ConstellationNode, ConstellationResponse

router = APIRouter(prefix="/api/constellation", tags=["constellation"])

EDGE_WINDOW_MINUTES = 60


@router.get("/today", response_model=ConstellationResponse, status_code=status.HTTP_200_OK)
def get_today_constellation(db: Session = Depends(get_db)):
    today = date.today()
    completions = (
        db.query(HabitCompletion, Habit)
        .join(Habit, Habit.id == HabitCompletion.habit_id)
        .filter(HabitCompletion.date == today)
        .order_by(HabitCompletion.time.asc())
        .all()
    )

    node_map: dict[int, ConstellationNode] = {}
    time_map: dict[int, list] = {}

    for completion, habit in completions:
        if habit.id not in node_map:
            node_map[habit.id] = ConstellationNode(
                id=habit.id,
                label=habit.name,
                category=habit.category,
                size=max(12.0, completion.duration * 2.0 + 10.0),
                completed=True,
            )
        else:
            node_map[habit.id].size += max(2.0, completion.duration)

        time_map.setdefault(habit.id, []).append(completion.time)

    edges: list[ConstellationEdge] = []
    habit_ids = list(time_map.keys())
    for source_id, target_id in combinations(habit_ids, 2):
        times_a = time_map[source_id]
        times_b = time_map[target_id]
        min_diff = None
        for time_a in times_a:
            for time_b in times_b:
                diff_minutes = abs(
                    (time_a.hour * 60 + time_a.minute) - (time_b.hour * 60 + time_b.minute)
                )
                if min_diff is None or diff_minutes < min_diff:
                    min_diff = diff_minutes

        if min_diff is not None and min_diff <= EDGE_WINDOW_MINUTES:
            weight = max(0.1, 1 - (min_diff / EDGE_WINDOW_MINUTES))
            edges.append(ConstellationEdge(source=source_id, target=target_id, weight=weight))

    return ConstellationResponse(
        nodes=list(node_map.values()),
        edges=edges,
        date=today.isoformat(),
    )
