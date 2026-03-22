import React from "react";

function ModelCard({ icon, title, desc, badge, delay = 0 }) {
  return (
    <div
      className="model-card animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="model-card-icon">{icon}</span>
      <h3 className="model-card-title">{title}</h3>
      <p className="model-card-desc">{desc}</p>
      {badge && <span className="model-card-badge">{badge}</span>}
    </div>
  );
}

export default ModelCard;
