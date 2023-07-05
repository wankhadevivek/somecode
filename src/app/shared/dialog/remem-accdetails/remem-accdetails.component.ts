import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl } from '@angular/forms';
import { UserserviceService } from '../../../services/userservice.service';
import { SpinnerService } from '../../../services/spinner.service';
import { GeneralService } from '../../../services/general.service';
import { NgForm } from '@angular/forms';
import { AbstractService } from '../../../services/comman/abstract.service';
@Component({
  selector: 'app-remem-accdetails',
  templateUrl: './remem-accdetails.component.html',
  styleUrls: ['./remem-accdetails.component.css']
})
export class RememAccdetailsComponent implements OnInit {
  rechnage
  pervioustype
  /**
   * This popup is shwon
   * when user didn't fill the
   * account details and also
   * user didn't checkbox the no shown popup
   * need of this is to reminde user
   * to make payments online and add bankaccount
   * details 
  */
  constructor(
    private showspinner:SpinnerService,
    public abstract:AbstractService,
    private snakBar:MatSnackBar,
    private formbuild: FormBuilder,
    private general:GeneralService,
    private userService:UserserviceService,
    public dialogRef: MatDialogRef<RememAccdetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    
  }

  ngOnInit() {
  }
  // close the popup
  closePopup(event){
    this.dialogRef.close()
  }
  //click on the account section and render to show account details
  addlocal(){
    localStorage.setItem("clickhere",'true');
  }
  //add the localstaore to not show poup again
  askagain(ev){
    if(ev.currentTarget.checked==true){
      localStorage.setItem("showpopup", 'false');
    }else{
      localStorage.setItem("showpopup", 'true');
    }
  }
}
