from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
from collections import Counter
from sqlalchemy.orm import Session
from . import models

def calculate_risk(body: str, user_id: int, db: Session) -> float:
    score = 0.0
    # Length: long posts suspicious
    if len(body) > 1000:
        score += 0.2
    # Repetition: high repetition rate
    words = body.lower().split()
    if words:
        freq = Counter(words)
        repetition = sum(1 for count in freq.values() if count > 1) / len(words)
        score += min(repetition * 2, 0.3)
    # Punctuation: low punctuation variation
    punct = re.findall(r'[.!?]', body)
    if punct:
        unique_punct = len(set(punct))
        score += (1 - unique_punct / len(punct)) * 0.2
    # Burst posting: check recent posts (simplified, assume no burst for now)
    # Similarity to last post
    if db:
        last_post = db.query(models.Post).filter(models.Post.author_id == user_id).order_by(models.Post.created_at.desc()).first()
        if last_post:
            vectorizer = TfidfVectorizer()
            tfidf = vectorizer.fit_transform([body, last_post.body])
            sim = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
            score += sim * 0.3
    return min(score, 1.0)