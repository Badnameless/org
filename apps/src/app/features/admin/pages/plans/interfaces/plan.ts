export interface Plan {
  plan_name:   string;
  planDetail_seq:       number;
  plan_id:              number;
  planDetail_from:      string;
  planDetail_to:        string;
  planDetail_priceXdoc: string;
  planDetail_tolerance: string;
  created_at:           Date;
  updated_at:           Date;
  plan_status: number;
}

