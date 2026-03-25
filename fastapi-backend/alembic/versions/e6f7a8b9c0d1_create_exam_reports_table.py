"""create exam_reports table

Revision ID: e6f7a8b9c0d1
Revises: d5e6f7a8b9c0
Create Date: 2026-03-25 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e6f7a8b9c0d1'
down_revision: Union[str, None] = 'd5e6f7a8b9c0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'exam_reports',
        sa.Column('report_id', sa.Integer(), primary_key=True),
        sa.Column('test_id', sa.String(100), nullable=False, index=True),
        sa.Column('email', sa.String(100), nullable=False, index=True),
        sa.Column('trust_score', sa.Integer(), nullable=False, server_default='100'),
        sa.Column('total_violations', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('penalty', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('violation_breakdown_json', sa.Text(), nullable=True),
        sa.Column('summary', sa.Text(), nullable=True),
        sa.Column('pdf_path', sa.Text(), nullable=True),
        sa.Column('generated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('uid', sa.Uuid(as_uuid=True), sa.ForeignKey('users.user_id'), nullable=False, index=True),
    )


def downgrade() -> None:
    op.drop_table('exam_reports')
