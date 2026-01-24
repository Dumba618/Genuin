from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from .models import UserRole, UserStatus, PostStatus, ReportStatus, ModerationActionType

class UserBase(BaseModel):
    email: EmailStr
    username: str
    name: str
    bio: Optional[str] = None
    headline: Optional[str] = None
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    role: UserRole
    status: UserStatus
    created_at: datetime

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class PostBase(BaseModel):
    body: str
    media_urls: Optional[List[str]] = None
    human_declared: bool

class PostCreate(PostBase):
    pass

class Post(PostBase):
    id: int
    author_id: int
    ai_risk_score: float
    status: PostStatus
    created_at: datetime

class CommentBase(BaseModel):
    body: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    post_id: int
    author_id: int
    created_at: datetime

class ReportBase(BaseModel):
    target_type: str
    target_id: int
    reason: str
    details: Optional[str] = None

class ReportCreate(ReportBase):
    pass

class Report(ReportBase):
    id: int
    reporter_id: int
    status: ReportStatus
    created_at: datetime

class ModerationActionBase(BaseModel):
    action_type: ModerationActionType
    target_type: str
    target_id: int
    notes: Optional[str] = None

class ModerationActionCreate(ModerationActionBase):
    pass

class ModerationAction(ModerationActionBase):
    id: int
    moderator_id: int
    created_at: datetime