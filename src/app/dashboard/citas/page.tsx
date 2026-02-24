'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getCitas, updateEstadoCita, getPacientes, getMedicos } from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CitasPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [citas, setCitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ estado: '', fecha: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchCitas();
    }
  }, [user, pagination.page, filter]);

  const fetchCitas = async () => {
    setLoading(true);
    try {
      const params: any = { page: pagination.page, limit: pagination.limit };
      if (filter.estado) params.estado = filter.estado;
      if (filter.fecha) {
        params.fecha_inicio = filter.fecha;
        params.fecha_fin = filter.fecha;
      }
      const data = await getCitas(params);
      setCitas(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEstadoChange = async (id: number, nuevoEstado: string) => {
    try {
      await updateEstadoCita(id, nuevoEstado);
      fetchCitas();
    } catch (error) {
      console.error('Error updating cita:', error);
    }
  };

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      confirmada: 'bg-blue-100 text-blue-800',
      cancelada: 'bg-red-100 text-red-800',
      atendida: 'bg-green-100 text-green-800',
      no_asistio: 'bg-gray-100 text-gray-800',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Citas</h1>
        <Link href="/dashboard/citas/nueva" className="btn btn-primary">
          ➕ Nueva Cita
        </Link>
      </div>

      <div className="card mb-6">
        <div className="flex gap-4 flex-wrap">
          <select
            value={filter.estado}
            onChange={(e) => setFilter({ ...filter, estado: e.target.value })}
            className="input w-auto"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="atendida">Atendida</option>
            <option value="cancelada">Cancelada</option>
            <option value="no_asistio">No Asistió</option>
          </select>
          <input
            type="date"
            value={filter.fecha}
            onChange={(e) => setFilter({ ...filter, fecha: e.target.value })}
            className="input w-auto"
          />
          <button onClick={fetchCitas} className="btn btn-secondary">
            Filtrar
          </button>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : citas.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No hay citas registradas</p>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha/Hora</th>
                  <th>Paciente</th>
                  <th>Médico</th>
                  <th>Especialidad</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((c) => (
                  <tr key={c.id}>
                    <td className="whitespace-nowrap">
                      {new Date(c.fecha_hora).toLocaleString('es-PE', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td>
                      <div className="font-medium">{c.paciente_apellido}, {c.paciente_nombre}</div>
                      <div className="text-xs text-gray-500">DNI: {c.paciente_dni}</div>
                    </td>
                    <td>Dr. {c.medico_apellido}, {c.medico_nombre}</td>
                    <td>{c.especialidad}</td>
                    <td className="max-w-xs truncate">{c.motivo || '-'}</td>
                    <td>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(c.estado)}`}>
                        {c.estado}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2 flex-wrap">
                        {c.estado === 'pendiente' && (
                          <>
                            <button
                              onClick={() => handleEstadoChange(c.id, 'confirmada')}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => handleEstadoChange(c.id, 'atendida')}
                              className="text-green-600 hover:text-green-800 text-sm"
                            >
                              Atender
                            </button>
                          </>
                        )}
                        {c.estado !== 'cancelada' && c.estado !== 'atendida' && (
                          <button
                            onClick={() => handleEstadoChange(c.id, 'cancelada')}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setPagination({ ...pagination, page })}
                    className={`px-3 py-1 rounded ${
                      page === pagination.page
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
