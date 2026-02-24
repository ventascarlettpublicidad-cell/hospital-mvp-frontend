'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getHistorialesPaciente, getPacientes } from '@/services/api';

export default function HistorialesPage() {
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<number | null>(null);
  const [historiales, setHistoriales] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar pacientes
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const data = await getPacientes({ limit: 100 });
        setPacientes(data.data || data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPacientes();
  }, []);

  // Cargar historiales del paciente seleccionado
  useEffect(() => {
    if (!pacienteSeleccionado) return;

    const fetchHistoriales = async () => {
      setLoading(true);
      try {
        const data = await getHistorialesPaciente(pacienteSeleccionado);
        setHistoriales(data.data || data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoriales();
  }, [pacienteSeleccionado]);

  return (
    <div>

      {/* HEADER + BOTÓN */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Historiales</h1>

        <Link
          href="/dashboard/historiales/nuevo"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Nuevo Historial
        </Link>
      </div>

      {/* SELECT PACIENTE */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <label className="block mb-2 font-medium">Seleccionar Paciente</label>

        <select
          onChange={(e) => setPacienteSeleccionado(Number(e.target.value))}
          className="border p-2 rounded w-full"
        >
          <option value="">Seleccione un paciente</option>
          {pacientes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} {p.apellido}
            </option>
          ))}
        </select>
      </div>

      {/* LISTA HISTORIALES */}
      <div className="bg-white p-6 rounded-xl shadow">
        {loading ? (
          <p>Cargando historiales...</p>
        ) : historiales.length === 0 ? (
          <p className="text-gray-500">No hay historiales registrados.</p>
        ) : (
          <div className="space-y-4">
            {historiales.map((h) => (
              <div key={h.id} className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">
                  {new Date(h.created_at).toLocaleDateString()}
                </p>
                <p><strong>Motivo:</strong> {h.motivo}</p>
                <p><strong>Diagnóstico:</strong> {h.diagnostico}</p>
                <p><strong>Tratamiento:</strong> {h.tratamiento}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}