'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createPaciente } from '@/services/api';
import { useRouter } from 'next/navigation';

export default function NuevoPacientePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    genero: '',
    telefono: '',
    email: '',
    direccion: '',
    sangre_tipo: '',
    alergias: '',
    contacto_emergencia_nombre: '',
    contacto_emergencia_telefono: '',
    contacto_emergencia_parentesco: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        alergias: formData.alergias ? formData.alergias.split(',').map(a => a.trim()) : [],
      };
      await createPaciente(data);
      router.push('/dashboard/pacientes');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear paciente');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Paciente</h1>

      {error && (
        <div className="mb-4 p-3 bg-danger-50 border border-danger-200 text-danger-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 border-b pb-2">Datos Personales</h3>
            
            <div>
              <label className="label">DNI *</label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                className="input"
                required
                maxLength={20}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Apellido *</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Fecha de Nacimiento *</label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Género</label>
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Seleccionar</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Tipo de Sangre</label>
              <select
                name="sangre_tipo"
                value={formData.sangre_tipo}
                onChange={handleChange}
                className="input"
              >
                <option value="">Seleccionar</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="label">Alergias (separadas por coma)</label>
              <input
                type="text"
                name="alergias"
                value={formData.alergias}
                onChange={handleChange}
                className="input"
                placeholder="ej: penicilina, mariscos"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 border-b pb-2">Contacto</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="label">Dirección</label>
              <textarea
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="input"
                rows={2}
              />
            </div>

            <h3 className="font-semibold text-gray-700 border-b pb-2 pt-4">Contacto de Emergencia</h3>

            <div>
              <label className="label">Nombre</label>
              <input
                type="text"
                name="contacto_emergencia_nombre"
                value={formData.contacto_emergencia_nombre}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Teléfono</label>
                <input
                  type="tel"
                  name="contacto_emergencia_telefono"
                  value={formData.contacto_emergencia_telefono}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Parentesco</label>
                <input
                  type="text"
                  name="contacto_emergencia_parentesco"
                  value={formData.contacto_emergencia_parentesco}
                  onChange={handleChange}
                  className="input"
                  placeholder="ej: padre, cónyuge"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Guardando...' : 'Guardar Paciente'}
          </button>
        </div>
      </form>
    </div>
  );
}
