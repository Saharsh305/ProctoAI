# FastAPI Backend (PostgreSQL)

This folder is a parallel backend for the existing Flask app.

## Setup

1) Create a virtualenv (recommended) and install deps:

```bash
cd fastapi_backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2) Configure env:

```bash
cp .env.example .env
```

Update `DATABASE_URL` to your Postgres instance.

## Run

```bash
cd fastapi_backend
uvicorn app.main:app --reload
```

- Health check: `GET http://127.0.0.1:8000/health`
- API base: `http://127.0.0.1:8000/api/v1`

## Current API routes

- `GET /api/v1/users/`
- `GET /api/v1/users/{uid}`
- `POST /api/v1/users/`
- `PATCH /api/v1/users/{uid}`

- `GET /api/v1/teachers/`
- `GET /api/v1/teachers/{tid}`
- `POST /api/v1/teachers/`

- `GET /api/v1/questions/`
- `POST /api/v1/questions/`

- `GET /api/v1/proctoring/logs`
- `POST /api/v1/proctoring/logs`

- `GET /api/v1/window-events/`
- `POST /api/v1/window-events/`

## Database

You can either:

- Import the provided dump: `db/quizapp_postgres_dump.sql`, or
- Use Alembic migrations (recommended going forward).

### Alembic

From `fastapi_backend/`:

```bash
alembic revision --autogenerate -m "init"
alembic upgrade head
```

Alembic reads `DATABASE_URL` from `.env` via `app.core.config.settings`.
