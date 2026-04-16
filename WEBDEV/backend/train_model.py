import pandas as pd
import numpy as np
from sklearn.naive_bayes import MultinomialNB
from sklearn.preprocessing import LabelEncoder
import joblib
import os

def train():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, '..', 'Data', 'Training.csv')
    model_path = os.path.join(base_dir, 'model.pkl')
    le_path = os.path.join(base_dir, 'label_encoder.pkl')
    features_path = os.path.join(base_dir, 'features.pkl')

    print("Loading data...")
    df = pd.read_csv(data_path)
    
    cols = df.columns[:-1]
    X = df[cols]
    y = df['prognosis']

    print("Encoding labels...")
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    print("Training Multinomial Naive Bayes Model...")
    # MultinomialNB is much better at partial binary symptom matching
    clf = MultinomialNB()
    clf.fit(X, y_encoded)

    print("Saving model and encoders...")
    joblib.dump(clf, model_path)
    joblib.dump(le, le_path)
    joblib.dump(list(cols), features_path)
    print("Done! Artifacts saved to backend folder.")

if __name__ == "__main__":
    train()
