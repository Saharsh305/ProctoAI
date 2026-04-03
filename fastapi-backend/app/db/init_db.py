import logging
from sqlalchemy.exc import ProgrammingError
from app.db.session import engine
from app.db.base import Base

logger = logging.getLogger(__name__)


def init_db() -> None:
    """
    Initialize database tables.

    Creates tables based on SQLAlchemy models if they don't exist.

    Note: This uses create_all() which only creates missing tables.
    If you encounter schema conflicts (like foreign key errors), you need to:
    1. For development: Drop and recreate the database using scripts/reset_db.py
    2. For production: Use Alembic migrations with 'alembic upgrade head'

    Raises:
        ProgrammingError: If there are schema conflicts (e.g., foreign key constraints
                         referencing non-existent columns). This usually means the
                         database has an old schema that conflicts with current models.
    """
    try:
        # Import all models to register them with Base
        import app.models  # noqa: F401

        logger.info("Initializing database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully")

    except ProgrammingError as e:
        error_msg = str(e.orig) if hasattr(e, 'orig') else str(e)

        logger.error(f"Database schema error: {error_msg}")
        logger.error("=" * 60)
        logger.error("DATABASE SCHEMA CONFLICT DETECTED")
        logger.error("=" * 60)
        logger.error("This error typically occurs when:")
        logger.error("  - The database has tables from an old schema")
        logger.error("  - Foreign key constraints reference non-existent columns")
        logger.error("")
        logger.error("SOLUTIONS:")
        logger.error("")
        logger.error("For DEVELOPMENT environments:")
        logger.error("  1. Run: python scripts/reset_db.py")
        logger.error("     (This will DROP ALL DATA and recreate tables)")
        logger.error("")
        logger.error("  2. Or manually drop the database and recreate it:")
        logger.error("     DROP DATABASE quizapp;")
        logger.error("     CREATE DATABASE quizapp;")
        logger.error("")
        logger.error("For PRODUCTION environments:")
        logger.error("  1. Use Alembic migrations:")
        logger.error("     alembic upgrade head")
        logger.error("")
        logger.error("To diagnose the issue:")
        logger.error("  python scripts/check_db_schema.py")
        logger.error("=" * 60)

        # Re-raise the exception to prevent the application from starting
        # with a broken database schema
        raise
    except Exception as e:
        logger.error(f"Unexpected error during database initialization: {e}")
        raise
