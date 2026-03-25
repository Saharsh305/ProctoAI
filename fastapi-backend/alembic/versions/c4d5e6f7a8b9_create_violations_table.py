"""create violations table

Revision ID: c4d5e6f7a8b9
Revises: b3c2d1e4f5a6
Create Date: 2026-03-25 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c4d5e6f7a8b9'
down_revision: Union[str, None] = 'b3c2d1e4f5a6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'violations',
        sa.Column('vid', sa.Integer(), primary_key=True),
        sa.Column('email', sa.String(100), nullable=False, index=True),
        sa.Column('test_id', sa.String(100), nullable=False, index=True),
        sa.Column('violation_type', sa.String(50), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('severity', sa.String(20), server_default='warning', nullable=False),
        sa.Column('metadata_json', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('uid', sa.Uuid(as_uuid=True), sa.ForeignKey('users.user_id'), nullable=False, index=True),
    )


def downgrade() -> None:
    op.drop_table('violations')
