'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPaciente } from '@/services/api';

export default function VerPacientePage() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState<any>(null);

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const data = await getPaciente(Number(id));
        setPaciente(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) fetchPaciente();
  }, [id]);

  if (!paciente) return <p>Cargando paciente...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {paciente.nombre} {paciente.apellido}
      </h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-2">
        <p><strong>DNI:</strong> {paciente.dni}</p>
        <p><strong>Email:</strong> {paciente.email}</p>
        <p><strong>Teléfono:</strong> {paciente.telefono}</p>
        <p><strong>Fecha Nacimiento:</strong> {paciente.fecha_nacimiento}</p>
        <p><strong>Tipo de Sangre:</strong> {paciente.tipo_sangre}</p>
      </div>
    </div>
  );
}