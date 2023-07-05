export class OrderPlace {
	success?:boolean
	message?: any;
	order?: Orderresult[];
  }
export interface Orderresult{
	id?:string,
	orderid?:string,
	orderamount?:string,
	orderquantity?:string,
	customername?:string,
	customerphone?:string,
	customeremail?:string,
	address?:string,
	city?:string,
	state?:string,
	pincode?:string,
	productid?:string,
	productskuid?:string,
	productname?:string,
	is_delete?:string,
	workshop_id?:string,
    status?:string,
    cart_details?:string,
    workshop_name?:string,
	created_at?:string,
	updated_at?:string,
}