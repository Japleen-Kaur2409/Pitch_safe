import pandas as pd
from sklearn.metrics import roc_auc_score

# Dummy window selector for illustrative purposes
def select_best_window(df, windows=[5, 7, 9], target_col='injury_next_game'):
    best_auc = -1
    best_window = None
    best_subset = None

    for w in windows:
        subset = df.groupby('player_name').tail(w)
        if subset[target_col].sum() < 5:
            print(f"W={w} ROC AUC (val): NA (too few positives)")
            continue

        X = subset.drop(columns=['player_name', 'game_date', 'result', 'injury_next_game'])
        y = subset[target_col]
        X = X.fillna(X.median())

        try:
            from sklearn.linear_model import LogisticRegression
            model = LogisticRegression()
            model.fit(X, y)
            probas = model.predict_proba(X)[:, 1]
            auc = roc_auc_score(y, probas)
            print(f"W={w} ROC AUC (val): {auc:.3f}")
            if auc > best_auc:
                best_auc = auc
                best_window = w
                best_subset = subset
        except:
            print(f"W={w} ROC AUC (val): ERROR")
            continue

    if best_window is None:
        raise RuntimeError("No valid window produced a usable split.")

    print(f"Best window: W={best_window} with ROC AUC={best_auc:.3f}")
    return best_window, best_subset
