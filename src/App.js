import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import ForgotPasswordPage from "./pages/forgotpass";
import ResetPasswordPage from "./pages/newpass";
import GatewayPage from "./pages/gateway";
import SignupPage from "./pages/signup";
import SettingsPage from "./pages/settings";
import DashboardPage from "./pages/dashboard";

function App() {
  return (
    <div>
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
          <Route path="/gateway" element={<GatewayPage />} />
          <Route path="/resetpassword" element={<ResetPasswordPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/:username/settings" element={<SettingsPage />} />
          <Route path="/:username/dashboard" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </div>
    </div>
  );
}

export default App;
