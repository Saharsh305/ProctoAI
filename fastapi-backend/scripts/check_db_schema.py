"""
Database schema checker script.

This script inspects the current database schema and compares it with
the expected SQLAlchemy models to identify discrepancies.
"""
import sys
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import inspect
from app.db.session import engine
from app.db.base import Base
import app.models  # noqa: F401 - Import all models to register them


def check_database_schema():
    """Check the current database schema."""
    inspector = inspect(engine)

    print("=" * 60)
    print("DATABASE SCHEMA CHECKER")
    print("=" * 60)
    print(f"Database: {engine.url}\n")

    # Get all tables in the database
    existing_tables = inspector.get_table_names()

    # Get all tables defined in models
    model_tables = Base.metadata.tables.keys()

    print(f"Tables in database: {len(existing_tables)}")
    print(f"Tables in models:   {len(model_tables)}\n")

    # Check for missing tables
    missing_tables = set(model_tables) - set(existing_tables)
    if missing_tables:
        print("⚠ Missing tables (defined in models but not in database):")
        for table in missing_tables:
            print(f"  - {table}")
        print()

    # Check for extra tables
    extra_tables = set(existing_tables) - set(model_tables)
    if extra_tables:
        print("⚠ Extra tables (in database but not in models):")
        for table in extra_tables:
            print(f"  - {table}")
        print()

    # Check each table's schema
    print("Checking table schemas:")
    print("-" * 60)

    for table_name in sorted(set(existing_tables) & set(model_tables)):
        print(f"\n📋 Table: {table_name}")

        # Get columns from database
        db_columns = {col['name']: col for col in inspector.get_columns(table_name)}

        # Get columns from model
        model_table = Base.metadata.tables[table_name]
        model_columns = {col.name: col for col in model_table.columns}

        # Check for column mismatches
        missing_cols = set(model_columns.keys()) - set(db_columns.keys())
        extra_cols = set(db_columns.keys()) - set(model_columns.keys())

        if missing_cols:
            print(f"  ⚠ Missing columns: {', '.join(missing_cols)}")

        if extra_cols:
            print(f"  ⚠ Extra columns: {', '.join(extra_cols)}")

        if not missing_cols and not extra_cols:
            print(f"  ✓ All columns present")

        # Check foreign keys
        db_fks = inspector.get_foreign_keys(table_name)
        if db_fks:
            print(f"  Foreign keys:")
            for fk in db_fks:
                ref_table = fk['referred_table']
                ref_cols = ', '.join(fk['referred_columns'])
                local_cols = ', '.join(fk['constrained_columns'])
                print(f"    - {local_cols} -> {ref_table}({ref_cols})")

    print("\n" + "=" * 60)

    if missing_tables or extra_tables:
        print("\n⚠ Schema mismatch detected!")
        print("\nRecommended actions:")
        print("  1. For development: Run 'python scripts/reset_db.py'")
        print("  2. For production: Use Alembic migrations")
    else:
        print("\n✓ Schema check completed")


if __name__ == "__main__":
    try:
        check_database_schema()
    except Exception as e:
        print(f"\n✗ Error connecting to database: {e}")
        print("\nMake sure:")
        print("  - PostgreSQL is running")
        print("  - Database connection settings in .env are correct")
        sys.exit(1)
