# Deployment Requirements - CatSense AI

To deploy the **CatSense AI** platform to a production environment, follow these requirements and steps.

## 1. Backend (FastAPI)
The backend handles AI inference for both audio emotion and skin disease analysis.

- **Python Version**: 3.11+
- **Key Dependencies**:
  - `tensorflow`: For model inference.
  - `fastapi`, `uvicorn`: For the web server.
  - `librosa`, `noisereduce`, `scipy`: For audio preprocessing.
  - `opencv-python`: For image preprocessing.
- **System Requirements**: 
  - **FFmpeg**: Required by `librosa` for reading `.mp3` and `.wav` files.
  - **Memory**: Minimum 4GB RAM (TensorFlow models are memory-intensive).
- **Environment**:
  - `PYTHONPATH` should include the `server` directory.
  - Run command: `PYTHONPATH=server python -m src.server`

## 2. Frontend (React + Vite)
The frontend provides a premium, bioluminescent UI for user interaction.

- **Node.js Version**: 18+
- **Environment Variables**:
  - Create a `.env` file in the `client` directory:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    VITE_API_URL=https://your-api-domain.com
    ```
- **Build Step**:
  - Run `npm install`
  - Run `npm run build`
  - The output will be in `client/dist`.

## 3. Database (Supabase)
Used for user authentication and history tracking.

- **Setup**:
  - Create a new project on [Supabase](https://supabase.com).
  - Run the SQL queries provided in `scripts/create_history_tables.sql` using the Supabase SQL Editor to initialize the tables (`analysis_history`, `cat_health_history`, `disease_history`).
- **RLS**: Row-Level Security is already configured in the script to ensure users can only see their own data.

## 4. Models
Ensure the following files exist in the `models/weights/` directory:
- `catsense_final_best.pkl` (or `.keras`)
- `cat_disease_model.pkl` (or `.keras`)

## 5. Hosting Recommendations
- **Frontend**: Vercel, Netlify, or AWS Amplify.
- **Backend**: Render, Railway, or AWS EC2 (with FFmpeg installed).
- **Database**: Supabase (Free Tier is sufficient for initial launch).

---
*Built with ❤️ by AI&DS Department.*
