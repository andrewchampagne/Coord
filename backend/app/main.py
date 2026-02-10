from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes.constellation import router as constellation_router
from app.routes.habits import router as habits_router
from app.routes.insights import router as insights_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Habit Constellation API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


app.include_router(habits_router)
app.include_router(constellation_router)
app.include_router(insights_router)
