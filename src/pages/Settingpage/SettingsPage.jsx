// src/pages/Settings/SettingsPage.jsx

import React from 'react';
import './SettingsPage.css';
import { FaUser, FaShieldAlt, FaBell, FaLock, FaClipboardList, FaQuestionCircle, FaFileContract, FaBug, FaSignOutAlt } from 'react-icons/fa';

export default function SettingsPage() {
  return (
    <div className="settings-wrapper">
      <h1 className="settings-title">Settings</h1>

      <div className="settings-section">
        <h2>Account</h2>
        <div className="settings-card">
          <SettingItem icon={<FaUser />} label="Edit profile" />
          <SettingItem icon={<FaShieldAlt />} label="Security" />
          <SettingItem icon={<FaBell />} label="Notifications" />
          <SettingItem icon={<FaLock />} label="Privacy" />
        </div>
      </div>

      <div className="settings-section">
        <h2>Support & About</h2>
        <div className="settings-card">
          <SettingItem icon={<FaClipboardList />} label="My Subscriptions" />
          <SettingItem icon={<FaQuestionCircle />} label="Help & Support" />
          <SettingItem icon={<FaFileContract />} label="Terms & Conditions" />
        </div>
      </div>

      <div className="settings-section">
        <h2>Actions</h2>
        <div className="settings-card">
          <SettingItem icon={<FaBug />} label="Report a problem" />
          <SettingItem icon={<FaSignOutAlt />} label="Logout" />
        </div>
      </div>
    </div>
  );
}

function SettingItem({ icon, label }) {
  return (
    <div className="setting-item">
      <span className="setting-icon">{icon}</span>
      <span className="setting-label">{label}</span>
    </div>
  );
}
