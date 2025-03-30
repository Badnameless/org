export interface Plan {
  planDetail_seq:       number;
  plan_id:              number;
  planDetail_from:      string;
  planDetail_to:        string;
  planDetail_priceXdoc: string;
  planDetail_tolerance: string;
  created_at:           Date;
  updated_at:           Date;
  plan:                 PlanClass;
}

export interface PlanClass {
  plan_id:     number;
  plan_name:   string;
  plan_status: number;
  created_at:  Date;
  updated_at:  Date;
}

