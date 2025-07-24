import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NgoRegistration from "./components/NgoRegistration";
import AdminDashboard from "./components/AdminDashboard";
import ResortRegistration from "./components/ResortRegistration";
import Home from "./components/Home";
import Resort from "./components/Resort";
import Ngo from "./components/Ngo";
import NgoLogin from "./components/NgoLogin";
import ResortLogin from "./components/ResortLogin";
import Guideline from "./components/Guideline";
import ActiveRequests from "./components/ActiveRequests";
import ResortCard from "./components/ResortCard";
import NgoHome from "./components/NgoHome";
import AdminLogin from "./components/AdminLogin";
import GuidelineResort from "./components/GuidelineResort";
import PrivateRoute from "./components/PrivateRoute";
import NgoForgotPassword from "./components/NgoForgotPassword";
import ResortForgotPassword from "./components/ResortForgotPassword";
import NgoResetPassword from "./components/NgoResetPassword";
import ResortResetPassword from "./components/ResortResetPassword";

function App() {
  return (
    <Router>
      <div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resort/register" element={<ResortRegistration />} />
          <Route path="/ngo/register" element={<NgoRegistration />} />
          <Route path="/resort" element={
            <PrivateRoute role="resort"><Resort /></PrivateRoute>
          } />
          <Route path="/ngo" element={
            <PrivateRoute role="ngo"><Ngo /></PrivateRoute>
          } />
          <Route path="/ngoHome" element={<NgoHome />} />
          <Route path="/resort/login" element={<ResortLogin />} />
          <Route path="/ngo/login" element={<NgoLogin />} />
          <Route path="/admin" element={
            <PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>
          } />
          <Route path="/guideline" element={<Guideline />} />
          <Route path="/active-requests" element={<ActiveRequests />} />
          <Route path="/resort-card" element={<ResortCard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/guidelineResort" element={<GuidelineResort
                     />} />
          <Route path="/ngo/forgot-password" element={<NgoForgotPassword />} />
          <Route path="/resort/forgot-password" element={<ResortForgotPassword />} />
          <Route path="/ngo/reset-password" element={<NgoResetPassword />} />
          <Route path="/resort/reset-password" element={<ResortResetPassword />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
