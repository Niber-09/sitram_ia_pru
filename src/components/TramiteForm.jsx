import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { FileText, User, Mail, MapPin, MessageSquare, Send, Sparkles, Info } from 'lucide-react';

const TramiteForm = ({ showRecommendations = false }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTramite, setSubmittedTramite] = useState(null);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    dni: '',
    email: '',
    descripcion: '',
    distrito: ''
  });

  const distritos = [
    'Cercado de Lima',
    'Miraflores',
    'San Isidro',
    'Barranco',
    'Surco',
    'La Molina',
    'San Borja',
    'Jesús María',
    'Lince',
    'Magdalena',
    'Pueblo Libre',
    'San Miguel'
  ];

  const clasificarTramite = (descripcion) => {
    const palabrasClave = {
      'licencia': { tipo: 'Licencia de Funcionamiento', prioridad: 'alta', areaAsignada: 'Oficina de Licencias', tiempoEstimado: '5 días hábiles', recomendaciones: ['Copia de DNI', 'Certificado de Zonificación'] },
      'permiso': { tipo: 'Permiso Municipal', prioridad: 'media', areaAsignada: 'Atención al Ciudadano', tiempoEstimado: '3 días hábiles', recomendaciones: ['Formulario de solicitud', 'Pago de tasa'] },
      'certificado': { tipo: 'Certificado', prioridad: 'baja', areaAsignada: 'Registro Civil', tiempoEstimado: '2 días hábiles', recomendaciones: ['Partida de Nacimiento (si aplica)'] },
      'construccion': { tipo: 'Licencia de Construcción', prioridad: 'alta', areaAsignada: 'Desarrollo Urbano', tiempoEstimado: '10 días hábiles', recomendaciones: ['Planos arquitectónicos', 'Estudio de suelos'] },
      'matrimonio': { tipo: 'Certificado de Matrimonio', prioridad: 'baja', areaAsignada: 'Registro Civil', tiempoEstimado: '1 día hábil', recomendaciones: ['DNI de contrayentes'] },
      'defuncion': { tipo: 'Certificado de Defunción', prioridad: 'media', areaAsignada: 'Registro Civil', tiempoEstimado: '2 días hábiles', recomendaciones: ['Certificado médico de defunción'] },
      'nacimiento': { tipo: 'Certificado de Nacimiento', prioridad: 'baja', areaAsignada: 'Registro Civil', tiempoEstimado: '1 día hábil', recomendaciones: ['DNI de padres'] },
      'comercio': { tipo: 'Licencia Comercial', prioridad: 'alta', areaAsignada: 'Oficina de Licencias', tiempoEstimado: '7 días hábiles', recomendaciones: ['RUC', 'Certificado de Defensa Civil'] },
      'vehiculo': { tipo: 'Permiso Vehicular', prioridad: 'media', areaAsignada: 'Tránsito y Transporte', tiempoEstimado: '3 días hábiles', recomendaciones: ['Tarjeta de propiedad', 'SOAT vigente'] },
      'evento': { tipo: 'Permiso de Evento', prioridad: 'media', areaAsignada: 'Cultura y Eventos', tiempoEstimado: '5 días hábiles', recomendaciones: ['Plan de seguridad', 'Lista de asistentes (si aplica)'] },
      'reclamo': { tipo: 'Reclamo de Servicio', prioridad: 'media', areaAsignada: 'Atención al Ciudadano', tiempoEstimado: '4 días hábiles', recomendaciones: ['Detalles del reclamo', 'Evidencia (fotos, videos)'] },
    };

    const descripcionLower = descripcion.toLowerCase();
    
    for (const [palabra, clasificacion] of Object.entries(palabrasClave)) {
      if (descripcionLower.includes(palabra)) {
        return clasificacion;
      }
    }
    
    return { tipo: 'Trámite General', prioridad: 'baja', areaAsignada: 'Mesa de Partes', tiempoEstimado: 'No definido', recomendaciones: ['Contactar con un asesor'] };
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmittedTramite(null);

    try {
      if (!formData.nombreCompleto || !formData.dni || !formData.email || !formData.descripcion || !formData.distrito) {
        toast({
          title: "Error de validación",
          description: "Por favor, completa todos los campos requeridos.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      const clasificacion = clasificarTramite(formData.descripcion);
      const codigoSeguimiento = `SITRAM-${Date.now().toString().slice(-6)}`;
      
      const nuevaSolicitud = {
        id: codigoSeguimiento, 
        ...formData,
        tipo: clasificacion.tipo,
        prioridad: clasificacion.prioridad,
        estado: 'pendiente',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        areaAsignada: clasificacion.areaAsignada,
        tiempoEstimado: clasificacion.tiempoEstimado,
        recomendaciones: clasificacion.recomendaciones || [],
        historial: [{ estado: 'pendiente', fecha: new Date().toISOString(), comentario: 'Solicitud recibida y en espera de procesamiento por IA.' }]
      };

      const solicitudesExistentes = JSON.parse(localStorage.getItem('solicitudes') || '[]');
      solicitudesExistentes.push(nuevaSolicitud);
      localStorage.setItem('solicitudes', JSON.stringify(solicitudesExistentes));

      toast({
        title: "¡Trámite registrado exitosamente! 🎉",
        description: `Tu código de seguimiento es: ${codigoSeguimiento}. IA clasificó como: ${clasificacion.tipo} (Prioridad: ${clasificacion.prioridad.toUpperCase()})`,
      });

      setSubmittedTramite(nuevaSolicitud);

      setFormData({
        nombreCompleto: '',
        dni: '',
        email: '',
        descripcion: '',
        distrito: ''
      });

    } catch (error) {
      toast({
        title: "Error al registrar trámite",
        description: "Hubo un problema al procesar tu solicitud. Inténtalo nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Registro de Trámite</h2>
          <p className="text-gray-600">La IA clasificará automáticamente tu solicitud</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Label htmlFor="nombreCompleto" className="flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Nombre Completo</span>
              </Label>
              <Input
                id="nombreCompleto"
                type="text"
                placeholder="Ingresa tu nombre completo"
                value={formData.nombreCompleto}
                onChange={(e) => handleInputChange('nombreCompleto', e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Label htmlFor="dni" className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>DNI</span>
              </Label>
              <Input
                id="dni"
                type="text"
                placeholder="12345678"
                value={formData.dni}
                onChange={(e) => handleInputChange('dni', e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                maxLength={8}
                required
              />
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Email</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label htmlFor="distrito" className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Distrito</span>
              </Label>
              <Select value={formData.distrito} onValueChange={(value) => handleInputChange('distrito', value)} required>
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Selecciona tu distrito" />
                </SelectTrigger>
                <SelectContent>
                  {distritos.map((distrito) => (
                    <SelectItem key={distrito} value={distrito}>
                      {distrito}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Label htmlFor="descripcion" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Descripción del Trámite</span>
            </Label>
            <Textarea
              id="descripcion"
              placeholder="Describe detalladamente el trámite que necesitas realizar..."
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
              required
            />
            <p className="text-sm text-gray-500">
              💡 Incluye palabras clave como "licencia", "permiso", "certificado", "reclamo" para una mejor clasificación
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Procesando con IA...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="w-5 h-5" />
                  <span>Enviar Trámite</span>
                </div>
              )}
            </Button>
          </motion.div>
        </form>

        <motion.div
          className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Clasificación Inteligente</span>
          </div>
          <p className="text-sm text-blue-700">
            Nuestro sistema de IA analizará tu descripción y clasificará automáticamente el tipo de trámite y su prioridad.
          </p>
        </motion.div>
      </motion.div>

      {showRecommendations && submittedTramite && (
        <motion.div
          className="max-w-2xl mx-auto mt-8 bg-white rounded-2xl shadow-xl p-8 border border-green-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <Info className="w-8 h-8 text-green-600" />
            <h2 className="text-2xl font-bold text-green-700">Recomendaciones para tu Trámite</h2>
          </div>
          <p className="text-gray-700 mb-2">
            <strong>Código de Seguimiento:</strong> <span className="font-semibold text-blue-600">{submittedTramite.id}</span> (Guárdalo para futuras consultas)
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Tipo de Trámite (IA):</strong> {submittedTramite.tipo}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Prioridad (IA):</strong> <span className={`font-semibold ${submittedTramite.prioridad === 'alta' ? 'text-red-600' : submittedTramite.prioridad === 'media' ? 'text-yellow-600' : 'text-green-600'}`}>{submittedTramite.prioridad.toUpperCase()}</span>
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Tiempo Estimado de Respuesta:</strong> {submittedTramite.tiempoEstimado}
          </p>
          {submittedTramite.recomendaciones && submittedTramite.recomendaciones.length > 0 && (
            <>
              <p className="text-gray-700 font-semibold mt-4 mb-2">Documentos/Pasos Sugeridos:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {submittedTramite.recomendaciones.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </>
          )}
          <p className="text-sm text-gray-500 mt-4">
            * Estas son recomendaciones generadas automáticamente. Un asesor podría contactarte para más detalles.
          </p>
        </motion.div>
      )}
    </>
  );
};

export default TramiteForm;