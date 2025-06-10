import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import LandingPage from '@/pages/LandingPage';
import SolicitarPage from '@/pages/SolicitarPage';
import PanelPage from '@/pages/PanelPage';
import EstadisticasPage from '@/pages/EstadisticasPage';
import SeguimientoPage from '@/pages/SeguimientoPage';
import LoginPage from '@/pages/LoginPage';
import ProtectedRoute from '@/components/ProtectedRoute';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/solicitar" element={<SolicitarPage />} />
          <Route 
            path="/panel" 
            element={
              <ProtectedRoute>
                <PanelPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/estadisticas" 
            element={
              <ProtectedRoute>
                <EstadisticasPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/seguimiento" element={<SeguimientoPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;