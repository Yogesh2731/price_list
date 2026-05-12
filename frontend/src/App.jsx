import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Pricelist from './pages/Pricelist.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

/* JWT decode (no library needed) */
function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

/* Check if token is valid and not expired */
function isTokenValid(token) {
  if (!token) return false;
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return false;
  // exp is in seconds, Date.now() is ms
  return decoded.exp * 1000 > Date.now();
}

/* Protected route — checks token expiry */
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!isTokenValid(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/pricelist"
            element={
              <PrivateRoute>
                <Pricelist />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ToastProvider>
    </ErrorBoundary>
  );
}
