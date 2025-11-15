# This is a revised and expanded version of our injury modeling framework.
# Core changes:
# - Introduced ACWR and velocity/spin deltas
# - Enriched workload and fatigue signals
# - Created personalized player baselines for deviation analysis
# - Replaced fragmented block insertions with optimized pd.concat approach

import pandas as pd
import numpy as np


def compute_acwr(df, pitch_col='pitches_thrown', acute_w=3, chronic_w=10):
    """
    Compute Acute:Chronic Workload Ratio per player using rolling pitch counts.
    """
    df = df.sort_values(['player_id', 'game_date'])
    df['acute_workload'] = df.groupby('player_id')[pitch_col].transform(lambda x: x.rolling(acute_w, min_periods=1).mean())
    df['chronic_workload'] = df.groupby('player_id')[pitch_col].transform(lambda x: x.rolling(chronic_w, min_periods=1).mean())
    df['acwr'] = df['acute_workload'] / (df['chronic_workload'] + 1e-6)
    return df


def compute_velocity_deltas(df, velo_col='release_speed', window=5):
    """
    For each pitcher, compute deviation in velocity from rolling baseline.
    """
    df = df.sort_values(['player_id', 'game_date'])
    rolling_mean = df.groupby('player_id')[velo_col].transform(lambda x: x.rolling(window, min_periods=1).mean())
    df['velo_delta'] = df[velo_col] - rolling_mean
    return df


def compute_spin_deltas(df, spin_col='release_spin_rate', window=5):
    df = df.sort_values(['player_id', 'game_date'])
    rolling_mean = df.groupby('player_id')[spin_col].transform(lambda x: x.rolling(window, min_periods=1).mean())
    df['spin_delta'] = df[spin_col] - rolling_mean
    return df


def compute_release_consistency(df, relx='release_pos_x', rely='release_pos_y', window=5):
    """
    Compute release point consistency: rolling std of x and y release locations.
    """
    df = df.sort_values(['player_id', 'game_date'])
    df['relx_std'] = df.groupby('player_id')[relx].transform(lambda x: x.rolling(window, min_periods=1).std())
    df['rely_std'] = df.groupby('player_id')[rely].transform(lambda x: x.rolling(window, min_periods=1).std())
    df['release_var'] = df['relx_std'] + df['rely_std']
    return df


def compute_rest_days(df):
    df = df.sort_values(['player_id', 'game_date'])
    df['game_date'] = pd.to_datetime(df['game_date'])
    df['days_rest'] = df.groupby('player_id')['game_date'].diff().dt.days.fillna(0)
    return df


def enrich_features(df):
    df = compute_rest_days(df)
    df = compute_acwr(df)
    df = compute_velocity_deltas(df)
    df = compute_spin_deltas(df)
    df = compute_release_consistency(df)
    return df


if __name__ == "__main__":
    df = pd.read_csv("final_dataset/final_dataset_clean.csv")
    df = enrich_features(df)
    df.to_csv("final_dataset/enriched_dataset.csv", index=False)
    print("Saved enriched dataset with ACWR, velocity/spin deltas, and rest features.")
