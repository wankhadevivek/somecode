import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl } from '@angular/forms';
import { UserserviceService } from '../../../services/userservice.service';
import { SpinnerService } from '../../../services/spinner.service';
import { GeneralService } from '../../../services/general.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-store-login',
  templateUrl: './store-login.component.html',
  styleUrls: ['./store-login.component.css']
})

/**
 * In this file user is login
 * in the onlinestore. User
 * is resiger also of not in database
*/
export class StoreLoginComponent implements OnInit {
  OTPForm:FormGroup;
  Numberorm:FormGroup;
  submitted = false;
  submittednumber= false;
  shownumberformfalg:boolean=true
  phonenumber
  flagupdate
  constructor(
    private showspinner:SpinnerService,
    private snakBar:MatSnackBar,
    private formbuild: FormBuilder,
    private general:GeneralService,
    private userService:UserserviceService,
    private router: Router,
    public dialogRef: MatDialogRef<StoreLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.flagupdate=data.flag
      this.phonenumber=data.number
      this.showOtpform();
      this.shownumberform();
  }
  // OTP is send
  ngOnInit() { 
    if(this.flagupdate=='true'){
      this.Numberorm.controls["number"].setValue(this.phonenumber,{onlySelf:true})
      this.general.getStoreOTP(this.Numberorm.getRawValue().number).subscribe(otp=>{
        this.showspinner.setSpinner(true)
        if(otp.success==true){
          this.snakBar.open("Message", "OTP Send Successfully", {
            duration: 4000
          })
          this.shownumberformfalg=false
        }else{
          this.snakBar.open("Message", "OTP Not Send", {
            duration: 4000
          })  
        }
        this.showspinner.setSpinner(false)
      },err=>{
        this.showspinner.setSpinner(false)
        this.snakBar.open("Message", "OTP Not Send", {
          duration: 4000
        })
      })
    }
  }
  //LOgin or user is registerd
  closePopup(event){
    if(event==true){
      this.submitted = true;
      if (this.OTPForm.invalid) {
        return;
      }else{
        this.general.verifyStoreOTP(this.Numberorm.getRawValue().number,this.OTPForm.getRawValue().otp).subscribe(msgResponse=>{
        if(msgResponse["success"]==true){
          if(msgResponse["message"]=="User Login Successfully"){
            localStorage.setItem("falg", 'true');
            this.general.expiryMembership(msgResponse.data.workshop_id).subscribe(memberData=>{
              if(memberData.success==true){
                memberData.data_workshop.validity
                var expiry_date = new Date(memberData.data_workshop.validity.split(" ")[0]);
                var current_date = new Date();
                if(memberData.data_workshop.vendorid==null){
                  localStorage.setItem('dl','false')
                }else{
                  localStorage.setItem('dl','true')
                }
                if(current_date.getTime() > expiry_date.getTime())
                {
                  this.showspinner.setSpinner(false)
                  localStorage.setItem("falg", 'false');
                  localStorage.setItem("showpopup", 'true');
                }else{
                  this.showspinner.setSpinner(false)
                  localStorage.setItem("falg", 'true');
                  localStorage.setItem("showpopup", 'true');
                }
              }else{
                this.showspinner.setSpinnerForLogin(false)
                localStorage.setItem("falg", 'true');
                localStorage.setItem("showpopup", 'true');
                
              }
            },err=>{
              this.showspinner.setSpinner(false)
              console.log('error')
              localStorage.setItem("falg", 'true');
            })
            if(msgResponse.data.signature!=" "){
              (async ()=> {
                let blob = await fetch(msgResponse.data.signature).then(r => r.blob());
                let dataUrl = await new Promise(resolve => {
                  let reader = new FileReader();
                  reader.onload = () => resolve(reader.result);
                  reader.readAsDataURL(blob);
                });
                // now do something with `dataUrl`
                msgResponse.data.signature=dataUrl
                this.userService.loginStore(msgResponse.data)
              })();
            }else{
              msgResponse.data.signature='false'
              this.userService.loginStore(msgResponse.data) 
            }
            this.dialogRef.close('login');
          }else{
            localStorage.setItem("falg", 'true');
            localStorage.setItem("showpopup", 'true');
            localStorage.setItem('dl','false')
            this.userService.loginStore(msgResponse.data[0]) 
            this.dialogRef.close('registerlogin');
          }
        }else{
              this.dialogRef.close(false);
              this.showspinner.setSpinnerForLogin(false)
              this.snakBar.open("Message",msgResponse["message"], {
                duration: 4000
              })
        }
        },err=>{
          this.showspinner.setSpinner(false)
          this.snakBar.open("Error", "Error In verify OTP", {
            duration: 4000
          })
        })
      }
    }else{
      this.dialogRef.close(event);
    }
  }
  //Verify OTP
  verifyNumber(e){
    this.submittednumber=true
        if (this.Numberorm.invalid) {
        return;
      }else{
        this.general.getStoreOTP(this.Numberorm.getRawValue().number).subscribe(otp=>{
          this.showspinner.setSpinner(true)
          if(otp.success==true){
            this.snakBar.open("Message", "OTP Send Successfully", {
              duration: 4000
            })
            this.shownumberformfalg=false
          }else{
            this.snakBar.open("Message", "OTP Not Send", {
              duration: 4000
            })  
          }
          this.showspinner.setSpinner(false)
        },err=>{
          this.showspinner.setSpinner(false)
          this.snakBar.open("Message", "OTP Not Send", {
            duration: 4000
          })
        })
        
      }
  }
  //OTP form validation
  showOtpform(){
    this.OTPForm=this.formbuild.group({
      otp:['',[Validators.required, Validators.pattern(/^[0-9]*$/)]]
    })
  }
  //mobie number form
  shownumberform(){
    this.Numberorm=this.formbuild.group({
      number:['',[Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]]
    })
  }
  //resend otp
  resend(){
    this.general.resendEndUserOTP(this.Numberorm.getRawValue().number).subscribe(otp=>{
      this.showspinner.setSpinner(true)
      if(otp.success==true){
        this.snakBar.open("Message", "OTP Send Successfully", {
          duration: 4000
        })
        this.shownumberformfalg=false
      }else{
        this.snakBar.open("Message", "OTP Not Send", {
          duration: 4000
        })  
      }
      this.showspinner.setSpinner(false)
    },err=>{
      this.showspinner.setSpinner(false)
      this.snakBar.open("Message", "OTP Not Send", {
        duration: 4000
      })
    })
  }
}
