// src/components/SettingsPage.jsx
import React, { useState } from 'react';
import './SettingsPage.css';

function SettingsPage() {
  const [activeSection, setActiveSection] = useState('Account');

  const menuItems = [
    'Account',
    'Subscription & Billing',
    'Profiles & Parental Controls',
    'Playback Settings',
    'Notifications',
    'Viewing History',
    'Downloads & Devices',
    'Data & Privacy',
    'Help Center'
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'Account':
        return (
          <div>
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
          </div>
        );

      case 'Subscription & Billing':
        return (
          <div>
            <h1>Subscription & Billing</h1>
            <p>Plan: Premium (4K + HDR)</p>
            <p>Next billing date: June 15, 2025</p>
            <div className="actions">
              <button>Upgrade Plan</button>
              <button>View Invoices</button>
              <button className="danger">Cancel Subscription</button>
            </div>
          </div>
        );

      case 'Profiles & Parental Controls':
        return (
          <div>
            <h1>Profiles & Parental Controls</h1>
            <ul>
              <li>John's Profile (Owner) - All Access</li>
              <li>Kids Profile - Age Limit: 7+</li>
            </ul>
            <div className="actions">
              <button>Manage Profiles</button>
              <button>Set Parental Controls</button>
            </div>
          </div>
        );

      case 'Playback Settings':
        return (
          <div>
            <h1>Playback Settings</h1>
            <p>Video Quality: Auto (adjusts with bandwidth)</p>
            <p>Audio Language: English</p>
            <div className="actions">
              <button>Change Video Quality</button>
              <button>Set Default Language</button>
            </div>
          </div>
        );

      case 'Notifications':
        return (
          <div>
            <h1>Notifications</h1>
            <p>Email Notifications: Enabled</p>
            <p>Push Notifications: Disabled</p>
            <div className="actions">
              <button>Manage Notification Settings</button>
            </div>
          </div>
        );

      case 'Viewing History':
        return (
          <div>
            <h1>Viewing History</h1>
            <ul>
              <li>Movie: The Grand Adventure — Watched on May 5, 2025</li>
              <li>Series: Space Explorers — Watched on May 4, 2025</li>
            </ul>
            <div className="actions">
              <button>Clear Viewing History</button>
            </div>
          </div>
        );

      case 'Downloads & Devices':
        return (
          <div>
            <h1>Downloads & Devices</h1>
            <ul>
              <li>iPhone 13 — Last sync: May 5, 2025</li>
              <li>Samsung Smart TV — Registered on April 1, 2025</li>
            </ul>
            <div className="actions">
              <button>Manage Devices</button>
              <button>Manage Downloads</button>
            </div>
          </div>
        );

      case 'Data & Privacy':
        return (
          <div>
            <h1>Data & Privacy</h1>
            <p>You can download or delete your personal data.</p>
            <div className="actions">
              <button>Download My Data</button>
              <button className="danger">Delete My Data</button>
            </div>
          </div>
        );

      case 'Help Center':
        return (
          <div>
            <h1>Help Center</h1>
            <p>Find answers to frequently asked questions or contact support.</p>
            <div className="actions">
              <button>Visit FAQ</button>
              <button>Contact Support</button>
            </div>
          </div>
        );

      default:
        return <h1>Account</h1>;
    }
  };

  return (
    <div className="settings-container">
      <aside className="sidebar">
        <h2>Settings</h2>
        <ul>
          {menuItems.map(item => (
            <li
              key={item}
              className={activeSection === item ? 'active' : ''}
              onClick={() => setActiveSection(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </aside>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default SettingsPage;
