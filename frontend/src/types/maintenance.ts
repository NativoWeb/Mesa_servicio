import { User } from './user';
import { Asset } from './asset';

export type MaintenanceType = 'preventive' | 'corrective' | 'update' | 'cleaning';
export type MaintenanceStatus = 'completed' | 'partial' | 'escalated';

export interface Maintenance {
  id: number;
  asset_id: number;
  technician_id: number;
  type: MaintenanceType;
  description: string | null;
  started_at: string | null;
  finished_at: string | null;
  duration_minutes: number | null;
  final_status: string | null;
  next_maintenance_date: string | null;
  observations: string | null;
  status: MaintenanceStatus | null;
  created_at: string;
  updated_at: string;
  technician?: User;
  asset?: Asset;
}
