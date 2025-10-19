from pybaseball import pitching_stats, statcast_pitcher, playerid_lookup, playerid_reverse_lookup
import pandas as pd, numpy as np
from tqdm import tqdm
import os, json, time, random, re

SEASON = 2024
START, END = f"{SEASON}-03-01", f"{SEASON}-11-30"  # adjust if needed

def split_name(fullname: str):
    # cuz pybaseball pitching_stats usually has 'Name' like "Last, First"
    if pd.isna(fullname):
        return None, None
    s = str(fullname).strip()
    if "," in s:
        last, first = [x.strip() for x in s.split(",", 1)]
    else:
        parts = s.split()
        if len(parts) == 1:
            return parts[0], ""
        first, last = parts[0], " ".join(parts[1:])
    return last, first

def get_pitcher_ids(season: int) -> list[int]:
    ps = pitching_stats(season)  # FanGraphs season pitching table
    mlbam = set()

    fg_col = None
    for c in ps.columns:
        if c.lower() in ("idfg", "playerid", "fg_id", "fangraphsid"):
            fg_col = c
            break
    if fg_col is not None:
        fg_ids = ps[fg_col].dropna().astype(int).unique().tolist()
        if fg_ids:
            idmap = playerid_reverse_lookup(fg_ids, key_type="fangraphs")
            if "key_mlbam" in idmap.columns:
                mlbam.update(idmap["key_mlbam"].dropna().astype(int).tolist())

    name_col = None
    for c in ("Name", "player_name", "Name-mlb", "Player"):
        if c in ps.columns:
            name_col = c
            break
    if name_col is not None:
        seen = set()
        for nm in ps[name_col].dropna().unique().tolist():
            if nm in seen: 
                continue
            seen.add(nm)
            last, first = split_name(nm)
            if not last:
                continue
            try:
                df = playerid_lookup(last, first)
                # prefer MLBAM id where possible
                if not df.empty and "key_mlbam" in df.columns:
                    mids = df["key_mlbam"].dropna().astype(int).tolist()
                    for mid in mids:
                        mlbam.add(mid)
            except Exception:
                pass

    ids = sorted(mlbam)
    if not ids:
        raise RuntimeError("Could not assemble MLBAM pitcher IDs from pitching_stats().")
    return ids

def pull_pitch_level(pid: int, retries: int = 3, start: str = START, end: str = END) -> pd.DataFrame:
    for attempt in range(1, retries + 1):
        try:
            df = statcast_pitcher(start, end, pid)
            if df is not None and not df.empty:
                if "pitch_type" not in df.columns:
                    return pd.DataFrame()
                df = df[df["pitch_type"].notna()].copy()
                if df.empty:
                    return pd.DataFrame()
                df["game_date"] = pd.to_datetime(df["game_date"]).dt.date
                keep = [
                    "pitcher","player_name","game_date","game_pk","pitch_type","pitch_name",
                    "release_speed","release_spin_rate","pfx_x","pfx_z",
                    "release_pos_x","release_pos_y","release_pos_z","extension",
                    "home_team","away_team"
                ]
                return df[[c for c in keep if c in df.columns]]
        except Exception:
            pass
        time.sleep(0.6 + random.random() * 0.6)  # backoff
    return pd.DataFrame()

def aggregate_game_features(p: pd.DataFrame) -> pd.DataFrame:
    base_agg = {
        "release_speed": ["count", "mean", "std", "min", "max"],
        "release_spin_rate": ["mean", "std"],
        "pfx_x": ["mean", "std"],
        "pfx_z": ["mean", "std"],
        "release_pos_x": ["mean", "std"],
        "release_pos_y": ["mean", "std"],
        "release_pos_z": ["mean", "std"],
        "extension": ["mean", "std"],
    }
    avail_agg = {k: v for k, v in base_agg.items() if k in p.columns}
    if not avail_agg:
        raise ValueError("No numeric pitch columns found to aggregate.")

    grp = (
        p.groupby(["pitcher", "player_name", "game_date", "pitch_type"], sort=False)
         .agg(avail_agg)
    )

    wide = (
        grp.reset_index()
           .pivot_table(
               index=["pitcher", "player_name", "game_date"],
               columns="pitch_type",
               values=grp.columns,
               aggfunc="first",
           )
    )

    newcols = []
    for col in wide.columns:
        if isinstance(col, tuple):
            ptype = col[-1]
            metric_parts = col[:-1]
        else:
            ptype = ""
            metric_parts = (col,)

        flat_metric = []
        for m in metric_parts:
            if isinstance(m, tuple):
                flat_metric.extend([str(x) for x in m if x not in ("", None)])
            else:
                flat_metric.append(str(m))
        metric_name = "_".join(flat_metric)
        newcols.append(f"{ptype}_{metric_name}" if ptype else metric_name)

    wide.columns = newcols
    wide = wide.reset_index()

    first_rows = (
        p.sort_values(["pitcher", "game_date"])
         .drop_duplicates(["pitcher", "game_date"])[["pitcher", "game_date", "home_team", "away_team"]]
    )
    wide = wide.merge(first_rows, on=["pitcher", "game_date"], how="left")
    return wide

