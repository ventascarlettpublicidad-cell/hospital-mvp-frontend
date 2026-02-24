'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Inicio', icon: '🏠' },
    { href: '/dashboard/pacientes', label: 'Pacientes', icon: '👥' },
    { href: '/dashboard/medicos', label: 'Médicos', icon: '👨‍⚕️' },
    { href: '/dashboard/citas', label: 'Citas', icon: '📅' },
    { href: '/dashboard/historiales', label: 'Historiales', icon: '📋' },
    { href: '/dashboard/facturacion', label: 'Facturación', icon: '💰' }, // 🔥 CORREGIDO
    { href: '/dashboard/camas', label: 'Camas', icon: '🛏️' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-10">🏥 Hospital MVP</h1>

        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-blue-600'
                  : 'hover:bg-slate-800'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* USER INFO */}
        <div className="border-t border-slate-700 pt-4 mt-4">
          <p className="text-sm font-medium">
            {user?.nombre} {user?.apellido}
          </p>
          <p className="text-xs text-slate-400 capitalize">{user?.rol}</p>

          <button
            onClick={logout}
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm transition"
          >
            🔓 Cerrar sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}