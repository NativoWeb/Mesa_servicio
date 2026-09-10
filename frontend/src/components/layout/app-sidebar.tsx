"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore, ROLE_LABELS, getRoleRoute } from "@/stores/auth-store";
import { UserRole } from "@/types/user";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const navByRole: Record<string, NavGroup[]> = {
  it_leader: [
    { group: "Principal", items: [{ label: "Principal", href: "/lider", icon: "📊" }] },
    { group: "Gestión", items: [
      { label: "Todos los tickets", href: "/lider/tickets", icon: "🎫" },
      { label: "Sin asignar", href: "/lider/tickets?filter=unassigned", icon: "⚠️" },
      { label: "Escalonados", href: "/lider/tickets?filter=escalated", icon: "🔺" },
      { label: "Por sede", href: "/lider/tickets?filter=campus", icon: "🏢" },
    ]},
    { group: "Asignación", items: [
      { label: "Asignar / Reasignar", href: "/lider/asignacion", icon: "👥" },
      { label: "Calendario de turnos", href: "/lider/asignacion?tab=calendar", icon: "📅" },
      { label: "Carga por técnico", href: "/lider/asignacion?tab=workload", icon: "📈" },
    ]},
    { group: "Inventario", items: [
      { label: "Lista de activos", href: "/lider/inventario", icon: "💻" },
      { label: "Mantenimiento", href: "/lider/inventario?tab=maintenance", icon: "🔧" },
    ]},
    { group: "Comunicación", items: [
      { label: "Mensajería masiva", href: "/lider/mensajeria", icon: "📨" },
      { label: "Plantillas", href: "/lider/mensajeria?tab=templates", icon: "📝" },
    ]},
    { group: "Analítica", items: [
      { label: "Reportes", href: "/lider/reportes", icon: "📊" },
      { label: "Usuarios y roles", href: "/lider/usuarios", icon: "👤" },
    ]},
  ],
  technician: [
    { group: "Principal", items: [{ label: "Mi panel", href: "/tecnico", icon: "📊" }] },
    { group: "Mis Tickets", items: [
      { label: "Abiertos", href: "/tecnico/tickets?status=open", icon: "📂" },
      { label: "En progreso", href: "/tecnico/tickets?status=in_progress", icon: "⏳" },
      { label: "Pendientes", href: "/tecnico/tickets?status=pending", icon: "⏸️" },
      { label: "Cerrados", href: "/tecnico/tickets?status=closed", icon: "✅" },
    ]},
    { group: "Inventario", items: [
      { label: "Equipos relacionados", href: "/tecnico/equipos", icon: "💻" },
    ]},
    { group: "Mi Cuenta", items: [
      { label: "Mi turno", href: "/tecnico/turno", icon: "📅" },
    ]},
  ],
  end_user: [
    { group: "Principal", items: [
      { label: "Inicio", href: "/usuario", icon: "🏠" },
      { label: "Crear ticket", href: "/usuario/tickets/nuevo", icon: "➕" },
    ]},
    { group: "Mis Solicitudes", items: [
      { label: "Abiertos", href: "/usuario/tickets?status=open", icon: "📂" },
      { label: "En progreso", href: "/usuario/tickets?status=in_progress", icon: "⏳" },
      { label: "Cerrados", href: "/usuario/tickets?status=closed", icon: "✅" },
    ]},
    { group: "Cuenta", items: [
      { label: "Notificaciones", href: "/usuario/notificaciones", icon: "🔔" },
    ]},
  ],
  asset_holder: [
    { group: "Mis Equipos", items: [
      { label: "Mis equipos", href: "/cuentadante", icon: "💻" },
      { label: "Hoja de vida", href: "/cuentadante/equipos", icon: "📋" },
    ]},
    { group: "Alertas", items: [
      { label: "Mantenimientos próximos", href: "/cuentadante?tab=maintenance", icon: "🔧" },
      { label: "Cambios de responsable", href: "/cuentadante?tab=changes", icon: "🔄" },
    ]},
    { group: "Cuenta", items: [
      { label: "Notificaciones", href: "/cuentadante/notificaciones", icon: "🔔" },
    ]},
  ],
  inventory_manager: [
    { group: "Principal", items: [
      { label: "Dashboard inventario", href: "/inventario", icon: "📊" },
    ]},
    { group: "Activos TI", items: [
      { label: "Lista de activos", href: "/inventario", icon: "💻" },
      { label: "Registrar nuevo equipo", href: "/inventario/nuevo", icon: "➕" },
      { label: "Dar de baja activo", href: "/inventario?action=decommission", icon: "❌" },
    ]},
    { group: "Mantenimiento", items: [
      { label: "Registrar mantenimiento", href: "/inventario/mantenimiento/nuevo", icon: "🔧" },
      { label: "Calendario", href: "/inventario/mantenimiento", icon: "📅" },
    ]},
    { group: "Responsables", items: [
      { label: "Cuentadantes", href: "/inventario?tab=holders", icon: "👤" },
    ]},
    { group: "Analítica", items: [
      { label: "Activos por sede", href: "/inventario?tab=by-campus", icon: "🏢" },
      { label: "Historial mantenimientos", href: "/inventario/mantenimiento", icon: "📜" },
    ]},
  ],
  admin: [
    { group: "Principal", items: [
      { label: "Dashboard global", href: "/admin", icon: "📊" },
    ]},
    { group: "Acceso y Roles", items: [
      { label: "Usuarios", href: "/admin/usuarios", icon: "👤" },
      { label: "Roles", href: "/admin/roles", icon: "🔑" },
      { label: "LDAP", href: "/admin/configuracion?tab=ldap", icon: "🔗" },
    ]},
    { group: "Multitenancy", items: [
      { label: "Tenants", href: "/admin/tenants", icon: "🏛️" },
    ]},
    { group: "Sistema", items: [
      { label: "SLA", href: "/admin/sla", icon: "⏱️" },
      { label: "SMTP", href: "/admin/configuracion?tab=smtp", icon: "📧" },
      { label: "Plantillas", href: "/admin/configuracion?tab=templates", icon: "📝" },
    ]},
    { group: "Seguridad", items: [
      { label: "Logs", href: "/admin/logs", icon: "📜" },
      { label: "Backup", href: "/admin/configuracion?tab=backup", icon: "💾" },
    ]},
    { group: "Todo el Sistema", items: [
      { label: "Tickets", href: "/lider/tickets", icon: "🎫" },
      { label: "Inventario", href: "/lider/inventario", icon: "💻" },
      { label: "Reportes", href: "/admin/reportes", icon: "📊" },
    ]},
  ],
};

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const role = user?.role || "end_user";
  const nav = navByRole[role] || navByRole.end_user;
  const roleLabel = ROLE_LABELS[role as UserRole] || role;
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-green-950 to-green-900 text-white flex flex-col sticky top-0">
      {/* Header */}
      <div className="p-4 border-b border-green-800/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm font-bold">
            SD
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">Service Desk</p>
            <p className="text-[10px] text-green-300 uppercase tracking-wider">
              Mesa de Servicio TI
            </p>
          </div>
        </div>
        <div className="mt-3 px-2 py-1 bg-green-800/50 rounded text-xs text-green-200 inline-block uppercase">
          {roleLabel}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto text-sm">
        {nav.map((group) => (
          <div key={group.group}>
            <p className="text-[10px] uppercase tracking-wider text-green-400/70 mb-1 px-2">
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const baseHref = item.href.split("?")[0];
                const isActive =
                  pathname === baseHref || pathname.startsWith(baseHref + "/");
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                      isActive
                        ? "bg-green-700/50 text-white"
                        : "text-green-200/80 hover:bg-green-800/40 hover:text-white"
                    }`}
                  >
                    <span className="text-xs">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
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
      <div className="p-3 border-t border-green-800/50">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-xs font-bold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{user?.name}</p>
            <p className="text-[10px] text-green-300 truncate">{roleLabel}</p>
          </div>
          <button className="text-green-400/60 hover:text-white transition-colors text-xs p-1">
            ⚙️
          </button>
        </div>
      </div>
    </aside>
  );
}
