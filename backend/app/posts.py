from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from . import database, models, schemas, auth, ai_risk
from .database import get_db
import json

router = APIRouter()

@router.post("/", response_model=schemas.Post)
def create_post(post: schemas.PostCreate, current_user: models.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    if not post.human_declared:
        raise HTTPException(status_code=400, detail="Human declaration required")
    risk_score = ai_risk.calculate_risk(post.body, current_user.id, db)
    status = models.PostStatus.needs_review if risk_score >= 0.75 else models.PostStatus.published
    db_post = models.Post(author_id=current_user.id, body=post.body, media_urls=json.dumps(post.media_urls) if post.media_urls else None, human_declared=post.human_declared, ai_risk_score=risk_score, status=status)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.get("/feed")
def get_feed(cursor: str = None, current_user: models.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    query = db.query(models.Post).filter(models.Post.status == models.PostStatus.published).join(models.User, models.Post.author_id == models.User.id).filter(
        (models.Post.author_id == current_user.id) | 
        (models.User.id.in_(
            db.query(models.Follow.following_id).filter(models.Follow.follower_id == current_user.id)
        ))
    ).order_by(desc(models.Post.created_at), desc(models.Post.id))
    if cursor:
        created_at, id = cursor.split('_')
        query = query.filter((models.Post.created_at < created_at) | ((models.Post.created_at == created_at) & (models.Post.id < id)))
    posts = query.limit(20).all()
    return posts

@router.get("/{post_id}", response_model=schemas.Post)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.delete("/{post_id}")
def delete_post(post_id: int, current_user: models.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id and current_user.role not in [models.UserRole.moderator, models.UserRole.admin]:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(post)
    db.commit()
    return {"message": "Deleted"}

@router.post("/{post_id}/like")
def like_post(post_id: int, current_user: models.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    like = models.Like(user_id=current_user.id, post_id=post_id)
    db.add(like)
    db.commit()
    return {"message": "Liked"}

@router.delete("/{post_id}/like")
def unlike_post(post_id: int, current_user: models.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    like = db.query(models.Like).filter(models.Like.user_id == current_user.id, models.Like.post_id == post_id).first()
    if not like:
        raise HTTPException(status_code=400, detail="Not liked")
    db.delete(like)
    db.commit()
    return {"message": "Unliked"}

@router.post("/{post_id}/comments", response_model=schemas.Comment)
def create_comment(post_id: int, comment: schemas.CommentCreate, current_user: models.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    db_comment = models.Comment(post_id=post_id, author_id=current_user.id, body=comment.body)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.get("/{post_id}/comments")
def get_comments(post_id: int, db: Session = Depends(get_db)):
    comments = db.query(models.Comment).filter(models.Comment.post_id == post_id).all()
    return comments