export class SpareLubeJob {
  success?: boolean;
  data?: string;
  message?:string;
  lubedata?: LubeData[];
  sparedata?: SpareData[];
  jobdata?: JobData[];
  total_quantity?:number;
  total_spares_amount?:number;
  total_lubes_amount?:number;
  total_jobs_amount?:number;
  total_quantity_of_inven?:number;
  has_next?: boolean;
  page_count?: string;
  previous_page?: string;
  next_page?: string;
}

export class LubeData{
  id?: string;
  workshop_id?: string;
  is_master?: string;
  part_number?: string;
  part_name?: string;
  part_company?: string;
  unit?: string;
  category?: string;
  spare_subcategory?: string;
  job_subcategory?: string;
  lube_subcategory?: string;
  vechile_details?: string;
  current_quantity?: string;
  lower_limit?: string;
  rack_no?: string;
  hsn_no?: string;
  unit_purchase_price?: string;
  purchase_qty?: string;
  purchase_gst_rate?: string;
  purchase_tax_type?: string;
  purchase_total_amount?: string;
  purchase_discount?: string;
  purchase_cgst?: string;
  purchase_sgst?: string;
  purchase_igst?: string;
  purchase_total_gst?: string;
  unit_sale_price?: string;
  sale_qty?: string;
  sale_gst_rate?: string;
  sale_tax_type?: string;
  sale_total_amount?: string;
  sale_discount?: string;
  sale_cgst?: string;
  sale_sgst?: string;
  sale_igst?: string;
  sale_total_gst?: string;
  is_delete?: string;
  company_name?: string;
  created_at?: string;
  updated_at?: string;
  amount?:string;
  quantity?:string='1';
  showqunatityerrorlube?:boolean;
  showpriceerrorlube?:boolean;
  allownegativeinlube?:boolean;
  checkinsertedlube?:boolean;
  gstcalculateoflube?:number;
  cgstcalculateoflube?:number;
  sgstcalculateoflube?:number;
  showcalcluationinfo?:boolean;
  lubegsttypeerror?:boolean;
  lubegstamounterror?:boolean;
  lubeassignedmechanic?:any;
}
export class SpareData{
  id?: string;
  workshop_id?: string;
  is_master?: string;
  part_number?: string;
  part_name?: string;
  part_company?: string;
  unit?: string;
  category?: string;
  spare_subcategory?: string;
  job_subcategory?: string;
  lube_subcategory?: string;
  vechile_details?: string;
  current_quantity?: string;
  lower_limit?: string;
  rack_no?: string;
  hsn_no?: string;
  unit_purchase_price?: string;
  purchase_qty?: string;
  purchase_gst_rate?: string;
  purchase_tax_type?: string;
  purchase_total_amount?: string;
  purchase_discount?: string;
  purchase_cgst?: string;
  purchase_sgst?: string;
  purchase_igst?: string;
  purchase_total_gst?: string;
  unit_sale_price?: string;
  sale_qty?: string;
  sale_gst_rate?: string;
  sale_tax_type?: string;
  sale_total_amount?: string;
  sale_discount?: string;
  sale_cgst?: string;
  sale_sgst?: string;
  sale_igst?: string;
  sale_total_gst?: string;
  is_delete?: string;
  company_name?: string;
  created_at?: string;
  updated_at?: string;
  amount?:string;
  quantity:string='1';
  showqunatityerrorspare?:boolean;
  showpriceerrorspare?:boolean;;
  allownegativeinspare?:boolean;
  checkinsertedspare?:boolean;
  gstcalculateofspare?:number;
  cgstcalculateofspare?:number;
  sgstcalculateofspare?:number;
  showcalcluationinfo?:boolean;
  sparegsttypeerror?:boolean;
  sparegstamounterror?:boolean;
  spareassignedmechanic?:any;
}
export class JobData{
  id?: string;
  workshop_id?: string;
  is_master?: string;
  part_number?: string;
  part_name?: string;
  part_company?: string;
  unit?: string;
  category?: string;
  spare_subcategory?: string;
  job_subcategory?: string;
  lube_subcategory?: string;
  vechile_details?: string;
  current_quantity?: string;
  lower_limit?: string;
  rack_no?: string;
  hsn_no?: string;
  unit_purchase_price?: string;
  purchase_qty?: string;
  purchase_gst_rate?: string;
  purchase_tax_type?: string;
  purchase_total_amount?: string;
  purchase_discount?: string;
  purchase_cgst?: string;
  purchase_sgst?: string;
  purchase_igst?: string;
  purchase_total_gst?: string;
  unit_sale_price?: string;
  sale_qty?: string;
  sale_gst_rate?: string;
  sale_tax_type?: string;
  sale_total_amount?: string;
  sale_discount?: string;
  sale_cgst?: string;
  sale_sgst?: string;
  sale_igst?: string;
  sale_total_gst?: string;
  is_delete?: string;
  company_name?: string;
  created_at?: string;
  updated_at?: string;
  amount?:string;
  quantity?:string='1';
  showqunatityerrorjob?:boolean;
  showpriceerrorjob?:boolean;;
  allownegativeinjob?:boolean;
  checkinsertedjob?:boolean;
  gstcalculateofjob?:number;
  cgstcalculateofjob?:number;
  sgstcalculateofjob?:number;
  showcalcluationinfo?:boolean;
  jobgsttypeerror?:boolean;
  jobgstamounterror?:boolean;
  jobassignedmechanic?:any;
}