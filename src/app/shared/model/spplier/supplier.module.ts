export class Supplier {
  success?:boolean
  supplier?: Supplierresult;
  has_next?: boolean;
  page_count?: string;
  previous_page?: string;
  next_page?: string;
}
export interface Supplierresult{
    master_supplier_id?: string;
	id?:string,
	workshop_id?:string,
	supplier_name?:string,
	business_name?:string,
	supplier_mobile1?:string,
	supplier_mobile2?:string,
	supplier_email?:string,
	supplier_address?:string,
	supplier_gst_no?:string,
	balance?:string,
	created_at?:string,
	updated_at?:string,
}