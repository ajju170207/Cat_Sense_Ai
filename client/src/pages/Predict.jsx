import React, { useState } from "react";
import AudioUpload from "../components/AudioUpload";
import EmotionCard from "../components/EmotionCard";

function Predict() {
  const [audioFile, setAudioFile] = useState(null);
  const [emotion, setEmotion] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!audioFile) {
      alert("Please upload audio first!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", audioFile);

      const res = await fetch("http://127.0.0.1:5001/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // backend se emotion lena
      setEmotion(data.emotion);

    } catch (error) {
      console.error("Error:", error);
      alert("Server error! Check backend.");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🎤 Predict Cat Emotion</h1>

      <AudioUpload setAudioFile={setAudioFile} />

      <button
        className="btn-primary w-full mt-lg"
        onClick={handlePredict}
        disabled={loading}
      >
        {loading ? "Predicting..." : "Predict Emotion"}
      </button>

      {loading && <p className="mt-md text-center">Analyzing audio... ⏳</p>}

      <div className="mt-2xl">
        <EmotionCard emotion={emotion} />
      </div>
    </div>
  );
}

export default Predict;