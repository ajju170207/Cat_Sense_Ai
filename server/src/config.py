import os
from pathlib import Path

# --- Audio Settings ---
SR = 22050
DURATION = 3.0
IMG_SIZE = (128, 128)
N_MELS = 128
N_MFCC = 40

# --- Training Settings ---
BATCH_SIZE = 16
EPOCHS = 30
LEARNING_RATE = 1e-4

# --- Data Paths ---
PROJECT_ROOT = Path('/Users/ajay/project')
EXPERT_POOL_1 = PROJECT_ROOT / 'datasets/expert_collection_1'
EXPERT_POOL_2 = PROJECT_ROOT / 'datasets/expert_collection_2'
VOCAL_ARCHIVE = PROJECT_ROOT / 'datasets/audio_vault'

# --- Output Paths ---
MODEL_VAULT = PROJECT_ROOT / 'models/weights'
ANALYTICS_DIR = PROJECT_ROOT / 'research/outputs/analytics'
DOCUMENTATION_DIR = PROJECT_ROOT / 'docs'

# --- Labels ---
CATEGORIES = [
    'Angry', 'Defense', 'Fighting', 'Happy', 'HuntingMind', 
    'Mating', 'MotherCall', 'Paining', 'Resting', 'Warning'
]
