import { Navigate, useLocation } from 'react-router-dom';
import { ReactElement } from 'react';
import { useAuth } from '../context/AuthContext';
import LoaderUI from './LoaderUI';

interface ProtectedRouteProps {
  element: ReactElement;
  allowedRoles: string[];
}

const ProtectedRoute = ({ element, allowedRoles }: ProtectedRouteProps) => {
  const { role, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoaderUI />;
  }

  // Check if the user is authenticated and has the correct role
  if (!isAuthenticated || (allowedRoles && !allowedRoles.includes(role ?? ''))) {
    // Redirect to login with the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

export default ProtectedRoute;