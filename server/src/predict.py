import os
import sys
import argparse
import numpy as np
import tensorflow as tf
from tensorflow import keras
import matplotlib.pyplot as plt
import seaborn as sns
import librosa.display

import src.config as config
import src.data_utils as data_utils
from src.models import AttentionLayer

def predict_emotion(audio_path, model_path=None):
    """
    End-to-end professional inference pipeline for cat vocalizations.
    """
    if model_path is None:
        model_path = os.path.join(config.MODEL_VAULT, 'catsense_final_best.keras')

    if not os.path.exists(audio_path):
        print(f"Error: Audio file not found at {audio_path}")
        return None

    print(f"--- Analyzing: {os.path.basename(audio_path)} ---")
    
    # 1. Preprocess
    print("Preprocessing audio...")
    y = data_utils.preprocess_audio(audio_path)
    feat = data_utils.extract_features(y)
    
    # 2. Load Model
    if not os.path.exists(model_path):
        print(f"Error: Model weights not found at {model_path}. Please train the model first.")
        return None
    
    try:
        # Load with custom AttentionLayer registered
        model = keras.models.load_model(model_path, custom_objects={'AttentionLayer': AttentionLayer})
    except Exception as e:
        print(f"Error loading model: {e}")
        return None
    
    # 3. Predict
    print("Running inference...")
    pred = model.predict(np.expand_dims(feat, 0), verbose=0)
    class_idx = np.argmax(pred)
    confidence = np.max(pred) * 100
    label = config.CATEGORIES[class_idx]
    
    # 4. Results
    print(f"\nFINAL RESULT: {label.upper()}")
    print(f"CONFIDENCE: {confidence:.2f}%")
    
    print("\n--- Emotion Breakdown ---")
    sorted_probs = sorted(zip(config.CATEGORIES, pred[0]), key=lambda x: x[1], reverse=True)
    for cat, prob in sorted_probs:
        print(f"{cat:12}: {prob*100:6.2f}%")
    
    return {
        'label': label,
        'confidence': confidence,
        'probabilities': dict(zip(config.CATEGORIES, pred[0]))
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CatSense AI Professional Inference Script")
    parser.add_argument("audio", help="Path to the cat audio file")
    parser.add_argument("--model", help="Path to .keras model file")
    args = parser.parse_args()
    
    predict_emotion(args.audio, args.model)
