import React from "react";

const techStack = [
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.12Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.12Z"></path></svg>, 
    label: "TensorFlow 2.x", 
    sub: "Deep Learning Engine" 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>, 
    label: "Librosa 0.10.x", 
    sub: "Audio Feature Extraction" 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"></circle><path d="M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14z"></path><path d="M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" transform="rotate(60 12 12)"></path><path d="M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" transform="rotate(120 12 12)"></path></svg>, 
    label: "React 18", 
    sub: "Modern UI Componentry" 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>, 
    label: "FastAPI", 
    sub: "High-Performance Backend" 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>, 
    label: "NumPy & Pandas", 
    sub: "Signal Data Processing" 
  },
  { 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>, 
    label: "Supabase Auth", 
    sub: "Secure Cloud Middleware" 
  },
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