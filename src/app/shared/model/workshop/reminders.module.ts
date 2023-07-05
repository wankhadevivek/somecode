export class Reminder {
  success?: boolean;
  message?:string
  reminders?:ReminderData[];

}
export interface ReminderData{
  id?:string
  workshop_id?:string
  sms_id?:string
  sms_category?:string
  message?:string
  date?:string
  status?:string
  reminder_priority?:string
  created_at?:string
  updated_at?:string
}