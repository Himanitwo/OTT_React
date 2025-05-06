// src/components/SettingsPage.jsx
import React from 'react';
import './SettingsPage.css';

function SettingsPage() {
  return (
    <div className="settings-container">
      <aside className="sidebar">
        <h2>Settings</h2>
        <ul>
          <li className="active">Account</li>
          <li>Subscription & Billing</li>
          <li>Profiles & Parental Controls</li>
          <li>Playback Settings</li>
          <li>Notifications</li>
          <li>Downloads & Devices</li>
          <li>Data & Privacy</li>
          <li>Help Center</li>
        </ul>
      </aside>

      <main className="main-content">
        <h1>Account</h1>
        <div className="account-info">
          <img
            className="profile-pic"
            src="https://via.placeholder.com/100"
            alt="User avatar"
          />
          <div className="details">
            <h2>John Doe <span className="role-badge">Owner</span></h2>
            <p>john.doe@example.com</p>
          </div>
        </div>

        <div className="actions">
          <button>Change Password</button>
          <button>Manage Profiles</button>
          <button className="danger">Delete Account</button>
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;
