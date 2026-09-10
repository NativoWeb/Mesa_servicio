import { User } from './user';

export type MaintenanceType = 'preventive' | 'corrective' | 'emergency';
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Maintenance {
  id: number;
  asset_id: number;
  technician_id: number;
  type: MaintenanceType;
  status: MaintenanceStatus;
  description: string;
  findings: string | null;
  actions_taken: string | null;
  scheduled_date: string;
  completed_date: string | null;
  cost: number | null;
  created_at: string;
  updated_at: string;
  technician?: User;
}
