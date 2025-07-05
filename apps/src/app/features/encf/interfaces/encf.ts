export interface Ncf {
  current_page:   number;
  data:           Datum[];
  first_page_url: string;
  from:           number;
  last_page:      number;
  last_page_url:  string;
  links:          Link[];
  next_page_url:  string;
  path:           string;
  per_page:       number;
  prev_page_url:  null;
  to:             number;
  total:          number;
}

export interface Datum {
  transncf_id:           number;
  tenant_id:             number;
  tipoNcf_id:            number;
  transncf_encf:         string;
  transncf_fechaemision: Date;
  transncf_rnccomprador: string;
  transncf_valor:        string;
  transncf_itbis:        string;
  transncf_montototal:   string;
  transncf_status:       number;
  created_at:            Date;
  updated_at:            Date;
  deleted_at:            null;
  tenant_cedrnc:         string;
  tipoNcf_code:          number;
  tipoNcf_name:          string;
}

export interface Link {
  url:    null | string;
  label:  string;
  active: boolean;
}
