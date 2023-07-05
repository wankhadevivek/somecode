export class Customer {
  customer?:CustomerData;
  success?:boolean;
}

export interface CustomerData{
  id?:string;
  chassis_number?:string;
  vehicle_number?:string;
  vehicle_type?:string;
  vehicle_make?:string;
  vehicle_model?:string;
  vehicle_variant?:string;
  customer_name?:string;
  customer_mobile?:any;
  customer_mobile_2?:any;
  customer_email?:string;
  customer_dob?:string;
  pick_up_address?:string;
  drop_address?:string;
  engine_number?:string;
  vehicle_color?:any;
  driver_name?:string;
  driver_mobile?:any;
  gst_number?:string;
  km_read?:string;
  state?:string;
  city?:string;
  pincode?:string;
}