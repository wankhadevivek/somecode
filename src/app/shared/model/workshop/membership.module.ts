export class Membership {
  success?: boolean;
  data_workshop?:WorkshopData;
  data_rechrage?:RechargeData;
  data_vendor?:VendorData;
  error?:String;
  message?:String;
}
export interface WorkshopData{
  workshop_id?:String;
	login_date?:String;
	workshop_address?:String;
	workshop_city?:String;
	workshop_state?:String;
	workshop_email?:String;
	workshop_first_name?:String;
	workshop_last_name?:String;
	workshop_mobile_number_1?:String;
	workshop_mobile_number_2?:String;
	workshop_name?:String;
	workshop_pincode?:String;
	workshop_rtocode?:String;
	workshop_type?:String;
	registration_date?:String;
	validity_type?:String;
	validity?:String;
	sender_id?:String;
	device_id_data?:String;
	is_delete?:String;
	terms_condition?:String;
	profile_image_url?:String;
	created_at?:String;
  updated_at?:String;
  user_type?:String;
	workshop_logo?:String;
	workshop_signature?:String;
	vendorid?:String;
}

export interface RechargeData{
  id?:String;
	recharge_type?:String;
	validity_months?:String;
	validity_days?:String;
	amount?:String;
	description?:String;
	created_at?:String;
	updated_at?:String;
}


export interface VendorData{
	id?:String;
	workshop_id?:String;
	vendorid?:String;
	name?:String;
	phone?:String;
	email?:String;
	details?:String;
	gstin?:String;
	address1?:String;
	address2?:String;
	city?:String;
	state?:String;
	pincode?:String;
	created_at?:String;
	updated_at?:String;
  }