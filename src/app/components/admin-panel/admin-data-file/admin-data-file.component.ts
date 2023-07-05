import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from "../auth-service";
import {

  MatSnackBar,
 
} from "@angular/material";
import { NgForm } from '@angular/forms'
import * as FileSaver from "file-saver";
@Component({
  selector: 'app-admin-data-file',
  templateUrl: './admin-data-file.component.html',
  styleUrls: ['./admin-data-file.component.css']
})
export class AdminDataFileComponent implements OnInit {
  from_wk: number;
  to_wk: number;
  canRequest: boolean;
  @ViewChild('f', {static: false}) notificationForm: NgForm;
  constructor(
    private authService : AuthService,
    private snakBar : MatSnackBar
  ) { }

  ngOnInit() {
    
  }
  getFile(){
    this.authService.getJobcardsExcel(
      this.from_wk, this.to_wk)
    .subscribe(resp =>{
      if(resp){
        let filename = `Jobcard-Workshop-${this.from_wk}-${this.to_wk}`
        FileSaver.saveAs(resp, filename);
      }
      else{
        this.snakBar.open("Server Error", "Couldn't Fetch Jobcards", {
          duration: 3000,
        });
      }
    })

  }

  onSendNotification(){
    // if form valid 
    let msgObject = {
      title:this.notificationForm.value.msg_title,
      senderId:this.notificationForm.value.msg_sender_id,
      iconPath:this.notificationForm.value.icon_path,
      imgPath:this.notificationForm.value.img_path,
      wkIDs:this.notificationForm.value.wk_ids,
      body:this.notificationForm.value.msg_body,

    }
    this.authService.sendFCMs(
     msgObject)
    .subscribe(resp =>{
      // if(resp && resp.success == true){
      if(resp ){
        
        this.snakBar.open("Sent", "Success- "+resp.success+" Failure- "+resp.failure, {
          duration: 3000,
        });
       
      }
      else{
        this.snakBar.open("Server Error", "Couldn't Send Notification", {
          duration: 3000,
        });
      }
    })
  }
}
