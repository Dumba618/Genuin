import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

@pytest.fixture(scope="function")
def test_db():
    SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    yield TestingSessionLocal
    
    # Drop tables
    Base.metadata.drop_all(bind=engine)

def override_get_db(db_session):
    def get_db_override():
        try:
            yield db_session
        finally:
            db_session.close()
    return get_db_override

def test_register(test_db):
    db = test_db()
    app.dependency_overrides[get_db] = override_get_db(db)
    client = TestClient(app)
    
    response = client.post("/auth/register", json={"email": "test@example.com", "username": "testuser", "password": "pass", "name": "Test"})
    assert response.status_code == 200
    assert "access_token" in response.json()