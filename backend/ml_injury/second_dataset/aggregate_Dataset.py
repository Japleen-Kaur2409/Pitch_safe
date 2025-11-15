# smart_aggregate_to_game_level.py really smart way to get concise data out of this
import pandas as pd
import numpy as np
from tqdm import tqdm

df = pd.read_csv("statcast_pitcher_game_features_2021_2024.csv")
df["game_date"] = pd.to_datetime(df["game_date"])

# Basic cleaning
df = df.dropna(subset=["player_name", "game_date", "pitch_type"])

# Features of interest
core_feats = [
    "release_speed",
    "release_spin_rate",
    "release_extension",
    "release_pos_x",
    "release_pos_y",
    "release_pos_z",
    "pfx_x",
    "pfx_z",
    "spin_axis",
    "delta_run_exp",
]

# Ensure they exist
core_feats = [c for c in core_feats if c in df.columns]
print(f"Aggregating over features: {core_feats}")

records = []

for (player, date), sub in tqdm(df.groupby(["player_name", "game_date"])):
    row = {"player_name": player, "game_date": date, "total_pitches": len(sub)}
    
    # Overall mechanical consistency (all pitches)
    for f in core_feats:
        row[f"{f}_mean_all"] = sub[f].mean()
        row[f"{f}_std_all"] = sub[f].std()
        row[f"{f}_range_all"] = sub[f].max() - sub[f].min()
    
    # Pitch-type mix and per-type mechanics
    pitch_counts = sub["pitch_type"].value_counts(normalize=True)
    for pitch in pitch_counts.index:
        row[f"pct_{pitch}"] = pitch_counts[pitch]
        sub_pitch = sub[sub["pitch_type"] == pitch]
        for f in core_feats:
            row[f"{pitch}_{f}_mean"] = sub_pitch[f].mean()
            row[f"{pitch}_{f}_std"] = sub_pitch[f].std()
    
    records.append(row)

agg_df = pd.DataFrame(records)

# Sort chronologically
agg_df = agg_df.sort_values(["player_name", "game_date"]).reset_index(drop=True)

# Save
agg_df.to_csv("statcast_pitcher_game_aggregated_smart_2021_2024.csv", index=False)
print(f"✅ Saved {len(agg_df)} game-level rows with {agg_df.shape[1]} columns.")
