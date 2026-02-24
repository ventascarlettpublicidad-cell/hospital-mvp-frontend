'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPacientes, createFactura } from '@/services/api';

export default function NuevaFacturaPage() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    paciente_id: '',
    total: '',
    descripcion: '',
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

    if (!form.paciente_id || !form.total) {
      alert('Complete los campos obligatorios');
      return;
    }

    try {
      setLoading(true);

      await createFactura({
        paciente_id: Number(form.paciente_id),
        cita_id: null,
        concepto: form.descripcion || 'Factura médica',
        monto: Number(form.total),
        igv: 0,
        observaciones: ''
      });

      alert('Factura creada correctamente');
      router.push('/dashboard/facturacion');
    } catch (error) {
      console.error(error);
      alert('Error al crear factura');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nueva Factura</h1>

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
            <label className="block mb-1 font-medium">Total</label>
            <input
              type="number"
              name="total"
              value={form.total}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Consulta médica, exámenes, etc."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {loading ? 'Guardando...' : 'Guardar Factura'}
          </button>

        </form>
      </div>
    </div>
  );
}