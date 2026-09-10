"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/lider": "Panel de Control",
  "/lider/tickets": "Todos los Tickets",
  "/lider/asignacion": "Asignación de tickets y turnos",
  "/lider/inventario": "Inventario de Activos TI",
  "/lider/mensajeria": "Mensajería Masiva",
  "/lider/reportes": "Reportes y Métricas",
  "/lider/usuarios": "Usuarios y Roles",
  "/tecnico": "Mi Panel",
  "/tecnico/tickets": "Mis Tickets",
  "/tecnico/equipos": "Equipos relacionados",
  "/tecnico/turno": "Mi Turno",
  "/usuario": "Inicio",
  "/usuario/tickets": "Mis Tickets",
  "/usuario/tickets/nuevo": "Nueva Solicitud",
  "/cuentadante": "Dashboard Cuentadante",
  "/cuentadante/equipos": "Mis Equipos",
  "/inventario": "Inventario de Activos",
  "/inventario/nuevo": "Registrar nuevo equipo",
  "/inventario/mantenimiento": "Mantenimientos",
  "/admin": "Panel de Administración",
  "/admin/usuarios": "Gestión de Usuarios",
  "/admin/roles": "Roles y Permisos",
  "/admin/sla": "Configuración SLA",
  "/admin/configuracion": "Configuración del Sistema",
  "/admin/logs": "Logs de Auditoría",
  "/admin/reportes": "Reportes",
};

export function Header() {
  const pathname = usePathname();
  const campus = "Bucaramanga";

  return (
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-500">
          Sede: <span className="font-medium text-gray-700">{campus}</span>
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <span className="text-gray-500">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <span className="text-gray-500">⚙️</span>
        </button>
        <div className="flex items-center gap-2 pl-3 border-l">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium text-sm">
            CM
          </div>
        </div>
      </div>
    </header>
  );
}
