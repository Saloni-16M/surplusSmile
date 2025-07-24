import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, isTokenValid } from '../utils/auth';

const PrivateRoute = ({ children, role }) => {
  const token = getToken(role);
  if (!isTokenValid(token, role)) {
    // Redirect to the correct login page
    if (role === 'admin') return <Navigate to="/admin/login" />;
    if (role === 'ngo') return <Navigate to="/ngo/login" />;
    if (role === 'resort') return <Navigate to="/resort/login" />;
    return <Navigate to="/" />;
  }
  return children;
};

export default PrivateRoute; 