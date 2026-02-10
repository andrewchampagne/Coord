# Coord

Habit tracking app scaffold with a FastAPI backend and an Expo (React Native) frontend.

## Backend setup

1. Create and activate a virtual environment:
   - Windows (PowerShell):
     - `cd backend`
     - `python -m venv .venv`
     - `./.venv/Scripts/Activate.ps1`
   - macOS/Linux:
     - `cd backend`
     - `python3 -m venv .venv`
     - `source .venv/bin/activate`
2. Install dependencies:
   - `pip install -r requirements.txt`

## Frontend setup

1. Install dependencies:
   - `cd frontend`
   - `npm install`

## Run the backend

- `cd backend`
- `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`

## Run the frontend

- `cd frontend`
- `npx expo start`
