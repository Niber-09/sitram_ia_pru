
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Zap, 
  Shield, 
  Clock, 
  Users, 
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'IA Inteligente',
      description: 'Clasificación automática de trámites con machine learning avanzado'
    },
    {
      icon: Zap,
      title: 'Procesamiento Rápido',
      description: 'Asignación instantánea de prioridades y categorización automática'
    },
    {
      icon: Shield,
      title: 'Seguro y Confiable',
      description: 'Protección de datos ciudadanos con los más altos estándares'
    },
    {
      icon: Clock,
      title: 'Disponible 24/7',
      description: 'Sistema disponible las 24 horas para registro de solicitudes'
    }
  ];

  const stats = [
    { number: '1,250+', label: 'Trámites Procesados' },
    { number: '98%', label: 'Precisión IA' },
    { number: '45min', label: 'Tiempo Promedio' },
    { number: '24/7', label: 'Disponibilidad' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="gradient-text">SITRAM-IA</span>
                <br />
                <span className="text-gray-800">Trámites Inteligentes</span>
              </h1>
              
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                Sistema revolucionario que utiliza inteligencia artificial para 
                clasificar y priorizar automáticamente los trámites municipales, 
                optimizando la gestión pública.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link to="/solicitar">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Iniciar Trámite
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                
                <Link to="/estadisticas">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-gray-300 hover:border-blue-500 px-8 py-4 text-lg font-semibold rounded-xl">
                    Ver Estadísticas
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-6 mt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <div className="text-2xl font-bold gradient-text">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <img  
                  className="w-full h-auto rounded-2xl shadow-2xl floating-animation"
                  alt="Sistema SITRAM-IA dashboard moderno"
                 src="https://images.unsplash.com/photo-1686061593213-98dad7c599b9" />
                
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center pulse-glow">
                  <Brain className="w-12 h-12 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tecnología de vanguardia para revolucionar la gestión de trámites municipales
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 card-hover border border-gray-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img  
                className="w-full h-auto rounded-2xl shadow-xl"
                alt="Ciudadanos utilizando sistema digital de trámites"
               src="https://images.unsplash.com/photo-1700403031508-13f3047cc4de" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                Beneficios para <span className="gradient-text">Ciudadanos</span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-8">
                Simplificamos los procesos burocráticos con tecnología inteligente
              </p>

              <div className="space-y-4">
                {[
                  'Clasificación automática de trámites por IA',
                  'Asignación inteligente de prioridades',
                  'Seguimiento en tiempo real del estado',
                  'Interfaz intuitiva y fácil de usar',
                  'Disponibilidad 24/7 para solicitudes'
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/solicitar">
                  <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Comenzar Ahora
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              ¿Listo para Modernizar tus Trámites?
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Únete a miles de ciudadanos que ya disfrutan de un sistema más eficiente y transparente
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/solicitar">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Solicitar Trámite
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <Link to="/panel">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl">
                  Panel Administrativo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
