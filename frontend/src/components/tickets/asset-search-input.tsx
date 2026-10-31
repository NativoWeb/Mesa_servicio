'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Monitor } from 'lucide-react';
import { useAssetSearch } from '@/hooks/use-asset-search';

interface SelectedAsset {
  id: number;
  asset_code: string;
  name: string;
  category: string;
  serial_number?: string;
  campus?: string;
}

interface AssetSearchInputProps {
  value: SelectedAsset | null;
  onChange: (asset: SelectedAsset | null) => void;
  label?: string;
}

export function AssetSearchInput({ value, onChange, label = 'Equipo relacionado' }: AssetSearchInputProps) {
  const { query, setQuery, results, loading } = useAssetSearch();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (value) {
    return (
      <div>
        <label className="block text-sm font-medium text-[var(--ink-2)] mb-1.5">{label} <span className="text-[var(--faint)] font-normal">(opcional)</span></label>
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[var(--low-bg)] border border-[var(--lima-500)]/30 rounded-xl">
          <Monitor className="w-4 h-4 text-[var(--selva-500)] shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-[var(--selva-500)]">
              [{value.asset_code}] {value.name}
            </span>
            {value.serial_number && (
              <span className="text-xs text-[var(--selva-500)] ml-2">Serial: {value.serial_number}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-[var(--selva-500)] hover:text-[var(--crit)] transition-colors p-0.5 rounded"
            aria-label="Quitar equipo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-[var(--ink-2)] mb-1.5">{label} <span className="text-[var(--faint)] font-normal">(opcional)</span></label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--faint)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => { if (query.trim().length >= 2) setOpen(true); }}
          placeholder="Buscar por nombre, codigo o serial..."
          className="w-full pl-9 pr-4 py-2.5 bg-[var(--canvas)] border border-[var(--line)] rounded-xl text-sm outline-none focus:ring-2 focus:shadow-[var(--focus)] focus:border-[var(--lima-500)]"
        />
        {loading && (
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin h-4 w-4 text-[var(--faint)]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
      </div>

      {open && query.trim().length >= 2 && (
        <div className="absolute z-20 mt-1 w-full bg-[var(--surface)] border border-[var(--line)] rounded-xl shadow-lg max-h-60 overflow-auto">
          {loading && results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[var(--faint)]">Buscando...</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[var(--faint)]">No se encontraron equipos</div>
          ) : (
            results.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => {
                  onChange(asset);
                  setQuery('');
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-[var(--low-bg)] transition-colors border-b border-[var(--line)] last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-[var(--faint)] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--ink)] truncate">
                      <span className="font-mono text-[var(--selva-500)]">[{asset.asset_code}]</span> {asset.name}
                    </p>
                    <p className="text-xs text-[var(--muted)] truncate">
                      {asset.category}
                      {asset.serial_number ? ` — Serial: ${asset.serial_number}` : ''}
                      {asset.campus ? ` — ${asset.campus}` : ''}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
