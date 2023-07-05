import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl } from '@angular/forms';
import { UserserviceService } from '../../../services/userservice.service';
import { SpinnerService } from '../../../services/spinner.service';
import { GeneralService } from '../../../services/general.service';
@Component({
  selector: 'app-email-send',
  templateUrl: './email-send.component.html',
  styleUrls: ['./email-send.component.css']
})
/**
 * In this file email
 * is send to the user 
 * of invoice and estimate
*/
export class EmailSendComponent implements OnInit {
  EmailForm:FormGroup;
  submitted = false;
  email
  constructor(
    private showspinner:SpinnerService,
    private snakBar:MatSnackBar,
    private formbuild: FormBuilder,
    private general:GeneralService,
    private userService:UserserviceService,
    public dialogRef: MatDialogRef<EmailSendComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.email=data.string
      this.sendemailform();
  }
  // add the details for send emil
  ngOnInit() {
    if(this.email!='noemail'){
      this.EmailForm.controls["otp"].setValue(this.email,{onlySelf:true})
      this.EmailForm.value.otp=this.email
    }
  }
  // close the popup and send email
  closePopup(event){
    if(event==true){
      this.submitted = true;
      if (this.EmailForm.invalid) {
        return;
      }else{
        this.dialogRef.close(this.EmailForm.getRawValue().otp);
      }
    }else{
      this.dialogRef.close('noemail');
    }
  }
  // send email form
  sendemailform(){
    this.EmailForm=this.formbuild.group({
      otp:['', [Validators.required, Validators.email] ]
    })
  }
}
