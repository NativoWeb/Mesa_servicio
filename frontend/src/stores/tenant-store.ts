'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TenantConfig, TenantBranding } from '@/types/tenant';

const DEFAULT_BRANDING: TenantBranding = {
  primary: '#1B5E20',
  primary_light: '#4CAF50',
  primary_dark: '#0D3B0D',
  accent: '#F9A825',
  sidebar_from: '#1B3A1B',
  sidebar_to: '#2E5A2E',
  background: '#FAFAFA',
  card: '#FFFFFF',
  text_primary: '#1A1A1A',
  text_secondary: '#6B7280',
};

const DEFAULT_CONFIG: TenantConfig = {
  name: 'Mesa de Servicio TI',
  short_name: 'SD',
  logo_url: null,
  favicon_url: null,
  branding: DEFAULT_BRANDING,
  features: {
    tickets: true,
    inventory: true,
    maintenance: true,
    mass_messaging: true,
    shifts: true,
    reports: true,
    sla: true,
    audit_logs: true,
  },
  campuses: [],
  ticket_categories: [],
  timezone: 'America/Bogota',
};

interface TenantState {
  config: TenantConfig;
  isLoaded: boolean;
  loadBranding: () => Promise<void>;
  isFeatureEnabled: (feature: keyof TenantConfig['features']) => boolean;
}

function applyBrandingToDOM(branding: TenantBranding) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--brand-primary', branding.primary);
  root.style.setProperty('--brand-primary-light', branding.primary_light);
  root.style.setProperty('--brand-primary-dark', branding.primary_dark);
  root.style.setProperty('--brand-accent', branding.accent);
  root.style.setProperty('--brand-sidebar-from', branding.sidebar_from);
  root.style.setProperty('--brand-sidebar-to', branding.sidebar_to);
  root.style.setProperty('--brand-background', branding.background);
  root.style.setProperty('--brand-card', branding.card);
  root.style.setProperty('--brand-text-primary', branding.text_primary);
  root.style.setProperty('--brand-text-secondary', branding.text_secondary);
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get) => ({
      config: DEFAULT_CONFIG,
      isLoaded: false,

      loadBranding: async () => {
        try {
          const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
          const domain = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
          const response = await fetch(`${baseURL}/tenant/branding?domain=${encodeURIComponent(domain)}`);

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const data = await response.json();

          const config: TenantConfig = {
            id: data.id,
            name: data.name || DEFAULT_CONFIG.name,
            short_name: data.short_name || DEFAULT_CONFIG.short_name,
            logo_url: data.logo_url ?? null,
            favicon_url: data.favicon_url ?? null,
            branding: { ...DEFAULT_BRANDING, ...data.branding },
            features: { ...DEFAULT_CONFIG.features, ...data.features },
            campuses: data.campuses || [],
            ticket_categories: data.ticket_categories || [],
            timezone: data.timezone || DEFAULT_CONFIG.timezone,
          };

          applyBrandingToDOM(config.branding);
          set({ config, isLoaded: true });
        } catch {
          // Si la API no responde, usar defaults y aplicarlos al DOM
          applyBrandingToDOM(get().config.branding);
          set({ isLoaded: true });
        }
      },

      isFeatureEnabled: (feature) => {
        return get().config.features[feature] ?? true;
      },
    }),
    {
      name: 'tenant-storage',
    }
  )
);
