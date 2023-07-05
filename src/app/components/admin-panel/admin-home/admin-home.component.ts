import { Component, NgModule, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MatSnackBar,
  MAT_DIALOG_DATA,
} from "@angular/material";

import { AuthService } from "../auth-service";
import { Router } from '@angular/router';
import * as FileSaver from "file-saver";


interface Package{
  value: string; 
  viewValue: string
}
interface PaymentType{
  value: string; 
  viewValue: string
}
@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent implements OnInit {
  public is_set_customer:boolean=false
  // @ViewChild('mobile', {static:false}) wk_number: number
  wk_number: string
  search:String = ''
  showAlert:Boolean = false
  alertMsg:String
  wk_details = Array()
  validity = new Date()
  requestedJCCount:Boolean = false
  contactlink:String
  packages:Package[] = 
  [
    {value: 'Platninum', viewValue: 'Platninum'},
    {value: 'Gold', viewValue: 'Gold'},
    {value: 'Trial', viewValue: 'Trial'}]
  
  paymentTypes: PaymentType[] =   [
    {value: 'DEBIT_CARD', viewValue: 'Debit Card'},
    {value: 'CREDIT_CARD', viewValue: 'Credit Card'},
    {value: 'Cash', viewValue: 'Cash'},
    {value: 'Check', viewValue: 'Check'},
    {value: 'UPI', viewValue: 'UPI'},
    {value: 'PhonePe', viewValue: 'PhonePe'},
    {value: 'MobiKwik', viewValue: 'MobiKwik'}
  ]

  mapPackageDays= {'Platninum':365,
                    'Gold':180,
                    'Trial': 10
                  }

  rechargeForm: FormGroup
  start_date =''
  end_date = ''


  constructor(
    private authService : AuthService,
    private snakBar: MatSnackBar,
    private router: Router
  ) { 
    

  }

  ngOnInit() {


    this.rechargeForm  = new FormGroup({
      // workshop_id: new FormControl(null),
      recharge_date: new FormControl('No Data', Validators.required),
      expiry_date: new FormControl('No Data',  Validators.required),
      transaction_id: new FormControl(null,  Validators.required),
      amount: new FormControl(null,  Validators.required),
      package_type: new FormControl(null,  Validators.required),
      v_date: new FormControl(null,  Validators.required),
      pay_type: new FormControl(null,  Validators.required)
    })

    
  }

  getJCCount(){


    this.authService.getCountJC(this.wk_details[0]["workshop_id"])
    .subscribe(resp =>{
      if(resp["success"]){
        this.wk_details[0]["total_jc_count"] = resp["data"]
        this.requestedJCCount = true
      }
      else{
        this.snakBar.open("Server Error", "Couldn't Fetch Jobcard Count", {
          duration: 3000,
        });
      }
    })
  }

  packageChange(value){
   
    // var compareToday = new Date()
    // var wk_validity = this.rechargeForm.get('v_date').value
    // var someDate = new Date();
    // if(compareToday < wk_validity){
    //   someDate = wk_validity
    // }


    // var numberOfDaysToAdd = this.mapPackageDays[value];
    // var result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
    
    // this.rechargeForm.patchValue({
    //   v_date: new Date(result)
    // })
    



    var someDate = new Date(this.validity.getTime());
    
    
    var numberOfDaysToAdd = this.mapPackageDays[value];
    var result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
    
    this.rechargeForm.patchValue({
      v_date: new Date(result)
    })



  }

  
  resetWk(){
    this.requestedJCCount = false
    this.is_set_customer = false
    this.wk_details = Array()
    // reset form
    this.rechargeForm.reset()
    this.validity = new Date()
  }
  onSearch(){

    var phoneno = /^([0|+[0-9]{1,9})?([1-9][0-9]{9})$/;
    
    if(phoneno.test(this.wk_number))
    {
      // api ask for wk data

      this.authService.getWorkshopDetails(this.wk_number)
      .subscribe(resp => {
        if(resp.success == false){
          this.showAlert = true
          this.alertMsg ="Workshop with Mobile Number Doesn't Exist"

        }
        else{
          this.is_set_customer = true
          this.wk_details = resp["data"]
          // set up form values

          const d = new Date(resp["recharge_data"]["expiry"])
         
          this.rechargeForm.patchValue({
            v_date: d,
            recharge_date: resp["recharge_data"]["recharge"].split(',')[0],
            expiry_date: resp["recharge_data"]["expiry"].split(',')[0],
            // transaction_id: resp["recharge_data"]["transactionId"],
            amount: resp["recharge_data"]["amt"],
            package_type: resp["recharge_data"]["rechargeType"],
            
            pay_type:resp["recharge_data"]["paymentMode"]
            
          })
         
          if(this.validity < d){
            this.validity = d
          }

          this.contactlink = "https://web.whatsapp.com/send?phone=91"+
      this.wk_number
        }
      },
      (err) => {
       
        this.snakBar.open("Error",'Please Contact Team', {
          duration: 4000,
        });
      }
      )
     
    }
  else
    {
      this.showAlert = true
      this.alertMsg = "Workshop Number Invalid"
    }
  
  }
  routeToDataFile(){
    this.router.navigate(['admin-data-file']);

  }

  onSubmit(){

  
    var convert = this.rechargeForm.get('v_date').value
    var wk_validity = convert.getFullYear().toString() +
        "-" +
        ("0" + (convert.getMonth() + 1)).slice(-2).toString() +
        "-" +
        ("0" + convert.getDate()).slice(-2).toString()
        " " +
        convert.getHours().toString() +
        ":" +
        ("0" + convert.getMinutes()).slice(-2).toString() +
        ":" +
        ("0" + convert.getSeconds()).slice(-2).toString();
    var days_added = this.rechargeForm.get('v_date').value.getDate() - this.validity.getDate()

    var req_data = {
      "workshop_id":this.wk_details[0]["workshop_id"],
      "transaction_id":this.rechargeForm.get('transaction_id').value,
      "transaction_date":wk_validity,
      "recharge_type":this.rechargeForm.get('package_type').value,
      "payment_mode":this.rechargeForm.get('pay_type').value,
      "recharge_amount":this.rechargeForm.get('amount').value,
      "validity_date":wk_validity,
      "days_added": days_added
    }
    this.authService.WorkshopRecharge(req_data)
      .subscribe(resp => {
// alter 
// get updated data

      if(resp["success"] == true){
        this.onSearch()
        this.snakBar.open("Updated Workshop Recharge", "Successfully", {
          duration: 3000,
        });
      }
      })
  }

  getFile(){
    console.log('this', this.start_date, this.end_date)
    this.authService.getJobcardsExcel(
      this.start_date, this.end_date, 'wk_by_registration')
    .subscribe(resp =>{
      if(resp){
        let filename = `Workshop-${this.start_date}-${this.end_date}`
        FileSaver.saveAs(resp, filename);
      }
      else{
        this.snakBar.open("Server Error", "Couldn't Fetch Jobcards", {
          duration: 3000,
        });
      }
    })

 
 
  }
}
