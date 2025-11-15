import pandas as pd
from pybaseball import statcast_pitcher, playerid_lookup
from tqdm import tqdm
import time

# Read pitcher names
pitchers = pd.read_csv("/Users/Abhinn/mlb_injury_data/second dataset/pitchers_list.csv")["player_name"].tolist()

# Function to get MLBAM ID from name
def get_player_id(name):
    try:
        last, first = [x.strip() for x in name.split(",")]
        pid = playerid_lookup(last, first)
        if not pid.empty:
            return int(pid.iloc[0]["key_mlbam"])
    except Exception:
        return None
    return None

pitcher_ids = {name: get_player_id(name) for name in pitchers}
print("Resolved player IDs:", {k: v for k, v in pitcher_ids.items() if v})

years = [2021, 2022, 2023, 2024]
all_data = []

for year in years:
    print(f"\nFetching Statcast data for {year}...")
    season_data = []
    for name, pid in tqdm(pitcher_ids.items()):
        if pid is None:
            continue
        try:
            data = statcast_pitcher(f"{year}-03-01", f"{year}-11-30", pid)
            if not data.empty:
                data["player_name"] = name
                data["season"] = year
                season_data.append(data)
        except Exception as e:
            print(f"Failed {name} {year}: {e}")
            time.sleep(2)
            continue
        time.sleep(1)  # avoid rate limit

    if season_data:
        df_season = pd.concat(season_data, ignore_index=True)
        df_season.to_csv(f"statcast_pitcher_game_features_{year}.csv", index=False)
        all_data.append(df_season)
        print(f"Saved season {year} with {len(df_season)} rows.")

# Merge all years
if all_data:
    merged = pd.concat(all_data, ignore_index=True)
    merged.to_csv("statcast_pitcher_game_features_2021_2024.csv", index=False)
    print(f"Final merged dataset: {len(merged)} rows.")
