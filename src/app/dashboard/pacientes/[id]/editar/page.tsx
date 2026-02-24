'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPaciente, updatePaciente } from '@/services/api';

export default function EditarPacientePage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    const fetchPaciente = async () => {
      const data = await getPaciente(Number(id));
      setForm(data);
    };

    if (id) fetchPaciente();
  }, [id]);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await updatePaciente(Number(id), form);
    alert('Paciente actualizado');
    router.push('/dashboard/pacientes');
  };

  if (!form) return <p>Cargando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar Paciente</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />

          <input
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />

          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Guardar Cambios
          </button>

        </form>
      </div>
    </div>
  );
}