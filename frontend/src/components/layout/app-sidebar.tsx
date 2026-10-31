"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore, ROLE_LABELS, getRoleRoute } from "@/stores/auth-store";
import { useTenantStore } from "@/stores/tenant-store";
import { UserRole } from "@/types/user";
import type { TenantFeatures } from "@/types/tenant";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Ticket,
  AlertTriangle,
  ArrowUpFromLine,
  Building2,
  Users,
  Calendar,
  TrendingUp,
  Monitor,
  Wrench,
  Send,
  FileText,
  User,
  FolderOpen,
  Clock,
  PauseCircle,
  CheckCircle,
  Home,
  PlusCircle,
  Bell,
  ClipboardList,
  RefreshCw,
  KeyRound,
  Link as LinkIcon,
  Landmark,
  Timer,
  Mail,
  ScrollText,
  HardDrive,
  XCircle,
  Settings,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const navByRole: Record<string, NavGroup[]> = {
  it_leader: [
    { group: "Principal", items: [{ label: "Principal", href: "/lider", icon: LayoutDashboard }] },
    { group: "Gestión", items: [
      { label: "Todos los tickets", href: "/lider/tickets", icon: Ticket },
      { label: "Sin asignar", href: "/lider/tickets?filter=unassigned", icon: AlertTriangle },
      { label: "Escalonados", href: "/lider/tickets?filter=escalated", icon: ArrowUpFromLine },
      { label: "Por sede", href: "/lider/tickets?filter=campus", icon: Building2 },
    ]},
    { group: "Asignación", items: [
      { label: "Asignar / Reasignar", href: "/lider/asignacion", icon: Users },
      { label: "Calendario de turnos", href: "/lider/asignacion?tab=calendar", icon: Calendar },
      { label: "Carga por tecnico", href: "/lider/asignacion?tab=workload", icon: TrendingUp },
    ]},
    { group: "Inventario", items: [
      { label: "Lista de activos", href: "/lider/inventario", icon: Monitor },
      { label: "Mantenimiento", href: "/lider/inventario?tab=maintenance", icon: Wrench },
    ]},
    { group: "Comunicación", items: [
      { label: "Mensajeria masiva", href: "/lider/mensajeria", icon: Send },
      { label: "Plantillas", href: "/lider/mensajeria?tab=templates", icon: FileText },
    ]},
    { group: "Analítica", items: [
      { label: "Reportes", href: "/lider/reportes", icon: LayoutDashboard },
      { label: "Usuarios y roles", href: "/lider/usuarios", icon: User },
    ]},
  ],
  technician: [
    { group: "Principal", items: [{ label: "Mi panel", href: "/tecnico", icon: LayoutDashboard }] },
    { group: "Mis Tickets", items: [
      { label: "Abiertos", href: "/tecnico/tickets?status=open", icon: FolderOpen },
      { label: "En progreso", href: "/tecnico/tickets?status=in_progress", icon: Clock },
      { label: "Pendientes", href: "/tecnico/tickets?status=pending", icon: PauseCircle },
      { label: "Cerrados", href: "/tecnico/tickets?status=closed", icon: CheckCircle },
    ]},
    { group: "Inventario", items: [
      { label: "Equipos relacionados", href: "/tecnico/equipos", icon: Monitor },
    ]},
    { group: "Mi Cuenta", items: [
      { label: "Mi turno", href: "/tecnico/turno", icon: Calendar },
    ]},
  ],
  end_user: [
    { group: "Principal", items: [
      { label: "Inicio", href: "/usuario", icon: Home },
      { label: "Crear ticket", href: "/usuario/tickets/nuevo", icon: PlusCircle },
    ]},
    { group: "Mis Solicitudes", items: [
      { label: "Abiertos", href: "/usuario/tickets?status=open", icon: FolderOpen },
      { label: "En progreso", href: "/usuario/tickets?status=in_progress", icon: Clock },
      { label: "Cerrados", href: "/usuario/tickets?status=closed", icon: CheckCircle },
    ]},
    { group: "Cuenta", items: [
      { label: "Notificaciones", href: "/usuario/notificaciones", icon: Bell },
    ]},
  ],
  asset_holder: [
    { group: "Mis Equipos", items: [
      { label: "Mis equipos", href: "/cuentadante", icon: Monitor },
      { label: "Hoja de vida", href: "/cuentadante/equipos", icon: ClipboardList },
    ]},
    { group: "Alertas", items: [
      { label: "Mantenimientos proximos", href: "/cuentadante?tab=maintenance", icon: Wrench },
      { label: "Cambios de responsable", href: "/cuentadante?tab=changes", icon: RefreshCw },
    ]},
    { group: "Cuenta", items: [
      { label: "Notificaciones", href: "/cuentadante/notificaciones", icon: Bell },
    ]},
  ],
  inventory_manager: [
    { group: "Principal", items: [
      { label: "Dashboard inventario", href: "/inventario", icon: LayoutDashboard },
    ]},
    { group: "Activos TI", items: [
      { label: "Lista de activos", href: "/inventario", icon: Monitor },
      { label: "Registrar nuevo equipo", href: "/inventario/nuevo", icon: PlusCircle },
      { label: "Dar de baja activo", href: "/inventario?action=decommission", icon: XCircle },
    ]},
    { group: "Mantenimiento", items: [
      { label: "Registrar mantenimiento", href: "/inventario/mantenimiento/nuevo", icon: Wrench },
      { label: "Calendario", href: "/inventario/mantenimiento", icon: Calendar },
    ]},
    { group: "Responsables", items: [
      { label: "Cuentadantes", href: "/inventario?tab=holders", icon: User },
    ]},
    { group: "Analítica", items: [
      { label: "Activos por sede", href: "/inventario?tab=by-campus", icon: Building2 },
      { label: "Historial mantenimientos", href: "/inventario/mantenimiento", icon: ScrollText },
    ]},
  ],
  admin: [
    { group: "Principal", items: [
      { label: "Dashboard global", href: "/admin", icon: LayoutDashboard },
    ]},
    { group: "Acceso y Roles", items: [
      { label: "Usuarios", href: "/admin/usuarios", icon: User },
      { label: "Roles", href: "/admin/roles", icon: KeyRound },
      { label: "LDAP", href: "/admin/configuracion?tab=ldap", icon: LinkIcon },
    ]},
    { group: "Multitenancy", items: [
      { label: "Tenants", href: "/admin/tenants", icon: Landmark },
    ]},
    { group: "Sistema", items: [
      { label: "SLA", href: "/admin/sla", icon: Timer },
      { label: "SMTP", href: "/admin/configuracion?tab=smtp", icon: Mail },
      { label: "Plantillas", href: "/admin/configuracion?tab=templates", icon: FileText },
    ]},
    { group: "Seguridad", items: [
      { label: "Logs", href: "/admin/logs", icon: ScrollText },
      { label: "Backup", href: "/admin/configuracion?tab=backup", icon: HardDrive },
    ]},
    { group: "Todo el Sistema", items: [
      { label: "Tickets", href: "/lider/tickets", icon: Ticket },
      { label: "Inventario", href: "/lider/inventario", icon: Monitor },
      { label: "Reportes", href: "/admin/reportes", icon: LayoutDashboard },
    ]},
  ],
};

