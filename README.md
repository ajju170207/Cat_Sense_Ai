# CatSense AI 🐾

**Decoding the secret language of cats with advanced AI.**

CatSense AI is a state-of-the-art acoustic analysis system designed to help humans understand the emotional landscape of their feline companions. By leveraging deep learning architectures (MobileNetV2 + BiLSTM), the system accurately classifies cat vocalizations into 10 distinct emotional states and identifies common skin health issues.

## ✨ Features

- **Audio Emotion Analysis**: Real-time classification of meows (Happy, Angry, Warning, etc.).
- **Skin Health Diagnostics**: Image-based detection of Ringworm, Scabies, and Flea Allergies.
- **Bioluminescent UI**: A premium, dark-mode inspired interface for a modern experience.
- **Dual AI Pipeline**: High-performance backend handling both acoustic and visual deep learning models.

## 🏗️ Architecture

- **Frontend**: React (Vite) with Vanilla CSS for maximum performance and design control.
- **Backend**: FastAPI (Python) with TensorFlow/Keras for model serving.
- **Database**: Supabase for secure cloud middleware and data persistence.

## 📁 Project Structure

```text
├── client/          # React Frontend (Vite)
├── server/          # FastAPI Backend & ML Source
├── models/          # Pre-trained Keras Weights
├── datasets/        # Training & Verification Datasets
├── research/        # Jupyter Notebooks & Experiment Logs
└── docs/            # Design Documentation & PRD
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- FFmpeg (for audio processing)

### Installation
1. Clone the repository.
2. Install frontend dependencies: `cd client && npm install`.
3. Install backend dependencies: `pip install -r requirements.txt`. (Note: Ensure `.venv` is configured).

### Configuration
1. Decrypt `.env.enc` (Contact lead developer for key) or use `.env.example`.
2. Start the backend: `python server/src/server.py`.
3. Start the frontend: `cd client && npm run dev`.

## 🤝 Team
- **Abhijeet Nalawade**: Researcher
- **Ajay Rathod**: Frontend Dev
- **Jaydeep Sapatale**: Model Dev
- **Ajay Sharma**: Lead Developer

---
*Built with ❤️ by 404_not_found at AI&DS Department.*
