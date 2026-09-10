export type UserRole = 'admin' | 'it_leader' | 'technician' | 'inventory_manager' | 'end_user' | 'asset_holder';

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
}

export interface Role {
  id: number;
  name: UserRole;
  guard_name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  campus: string;
  department?: string | null;
  role: UserRole;
  is_active: boolean;
  avatar_url?: string | null;
  roles?: Role[];
  permissions?: Permission[];
  created_at: string;
  updated_at?: string;
}
