import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Context } from '../main';

// Protected route component that only allows access to Admin users
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(Context);

  if (!isAuthenticated) {
    // Not logged in, redirect to login
    console.trace("Redirecting from ProtectedAdminRoute: user not authenticated");
    return <Navigate to="/login" />;
  }

  if (user && user.role !== 'Admin') {
    // Logged in but not an Admin, redirect to patient dashboard
    return <Navigate to="/patient/dashboard" />;
  }

  // Admin user, allow access
  return children;
};

export default ProtectedAdminRoute;
