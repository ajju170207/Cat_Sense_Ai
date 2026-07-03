import os
import pickle
import tensorflow as tf
from tensorflow import keras
import numpy as np
import sys

# Ensure the parent directory is in sys.path for relative imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.models import AttentionLayer
import src.config as config

def convert_audio_model():
    MODEL_PATH = os.path.join(config.MODEL_VAULT, "catsense_final_best.keras")
    PKL_PATH = os.path.join(config.MODEL_VAULT, "catsense_final_best.pkl")
    
    if not os.path.exists(MODEL_PATH):
        print(f"Error: {MODEL_PATH} not found")
        return

    try:
        # Load the keras model with custom objects
        model = keras.models.load_model(MODEL_PATH, custom_objects={'AttentionLayer': AttentionLayer})
        print("Audio model loaded successfully.")
        
        # Prepare data for pickling
        model_data = {
            'weights': model.get_weights(),
            'config': model.get_config(),
            'class_names': config.CATEGORIES
        }
        
        with open(PKL_PATH, 'wb') as f:
            pickle.dump(model_data, f)
            
        print(f"Successfully converted and saved audio model to {PKL_PATH}")
    except Exception as e:
        print(f"Failed to convert audio model: {e}")

if __name__ == "__main__":
    convert_audio_model()
