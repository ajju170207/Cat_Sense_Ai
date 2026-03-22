import React from 'react';

const ProfileCard = ({ user }) => {
  if (!user) return null;

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.email[0].toUpperCase()}
        </div>
        <div className="profile-info">
          <h3 className="profile-name">{user.email.split('@')[0]}</h3>
          <p className="profile-email">{user.email}</p>
        </div>
        <div className="profile-badge">Active Member</div>
      </div>
      <div className="profile-stats">
        <div className="stat-item">
          <p className="stat-label">Model Engine</p>
          <p className="stat-value">MobileNetV2 Hybrid</p>
        </div>
        <div className="stat-item">
          <p className="stat-label">Subscription</p>
          <p className="stat-value">Pro Researcher</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
