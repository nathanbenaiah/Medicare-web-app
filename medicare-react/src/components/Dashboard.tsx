import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🏥</span>
            <h1>MediCare+</h1>
          </div>
          <div className="user-menu">
            <span className="user-info">
              Welcome, {user?.user_metadata?.full_name || user?.email}!
            </span>
            <button className="sign-out-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="welcome-section">
            <h2>🎉 Welcome to MediCare+</h2>
            <p>Your healthcare management platform is ready!</p>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-icon">💊</div>
              <h3>Medications</h3>
              <p>Manage your prescriptions and set reminders</p>
              <button className="card-button">View Medications</button>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">📅</div>
              <h3>Appointments</h3>
              <p>Schedule and track your medical appointments</p>
              <button className="card-button">View Appointments</button>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">📊</div>
              <h3>Health Records</h3>
              <p>Access your medical history and reports</p>
              <button className="card-button">View Records</button>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">👨‍⚕️</div>
              <h3>Doctors</h3>
              <p>Connect with your healthcare providers</p>
              <button className="card-button">View Doctors</button>
            </div>
          </div>

          <div className="user-profile">
            <h3>👤 Profile Information</h3>
            <div className="profile-details">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Name:</strong> {user?.user_metadata?.full_name || 'Not provided'}</p>
              <p><strong>Account Created:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</p>
              <p><strong>Last Sign In:</strong> {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Unknown'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 