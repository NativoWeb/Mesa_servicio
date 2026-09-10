"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const pathLabels: Record<string, string> = {
  lider: "Líder TIC",
  tecnico: "Técnico",
  usuario: "Usuario",
  cuentadante: "Cuentadante",
  inventario: "Inventario",
  admin: "Administración",
  tickets: "Tickets",
  asignacion: "Asignación",
  mensajeria: "Mensajería",
  reportes: "Reportes",
  usuarios: "Usuarios",
  equipos: "Equipos",
  turno: "Mi Turno",
  notificaciones: "Notificaciones",
  nuevo: "Nuevo",
  mantenimiento: "Mantenimiento",
  roles: "Roles",
  sla: "SLA",
  configuracion: "Configuración",
  logs: "Logs",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  return (
    <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1">
      <Link href="/" className="hover:text-gray-700">Inicio</Link>
      {segments.map((segment, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        const label = pathLabels[segment] || segment;
        return (
          <span key={href} className="flex items-center gap-1">
            <span className="text-gray-300">›</span>
            {isLast ? (
              <span className="text-gray-700 font-medium">{label}</span>
            ) : (
              <Link href={href} className="hover:text-gray-700">{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
