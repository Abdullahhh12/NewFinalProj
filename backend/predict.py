import sys
import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler

def preprocess(df):
    # Drop 'Time' and scale 'Amount'
    if 'Time' in df.columns:
        df.drop(columns=['Time'], inplace=True)

    if 'Amount' in df.columns:
        scaler = StandardScaler()
        df['Amount_Scaled'] = scaler.fit_transform(df[['Amount']])
        df.drop(columns=['Amount'], inplace=True)

    return df

def main():
    if len(sys.argv) != 3:
        print("Usage: python predict.py <csv_file> <model_path>")
        sys.exit(1)

    csv_file = sys.argv[1]
    model_path = sys.argv[2]

    try:
        model = joblib.load(model_path)
        df = pd.read_csv(csv_file)

        if 'Class' in df.columns:
            df.drop(columns=['Class'], inplace=True)

        df_processed = preprocess(df)

        # Ensure correct feature order
        expected_cols = model.feature_names_in_
        df_processed = df_processed[expected_cols]

        predictions = model.predict(df_processed)

        fraud = (predictions == 1).sum()
        legit = (predictions == 0).sum()

        print(f"✅ Legit Transactions: {legit}")
        print(f"❌ Fraudulent Transactions: {fraud}")

    except Exception as e:
        print(f"❗ Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