// Mapeo de grupos de navegacion a features del tenant
const GROUP_FEATURE_MAP: Record<string, keyof TenantFeatures> = {
  "Inventario": "inventory",
  "Activos TI": "inventory",
  "Responsables": "inventory",
  "Mis Equipos": "inventory",
  "Mantenimiento": "maintenance",
  "Comunicación": "mass_messaging",
  "Mi turno": "shifts",
  "Analítica": "reports",
  "Seguridad": "audit_logs",
};

// Mapeo de items individuales a features
const ITEM_FEATURE_MAP: Record<string, keyof TenantFeatures> = {
  "Inventario": "inventory",
  "Lista de activos": "inventory",
  "Registrar nuevo equipo": "inventory",
  "Dar de baja activo": "inventory",
  "Equipos relacionados": "inventory",
  "Hoja de vida": "inventory",
  "Mantenimientos proximos": "maintenance",
  "Registrar mantenimiento": "maintenance",
  "Calendario": "maintenance",
  "Historial mantenimientos": "maintenance",
  "Mensajeria masiva": "mass_messaging",
  "Plantillas": "mass_messaging",
  "Mi turno": "shifts",
  "Calendario de turnos": "shifts",
  "Reportes": "reports",
  "SLA": "sla",
  "Logs": "audit_logs",
};

export function AppSidebar() {
  return (
    <Suspense fallback={null}>
      <AppSidebarInner />
    </Suspense>
  );
}

function AppSidebarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const config = useTenantStore((s) => s.config);
  const isFeatureEnabled = useTenantStore((s) => s.isFeatureEnabled);
  const role = user?.role || "end_user";
  const rawNav = navByRole[role] || navByRole.end_user;
  const roleLabel = ROLE_LABELS[role as UserRole] || role;
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";
  const logoInitials = config.short_name
    ? config.short_name.slice(0, 2).toUpperCase()
    : "SD";
  const currentSearch = searchParams.toString();

  // Filtrar navegacion segun features habilitadas del tenant
  const nav = rawNav
    .map((group) => {
      const groupFeature = GROUP_FEATURE_MAP[group.group];
      if (groupFeature && !isFeatureEnabled(groupFeature)) {
        return null;
      }
      const filteredItems = group.items.filter((item) => {
        const itemFeature = ITEM_FEATURE_MAP[item.label];
        return !itemFeature || isFeatureEnabled(itemFeature);
      });
      if (filteredItems.length === 0) return null;
      return { ...group, items: filteredItems };
    })
    .filter(Boolean) as NavGroup[];

  return (
    <aside
      className="w-[272px] min-h-screen text-white flex flex-col sticky top-0 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0f3d2b, #08261b)' }}
    >
      {/* Decorative glow */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-48 h-48"
        style={{ background: 'radial-gradient(circle at 100% 100%, rgba(184,212,50,.16), transparent 65%)' }}
      />

      {/* Header — brand */}
      <div style={{ padding: '20px 20px 14px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
        <div className="flex items-center gap-3">
          {config.logo_url ? (
            <img
              src={config.logo_url}
              alt={config.short_name}
              className="w-10 h-10 object-contain"
              style={{ borderRadius: '11px' }}
            />
          ) : (
            <div
              className="w-10 h-10 flex items-center justify-center font-[800] text-[15px]"
              style={{ background: '#b8d432', color: '#0c3324', borderRadius: '11px', letterSpacing: '-0.04em', boxShadow: '0 6px 18px -6px rgba(184,212,50,.6)' }}
            >
              {logoInitials}
            </div>
          )}
          <div>
            <p className="text-[15px] font-bold leading-tight text-white">{config.short_name || 'SD'}</p>
            <p className="text-[12px]" style={{ color: '#9fbcab' }}>
              {config.name}
            </p>
          </div>
        </div>
        <div
          className="mt-2.5 inline-flex items-center gap-1.5"
          style={{
            background: 'rgba(184,212,50,.14)',
            color: 'var(--lima-400)',
            border: '1px solid rgba(184,212,50,.28)',
            borderRadius: '99px',
            padding: '4px 10px',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          <i style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--lima-500)', boxShadow: '0 0 0 3px rgba(184,212,50,.2)', display: 'inline-block' }} />
          {roleLabel}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto relative z-10" style={{ padding: '6px 12px 20px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,.15) transparent' }}>
        {nav.map((group) => (
          <div key={group.group} style={{ marginTop: 14 }}>
            <span className="block" style={{ padding: '0 10px 6px', fontSize: '11.5px', fontWeight: 600, color: '#7f9e8c', letterSpacing: '0.02em' }}>
              {group.group}
            </span>
            <div>
              {group.items.map((item) => {
                const [itemPath, itemQuery] = item.href.split("?");
                let isActive: boolean;
                if (itemQuery) {
                  isActive = pathname === itemPath && currentSearch === itemQuery;
                } else {
                  const pathMatches = pathname === itemPath || pathname.startsWith(itemPath + "/");
                  const siblingWithQueryMatches = group.items.some((sibling) => {
                    const [sibPath, sibQuery] = sibling.href.split("?");
                    return sibQuery && sibPath === itemPath && currentSearch === sibQuery;
                  });
                  isActive = pathMatches && !siblingWithQueryMatches;
                }
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className="flex items-center relative"
                    style={{
                      gap: '11px',
                      padding: '9px 10px',
                      margin: '1px 0',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: isActive ? 650 : 500,
                      background: isActive ? 'rgba(184,212,50,.14)' : undefined,
                      color: isActive ? '#ffffff' : '#c9dbcf',
                      transition: 'background .18s, color .18s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,.06)';
                        e.currentTarget.style.color = '#fff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = '';
                        e.currentTarget.style.color = '#c9dbcf';
                      }
                    }}
                  >
                    {isActive && (
                      <span
                        className="absolute"
                        style={{ left: '-12px', top: '8px', bottom: '8px', width: '4px', background: 'var(--lima-500)', borderRadius: '0 4px 4px 0' }}
                      />
                    )}
                    <item.icon
                      className="w-[18px] h-[18px] shrink-0"
                      style={{ color: isActive ? 'var(--lima-500)' : undefined }}
                    />
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span
                        className="ml-auto"
                        style={{ minWidth: 22, height: 20, padding: '0 6px', borderRadius: '99px', background: 'var(--crit)', color: '#fff', fontSize: '11.5px', fontWeight: 700, display: 'grid', placeItems: 'center' }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="relative z-10 flex items-center" style={{ padding: '14px 16px 18px', borderTop: '1px solid rgba(255,255,255,.07)', gap: '10px' }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: 'rgba(255,255,255,.1)' }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13.5px] font-bold text-white truncate">{user?.name}</p>
            <p className="text-[12px] truncate" style={{ color: '#8fae9c' }}>{roleLabel}</p>
          </div>
          {role === 'admin' && (
            <button
              onClick={() => router.push('/admin/configuracion')}
              className="transition-colors p-1"
              style={{ color: 'rgba(255,255,255,.4)', background: 'rgba(255,255,255,.06)', borderRadius: '8px' }}
              title="Configuracion"
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,.4)'; }}
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
      </div>
    </aside>
  );
}
