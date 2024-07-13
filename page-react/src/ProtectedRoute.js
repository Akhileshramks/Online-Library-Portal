import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const authToken = sessionStorage.getItem('authToken');
  const userRole = sessionStorage.getItem('userRole');

  if (!authToken) {
    // Redirect to login if authToken is not present
    return <Navigate to="/login" />;
  }

  // Handle case where userRole is null (not set properly)
  if (!userRole) {
    console.error('User role not set in sessionStorage');
    // Redirect to appropriate route based on your application logic
    return <Navigate to="/login" />;
  }

  console.log('User Role:', userRole);

  if (userRole !== 'admin') {
    // Redirect to appropriate route based on user's role
    return <Navigate to="/userPage" />;
  }

  // Render the Route with the provided Component if authenticated
  return <Route {...rest} element={<Component />} />;
};

export default ProtectedRoute;
