import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

// A simple spinner component placeholder
// You can replace this with a more sophisticated spinner from a library like MUI or Ant Design
const Spinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.5rem',
  }}>
    Loading...
  </div>
);

/**
 * A wrapper for routes that require authentication and role-based authorization.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The component to render if the user is authorized.
 * @param {string[]} [props.allowedRoles] - An optional array of roles that are allowed to access the route.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, status } = useSelector((state) => state.auth);
  const location = useLocation();

  // Show a loading spinner while the initial user load is in progress
  // This prevents a flicker from the login page on a page refresh for logged-in users.
  if (status === 'loading') {
    return <Spinner />;
  }

  // If the user is not authenticated, redirect them to the login page.
  // We save the location they were trying to access in the state.
  // After a successful login, they can be redirected back to the original page.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the route requires specific roles and the user's role is not in the allowed list,
  // redirect them to a "Not Authorized" page or the home page.
  // For simplicity, we redirect to the home page here.
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // You could also navigate to a dedicated "/unauthorized" page
    return <Navigate to="/" replace />;
  }

  // If the user is authenticated and has the correct role (if required), render the child component.
  return children;
};


// --- Role-Specific Route Components ---
// These make your main App.jsx router much cleaner to read.

/**
 * A route protected for users with the 'student' role.
 * Admins are typically not included unless they need to view as a student.
 */
export const StudentRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['student']}>{children}</ProtectedRoute>
);

/**
 * A route protected for users with 'instructor' or 'admin' roles.
 * Admins can do everything an instructor can.
 */
export const InstructorRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['instructor', 'admin']}>{children}</ProtectedRoute>
);

/**
 * A route protected exclusively for users with the 'admin' role.
 */
export const AdminRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin']}>{children}</ProtectedRoute>
);

// Export the base ProtectedRoute component for general use
export { ProtectedRoute };