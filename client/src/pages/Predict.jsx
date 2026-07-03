import React, { useState } from "react";
import AudioUpload from "../components/AudioUpload";
import EmotionCard from "../components/EmotionCard";

function Predict() {
  const [audioFile, setAudioFile] = useState(null);
  const [emotion, setEmotion] = useState("");
  const [confidenceScores, setConfidenceScores] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!audioFile) {
      alert("Please upload audio first!");
      return;
    }

    setLoading(true);
    setEmotion("");
    setConfidenceScores(null);

    try {
      const formData = new FormData();
      formData.append("file", audioFile);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Prediction failed");

      const data = await res.json();

      setEmotion(data.emotion);
      setConfidenceScores(data.confidence_scores);

    } catch (error) {
      console.error("Error:", error);
      alert("Server error! Make sure the backend is running and the model is loaded.");
    }

    setLoading(false);
  };

  const handleReset = () => {
    setAudioFile(null);
    setEmotion("");
    setConfidenceScores(null);
  };

  return (
    <div className="container py-2xl">
      <div className="section-header centered">
        <span className="badge">AI Analysis</span>
        <h1 className="section-title">Meow Interpreter</h1>
        <p className="section-subtitle">
          Upload a recording of your cat's vocalization to understand their current emotional state using our advanced neural network.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <AudioUpload setAudioFile={setAudioFile} />

        <button
          className="analyze-btn w-full mt-lg"
          onClick={handlePredict}
          disabled={loading || !audioFile}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> 
              Analyzing...
            </>
          ) : (
            "Begin Interpretation"
          )}
        </button>

        {loading && (
          <div className="loading-bar mt-md">
            <div className="loading-bar-fill"></div>
          </div>
        )}

        <div className="mt-2xl">
          <EmotionCard 
            emotion={emotion} 
            confidenceScores={confidenceScores} 
            onReset={handleReset} 
          />
        </div>
      </div>
    </div>
  );
}


export default Predict;