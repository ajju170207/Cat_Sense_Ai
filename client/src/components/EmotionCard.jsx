import React from "react";
 
const EMOTION_CONFIG = {
  Happy:       { desc: "Your cat is content and at ease." },
  Angry:       { desc: "High agitation detected. Give them space." },
  Defense:     { desc: "Cat feels threatened. Stay calm and still." },
  Fighting:    { desc: "Aggressive state. Separate from triggers." },
  HuntingMind: { desc: "Predatory focus. Channel with play." },
  Mating:      { desc: "Mating vocalizations detected." },
  MotherCall:  { desc: "Seeking attention or care." },
  Paining:     { desc: "Distress or pain. Consult a vet." },
  Resting:     { desc: "Relaxed and resting peacefully." },
  Warning:     { desc: "Stress signals. Identify the trigger." },
};
 
const CATEGORIES = [
  "Angry", "Defense", "Fighting", "Happy", "HuntingMind",
  "Mating", "MotherCall", "Paining", "Resting", "Warning",
];
 
function EmotionCard({ emotion, confidenceScores, onReset }) {
  const desc = EMOTION_CONFIG[emotion]?.desc ?? "Emotion detected.";
 
  return (
    <div style={{
      fontFamily: "inherit",
      maxWidth: 400,
      margin: "0 auto",
      padding: "1.25rem",
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: "var(--border-radius-lg)",
    }}>
 
      {/* Result */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 4 }}>
          {emotion}
        </div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
          {desc}
        </div>
      </div>
 
      {/* Divider */}
      <div style={{ height: "0.5px", background: "var(--color-border-tertiary)", marginBottom: "1rem" }} />
 
      {/* Confidence bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {CATEGORIES.map((cat) => {
          const pct = ((confidenceScores?.[cat] ?? 0) * 100);
          const isPrimary = cat === emotion;
          const barColor = isPrimary
            ? "#D85A30"
            : pct >= 15
            ? "#BA7517"
            : "#B4B2A9";
 
          return (
            <div key={cat} style={{ display: "flex", alignItems: "center", gap: 8, opacity: pct < 0.1 ? 0.35 : 1 }}>
              <span style={{ fontSize: 12, color: "var(--color-text-secondary)", minWidth: 90 }}>
                {cat}
              </span>
              <div style={{ flex: 1, height: 5, background: "var(--color-background-secondary)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 99, transition: "width .6s cubic-bezier(.4,0,.2,1)" }} />
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
          onClick={onReset}
          className="btn-outline"
        >
          Analyze new audio
        </button>
      </div>
 
    </div>
  );
}
 
export default EmotionCard;
 