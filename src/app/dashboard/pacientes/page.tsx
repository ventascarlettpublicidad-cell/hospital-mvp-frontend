'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getPacientes, deletePaciente } from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PacientesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchPacientes();
    }
  }, [user, pagination.page, search]);

  const fetchPacientes = async () => {
    setLoading(true);
    try {
      const data = await getPacientes({ page: pagination.page, limit: pagination.limit, search });
      setPacientes(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este paciente?')) {
      try {
        await deletePaciente(id);
        fetchPacientes();
      } catch (error) {
        console.error('Error deleting paciente:', error);
      }
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
        <Link href="/dashboard/pacientes/nuevo" className="btn btn-primary">
          ➕ Nuevo Paciente
        </Link>
      </div>

      <div className="card mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o DNI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input flex-1"
          />
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : pacientes.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No hay pacientes registrados</p>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>DNI</th>
                  <th>Nombre</th>
                  <th>Fecha Nac.</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Tipo Sangre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map((p) => (
                  <tr key={p.id}>
                    <td className="font-mono text-sm">{p.dni}</td>
                    <td className="font-medium">{p.apellido}, {p.nombre}</td>
                    <td>{new Date(p.fecha_nacimiento).toLocaleDateString('es-PE')}</td>
                    <td>{p.telefono || '-'}</td>
                    <td>{p.email || '-'}</td>
                    <td>
                      <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium">
                        {p.sangre_tipo || '-'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/pacientes/${p.id}`}
                          className="text-primary-600 hover:text-primary-800 text-sm"
                        >
                          Ver
                        </Link>
                        <Link
                          href={`/dashboard/pacientes/${p.id}/editar`}
                          className="text-gray-600 hover:text-gray-800 text-sm"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-danger-500 hover:text-danger-700 text-sm"
                        >
                          Eliminar
                        </button>
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
