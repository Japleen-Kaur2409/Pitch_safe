import argparse
import pandas as pd
import numpy as np
import joblib

from feature_engineering import enrich_features
from train_injury_precise import add_trend_features

def load_model():
    clf = joblib.load('artifacts/injury_xgb_final.joblib')
    imputer, scaler, features = joblib.load('artifacts/injury_preprocessors.joblib')
    return clf, imputer, scaler, features

def predict_risk(df, clf, imputer, scaler, features, top_k_ratio=0.10):
    df = enrich_features(df)
    df = add_trend_features(df)

    df = df.dropna(subset=features + ['player_name', 'game_date'])
    X = df[features].copy()
    X = imputer.transform(X)
    X = scaler.transform(X)

    probs = clf.predict_proba(X)[:, 1]
    df['injury_risk_prob'] = probs

    df['risk_level'] = 'low'
    top_k = int(len(df) * top_k_ratio)
    top_indices = np.argsort(probs)[-top_k:]
    df.iloc[top_indices, df.columns.get_loc('risk_level')] = 'high'

    medium_cut = int(len(df) * 0.20)
    medium_indices = np.argsort(probs)[-medium_cut:-top_k]
    df.iloc[medium_indices, df.columns.get_loc('risk_level')] = 'medium'

    return df[['player_name', 'game_date', 'injury_risk_prob', 'risk_level', 'result']].sort_values('injury_risk_prob', ascending=False)

# Call this function from th web server
def run_inference_on_csv(csv_path, top_k_ratio=0.10, start_date=None):
    df = pd.read_csv(csv_path, parse_dates=['game_date'])
    if start_date:
        df = df[df['game_date'] >= pd.to_datetime(start_date)]

    clf, imputer, scaler, features = load_model()
    result_df = predict_risk(df, clf, imputer, scaler, features, top_k_ratio)
    return result_df

# CLI entrypoint
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--path', required=True)
    parser.add_argument('--top_k_ratio', type=float, default=0.10)
    parser.add_argument('--out_path', default='injury_risk_flags.csv')
    parser.add_argument('--start_date', default='2024-04-01')
    args = parser.parse_args()

    result_df = run_inference_on_csv(args.path, args.top_k_ratio, args.start_date)
    result_df.to_csv(args.out_path, index=False)
    print(f"Saved risk flags to: {args.out_path}")

if __name__ == '__main__':
    main()


"""
For !!!WEB USAGE!!!
# backend/api.py
from [...module...].flag_injury_risks import run_inference_on_csv

def handle_uploaded_file(filepath):
    df = run_inference_on_csv(filepath, top_k_ratio=0.05, start_date="2024-04-01")
    return df.to_dict(orient='records')
"""