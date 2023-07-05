import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl } from '@angular/forms';
import { UserserviceService } from '../../../services/userservice.service';
import { SpinnerService } from '../../../services/spinner.service';
import { GeneralService } from '../../../services/general.service';
@Component({
  selector: 'app-add-description',
  templateUrl: './add-description.component.html',
  styleUrls: ['./add-description.component.css']
})
/**
 * In this file
 * description of the service  
 * is added to show in end-user home
 * page or servoce page
*/
export class AddDescriptionComponent implements OnInit {
  OTPForm:FormGroup;
  submitted = false;
  name
  price
  flagupdate
  part_number
  constructor(
    private showspinner:SpinnerService,
    private snakBar:MatSnackBar,
    private formbuild: FormBuilder,
    private general:GeneralService,
    private userService:UserserviceService,
    public dialogRef: MatDialogRef<AddDescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.name=data.name
      this.price=data.price
      this.part_number=data.part_number
      this.showOtpform();
  }
  ngOnInit() { 
  }
  // close poup and add description
  closePopup(event){
    if(event==true){
      this.submitted = true;
      if (this.OTPForm.invalid) {
        return;
      }else{
        this.general.updateOnlineServive(this.userService.getData()["workshop_id"],this.part_number,'des',this.OTPForm.getRawValue().otp).subscribe(verifyNo=>{
          if(verifyNo.success==true){
            this.dialogRef.close(verifyNo.jobdata);
          }else{
            this.dialogRef.close(false);
          }
        },err=>{
          this.showspinner.setSpinner(false)
          this.snakBar.open("Message", "Error In Update Service", {
            duration: 4000
          }) 
        })
      }
    }else{
      this.dialogRef.close(event);
    }
  }
  // description Validation form
  showOtpform(){
    this.OTPForm=this.formbuild.group({
      otp:['']
    })
  }
}
