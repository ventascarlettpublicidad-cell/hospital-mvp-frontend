'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPacientes, getMedicos, createCita } from '@/services/api';

export default function NuevaCitaPage() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [medicos, setMedicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    paciente_id: '',
    medico_id: '',
    fecha_hora: '',
    motivo: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const pacientesData = await getPacientes({ limit: 100 });
      const medicosData = await getMedicos();

      setPacientes(pacientesData.data || pacientesData);
      setMedicos(medicosData.data || medicosData);
    };

    fetchData();
  }, []);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.paciente_id || !form.medico_id || !form.fecha_hora) {
      alert('Complete todos los campos obligatorios');
      return;
    }

    try {
      setLoading(true);

      await createCita({
        paciente_id: Number(form.paciente_id),
        medico_id: Number(form.medico_id),
        fecha_hora: form.fecha_hora,
        motivo: form.motivo,
      });

      alert('Cita creada correctamente');
      router.push('/dashboard/citas');

    } catch (error) {
      console.error(error);
      alert('Error al crear cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nueva Cita</h1>

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
              <option value="">Seleccione paciente</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} {p.apellido}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Médico</label>
            <select
              name="medico_id"
              value={form.medico_id}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Seleccione médico</option>
              {medicos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre} {m.apellido} - {m.especialidad}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Fecha y Hora</label>
            <input
              type="datetime-local"
              name="fecha_hora"
              value={form.fecha_hora}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Motivo</label>
            <textarea
              name="motivo"
              value={form.motivo}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {loading ? 'Guardando...' : 'Guardar Cita'}
          </button>

        </form>
      </div>
    </div>
  );
}