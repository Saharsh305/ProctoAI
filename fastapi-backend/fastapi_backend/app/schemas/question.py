import uuid
from pydantic import BaseModel, ConfigDict


class QuestionBase(BaseModel):
    test_id: str
    qid: str
    q: str
    a: str
    b: str
    c: str
    d: str
    ans: str
    marks: int
    uid: uuid.UUID


class QuestionCreate(QuestionBase):
    pass


class QuestionOut(QuestionBase):
    model_config = ConfigDict(from_attributes=True)
    questions_uid: int
