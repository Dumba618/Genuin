from app.ai_risk import calculate_risk

def test_calculate_risk():
    # Mock db as None, so similarity check is skipped
    score = calculate_risk("This is a test post.", 1, None)
    assert 0 <= score <= 1