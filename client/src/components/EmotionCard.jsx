import React from "react";

const EMOTION_CONFIG = {
  Happy:       { icon: "😊", color: "#10B981", desc: "Your cat is content and positive. A perfect time for bonding." },
  Angry:       { icon: "😾", color: "#EF4444", desc: "High agitation detected. Your cat needs space." },
  Defense:     { icon: "🛡️", color: "#F59E0B", desc: "Cat feels threatened. Avoid sudden movements." },
  Fighting:    { icon: "⚔️", color: "#DC2626", desc: "Aggressive state. Separate your cat from triggers." },
  HuntingMind: { icon: "🎯", color: "#8B5CF6", desc: "Predatory focus. Channel this with interactive play." },
  Mating:      { icon: "❤️", color: "#EC4899", desc: "Mating vocalizations detected. Consult a vet if unusual." },
  MotherCall:  { icon: "🤱", color: "#3B82F6", desc: "Communication typical of mother-kitten bonding." },
  Paining:     { icon: "🩹", color: "#B91C1C", desc: "Distress or pain. Check for injuries and consult a vet." },
  Resting:     { icon: "😴", color: "#64748B", desc: "Cat is relaxed and safe. Healthy resting state." },
  Warning:     { icon: "⚠️", color: "#D97706", desc: "Issue warning signals. Identify the stress source." },
};

function EmotionCard({ emotion, confidenceScores, onReset }) {
  if (!emotion) {
    return (
      <div className="empty-result-state">
        <div className="empty-icon">📁</div>
        <p>Awaiting Analysis</p>
        <span>Upload or record a meow to begin</span>
      </div>
    );
  }

  // Ensure all 10 classes are present in the list, even if scores are missing
  const categories = [
    'Angry', 'Defense', 'Fighting', 'Happy', 'HuntingMind', 
    'Mating', 'MotherCall', 'Paining', 'Resting', 'Warning'
  ];

  return (
    <div className="emotion-result-card">
      <div className="emotion-summary">
        <h2 className="primary-emotion-name">{emotion}</h2>
        <span className="analysis-tag">Primary AI Interpretation</span>
      </div>
      
      <div className="confidence-breakdown">
        {categories.map((cat) => {
          const score = confidenceScores ? (confidenceScores[cat] || 0) : 0;
          const percentage = (score * 100).toFixed(1);
          const isPrimary = cat === emotion;

          return (
            <div 
              key={cat} 
              className={`breakdown-row ${isPrimary ? 'highlight' : ''}`}
            >
              <span className="breakdown-label">{cat}</span>
              <div className="breakdown-track">
                <div 
                  className="breakdown-fill" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="breakdown-value">{percentage}%</span>
            </div>
          );
        })}
      </div>

      <div className="emotion-actions mt-xl">
        <button className="btn-outline w-full" onClick={onReset}>
          Analyze Another
        </button>
      </div>
    </div>
  );
}

export default EmotionCard;