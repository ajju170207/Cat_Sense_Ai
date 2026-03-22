import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.utils import to_categorical

import src.config as config
import src.data_utils as data_utils
import src.models as models

def train_pipeline():
    print("=== Starting Unified 10-Class Training Pipeline ===")
    
    # 1. Expert Model Stage
    print("\n[STAGE 1] Training Expert Labeler...")
    df_expert = data_utils.collect_expert_data()
    X_exp, y_exp_labels = data_utils.load_dataset(df_expert)
    
    le = LabelEncoder()
    le.fit(config.CATEGORIES) # Ensure all 10 classes are represented
    y_exp_train = to_categorical(le.transform(y_exp_labels), num_classes=10)
    
    expert_model = models.build_mobilenet_model(n_classes=10, trainable=False)
    expert_model.fit(X_exp, y_exp_train, epochs=10, batch_size=config.BATCH_SIZE, verbose=1)
    
    # 2. Auto-Labeling Stage
    print("\n[STAGE 2] Auto-Labeling Archive Dataset...")
    archive_paths = data_utils.collect_archive_paths()
    re_labeled_data = []
    
    for path in archive_paths:
        try:
            y = data_utils.preprocess_audio(path)
            feat = data_utils.extract_features(y)
            pred = expert_model.predict(np.expand_dims(feat, 0), verbose=0)
            label = config.CATEGORIES[np.argmax(pred)]
            re_labeled_data.append({'path': path, 'label': label})
        except Exception:
            continue
            
    df_final = pd.concat([df_expert, pd.DataFrame(re_labeled_data)])
    print(f"Total training samples: {len(df_final)}")
    
    # 3. Production Model Stage
    print("\n[STAGE 3] Training Production Model...")
    X_final, y_final_labels = data_utils.load_dataset(df_final)
    y_final_train = to_categorical(le.transform(y_final_labels), num_classes=10)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X_final, y_final_train, test_size=0.15, stratify=y_final_labels, random_state=42
    )
    
    prod_model = models.build_mobilenet_model(n_classes=10, trainable=True)
    prod_model.fit(
        X_train, y_train, 
        validation_split=0.1, 
        epochs=config.EPOCHS, 
        batch_size=config.BATCH_SIZE
    )
    
    # Save Model
    save_path = os.path.join(config.MODEL_VAULT, 'catsense_v1_prod.keras')
    prod_model.save(save_path)
    print(f"\nSuccess! Production model saved to {save_path}")

if __name__ == "__main__":
    train_pipeline()
