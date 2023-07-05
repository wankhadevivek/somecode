import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl } from '@angular/forms';
import { UserserviceService } from '../../../services/userservice.service';
import { SpinnerService } from '../../../services/spinner.service';
import { GeneralService } from '../../../services/general.service';
@Component({
  selector: 'app-verify-number',
  templateUrl: './verify-number.component.html',
  styleUrls: ['./verify-number.component.css']
})
/**
 * In this file Verify Number is called
 * when user Update the phone number from settings
 * or user add or edit the account details from the 
 * membership page this dialog is called to verify 
 * the phone number
*/
export class VerifyNumberComponent implements OnInit {
  OTPForm:FormGroup;
  submitted = false;
  phonenumber
  flagupdate
  constructor(
    private showspinner:SpinnerService,
    private snakBar:MatSnackBar,
    private formbuild: FormBuilder,
    private general:GeneralService,
    private userService:UserserviceService,
    public dialogRef: MatDialogRef<VerifyNumberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.phonenumber=data.phonenumber
      this.flagupdate=data.flag
      this.showOtpform();
  }
  ngOnInit() {
  }
  //Method when user perform any action on the dialog
  closePopup(event){
    if(event==true){
      this.submitted = true;
      if (this.OTPForm.invalid) {
        return;
      }else{
        this.general.verifyOTP(this.phonenumber,this.OTPForm.getRawValue().otp).subscribe(verifyNo=>{
          if(verifyNo["type"]=="success"){
            if(this.flagupdate=='update'){
              this.general.updateWorkshopNumber(this.userService.getData()["workshop_id"],parseInt(this.phonenumber)).subscribe(updatenumber=>{
                this.showspinner.setSpinner(true)
                if(updatenumber["success"]==true){
                  this.dialogRef.close(true);
                }else{
                  this.dialogRef.close(false);
                }
              },err=>{
                  this.showspinner.setSpinner(false)
                  this.snakBar.open("Error", "Error In Update Number", {
                    duration: 4000
                  })
                })
            }else{
              this.dialogRef.close(true);
            }
            
          }else{
            this.dialogRef.close(false);
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
  // Method to validate the Form
  showOtpform(){
    this.OTPForm=this.formbuild.group({
      otp:['',[Validators.required, Validators.pattern(/^[0-9]*$/)]]
    })
  }
}
