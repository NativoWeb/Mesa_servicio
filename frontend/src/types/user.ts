export type UserRole = 'admin' | 'it_leader' | 'technician' | 'inventory_manager' | 'end_user' | 'asset_holder';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  campus: string;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}
