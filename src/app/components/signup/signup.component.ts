import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router"
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { GeneralService } from '../../services/general.service';
import { User } from '../../shared/model/user/user.module';
import { UserserviceService } from '../../services/userservice.service';
import { SpinnerService } from '../../services/spinner.service';
import  {ErrorMessgae}  from  '../../shared/error_message/error';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { Address as gAddress} from "ngx-google-places-autocomplete/objects/address";
import { AddressComponent as gAddressComponent } from "ngx-google-places-autocomplete/objects/addressComponent";
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

/**
 * This component is user for the
 * Register of workshop
 * Workshop Registration form 
*/
export class SignupComponent implements OnInit {
  wrongOtpError:boolean=false
  shwootp:boolean=false
  showerror:boolean=false
  timerfalse:boolean=false
  submitted = false;
  outPut
  vechileType: Array<any> = [
    { name: '2W', value: '2W', checked:false },
    { name: '3W', value: '3W', checked:false },
    { name: '4W', value: '4W', checked:false },
    { name: '6W', value: '6W', checked:false }
  ];
  timeLeft: number=60;
  interval;
  userObject=<User>{}
  otpGetFromAPI;
  myForm: FormGroup;
  otpForm:FormGroup;
  autocomplete: google.maps.places.Autocomplete;
  formattedaddress=" ";
  options={
    componentRestrictions:{
      country:["AU"]
    }
  }

