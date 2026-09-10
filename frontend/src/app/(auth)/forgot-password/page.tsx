'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      if (axiosError.response?.data?.errors?.email) {
        setError(axiosError.response.data.errors.email[0]);
      } else if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        setError('Error de conexion. Verifica que el servidor este activo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-green-900 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">SD</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Mesa de Servicio TI</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Recuperar contrasena</h1>
            <p className="text-gray-500 text-sm mt-1">
              Ingresa tu correo institucional y te enviaremos un enlace para restablecer tu contrasena.
            </p>
          </div>

          {success ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                Se ha enviado un enlace de restablecimiento a tu correo. Revisa tu bandeja de entrada.
              </div>
              <Link
                href="/login"
                className="block w-full text-center bg-green-800 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
              >
                Volver al inicio de sesion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Correo institucional
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-800 hover:bg-green-700 disabled:bg-green-800/60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  'Enviar enlace de restablecimiento'
                )}
              </button>

              <Link
                href="/login"
                className="block text-center text-sm text-green-700 hover:text-green-800 font-medium"
              >
                Volver al inicio de sesion
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
