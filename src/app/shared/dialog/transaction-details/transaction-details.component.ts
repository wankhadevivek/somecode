import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { SpinnerService } from '../../../services/spinner.service';
import { UserserviceService } from '../../../services/userservice.service';
import { GeneralService } from '../../../services/general.service';
import { ErrorMessgae } from '../../error_message/error';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import * as glob from "../../../shared/usercountry/userCountryGlobal"
@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
/**
 * In this file all the transactions are shown
 * when the end-user completes the payment or when the 
 * workshop owner request the payment. Then that
 * transaction is shown here with it's status
 * reuested, canceled, Failed, Completed, Inprocess
*/
export class TransactionDetailsComponent implements OnInit {
  jbnumber
  showalltarns=Array()
  currency_symbol: any;

  constructor(
    public dialogRef: MatDialogRef<TransactionDetailsComponent>,
    private showspinner:SpinnerService,
    private snakBar:MatSnackBar,
    private userService: UserserviceService ,
    private generalService:GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.jbnumber=data.line
  }
  ngOnInit() {
    this.currency_symbol = glob.currency_symbol;
    this.generalService.requestedAndRecevied(this.userService.getData()["workshop_id"],this.jbnumber).subscribe(data=>{
      this.showspinner.setSpinnerForLogin(true)
      if(data.success==true){
        var checkallReceived=Array()
        if(data.redata.length!=0){
          data.redata.map(eneterdata=>{
            eneterdata.flag='true'
            checkallReceived.push(eneterdata.amount)
          })
          data.data.map(check=>{
            data.redata.map(checkre=>{
              if(checkallReceived.includes(check.requested_amount)){
                if(check.requested_amount==checkre.amount){
                  if(checkre.flag=='true'){
                    checkre.flag='false'
                    this.showalltarns.push({
                      "transid":checkre.transactionid,
                      "amount":Math.floor(check.requested_amount),
                      "receviedat":checkre.created_at,
                      "requestedat":check.created_at,
                      "status":checkre.payment_status,
                    })
                  }else{
                    this.showalltarns.push({
                      "transid":"Requested",
                      "amount":Math.floor(check.requested_amount),
                      "receviedat":"",
                      "requestedat":check.created_at,
                      "status":"",
                    })
                  }
                }
              }else{
                this.showalltarns.push({
                  "transid":"Requested",
                  "amount":Math.floor(check.requested_amount),
                  "receviedat":"",
                  "requestedat":check.created_at,
                  "status":"",
                })
              }
            })
          })
        }else if(data.redata.length==0 && data.data.length!=0){
          data.data.map(check=>{
            this.showalltarns.push({
              "transid":"Requested",
              "amount":check.requested_amount,
              "receviedat":"",
              "requestedat":check.created_at,
              "status":"",
            })
          })
        }else{
          console.log("NO Transaction")
        }
        
        console.log(this.showalltarns)
      }
      this.showspinner.setSpinnerForLogin(false)
    },err=>{
      this.showspinner.setSpinnerForLogin(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
  }
  // Method to get the transaction details
  showtransaction(data,index){
    if(data!="Requested"){
      this.generalService.getTransactionDetails(this.userService.getData()["workshop_id"],data).subscribe(data=>{
        this.showspinner.setSpinnerForLogin(true)
        if(data.success==true){
          this.showalltarns[index].stausfree=data.status
          this.showalltarns[index].payfree=data.redata
          this.showalltarns[index].subcodefree=data.subcode
          this.showalltarns[index].msgfree=data.data
        }else{
          this.showalltarns[index].stausfree="Fail"
          this.showalltarns[index].payfree=""
          this.showalltarns[index].subcodefree=""
          this.showalltarns[index].msgfree=""
        }
        this.showspinner.setSpinnerForLogin(false)
      },err=>{
        this.showspinner.setSpinner(false)
        this.snakBar.open("Error", ErrorMessgae[0][err], {
          duration: 4000
        })
      })
    }else{
      this.showalltarns[index].stausfree="Fail"
          this.showalltarns[index].payfree=""
          this.showalltarns[index].subcodefree=""
          this.showalltarns[index].msgfree=""
    }
  }
  // Method to close the popup
  closePopup(event){
    this.dialogRef.close('event');
  }
}
