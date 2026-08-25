import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';

import StudentDashboard from './pages/student/Dashboard';
import RequestForm from './pages/student/RequestForm';
import RequestList from './pages/student/RequestList';
import RequestDetail from './pages/student/RequestDetail';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/:token" element={<Verify />} />

          <Route path="/student/dashboard" element={
            <ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/student/request" element={
            <ProtectedRoute roles={['student']}><RequestForm /></ProtectedRoute>
          } />
          <Route path="/student/requests" element={
            <ProtectedRoute roles={['student']}><RequestList /></ProtectedRoute>
          } />
          <Route path="/student/requests/:id" element={
            <ProtectedRoute roles={['student']}><RequestDetail /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
