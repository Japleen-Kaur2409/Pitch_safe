# corr 
import pandas as pd
import numpy as np

PATH = "/Users/Abhinn/mlb_injury_data/statcast_pitcher_game_features_2024.xlsx"  
WINDOW = 5

# load and prep
df = pd.read_excel(PATH)
df = df.sort_values(["player_name", "game_date"]).reset_index(drop=True)

# numeric feature columns (drop ids/label)
num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
exclude = {"pitcher", "results"}  # add more ids if you have them
feat_cols = [c for c in num_cols if c not in exclude]

# the ratio :) 
def past5_ratio(x: np.ndarray) -> float:
    # x is length-5 window for one player and one feature
    if len(x) < WINDOW or np.isnan(x).any():
        return np.nan
    s = x.sum()
    if s == 0:
        return np.nan
    diffs = np.diff(x)            # (x2-x1)+(x3-x2)+...+(x5-x4)
    return diffs.sum() / s

# build all ratio columns without fragmenting the frame
ratios = {}
g = df.groupby("player_name", sort=False)
for col in feat_cols:
    ratios[f"{col}_5g_ratio"] = (
        g[col]
        .rolling(WINDOW)
        .apply(past5_ratio, raw=True)
        .reset_index(level=0, drop=True)
    )

df_ratios = pd.DataFrame(ratios, index=df.index)

# correlations with injury label
corr = df_ratios.corrwith(df["results"])  # Pearson
abs_order = corr.abs().sort_values(ascending=False)
top20_idx = abs_order.head(20).index
top20 = corr.loc[top20_idx]  # keep sign, sorted by abs value

#gettig the otput 
out = (
    pd.DataFrame({
        "feature": top20.index,
        "corr": top20.values,
        "abs_corr": top20.abs().values
    })
    .sort_values("abs_corr", ascending=False)
    .reset_index(drop=True)
)

print("\nTop 20 features correlated with injury (5-game change ratio):\n")
print(out.to_string(index=False))

# also save
out.to_csv("injury_correlations_top20.csv", index=False)
corr.rename("corr").to_csv("injury_correlations_all.csv")

import pandas as pd
import matplotlib.pyplot as plt

# assuming your dataframe is named df_top20
df_top20 = pd.read_csv("injury_correlations_top20.csv")

plt.figure(figsize=(10, 6))
bars = plt.barh(df_top20["feature"], df_top20["corr"], color=[
    "red" if c < 0 else "green" for c in df_top20["corr"]
])

plt.xlabel("Correlation with Injury (5-game ratio)")
plt.ylabel("Feature")
plt.title("Top 20 Features Most Correlated with Injury Risk")
plt.gca().invert_yaxis()  
plt.grid(axis="x", linestyle="--", alpha=0.5)
plt.tight_layout()
plt.show()
