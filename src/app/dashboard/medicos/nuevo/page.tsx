'use client';

import { useState } from 'react';
import { createMedico } from '@/services/api';
import { useRouter } from 'next/navigation';

export default function NuevoMedicoPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    especialidad: '',
    licencia: '',
    telefono: '',
    email: '',
    duracion_consulta_minutos: 30,
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === 'number'
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await createMedico(form);
      alert('Médico creado correctamente');
      router.push('/dashboard/medicos');
    } catch (error: any) {
      console.error('Error completo:', error.response?.data || error);
      alert('Error al crear médico');
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Nuevo Médico</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="especialidad"
          placeholder="Especialidad"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="licencia"
          placeholder="Licencia"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          name="duracion_consulta_minutos"
          placeholder="Duración consulta (minutos)"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}