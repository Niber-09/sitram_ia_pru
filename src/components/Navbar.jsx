import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, FileText, BarChart3, Settings, LogOut, SearchCheck, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Inicio', icon: Brain, public: true },
    { path: '/solicitar', label: 'Solicitar Trámite', icon: FileText, public: true },
    { path: '/seguimiento', label: 'Seguimiento', icon: SearchCheck, public: true },
    { path: '/panel', label: 'Panel Admin', icon: Settings, public: false },
    { path: '/estadisticas', label: 'Estadísticas', icon: BarChart3, public: false },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">SITRAM-IA</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.filter(item => item.public || isAuthenticated).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
            {isAuthenticated ? (
              <Button variant="ghost" onClick={handleLogout} className="text-gray-600 hover:bg-gray-100">
                <LogOut className="w-4 h-4 mr-2" /> Salir
              </Button>
            ) : (
              location.pathname !== '/login' && (
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-600 hover:bg-gray-100">
                    <LogIn className="w-4 h-4 mr-2" /> Admin Login
                  </Button>
                </Link>
              )
            )}
          </div>

          <div className="md:hidden">
            <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;