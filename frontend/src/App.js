import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projets from './pages/Projets';
import ProjetDetail from './pages/ProjetDetail';
import Livrables from './pages/Livrables';
import Evaluations from './pages/Evaluations';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{padding:'40px', textAlign:'center'}}>Chargement...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{padding:'40px', textAlign:'center'}}>Chargement...</div>;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/projets" element={<PrivateRoute><Projets /></PrivateRoute>} />
      <Route path="/projets/:id" element={<PrivateRoute><ProjetDetail /></PrivateRoute>} />
      <Route path="/livrables" element={<PrivateRoute><Livrables /></PrivateRoute>} />
      <Route path="/evaluations" element={<PrivateRoute><Evaluations /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;