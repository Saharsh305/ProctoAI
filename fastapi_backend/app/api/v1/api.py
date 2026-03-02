from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, teachers, questions, proctoring, window_events, exam

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(teachers.router)
api_router.include_router(questions.router)
api_router.include_router(proctoring.router)
api_router.include_router(window_events.router)
api_router.include_router(exam.router)
