
export interface User {
  user_id:           number;
  user_name:         string;
  user_email:        string;
  email_verified_at: null;
  user_photoUrl:     null;
  roles:             Roles;
  tenants:           Tenant[];
}

export interface Roles {
  name: string[];
}

export interface Tenant {
  tenant_id:     number;
  tenant_name:   string;
  tenant_cedrnc: string;
  created_at:    Date;
  updated_at:    Date;
  plan_id:       number;
  pivot:         Pivot;
  transncfs:     Transncf[];
}

export interface Pivot {
  user_id:   number;
  tenant_id: number;
}

export interface Transncf {
  transncf_id:           number;
  tenant_id:             number;
  tipoNcf_id:            number;
  transncf_encf:         string;
  transncf_fechaemision: Date;
  transncf_rnccomprador: string;
  transncf_codigoqr:     string;
  transncf_urlxml:       string;
  transncf_valor:        string;
  transncf_itbis:        string;
  transncf_montototal:   string;
  transncf_status:       number;
  created_at:            Date;
  updated_at:            Date;
  tipo_ncf:              TipoNcf;
}

export interface TipoNcf {
  tipoNcf_id:   number;
  tipoNcf_code: number;
  tipoNcf_name: string;
}
