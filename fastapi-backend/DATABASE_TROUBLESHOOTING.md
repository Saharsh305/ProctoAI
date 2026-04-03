# Database Troubleshooting Guide

## Common Error: "column referenced in foreign key constraint does not exist"

### Problem Description

When starting the FastAPI backend, you may encounter an error like:

```
sqlalchemy.exc.ProgrammingError: (psycopg.errors.UndefinedColumn)
column "user_id" referenced in foreign key constraint does not exist
```

This error occurs when the database has tables from an old schema that conflicts with the current SQLAlchemy models.

### Root Cause

The application uses `Base.metadata.create_all()` to create database tables. When tables already exist with different column names or structures, SQLAlchemy tries to create new tables with foreign keys that reference columns that don't exist in the old schema.

For example:
- Old schema: `users` table has primary key column named `uid`
- New schema: `users` table has primary key column named `user_id`
- The `violations` table tries to create a foreign key to `users.user_id`, but that column doesn't exist

### Solutions

#### Option 1: Reset Database (Development Only)

**WARNING: This will delete all data in your database!**

Use the provided reset script:

```bash
cd fastapi-backend
python scripts/reset_db.py
```

This script will:
1. Drop all existing tables
2. Recreate them with the correct schema

#### Option 2: Manual Database Reset

If you prefer to do it manually:

```bash
# Connect to PostgreSQL
psql -U postgres

# Drop and recreate the database
DROP DATABASE quizapp;
CREATE DATABASE quizapp;

# Exit psql
\q
```

Then start your application:

```bash
uvicorn app.main:app --reload
```

#### Option 3: Use Alembic Migrations (Recommended for Production)

Instead of using `create_all()`, use Alembic to manage schema changes:

```bash
cd fastapi-backend

# Run all migrations
alembic upgrade head
```

### Diagnostic Tools

#### Check Database Schema

To inspect your current database schema and identify discrepancies:

```bash
python scripts/check_db_schema.py
```

This will show:
- Tables in database vs. tables in models
- Missing or extra columns
- Foreign key relationships

### Prevention

To avoid this issue in the future:

1. **Use Alembic for schema changes**: Don't modify models directly in production. Create migrations instead.

   ```bash
   # After changing models
   alembic revision --autogenerate -m "describe your changes"
   alembic upgrade head
   ```

2. **Keep development and production databases in sync**: Always test migrations in development before applying to production.

3. **Don't use `create_all()` in production**: It's only suitable for initial development. Use migrations for all schema changes.

### Understanding the Schema

#### Users Table

Primary key column: `user_id` (UUID)

```python
class User(Base):
    __tablename__ = "users"
    user_id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True)
    # ... other columns
```

#### Violations Table

Foreign key to users: `uid` → `users.user_id`

```python
class Violation(Base):
    __tablename__ = "violations"
    uid: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("users.user_id"), nullable=False
    )
    # ... other columns
```

### Additional Help

If you continue to experience issues:

1. Check your database connection settings in `.env`:
   ```
   DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/quizapp
   ```

2. Verify PostgreSQL is running:
   ```bash
   pg_isready
   ```

3. Check PostgreSQL logs for more details about the error

4. Run the schema checker to identify specific mismatches:
   ```bash
   python scripts/check_db_schema.py
   ```
