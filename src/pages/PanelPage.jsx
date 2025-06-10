import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  Calendar,
  User,
  Briefcase,
  RefreshCw
} from 'lucide-react';

const PanelPage = () => {
  const { toast } = useToast();
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [filterPrioridad, setFilterPrioridad] = useState('todos');
  const [filterFechaDesde, setFilterFechaDesde] = useState('');
  const [filterFechaHasta, setFilterFechaHasta] = useState('');
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = () => {
    const solicitudesGuardadas = JSON.parse(localStorage.getItem('solicitudes') || '[]');
    setSolicitudes(solicitudesGuardadas);
  };

  useEffect(() => {
    let filtered = [...solicitudes];

    if (searchTerm) {
      filtered = filtered.filter(solicitud =>
        solicitud.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solicitud.dni.includes(searchTerm) ||
        solicitud.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solicitud.tipo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterEstado !== 'todos') {
      filtered = filtered.filter(solicitud => solicitud.estado === filterEstado);
    }

    if (filterPrioridad !== 'todos') {
      filtered = filtered.filter(solicitud => solicitud.prioridad === filterPrioridad);
    }

    if (filterFechaDesde) {
      filtered = filtered.filter(solicitud => new Date(solicitud.fechaCreacion) >= new Date(filterFechaDesde));
    }

    if (filterFechaHasta) {
      const hasta = new Date(filterFechaHasta);
      hasta.setHours(23, 59, 59, 999); 
      filtered = filtered.filter(solicitud => new Date(solicitud.fechaCreacion) <= hasta);
    }
    
    setFilteredSolicitudes(filtered.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)));
  }, [solicitudes, searchTerm, filterEstado, filterPrioridad, filterFechaDesde, filterFechaHasta]);

  const actualizarEstado = (id, nuevoEstado, comentarioAdmin = '') => {
    const solicitudesActualizadas = solicitudes.map(solicitud =>
      solicitud.id === id
        ? { 
            ...solicitud, 
            estado: nuevoEstado, 
            fechaActualizacion: new Date().toISOString(),
            historial: [
              ...(solicitud.historial || []),
              { estado: nuevoEstado, fecha: new Date().toISOString(), comentario: comentarioAdmin || `Estado cambiado a ${nuevoEstado} por administrador.` }
            ]
          }
        : solicitud
    );
    
    setSolicitudes(solicitudesActualizadas);
    localStorage.setItem('solicitudes', JSON.stringify(solicitudesActualizadas));
    
    toast({
      title: "Estado actualizado",
      description: `Solicitud ${id} marcada como ${nuevoEstado}`,
    });
    if (selectedSolicitud && selectedSolicitud.id === id) {
      setSelectedSolicitud(solicitudesActualizadas.find(s => s.id === id));
    }
  };
  
  const limpiarFiltros = () => {
    setSearchTerm('');
    setFilterEstado('todos');
    setFilterPrioridad('todos');
    setFilterFechaDesde('');
    setFilterFechaHasta('');
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
      case 'pendiente': return <Clock className="w-4 h-4" />;
      case 'en_proceso': return <RefreshCw className="w-4 h-4 animate-spin-slow" />;
      case 'completado': return <CheckCircle className="w-4 h-4" />;
      case 'rechazado': return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const estadisticasRapidas = {
    total: solicitudes.length,
    pendientes: solicitudes.filter(s => s.estado === 'pendiente').length,
    enProceso: solicitudes.filter(s => s.estado === 'en_proceso').length,
    completados: solicitudes.filter(s => s.estado === 'completado').length,
    prioridadAlta: solicitudes.filter(s => s.prioridad === 'alta').length
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
            Panel Administrativo de Trámites
          </h1>
          <p className="text-xl text-gray-600">
            Gestiona y supervisa todas las solicitudes ciudadanas
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
           {Object.entries(estadisticasRapidas).map(([key, value]) => (
            <div key={key} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
              <div className={`text-2xl font-bold ${key === 'prioridadAlta' ? 'text-red-600' : key === 'pendientes' ? 'text-yellow-600' : 'text-blue-600'}`}>{value}</div>
              <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
            <div className="relative md:col-span-2 lg:col-span-2">
              <Label htmlFor="search">Buscar</Label>
              <Search className="absolute left-3 top-9 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="search"
                placeholder="ID, Nombre, DNI, Tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="filterEstado">Estado</Label>
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger id="filterEstado" className="mt-1">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filterPrioridad">Prioridad</Label>
              <Select value={filterPrioridad} onValueChange={setFilterPrioridad}>
                <SelectTrigger id="filterPrioridad" className="mt-1">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="filterFechaDesde">Desde</Label>
                <Input
                  id="filterFechaDesde"
                  type="date"
                  value={filterFechaDesde}
                  onChange={(e) => setFilterFechaDesde(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="filterFechaHasta">Hasta</Label>
                <Input
                  id="filterFechaHasta"
                  type="date"
                  value={filterFechaHasta}
                  onChange={(e) => setFilterFechaHasta(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={limpiarFiltros} className="mt-4 flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Limpiar Filtros</span>
          </Button>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">ID Trámite</TableHead>
                  <TableHead className="font-semibold text-gray-700">Solicitante</TableHead>
                  <TableHead className="font-semibold text-gray-700">Tipo</TableHead>
                  <TableHead className="font-semibold text-gray-700">Prioridad</TableHead>
                  <TableHead className="font-semibold text-gray-700">Estado</TableHead>
                  <TableHead className="font-semibold text-gray-700">Área</TableHead>
                  <TableHead className="font-semibold text-gray-700">Fecha Creación</TableHead>
                  <TableHead className="font-semibold text-gray-700">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSolicitudes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No se encontraron solicitudes con los filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSolicitudes.map((solicitud) => (
                    <TableRow key={solicitud.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedSolicitud(solicitud)}>
                      <TableCell className="font-medium text-blue-600">{solicitud.id}</TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{solicitud.nombreCompleto}</div>
                        <div className="text-sm text-gray-500">DNI: {solicitud.dni}</div>
                      </TableCell>
                      <TableCell>
                         <div className="font-medium text-gray-900">{solicitud.tipo}</div>
                         <div className="text-sm text-gray-500">{solicitud.distrito}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPrioridadColor(solicitud.prioridad)}>
                          {solicitud.prioridad.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getEstadoColor(solicitud.estado)} flex items-center space-x-1 w-fit`}>
                          {getEstadoIcon(solicitud.estado)}
                          <span>{solicitud.estado.replace('_', ' ').toUpperCase()}</span>
                        </Badge>
                      </TableCell>
                       <TableCell>
                        <div className="flex items-center space-x-1">
                          <Briefcase className="w-4 h-4 text-gray-500"/> 
                          <span>{solicitud.areaAsignada || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatFecha(solicitud.fechaCreacion)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => { e.stopPropagation(); setSelectedSolicitud(solicitud); }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="w-4 h-4 mr-1" /> Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>

        {selectedSolicitud && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSolicitud(null)}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold gradient-text">Detalle de Solicitud: {selectedSolicitud.id}</h2>
                <Button variant="ghost" size="icon" onClick={() => setSelectedSolicitud(null)}><XCircle /></Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div><strong>Solicitante:</strong> {selectedSolicitud.nombreCompleto}</div>
                <div><strong>DNI:</strong> {selectedSolicitud.dni}</div>
                <div><strong>Email:</strong> {selectedSolicitud.email}</div>
                <div><strong>Distrito:</strong> {selectedSolicitud.distrito}</div>
                <div><strong>Tipo Trámite:</strong> {selectedSolicitud.tipo}</div>
                <div><strong>Prioridad IA:</strong> <Badge className={getPrioridadColor(selectedSolicitud.prioridad)}>{selectedSolicitud.prioridad.toUpperCase()}</Badge></div>
                <div><strong>Estado Actual:</strong> <Badge className={`${getEstadoColor(selectedSolicitud.estado)} flex items-center space-x-1 w-fit`}>{getEstadoIcon(selectedSolicitud.estado)}<span>{selectedSolicitud.estado.replace('_', ' ').toUpperCase()}</span></Badge></div>
                <div><strong>Área Asignada:</strong> {selectedSolicitud.areaAsignada || 'N/A'}</div>
                <div><strong>Fecha Creación:</strong> {formatFecha(selectedSolicitud.fechaCreacion)}</div>
                <div><strong>Última Actualización:</strong> {formatFecha(selectedSolicitud.fechaActualizacion)}</div>
              </div>

              <div className="mb-4">
                <strong>Descripción:</strong>
                <p className="text-gray-700 bg-gray-50 p-2 rounded-md mt-1">{selectedSolicitud.descripcion}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Historial de Estados:</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-md">
                  {(selectedSolicitud.historial || []).slice().reverse().map((item, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-semibold">{formatFecha(item.fecha)}:</span> {item.estado.toUpperCase()} - <span className="text-gray-600">{item.comentario}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Actualizar Estado:</h3>
                <div className="flex space-x-2">
                  <Button onClick={() => actualizarEstado(selectedSolicitud.id, 'en_proceso', 'Admin: Marcado como En Proceso')} disabled={selectedSolicitud.estado === 'en_proceso'} variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">En Proceso</Button>
                  <Button onClick={() => actualizarEstado(selectedSolicitud.id, 'completado', 'Admin: Marcado como Completado')} disabled={selectedSolicitud.estado === 'completado'} variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">Completado</Button>
                  <Button onClick={() => actualizarEstado(selectedSolicitud.id, 'rechazado', 'Admin: Marcado como Rechazado')} disabled={selectedSolicitud.estado === 'rechazado'} variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">Rechazado</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PanelPage;