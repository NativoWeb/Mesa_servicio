'use client';

import { useTenantStore } from '@/stores/tenant-store';

export function useTenant() {
  const config = useTenantStore((s) => s.config);
  const isLoaded = useTenantStore((s) => s.isLoaded);
  const isFeatureEnabled = useTenantStore((s) => s.isFeatureEnabled);

  return {
    config,
    isLoaded,
    isFeatureEnabled,
    ...config.branding,
  };
}
