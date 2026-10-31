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
    <div className="bg-[var(--surface)] rounded-xl border p-5">
      <h3 className="font-semibold text-[var(--ink)] text-sm mb-3 flex items-center gap-2">
        <Monitor className="w-4 h-4 text-[var(--selva-500)]" />
        Equipo Vinculado
      </h3>
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium text-[var(--ink)]">
            <span className="font-mono text-[var(--selva-500)]">[{asset.asset_code}]</span> {asset.name}
          </p>
        </div>
        {(asset.serial_number || asset.serial) && (
          <p className="text-xs text-[var(--muted)]">Serial: {asset.serial_number || asset.serial}</p>
        )}
        {asset.campus && (
          <p className="text-xs text-[var(--muted)]">Sede: {asset.campus}</p>
        )}
        <p className="text-xs text-[var(--faint)] capitalize">{asset.category}</p>
      </div>
      {linkTo && (
        <p className="text-xs text-[var(--selva-500)] mt-3 font-medium">Ver detalle del equipo →</p>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link href={linkTo} className="block hover:ring-2 hover:ring-[var(--lima-500)]/30 rounded-xl transition-all">
        {content}
      </Link>
    );
  }

  return content;
}
