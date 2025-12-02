import pandas as pd
import numpy as np
from unittest.mock import MagicMock
from flag_injury_risks import predict_risk


def test_predict_risk_normal_case(monkeypatch):
    # Fake dataframe
    df = pd.DataFrame({
        "player_name": ["A", "B"],
        "game_date": ["2024-01-01", "2024-01-02"],
        "f1": [1, 2],
        "f2": [3, 4],
        "Injury": [0, 1]
    })

    df["game_date"] = pd.to_datetime(df["game_date"])

    # Mock feature list
    features = ["f1", "f2"]

    # Mock enrich and trend functions to return df unchanged
    monkeypatch.setattr("flag_injury_risks.enrich_features", lambda x: x)
    monkeypatch.setattr("flag_injury_risks.add_trend_features", lambda x: x)

    # Mock imputer and scaler to return X unchanged
    fake_imputer = MagicMock()
    fake_imputer.transform.return_value = df[features].values

    fake_scaler = MagicMock()
    fake_scaler.transform.return_value = df[features].values

    # Mock classifier to output fixed probabilities
    fake_clf = MagicMock()
    fake_clf.predict_proba.return_value = np.array([
        [0.1, 0.9],  # first row high risk
        [0.8, 0.2]   # second row low risk
    ])

    output = predict_risk(df.copy(), fake_clf, fake_imputer, fake_scaler, features)

    assert len(output) == 2
    assert "injury_risk_prob" in output.columns
    assert "risk_level" in output.columns


def test_predict_risk_empty_after_dropna(monkeypatch):
    df = pd.DataFrame({
        "player_name": [None],
        "game_date": [None],
        "f1": [None],
        "f2": [None],
        "Injury": [0]
    })

    features = ["f1", "f2"]

    # Mock functions
    monkeypatch.setattr("flag_injury_risks.enrich_features", lambda x: x)
    monkeypatch.setattr("flag_injury_risks.add_trend_features", lambda x: x)

    fake_imputer = MagicMock()
    fake_imputer.transform.return_value = np.array([[0, 0]])

    fake_scaler = MagicMock()
    fake_scaler.transform.return_value = np.array([[0, 0]])

    fake_clf = MagicMock()
    fake_clf.predict_proba.return_value = np.array([[0.1, 0.9]])

    output = predict_risk(df, fake_clf, fake_imputer, fake_scaler, features)

    # Just check the function returns a properly structured dataframe
    assert len(output) == 1
    assert "injury_risk_prob" in output.columns
    assert "risk_level" in output.columns
