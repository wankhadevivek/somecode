import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { DilogOpenService } from '../../../services/dilog-open.service';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { GeneralService } from '../../../services/general.service';
import { UserserviceService } from '../../../services/userservice.service';
import { SpinnerService } from '../../../services/spinner.service';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import  {ErrorMessgae}  from  '../../error_message/error';
import { NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { timingSafeEqual } from 'crypto'; 
import { PrintsharepdfService } from '../../../services/printsharepdf.service';
import { LasthistoryService } from '../../../services/lasthistory.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule } from 'saturn-datepicker'
import { AppDateAdapter, APP_DATE_FORMATS} from '../../model/date/date.adapter';
import { AbstractService } from '../../../services/comman/abstract.service';
import { MatSliderChange } from '@angular/material';
import {coerceNumberProperty} from '@angular/cdk/coercion';
@Component({
  selector: 'app-appoitment-booking',
  templateUrl: './appoitment-booking.component.html',
  styleUrls: ['./appoitment-booking.component.css'],
  providers: [
    {
        provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
    ]
})
/**
 * In this file appoitemnt is booked
 * by the workshop woser
 * itself
*/
export class AppoitmentBookingComponent implements OnInit {
  inputcolor="#fff"
  searchVehicleData= [];
  vehiclesearchmodel
  maxDate
  deliveryDateField
  deliveryTimeField="09:00"
  userworkshopid
  CreateCustomerFormBooking: FormGroup;
  time11="select-timeendweb"
  time12="select-timeendweb active"
  time13="select-timeendweb" 
  time14="select-timeendweb"
  time15="select-timeendweb"
  SelectedDataarrOfVehicle
  vehicelefinal
  mainVehiclearr=Array()
  samePickup:boolean=false
  deliveryDateFieldForAdd
  shoeupdate:boolean=false
  showdisbale:boolean=false
  vehiclenumberset
  dropcheck:boolean=false
  pickcheck:boolean=true
  constructor(@Inject(MAT_DIALOG_DATA) public data,
  public historyService:LasthistoryService,
  public sendPDF:PrintsharepdfService,
  public abstract:AbstractService,
  private config: NgbDatepickerConfig,
  private snakBar:MatSnackBar,
  private showspinner:SpinnerService,
  private general:GeneralService,
  private userService:UserserviceService,
  private formbuild: FormBuilder,
  private dialogservice:DilogOpenService,
  public dialogRef: MatDialogRef<AppoitmentBookingComponent>) {
    this.createCustomerBooking()
    this.userworkshopid=this.userService.getData()["workshop_id"]
    const current = new Date();
    const oneMonth=new Date(); 
    this.deliveryDateField=current
    this.deliveryDateFieldForAdd=current.getFullYear()+"-"+("0" + (current.getMonth()+1)).slice(-2)+"-"+("0" + current.getDate()).slice(-2)
   }
  ngOnInit() {
  }
  //update or add time
  time1(){
    this.time11="select-timeendweb active"
    this.time12="select-timeendweb"
    this.time13="select-timeendweb"
    this.time14="select-timeendweb"
    this.time15="select-timeendweb"
    this.deliveryTimeField="08:30"
  }
  //update or add time
  time2(){
    this.time11="select-timeendweb"
    this.time12="select-timeendweb active"
    this.time13="select-timeendweb"
    this.time14="select-timeendweb"
    this.time15="select-timeendweb"
    this.deliveryTimeField="09:00"
  }
  //update or add time
  time3(){
    this.time11="select-timeendweb"
    this.time12="select-timeendweb"
    this.time13="select-timeendweb active"
    this.time14="select-timeendweb"
    this.time15="select-timeendweb"
    this.deliveryTimeField="09:30"
  }
  //update or add time
  time4(){
    this.time11="select-timeendweb"
    this.time12="select-timeendweb"
    this.time13="select-timeendweb"
    this.time14="select-timeendweb active"
    this.time15="select-timeendweb"
    this.deliveryTimeField="10:00"
  }
  //update or add time
  time5(){
    this.time11="select-timeendweb"
    this.time12="select-timeendweb"
    this.time13="select-timeendweb"
    this.time14="select-timeendweb"
    this.time15="select-timeendweb active"
    this.deliveryTimeField="10:30"
  }
  // Customer form with validations
  createCustomerBooking(){
    this.CreateCustomerFormBooking=this.formbuild.group({
      vechilenumber: ['', [ Validators.required,  Validators.pattern("^([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{1}[0-9]{4})|"+"^([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{1}[0-9]{4})|"
      +"([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{1}[0-9]{3})|([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{4})|" +
     "([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{3})|([a-zA-Z]{2}[0-9]{2}[-]{1}[0-9]{4})|" +
     "([a-zA-Z]{2}[0-9]{2}[-]{1}[0-9]{3})|([a-zA-Z]{3}[0-9]{4})|([a-zA-Z]{3}[0-9]{3})|" +
     "([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{3}[0-9]{4})|([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{3}[0-9]{3})|" +
     "([a-zA-Z]{2}[0-9]{3}[a-zA-Z]{1}[0-9]{4})$")] ],
      customername: ['' , Validators.required ],
      cusid: '',
      searchVehicle:[''],
      mobileOneNo: ['', [ Validators.required, Validators.pattern(/^[6-9]\d{9}$/)] ],
      mobileTwoNo: ['', Validators.pattern(/^[6-9]\d{9}$/) ],
      email: ['', [Validators.email] ],
      dropaddress:[''],
      pickupaddress:[''],
      varri:[null],
      type:[null],
      model:[null],
      make:[null],
      twowheetertype:['']
    });
  }
  //Search vehicle dateilas on eneter vehilce number
  selectedResultForVechile(event){
    if(event!=undefined)
    {
      this.vehiclesearchmodel=event
      var splitedevent=event.split("  ")
      this.mainVehiclearr.map(selecteData=>{
        if(splitedevent[0]==selecteData.make && splitedevent[1]==selecteData.model && splitedevent[2]==selecteData.variant ){
          this.vehicelefinal={}
          this.vehicelefinal={
            "make":selecteData.make,
            "model":selecteData.model,
            "variant":selecteData.variant,
            "vehicle_type":selecteData.vehicle_type,
            "type":selecteData.type
          }
        }
      })
    }
  }
  // Search vehicle name
  searchBarForVechile(event){
    this.general.getAllVehicleDetails(event).subscribe(searchData=>{
      this.showspinner.setSpinnerForLogin(true)
      if(searchData["success"]==true){
        this.searchVehicleData=[]
        this.mainVehiclearr=[]
        searchData["vhicledetails"].map(data=>{
          this.searchVehicleData.push(data["make"]+"  "+data["model"]+"  "+data["variant"])
          this.mainVehiclearr.push(data)
        })
        this.showspinner.setSpinnerForLogin(false)
      }else{
        this.searchVehicleData=[]
        this.searchVehicleData.push("No Vehicle Found")
        this.mainVehiclearr=[]
        this.showspinner.setSpinnerForLogin(false)
        this.snakBar.open("Message", ErrorMessgae[0][searchData["message"]], {
          duration: 4000
        })
      }
    },err=>{
      this.showspinner.setSpinnerForLogin(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
  }
  // Same as pickup address checkbox
  sameAsPickupAddress(values:any){
    if(values.currentTarget.checked==true){
      this.samePickup=true
    }else{
      this.samePickup=false
    }
  }
  // delivery time
  deliveryTime(e){
    this.deliveryTimeField=this.convertTime12to24(e)
  }
  // delivery time convert to 12 hr format
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
  // delivery date
  deliveryDate(e){
    var eventDate=new Date(e)
    this.deliveryDateFieldForAdd=eventDate.getFullYear()+"-"+("0" + (eventDate.getMonth()+1)).slice(-2)+"-"+("0" + eventDate.getDate()).slice(-2)
    
  }
  // Close popup
  closePopup(e){
    this.dialogRef.close('false')
  }
  // Create a booking
  createbooking(){
    if(this.CreateCustomerFormBooking.getRawValue().cusid=="")
    {
      if(this.CreateCustomerFormBooking.value.mobileOneNo==""){
        this.CreateCustomerFormBooking.value.mobileOneNo=0
      }else{
        this.CreateCustomerFormBooking.value.mobileOneNo=parseInt(this.CreateCustomerFormBooking.value.mobileOneNo)
      }
      if(this.CreateCustomerFormBooking.value.mobileTwoNo==""){
        this.CreateCustomerFormBooking.value.mobileTwoNo=0
      }else{
        this.CreateCustomerFormBooking.value.mobileTwoNo=parseInt(this.CreateCustomerFormBooking.value.mobileTwoNo)
      }
      var vehiclelistdata
      if(this.vehicelefinal.vehicle_type.variant){
        vehiclelistdata={
          "make":this.vehicelefinal.make,
          "model":this.vehicelefinal.model,
          "variant":this.vehicelefinal.variant,"vehicle_type":this.vehicelefinal.vehicle_type,"type":""
        }
      }else{
        vehiclelistdata={
          "make":this.vehicelefinal.make,
          "model":this.vehicelefinal.model,
          "variant":'',"vehicle_type":this.vehicelefinal.vehicle_type,"type":""
        }
      }

      this.general.saveCustomerProfile('create',this.CreateCustomerFormBooking.value.vechilenumber,'',this.vehicelefinal.vehicle_type,
    this.vehicelefinal.make,this.vehicelefinal.model, this.vehicelefinal.variant,this.CreateCustomerFormBooking.value.customername,
    this.CreateCustomerFormBooking.value.mobileOneNo,this.CreateCustomerFormBooking.value.mobileTwoNo,
    this.CreateCustomerFormBooking.value.email,'',this.CreateCustomerFormBooking.value.pickupaddress,
    this.CreateCustomerFormBooking.value.dropaddress,'',
    '','',0,'','',this.userworkshopid).subscribe(saveCustomer=>{
      this.showspinner.setSpinnerForLogin(true)
      if(saveCustomer["success"]==true){
        this.CreateCustomerFormBooking.controls["cusid"].setValue(saveCustomer.customer.id,{onlySelf:true})
        this.bookService()
      }else{
        this.snakBar.open("message", "Issue in adding Customer", {
          duration: 4000
        })  
      }
    },err=>{
      this.showspinner.setSpinnerForLogin(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
    }else{
      this.bookService()
    }
  }
  // booking services
  bookService(){
    var pickve
    var dropve
    if(this.pickcheck==true){
      pickve='yes'
    }
    else{
      pickve='no'
    }
    if(this.dropcheck==true){
      dropve='yes'
    }
    else{
      dropve='no'
    }
    var mainVehicl
    mainVehicl={"make": this.vehicelefinal.make,"model":this.vehicelefinal.model,"variant":this.vehicelefinal.variant,"vehicle_type":this.vehicelefinal.vehicle_type,"type":""}
    this.general.saveBooking(this.userworkshopid,
      this.CreateCustomerFormBooking.getRawValue().customername,
      this.CreateCustomerFormBooking.getRawValue().mobileOneNo,
      '0',
      this.CreateCustomerFormBooking.getRawValue().email,
      '',
      this.CreateCustomerFormBooking.getRawValue().dropaddress,
      this.CreateCustomerFormBooking.getRawValue().pickupaddress,
      this.vehiclenumberset,
      JSON.stringify(mainVehicl),
      this.deliveryDateFieldForAdd,
      this.deliveryTimeField,
      '[]',
      this.CreateCustomerFormBooking.getRawValue().cusid,
      pickve,
      dropve,
      this.CreateCustomerFormBooking.value.cusid,this.userService.getData()["workshop_name"],this.userService.getData()["workshop_mobile_number_1"],
      'maual').subscribe(savedBook=>{
        this.showspinner.setSpinnerForLogin(true)
        if(savedBook.success==true){
          this.snakBar.open("Message", "Booking Saved", {
            duration: 4000
          })
          this.dialogRef.close('true')
        }else{
          this.snakBar.open("Message", "Booking Not Saved", {
            duration: 4000
          })
        }
        this.showspinner.setSpinnerForLogin(false)
    },err=>{
      this.showspinner.setSpinnerForLogin(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
  }
  // Search for vehicles
  searchVehicleNumber(event){ 
    this.vehiclenumberset=event
    this.general.getVechileCustomerDetail(this.userworkshopid,event,"by_vehicle").subscribe(customerDetail=>{
      this.showspinner.setSpinnerForLogin(true)
      if(customerDetail.success==true){
        this.showdisbale=true
                this.shoeupdate=false
        this.CreateCustomerFormBooking.controls["vechilenumber"].setValue(customerDetail.customer.vehicle_number,{onlySelf:true})
        
        
        this.vehicelefinal=
        {"vehicle_type":customerDetail.customer.vehicle_type,
        "make":customerDetail.customer.vehicle_make,
        "model":customerDetail.customer.vehicle_model,
        
        "variant":customerDetail.customer.vehicle_variant}
        this.CreateCustomerFormBooking.controls["customername"].setValue(customerDetail.customer.customer_name,{onlySelf:true})
        this.CreateCustomerFormBooking.controls["cusid"].setValue(customerDetail.customer.id,{onlySelf:true})
        this.CreateCustomerFormBooking.controls["mobileOneNo"].setValue(customerDetail.customer.customer_mobile,{onlySelf:true})
        this.CreateCustomerFormBooking.controls["mobileOneNo"].setValue(customerDetail.customer.customer_mobile,{onlySelf:true})
        if(customerDetail.customer.customer_mobile_2!=0){
          this.CreateCustomerFormBooking.controls["mobileTwoNo"].setValue(customerDetail.customer.customer_mobile_2,{onlySelf:true})
        }
        this.CreateCustomerFormBooking.controls["email"].setValue(customerDetail.customer.customer_email,{onlySelf:true})
        
        this.CreateCustomerFormBooking.controls["pickupaddress"].setValue(customerDetail.customer.pick_up_address,{onlySelf:true})
        this.CreateCustomerFormBooking.controls["dropaddress"].setValue(customerDetail.customer.drop_address,{onlySelf:true})
        this.inputcolor='#d2d0d0'
        this.CreateCustomerFormBooking.controls["vechilenumber"].disable()
        this.CreateCustomerFormBooking.controls["customername"].disable()
        this.CreateCustomerFormBooking.controls["mobileOneNo"].disable()
        this.CreateCustomerFormBooking.controls["searchVehicle"].disable()
        this.CreateCustomerFormBooking.controls["mobileTwoNo"].disable()
        this.CreateCustomerFormBooking.controls["email"].disable()
        this.CreateCustomerFormBooking.controls["pickupaddress"].disable()
        this.CreateCustomerFormBooking.controls["dropaddress"].disable()
      }
      this.showspinner.setSpinnerForLogin(false)
    },err=>{
      this.showspinner.setSpinnerForLogin(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
  }
  // Remove the disable to edit
  removedisable(){
    this.shoeupdate=true
    this.showdisbale=false
    this.inputcolor='#fff'
    this.CreateCustomerFormBooking.controls["vechilenumber"].enable()
    this.CreateCustomerFormBooking.controls["customername"].enable()
    this.CreateCustomerFormBooking.controls["mobileOneNo"].enable()
    this.CreateCustomerFormBooking.controls["searchVehicle"].enable()
    this.CreateCustomerFormBooking.controls["mobileTwoNo"].enable()
    this.CreateCustomerFormBooking.controls["email"].enable()
    this.CreateCustomerFormBooking.controls["pickupaddress"].enable()
    this.CreateCustomerFormBooking.controls["dropaddress"].enable()
  }
  // Cancek the edit customer details
  cancelupdatecustomerdetails(){
    this.shoeupdate=false
      this.showdisbale=true
      this.inputcolor='#d2d0d0'
      this.CreateCustomerFormBooking.controls["vechilenumber"].disable()
        this.CreateCustomerFormBooking.controls["customername"].disable()
        this.CreateCustomerFormBooking.controls["mobileOneNo"].disable()
        this.CreateCustomerFormBooking.controls["searchVehicle"].disable()
        this.CreateCustomerFormBooking.controls["mobileTwoNo"].disable()
        this.CreateCustomerFormBooking.controls["email"].disable()
        this.CreateCustomerFormBooking.controls["pickupaddress"].disable()
        this.CreateCustomerFormBooking.controls["dropaddress"].disable()
  }
  // Update the customer details
  updatecustomerdetails(){
    if(this.CreateCustomerFormBooking.value.mobileOneNo==""){
      this.CreateCustomerFormBooking.value.mobileOneNo=0
    }else{
      this.CreateCustomerFormBooking.value.mobileOneNo=parseInt(this.CreateCustomerFormBooking.value.mobileOneNo)
    }
    if(this.CreateCustomerFormBooking.value.mobileTwoNo==""){
      this.CreateCustomerFormBooking.value.mobileTwoNo=0
    }else{
      this.CreateCustomerFormBooking.value.mobileTwoNo=parseInt(this.CreateCustomerFormBooking.value.mobileTwoNo)
    }
    
    this.general.saveCustomerProfile('update',this.vehiclenumberset
    ,'',this.vehicelefinal.vehicle_type,
    this.vehicelefinal.make,this.vehicelefinal.model,
    this.vehicelefinal.variant,this.CreateCustomerFormBooking.value.customername,
    this.CreateCustomerFormBooking.value.mobileOneNo,this.CreateCustomerFormBooking.value.mobileTwoNo,
    this.CreateCustomerFormBooking.value.email,'',this.CreateCustomerFormBooking.value.pickupaddress,
    this.CreateCustomerFormBooking.value.dropaddress,'',
    '','',0,'','',this.userworkshopid).subscribe(saveCustomer=>{
      this.showspinner.setSpinnerForLogin(true)
      if(saveCustomer["success"]==true){
        this.CreateCustomerFormBooking.controls["cusid"].setValue(saveCustomer["customer"]["id"],{onlySelf:true})
        this.snakBar.open("Customer Data Updated", "", {
          duration: 4000
        })
        this.shoeupdate=false
        this.showdisbale=true
        this.inputcolor='#d2d0d0'
        this.CreateCustomerFormBooking.controls["vechilenumber"].disable()
        this.CreateCustomerFormBooking.controls["customername"].disable()
        this.CreateCustomerFormBooking.controls["mobileOneNo"].disable()
        this.CreateCustomerFormBooking.controls["searchVehicle"].disable()
        this.CreateCustomerFormBooking.controls["mobileTwoNo"].disable()
        this.CreateCustomerFormBooking.controls["email"].disable()
        this.CreateCustomerFormBooking.controls["pickupaddress"].disable()
        this.CreateCustomerFormBooking.controls["dropaddress"].disable()
        this.showspinner.setSpinnerForLogin(false)
      }else{
        this.CreateCustomerFormBooking.controls["cusid"].setValue(saveCustomer["customer"]["id"],{onlySelf:true})
        
        this.shoeupdate=false
        this.showdisbale=true
        this.inputcolor='#d2d0d0'
        this.CreateCustomerFormBooking.controls["vechilenumber"].disable()
        this.CreateCustomerFormBooking.controls["customername"].disable()
        this.CreateCustomerFormBooking.controls["mobileOneNo"].disable()
        this.CreateCustomerFormBooking.controls["searchVehicle"].disable()
        this.CreateCustomerFormBooking.controls["mobileTwoNo"].disable()
        this.CreateCustomerFormBooking.controls["email"].disable()
        this.CreateCustomerFormBooking.controls["pickupaddress"].disable()
        this.CreateCustomerFormBooking.controls["dropaddress"].disable()
        this.showspinner.setSpinnerForLogin(false)
        this.snakBar.open("Message", "Please Create Jobcard", {
          duration: 4000
        })
      }
    },err=>{
      this.showspinner.setSpinnerForLogin(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
  }
  // Change the pick to drop
  changepicktodrop(values:any){
    if(values.currentTarget.checked==true){
      this.pickcheck=true
      this.dropcheck=false
    }else{
      this.pickcheck=true
      this.dropcheck=false
    }
  }
  // Change the drop to pick
  cheangedroptopic(values:any){
    if(values.currentTarget.checked==true){
      this.dropcheck=true
      this.pickcheck=false
    }else{
      this.dropcheck=true
      this.pickcheck=false
    }
  }
}