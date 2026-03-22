import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ProfileCard from '../components/ProfileCard';

function History() {
  const [history, setHistory] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Health form state
  const [healthStatus, setHealthStatus] = useState('Excellent');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      // Fetch Analysis History
      const { data: analysisData } = await supabase
        .from('analysis_history')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (analysisData) setHistory(analysisData);

      // Fetch Health History
      const { data: healthData } = await supabase
        .from('cat_health_history')
        .select('*')
        .order('recorded_at', { ascending: false });
      
      if (healthData) setHealthLogs(healthData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleHealthSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    
    const { error } = await supabase.from('cat_health_history').insert({
        user_id: user.id,
        health_status: healthStatus,
        notes: notes
    });

    if (!error) {
        setNotes('');
        fetchData();
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="loading-state container centered">
      <div className="spinner"></div>
      <p>Retrieving your feline insights...</p>
    </div>
  );

  if (!user) {
    return (
      <main className="auth-fallback">
        <div className="container centered">
          <span className="badge">Access Locked</span>
          <h2 className="section-title">Sign In to View History</h2>
          <p className="section-subtitle">Connect with your account to see a timeline of your cat's emotional wellness.</p>
          <a href="/login" className="btn-primary" style={{marginTop: '24px', display: 'inline-block'}}>Sign In Now</a>
        </div>
      </main>
    );
  }

  return (
    <main className="history-page">
      {/* Analysis History Header */}
      <section className="bg-surface">
        <div className="container">
          <div className="section-header">
            <span className="badge">Timeline</span>
            <h2 className="section-title">Acoustic Insights</h2>
            <p className="section-subtitle">Reflect on your cat's emotional journey over time.</p>
          </div>

          <div className="profile-section">
            <ProfileCard user={user} />
          </div>

          <div className="history-grid">
            {history.length > 0 ? (
              history.map((item) => (
                <div key={item.id} className="analysis-record-card">
                  <div className="record-header">
                    <span className="record-date">{new Date(item.created_at).toLocaleDateString()}</span>
                    <span className="record-emotion">{item.emotion}</span>
                  </div>
                  <div className="record-details">
                    <div className="confidence-meter">
                      <div className="meter-label">
                        <span>Confidence</span>
                        <span>{Math.round(item.confidence * 100)}%</span>
                      </div>
                      <div className="meter-track">
                        <div className="meter-fill" style={{width: `${item.confidence * 100}%`}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>Cloud has no meows yet. Let's record one!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Health History Section */}
      <section className="health-section">
        <div className="container">
          <div className="grid-2-col">
            <div className="health-form-area">
              <span className="badge">Wellness Log</span>
              <h2 className="section-title">Health Tracking</h2>
              <p className="section-subtitle">Keep a record of physical health alongside emotional states.</p>
              
              <div className="health-card-form">
                <form onSubmit={handleHealthSubmit}>
                  <div className="form-group">
                    <label>Current Health Status</label>
                    <select value={healthStatus} onChange={(e) => setHealthStatus(e.target.value)}>
                      <option>Excellent</option>
                      <option>Good</option>
                      <option>Fair</option>
                      <option>Needs Attention</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Observations</label>
                    <textarea 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)} 
                      placeholder="e.g., Very playful today, finished all food..."
                    />
                  </div>
                  <button type="submit" className="btn-primary auth-btn" disabled={submitting}>
                    {submitting ? 'Updating...' : 'Save Log Entry'}
                  </button>
                </form>
              </div>
            </div>

            <div className="health-logs-area">
              <div className="health-log-list">
                {healthLogs.length > 0 ? (
                  healthLogs.map((log) => (
                    <div key={log.id} className="health-log-item">
                      <div className="log-meta">
                        <span className="log-date">{new Date(log.recorded_at).toLocaleDateString()}</span>
                        <span className={`status-tag ${log.health_status.toLowerCase().replace(' ', '-')}`}>
                          {log.health_status}
                        </span>
                      </div>
                      <p className="log-notes">{log.notes}</p>
                    </div>
                  ))
                ) : (
                  <p className="muted">No wellness logs recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default History;
