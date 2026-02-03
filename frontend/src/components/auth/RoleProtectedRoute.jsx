import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUser, isTokenExpired, clearAuth } from '../../utils/auth';

/**
 * RoleProtectedRoute - Wraps routes that require specific role(s)
 * Redirects to login if not authenticated or token expired
 * Redirects to user's dashboard if role doesn't match
 */
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const authenticated = isAuthenticated();
  const user = getUser();
  const tokenExpired = isTokenExpired();

  // If token is expired, clear auth and redirect to login
  if (tokenExpired) {
    clearAuth();
    return <Navigate to="/login" replace />;
  }

  // If not authenticated, redirect to login
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but no user data, clear auth and redirect
  if (!user) {
    clearAuth();
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in allowed roles
  const userRole = user.role;
  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());
  const normalizedUserRole = userRole.toLowerCase();

  if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
    // Role doesn't match - redirect to user's dashboard
    const rolePath = normalizedUserRole === 'donor' ? 'donor' :
                     normalizedUserRole === 'receiver' ? 'receiver' :
                     normalizedUserRole === 'driver' ? 'driver' :
                     normalizedUserRole === 'admin' ? 'admin' : 'donor';
    
    return <Navigate to={`/${rolePath}/dashboard`} replace />;
  }

  // Role matches - allow access
  return children;
};

export default RoleProtectedRoute;
