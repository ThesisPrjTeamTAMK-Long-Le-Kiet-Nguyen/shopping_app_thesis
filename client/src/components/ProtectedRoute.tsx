import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

import { ReactElement } from 'react';

interface ProtectedRouteProps {
  element: ReactElement;
  allowedRoles: string[];
}

const ProtectedRoute = ({ element, allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Check if the user is authenticated and has the correct role
  if (!token || (allowedRoles && !allowedRoles.includes(role ?? ''))) {
    return <Navigate to="/login" replace />; // Redirect to login if not authorized
  }

  return element; // Render the protected component
};

// Define prop types
ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired, // Expect an element
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired, // Expect an array of strings
};

export default ProtectedRoute;