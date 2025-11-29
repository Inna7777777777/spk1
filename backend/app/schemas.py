from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserBase(BaseModel):
    id: int
    email: EmailStr
    name: Optional[str] = None
    role: str
    plot_number: Optional[str] = None

    class Config:
        orm_mode = True


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None
    plot_number: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class NewsBase(BaseModel):
    id: int
    title: str
    body: str
    created_at: datetime

    class Config:
        orm_mode = True


class NewsCreate(BaseModel):
    title: str
    body: str


class PaymentBase(BaseModel):
    id: int
    user_id: int
    kind: str
    amount: float
    status: str
    created_at: datetime
    paid_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class PaymentCreate(BaseModel):
    user_id: int
    kind: str
    amount: float


class DocumentBase(BaseModel):
    id: int
    title: str
    category: Optional[str] = None
    file_url: str
    is_public: bool
    created_at: datetime

    class Config:
        orm_mode = True


class DocumentCreate(BaseModel):
    title: str
    category: Optional[str] = None
    file_url: str
    is_public: bool = True


class ForumPostBase(BaseModel):
    id: int
    body: str
    created_at: datetime

    class Config:
        orm_mode = True


class ForumPostCreate(BaseModel):
    body: str


class ForumTopicBase(BaseModel):
    id: int
    title: str
    created_at: datetime

    class Config:
        orm_mode = True


class ForumTopicDetail(ForumTopicBase):
    posts: List[ForumPostBase] = []


class ForumTopicCreate(BaseModel):
    title: str


class VoteOptionBase(BaseModel):
    id: int
    text: str

    class Config:
        orm_mode = True


class VoteBase(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True


class VoteDetail(VoteBase):
    options: List[VoteOptionBase] = []


class VoteCreate(BaseModel):
    title: str
    description: Optional[str] = None
    options: List[str]


class VoteAnswerCreate(BaseModel):
    vote_id: int
    option_id: int


class VoteResultItem(BaseModel):
    option_id: int
    text: str
    votes: int


class VoteResults(BaseModel):
    vote_id: int
    title: str
    results: List[VoteResultItem]


class PlotBase(BaseModel):
    id: int
    number: str
    owner_name: Optional[str] = None
    status: str
    comment: Optional[str] = None

    class Config:
        orm_mode = True


class PlotCreate(BaseModel):
    number: str
    owner_name: Optional[str] = None
    status: str = "ok"
    comment: Optional[str] = None


class PlotUpdate(BaseModel):
    owner_name: Optional[str] = None
    status: Optional[str] = None
    comment: Optional[str] = None


class ChatMessageBase(BaseModel):
    id: int
    body: str
    created_at: datetime

    class Config:
        orm_mode = True


class ChatMessageCreate(BaseModel):
    body: str


# ---------- Admin helpers ----------

class AdminUserUpdate(BaseModel):
    role: Optional[str] = None
    name: Optional[str] = None
    plot_number: Optional[str] = None
    is_active: Optional[bool] = None


class AdminStats(BaseModel):
    users: int
    plots: int
    payments: int
    news: int
