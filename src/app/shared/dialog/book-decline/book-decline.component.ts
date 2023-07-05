import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl } from '@angular/forms';
import { UserserviceService } from '../../../services/userservice.service';
import { SpinnerService } from '../../../services/spinner.service';
import { GeneralService } from '../../../services/general.service';
@Component({
  selector: 'app-book-decline',
  templateUrl: './book-decline.component.html',
  styleUrls: ['./book-decline.component.css']
})
/**
 * In this file appoitment
 * booking decline section
 * and ask for the reason 
*/
export class BookDeclineComponent implements OnInit {
  name
  date
  time
  deliveryTimeField="09:00"
  resonadded:boolean=true
  bookingid
  bookingmode
  deliveryDateField
  maxDate
  deliveryDateFieldForAdd
  constructor(
    private showspinner:SpinnerService,
    private snakBar:MatSnackBar,
    private formbuild: FormBuilder,
    private general:GeneralService,
    private userService:UserserviceService,
    public dialogRef: MatDialogRef<BookDeclineComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.bookingid=data.bookingid
      this.bookingmode=data.mode
      const current = new Date();
      this.deliveryDateField=current
    this.deliveryDateFieldForAdd=current.getFullYear()+"-"+("0" + (current.getMonth()+1)).slice(-2)+"-"+("0" + current.getDate()).slice(-2)
  }
  ngOnInit() {
  }
  // chnage the time also
  deliveryTime(e){
    this.deliveryTimeField=this.convertTime12to24(e)
  }
  // convert datetime to 12 hr format
  convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
  }
  // Chnage the delivry date
  deliveryDate(e){
    var eventDate=new Date(e)
    this.deliveryDateFieldForAdd=eventDate.getFullYear()+"-"+("0" + (eventDate.getMonth()+1)).slice(-2)+"-"+("0" + eventDate.getDate()).slice(-2)
  }
  // get the data of booking
  getData(event){
    this.name=event
    if(this.name==''){
      this.resonadded=true
    }else{
      this.resonadded=false
    }
  }
  // decline or chnage the booking or not
  closePopup(event){
    var workshopid
    if(localStorage.getItem('check')){
      workshopid=localStorage.getItem('check')
    }else{
      workshopid=this.userService.getData()["workshop_id"]
    }
    if(event==true){
      if(this.bookingmode=='decline'){
        this.general.updateBookingStatusDecline(workshopid,this.bookingid,'decline',this.name).subscribe(verifyNo=>{
          if(verifyNo.success==true){
            var successdata
            successdata={"success":true,"data":this.name}
            this.dialogRef.close(successdata);
          }else{
            var successdata
            successdata={"success":true,"data":''}
            this.dialogRef.close(successdata);
          }
        },err=>{
          this.showspinner.setSpinner(false)
          this.snakBar.open("Message", "Error In Update Booking", {
            duration: 4000
          }) 
        })
      }else if(this.bookingmode=='res'){
        this.general.updateBooking(workshopid,this.bookingid,this.deliveryDateFieldForAdd,this.deliveryTimeField).subscribe(verifyNo=>{
          if(verifyNo.success==true){
            var successdata
            successdata={"success":true,"data":this.deliveryDateFieldForAdd+" "+this.deliveryTimeField}
            this.dialogRef.close(successdata);
          }else{
            var successdata
            successdata={"success":true,"data":''}
            this.dialogRef.close(successdata);
          }
        },err=>{
          this.showspinner.setSpinner(false)
          this.snakBar.open("Message", "Error In Update Booking", {
            duration: 4000
          }) 
        })
      }
    }else{
      this.dialogRef.close(event);
    }
  }
}
