import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Context } from '../main';

const ProtectedDoctorRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(Context);

  if (!isAuthenticated) {
    console.trace("Redirecting from ProtectedDoctorRoute: user not authenticated");
    return <Navigate to="/login" />;
  }

  if (user && user.role !== "Doctor") {
    return <Navigate to="/not-authenticated" />;
  }

  return children;
};

export default ProtectedDoctorRoute;
