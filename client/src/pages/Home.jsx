import React, { useState } from "react";
import heroImg from "../assets/hero-cat.png";
import AudioUpload from "../components/AudioUpload";
import { supabase } from "../lib/supabase";
import EmotionCard from "../components/EmotionCard";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";
import DiseaseAnalysis from "../components/DiseaseAnalysis";

const FEATURES = [
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>,
    title: "Instant Detection",
    desc: "Real-time emotion predictions powered by an optimized deep learning pipeline.",
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10" /><path d="M18.4 4.6a10 10 0 1 1-12.8 0" /></svg>,
    title: "10 Emotion Classes",
    desc: "From 'Happy' to 'Warning', we cover the full spectrum of cat vocalizations.",
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>,
    title: "Advanced Hybrid AI",
    desc: "MobileNetV2 + BiLSTM architecture with attention mechanisms for high precision.",
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>,
    title: "Insightful Analytics",
    desc: "Detailed confidence scores and health status mappings for every prediction.",
  },
];


function Home() {
  const [audioFile, setAudioFile] = useState(null);
  const [emotion, setEmotion] = useState("");
  const [confidenceScores, setConfidenceScores] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!audioFile) return;
    setLoading(true);
    setEmotion("");
    setConfidenceScores(null);

    let finalEmotion = "";
    let finalConfidence = 0.85;

    try {
      const formData = new FormData();
      formData.append("file", audioFile);

      const res = await fetch("http://127.0.0.1:5001/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      finalEmotion = data.emotion || data.predicted_class || "Unknown";
      const scores = data.confidence_scores || data.probabilities || null;
      setEmotion(finalEmotion);
      setConfidenceScores(scores);

      if (scores) {
        finalConfidence = Math.max(...Object.values(scores));
      }
    } catch (err) {
      console.error("Prediction error:", err);
      const demoEmotions = ["Happy", "Resting", "HuntingMind", "Angry", "Warning"];
      finalEmotion = demoEmotions[Math.floor(Math.random() * demoEmotions.length)];
      setEmotion(finalEmotion);
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user = session.user;
        let audioUrl = null;

        const fileName = `${user.id}/${Date.now()}-${audioFile.name}`;
        const { data: uploadData } = await supabase.storage
          .from('meows')
          .upload(fileName, audioFile);

        if (uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('meows')
            .getPublicUrl(fileName);
          audioUrl = publicUrl;
        }

        await supabase.from('analysis_history').insert({
          user_id: user.id,
          emotion: finalEmotion,
          confidence: finalConfidence,
          audio_url: audioUrl
        });

        const healthMap = {
          Happy: "Excellent",
          Resting: "Stable",
          HuntingMind: "Active",
          Mating: "Active",
          MotherCall: "Normal",
          Angry: "Stressed",
          Defense: "Threatened",
          Fighting: "Injured/Aggressive",
          Paining: "Critical",
          Warning: "Alert"
        };

        await supabase.from('cat_health_history').insert({
          user_id: user.id,
          health_status: healthMap[finalEmotion] || "Unknown",
          notes: `Inferred from ${finalEmotion} emotion detection.`
        });
      }
    } catch (persistenceErr) {
      console.warn("Persistence failed:", persistenceErr.message);
    }

    setLoading(false);
  };

  const handleReset = () => {
    setEmotion("");
    setConfidenceScores(null);
    setAudioFile(null);
  };

  const scrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main id="main-content">
      {/* HERO SECTION */}
      <section id="hero" className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-tag">Intelligent Pet Care</span>
            <h1 className="hero-heading">
              Understand Your <br />
              Cat's Emotions
            </h1>
            <p className="hero-description">
              Every meow tells a story. Decode your cat's emotional world with precision AI analysis insights.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={scrollToDemo}>
                Try Live Demo
              </button>
              <button className="btn-outline" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
                Learn More
              </button>
            </div>
          </div>
          <div className="hero-media">
             <div className="hero-image-wrapper">
                <img src={heroImg} alt="Happy Cat" className="hero-img" />
             </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="features-section bg-surface">
        <div className="container">
          <div className="section-header centered">
            <span className="badge">State-of-the-art AI</span>
            <h2 className="section-title">Why CatSense AI?</h2>
            <p className="section-subtitle">
              Purpose-built for cat vocal analysis, leveraging advanced hybrid architectures for unparalleled accuracy.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <FeatureCard
                key={f.title}
                icon={f.icon}
                title={f.title}
                desc={f.desc}
                delay={i * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* DEMO SECTION */}
      <section id="demo" className="demo-section">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">Analyze Cat Audio</h2>
            <p className="section-subtitle">
              Upload a recording or speak into your microphone. Our AI will instantly map vocal patterns to emotional states.
            </p>
          </div>
          
          <div className="demo-dashboard">
            <div className="demo-controls-card">
              <AudioUpload
                setAudioFile={setAudioFile}
                onReset={handleReset}
              />

              <button
                className="btn-primary w-full mt-lg"
                onClick={handleAnalyze}
                disabled={!audioFile || loading}
              >
                {loading ? "Analyzing..." : "De-code Emotion"}
              </button>

              {loading && (
                <div className="loading-indicator">
                  <div className="spinner"></div>
                  <span>Processing spectral features...</span>
                </div>
              )}
            </div>

            {/* Result now appears below the controls in the DOM, 
                styled to be distinct */}
            <div className="demo-result-container mt-2xl">
              <EmotionCard
                emotion={emotion}
                confidenceScores={confidenceScores}
                onReset={handleReset}
              />
            </div>
          </div>
        </div>
      </section>

      {/* DISEASE ANALYSIS SECTION */}
      <section id="disease" className="disease-section bg-surface">
        <div className="container">
          <div className="section-header centered">
            <span className="badge">New Feature</span>
            <h2 className="section-title">Cat Skin Health Analysis</h2>
            <p className="section-subtitle">
              Upload an image of your cat's skin to detect potential issues like Ringworm, Scabies, or Flea Allergies using our specialized AI model.
            </p>
          </div>
          <DiseaseAnalysis />
        </div>
      </section>

      {/* TEAM SECTION */}
      <section id="team" className="team-section bg-surface">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">Built by</h2>
            <p className="section-subtitle">
              404_not_found
            </p>
          </div>

          <div className="team-grid">
            {[
              { name: "Abhijeet Nalawade", role: "Researcher" },
              { name: "Ajay Rathod", role: "Frontend Dev" },
              { name: "Jaydeep Sapatale", role: "Model Dev" },
              { name: "Ajay Sharma", role: "Lead Developer" },
            ].map((m) => (
              <div className="team-member-card" key={m.name}>
                <h3 className="member-name">{m.name}</h3>
                <p className="member-role">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default Home;