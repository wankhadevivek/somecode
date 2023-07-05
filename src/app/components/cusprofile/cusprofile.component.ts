import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl } from '@angular/forms';
import { GeneralService } from '../../services/general.service';
import { UserserviceService } from '../../services/userservice.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { SpinnerService } from '../../services/spinner.service';
import  {ErrorMessgae}  from  '../../shared/error_message/error';
import { AbstractService } from '../../services/comman/abstract.service';
import { DilogOpenService } from '../../services/dilog-open.service';
import { EndUserLayoutComponent } from '../enduserlayout/enduserlayout.component';
@Component({
  selector: 'app-cusprofile',
  templateUrl: './cusprofile.component.html',
  styleUrls: ['./cusprofile.component.css']
})
/**
 * This component is used for
 * the end user layout app
 * to login or register the user 
*/
export class CusprofileComponent implements OnInit {
  workshopOnline
  showonlineservices
  showonlineservicestwo
  onlineserviceonename
  onlineserviceonedes
  onlineserviceoneamount
  onlineservicetwoname
  onlineservicetwodes
  onlineservicetwoamount
  workshopname
  workshoptiltle
  workshopaddress
  workshopemail
  workshopemailhref
  workshopverified
  workshoplogo
  settingsBillData
  termsandconditions
  showloginsection:boolean
  userdata
  customerform: FormGroup;
  vehform: FormGroup;
  urlparam
  paramforhome
  paramforservice
  paramforbooking
  jobcardListed:boolean
  jobcardData
  parmforbook 
  contactlink
  vehiclepic
  proclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro active"
  vehclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
  payclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
  aboutclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
  showprofile:boolean=true
  showvehicle:boolean=false
  showpayment:boolean=false
  showabout:boolean=false
  savebitton:boolean=true
  editbitton:boolean=false
  updatebutton:boolean=false
  showaddveh:boolean=true
  showaddvehform:boolean=false
  submitted = false;
  submittedveh = false;
  vehdata:boolean=false
  vehlist:boolean=true
  searchVehicleData= [];
  userworkshopid
  cusname
  cusnumber
  showduperror=''
  mainVehiclearr=Array()
  SelectedDataarrOfVehicle
  vehicelefinal
  vehiclesAllListArr=Array()
  duplicateArrofVehicles=Array()
  @ViewChild('myCanvass', { static: false }) myCanvass: ElementRef<HTMLCanvasElement>;
  constructor(private dialogservice:DilogOpenService,
    public abstract:AbstractService,
    private showspinner:SpinnerService,
    private router: Router,
    private snakBar:MatSnackBar,
    private formbuild: FormBuilder,
    private generalService: GeneralService,
    private userService:UserserviceService,
    public usercomp:EndUserLayoutComponent) { 
      if(localStorage.getItem('profileshow')){
        localStorage.removeItem('profileshow')
        this.showprofile=false
        this.showvehicle=true
        this.getcallonconstructor()
        this.userworkshopid=localStorage.getItem('check')
        this.proclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
        this.vehclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro active"
        this.payclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
        this.aboutclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
        this.showprofile=false
        this.showvehicle=true
        this.showpayment=false
        this.showabout=false
        this.getvehList()
      }else{

      }
  }
  //Load customer details
  ngOnInit() {
        if(localStorage.getItem('work_data')){
          this.getcallonconstructor()
          var data=JSON.parse(localStorage.getItem('work_data'))
          this.userworkshopid=data.workshop_id
          this.urlparam=data.url_param
          this.customerform = this.formbuild.group({
            name: ['', Validators.required],
            mobilenumber: ['', [Validators.required,Validators.pattern(/^[6-9]\d{9}$/)]],
            email: ['', Validators.email ],
            address: [''],
            state: [''],
            city: [''],
            pin: ['']
          });
          this.vehform= this.formbuild.group({
            serachvehicle: ['', Validators.required],
            vehiclenumber: ['', [ Validators.required,  Validators.pattern("^([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{1}[0-9]{4})|"+"^([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{1}[0-9]{4})|"
            +"([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{1}[0-9]{3})|([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{4})|" +
           "([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{3})|([a-zA-Z]{2}[0-9]{2}[-]{1}[0-9]{4})|" +
           "([a-zA-Z]{2}[0-9]{2}[-]{1}[0-9]{3})|([a-zA-Z]{3}[0-9]{4})|([a-zA-Z]{3}[0-9]{3})|" +
           "([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{3}[0-9]{4})|([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{3}[0-9]{3})|" +
           "([a-zA-Z]{2}[0-9]{3}[a-zA-Z]{1}[0-9]{4})$")]],
          });
          if(localStorage.getItem('is_register')=='true'){
            this.editbitton=true
            this.savebitton=false
            this.vehdata=true
            this.vehlist=true
            var enterstate
            var entercity
            var enterpin
            if(this.userdata.state!=null){
              enterstate=this.userdata.state
            }else{
              enterstate=''
            }
            if(this.userdata.city!=null){
              entercity=this.userdata.city
            }else{
              entercity=''
            }
            if(this.userdata.pincode!=null){
              enterpin=this.userdata.pincode
            }else{
              enterpin=''
            }
            this.cusname=this.userdata.customer_name
            this.cusnumber=this.userdata.customer_mobile
            this.customerform.controls["name"].setValue(this.userdata.customer_name,{onlySelf:true})
            this.customerform.controls["mobilenumber"].setValue(this.userdata.customer_mobile,{onlySelf:true})
            this.customerform.controls["email"].setValue(this.userdata.customer_email,{onlySelf:true})
            this.customerform.controls["address"].setValue(this.userdata.pick_up_address)
            this.customerform.controls["state"].setValue(enterstate)
            this.customerform.controls["city"].setValue(entercity)
            this.customerform.controls["pin"].setValue(enterpin)
            this.customerform.controls["name"].disable()
            this.customerform.controls["mobilenumber"].disable()
            this.customerform.controls["address"].disable()
            this.customerform.controls["pin"].disable()
            this.customerform.controls["city"].disable()
            this.customerform.controls["state"].disable()
            this.customerform.controls["email"].disable()
          }else{
            this.editbitton=false
            this.savebitton=true
            this.vehdata=false
            this.vehlist=false
            this.cusname='User'
            this.cusnumber=this.userdata.customer_mobile
            this.customerform.controls["mobilenumber"].setValue(this.userdata.customer_mobile,{onlySelf:true})
            this.customerform.controls["mobilenumber"].disable()
          }
        }else{
          this.workshopOnline=false
        }

  }
  //Edit the details
  editdetails(){
      this.editbitton=false
      this.savebitton=false
      this.updatebutton=true
      this.customerform.controls["name"].enable()
      this.customerform.controls["mobilenumber"].enable()
      this.customerform.controls["address"].enable()
      this.customerform.controls["pin"].enable()
      this.customerform.controls["city"].enable()
      this.customerform.controls["state"].enable()
      this.customerform.controls["email"].enable()
  }
  // Update the details
  updatedetails(){
    this.submitted = true;
    if (this.customerform.invalid) {
      return;
    }else{
      this.generalService.updateEndCustomerProfile(
        'update',this.userworkshopid,this.customerform.getRawValue().name,
        this.customerform.getRawValue().mobilenumber,this.customerform.getRawValue().email,
        this.customerform.getRawValue().address,this.customerform.getRawValue().state,
        this.customerform.getRawValue().city,this.customerform.getRawValue().pin,
        this.userdata.id
      ).subscribe(getCus=>{
        this.showspinner.setSpinnerForEnd(true)
        if(getCus.success==true){
          this.editbitton=true
          this.savebitton=false
          this.updatebutton=false
          this.userdata.customer_name=this.customerform.getRawValue().name
          this.userdata.customer_mobile=this.customerform.getRawValue().mobilenumber
          this.userdata.customer_email=this.customerform.getRawValue().email
          this.userdata.pick_up_address=this.customerform.getRawValue().address
          this.userdata.state=this.customerform.getRawValue().state
          this.userdata.city=this.customerform.getRawValue().city
          this.userdata.pincode=this.customerform.getRawValue().pin
          localStorage.setItem('enduser',JSON.stringify(this.userdata))
          if(this.userdata.vehicle_number!='false'){
            localStorage.setItem('is_register','true')
          }else{
            localStorage.setItem('is_register','false')
          }
          this.cusname=this.customerform.getRawValue().name
          this.cusnumber=this.customerform.getRawValue().mobilenumber
          this.customerform.controls["name"].disable()
          this.customerform.controls["mobilenumber"].disable()
          this.customerform.controls["address"].disable()
          this.customerform.controls["pin"].disable()
          this.customerform.controls["city"].disable()
          this.customerform.controls["state"].disable()
          this.customerform.controls["email"].disable()
        }
        this.showspinner.setSpinnerForEnd(false)
      },err=>{
        this.showspinner.setSpinnerForEnd(false)
        this.snakBar.open("Error", ErrorMessgae[0][err], {
          duration: 4000
        })
      })
    }
  }
  // Save the details
  savedetails(){
    this.submitted = true;
    if (this.customerform.invalid) {
      return;
    }else{
      this.customerform.controls["name"].disable()
      this.customerform.controls["mobilenumber"].disable()
      this.customerform.controls["address"].disable()
      this.customerform.controls["pin"].disable()
      this.customerform.controls["city"].disable()
      this.customerform.controls["state"].disable()
      this.customerform.controls["email"].disable()
    }
  }
  //Add the vechicle of the customer
  addveh(){
    this.showaddveh=false
    this.showaddvehform=true
    this.vehdata=true
    this.vehlist=false
    this.showduperror=''
  }
  // Vehilce added in the list
  vehicleAdded(){
    if(this.userdata.customer_name=='User'){
      this.showduperror="Need To Complete Profile First"
    }else{
      this.showduperror=''
      this.submittedveh = true;
      if (this.vehform.invalid) {
        return;
      }else{
        this.generalService.saveEndCustomerProfile(
          'create',this.userworkshopid,this.customerform.getRawValue().name,
          this.customerform.getRawValue().mobilenumber,this.customerform.getRawValue().email,
          this.customerform.getRawValue().address,this.customerform.getRawValue().state,
          this.customerform.getRawValue().city,this.customerform.getRawValue().pin,
          this.vehform.getRawValue().vehiclenumber,this.vehicelefinal.vehicle_type,
          this.vehicelefinal.make,this.vehicelefinal.model,this.vehicelefinal.variant
        ).subscribe(getCus=>{
          this.showspinner.setSpinnerForEnd(true)
          if(getCus.success==true){
            this.showaddveh=true
            this.showaddvehform=false
            this.showduperror=''
            this.vehdata=true
            this.vehlist=true
            this.duplicateArrofVehicles.unshift(this.vehform.getRawValue().vehiclenumber)
              this.vehiclesAllListArr.unshift({
                "vehicleNO":this.vehform.getRawValue().vehiclenumber,
                'Vehiclemake': this.vehicelefinal.make+" "+this.vehicelefinal.model+" "+this.vehicelefinal.variant,
                'phone':this.userdata.customer_mobile,
                'name':this.userdata.customer_name,
                'date':new Date(),
                'id':this.userdata.id,
                'due':'No',
                'darefalg':'false'
              })
            if(this.userdata.vehicle_number!='false'){
              localStorage.setItem('is_register','true')
            }else{
              this.userdata.vehicle_number=this.vehform.getRawValue().vehiclenumber
              this.userdata.vehicle_model=this.vehicelefinal.model
              this.userdata.vehicle_make=this.vehicelefinal.make
              this.userdata.vehicle_type=this.vehicelefinal.vehicle_type
              this.userdata.vehicle_variant=this.vehicelefinal.variant
              localStorage.setItem('enduser',JSON.stringify(this.userdata))
              localStorage.setItem('is_register','true')
            }
          }else{
            if(getCus.message=="Vehicle"){
              this.showduperror="Vehicle "+ this.vehform.getRawValue().vehiclenumber +" Allready in your List"
            }
          }
          this.showspinner.setSpinnerForEnd(false)
        },err=>{
          this.showspinner.setSpinnerForEnd(false)
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000
          })
        })
        
      }
    }
  }
  // Cancel the vehicle add Action
  caceladd(){
    this.showaddveh=true
    this.showaddvehform=false
    this.showduperror=''
    if(localStorage.getItem('is_register')=='true'){
      this.vehdata=true
      this.vehlist=true
    }else{
      this.vehdata=false
      this.vehlist=false
    }
  }
  // Open form of the vehcile
  openForm(data){
    this.usercomp.bookingIcon()
    localStorage.setItem('vehdata',JSON.stringify(data))
    this.router.navigate(['/cus/'+this.urlparam+'/book']);
  }
  //Search for the vehicle
  searchBarForVechile(event){
    this.generalService.getAllVehicleDetails(event).subscribe(searchData=>{
      this.showspinner.setSpinnerForEnd(true)
      if(searchData["success"]==true){
        this.searchVehicleData=[]
        this.mainVehiclearr=[]
        searchData["vhicledetails"].map(data=>{
          this.searchVehicleData.push(data["make"]+"  "+data["model"]+"  "+data["variant"])
          this.mainVehiclearr.push(data)
        })
        this.showspinner.setSpinnerForEnd(false)
      }else{
        this.searchVehicleData=[]
        this.searchVehicleData.push("No Vehicle Found")
        this.mainVehiclearr=[]
        this.showspinner.setSpinnerForEnd(false)
        this.snakBar.open("Message", ErrorMessgae[0][searchData["message"]], {
          duration: 4000
        })
      }
    },err=>{
      this.showspinner.setSpinnerForEnd(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
  }
  //Selected the search result
  selectedResultForVechile(event){
    if(event!=undefined)
    {
      this.vehform.controls["serachvehicle"].setValue(event,{onlySelf:true})
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
  //Get all customers data
  getcallonconstructor(){
    if(localStorage.getItem('enduser')){
      this.showloginsection=true
      this.userdata=JSON.parse(localStorage.getItem('enduser'))
    }else{
      this.showloginsection=false
      this.openVerifyData()
    }
  }
  // Verift the data
  openVerifyData(){
    this.dialogservice.openEndUserLogin('true').subscribe(data=>{
      if(data=='trueokay'){
        this.showloginsection=true
        this.usercomp.homeIcon()
        this.router.navigate(['/cus/'+this.urlparam]);
      }else if(data=='truenotokay'){
        this.showloginsection=true
        this.usercomp.profileIcon()
      }else{
        this.showloginsection=false
      }
      // this.ngOnInit()
      // this.usercomp.ngOnInit()
    })
  }
  // Logout from the end-user app
  signout(){
    localStorage.removeItem('enduser');
    //localStorage.removeItem('check');
    //localStorage.removeItem('work_data');
    localStorage.removeItem('is_register');
    localStorage.removeItem('urltore');
    this.usercomp.homeIcon()
    this.router.navigate(['/cus/'+this.urlparam]);
    //location.reload()
  }
  // Check the calss while tabing between rhe other tabs 
  checkacticeclass(checkclas){
    if(checkclas=='profile'){
      this.proclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro active"
      this.vehclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.payclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.aboutclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.showprofile=true
      this.showvehicle=false
      this.showpayment=false
      this.showabout=false
    }else if(checkclas=='vehicle'){
      this.proclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.vehclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro active"
      this.payclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.aboutclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.showprofile=false
      this.showvehicle=true
      this.showpayment=false
      this.showabout=false
      this.getvehList()
    }else if(checkclas=='payment'){
      this.proclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.vehclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.payclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro active"
      this.aboutclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.showprofile=false
      this.showvehicle=false
      this.showpayment=true
      this.showabout=false
    }else if(checkclas=='about'){
      this.proclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.vehclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.payclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.aboutclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro active"
      this.showprofile=false
      this.showvehicle=false
      this.showpayment=false
      this.showabout=true
    }
  }
  // Get vehicle lISt
  getvehList(){
    this.showduperror=''
    this.vehiclesAllListArr=[]
    this.duplicateArrofVehicles=[]
    this.showaddvehform=false
    this.generalService.vehListProfile(this.userworkshopid,this.userdata.customer_mobile).subscribe(dataveh=>{
      if(dataveh.success==true){
        if(dataveh["customer"].length!=0){
          this.vehdata=true
          this.vehlist=true
          dataveh["customer"].map(data=>{
            if(!this.duplicateArrofVehicles.includes(data.vehicle_number))
            {
              if(data.estimated_delivery_datetime!=null&&data.estimated_delivery_datetime!=""){
                var currentdate = new Date(data.estimated_delivery_datetime);
                var reminderperioddate = new Date(currentdate.setMonth(currentdate.getMonth() + parseInt((data.reminder).split(' ')[0])));
                var todayDate= new Date()
                var diffdate=this.DaysBetween(todayDate,reminderperioddate)
                var daysago='fsdfsd'
                var darefalg='true'
                if(diffdate>0){
                  daysago="due in "+ diffdate.toString() +" Days"
                  darefalg='true'
                }else{
                  daysago="due "+ diffdate.toString().replace(/-(?=\d)/,"") +" Days ago"
                  darefalg='false'
                }
              }else{
                darefalg='false'
                daysago="No"
                reminderperioddate=new Date()
              }
              
              this.duplicateArrofVehicles.push(data.vehicle_number)
              this.vehiclesAllListArr.push({
                "vehicleNO":data.vehicle_number,
                'Vehiclemake': data.make+" "+data.model+" "+data.varriant,
                'phone':this.userdata.customer_mobile,
                'name':this.userdata.customer_name,
                'date':reminderperioddate,
                'id':this.userdata.id,
                'due':daysago,
                'darefalg':darefalg
              })
            }
          })
        }else{
          this.vehdata=false
          this.vehlist=false
        }
      }else{
        this.vehdata=false
        this.vehlist=false
      }
    },err=>{
      this.showspinner.setSpinnerForEnd(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
  }
  //Calculate the days
  DaysBetween(StartDate, EndDate) {
    // The number of milliseconds in all UTC days (no DST)
    const oneDay = 1000 * 60 * 60 * 24;
  
    // A day in UTC always lasts 24 hours (unlike in other time formats)
    const start = Date.UTC(EndDate.getFullYear(), EndDate.getMonth(), EndDate.getDate());
    const end = Date.UTC(StartDate.getFullYear(), StartDate.getMonth(), StartDate.getDate());
  
    // so it's safe to divide by 24 hours
    return (start - end) / oneDay;
  }
}
