# FastAPI Backend (PostgreSQL)

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

Edit `.env` and set at minimum:
- `DATABASE_URL` — your PostgreSQL connection string
- `SECRET_KEY` — a random secret used to sign JWTs

## Run

```bash
cd fastapi_backend
uvicorn app.main:app --reload
```

- Health check: `GET http://127.0.0.1:8000/health`
- API base: `http://127.0.0.1:8000/api/v1`
- Interactive docs (Swagger UI): `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Swagger UI Authentication

The Swagger UI "Authorize" button uses the OAuth2 password flow. To test protected endpoints:

1. Open `http://127.0.0.1:8000/docs`
2. First create a user via `POST /api/v1/auth/signup`
3. Click the **Authorize** button (🔒) and enter your email as **username** and your password
4. All protected endpoints will now send the JWT automatically

Alternatively, call `POST /api/v1/auth/login` with a JSON body `{"email": "...", "password": "..."}` to get a token, then click the **Authorize** button, enter `Bearer <your_token>` in the **Value** field, and click Authorize.

## API Routes

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/signup` | Register a new user |
| POST | `/api/v1/auth/login` | Login with JSON body `{email, password}` → JWT |
| GET | `/api/v1/auth/me` | Get the currently authenticated user |
| GET | `/api/v1/auth/admin-only` | Admin-only test route |
| GET | `/api/v1/auth/student-only` | Student-only test route |

### Users
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/users/` | List all users |
| GET | `/api/v1/users/{user_id}` | Get a user by UUID |
| POST | `/api/v1/users/` | Create a user |
| PATCH | `/api/v1/users/{user_id}` | Update a user |

### Exams
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/exam/create` | Create an exam (admin only) |

### Teachers / Tests
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/teachers/` | List all teacher test records |
| GET | `/api/v1/teachers/{tid}` | Get a teacher record by ID |
| POST | `/api/v1/teachers/` | Create a teacher test record |

### Questions
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/questions/` | List all questions |
| POST | `/api/v1/questions/` | Create a question |

### Proctoring Logs
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/proctoring/logs` | List proctoring logs (filter by `email`, `test_id`) |
| POST | `/api/v1/proctoring/logs` | Create a proctoring log entry |

### Window Events
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/window-events/` | List window events (filter by `email`, `test_id`) |
| POST | `/api/v1/window-events/` | Create a window event entry |

## Running Tests

```bash
pip install -r requirements-test.txt
pytest tests/ -v
```

Tests use an in-memory SQLite database — no PostgreSQL required.

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
