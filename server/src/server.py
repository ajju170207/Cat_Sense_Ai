import os
import gc

# --- MEMORY OPTIMIZATIONS FOR RENDER FREE TIER ---
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

try:
    import tensorflow as tf
    tf.config.threading.set_intra_op_parallelism_threads(1)
    tf.config.threading.set_inter_op_parallelism_threads(1)
except:
    pass
# -------------------------------------------------

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import tempfile
import uvicorn
import numpy as np
from tensorflow import keras
from . import config
from . import data_utils
from .models import AttentionLayer

app = FastAPI(title="CatSense AI API", description="API for Cat Emotion Prediction")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model variables
MODEL_EMOTION = None
MODEL_DISEASE = None

# Labels for skin disease
DISEASE_LABELS = ['Flea Allergy', 'Health', 'Ringworm', 'Scabies']

def load_model_from_pkl(path, is_audio=True):
    """
    Rebuilds a Keras model from a pickle file containing weights and config.
    """
    import pickle
    try:
        with open(path, 'rb') as f:
            data = pickle.load(f)
        
        # Determine architecture based on the config name or class names
        class_names = data.get('class_names', [])
        
        if is_audio:
            # We use the professionally refined model if it has attention/lstm
            # otherwise we could fallback, but here we try the robust one first.
            from src.models import build_professionally_refined_model
            model = build_professionally_refined_model(n_classes=len(class_names))
        else:
            from src.models import build_disease_model
            model = build_disease_model(n_classes=len(class_names))

        model.set_weights(data['weights'])
        return model
    except Exception as e:
        print(f"Error rebuilding model from {path}: {e}")
        # Secondary fallback if is_audio (try the simpler one if refined fails)
        if is_audio:
            try:
                from src.models import build_simple_cnn
                model = build_simple_cnn(n_classes=len(data.get('class_names', [])))
                model.set_weights(data['weights'])
                return model
            except:
                pass
        return None

@app.on_event("startup")
async def load_models():
    global MODEL_EMOTION, MODEL_DISEASE
    
    # Potential paths for the emotion model (adding the pkl names)
    emotion_model_names = ['catsense_final_best.pkl', 'catsense_final_best.keras', 'catsense_v1_prod.keras']
    possible_dirs = [config.MODEL_VAULT, os.path.join(config.PROJECT_ROOT, 'exports'), os.path.join(config.PROJECT_ROOT, 'outputs/models')]
    
    # Load Emotion Model
    loaded_emotion = False
    for model_dir in possible_dirs:
        if loaded_emotion: break
        for name in emotion_model_names:
            path = os.path.join(model_dir, name)
            if os.path.exists(path):
                try:
                    print(f"Attempting to load emotion model from {path}...")
                    if path.endswith('.keras') or path.endswith('.h5'):
                        MODEL_EMOTION = keras.models.load_model(path, custom_objects={'AttentionLayer': AttentionLayer})
                    elif path.endswith('.pkl'):
                        MODEL_EMOTION = load_model_from_pkl(path, is_audio=True)
                    
                    if MODEL_EMOTION:
                        print(f"Emotion model loaded successfully from {path}.")
                        loaded_emotion = True
                        break
                except Exception as e:
                    print(f"Failed to load model from {path}: {e}")

    if not loaded_emotion:
        print("WARNING: No emotion model found in expected locations.")

    # Load Disease Model
    disease_model_names = ['cat_disease_model.pkl', 'cat_disease_model.keras']
    loaded_disease = False
    for model_dir in possible_dirs:
        if loaded_disease: break
        for name in disease_model_names:
            path = os.path.join(model_dir, name)
            if os.path.exists(path):
                try:
                    print(f"Attempting to load disease model from {path}...")
                    if path.endswith('.keras') or path.endswith('.h5'):
                        MODEL_DISEASE = keras.models.load_model(path)
                    elif path.endswith('.pkl'):
                        MODEL_DISEASE = load_model_from_pkl(path, is_audio=False)
                    
                    if MODEL_DISEASE:
                        print(f"Disease model loaded successfully from {path}.")
                        loaded_disease = True
                        break
                except Exception as e:
                    print(f"Failed to load model from {path}: {e}")
    
    if not loaded_disease:
        print("WARNING: No disease model found in expected locations.")

    # Force garbage collection to free memory used during model initialization
    gc.collect()



@app.post("/predict")
async def predict_audio(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    if MODEL_EMOTION is None:
        raise HTTPException(status_code=503, detail="Emotion model not loaded")

    try:
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
            
        y = data_utils.preprocess_audio(tmp_path)
        feat = data_utils.extract_features(y)
        
        pred = MODEL_EMOTION.predict(np.expand_dims(feat, 0), verbose=0)
        class_idx = np.argmax(pred)
        label = config.CATEGORIES[class_idx]
        
        os.unlink(tmp_path)
            
        return {
            "emotion": label,
            "confidence_scores": dict(zip(config.CATEGORIES, map(float, pred[0]))),
            "predicted_class": label
        }
    except Exception as e:
        print(f"Server Error (Audio): {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-disease")
async def predict_disease(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    if MODEL_DISEASE is None:
        raise HTTPException(status_code=503, detail="Disease model not loaded")

    try:
        # Save temp image
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
            
        # Image Preprocessing (224, 224, 3)
        import cv2
        img = cv2.imread(tmp_path)
        if img is None:
            raise Exception("Could not read image file")
            
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (224, 224))
        img = img.astype('float32') / 255.0
        
        # Inference
        pred = MODEL_DISEASE.predict(np.expand_dims(img, 0), verbose=0)
        class_idx = np.argmax(pred)
        label = DISEASE_LABELS[class_idx]
        
        # Clean up
        os.unlink(tmp_path)
        
        return {
            "disease": label,
            "confidence_scores": dict(zip(DISEASE_LABELS, map(float, pred[0]))),
            "predicted_class": label
        }
        
    except Exception as e:
        print(f"Server Error (Disease): {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {
        "status": "online", 
        "emotion_model": MODEL_EMOTION is not None,
        "disease_model": MODEL_DISEASE is not None
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    uvicorn.run(app, host="0.0.0.0", port=port)
