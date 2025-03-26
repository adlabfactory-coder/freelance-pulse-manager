
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SettingsPage from "./SettingsPage";

const Settings: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SettingsPage />} />
      <Route path="/:tab" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/settings" replace />} />
    </Routes>
  );
};

export default Settings;
