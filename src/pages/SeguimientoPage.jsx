import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Search, FileText, Clock, CheckCircle, XCircle, AlertTriangle, Calendar, User, Briefcase, Hourglass, ListChecks, Info } from 'lucide-react';

const SeguimientoPage = () => {
  const [codigo, setCodigo] = useState('');
  const [solicitud, setSolicitud] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!codigo.trim()) {
      setError('Por favor, ingresa un código de seguimiento.');
      setSolicitud(null);
      return;
    }
    setIsLoading(true);
    setError('');
    setSolicitud(null);

    setTimeout(() => {
      const solicitudesGuardadas = JSON.parse(localStorage.getItem('solicitudes') || '[]');
      const encontrada = solicitudesGuardadas.find(s => s.id.toLowerCase() === codigo.trim().toLowerCase());

      if (encontrada) {
        setSolicitud(encontrada);
        toast({ title: "Solicitud Encontrada", description: `Mostrando detalles para ${codigo}.` });
      } else {
        setError(`No se encontró ninguna solicitud con el código "${codigo}". Verifica el código e inténtalo de nuevo.`);
        toast({ title: "No Encontrado", description: `El código ${codigo} no arrojó resultados.`, variant: "destructive" });
      }
      setIsLoading(false);
    }, 1000); 
  };
  
  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'en_proceso': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completado': return 'bg-green-100 text-green-800 border-green-200';
      case 'rechazado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'pendiente': return <Clock className="w-5 h-5" />;
      case 'en_proceso': return <Hourglass className="w-5 h-5 animate-spin-slow" />;
      case 'completado': return <CheckCircle className="w-5 h-5" />;
      case 'rechazado': return <XCircle className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };
  
  const formatFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
             <Search className="w-10 h-10 gradient-text" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
            Seguimiento de Trámite
          </h1>
          <p className="text-xl text-gray-600">
            Ingresa tu código único para ver el estado actual de tu solicitud.
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-grow">
              <label htmlFor="codigo-seguimiento" className="block text-sm font-medium text-gray-700 mb-1">
                Código de Seguimiento
              </label>
              <Input
                id="codigo-seguimiento"
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ej: SITRAM-123456"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-lg"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Hourglass className="w-5 h-5 mr-2 animate-spin" /> Buscando...
                </div>
              ) : (
                <div className="flex items-center">
                  <Search className="w-5 h-5 mr-2" /> Buscar
                </div>
              )}
            </Button>
          </div>
          {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
        </motion.div>

        {solicitud && (
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Detalles del Trámite</h2>
                <p className="text-blue-600 font-semibold text-lg">Código: {solicitud.id}</p>
              </div>
              <Badge className={`${getEstadoColor(solicitud.estado)} text-lg px-4 py-2 mt-4 sm:mt-0 flex items-center gap-2`}>
                {getEstadoIcon(solicitud.estado)}
                {solicitud.estado.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 mb-6">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                <div><strong>Solicitante:</strong> {solicitud.nombreCompleto}</div>
              </div>
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                <div><strong>Tipo de Trámite:</strong> {solicitud.tipo}</div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                <div><strong>Fecha de Solicitud:</strong> {formatFecha(solicitud.fechaCreacion)}</div>
              </div>
               <div className="flex items-start space-x-3">
                <Briefcase className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                <div><strong>Área Asignada:</strong> {solicitud.areaAsignada || 'N/A'}</div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                <div><strong>Prioridad (IA):</strong> <Badge className={getPrioridadColor(solicitud.prioridad)}>{solicitud.prioridad.toUpperCase()}</Badge></div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                <div><strong>Tiempo Estimado:</strong> {solicitud.tiempoEstimado || 'No definido'}</div>
              </div>
              <div className="md:col-span-2 flex items-start space-x-3">
                <Info className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                <div><strong>Descripción:</strong> <p className="text-sm text-gray-600 pl-1">{solicitud.descripcion}</p></div>
              </div>
            </div>
            
            {solicitud.historial && solicitud.historial.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><ListChecks className="w-6 h-6 mr-2 text-purple-600"/>Historial de Cambios:</h3>
                <div className="space-y-4 border-l-2 border-purple-200 pl-6">
                  {solicitud.historial.slice().reverse().map((item, index) => (
                     <motion.div 
                        key={index} 
                        className="relative p-4 bg-purple-50 rounded-lg shadow-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="absolute -left-[33px] top-1/2 -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full border-4 border-white"></div>
                        <p className="font-semibold text-purple-700">{item.estado.replace('_', ' ').toUpperCase()} - <span className="text-sm text-gray-500">{formatFecha(item.fecha)}</span></p>
                        <p className="text-sm text-gray-600 mt-1">{item.comentario}</p>
                     </motion.div>
                  ))}
                </div>
              </div>
            )}

             {solicitud.recomendaciones && solicitud.recomendaciones.length > 0 && (
              <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-700 mb-3">Recomendaciones Adicionales:</h3>
                <ul className="list-disc list-inside text-blue-600 space-y-1">
                  {solicitud.recomendaciones.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SeguimientoPage;