import React from "react";

const techStack = [
  { icon: "🧠", label: "TensorFlow 2.x", sub: "Deep Learning Engine" },
  { icon: "🎵", label: "Librosa 0.10.x", sub: "Audio Feature Extraction" },
  { icon: "⚛️", label: "React 18", sub: "Modern UI Componentry" },
  { icon: "⚡", label: "FastAPI", sub: "High-Performance Backend" },
  { icon: "📊", label: "NumPy & Pandas", sub: "Signal Data Processing" },
  { icon: "🛡️", label: "Supabase Auth", sub: "Secure Cloud Middleware" },
];

const features = [
  "Real-time audio emotion detection from cat vocalizations",
  "10-class emotion classification including Happy, Angry, and Defense",
  "Hybrid deep learning: MobileNetV2 + BiLSTM + Attention Mechanism",
  "Audio preprocessing: Noise removal and normalization (22,050 Hz)",
  "Log-Mel Spectrogram and MFCC feature fusion for high accuracy",
  "Confidence scores for all emotional categories",
  "Cross-platform support: Desktop and Mobile recording",
  "Low-latency inference (< 3 seconds) for real-time feedback",
];

function About() {
  return (
    <main id="main-content" className="about-page">
      {/* Page Hero */}
      <section className="hero-mini">
        <div className="container centered">
          <span className="badge">Project Philosophy</span>
          <h1 className="section-title">Bridging the Species Gap</h1>
          <p className="section-subtitle">
            CatSense AI is an advanced acoustic analysis system designed to help humans 
            understand the complex emotional landscape of their feline companions using 
            state-of-the-art machine learning.
          </p>
        </div>
      </section>

      {/* Features List */}
      <section className="bg-surface">
        <div className="container">
          <div className="grid-2-col">
            <div className="features-content">
              <span className="badge">Capabilities</span>
              <h2 className="section-title">Technical Excellence</h2>
              <ul className="bullet-list">
                {features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
            <div className="features-image">
               {/* Illustration or placeholder would go here */}
               <div className="tech-viz-box">
                  <div className="viz-layer">Feature Extraction</div>
                  <div className="viz-layer">Acoustic Modeling</div>
                  <div className="viz-layer">Emotional Mapping</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section>
        <div className="container">
          <div className="section-header centered">
            <span className="badge">Stack</span>
            <h2 className="section-title">Built with Precision</h2>
          </div>
          <div className="tech-grid">
            {techStack.map((t) => (
              <div key={t.label} className="tech-item">
                <span className="tech-icon">{t.icon}</span>
                <div className="tech-info">
                  <p className="tech-label">{t.label}</p>
                  <p className="tech-sub">{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-surface team-section">
        <div className="container">
          <div className="section-header centered">
            <span className="badge">Our Team</span>
            <h2 className="section-title">The Minds Behind CatSense</h2>
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

          <div className="institute-footer">
            <p><strong>Department of AI & Data Science</strong></p>
            <p>Vidya Pratishthan's Kamalnayan Bajaj Institute of Engineering & Technology, Baramati</p>
            <p className="muted">Academic Year 2025–26 · Supervisor: Mr. Pradip Ghorpade</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;