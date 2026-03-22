from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import tempfile
import uvicorn
import numpy as np
from tensorflow import keras
import src.config as config
import src.data_utils as data_utils
from src.models import AttentionLayer

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

@app.on_event("startup")
async def load_models():
    global MODEL_EMOTION, MODEL_DISEASE
    
    # Load Emotion Model
    emotion_path = os.path.join(config.MODEL_VAULT, 'catsense_final_best.keras')
    try:
        if os.path.exists(emotion_path):
            print(f"Loading emotion model from {emotion_path}...")
            MODEL_EMOTION = keras.models.load_model(emotion_path, custom_objects={'AttentionLayer': AttentionLayer})
            print("Emotion model loaded successfully.")
    except Exception as e:
        print(f"Error loading emotion model: {e}")

    # Load Disease Model
    disease_path = os.path.join(config.MODEL_VAULT, 'cat_disease_model.keras')
    try:
        if os.path.exists(disease_path):
            print(f"Loading disease model from {disease_path}...")
            MODEL_DISEASE = keras.models.load_model(disease_path)
            print("Disease model loaded successfully.")
    except Exception as e:
        print(f"Error loading disease model: {e}")

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
    uvicorn.run(app, host="0.0.0.0", port=5001)
