import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { isAuthenticated, getUser, isTokenExpired, clearAuth, getAuthHeaders } from '../../utils/auth';
import { getSocket } from '../../services/socket';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const DEACTIVATED_MESSAGE = 'Your account has been deactivated. Contact an administrator to reactivate.';

/**
 * RoleProtectedRoute - Wraps routes that require specific role(s)
 * Redirects to login if not authenticated or token expired
 * Redirects to user's dashboard if role doesn't match
 * Listens for account_deactivated (Socket) and verify 403 to sign out deactivated users
 */
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const user = getUser();
  const tokenExpired = isTokenExpired();

  // When authenticated: connect socket and listen for account_deactivated; optionally verify on mount
  useEffect(() => {
    if (!authenticated || !user || tokenExpired) return;

    // Verify session on mount (detect deactivation while tab was closed or offline)
    const verifySession = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/verify`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json().catch(() => ({}));
        if (res.status === 403 && (data.status === 'inactive' || /deactivated|account not approved/i.test(data.message || ''))) {
          clearAuth();
          navigate('/login', { state: { message: DEACTIVATED_MESSAGE }, replace: true });
        }
      } catch (_) {
        // Network error: keep user logged in
      }
    };
    verifySession();

    // Socket: listen for immediate deactivation from admin
    const socket = getSocket();
    const handleDeactivated = () => {
      clearAuth();
      navigate('/login', { state: { message: DEACTIVATED_MESSAGE }, replace: true });
    };
    if (socket) {
      socket.on('account_deactivated', handleDeactivated);
      return () => {
        socket.off('account_deactivated', handleDeactivated);
      };
    }
  }, [authenticated, user, tokenExpired, navigate]);

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
