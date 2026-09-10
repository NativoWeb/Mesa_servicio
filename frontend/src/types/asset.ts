import { User } from './user';
import { Maintenance } from './maintenance';

export type AssetStatus = 'new' | 'operational' | 'damaged' | 'decommissioned' | 'retired';
export type AssetCategory = 'pc' | 'laptop' | 'printer' | 'server' | 'router' | 'switch' | 'monitor' | 'projector' | 'other';

export interface Asset {
  id: number;
  asset_code: string;
  name: string;
  category: AssetCategory;
  brand: string;
  model: string;
  serial: string;
  purchase_date: string;
  campus: string;
  floor: string;
  location: string;
  holder_id: number;
  status: AssetStatus;
  specs: Record<string, string>;
  warranty_expiry: string | null;
  next_maintenance: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  holder?: User;
  maintenances?: Maintenance[];
}