  lat = '';
  lng = '';
  latlang: any;
  mapAddress : any;
  houseNumber = '';
  street = '';
  mapCity = '';
  mapState = '';
  mapCountry = '';
  mapPaostalCode = '';
  countryData : any;
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.Indonesia, CountryISO.Myanmar, CountryISO.Philippines];

  country_code = '';
  country_currency = '';
  primary_language = "English"
  countryError :boolean=false


  constructor(private showspinner:SpinnerService,
    private router: Router,
    private snakBar:MatSnackBar,
    private formbuild: FormBuilder,
    private general:GeneralService,
    private userService:UserserviceService) { 
    if(localStorage.getItem('user')){
      this.router.navigate(['jobcards']);
    }else{
      this.router.navigate(['signup']);
    }
    this.reactiveForm();
    this.showOtpform();
  }
  // Load Reactive form
  ngOnInit() {
    this.showspinner.setSpinnerForLogin(true);
    this.showspinner.setSpinnerForLogin(false);
    this.getLocation();
  }
 // Form validation
 reactiveForm() {
  this.myForm = this.formbuild.group({
    firstname: ['', [Validators.required,Validators.pattern(/^[a-zA-Z\s]*$/)] ],
    workshopname: ['', [Validators.required] ],
    rtono: ['', [Validators.required,Validators.pattern(/^[A-Za-z]{2}[0-9]{2}$/)] ],
    phonenumber: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email] ],
    zipcode: ['',  Validators.pattern(/^[0-9]*$/) ],
    isTosRead:[false, Validators.pattern('true')],
    vechiletypes:this.formbuild.array([], [Validators.required]),
    vechiletypesnotselected: [''],
    lastname:['',Validators.pattern(/^[a-zA-Z\s]*$/)],
    address:[''],
    state:[''],
    city:[''],
    phonenumbertwo:[''],
    country_name:[''],
    country_code:[''],
    country_currency:[''],
    primary_language:['']
  });
}


  // Sunit workshop details form amd get OTP
  submitForm() { 
    this.userObject = {};
    this.submitted = true;
    if (this.myForm.invalid) {
      const invalid = [];
      const controls = this.myForm.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              invalid.push(name);
          }
      }
      console.log("iam here invalid>>",invalid)
      return;
    }else{
      this.otpGetFromAPI=""
      this.timeLeft=60
      this.timerfalse=false
      this.general.getOtpForRegister(this.myForm.value.phonenumber.number).subscribe(registerData=>{
        this.showspinner.setSpinnerForLogin(true)
        if(registerData.success==false){
          
          this.showspinner.setSpinnerForLogin(false)
          this.snakBar.open("Message", ErrorMessgae[0][registerData.message], {
            duration: 4000
          })
          this.router.navigate(['login'])
          this.shwootp=false
        }else if(registerData.success==true){
          this.getCountryData();
          this.showspinner.setSpinnerForLogin(false)
          this.outPut=registerData.output
          this.otpGetFromAPI=registerData.otp
          this.shwootp=true
          this.interval = setInterval(() => {
            if(this.timeLeft > 0) {
              this.timeLeft--;
            } else {
              this.timerfalse=true
            }
          },1000)
        }
      }, error => {
        this.showspinner.setSpinnerForLogin(false)
        this.snakBar.open("Error", ErrorMessgae[0][error], {
          duration: 4000
        })
      });
    }
  }
  // Submit form and verify OTP and login and register
  submitFormForRegister(){

    this.general.verifyOTP(this.myForm.value.phonenumber.number,this.otpForm.value.otp).subscribe(msgData=>{
      if(msgData["type"]=="success"){
        this.wrongOtpError=false
        var w2
        var w3
        var w4
        var w6
        var pincode
        var temsAndCondition
        var phoneNoTwo
        if(this.myForm.value.isTosRead==true){
          temsAndCondition=1
        }else{
          temsAndCondition=0
        }
        if(this.myForm.value.phonenumbertwo==""){
          phoneNoTwo="0"
        }else{
          if(this.myForm.value.phonenumbertwo){
            phoneNoTwo=this.myForm.value.phonenumbertwo.number
          }else{
            phoneNoTwo="0"
          }
        }
        if(this.myForm.value.zipcode==""){
          pincode="0"
        }else{
          pincode=this.myForm.value.zipcode || this.mapPaostalCode
        }
        if(this.myForm.value.vechiletypes.includes("2W")){
          w2=1
        }else{
          w2=0
        }
        if(this.myForm.value.vechiletypes.includes("3W")){
          w3=1
        }else{
          w3=0
        }
        if(this.myForm.value.vechiletypes.includes("4W")){
          w4=1
        }else{
          w4=0
        }
        if(this.myForm.value.vechiletypes.includes("6W")){
          w6=1
        }else{
          w6=0
        }
        var passNull = this.otpForm.value.password;
        var city = this.mapCity || this.myForm.value.city;
        var state = this.mapState || this.myForm.value.state;
        var country = this.mapCountry || this.myForm.value.country_name;
        var role = '';

        this.general.registerUser(this.myForm.value.email,
          this.myForm.value.firstname,
          this.myForm.value.lastname,
          this.myForm.value.phonenumber.number,
          phoneNoTwo,
          this.myForm.value.workshopname,
          w2,
          w3,
          w4,
          w6,
          this.formattedaddress,
          city,
          state,
          pincode,
          this.myForm.value.rtono,
          temsAndCondition,
          country,
          this.country_code,
          this.country_currency,
          this.latlang,
          this.primary_language,
          passNull, role).subscribe(registerData=>{
            this.showspinner.setSpinnerForLogin(true)
            if(registerData.success==true){
              this.snakBar.open("Login with Registraion Success","", {
                duration: 4000
              })
              localStorage.setItem("falg", 'true');
              localStorage.setItem("showpopup", 'true');
              localStorage.setItem('dl','false')
              this.userObject.success=registerData.success
              this.userObject=registerData.data[0]
              // this.userObject["otp"]=this.otpForm.value.otp
              // this.userObject["output"]=this.outPut
              // this.userObject["workshop_id"]=registerData.data[0].workshop_id
              // this.userObject["email"]=this.myForm.value.email
              // this.userObject["workshop_mobile_number_1"]=this.myForm.value.phonenumber
              // this.userObject["token"]=registerData.data[0].token
              // this.userObject["unique_id"]=registerData.data[0].workshop_id
              // this.userObject["workshop_rtocode"]=registerData.data[0].workshop_rtocode
              // this.userObject["workshop_type"]=registerData.data[0].workshop_type
              this.userObject['signature']='false'
              this.userService.login(this.userObject)
            }else{
              this.showspinner.setSpinnerForLogin(false)
              this.snakBar.open("Error", "success", {
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
        this.wrongOtpError=true
        this.showspinner.setSpinnerForLogin(false)
        this.snakBar.open("Error", msgData["message"], {
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
  // If user again want to edit the number after OTP generate
  editnumber(){
    this.shwootp=false
    this.showerror=false
    this.myForm.value.vechiletypes=this.myForm.value.vechiletypes
    for(var i=0; i<this.vechileType.length;i++){
      if(this.myForm.value.vechiletypes.includes(this.vechileType[i].name)){
        this.vechileType[i].checked=true
      }else{
        this.vechileType[i].checked=false
      }
    }
    this.timeLeft=60
  }
  // Show the OTP form after workshop details saved
  showOtpform(){
    this.otpForm=this.formbuild.group({
      otp:['',[Validators.required, Validators.pattern(/^[0-9]*$/)]],
      password:['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6,16}$/)]],
      confirm_password:['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6,16}$/)]]
    },{validator: this.passwordConfirming})
  }
  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirm_password').value) {
        return {invalid: true};
    }
  }
  // Select vehcile type
  onCheckboxChange(e) {
    const checkArray: FormArray = this.myForm.get('vechiletypes') as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  // Rsend OTP
  resendOTP(){
    this.general.resendOTP(this.myForm.value.phonenumber).subscribe(otp=>{
      if(otp["type"]=="success"){
        this.snakBar.open("OTP Send Sucessfully","", {
          duration: 4000
        })
      }else{
        this.snakBar.open("Error","", {
          duration: 4000
        })
      }
    },err=>{
        this.snakBar.open("err",ErrorMessgae[0][err], {
          duration: 4000
        })
    })
  }



  public AddressChange(event) {
    var tempAddress = event.name;
    // this.formattedaddress=event.formatted_address
    this.lat = event.geometry.location.lat();
    this.lng = event.geometry.location.lng();

    console.log("this.lat",this.lat, this.lng);
    this.latlang = {"lat" : this.lat, "long":this.lng}
    
    for(let i=1; i<event.address_components.length;i++)
    {
        this.mapAddress = event.address_components[i];
        if(this.mapAddress.long_name !=''){

            if(this.mapAddress.types[0] =="street_number"){
                this.houseNumber = this.mapAddress.long_name;
            }
            if(this.mapAddress.types[0] =="route"){
                this.street = this.mapAddress.long_name;
            }
            if(this.mapAddress.types[0] =="locality"){
                this.mapCity  = this.mapAddress.long_name;
            }
            if(this.mapAddress.types[0] =="administrative_area_level_1"){
                this.mapState = this.mapAddress.long_name;
            }
            if(this.mapAddress.types[0] =="country"){
                this.mapCountry = this.mapAddress.long_name;  
            }
            if(this.mapAddress.types[0] =="postal_code"){
                this.mapPaostalCode  = this.mapAddress.long_name+',';
            }
            let streets = this.street && this.houseNumber ?(this.houseNumber+', '+this.street):'';
            this.mapAddress = streets ? streets : this.street;
        }

    }
    // event.adr_address.slice(0, 100)
    this.formattedaddress = event.name +', '+ event.address_components[1].long_name;
    this.myForm.value.zipcode = this.mapPaostalCode;
    this.myForm.value.address = this.formattedaddress;
    this.myForm.value.state = this.mapState;
    this.myForm.value.city = this.mapCity;
    this.myForm.value.country_name = this.mapCountry;
  }
  getCountryData(){
    let countryName = this.mapCountry || this.myForm.value.country_name[0].toUpperCase() + this.myForm.value.country_name.slice(1);
    this.general.getCountryInfoByName().subscribe(countryData=>{
      for(var data in countryData){
        if(countryData[data].country == countryName){ 
          this.country_code = countryData[data].dialing_code;
          this.country_currency = countryData[data].symbol;
        }
      }
        if(this.myForm.value.phonenumbertwo){
          var numberTel = this.myForm.value.phonenumbertwo.number;
        }
    });
  }

  checkPhoneCountry(){
    this.general.getCountryInfoByName().subscribe(countryData=>{
      var countryCod = this.isCountryAvailable(this.myForm.value.phonenumber,countryData);
      if(countryCod){
        if(countryCod == this.myForm.value.phonenumber.dialCode){
          this.countryError = false;
        }else{
          this.myForm.controls['phonenumber'].setErrors({'incorrect': true});
          this.countryError = true;
          this.myForm.patchValue( {'phonenumber':null} );
        }
      }else{
        this.myForm.controls['phonenumber'].setErrors({'incorrect': true});
        this.countryError = true;
        this.myForm.patchValue( {'phonenumber':null} );
      }
      console.log(this.countryError)
    })
  }
  isCountryAvailable(code, countryData){
    var data;
    for(var element in countryData){
      if(countryData[element].dialing_code == code.dialCode){
        data = countryData[element].dialing_code;
      }
    }
    return data;
  }
  getLocation(): void{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
          this.latlang = {"lat" : position.coords.latitude, "long":position.coords.longitude}
          this.general.getAddrByLatLanSecond(this.latlang.long, this.latlang.lat).subscribe(addr =>{
              console.log("address", addr);
          })
        });
    } else {
       console.log("No support for geolocation")
    }
  }

}
