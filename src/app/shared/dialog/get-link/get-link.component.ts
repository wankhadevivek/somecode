import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { SpinnerService } from '../../../services/spinner.service';
import { GeneralService } from '../../../services/general.service';
import { UserserviceService } from '../../../services/userservice.service';
import { ErrorMessgae } from '../../error_message/error';

@Component({
  selector: 'app-get-link',
  templateUrl: './get-link.component.html',
  styleUrls: ['./get-link.component.css']
})
/**
 * In this file the link
 * for the end-user app
 * is created when user
 * create a jobcard or request for the 
 * payment the link
 * is generated
*/
export class GetLinkComponent implements OnInit {
  getAmount
  cashValue:boolean=false
  linkValue:boolean=true
  linkdisabled:boolean=false
  showAmount:boolean=true
  regex= /^\d+(\.\d{1,2})?$/
  Advanceerrors:boolean=false
  totalamount
  getLink
  issues
  jobcardtype
  cusphone
  cusname
  jmnumber
  messageoldbal:boolean=false
  messageamount:any
  constructor(
  public dialogRef: MatDialogRef<GetLinkComponent>,
  private snakBar:MatSnackBar,
  private showspinner:SpinnerService,
  private general:GeneralService,
  private userService:UserserviceService,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.jobcardtype=data.jobcardtype
    this.getLink=data.getlink
    this.getAmount=data.amount
    this.totalamount=data.amount
    this.issues=data.issues
    this.cusphone=data.cus_name
    this.cusname=data.cus_phone
    this.jmnumber=data.jm_number
  }
  // Check if link is genrated then user has the app enabled 
  ngOnInit() {
    if(this.getLink!='yes'){
      this.cashValue=true
      this.linkValue=false
      this.linkdisabled=true
      this.showAmount=false
    }
    if(this.jobcardtype=='request'){
      this.general.cancelEequestPayment(this.userService.getData()["workshop_id"],
      this.jmnumber).subscribe(requestData=>{
        if(requestData.success==true){
          this.messageoldbal=true
          this.messageamount=Math.round(requestData.amount)
        }else{
          this.messageoldbal=false
        }
      },error=>{
        this.snakBar.open("Error", ErrorMessgae[0][error], {
          duration: 4000
        })
      })
    }
  }
  // Get the link
  getlink(event){
    if(event.currentTarget.checked==true){
      this.cashValue=false
      this.linkValue=true
      this.showAmount=true
    }else{
      this.cashValue=true
      this.linkValue=false
      this.showAmount=false
    }
  }
  // Get by cash
  getCash(event){
    if(event.currentTarget.checked==true){
      this.cashValue=true
      this.linkValue=false
      this.showAmount=false
    }else{
      this.cashValue=false
      this.linkValue=true
      this.showAmount=true
    }
  }
  // If user amount changed
  onamountChange(event){
    if(this.regex.test(event)==false){
      this.Advanceerrors=true
    }else if(event>Number(this.totalamount)){
      this.Advanceerrors=true
    }else{
      this.Advanceerrors=false
      this.getAmount=Number(event)
    }
  }
  // For claosed jobacrd
  closejob(e){
    var jobclose
    jobclose={
      update:'true'
    }
    this.dialogRef.close(jobclose);
  }
  // for complete jobacad
  completejob(e){
    var complete
    if(this.cashValue==true){
      complete={
        update:'true',
        flag:'cash'
      }
      this.dialogRef.close(complete);
    }else if(this.linkValue==true){
      this.general.requestPayment(this.userService.getData()["workshop_id"],
    this.jmnumber,this.cusname,this.cusphone,this.getAmount,this.totalamount).subscribe(req=>{
        if(req.success==true){
          complete={
            update:'true',
            amount:this.getAmount,
            flag:'link'
          }
          this.dialogRef.close(complete);
        }else{
          this.snakBar.open("Message", "Please contact to the company", {
            duration: 4000
          })
        }
    },error=>{
      this.snakBar.open("Error", ErrorMessgae[0][error], {
        duration: 4000
      })
    }) 
    }
  }
  // Request the link
  requestlink(e){
    var jobclose
    this.general.requestPayment(this.userService.getData()["workshop_id"],
    this.jmnumber,this.cusname,this.cusphone,this.getAmount,this.totalamount).subscribe(req=>{
        if(req.success==true){
          jobclose={
            update:'true',
            amount:this.getAmount,
            flag:'link'
          }
          this.dialogRef.close(jobclose);
        }else{
          this.snakBar.open("Message", "Please contact to the company", {
            duration: 4000
          })
        }
    },error=>{
      this.snakBar.open("Error", ErrorMessgae[0][error], {
        duration: 4000
      })
    })
    
  }
  // Close the popup
  closePopup(event){
    var jobclose
    jobclose={
      update:'false'
    }
    this.dialogRef.close(jobclose);
  }
}
