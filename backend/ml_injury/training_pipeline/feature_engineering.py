# === FILE: advanced_features.py ===
import pandas as pd
import numpy as np

def compute_acwr(df, pitch_col='total_pitches', acute_w=3, chronic_w=10):
    df = df.sort_values(['player_name', 'game_date'])
    df['acute_workload'] = df.groupby('player_name')[pitch_col].transform(lambda x: x.rolling(acute_w, min_periods=1).mean())
    df['chronic_workload'] = df.groupby('player_name')[pitch_col].transform(lambda x: x.rolling(chronic_w, min_periods=1).mean())
    df['acwr'] = df['acute_workload'] / (df['chronic_workload'] + 1e-6)
    return df

def compute_deltas(df, col, window=5):
    df = df.sort_values(['player_name', 'game_date'])
    baseline = df.groupby('player_name')[col].transform(lambda x: x.rolling(window, min_periods=1).mean())
    df[f'{col}_delta'] = df[col] - baseline
    return df

def compute_release_consistency(df, relx='release_pos_x_mean_all', rely='release_pos_y_mean_all', window=5):
    df = df.sort_values(['player_name', 'game_date'])
    df['relx_std'] = df.groupby('player_name')[relx].transform(lambda x: x.rolling(window, min_periods=1).std())
    df['rely_std'] = df.groupby('player_name')[rely].transform(lambda x: x.rolling(window, min_periods=1).std())
    df['release_var'] = df['relx_std'] + df['rely_std']
    return df

def compute_rest_days(df):
    df = df.sort_values(['player_name', 'game_date'])
    df['game_date'] = pd.to_datetime(df['game_date'])
    df['days_rest'] = df.groupby('player_name')['game_date'].diff().dt.days.fillna(0)
    return df

def enrich_features(df):
    df = compute_rest_days(df)
    df = compute_acwr(df)
    df = compute_deltas(df, 'release_speed_mean_all')
    df = compute_deltas(df, 'release_spin_rate_mean_all')
    df = compute_release_consistency(df)
    return df
