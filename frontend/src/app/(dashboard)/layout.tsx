'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, getRoleRoute } from '@/stores/auth-store';
import { useTenantStore } from '@/stores/tenant-store';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';

const ROLE_PREFIXES: Record<string, string> = {
  admin: '/admin',
  it_leader: '/lider',
  technician: '/tecnico',
  inventory_manager: '/inventario',
  end_user: '/usuario',
  asset_holder: '/cuentadante',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isHydrated, user } = useAuthStore();
  const loadBranding = useTenantStore((s) => s.loadBranding);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  // Proteger rutas por rol: redirigir si el usuario accede a un prefijo que no le corresponde
  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !user) return;
    const allowedPrefix = ROLE_PREFIXES[user.role];
    if (allowedPrefix && pathname !== '/' && !pathname.startsWith(allowedPrefix)) {
      router.replace(getRoleRoute(user.role));
    }
  }, [isHydrated, isAuthenticated, user, pathname, router]);

  // Cargar branding del tenant al montar el dashboard
  useEffect(() => {
    loadBranding();
  }, [loadBranding]);

  // Mostrar loading mientras se hidrata el store
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-green-700" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  // No renderizar si no está autenticado (el redirect ya se disparó)
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="hidden lg:block">
          <AppSidebar />
        </div>
        <main className="flex-1 flex flex-col min-h-screen">
          <Header />
          <div className="flex-1 p-6">{children}</div>
          <footer className="px-6 py-3 border-t bg-white text-xs text-gray-400 flex items-center justify-between">
            <span>&copy; 2026 Mesa de Servicio TI</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Sistema Operativo
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
