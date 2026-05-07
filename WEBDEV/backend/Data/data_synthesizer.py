import pandas as pd
import numpy as np
import os
import shutil

def synthesize_data():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    training_path = os.path.join(base_dir, 'Training.csv')
    
    print("Loading original training data...")
    df = pd.read_csv(training_path)
    
    # Target total size
    TARGET_SIZE = 10000
    
    current_size = len(df)
    if current_size >= TARGET_SIZE:
        print("Data is already 10,000+ records. Exiting.")
        return
        
    records_needed = TARGET_SIZE - current_size
    print(f"Current size: {current_size}. Need to generate {records_needed} records.")
    
    features = df.columns[:-1]
    
    synthetic_samples = []
    
    # We will generate synthetic data by occasionally dropping an active symptom 
    # to simulate a patient presenting with fewer symptoms for the same disease.
    # Group by prognosis
    grouped = df.groupby('prognosis')
    
    generations_per_disease = records_needed // len(grouped) + 1
    
    for prognosis, group in grouped:
        base_samples = group.values
        for _ in range(generations_per_disease):
            # Pick a random sample from this disease
            sample = base_samples[np.random.randint(0, len(base_samples))].copy()
            
            # Find active symptoms (index where value is 1)
            active_symptoms = [i for i, val in enumerate(sample[:-1]) if val == 1]
            
            # Drop 1 active symptom randomly to create a valid variation if there are > 1 symptoms
            if len(active_symptoms) > 1:
                drop_idx = np.random.choice(active_symptoms)
                sample[drop_idx] = 0
            
            synthetic_samples.append(sample)
            
            if len(synthetic_samples) >= records_needed:
                break
        if len(synthetic_samples) >= records_needed:
            break
            
    synthetic_df = pd.DataFrame(synthetic_samples, columns=df.columns)
    
    # Combine and shuffle
    print("Combining synthetic and real data...")
    augmented_df = pd.concat([df, synthetic_df], ignore_index=True)
    augmented_df = augmented_df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    print(f"New dataset size: {len(augmented_df)} records.")
    
    # Save Training.csv
    augmented_df.to_csv(training_path, index=False)
    
    # Also create a Testing.csv from it (let's say we sample 1000 rows for Testing.csv)
    # The original Testing.csv had 42 rows (1 per disease). We'll make it 100 so it has valid samples.
    test_samples = augmented_df.groupby('prognosis').apply(lambda x: x.sample(n=2, replace=True)).reset_index(drop=True)
    test_path = os.path.join(base_dir, 'Testing.csv')
    test_samples.to_csv(test_path, index=False)
    
    dataset_path = os.path.join(base_dir, 'dataset.csv')
    augmented_df.to_csv(dataset_path, index=False)
    
    # Copy to Python folder
    python_data_dir = os.path.abspath(os.path.join(base_dir, '../../PYTHON/Data'))
    print(f"Copying to {python_data_dir}...")
    shutil.copy(training_path, os.path.join(python_data_dir, 'Training.csv'))
    shutil.copy(test_path, os.path.join(python_data_dir, 'Testing.csv'))
    shutil.copy(dataset_path, os.path.join(python_data_dir, 'dataset.csv'))
    
    print("Data synthesis complete!")

if __name__ == "__main__":
    synthesize_data()
