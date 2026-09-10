import { User } from './user';

export type ShiftType = 'morning' | 'afternoon' | 'night';

export interface Shift {
  id: number;
  technician_id: number;
  date: string;
  shift_type: ShiftType;
  campus: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  technician?: User;
}
