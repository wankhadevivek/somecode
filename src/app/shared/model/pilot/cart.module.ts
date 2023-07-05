export class Cart {
  success?:boolean
  message?: any;
  cart?: Cartresult[];
}
export interface Cartresult{
	id?:string,
	workshop_id?:string,
	product_id?:string,
	skuid?:string,
	product_name?:string,
	description?:string,
	price?:string,
	orignal_price?:string,
	image?:string,
	quantity?:string,
	keywords?:string,
	supplier?:string,
	company_name?:string,
	categories?:string,
	units?:string,
	created_at?:string,
	updated_at?:string,
}