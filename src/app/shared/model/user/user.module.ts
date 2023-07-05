export class User {
  success?: boolean;
  data?:Data;
  message?:string;
  role?:string;
  workshop_id?:string;
}

export interface Data {
  unique_id?:string;
  email?:string;
  name?:string;
  first_name?:string;
  last_name?:string;
  address?:string;
  city?:string;
  state?:string;
  pincode?:string;
  workshop_id?:string;
  workshop_mobile_number_1?:string;
  workshop_mobile_number_2?:string;
  workshop_rtocode?:string;
  workshop_type?:string;
  workshop_name?:string;
  registration_date?:string;
  profile_image?:string;
  logo?:string;
  signature?:string;
  remaining_days?:string;
  token?:string;
  recharge_data?:Recharge;
  validity_type?:string,
  login_date?:string;
  output?:string;
}

export interface Recharge {
  plan?: string;
  plan_price?:string;
  expiry_date?:string;
  expiry_time?:string;
  start_date?: string;
  start_time?: string;
  remaining?: string;
}

