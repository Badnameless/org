export interface Ncf {
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
  deleted_at:            null;
  tenant_name:           string;
  tenant_cedrnc:         string;
  plan_id:               number;
  tipoNcf_code:          number;
  tipoNcf_name:          string;
}
