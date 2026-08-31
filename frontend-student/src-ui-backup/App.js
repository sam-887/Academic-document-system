import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Verify from './pages/Verify';

import StudentDashboard from './pages/student/Dashboard';
import RequestForm from './pages/student/RequestForm';
import RequestList from './pages/student/RequestList';
import RequestDetail from './pages/student/RequestDetail';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import DigitalLocker from './pages/DigitalLocker';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {window.location.pathname !== '/login' && <Navbar />}

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />

          <Route path="/verify/:token" element={<Verify />} />

          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute roles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/request"
            element={
              <ProtectedRoute roles={['student']}>
                <RequestForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/requests"
            element={
              <ProtectedRoute roles={['student']}>
                <RequestList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/requests/:id"
            element={
              <ProtectedRoute roles={['student']}>
                <RequestDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/notifications"
            element={
              <ProtectedRoute roles={['student']}>
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/messages"
            element={
              <ProtectedRoute roles={['student']}>
                <Messages />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/locker"
            element={
              <ProtectedRoute roles={['student']}>
                <DigitalLocker />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

