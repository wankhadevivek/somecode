import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import { UserserviceService } from './userservice.service';
import { DilogOpenService } from './dilog-open.service';
import { SpinnerService } from './spinner.service';
import { MatSnackBar } from '@angular/material';
import { GeneralService } from './general.service';
import { ErrorMessgae } from '../shared/error_message/error';

/**
 * In this file account
 * expiration is check
 * id account is expire or not
 */
@Injectable({
  providedIn: 'root'
})
export class ExpireAccountService {
  constructor(private userService:UserserviceService,
    private dialogService:DilogOpenService,
    private showspinner:SpinnerService,
    private snakBar:MatSnackBar,
    public general:GeneralService,) {
  }
  // GTet expire datys left
  checkNoOfDays(expiraydate){
    var expiry_date = new Date(expiraydate.split(" ")[0]);
    var current_date = new Date();
    var month=current_date.getMonth()+1
    var dateInFormat= current_date.getFullYear()+"-"+month+"-"+current_date.getDate()
    if(current_date.getTime() > expiry_date.getTime())
    {
      return false
    }else{
        var Date1 = new Date (dateInFormat);
        var Date2 = new Date (expiry_date);
        return Math.floor((Date2.getTime() - Date1.getTime())/(1000*60*60*24));
    }
    
  }
  // chek on login time and on compoent chnaged
  LoginTime(){
    this.general.expiryMembership(this.userService.getData()["workshop_id"]).subscribe(memberData=>{
      this.showspinner.setSpinner(true)
      if(memberData.success==true){
        memberData.data_workshop.validity
        
        var expiry_date = new Date(memberData.data_workshop.validity.split(" ")[0]);
        var current_date = new Date();
        if(current_date.getTime() > expiry_date.getTime())
        {
          this.showspinner.setSpinner(false)
          localStorage.setItem("falg", 'false');
        }else{
          
          this.showspinner.setSpinner(false)
          localStorage.setItem("falg", 'true');
          
          if(memberData.data_workshop.vendorid==null){
            this.showspinner.setSpinner(false)
            localStorage.setItem('dl','false')
            if(localStorage.getItem('showpopup')=='true'){
              this.dialogService.OpenAccRemember('okay').subscribe(data=>{
                console.log('okay')
              })
            }
          }else{
            localStorage.setItem('dl','true')
          }
        }
      }else{
        this.showspinner.setSpinner(false)
        localStorage.setItem("falg", 'true');
        if(memberData.data_workshop.vendorid==null){
          this.showspinner.setSpinner(false)
          localStorage.setItem('dl','false')
          if(localStorage.getItem('showpopup')=='true'){
            this.dialogService.OpenAccRemember('okay').subscribe(data=>{
              console.log('okay')
            })
          }
        }else{
          localStorage.setItem('dl','true')
        }
      }
      
    },err=>{
      this.showspinner.setSpinner(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
      localStorage.setItem("falg", 'true');
    })
  }
}
