"""create admin_actions table

Revision ID: f1a2b3c4d5e6
Revises: e6f7a8b9c0d1
Create Date: 2026-04-01 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f1a2b3c4d5e6'
down_revision: Union[str, None] = 'e6f7a8b9c0d1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'admin_actions',
        sa.Column('action_id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('violation_id', sa.Integer(), sa.ForeignKey('violations.vid'), nullable=False, index=True),
        sa.Column('action_type', sa.String(20), nullable=False),
        sa.Column('reason', sa.Text(), nullable=True),
        sa.Column('performed_by', sa.Uuid(as_uuid=True), sa.ForeignKey('users.user_id'), nullable=False, index=True),
        sa.Column('performed_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('admin_actions')
