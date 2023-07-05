import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl } from '@angular/forms';
import { UserserviceService } from '../../../services/userservice.service';
import { SpinnerService } from '../../../services/spinner.service';
import { GeneralService } from '../../../services/general.service';
import { NgForm } from '@angular/forms';
import { AbstractService } from '../../../services/comman/abstract.service';
import * as glob from "../../../shared/usercountry/userCountryGlobal"

/**
 * In this file the recharge 
 * of the workshop is done
 * user hs to select the recharge 
 * type and the payment will be processed
*/
@Component({
  selector: 'app-select-payment',
  templateUrl: './select-payment.component.html',
  styleUrls: ['./select-payment.component.css']
})
export class SelectPaymentComponent implements OnInit {
  rechnage
  pervioustype
  platinumclass='pricing-plan list-unstyled'
  goldClass='pricing-plan list-unstyled'
  Pay='Pay'
  appId=this.abstract.appId
  returnUrl=this.abstract.returnurl
  formUrl=this.abstract.payUrl
  orderId=''
  orderAmount=''
  orderCurrency='INR'
  customerName=''
  customerEmail=''
  customerPhone=''
  signature=''
  orderNote=''
  daysadd:any
  currency_symbol: any;

  constructor(
    private showspinner:SpinnerService,
    public abstract:AbstractService,
    private snakBar:MatSnackBar,
    private formbuild: FormBuilder,
    private general:GeneralService,
    private userService:UserserviceService,
    public dialogRef: MatDialogRef<SelectPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.rechnage=data.array.rechargedata
    this.pervioustype=data.previousType
    this.daysadd=data.days
  }
  ngOnInit() {
    this.currency_symbol = glob.currency_symbol;
  }
  closePopup(event){
    this.dialogRef.close()
  }
  // Token for the apyment process is generated
  getToken(data,classdata){
    if(classdata=='gold'){
      this.goldClass='pricing-plan list-unstyled selected'
      this.platinumclass='pricing-plan list-unstyled'
    }else{
      this.goldClass='pricing-plan list-unstyled'
      this.platinumclass='pricing-plan list-unstyled selected'
    }
    this.Pay="Pay (₹"+ data.amount +" )"
    this.orderAmount=data.amount


    var current=new Date()
    var month=current.getMonth()+1
    var olderId=this.userService.getData()["workshop_id"]+current.getFullYear().toString()+month.toString()+current.getDate().toString()+current.getHours().toString()+current.getMinutes().toString()+current.getSeconds().toString()
    this.orderId=olderId
    if(this.userService.getData()["email"]!=""){
      this.customerEmail=this.userService.getData()["email"]
    }else{
      this.customerEmail="tightthenut@gmnail.com"
    }
    var currentForVlaidaity=new Date()
    var days= parseInt(data.validity_days)+this.daysadd
    var correctDate = this.addDays(currentForVlaidaity, days);
    var cooectMonth=correctDate.getMonth()+1
    var cooectValidity=correctDate.getFullYear()+"-"+cooectMonth+"-"+correctDate.getDate()
    this.customerPhone=this.userService.getData()["workshop_mobile_number_1"]
    this.customerName=this.userService.getData()["name"]

    
    this.orderNote=data.id+";"+data.recharge_type+";"+data.amount+";"+data.validity_days+";"+data.validity_months+";"+this.customerPhone+";"+this.userService.getData()["workshop_id"]+";"+this.customerEmail+";"+cooectValidity
    this.general.paymentAPI(this.orderId,this.orderAmount,this.customerEmail,this.customerPhone,this.orderCurrency,this.orderNote,
    this.customerName,this.returnUrl).subscribe(getToken=>{
        if(getToken.success==true){
          this.signature=getToken.token
        }
    },error=>{
      console.log(error)
    })
    this.showspinner.setSpinnerForLogin(false)
  }
  // Payment is processed from here
  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
