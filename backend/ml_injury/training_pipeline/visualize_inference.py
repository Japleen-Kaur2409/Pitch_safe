import pandas as pd
import matplotlib.pyplot as plt
import argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--path', required=True, help='outputs/injury_risk_predictions.csv')
    args = parser.parse_args()

    df = pd.read_csv(args.path)

    if 'risk_level' not in df.columns or 'result' not in df.columns:
        raise ValueError("CSV must include 'risk_level' and 'result' columns")

    # Count totals and injuries per risk level
    total_counts = df['risk_level'].value_counts().reindex(['high', 'medium', 'low'], fill_value=0)
    injury_counts = df[df['result'] == 1]['risk_level'].value_counts().reindex(['high', 'medium', 'low'], fill_value=0)

    # Injury rate per group
    injury_rates = (injury_counts / total_counts).fillna(0)

    # Print table
    print("\n=== Injury Stats by Risk Level ===")
    summary = pd.DataFrame({
        "Total": total_counts,
        "Injured": injury_counts,
        "Injury Rate": (injury_rates * 100).round(1).astype(str) + "%"
    })
    print(summary)

    # Plotting
    fig, ax = plt.subplots()
    injury_rates.plot(kind='bar', color='crimson', ax=ax)
    ax.set_title("Injury Rate by Risk Level")
    ax.set_ylabel("Injury Rate")
    ax.set_xlabel("Risk Level")
    ax.set_ylim(0, 1)
    ax.set_xticklabels(['High', 'Medium', 'Low'], rotation=0)
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    main()

