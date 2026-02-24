'use client';

import { useEffect, useState } from 'react';
import { getMedicos } from '@/services/api';
import Link from 'next/link';

export default function MedicosPage() {
  const [medicos, setMedicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const response = await getMedicos();
        setMedicos(response.data || response);
      } catch (error) {
        console.error('Error cargando médicos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicos();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Médicos</h1>
        <Link
          href="/dashboard/medicos/nuevo"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Nuevo Médico
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        {loading ? (
          <p>Cargando médicos...</p>
        ) : medicos.length === 0 ? (
          <p className="text-gray-500">No hay médicos registrados.</p>
        ) : (
          <ul className="space-y-3">
            {medicos.map((m: any) => (
              <li key={m.id} className="border p-3 rounded-lg">
                <strong>{m.nombre} {m.apellido}</strong>
                <p className="text-sm text-gray-600">
                  {m.especialidad}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}