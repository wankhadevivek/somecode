import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { SpinnerService } from '../../../services/spinner.service';
import { UserserviceService } from '../../../services/userservice.service';
import { GeneralService } from '../../../services/general.service';
import { ErrorMessgae } from '../../error_message/error';
@Component({
  selector: 'app-update-app',
  templateUrl: './update-app.component.html',
  styleUrls: ['./update-app.component.css']
})
/**
 * In this file when any update is rendered
 * on the web app and need to update user
 * to Update the app and what's in the new update
*/
export class UpdateAppComponent implements OnInit {
  userserviceworkshopid
  constructor(
    public dialogRef: MatDialogRef<UpdateAppComponent>,
    private showspinner:SpinnerService,
    private snakBar:MatSnackBar,
    private userService: UserserviceService ,
    private generalService:GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.userserviceworkshopid=this.userService.getData()["workshop_id"]
  }
  ngOnInit() {
  }
  //To close the dialog
  closePopup(event){
    this.dialogRef.close(event);
  }
  // Action when user update the app
  updateStatus(){
    this.generalService.updateApp(this.userService.getData()["workshop_id"]).subscribe(memberData=>{
      if(memberData.success==true){
        location.reload();
      }
    },err=>{
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
  }
}
