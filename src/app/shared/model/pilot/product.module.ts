export class Product {
	success?:boolean
	message?: any;
	cartlen?: any;
	products?: Productresult[];
	supplier?: Supplierresult[];
  }
  export interface Productresult{
	id?:string,
	skuid?:string,
	product_name?:string,
	description?:string,
	price?:string,
	company?:string,
	orignal_price?:string,
	image?:string,
	quantity?:string,
	keywords?:string,
	supplier?:string,
	units?:string,
	is_delete?:string,
	created_at?:string,
	updated_at?:string,
  }
  export interface Supplierresult{
	id?:string,
	workshop_id?:string,
	supplier_name?:string,
	business_name?:string,
	supplier_mobile1?:string,
	supplier_mobile2?:string,
	supplier_email?:string,
	supplier_address?:string,
	supplier_gst_no?:string,
	created_at?:string,
	updated_at?:string,
  }