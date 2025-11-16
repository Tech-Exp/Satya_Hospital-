import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Context } from '../main';
import NotAuthenticated from '../pages/NotAuthenticated';

// Protected route component that only allows access to authenticated patients
const ProtectedPatientRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(Context);

  // If not authenticated at all, show the not authenticated page
  if (!isAuthenticated) {
    return <NotAuthenticated />;
  }

  // If authenticated but not a patient, redirect appropriately
  if (user && user.role !== 'Patient') {
    return <Navigate to="/admin/dashboard" />;
  }

  // Patient user, allow access
  return children;
};

export default ProtectedPatientRoute;
