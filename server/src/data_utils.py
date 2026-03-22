import os
import numpy as np
import pandas as pd
import librosa
import noisereduce as nr
import cv2
from tqdm.auto import tqdm
import src.config as config

def preprocess_audio(path):
    """
    Standard preprocessing pipeline: Load -> Resample -> Denoise -> Normalize -> Pad/Trim
    """
    y, _ = librosa.load(path, sr=config.SR)
    y = nr.reduce_noise(y=y, sr=config.SR, prop_decrease=0.7)
    y = librosa.util.normalize(y)
    t_len = int(config.SR * config.DURATION)
    y = np.pad(y, (0, max(0, t_len - len(y))), mode='constant')[:t_len]
    return y

def extract_features(y):
    """
    Extract 3-channel spectral features: [Log-Mel, Log-Mel, MFCC]
    """
    mel = librosa.feature.melspectrogram(y=y, sr=config.SR, n_mels=config.N_MELS)
    mel_db = librosa.power_to_db(mel, ref=np.max)
    mfcc = librosa.feature.mfcc(y=y, sr=config.SR, n_mfcc=config.N_MFCC)
    
    def norm(arr):
        arr = (arr - arr.min()) / (arr.max() - arr.min() + 1e-8)
        return cv2.resize(arr, config.IMG_SIZE, interpolation=cv2.INTER_LINEAR)
    
    return np.stack([norm(mel_db), norm(mel_db), norm(mfcc)], axis=-1)

def collect_expert_data():
    """
    Scans the expert datasets (Expert Pool 1 and 2)
    """
    data = []
    roots = [config.EXPERT_POOL_1, config.EXPERT_POOL_2]
    
    for root in roots:
        for category in config.CATEGORIES:
            cat_path = root / category
            if cat_path.exists():
                files = list(cat_path.glob('*.mp3')) + list(cat_path.glob('*.wav'))
                for f in files:
                    data.append({'path': str(f), 'label': category})
    return pd.DataFrame(data)

def collect_archive_paths():
    """
    Collects all paths from the unlabelled vocalization archive
    """
    root = config.VOCAL_ARCHIVE
    # The structure after move is root/dataset/dataset and root/extras/...
    # Using recursive glob for robustness if the user hates the archive name
    paths = list(root.rglob('*.wav')) + list(root.rglob('*.mp3'))
    return [str(p) for p in paths]

def load_dataset(df):
    """
    Full audio-to-feature matrix conversion
    """
    X, Y = [], []
    for _, row in tqdm(df.iterrows(), total=len(df), desc="Processing Dataset"):
        try:
            y = preprocess_audio(row['path'])
            X.append(extract_features(y))
            Y.append(row['label'])
        except Exception:
            continue
    return np.array(X, dtype=np.float32), np.array(Y)
