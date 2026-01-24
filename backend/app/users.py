from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import database, models, schemas, auth
from .database import get_db

router = APIRouter()

@router.get("/{username}", response_model=schemas.User)
def get_user(username: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/me", response_model=schemas.User)
def update_user(user_update: schemas.UserBase, current_user: models.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    for key, value in user_update.dict(exclude_unset=True).items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/{username}/posts")
def get_user_posts(username: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    posts = db.query(models.Post).filter(models.Post.author_id == user.id, models.Post.status == models.PostStatus.published).all()
    return posts

@router.post("/{username}/follow")
def follow_user(username: str, current_user: models.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    target_user = db.query(models.User).filter(models.User.username == username).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    follow = models.Follow(follower_id=current_user.id, following_id=target_user.id)
    db.add(follow)
    db.commit()
    return {"message": "Followed"}

@router.delete("/{username}/follow")
def unfollow_user(username: str, current_user: models.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    target_user = db.query(models.User).filter(models.User.username == username).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    follow = db.query(models.Follow).filter(models.Follow.follower_id == current_user.id, models.Follow.following_id == target_user.id).first()
    if not follow:
        raise HTTPException(status_code=400, detail="Not following")
    db.delete(follow)
    db.commit()
    return {"message": "Unfollowed"}

@router.get("/me/following")
def get_following(current_user: models.User = Depends(auth.get_current_active_user), db: Session = Depends(get_db)):
    following = db.query(models.User).join(models.Follow, models.Follow.following_id == models.User.id).filter(models.Follow.follower_id == current_user.id).all()
    return following

@router.get("/{username}/followers")
def get_followers(username: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    followers = db.query(models.User).join(models.Follow, models.Follow.follower_id == models.User.id).filter(models.Follow.following_id == user.id).all()
    return followers