export class Booking {
  success?:boolean
  booking?: Bookingresult;
  has_next?: boolean;
  page_count?: string;
  previous_page?: string;
  next_page?: string;
}
export interface Bookingresult{
	id?:string,
	workshop_id?:string,
	customer_name?:string,
	customer_phone?:string,
	total_amount?:string,
	customer_email?:string,
	location?:string,
	customer_address_drop?:string,
	customer_address_pick?:string,
	vehicle_number?:string,
	vehicle_details?:string,
	date?:string,
	time?:string,
	status?:string,
	services?:string,
	is_delete?:string,
	customer_id?:string,
	is_pick?:string,
	is_drop?:string,
	created_at?:string,
	updated_at?:string,
	bookingid?:string,
	parent_id?:string,
	reason?: string,
	edited?: string,
	jobcard_number?: string,
	approved_datetime?: string,
	booking_type?: string,
}