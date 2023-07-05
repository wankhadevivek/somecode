
export class SettingsJobcard{
  success?:boolean;
  jobcard_Settings?:JobcardData;
}
export interface JobcardData{
  id?:string;
  workshop_id?:string;
  settings_billing?:string;
  settings_inventory?:string;
  settings_jobcard?:string;
  settings_user_add?:string;
  settings_workshop_franchise?:string;
  created_at?:string;
  updated_at?:string;
}