'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPacientes, createHistorial } from '@/services/api';

export default function NuevoHistorialPage() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    paciente_id: '',
    motivo: '',
    diagnostico: '',
    tratamiento: '',
  });

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

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.paciente_id) {
      alert('Debe seleccionar un paciente');
      return;
    }

    try {
      setLoading(true);

      await createHistorial({
        paciente_id: Number(form.paciente_id),
        motivo: form.motivo,
        diagnostico: form.diagnostico,
        tratamiento: form.tratamiento,
      });

      alert('Historial creado correctamente');
      router.push('/dashboard/historiales');

    } catch (error) {
      console.error(error);
      alert('Error al crear historial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nuevo Historial Médico</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block mb-1 font-medium">Paciente</label>
            <select
              name="paciente_id"
              value={form.paciente_id}
              onChange={handleChange}
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

          <div>
            <label className="block mb-1 font-medium">Motivo</label>
            <textarea
              name="motivo"
              value={form.motivo}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Diagnóstico</label>
            <textarea
              name="diagnostico"
              value={form.diagnostico}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Tratamiento</label>
            <textarea
              name="tratamiento"
              value={form.tratamiento}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>

        </form>
      </div>
    </div>
  );
}