def add_last5_trends(wide: pd.DataFrame) -> pd.DataFrame:
    wide = wide.sort_values(["pitcher","game_date"])

    def _per_pitcher(df):
        df = df.copy()
        num_cols = df.select_dtypes(include=[np.number]).columns
        lag = df[num_cols].shift(1).rename(columns=lambda c: f"{c}_lag1")
        chg = (df[num_cols] - lag.values).rename(columns=lambda c: f"{c}_chg1")
        roll_mean = df[num_cols].rolling(5, min_periods=2).mean().rename(columns=lambda c: f"{c}_roll5_mean")
        roll_std  = df[num_cols].rolling(5, min_periods=2).std().rename(columns=lambda c: f"{c}_roll5_std")
        return pd.concat([df, lag, chg, roll_mean, roll_std], axis=1)

    return wide.groupby("pitcher", group_keys=False).apply(_per_pitcher)

CHK = f"checkpoint_{SEASON}.json"
RAW_DIR = f"raw_pitch_{SEASON}"
os.makedirs(RAW_DIR, exist_ok=True)

def save_raw(pid, df):
    pd.DataFrame(df).to_parquet(os.path.join(RAW_DIR, f"{pid}.parquet"), index=False)

def load_raw(pid):
    fp = os.path.join(RAW_DIR, f"{pid}.parquet")
    if os.path.exists(fp):
        return pd.read_parquet(fp)
    return None

def main():
    pitcher_ids = get_pitcher_ids(SEASON)
    print("Pitchers detected:", len(pitcher_ids))

    done = set()
    if os.path.exists(CHK):
        try:
            done = set(json.load(open(CHK)))
        except Exception:
            done = set()

    chunks = []
    batch_size = 60
    sleep_between = 0.5

    for idx, pid in enumerate(tqdm(pitcher_ids, desc=f"Downloading Statcast {SEASON}")):
        if pid in done:
            cached = load_raw(pid)
            if cached is not None and not cached.empty:
                chunks.append(cached)
            continue

        try:
            df = pull_pitch_level(pid)
            if df is not None and not df.empty:
                save_raw(pid, df)
                chunks.append(df)
        except Exception:
            pass
        finally:
            done.add(pid)
            if idx % 10 == 0:
                json.dump(list(done), open(CHK, "w"))
            time.sleep(sleep_between)

        if len(chunks) >= batch_size:
            pitch_level = pd.concat(chunks, ignore_index=True)
            print("  — partial uniq pitchers:", pitch_level["pitcher"].nunique(), "rows:", len(pitch_level))
            game_feats  = aggregate_game_features(pitch_level)
            game_feats  = add_last5_trends(game_feats)
            game_feats["injured"] = 0
            game_feats.to_csv(f"statcast_pitcher_game_features_{SEASON}_partial.csv", index=False)
            chunks.clear()

    # final merge of everything in cache + any remaining chunks
    all_files = [f for f in os.listdir(RAW_DIR) if f.endswith(".parquet")]
    all_raw = [pd.read_parquet(os.path.join(RAW_DIR, f)) for f in all_files]
    if chunks:
        all_raw.append(pd.concat(chunks, ignore_index=True))
    pitch_level = pd.concat(all_raw, ignore_index=True)

    print("TOTAL uniq pitchers:", pitch_level["pitcher"].nunique(), "rows:", len(pitch_level))

    game_feats  = aggregate_game_features(pitch_level)
    game_feats  = add_last5_trends(game_feats)
    game_feats["injured"] = 0

    game_feats.to_csv(f"statcast_pitcher_game_features_{SEASON}.csv", index=False)
    last5 = (game_feats.sort_values(["pitcher","game_date"])
                       .groupby("pitcher").tail(5).reset_index(drop=True))
    last5.to_csv(f"last5_games_features_{SEASON}.csv", index=False)

    print("WROTE:",
          f"statcast_pitcher_game_features_{SEASON}.csv  (rows={len(game_feats)})",
          f"last5_games_features_{SEASON}.csv            (rows={len(last5)})",
          sep="\n")

#yay
if __name__ == "__main__":
    main()
