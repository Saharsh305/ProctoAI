from enum import Enum


class Role(str, Enum):
    ROLE_ADMIN = "admin"
    ROLE_STUDENT = "student"
