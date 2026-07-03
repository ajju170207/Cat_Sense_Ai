import React, { useState, useRef } from "react";
import { supabase } from "../lib/supabase";
 
const DISEASE_INFO = {
  "Flea Allergy": "Skin irritation caused by flea bites.",
  "Health":       "No significant skin issues detected.",
  "Ringworm":     "Fungal infection causing circular, crusty patches.",
  "Scabies":      "Parasitic mite infestation causing itchiness and hair loss.",
};
 
function DiseaseAnalysis() {
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
 
  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setPreviewURL(URL.createObjectURL(file));
    setResult(null);
  };
 
  const handleAnalyze = async () => {
    if (!imageFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", imageFile);

    let data = null;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/predict-disease`, { method: "POST", body: formData });
      data = await res.json();
      setResult(data);
    } catch (e) {
      alert("Failed to analyze. Ensure backend is running.");
      setLoading(false);
      return;
    }

    // --- Persist to Supabase if user is logged in ---
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && data) {
        const user = session.user;
        let imageUrl = null;

        // Upload image to storage
        const fileName = `${user.id}/${Date.now()}-${imageFile.name}`;
        const { data: uploadData } = await supabase.storage
          .from("cat-skin-images")
          .upload(fileName, imageFile);

        if (uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from("cat-skin-images")
            .getPublicUrl(fileName);
          imageUrl = publicUrl;
        }

        const topConfidence = data.confidence_scores
          ? Math.max(...Object.values(data.confidence_scores))
          : 0;

        await supabase.from("disease_history").insert({
          user_id:           user.id,
          disease:           data.disease || data.predicted_class,
          confidence:        topConfidence,
          confidence_scores: data.confidence_scores || null,
          image_url:         imageUrl,
        });

        // Also log to health history
        const healthMap = {
          "Health":       "Excellent",
          "Flea Allergy": "Needs Attention",
          "Ringworm":     "Needs Attention",
          "Scabies":      "Critical",
        };
        await supabase.from("cat_health_history").insert({
          user_id:       user.id,
          health_status: healthMap[data.disease] || "Unknown",
          notes:         `Skin analysis detected: ${data.disease}.`,
        });
      }
    } catch (persistenceErr) {
      console.warn("Skin disease persistence failed:", persistenceErr.message);
    }

    setLoading(false);
  };
 
  const handleReset = () => {
    setImageFile(null);
    setPreviewURL(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
 
  return (
    <div style={{ fontFamily: "inherit", maxWidth: 400, margin: "0 auto" }}>
 
      {/* Upload zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: "1.5px dashed var(--color-brand-primary)",
          borderRadius: "var(--radius-pill)",
          background: "rgba(37, 99, 235, 0.03)",
          minHeight: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          overflow: "hidden",
          marginBottom: 16,
          color: "var(--color-brand-primary)",
          fontWeight: 600,
          transition: "all 0.2s ease"
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {previewURL ? (
          <img src={previewURL} alt="Preview" style={{ width: "100%", height: "140px", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 15, display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload skin image
          </span>
        )}
      </div>
 
      {/* Actions */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: 20 }}>
        <button
          onClick={handleAnalyze}
          disabled={!imageFile || loading}
          className="btn-outline"
          style={{ flex: 1, opacity: imageFile && !loading ? 1 : 0.5 }}
        >
          {loading ? "Analyzing..." : "Analyze skin health"}
        </button>
        {imageFile && (
          <button
            onClick={handleReset}
            className="btn-outline"
          >
            Reset
          </button>
        )}
      </div>
 
      {/* Result */}
      {result && (
        <div style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)",
          padding: "1.25rem",
        }}>
 
          {/* Condition + one-liner */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 4 }}>
              {result.disease}
            </div>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              {DISEASE_INFO[result.disease] ?? "Diagnostic analysis complete."}
            </div>
          </div>
 
          {/* Divider */}
          <div style={{ height: "0.5px", background: "var(--color-border-tertiary)", marginBottom: "1rem" }} />
 
          {/* Confidence bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {Object.entries(result.confidence_scores).map(([label, score]) => {
              const pct = score * 100;
              const isPrimary = label === result.disease;
              const barColor = isPrimary
                ? "#D85A30"
                : pct >= 15
                ? "#BA7517"
                : "#B4B2A9";
 
              return (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, opacity: pct < 0.1 ? 0.35 : 1 }}>
                  <span style={{ fontSize: 12, color: "var(--color-text-secondary)", minWidth: 96 }}>
                    {label}
                  </span>
                  <div style={{ flex: 1, height: 5, background: "var(--color-background-secondary)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: barColor,
                      borderRadius: 99,
                      transition: "width .6s cubic-bezier(.4,0,.2,1)",
                    }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)", minWidth: 38, textAlign: "right" }}>
                    {pct.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
 
          {/* CTA */}
          <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "center" }}>
              <button
                onClick={handleReset}
                className="btn-outline"
              >
                New image analysis
              </button>
          </div>
 
        </div>
      )}
    </div>
  );
}
 
export default DiseaseAnalysis;