export interface Permission {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  is_system: boolean;
  permissions: Permission[];
  users_count: number;
}

export type GroupedPermissions = Record<string, Permission[]>;
