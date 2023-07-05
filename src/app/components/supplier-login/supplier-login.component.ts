import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl,AbstractControl } from '@angular/forms';
import { GeneralService } from '../../services/general.service';
import { UserserviceService } from '../../services/userservice.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { SpinnerService } from '../../services/spinner.service';
import  {ErrorMessgae}  from  '../../shared/error_message/error';

@Component({
  selector: 'app-supplier-login',
  templateUrl: './supplier-login.component.html',
  styleUrls: ['./supplier-login.component.css']
})
export class SupplierLoginComponent implements OnInit {

  wrongOtpError:boolean=false
  userNumber:string
  showerror:boolean=false
  shwootp:boolean=false
  timerfalse:boolean=false
  timeLeft: number; 
  interval;
  userObject;
  usingPassword:boolean=false
  myForm: FormGroup;
  otpForm:FormGroup;
  passForm:FormGroup;
  setPassForm:FormGroup;
  otpGetFromAPI:string;
  passwordNull:boolean=false
  otpVerified:boolean=false

  constructor(private showspinner:SpinnerService,private router: Router,private snakBar:MatSnackBar,private formbuild: FormBuilder,private generalService: GeneralService,private userService:UserserviceService) { 
    if(localStorage.getItem('user')){
      this.router.navigate(['orders']);
    }else{
      this.router.navigate(['login/supplier']);
    }
    this.reactiveForm();
    this.showOtpform();
  }
  // Actibve the forms
  ngOnInit() {
    this.showspinner.setSpinnerForLogin(true)
    this.showspinner.setSpinnerForLogin(false)
  }
  // Login form
  reactiveForm() {
    this.myForm = this.formbuild.group({
      phonenumber: ['', [Validators.required,Validators.pattern(/^([0|+[0-9]{1,9})?([1-9][0-9]{9})$/)] ],
    });
  }
  // OTP form
  showOtpform(){
    this.otpForm=this.formbuild.group({
      otp:['',[Validators.required, Validators.pattern(/^[0-9]*$/)]]
    })
    this.setPassForm = this.formbuild.group({
      password:['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6,16}$/)]],
      confirm_password:['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6,16}$/)]]
    },{validator: this.passwordConfirming})
    this.passForm = this.formbuild.group({
      password:['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6,16}$/)]]
    })
  }
  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirm_password').value) {
        return {invalid: true};
    }
  }
  // Submit the number for the OTP and chek in databse
  submitForm() {
    this.userObject=""
    this.otpGetFromAPI=""
    this.timeLeft=60
    this.timerfalse=false

    this.generalService.loginUser(this.myForm.value.phonenumber).subscribe(loginData=>{
      this.showspinner.setSpinnerForLogin(true);
      if(loginData.success==false){
        this.showspinner.setSpinnerForLogin(false)
        this.showerror=true
        this.shwootp=false
      }else if(loginData.success==true){
        
        if(loginData.data[0].role == 'supplier'){
          if(!loginData.data[0].password || loginData.data[0].password == undefined || loginData.data[0].password == null){
            this.passwordNull = true;
            this.sendOtp(this.myForm.value.phonenumber);
            this.shwootp=true;
            this.usingPassword = false;
          }else{
            this.usingPassword = true;
            this.shwootp=false;
            this.passwordNull = false;
          }
          localStorage.removeItem("isUserLogin");
          localStorage.removeItem("user_name");
          this.userObject=loginData.data[0]
          this.otpGetFromAPI=loginData.data["otp"]
          this.showspinner.setSpinnerForLogin(false)
          this.interval = setInterval(() => {
            if(this.timeLeft > 0) {
              this.timeLeft--;
            } else {
              this.timerfalse=true
            }
          },1000)
        }else{
          this.showspinner.setSpinnerForLogin(false)
          this.snakBar.open("Error", ErrorMessgae[0][6], {
            duration: 4000
          })
        }
      }
    }, error => {
      this.showspinner.setSpinnerForLogin(false)
      this.snakBar.open("Error", ErrorMessgae[0][error], {
        duration: 4000
      })
    });
  }
  // Submit the OTP amd verify and login
  submitFormForLogin(option){
    this.showspinner.setSpinnerForLogin(true)
    if(option == 'by_otp'){
      this.generalService.verifyOTP(this.myForm.value.phonenumber,this.otpForm.value.otp).subscribe(msgResponse=>{
      if(msgResponse["type"]=="success"){
          this.shwootp = false;
          this.otpVerified =true;
          this.wrongOtpError=false;
          this.showspinner.setSpinnerForLogin(false)
       
        }else{
            this.showspinner.setSpinnerForLogin(false)
            this.snakBar.open("err",msgResponse["message"], {
              duration: 4000
            })
            this.wrongOtpError=true
        }
    },err=>{
      this.showspinner.setSpinnerForLogin(false)
      this.snakBar.open("err",ErrorMessgae[0][err], {
        duration: 4000
      })
      })
    }
    if(option == 'by_pass'){
      this.generalService.verifyPassword(this.myForm.value.phonenumber,this.passForm.value.password).subscribe(msgResponse=>{
      if(msgResponse["type"]=="success"){
        this.wrongOtpError=false
        this.snakBar.open("Login Success","", {
          duration: 4000
        })
        this.generalService.expiryMembership(this.userObject.workshop_id).subscribe(memberData=>{
          this.showspinner.setSpinnerForLogin(true)
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
        if(this.userObject.signature!=" "){
          (async ()=> {
            let blob = await fetch(this.userObject.signature).then(r => r.blob());
            let dataUrl = await new Promise(resolve => {
              let reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            });
            // now do something with `dataUrl`
            this.userObject.signature=dataUrl
            this.userService.login(this.userObject)
          })();
        }else{
          this.userObject.signature='false'
          this.userService.login(this.userObject)
        }
        }else{
          this.showspinner.setSpinnerForLogin(false)
          this.snakBar.open("err",msgResponse["message"] || 'Please Enter Correct password', {
            duration: 4000
          })
          this.wrongOtpError=true
        }
      err=>{
        this.showspinner.setSpinnerForLogin(false)
          this.snakBar.open("err",ErrorMessgae[0][err], {
            duration: 4000
          })
        }
      });
    }
  }
  // resend the OTP
  resendOTP(){
    this.generalService.resendOTP(this.myForm.value.phonenumber).subscribe(otp=>{
      if(otp["type"]=="success"){
        this.snakBar.open("OTP Send Sucessfully","", {
          duration: 4000
        })
      }else{
        this.snakBar.open("Error","", {
          duration: 4000
        })
      }
    },err=>{
        this.snakBar.open("err",ErrorMessgae[0][err], {
          duration: 4000
        })
    })
  }
 
  sendOtp(mobileno){
    this.generalService.getOtpForLogin(mobileno).subscribe(otp=>{
      if(otp["type"]=="success"){
        this.snakBar.open("OTP Send Sucessfully","", {
          duration: 4000
        })
      }else{
        this.snakBar.open("Error","Fail to send OTP", {
          duration: 4000
        })
      }
    },err=>{
        this.snakBar.open("err",ErrorMessgae[0][err || 8], {
          duration: 4000
        })
    })
  }
  setPassword(mode){
    this.generalService.setUserPassword(this.myForm.value.phonenumber, mode, this.setPassForm.value.password, this.setPassForm.value.old_password).subscribe(res=>{
        if(res.success){
          this.snakBar.open("password successfully set","", {
            duration: 4000
          })
          this.processToNextStep();
        }
    });
  }
  processToNextStep(){
    this.snakBar.open("Login Success","", {
      duration: 4000
    })
    localStorage.setItem("falg", 'true');
    this.generalService.expiryMembership(this.userObject.workshop_id).subscribe(memberData=>{
      this.showspinner.setSpinnerForLogin(true)
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
    if(this.userObject.signature!=" "){
      (async ()=> {
        let blob = await fetch(this.userObject.signature).then(r => r.blob());
        let dataUrl = await new Promise(resolve => {
          let reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
        // now do something with `dataUrl`
        this.userObject.signature=dataUrl
        this.userService.login(this.userObject)
      })();
    }else{
      this.userObject.signature='false'
      this.userService.login(this.userObject)
    }
  }

}
