'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getCamas, getCitas, getFacturas, getPacientes } from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    pacientes: 0,
    citas_hoy: 0,
    facturas_pendientes: 0,
    camas_disponibles: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchStats = async () => {
        try {
          const [pacientes, citas, facturas, camas] = await Promise.all([
            getPacientes({ limit: 1 }),
            getCitas({ limit: 100 }),
            getFacturas({ limit: 1 }),
            getCamas({ estado: 'disponible' }),
          ]);

          const hoy = new Date().toISOString().split('T')[0];
          const citasHoy = citas.data.filter((c: any) => 
            c.fecha_hora.startsWith(hoy)
          ).length;

          setStats({
            pacientes: pacientes.pagination?.total || 0,
            citas_hoy: citasHoy,
            facturas_pendientes: facturas.totales?.total_pendiente || 0,
            camas_disponibles: camas.resumen?.disponibles || 0,
          });
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      };
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Pacientes',
      value: stats.pacientes,
      icon: '👥',
      color: 'bg-blue-50',
      href: '/dashboard/pacientes',
    },
    {
      title: 'Citas Hoy',
      value: stats.citas_hoy,
      icon: '📅',
      color: 'bg-green-50',
      href: '/dashboard/citas',
    },
    {
      title: 'Facturas Pendientes',
      value: `$${stats.facturas_pendientes}`,
      icon: '💰',
      color: 'bg-yellow-50',
      href: '/dashboard/facturas',
    },
    {
      title: 'Camas Disponibles',
      value: stats.camas_disponibles,
      icon: '🛏️',
      color: 'bg-purple-50',
      href: '/dashboard/camas',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Bienvenido, {user?.nombre} {user?.apellido}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className={`${card.color} p-6 rounded-xl hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Accesos Rápidos
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/dashboard/pacientes/nuevo"
              className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-center"
            >
              <span className="text-2xl block mb-1">➕</span>
              <span className="text-sm font-medium text-primary-700">Nuevo Paciente</span>
            </Link>
            <Link
              href="/dashboard/citas/nueva"
              className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
            >
              <span className="text-2xl block mb-1">📅</span>
              <span className="text-sm font-medium text-green-700">Nueva Cita</span>
            </Link>
            <Link
              href="/dashboard/facturas/nueva"
              className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-center"
            >
              <span className="text-2xl block mb-1">💳</span>
              <span className="text-sm font-medium text-yellow-700">Nueva Factura</span>
            </Link>
            <Link
              href="/dashboard/camas"
              className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center"
            >
              <span className="text-2xl block mb-1">🛏️</span>
              <span className="text-sm font-medium text-purple-700">Ver Camas</span>
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Información del Sistema
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Rol:</span>
              <span className="font-medium capitalize">{user?.rol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ID:</span>
              <span className="font-medium">#{user?.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
