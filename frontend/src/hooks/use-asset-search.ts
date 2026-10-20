'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import api from '@/lib/api';

interface AssetSearchResult {
  id: number;
  asset_code: string;
  name: string;
  category: string;
  serial_number?: string;
  serial?: string;
  campus?: string;
}

export function useAssetSearch(debounceMs = 300) {
  const [query, setQueryState] = useState('');
  const [results, setResults] = useState<AssetSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setQuery = useCallback((value: string) => {
    setQueryState(value);

    if (timerRef.current) clearTimeout(timerRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setLoading(false);
      abortRef.current?.abort();
      return;
    }

    setLoading(true);

    timerRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const { data } = await api.get('/assets', {
          params: { search: value.trim(), per_page: 10 },
          signal: controller.signal,
        });
        const items = data?.data ?? data ?? [];
        setResults(
          (Array.isArray(items) ? items : []).map((a: AssetSearchResult) => ({
            id: a.id,
            asset_code: a.asset_code,
            name: a.name,
            category: a.category,
            serial_number: a.serial_number || a.serial,
            campus: a.campus,
          }))
        );
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);
  }, [debounceMs]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      abortRef.current?.abort();
    };
  }, []);

  return { query, setQuery, results, loading };
}
