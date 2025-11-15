# extract_pitchers.py
import pandas as pd

df = pd.read_excel("statcast_pitcher_game_features_2024.xlsx")
pitchers = sorted(df["player_name"].dropna().unique())
pd.DataFrame(pitchers, columns=["player_name"]).to_csv("pitchers_list.csv", index=False)
print(f"Extracted {len(pitchers)} unique pitcher names → pitchers_list.csv")
