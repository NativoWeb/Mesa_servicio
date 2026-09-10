'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useAuthStore, getRoleRoute } from '@/stores/auth-store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { isAuthenticated, user, isHydrated } = useAuthStore();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isHydrated && isAuthenticated && user) {
      router.replace(getRoleRoute(user.role));
    }
  }, [isHydrated, isAuthenticated, user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      if (axiosError.response?.data?.errors?.email) {
        setError(axiosError.response.data.errors.email[0]);
      } else if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        setError('Error de conexión. Verifica que el servidor esté activo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-950 via-green-900 to-green-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">UTS</span>
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg leading-tight">Unidades Tecnológicas</h2>
                <p className="text-green-300 text-sm">de Santander</p>
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-white text-4xl font-bold leading-tight mb-4">
              Mesa de Servicio TI
            </h1>
            <p className="text-green-200/80 text-lg leading-relaxed max-w-md">
              Plataforma de gestión de soporte técnico e inventario de activos tecnológicos institucionales.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: '24/7', label: 'Disponibilidad' },
                { value: '6', label: 'Sedes' },
                { value: 'SLA', label: 'Monitoreo' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                  <p className="text-white text-2xl font-bold">{stat.value}</p>
                  <p className="text-green-300 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-green-400/60 text-xs">
            &copy; 2026 Mesa de Servicio TI &middot; UTS Bucaramanga
          </p>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo móvil */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-green-900 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">UTS</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Mesa de Servicio TI</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Iniciar sesión</h1>
              <p className="text-gray-500 text-sm mt-1">Ingresa con tu cuenta institucional</p>
            </div>

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
                  placeholder="usuario@uts.edu.co"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <button type="button" className="text-xs text-green-700 hover:text-green-800 font-medium">
                    Olvidé mi contraseña
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
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
                    Verificando...
                  </span>
                ) : (
                  'Iniciar sesión'
                )}
              </button>
            </form>

            {/* Accesos rápidos para dev */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 pt-4 border-t border-dashed">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Accesos rápidos (dev)</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'Admin', email: 'admin@uts.edu.co' },
                    { label: 'Líder', email: 'lider@uts.edu.co' },
                    { label: 'Técnico', email: 'tecnico@uts.edu.co' },
                    { label: 'Inventario', email: 'inventario@uts.edu.co' },
                    { label: 'Usuario', email: 'usuario@uts.edu.co' },
                    { label: 'Cuentadante', email: 'cuentadante@uts.edu.co' },
                  ].map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => {
                        setEmail(acc.email);
                        setPassword('password');
                      }}
                      className="text-[11px] px-2 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                    >
                      {acc.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Mesa de Servicio TI &middot; Unidades Tecnológicas de Santander
          </p>
        </div>
      </div>
    </div>
  );
}
