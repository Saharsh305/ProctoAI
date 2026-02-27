from fastapi import FastAPI
from app.routers import auth

app = FastAPI(title="ProctoAI Backend")

app.include_router(auth.router)

@app.get("/")
def health():
    return {"status": "running"}