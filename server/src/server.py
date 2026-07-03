import os
import gc

# --- MEMORY OPTIMIZATIONS FOR RENDER FREE TIER ---
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
# -------------------------------------------------

from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import tempfile
import uvicorn
import numpy as np
import onnxruntime as ort
from . import config
from . import data_utils

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
MODEL_EMOTION_SESSION = None
MODEL_DISEASE_SESSION = None

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

def ensure_model_loaded(model_type):
    global MODEL_EMOTION_SESSION, MODEL_DISEASE_SESSION
    possible_dirs = [config.MODEL_VAULT, os.path.join(config.PROJECT_ROOT, 'exports'), os.path.join(config.PROJECT_ROOT, 'outputs/models')]
    
    if model_type == 'emotion':
        if MODEL_EMOTION_SESSION is not None: return True
        if MODEL_DISEASE_SESSION is not None:
            print("Unloading disease model to free memory...")
            MODEL_DISEASE_SESSION = None
            gc.collect()
        
        for model_dir in possible_dirs:
            path = os.path.join(model_dir, 'catsense_final_best.onnx')
            if os.path.exists(path):
                try:
                    print(f"Loading ONNX emotion model from {path}...")
                    MODEL_EMOTION_SESSION = ort.InferenceSession(path, providers=['CPUExecutionProvider'])
                    return True
                except Exception as e:
                    print(f"Error loading {path}: {e}")
                    
    elif model_type == 'disease':
        if MODEL_DISEASE_SESSION is not None: return True
        if MODEL_EMOTION_SESSION is not None:
            print("Unloading emotion model to free memory...")
            MODEL_EMOTION_SESSION = None
            gc.collect()
            
        for model_dir in possible_dirs:
            path = os.path.join(model_dir, 'cat_disease_model.onnx')
            if os.path.exists(path):
                try:
                    print(f"Loading ONNX disease model from {path}...")
                    MODEL_DISEASE_SESSION = ort.InferenceSession(path, providers=['CPUExecutionProvider'])
                    return True
                except Exception as e:
                    print(f"Error loading {path}: {e}")
    return False

@app.on_event("startup")
async def startup_event():
    print("Server started. Models will load lazily via ONNX Runtime.")

@app.post("/predict")
async def predict_audio(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    if MODEL_EMOTION_SESSION is None:
        if not IS_LOADING_EMOTION:
            background_tasks.add_task(background_load_model, 'emotion')
        return JSONResponse(
            status_code=503,
            content={"detail": "The AI model is currently waking up from sleep (Render Free Tier). Please try again in 10 seconds."},
            background=background_tasks
        )

    try:
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
            
        y = data_utils.preprocess_audio(tmp_path)
        feat = data_utils.extract_features(y)
        
        input_name = MODEL_EMOTION_SESSION.get_inputs()[0].name
        pred = MODEL_EMOTION_SESSION.run(None, {input_name: np.expand_dims(feat, 0).astype(np.float32)})[0]
        
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
    
    if MODEL_DISEASE_SESSION is None:
        if not IS_LOADING_DISEASE:
            background_tasks.add_task(background_load_model, 'disease')
        return JSONResponse(
            status_code=503,
            content={"detail": "The AI model is currently waking up from sleep (Render Free Tier). Please try again in 10 seconds."},
            background=background_tasks
        )

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
        
        input_name = MODEL_DISEASE_SESSION.get_inputs()[0].name
        pred = MODEL_DISEASE_SESSION.run(None, {input_name: np.expand_dims(img, 0).astype(np.float32)})[0]
        
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
        "emotion_model_in_mem": MODEL_EMOTION_SESSION is not None,
        "disease_model_in_mem": MODEL_DISEASE_SESSION is not None,
        "mode": "onnx_lazy_loading"
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    uvicorn.run(app, host="0.0.0.0", port=port)
