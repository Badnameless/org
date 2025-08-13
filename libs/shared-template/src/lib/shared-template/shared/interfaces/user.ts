export interface User {
  user_id:           number;
  user_name:         string;
  user_email:        string;
  email_verified_at: null;
  user_photoUrl:     string;
  created_at:        Date;
  updated_at:        Date;
  deleted_at:        null;
  roles:             Role[];
  tenants:           Tenant[];
}

export interface Role {
  id:         number;
  name:       string;
  guard_name: string;
  created_at: Date;
  updated_at: Date;
  pivot:      RolePivot;
}

export interface RolePivot {
  model_type: string;
  model_id:   number;
  role_id:    number;
}

export interface Tenant {
  tenant_id:     number;
  tenant_name:   string;
  tenant_cedrnc: string;
  created_at:    Date;
  updated_at:    Date;
  plan_id:       number;
  deleted_at:    null;
  pivot:         TenantPivot;
}

export interface TenantPivot {
  user_id:   number;
  tenant_id: number;
}
