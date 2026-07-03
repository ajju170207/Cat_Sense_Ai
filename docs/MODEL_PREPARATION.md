# Cat Sense AI: Model Preparation Documentation

This document outlines the end-to-end process of preparing and deploying the audio-based emotion model and the image-based disease model for Cat Sense AI.

---

## 1. Audio-Based Emotion Model

### Step 1: Data Collection
- **Expert Pool**: Curated audio samples of cat vocalizations labeled by specialists.
  - `expert_collection_1`: Primary high-quality samples.
  - `expert_collection_2`: Supplemental behavioral samples.
- **Vocal Archive**: A large dataset of unlabeled vocalizations (`audio_vault`) used for semi-supervised learning.
- **Classes**: 10 distinct emotions (Angry, Defense, Fighting, Happy, HuntingMind, Mating, MotherCall, Paining, Resting, Warning).

### Step 2: Preprocessing
- **Resampling**: All audio files are normalized to 22,050 Hz.
- **Denoising**: Spectral gating is applied using the `noisereduce` library to remove background noise.
- **Normalization**: Audio is peak-normalized to ensure consistent levels.
- **Padding/Trimming**: Audio is standardized to a duration of 3 to 5 seconds.

### Step 3: Feature Extraction
- **Spectrograms**: Log-Mel Spectrograms and Mel-Frequency Cepstral Coefficients (MFCC) are extracted.
- **3-Channel Representation**: Features are stacked into a 128x128x3 matrix (similar to an image) to leverage pre-trained vision models.
  - Channel 1 & 2: Normalized Log-Mel Spectrogram.
  - Channel 3: Normalized MFCCs.

### Step 4: Model Architecture
- **Base Model**: `MobileNetV2` (pre-trained on ImageNet) acts as a feature extractor.
- **Custom Layers**:
  - Global Average Pooling.
  - Dense layers (256 units, ReLU activation).
  - Dropout (0.4) for regularization.
  - Softmax output layer (10 classes).

### Step 5: Training Pipeline
1.  **Expert Labeler**: Train a preliminary model only on the expert-labeled samples.
2.  **Auto-Labeling**: Use the expert labeler to predict emotions for the unlabeled `audio_vault` data.
3.  **Production Training**: Combine the expert data and the newly auto-labeled data to train the final production model (`catsense_final_best.keras`).

---

## 2. Cat Disease Model (Image-Based)

### Step 1: Data Collection
- **Samples**: Images of cat skin conditions collected from veterinary datasets.
- **Labels**: Flea Allergy, Healthy (Health), Ringworm, Scabies.

### Step 2: Preprocessing
- **Resizing**: Images are resized to 224x224 pixels.
- **Color Space**: Converted from BGR to RGB.
- **Normalization**: Pixel values are scaled to the range [0, 1].

### Step 3: Model & Training
- **Inference Pipeline**: A Convolutional Neural Network (CNN) trained to distinguish between the four condition labels.
- **Output**: Returns the condition name and confidence scores for each class.

---

## 3. Model Deployment

### API Integration (FastAPI)
- The models are loaded upon server startup using `keras.models.load_model`.
- **Audio Endpoint**: `/predict` accepts a meow recording, runs the preprocessing pipeline, and returns the emotion.
- **Disease Endpoint**: `/predict-disease` accepts a cat photo and returns the skin condition analysis.

### Exporting and Maintenance
- **Formats**: Models are primarily stored as `.keras` files for consistency with TensorFlow 2.x.
- **Persistence**: Models are stored in `exports/` or `models/weights/` for the backend to consume.
