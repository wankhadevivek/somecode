import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl } from '@angular/forms';
import { UserserviceService } from '../../../services/userservice.service';
import { SpinnerService } from '../../../services/spinner.service';
import { GeneralService } from '../../../services/general.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-select-option-open',
  templateUrl: './select-option-open.component.html',
  styleUrls: ['./select-option-open.component.css']
})
/**
 * In this user is asked where to
 * opnen estimate or invoice
 * while getting onvoice in completed
 * jobcard
*/
export class SelectOptionOpenComponent implements OnInit {
  OTPForm:FormGroup;
  submitted = false;
  phonenumber
  constructor(
    private showspinner:SpinnerService,
    private snakBar:MatSnackBar,
    private formbuild: FormBuilder,
    private general:GeneralService,
    private userService:UserserviceService,
    public dialogRef: MatDialogRef<SelectOptionOpenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.phonenumber=data.phonenumber
      this.showOtpform();
  }
  // Set default value to invoice
  ngOnInit() {
    this.OTPForm.controls["otp"].setValue("invoice",{self:true})
    this.OTPForm.value.otp="invoice"
  }
  // seleted value send to open invoice or estinate
  // if no value seleted then invoice is open
  closePopup(event){
    if(event==true){
      this.submitted = true;
      if (this.OTPForm.invalid) {
        return;
      }else{
        this.dialogRef.close(this.OTPForm.getRawValue().otp);
      }
    }else{
      this.dialogRef.close(event);
    }
  }
  //Form seleted validation
  showOtpform(){
    this.OTPForm=this.formbuild.group({
      otp:['',Validators.required]
    })
  }
}
