import React, { useState, useRef } from "react";

const DISEASE_INFO = {
  'Flea Allergy': "Common skin irritation caused by flea bites. Symptoms include intense itching and scabs.",
  'Health': "Skin appears healthy. No significant dermatological issues detected by AI.",
  'Ringworm': "A fungal infection causing circular, crusty patches. Highly contagious (including to humans).",
  'Scabies': "A parasitic mite infestation causing extreme itchiness, hair loss, and crusting."
};

function DiseaseAnalysis() {
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert("Please upload a valid image file.");
      return;
    }
    setImageFile(file);
    setPreviewURL(URL.createObjectURL(file));
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await fetch("http://127.0.0.1:5001/predict-disease", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Analysis Error:", error);
      alert("Failed to analyze image. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setPreviewURL(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="disease-analysis-container">
      <div className="demo-dashboard">
        <div className="demo-controls-card">
          <div 
            className={`upload-zone ${previewURL ? "has-file" : ""}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {previewURL ? (
              <img src={previewURL} alt="Preview" className="image-preview-img" />
            ) : (
              <>
                <span className="upload-icon">📸</span>
                <span className="upload-text">Upload Skin Image</span>
              </>
            )}
          </div>

          <div className="btn-group mt-lg">
            <button
              className="btn-primary w-full"
              onClick={handleAnalyze}
              disabled={!imageFile || loading}
            >
              {loading ? "Analyzing..." : "Analyze Skin Health"}
            </button>
            {imageFile && (
              <button className="btn-outline w-full mt-sm" onClick={handleReset}>
                Reset
              </button>
            )}
          </div>

          {loading && (
            <div className="loading-indicator mt-md">
              <div className="spinner"></div>
              <span>Processing image patterns...</span>
            </div>
          )}
        </div>

        {result && (
          <div className="demo-result-container mt-2xl">
            <div className="emotion-result-card">
              <div className="emotion-summary">
                <h2 className="primary-emotion-name">{result.disease}</h2>
                <span className="analysis-tag">Dermatological Insight</span>
              </div>
              
              <p className="emotion-description mt-md">
                {DISEASE_INFO[result.disease] || "Diagnostic analysis complete."}
              </p>

              <div className="confidence-breakdown mt-lg">
                {Object.entries(result.confidence_scores).map(([label, score]) => {
                  const percentage = (score * 100).toFixed(1);
                  const isPrimary = label === result.disease;
                  return (
                    <div key={label} className={`breakdown-row ${isPrimary ? 'highlight' : ''}`}>
                      <span className="breakdown-label">{label}</span>
                      <div className="breakdown-track">
                        <div className="breakdown-fill" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <span className="breakdown-value">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiseaseAnalysis;
