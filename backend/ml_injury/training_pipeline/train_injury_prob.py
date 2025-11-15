# This updated script improves injury prediction by leveraging refined feature engineering
# and a more stable modeling pipeline with better calibration and thresholding logic.

import argparse
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import roc_auc_score, average_precision_score, brier_score_loss, confusion_matrix
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from joblib import dump

from feature_engineering import enrich_features


def build_dataset(df, feature_cap=300):
    df = enrich_features(df)
    df = df.dropna(subset=['result'])
    y = df['result'].astype(int)

    feature_cols = [col for col in df.columns if col not in ['player_name', 'game_date', 'result']]
    X = df[feature_cols]

    imputer = SimpleImputer(strategy='median')
    X_imputed = imputer.fit_transform(X)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_imputed)

    feature_names = feature_cols[:feature_cap]
    return X_scaled[:, :feature_cap], y, feature_names, imputer, scaler


def threshold_top_k(pred_probs, k):
    threshold = np.sort(pred_probs)[-k] if k < len(pred_probs) else 0.0
    return (pred_probs >= threshold).astype(int), threshold


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--path', required=True)
    parser.add_argument('--feature_cap', type=int, default=300)
    parser.add_argument('--calibration', default='isotonic')
    parser.add_argument('--thr_mode', default='target_rate')
    parser.add_argument('--target_rate', type=float, default=0.10)
    parser.add_argument('--xgb_n_estimators', type=int, default=500)
    parser.add_argument('--xgb_learning_rate', type=float, default=0.05)
    parser.add_argument('--xgb_max_depth', type=int, default=3)
    parser.add_argument('--xgb_subsample', type=float, default=0.8)
    parser.add_argument('--xgb_colsample_bytree', type=float, default=0.6)
    parser.add_argument('--xgb_min_child_weight', type=float, default=3)
    parser.add_argument('--xgb_reg_lambda', type=float, default=1.0)
    parser.add_argument('--xgb_reg_alpha', type=float, default=0.1)
    args = parser.parse_args()

    print("Loading data...")
    df = pd.read_csv(args.path)

    print("Generating advanced features...")
    X, y, feature_names, imputer, scaler = build_dataset(df, feature_cap=args.feature_cap)

    X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, test_size=0.25, random_state=42)

    print("Training model...")
    clf = xgb.XGBClassifier(
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
    clf.fit(X_train, y_train)

    if args.calibration:
        print("Calibrating probabilities...")
        clf = CalibratedClassifierCV(estimator=clf, method=args.calibration, cv=3)
        clf.fit(X_train, y_train)

    print("Evaluating on test set...")
    probas = clf.predict_proba(X_test)[:, 1]

    if args.thr_mode == 'target_rate':
        k = int(args.target_rate * len(probas))
        preds, cutoff = threshold_top_k(probas, k)
    else:
        raise ValueError("Only 'target_rate' thresholding is supported")

    print(f"ROC AUC: {roc_auc_score(y_test, probas):.3f}")
    print(f"PR  AUC: {average_precision_score(y_test, probas):.3f}")
    print(f"Brier : {brier_score_loss(y_test, probas):.3f}")

    tp = np.sum((preds == 1) & (y_test == 1))
    fp = np.sum((preds == 1) & (y_test == 0))
    fn = np.sum((preds == 0) & (y_test == 1))
    tn = np.sum((preds == 0) & (y_test == 0))

    print(f"Precision@Top{k}: {tp / max(tp + fp, 1):.3f}")
    print(f"Recall@Top{k}:    {tp / max(tp + fn, 1):.3f}")
    print(f"Confusion Matrix [TN FP; FN TP]: [{tn}, {fp}, {fn}, {tp}]")

    dump(clf, 'artifacts/injury_xgb_final.joblib')
    dump(imputer, 'artifacts/imputer.joblib')
    dump(scaler, 'artifacts/scaler.joblib')
    print("Saved model to artifacts/injury_xgb_final.joblib")


if __name__ == '__main__':
    main()
