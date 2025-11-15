import pandas as pd
import numpy as np
import argparse
import joblib
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import roc_auc_score, average_precision_score, brier_score_loss, confusion_matrix
from xgboost import XGBClassifier
from feature_engineering import enrich_features


def add_trend_features(df):
    df = df.sort_values(['player_name', 'game_date'])
    for col in ['release_speed_mean_all', 'release_spin_rate_mean_all']:
        df[f'{col}_rolling_3'] = df.groupby('player_name')[col].transform(lambda x: x.rolling(window=3, min_periods=1).mean())
        df[f'{col}_trend'] = df[col] - df[f'{col}_rolling_3']
    df['pitch_count_rolling_3'] = df.groupby('player_name')['total_pitches'].transform(lambda x: x.rolling(3, min_periods=1).mean())
    df['acwr'] = df['total_pitches'] / (df['pitch_count_rolling_3'] + 1e-5)
    df['days_rest'] = df.groupby('player_name')['game_date'].diff().dt.days.fillna(5)
    df['short_rest'] = (df['days_rest'] < 4).astype(int)
    return df


def build_dataset(df, feature_cap):
    df = enrich_features(df)
    df = add_trend_features(df)

    features = [
        'release_speed_mean_all', 'release_spin_rate_mean_all',
        'total_pitches', 'acwr', 'days_rest', 'short_rest',
        'release_var', 'release_speed_mean_all_trend', 'release_spin_rate_mean_all_trend'
    ]
    if feature_cap:
        features = features[:feature_cap]

    df = df.dropna(subset=features + ['result'])
    X = df[features].copy()
    y = df['result']

    imputer = SimpleImputer(strategy='median')
    scaler = StandardScaler()
    X = imputer.fit_transform(X)
    X = scaler.fit_transform(X)

    return X, y, features, imputer, scaler


def evaluate_model(model, X_test, y_test, top_k):
    probs = model.predict_proba(X_test)[:, 1]
    roc = roc_auc_score(y_test, probs)
    pr = average_precision_score(y_test, probs)
    brier = brier_score_loss(y_test, probs)

    sorted_idx = np.argsort(probs)[::-1]
    top_k_idx = sorted_idx[:top_k]

    precision = (y_test[top_k_idx] == 1).sum() / top_k if top_k > 0 else 0.0
    recall = (y_test[top_k_idx] == 1).sum() / y_test.sum() if y_test.sum() > 0 else 0.0

    print(f"\n--- DEBUG: Top-{top_k} predictions ---")
    print("Top predicted probabilities:", probs[top_k_idx])
    print("True labels at Top-k:", y_test[top_k_idx])

    bin_preds = (probs > 0.5).astype(int)
    cm = confusion_matrix(y_test, bin_preds)

    print(f"\nROC AUC: {roc:.3f}\nPR  AUC: {pr:.3f}\nBrier : {brier:.3f}")
    print(f"Precision@Top{top_k}: {precision:.3f}\nRecall@Top{top_k}:    {recall:.3f}")
    print(f"Confusion Matrix [TN FP; FN TP]: {cm.ravel().tolist()}")
    return probs


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--path', required=True)
    parser.add_argument('--feature_cap', type=int, default=None)
    parser.add_argument('--calibration', default='isotonic')
    parser.add_argument('--thr_mode', default='target_rate')
    parser.add_argument('--target_rate', type=float, default=0.10)
    parser.add_argument('--xgb_n_estimators', type=int, default=500)
    parser.add_argument('--xgb_learning_rate', type=float, default=0.1)
    parser.add_argument('--xgb_max_depth', type=int, default=4)
    parser.add_argument('--xgb_subsample', type=float, default=0.8)
    parser.add_argument('--xgb_colsample_bytree', type=float, default=0.8)
    parser.add_argument('--xgb_min_child_weight', type=int, default=5)
    parser.add_argument('--xgb_reg_lambda', type=float, default=1.0)
    parser.add_argument('--xgb_reg_alpha', type=float, default=0.0)
    args = parser.parse_args()

    print("Loading data...")
    df = pd.read_csv(args.path, parse_dates=['game_date'])

    print("Building dataset...")
    X, y, feature_names, imputer, scaler = build_dataset(df, args.feature_cap)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

    print("Training model...")
    clf = XGBClassifier(
        n_estimators=args.xgb_n_estimators,
        learning_rate=args.xgb_learning_rate,
        max_depth=args.xgb_max_depth,
        subsample=args.xgb_subsample,
        colsample_bytree=args.xgb_colsample_bytree,
        min_child_weight=args.xgb_min_child_weight,
        reg_lambda=args.xgb_reg_lambda,
        reg_alpha=args.xgb_reg_alpha,
        use_label_encoder=False,
        eval_metric='logloss'
    )

    clf = CalibratedClassifierCV(estimator=clf, method=args.calibration, cv=3)
    clf.fit(X_train, y_train)

    print("Evaluating on test set...")
    top_k = int(args.target_rate * len(y_test))
    evaluate_model(clf, X_test, y_test.values, top_k)

    print("Saving model...")
    joblib.dump(clf, 'artifacts/injury_xgb_final.joblib')
    joblib.dump((imputer, scaler, feature_names), 'artifacts/injury_preprocessors.joblib')


if __name__ == '__main__':
    main()
