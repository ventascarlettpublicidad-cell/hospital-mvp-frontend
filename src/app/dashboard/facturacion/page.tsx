'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFacturas } from '@/services/api';

export default function FacturacionPage() {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const data = await getFacturas({ limit: 100 });
        setFacturas(data.data || data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Facturación</h1>

        <Link
          href="/dashboard/facturacion/nueva"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Nueva Factura
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        {loading ? (
          <p>Cargando facturas...</p>
        ) : facturas.length === 0 ? (
          <p className="text-gray-500">No hay facturas registradas.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Paciente</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((f) => (
                <tr key={f.id} className="border-b">
                  <td className="py-2">{f.paciente_nombre}</td>
                  <td>${f.total}</td>
                  <td>{f.estado_pago}</td>
                  <td>{new Date(f.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}