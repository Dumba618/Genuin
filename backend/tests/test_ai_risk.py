from ..app.ai_risk import calculate_risk

def test_calculate_risk():
    # Mock db
    score = calculate_risk("This is a test post.", 1, None)
    assert 0 <= score <= 1