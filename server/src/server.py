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

from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
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

IS_LOADING_EMOTION = False
IS_LOADING_DISEASE = False

def background_load_model(model_type):
    global IS_LOADING_EMOTION, IS_LOADING_DISEASE
    if model_type == 'emotion':
        IS_LOADING_EMOTION = True
        try: ensure_model_loaded('emotion')
        except: pass
        finally: IS_LOADING_EMOTION = False
    elif model_type == 'disease':
        IS_LOADING_DISEASE = True
        try: ensure_model_loaded('disease')
        except: pass
        finally: IS_LOADING_DISEASE = False

def load_model_from_pkl(path, is_audio=True):
    import pickle
    try:
        with open(path, 'rb') as f:
            data = pickle.load(f)
        
        class_names = data.get('class_names', [])
        
        if is_audio:
            from src.models import build_professionally_refined_model
            model = build_professionally_refined_model(n_classes=len(class_names))
        else:
            from src.models import build_disease_model
            model = build_disease_model(n_classes=len(class_names))

        model.set_weights(data['weights'])
        return model
    except Exception as e:
        print(f"Error rebuilding model from {path}: {e}")
        if is_audio:
            try:
                from src.models import build_simple_cnn
                model = build_simple_cnn(n_classes=len(data.get('class_names', [])))
                model.set_weights(data['weights'])
                return model
            except:
                pass
        return None

def ensure_model_loaded(model_type):
    global MODEL_EMOTION, MODEL_DISEASE
    possible_dirs = [config.MODEL_VAULT, os.path.join(config.PROJECT_ROOT, 'exports'), os.path.join(config.PROJECT_ROOT, 'outputs/models')]
    
    if model_type == 'emotion':
        if MODEL_EMOTION is not None: return True
        if MODEL_DISEASE is not None:
            print("Unloading disease model to free memory...")
            MODEL_DISEASE = None
            keras.backend.clear_session()
            gc.collect()
        
        emotion_model_names = ['catsense_final_best.pkl', 'catsense_final_best.keras', 'catsense_v1_prod.keras']
        for model_dir in possible_dirs:
            for name in emotion_model_names:
                path = os.path.join(model_dir, name)
                if os.path.exists(path):
                    try:
                        print(f"Loading emotion model from {path}...")
                        if path.endswith('.keras') or path.endswith('.h5'):
                            MODEL_EMOTION = keras.models.load_model(path, custom_objects={'AttentionLayer': AttentionLayer})
                        elif path.endswith('.pkl'):
                            MODEL_EMOTION = load_model_from_pkl(path, is_audio=True)
                        if MODEL_EMOTION: return True
                    except: pass
                    
    elif model_type == 'disease':
        if MODEL_DISEASE is not None: return True
        if MODEL_EMOTION is not None:
            print("Unloading emotion model to free memory...")
            MODEL_EMOTION = None
            keras.backend.clear_session()
            gc.collect()
            
        disease_model_names = ['cat_disease_model.pkl', 'cat_disease_model.keras']
        for model_dir in possible_dirs:
            for name in disease_model_names:
                path = os.path.join(model_dir, name)
                if os.path.exists(path):
                    try:
                        print(f"Loading disease model from {path}...")
                        if path.endswith('.keras') or path.endswith('.h5'):
                            MODEL_DISEASE = keras.models.load_model(path)
                        elif path.endswith('.pkl'):
                            MODEL_DISEASE = load_model_from_pkl(path, is_audio=False)
                        if MODEL_DISEASE: return True
                    except: pass
    return False

@app.on_event("startup")
async def startup_event():
    print("Server started. Models will load lazily on first request to prevent OOM on Render Free Tier.")

@app.post("/predict")
async def predict_audio(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    if MODEL_EMOTION is None:
        if not IS_LOADING_EMOTION:
            background_tasks.add_task(background_load_model, 'emotion')
        raise HTTPException(status_code=503, detail="The AI model is currently waking up from sleep (Render Free Tier). Please try again in 45 seconds.")

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
async def predict_disease(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    if MODEL_DISEASE is None:
        if not IS_LOADING_DISEASE:
            background_tasks.add_task(background_load_model, 'disease')
        raise HTTPException(status_code=503, detail="The AI model is currently waking up from sleep (Render Free Tier). Please try again in 45 seconds.")

    try:
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
            
        import cv2
        img = cv2.imread(tmp_path)
        if img is None:
            raise Exception("Could not read image file")
            
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (224, 224))
        img = img.astype('float32') / 255.0
        
        pred = MODEL_DISEASE.predict(np.expand_dims(img, 0), verbose=0)
        class_idx = np.argmax(pred)
        label = DISEASE_LABELS[class_idx]
        
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
        "emotion_model_in_mem": MODEL_EMOTION is not None,
        "disease_model_in_mem": MODEL_DISEASE is not None,
        "mode": "lazy_loading_swapper"
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    uvicorn.run(app, host="0.0.0.0", port=port)
