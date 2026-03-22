import React from "react";

function FeatureCard({ icon, title, desc, delay = 0 }) {
  return (
    <div
      className="feature-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="feature-icon-wrapper">
        {icon}
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{desc}</p>
    </div>
  );
}

export default FeatureCard;
