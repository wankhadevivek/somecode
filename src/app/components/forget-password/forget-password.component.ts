import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl,AbstractControl } from '@angular/forms';
import { GeneralService } from '../../services/general.service';
import { UserserviceService } from '../../services/userservice.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { SpinnerService } from '../../services/spinner.service';
import  {ErrorMessgae}  from  '../../shared/error_message/error';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

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
  passwordSet:boolean=false
  constructor(private showspinner:SpinnerService,
    private router: Router,
    private snakBar:MatSnackBar,
    private formbuild: FormBuilder,
    private generalService: GeneralService,
    private userService:UserserviceService,
    ) { 
   
    this.reactiveForm();
    this.showOtpForm();
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
  showOtpForm(){
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

  sendOtp(){
    this.generalService.getOtpForLogin(this.myForm.value.phonenumber).subscribe(otp=>{
      console.log("otp",otp);
      
      if(otp["type"]=="success"){
        this.snakBar.open("OTP Send Successfully","", {
          duration: 4000
        })
        this.shwootp = true;
      }else{
        this.snakBar.open("Error","", {
          duration: 4000
        })
        this.shwootp = true;
      }
    },err=>{
        this.snakBar.open("err",ErrorMessgae[0][err], {
          duration: 4000
        })
    })
  }
  setPassword(mode){
    this.generalService.setUserPassword(this.myForm.value.phonenumber, mode, this.setPassForm.value.password, this.setPassForm.value.old_password).subscribe(res=>{
        console.log("setUserPassword",res);
        if(res.success){
          this.passwordSet = true;
          this.snakBar.open("password successfully set","", {
            duration: 4000
          })
        }
    });
  }
  verifyOTP(){
    this.generalService.verifyOTP(this.myForm.value.phonenumber,this.otpForm.value.otp).subscribe(msgResponse=>{
      this.shwootp = false;
      this.otpVerified =true;
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
  verifyPassword(){
    this.generalService.verifyPassword(this.myForm.value.phonenumber,this.passForm.value.password).subscribe(msgResponse=>{
      console.log("verifyPassword>>",msgResponse);
      this.otpVerified = true;
      if(msgResponse["type"]=="success"){
        
        this.wrongOtpError=false;
        this.snakBar.open("Login Success","", {
          duration: 4000
        })
        }else{
          this.showspinner.setSpinnerForLogin(false)
          this.snakBar.open("err",msgResponse["message"], {
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
