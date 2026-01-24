from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, Enum, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum

class UserRole(str, enum.Enum):
    user = "user"
    moderator = "moderator"
    admin = "admin"

class UserStatus(str, enum.Enum):
    active = "active"
    suspended = "suspended"
    banned = "banned"

class PostStatus(str, enum.Enum):
    published = "published"
    needs_review = "needs_review"
    removed = "removed"

class ReportStatus(str, enum.Enum):
    open = "open"
    resolved = "resolved"

class ModerationActionType(str, enum.Enum):
    approve_post = "approve_post"
    remove_post = "remove_post"
    suspend_user = "suspend_user"
    ban_user = "ban_user"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    bio = Column(Text, nullable=True)
    headline = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    role = Column(Enum(UserRole), default=UserRole.user)
    status = Column(Enum(UserStatus), default=UserStatus.active)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Follow(Base):
    __tablename__ = "follows"
    follower_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    following_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    body = Column(Text)
    media_urls = Column(String, nullable=True)  # JSON array as string
    human_declared = Column(Boolean, default=False)
    ai_risk_score = Column(Float, default=0.0)
    status = Column(Enum(PostStatus), default=PostStatus.published)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"))
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    body = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Like(Base):
    __tablename__ = "likes"
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    target_type = Column(String)  # "post" or "user"
    target_id = Column(Integer)
    reason = Column(String)
    details = Column(Text, nullable=True)
    status = Column(Enum(ReportStatus), default=ReportStatus.open)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ModerationAction(Base):
    __tablename__ = "moderation_actions"
    id = Column(Integer, primary_key=True, index=True)
    moderator_id = Column(Integer, ForeignKey("users.id"))
    action_type = Column(Enum(ModerationActionType))
    target_type = Column(String)
    target_id = Column(Integer)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())