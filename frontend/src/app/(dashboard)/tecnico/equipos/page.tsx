'use client';

import Link from 'next/link';
import { Monitor } from 'lucide-react';
import { useTickets } from '@/hooks/use-tickets';
import { useAuthStore } from '@/stores/auth-store';
import { STATUS_CONFIG } from '@/lib/constants';

export default function TecnicoEquiposPage() {
  const user = useAuthStore(s => s.user);
  const { data, isLoading } = useTickets({
    assigned_to: user?.id ?? 0,
    per_page: 100,
  });

  const ticketsWithAsset = (data?.data ?? []).filter(t => t.asset_id && t.asset);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Equipos vinculados a mis tickets</h1>
      <p className="text-gray-500 mb-6">Activos del inventario asociados a tus tickets asignados.</p>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50/50">
              <th className="text-left p-3 pl-6 font-medium text-gray-500 text-xs uppercase">Codigo Activo</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Nombre</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Ticket</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Categoria</th>
              <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Sede</th>
              <th className="text-left p-3 pr-6 font-medium text-gray-500 text-xs uppercase">Estado Ticket</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b"><td colSpan={6} className="p-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
              ))
            ) : !ticketsWithAsset.length ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <Monitor className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400">No hay equipos vinculados a tus tickets</p>
                  <p className="text-xs text-gray-300 mt-1">Los equipos aparecen cuando se vinculan desde el detalle de un ticket</p>
                </td>
              </tr>
            ) : (
              ticketsWithAsset.map(t => {
                const asset = t.asset!;
                const sCfg = STATUS_CONFIG[t.status as keyof typeof STATUS_CONFIG];
                return (
                  <tr key={`${t.id}-${asset.id}`} className="border-b hover:bg-gray-50/50 transition-colors">
                    <td className="p-3 pl-6">
                      <span className="font-mono font-medium text-green-700">{asset.asset_code}</span>
                    </td>
                    <td className="p-3 text-gray-900 font-medium max-w-[200px] truncate">{asset.name}</td>
                    <td className="p-3">
                      <Link href={`/tecnico/tickets/${t.id}`} className="font-mono text-green-700 hover:underline">#{t.id}</Link>
                      <p className="text-xs text-gray-500 truncate max-w-[180px]">{t.title}</p>
                    </td>
                    <td className="p-3 text-gray-600 capitalize">{asset.category}</td>
                    <td className="p-3 text-gray-600">{asset.campus || t.campus || '-'}</td>
                    <td className="p-3 pr-6">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sCfg?.color || 'bg-gray-100 text-gray-700'}`}>
                        {sCfg?.label || t.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
