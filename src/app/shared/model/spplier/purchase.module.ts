export class Purchase {
	success?:boolean
	order?: OrderResult;
	has_next?: boolean;
	page_count?: string;
	previous_page?: string;
	next_page?: string;
}
export interface OrderResult{
    
	id?:string,
	workshop_id?:string,
	bill_no?:string,
	stock_items?:string,
	supplier_id?:string,
	po_no?:string,
	total_amount?:string,
	discount?:string,
	balance_amount?:string,
	paid_amount?:string,
	gst_amount?:string,
	cgst_amount?:string,
	sgst_amount?:string,
	igst_amount?:string,
	payment_type?:string,
	payble_amount?:string,
	payment_mode?:string,
	created_at?:string,
	updated_at?:string,
	po_date?:string,
	bill_date?:string,
	supplier_name?:string,
	supplier_mobile?:string,
	exit_note?:string,
	is_delete?:string,
	recevied_date?:string,
	return_amount?:string,
	return_date?:string,
	refund_amount?:string,
	is_return?:string,
	vehicle_number?:string,
	transport?:string,
	deliverydate?:string,
	person_name?:string,
	ltno?:string,
	taxable: any,
	master_supplier_id?: string,
	dispatchdate?: string,
}