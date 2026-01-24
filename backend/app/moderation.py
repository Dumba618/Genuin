from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import database, models, schemas, auth
from .database import get_db

router = APIRouter()

@router.get("/queue")
def get_moderation_queue(current_user: models.User = Depends(auth.get_current_moderator), db: Session = Depends(get_db)):
    posts = db.query(models.Post).filter(models.Post.status == models.PostStatus.needs_review).all()
    reports = db.query(models.Report).filter(models.Report.status == models.ReportStatus.open).all()
    return {"posts": posts, "reports": reports}

@router.post("/posts/{post_id}/approve")
def approve_post(post_id: int, current_user: models.User = Depends(auth.get_current_moderator), db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.status = models.PostStatus.published
    action = models.ModerationAction(moderator_id=current_user.id, action_type=models.ModerationActionType.approve_post, target_type="post", target_id=post_id)
    db.add(action)
    db.commit()
    return {"message": "Approved"}

@router.post("/posts/{post_id}/remove")
def remove_post(post_id: int, current_user: models.User = Depends(auth.get_current_moderator), db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.status = models.PostStatus.removed
    action = models.ModerationAction(moderator_id=current_user.id, action_type=models.ModerationActionType.remove_post, target_type="post", target_id=post_id)
    db.add(action)
    db.commit()
    return {"message": "Removed"}

@router.post("/users/{user_id}/suspend")
def suspend_user(user_id: int, current_user: models.User = Depends(auth.get_current_moderator), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.status = models.UserStatus.suspended
    action = models.ModerationAction(moderator_id=current_user.id, action_type=models.ModerationActionType.suspend_user, target_type="user", target_id=user_id)
    db.add(action)
    db.commit()
    return {"message": "Suspended"}

@router.post("/users/{user_id}/ban")
def ban_user(user_id: int, current_user: models.User = Depends(auth.get_current_moderator), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.status = models.UserStatus.banned
    action = models.ModerationAction(moderator_id=current_user.id, action_type=models.ModerationActionType.ban_user, target_type="user", target_id=user_id)
    db.add(action)
    db.commit()
    return {"message": "Banned"}

@router.get("/actions")
def get_moderation_actions(current_user: models.User = Depends(auth.get_current_moderator), db: Session = Depends(get_db)):
    actions = db.query(models.ModerationAction).order_by(models.ModerationAction.created_at.desc()).all()
    return actions