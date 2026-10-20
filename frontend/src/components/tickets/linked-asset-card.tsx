'use client';

import Link from 'next/link';
import { Monitor } from 'lucide-react';
import { TicketAsset } from '@/types/ticket';

interface LinkedAssetCardProps {
  asset: TicketAsset;
  linkTo?: string;
}

export function LinkedAssetCard({ asset, linkTo }: LinkedAssetCardProps) {
  const content = (
    <div className="bg-white rounded-xl border p-5">
      <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
        <Monitor className="w-4 h-4 text-green-700" />
        Equipo Vinculado
      </h3>
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium text-gray-900">
            <span className="font-mono text-green-700">[{asset.asset_code}]</span> {asset.name}
          </p>
        </div>
        {(asset.serial_number || asset.serial) && (
          <p className="text-xs text-gray-500">Serial: {asset.serial_number || asset.serial}</p>
        )}
        {asset.campus && (
          <p className="text-xs text-gray-500">Sede: {asset.campus}</p>
        )}
        <p className="text-xs text-gray-400 capitalize">{asset.category}</p>
      </div>
      {linkTo && (
        <p className="text-xs text-green-700 mt-3 font-medium">Ver detalle del equipo →</p>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link href={linkTo} className="block hover:ring-2 hover:ring-green-200 rounded-xl transition-all">
        {content}
      </Link>
    );
  }

  return content;
}
