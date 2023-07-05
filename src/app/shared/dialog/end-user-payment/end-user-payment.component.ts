import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl } from '@angular/forms';
import { UserserviceService } from '../../../services/userservice.service';
import { SpinnerService } from '../../../services/spinner.service';
import { GeneralService } from '../../../services/general.service';
import { AbstractService } from '../../../services/comman/abstract.service';
import * as glob from "../../../shared/usercountry/userCountryGlobal"
@Component({
  selector: 'app-end-user-payment',
  templateUrl: './end-user-payment.component.html',
  styleUrls: ['./end-user-payment.component.css']
})
/**
 * In this file end-user payemnt
 * is processed user have to write the
 * email and the then payment will be processed
*/
export class EndUserPaymentComponent implements OnInit {
  amount
  redirectForm=this.abstract.payUrl
  appId=this.abstract.appId
  orderId
  Pay
  orderAmount
  orderCurrency= 'INR'
  orderNote 
  customerName
  customerEmail=''
  customerPhone
  returnUrl=this.abstract.returnurlcus
  signature
  vendorSplit
  worksdata
  totalAmount
  spares=Array()
  lubes=Array()
  jobs=Array()
  jobcardname
  createdat
  balance
  advance
  discount
  showpayform:boolean=false
  currency_symbol: any;

  // User all data of payment will be added and amount commision and vendor id
  constructor(
    private showspinner:SpinnerService,
    public abstract:AbstractService,
    private snakBar:MatSnackBar,
    private formbuild: FormBuilder,
    private general:GeneralService,
    private userService:UserserviceService,
    public dialogRef: MatDialogRef<EndUserPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.worksdata=JSON.parse(localStorage.getItem('work_data'))
      this.amount=parseInt(data.amount.requested_amount)
      this.Pay="Pay Now ( ₹ "+parseInt(data.amount.requested_amount)+" )"
      this.orderAmount=data.amount.requested_amount
      this.orderId=Date.now().toString()+data.amount.requested_amount+data.amount.jobcard_number.split("-")[0]+data.amount.jobcard_number.split("-")[1]
      this.customerName=data.amount.customername
      this.customerPhone=data.amount.customer_mobile
      this.totalAmount=Math.round(data.amount.total_amount)
      this.orderNote=this.worksdata.vendorid+';'+this.worksdata.workshop_id+';'+data.amount.requested_amount+';'+data.amount.jobcard_number+';'+data.amount.workshop_customer_id+';'+data.amount.customername+';'+data.amount.customer_mobile+';'+data.amount.transactionid
      var vendordata=[
        {
          "vendorId":'SELF',
          "commission":'0'
        }, 
        {
          "vendorId":this.worksdata.vendorid,
          "commission":"100"
        }
      ]//this.amount
        this.vendorSplit=btoa(JSON.stringify(vendordata))
        var sapres=JSON.parse(data.amount.jobcard_spare_items)
        var jobs=JSON.parse(data.amount.jobcard_job_items)
        var lubes=JSON.parse(data.amount.jobcard_lubes_items)
        this.totalAmount=Math.round(data.amount.total_amount)
        this.jobcardname=data.amount.jobcard_number
        this.advance=Math.round(data.amount.advance)
        this.discount=data.amount.discount
        this.createdat=data.amount.created_at
        this.balance=Math.round(data.amount.balance_amount)
        if(sapres.length!=0||jobs.length!=0||lubes.length!=0){
          if(sapres.length!=0){
            sapres.map(data=>{
              this.spares.push({
                "name":data.part_name,
                "qty":data.quantity+" "+data.unit,
                "price":"₹"+" "+Math.round(data.unit_sale_price),
                "amount":"₹"+" "+Math.round(data.amount)
              })
            })
          }else{
            this.spares=[]
          }
          if(lubes.length!=0){
            lubes.map(data=>{
              console.log(data)
              this.spares.push({
                "name":data.part_name,
                "qty":data.quantity+" "+data.unit,
                "price":"₹"+" "+Math.round(data.unit_sale_price),
                "amount":"₹"+" "+Math.round(data.amount)
              })
            })
          }else{
            this.lubes=[]
          }
          if(jobs.length!=0){
            jobs.map(data=>{
              this.spares.push({
                "name":data.part_name,
                "qty":data.quantity,
                "price":"₹"+" "+Math.round(data.unit_sale_price),
                "amount":"₹"+" "+Math.round(data.amount)
              })
            })
          }else{
            this.spares=[]
          }
        }
  }
  ngOnInit() { 
    this.currency_symbol = glob.currency_symbol;
  }
  //Email to have before payment
  checkemail(event){
    if(event.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)){
      this.customerEmail=event
      this.showpayform=true
      localStorage.setItem('urltore',window.location.href)
      this.general.getEndUserSignature(this.orderId,this.orderAmount,this.orderCurrency,this.customerEmail,
      this.customerPhone,this.customerName,this.returnUrl,this.vendorSplit,this.orderNote).subscribe(signature=>{
        if(signature.success==true){
          this.signature=signature.token
        }
      })
    }else{
      this.showpayform=false
    }
  }
  // close the popup
  closePopup(event){
      this.dialogRef.close();
  }
}
