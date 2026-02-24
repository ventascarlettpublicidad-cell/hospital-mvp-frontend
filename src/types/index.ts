export interface User {
  id: number;
  email: string;
  rol: 'administrador' | 'recepcion' | 'medico' | 'enfermeria';
  nombre: string;
  apellido: string;
  activo: boolean;
}

export interface Paciente {
  id: number;
  dni: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  genero?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  sangre_tipo?: string;
  alergias?: string[];
  contacto_emergencia_nombre?: string;
  contacto_emergencia_telefono?: string;
  contacto_emergencia_parentesco?: string;
  activo: boolean;
  created_at: string;
}

export interface Medico {
  id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
  licencia: string;
  telefono?: string;
  email?: string;
  duracion_consulta_minutos: number;
  activo: boolean;
}

export interface MedicoHorario {
  id: number;
  medico_id: number;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
}

export interface Cita {
  id: number;
  paciente_id: number;
  medico_id: number;
  fecha_hora: string;
  duracion_minutos: number;
  motivo?: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'atendida' | 'no_asistio';
  paciente_nombre?: string;
  paciente_apellido?: string;
  paciente_dni?: string;
  medico_nombre?: string;
  medico_apellido?: string;
  especialidad?: string;
}

export interface HistorialClinico {
  id: number;
  paciente_id: number;
  cita_id?: number;
  fecha: string;
  motivo_consulta?: string;
  diagnostico?: string;
  tratamiento?: string;
  receta?: string;
  observaciones?: string;
  peso?: number;
  temperatura?: number;
  presion_sistolica?: number;
  presion_diastolica?: number;
  medico_id?: number;
  medico_nombre?: string;
  medico_apellido?: string;
  especialidad?: string;
  archivos?: ArchivoClinico[];
}

export interface ArchivoClinico {
  id: number;
  historial_id: number;
  tipo: 'laboratorio' | 'imagen' | 'receta' | 'otro';
  nombre: string;
  nombre_original: string;
  mime_type?: string;
  tamano_bytes?: number;
  url: string;
}

export interface Factura {
  id: number;
  paciente_id: number;
  cita_id?: number;
  numero_factura: string;
  concepto: string;
  monto: number;
  igv: number;
  total: number;
  estado_pago: 'pendiente' | 'pagada' | 'anulada';
  metodo_pago?: string;
  fecha_pago?: string;
  observaciones?: string;
  paciente_nombre?: string;
  paciente_apellido?: string;
  paciente_dni?: string;
}

export interface Cama {
  id: number;
  numero: string;
  tipo: 'estandar' | 'uci' | 'pediatrica' | 'maternidad';
  planta: number;
  descripcion?: string;
  estado: 'disponible' | 'ocupada' | 'limpieza' | 'mantenimiento';
  paciente_id?: number;
  paciente_nombre?: string;
  paciente_apellido?: string;
  paciente_dni?: string;
  fecha_asignacion?: string;
  historial?: CamaHistorial[];
}

export interface CamaHistorial {
  id: number;
  cama_id: number;
  paciente_id: number;
  fecha_entrada: string;
  fecha_salida?: string;
  motivo?: string;
  paciente_nombre?: string;
  paciente_apellido?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: Pagination;
}
