import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl } from '@angular/forms';
import { UserserviceService } from '../../../services/userservice.service';
import { SpinnerService } from '../../../services/spinner.service';
import { GeneralService } from '../../../services/general.service';
@Component({
  selector: 'app-end-user-message',
  templateUrl: './end-user-message.component.html',
  styleUrls: ['./end-user-message.component.css']
})
/**
 * In this file message is send to end-user
 * from the workshop
*/
export class EndUserMessageComponent implements OnInit {
  flagupdate
  constructor(
  private showspinner:SpinnerService,
  private snakBar:MatSnackBar,
  private formbuild: FormBuilder,
  private general:GeneralService,
  private userService:UserserviceService,
  public dialogRef: MatDialogRef<EndUserMessageComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.flagupdate=data.line
  }
  ngOnInit() { 
  }
}
