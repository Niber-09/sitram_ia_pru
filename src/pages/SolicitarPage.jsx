import React from 'react';
import { motion } from 'framer-motion';
import TramiteForm from '@/components/TramiteForm';
import { Brain, Zap, Clock, ShieldCheck, FilePlus } from 'lucide-react';

const SolicitarPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'IA Avanzada',
      description: 'Clasificación automática inteligente'
    },
    {
      icon: Zap,
      title: 'Procesamiento Rápido',
      description: 'Respuesta inmediata del sistema'
    },
    {
      icon: Clock,
      title: 'Seguimiento Fácil',
      description: 'Consulta el estado con tu código'
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
             <FilePlus className="w-10 h-10 gradient-text" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
            Solicitar Nuevo Trámite
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Completa el formulario y deja que nuestra IA clasifique y te guíe en tu solicitud.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-12"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 shadow-lg card-hover"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <TramiteForm showRecommendations={true} />

        <motion.div
          className="mt-12 bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Tu Información Segura</h2>
          </div>
          <p className="text-gray-600">
            En SITRAM-IA, la seguridad y privacidad de tus datos son nuestra máxima prioridad. Utilizamos las mejores prácticas para proteger tu información en cada paso del proceso.
            Recuerda guardar tu código de seguimiento para consultar el estado de tu trámite.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SolicitarPage;