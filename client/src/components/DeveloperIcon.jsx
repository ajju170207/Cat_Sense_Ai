import React from 'react';

const DeveloperIcon = ({ name, size = 64, color = "currentColor" }) => {
  // Unique SVG patterns for each developer
  const icons = {
    "Researcher": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    ),
    "WebDev": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
        <path d="M7 8l-2 2 2 2M17 8l2 2-2 2M13 7l-2 6"/>
      </svg>
    ),
    "ModelDev": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 9v0M12 15v0M9 12v0M15 12v0"/>
        <path d="M12 6a6 6 0 0 0-6 6M12 18a6 6 0 0 0 6-6"/>
      </svg>
    ),
  };

  return icons[name] || (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
    </svg>
  );
};

export default DeveloperIcon;
