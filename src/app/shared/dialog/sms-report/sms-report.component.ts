import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { SpinnerService } from '../../../services/spinner.service';
import { UserserviceService } from '../../../services/userservice.service';
import { GeneralService } from '../../../services/general.service';
import { ErrorMessgae } from '../../error_message/error';
@Component({
  selector: 'app-sms-report',
  templateUrl: './sms-report.component.html',
  styleUrls: ['./sms-report.component.css']
})
/**
 * In this file recent 15 SMS are
 * shown this dialog is called from the header
 * the msg icon is shwon 
*/
export class SmsReportComponent implements OnInit {
  userserviceworkshopid
  allReportData=Array()
  allSMS=Array()
  contactlink: String = ''
  constructor(
    public dialogRef: MatDialogRef<SmsReportComponent>,
    private showspinner:SpinnerService,
    private snakBar:MatSnackBar,
    private userService: UserserviceService ,
    private generalService:GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.userserviceworkshopid=this.userService.getData()["workshop_id"]
      this.allReportData=data.array
  }
  //Get all the recent 15 sms of the workshop
  ngOnInit() {
    this.allReportData.map(data=>{
      var sorteddata
      sorteddata={
        name:data["cutsomer_name"],
        jobcardnumber:data["sms_id"],
        message:data["message"],
        updatedat:data['date'],
        status:data['status'],
        number:data['customer_mobile']
      }
      this.allSMS.push(sorteddata)
    })
  }
  // Close the dialog
  closePopup(event){
    this.dialogRef.close(event);
  }
  contactWhatsapp(cus_mob, whatsappMessage){
    
    this.contactlink = "https://web.whatsapp.com/send?phone=91"+
    cus_mob+"&text=" + whatsappMessage;
  }
}
