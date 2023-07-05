export class Staff {
  success?: boolean;
  staff?:StaffData[];
  message?:String;
}
export interface StaffData{
  id?:String;
  type?:String;
  name?:String;
  mobile_no_1?:String;
  mobile_no_2?:String;
  joining_date?:String;
  email?:String;
  address?:String;
  salary?:String;
  incentives?:String;
  created_at?:String;
  updated_at?:String;
  workshop_id?:String;
}