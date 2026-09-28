export interface TenantBranding {
  primary: string;
  primary_light: string;
  primary_dark: string;
  accent: string;
  sidebar_from: string;
  sidebar_to: string;
  background: string;
  card: string;
  text_primary: string;
  text_secondary: string;
}

export interface TenantFeatures {
  tickets: boolean;
  inventory: boolean;
  maintenance: boolean;
  mass_messaging: boolean;
  shifts: boolean;
  reports: boolean;
  sla: boolean;
  audit_logs: boolean;
}

export interface TenantConfig {
  id?: string;
  name: string;
  short_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  branding: TenantBranding;
  features: TenantFeatures;
  campuses: string[];
  ticket_categories: string[];
  timezone: string;
}
