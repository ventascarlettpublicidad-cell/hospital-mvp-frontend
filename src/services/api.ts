import axios from 'axios';
import Cookies from 'js-cookie';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;

// Auth
export const login = async (email: string, password: string) => {
  const { data } = await API.post('/api/auth/login', { email, password });
  return data;
};

export const logout = async () => {
  await API.post('/api/auth/logout');
  Cookies.remove('token');
};

export const getMe = async () => {
  const { data } = await API.get('/api/auth/me');
  return data;
};

// Pacientes
export const getPacientes = async (params?: { page?: number; limit?: number; search?: string }) => {
  const { data } = await API.get('/api/pacientes', { params });
  return data;
};

export const getPaciente = async (id: number) => {
  const { data } = await API.get(`/api/pacientes/${id}`);
  return data;
};

export const createPaciente = async (paciente: any) => {
  const { data } = await API.post('/api/pacientes', paciente);
  return data;
};

export const updatePaciente = async (id: number, paciente: any) => {
  const { data } = await API.put(`/api/pacientes/${id}`, paciente);
  return data;
};

export const deletePaciente = async (id: number) => {
  const { data } = await API.delete(`/api/pacientes/${id}`);
  return data;
};

// Médicos
export const getMedicos = async (params?: { especialidad?: string }) => {
  const { data } = await API.get('/api/medicos', { params });
  return data;
};

export const getMedico = async (id: number) => {
  const { data } = await API.get(`/api/medicos/${id}`);
  return data;
};

export const createMedico = async (medico: any) => {
  const { data } = await API.post('/api/medicos', medico);
  return data;
};

export const getMedicoHorarios = async (id: number) => {
  const { data } = await API.get(`/api/medicos/${id}/horarios`);
  return data;
};

// Citas
export const getCitas = async (params?: { 
  page?: number; 
  limit?: number; 
  medico_id?: number;
  paciente_id?: number;
  estado?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}) => {
  const { data } = await API.get('/api/citas', { params });
  return data;
};

export const getCita = async (id: number) => {
  const { data } = await API.get(`/api/citas/${id}`);
  return data;
};

export const createCita = async (cita: any) => {
  const { data } = await API.post('/api/citas', cita);
  return data;
};

export const updateCita = async (id: number, cita: any) => {
  const { data } = await API.put(`/api/citas/${id}`, cita);
  return data;
};

export const updateEstadoCita = async (id: number, estado: string, motivo_cancelacion?: string) => {
  const { data } = await API.patch(`/api/citas/${id}/estado`, { estado, motivo_cancelacion });
  return data;
};

export const getDisponibilidad = async (medico_id: number, fecha: string) => {
  const { data } = await API.get('/api/citas/disponibilidad', { params: { medico_id, fecha } });
  return data;
};

// Historiales
export const getHistorialesPaciente = async (paciente_id: number, params?: { page?: number; limit?: number }) => {
  const { data } = await API.get(`/api/historiales/paciente/${paciente_id}`, { params });
  return data;
};

export const getHistorial = async (id: number) => {
  const { data } = await API.get(`/api/historiales/${id}`);
  return data;
};

export const createHistorial = async (historial: any) => {
  const { data } = await API.post('/api/historiales', historial);
  return data;
};

export const updateHistorial = async (id: number, historial: any) => {
  const { data } = await API.put(`/api/historiales/${id}`, historial);
  return data;
};

// Facturas
export const getFacturas = async (params?: { 
  page?: number; 
  limit?: number;
  paciente_id?: number;
  estado_pago?: string;
}) => {
  const { data } = await API.get('/api/facturas', { params });
  return data;
};

export const getFactura = async (id: number) => {
  const { data } = await API.get(`/api/facturas/${id}`);
  return data;
};

export const createFactura = async (factura: any) => {
  const { data } = await API.post('/api/facturas', factura);
  return data;
};

export const registrarPago = async (id: number, metodo_pago: string, observaciones?: string) => {
  const { data } = await API.patch(`/api/facturas/${id}/pago`, { metodo_pago, observaciones });
  return data;
};

export const getResumenFacturacion = async (params?: { fecha_inicio?: string; fecha_fin?: string }) => {
  const { data } = await API.get('/api/facturas/resumen', { params });
  return data;
};

// Camas
export const getCamas = async (params?: { estado?: string; tipo?: string; planta?: number }) => {
  const { data } = await API.get('/api/camas', { params });
  return data;
};

export const getCama = async (id: number) => {
  const { data } = await API.get(`/api/camas/${id}`);
  return data;
};

export const createCama = async (cama: any) => {
  const { data } = await API.post('/api/camas', cama);
  return data;
};

export const asignarCama = async (id: number, paciente_id: number, motivo?: string) => {
  const { data } = await API.post(`/api/camas/${id}/asignar`, { paciente_id, motivo });
  return data;
};

export const liberarCama = async (id: number, motivo?: string) => {
  const { data } = await API.post(`/api/camas/${id}/liberar`, { motivo });
  return data;
};

export const marcarCamaDisponible = async (id: number) => {
  const { data } = await API.post(`/api/camas/${id}/disponible`);
  return data;
};
