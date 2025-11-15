import argparse
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import roc_auc_score, average_precision_score, brier_score_loss, confusion_matrix
import xgboost as xgb
import joblib

from feature_engineering import enrich_features

def build_dataset(df, feature_cap=300):
    df = df.sort_values(['player_name', 'game_date'])
    df = enrich_features(df)
    df = df.dropna(subset=['result'])

    X = df.drop(columns=['player_name', 'game_date', 'result', 'result'])
    y = df['result']

    # Drop constant or high-null features
    X = X.loc[:, X.isnull().mean() < 0.95]
    nunique = X.nunique()
    X = X.loc[:, nunique > 1]

    imputer = SimpleImputer(strategy='median')
    scaler = StandardScaler()

    X = imputer.fit_transform(X)
    X = scaler.fit_transform(X)

    feature_names = df.drop(columns=['player_name', 'game_date', 'result', 'result']).columns[:X.shape[1]]
    return X, y.values, feature_names, imputer, scaler

def train_model(X, y, args):
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
        eval_metric='logloss',
        verbosity=0,
    )
    clf.fit(X, y)
    return clf

def evaluate_model(clf, X_test, y_test):
    probas = clf.predict_proba(X_test)[:, 1]
    roc = roc_auc_score(y_test, probas)
    pr = average_precision_score(y_test, probas)
    brier = brier_score_loss(y_test, probas)

    top_k = int(len(y_test) * 0.10)
    top_idx = np.argsort(probas)[-top_k:][::-1]
    y_pred_topk = np.zeros_like(y_test)
    y_pred_topk[top_idx] = 1

    precision = (y_test[top_idx] == 1).sum() / top_k
    recall = (y_pred_topk * y_test).sum() / max(y_test.sum(), 1)
    tn, fp, fn, tp = confusion_matrix(y_test, y_pred_topk).ravel()

    print(f"ROC AUC: {roc:.3f}")
    print(f"PR  AUC: {pr:.3f}")
    print(f"Brier : {brier:.3f}")
    print(f"Precision@Top{top_k}: {precision:.3f}")
    print(f"Recall@Top{top_k}:    {recall:.3f}")
    print(f"Confusion Matrix [TN FP; FN TP]: [{tn}, {fp}, {fn}, {tp}]")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--path', type=str, required=True)
    parser.add_argument('--feature_cap', type=int, default=300)
    parser.add_argument('--calibration', type=str, default='isotonic')
    parser.add_argument('--thr_mode', type=str, default='target_rate')
    parser.add_argument('--target_rate', type=float, default=0.10)
    parser.add_argument('--xgb_n_estimators', type=int, default=600)
    parser.add_argument('--xgb_learning_rate', type=float, default=0.05)
    parser.add_argument('--xgb_max_depth', type=int, default=3)
    parser.add_argument('--xgb_subsample', type=float, default=0.7)
    parser.add_argument('--xgb_colsample_bytree', type=float, default=0.5)
    parser.add_argument('--xgb_min_child_weight', type=float, default=8)
    parser.add_argument('--xgb_reg_lambda', type=float, default=5.0)
    parser.add_argument('--xgb_reg_alpha', type=float, default=1.0)
    args = parser.parse_args()

    print("Loading data...")
    df = pd.read_csv(args.path)
    print("Generating advanced features...")
    X, y, feature_names, imputer, scaler = build_dataset(df, feature_cap=args.feature_cap)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)
    print("Training model...")
    clf = train_model(X_train, y_train, args)

    if args.calibration == 'isotonic':
        print("Calibrating probabilities...")
        clf = CalibratedClassifierCV(estimator=clf, method='isotonic', cv=3)
        clf.fit(X_train, y_train)

    print("Evaluating on test set...")
    evaluate_model(clf, X_test, y_test)

    joblib.dump(clf, 'artifacts/injury_xgb_final.joblib')
    print("Saved model to artifacts/injury_xgb_final.joblib")

if __name__ == "__main__":
    main()
