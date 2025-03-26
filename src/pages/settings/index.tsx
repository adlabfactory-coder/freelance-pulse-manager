
import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import SettingsPage from "./SettingsPage";

const Settings: React.FC = () => {
  const location = useLocation();
  // If we're at /settings, redirect to /settings/profile
  if (location.pathname === "/settings") {
    return <Navigate to="/settings/profile" replace />;
  }
  
  return <SettingsPage />;
};

export default Settings;
