import { User } from './user';

export type ShiftStatus = 'scheduled' | 'active' | 'completed';

export interface Shift {
  id: number;
  technician_id: number;
  date: string;
  start_time: string;
  end_time: string;
  campus: string;
  building: string | null;
  status: ShiftStatus;
  created_at: string;
  updated_at: string;
  technician?: User;
}
