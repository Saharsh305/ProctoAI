import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import Base

TEST_DATABASE_URL = "postgresql://postgres:syslft@localhost:5433/ProctoAI_test"

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(bind=engine)

# Create tables ONCE
@pytest.fixture(scope="session", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    # DO NOT drop tables (FK hell)
    # Database can be dropped manually if needed

@pytest.fixture(scope="function", autouse=True)
def clean_tables():
    with engine.begin() as conn:
        conn.execute(text("TRUNCATE TABLE users CASCADE"))

@pytest.fixture(scope="function")
def client():
    import app.core.database as database

    def override_session():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    database.SessionLocal = override_session

    with TestClient(app) as c:
        yield c