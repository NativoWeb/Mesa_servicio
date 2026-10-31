'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
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
        setError('Error de conexion. Verifica que el servidor este activo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid" style={{ gridTemplateColumns: '1.1fr 1fr' }}>
      {/* Panel izquierdo — branding */}
      <div
        className="hidden lg:flex relative overflow-hidden"
        style={{ background: 'linear-gradient(140deg, #0f3d2b, #08261b)' }}
      >
        {/* Dot pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,.07) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />
        {/* Decorative orb */}
        <div
          className="absolute w-[500px] h-[500px] -bottom-32 -right-32 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(184,212,50,.35), transparent 65%)',
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 flex items-center justify-center font-bold text-sm"
                style={{ background: '#b8d432', color: '#0c3324', borderRadius: '11px' }}
              >
                SD
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg leading-tight">Service Desk</h2>
                <p style={{ color: '#b6cfbf' }} className="text-sm">Mesa de Servicio TI</p>
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-white leading-tight mb-4" style={{ fontSize: 'clamp(34px, 4vw, 54px)', fontWeight: 850 }}>
              Mesa de Servicio TI
            </h1>
            <p style={{ color: '#b6cfbf' }} className="text-lg leading-relaxed max-w-md">
              Plataforma de gestion de soporte tecnico e inventario de activos tecnologicos institucionales.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: '24/7', label: 'Disponibilidad' },
                { value: '6', label: 'Sedes' },
                { value: 'SLA', label: 'Monitoreo' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="backdrop-blur p-4 text-center"
                  style={{
                    background: 'rgba(255,255,255,.08)',
                    borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,.1)',
                  }}
                >
                  <p className="text-white text-2xl font-bold tabular-nums">{stat.value}</p>
                  <p style={{ color: '#b6cfbf' }} className="text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p style={{ color: 'rgba(184,212,50,.45)' }} className="text-xs">
            &copy; 2026 Mesa de Servicio TI
          </p>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="w-full flex items-center justify-center p-8" style={{ background: 'var(--canvas)' }}>
        <div className="w-full max-w-md">
          {/* Logo movil */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div
                className="w-10 h-10 flex items-center justify-center font-bold text-sm"
                style={{ background: '#b8d432', color: '#0c3324', borderRadius: '11px' }}
              >
                SD
              </div>
              <span className="text-xl font-bold" style={{ color: 'var(--ink)' }}>Mesa de Servicio TI</span>
            </div>
          </div>

          <div
            className="p-8"
            style={{
              background: 'var(--surface)',
              borderRadius: '16px',
              boxShadow: 'var(--sh-2)',
              border: '1px solid var(--line)',
            }}
          >
            {/* Brand mark */}
            <div className="mb-6">
              <div
                className="w-10 h-10 flex items-center justify-center font-bold text-sm mb-4 hidden lg:flex"
                style={{ background: '#b8d432', color: '#0c3324', borderRadius: '11px' }}
              >
                SD
              </div>
              <h1 className="font-[800] text-[28px]" style={{ color: 'var(--ink)' }}>Iniciar sesion</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Ingresa con tu cuenta institucional</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-2)' }}>
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
                  className="w-full px-4 text-sm outline-none transition-all"
                  style={{
                    height: '42px',
                    borderRadius: '11px',
                    border: '1px solid var(--line-2)',
                    background: 'var(--surface)',
                    color: 'var(--ink)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--selva-500)';
                    e.currentTarget.style.boxShadow = 'var(--focus)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--line-2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium" style={{ color: 'var(--ink-2)' }}>
                    Contrasena
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium"
                    style={{ color: 'var(--selva-500)' }}
                  >
                    Olvide mi contrasena
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 text-sm outline-none transition-all"
                  style={{
                    height: '42px',
                    borderRadius: '11px',
                    border: '1px solid var(--line-2)',
                    background: 'var(--surface)',
                    color: 'var(--ink)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--selva-500)';
                    e.currentTarget.style.boxShadow = 'var(--focus)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--line-2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {error && (
                <div
                  className="px-4 py-3 text-sm"
                  style={{
                    background: 'var(--crit-bg)',
                    color: 'var(--crit)',
                    borderRadius: '11px',
                    border: '1px solid rgba(207,59,53,.2)',
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full font-[650] text-[15px] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  height: '48px',
                  borderRadius: '13px',
                  background: '#b8d432',
                  color: '#1d3a0a',
                  boxShadow: '0 8px 20px -10px rgba(140,170,20,.8)',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.background = '#c9e25a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#b8d432';
                }}
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
                  'Iniciar sesion'
                )}
              </button>
            </form>

            {/* Accesos rapidos para dev */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 pt-4" style={{ borderTop: '1px dashed var(--line)' }}>
                <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--faint)' }}>Accesos rapidos (dev)</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'Admin', email: 'admin@demo.servicedesk.com' },
                    { label: 'Lider', email: 'lider@demo.servicedesk.com' },
                    { label: 'Tecnico', email: 'tecnico@demo.servicedesk.com' },
                    { label: 'Inventario', email: 'inventario@demo.servicedesk.com' },
                    { label: 'Usuario', email: 'usuario@demo.servicedesk.com' },
                    { label: 'Cuentadante', email: 'cuentadante@demo.servicedesk.com' },
                  ].map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        setEmail(acc.email);
                        setPassword('password');
                      }}
                      className="text-[11px] px-2 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      style={{
                        background: 'var(--surface-3)',
                        color: 'var(--ink-2)',
                        borderRadius: '8px',
                      }}
                    >
                      {acc.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--faint)' }}>
            Mesa de Servicio TI
          </p>
        </div>
      </div>
    </div>
  );
}
