import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralService } from 'src/app/services/general.service';
import { LocationService } from 'src/app/services/location.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { DomSanitizer } from "@angular/platform-browser";
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { MatDialog } from '@angular/material/dialog';


declare var $ : any;

@Component({
  selector: 'app-garagefinder',
  templateUrl: './garagefinder.component.html',
  styleUrls: ['./garagefinder.component.css']
})
export class GaragefinderComponent implements OnInit, AfterViewInit{

  workshopData:any = [];
  latitude:number;
  longitude:number;
  formatted_address:string;
  zip_code:number;
  searchWorkshop:any;
  locationPermission:boolean = false;
  sortWorkshop:boolean = false;
  isFindMyLocation:boolean = false;
  searchAddress:string='';
  formattedaddress
  options={
    componentRestrictions:{
    country:["IN"]
    }
  }
  bike = ["1,0,0,0", "1,0,0,1", "1,0,1,0", "1,0,1,1", "1,1,0,0", "1,1,0,1", "1,1,1,0", "1,1,1,1"];
  car = ["0,0,1,0","0,0,1,1","0,1,1,0","0,1,1,1","1,1,1,0","1,0,1,0","1,0,1,1","1,1,1,1"];
  tempWorkshopData
  @ViewChild("placesRef",{static:false}) placesRef : GooglePlaceDirective; 
  constructor(private generalService: GeneralService,
    private locationService:LocationService,
    private showspinner: SpinnerService,
    private snakBar: MatSnackBar,
    public domSanitizer: DomSanitizer,
    public dialog: MatDialog) { 
      
      google.maps.event.addDomListener(window, 'load', this.initialize);
  }
  ngAfterViewInit(): void {
    this.handlePermission();
  }

  ngOnInit() {
    
  }

  OnLocationAllowed(){
    // $('#exampleModalLong').modal('show');
    this.isFindMyLocation = true;
  }
  initialize() {
    // var input = document.getElementById('searchTextField');
    var autocomplete = new google.maps.places.Autocomplete((<HTMLInputElement>document.getElementById("searchTextField")));
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
      var place = autocomplete.getPlace();
      console.log("place",place);
      // document.getElementById('city2').value = place.name;
      // document.getElementById('cityLat').value = place.geometry.location.lat();
      // document.getElementById('cityLng').value = place.geometry.location.lng();
  });
  }
  GetCurrentLocation(){
    this.locationService.getLocation().getCurrentPosition(res=>{
      this.latitude = res.coords.latitude;
      this.longitude = res.coords.longitude;
      console.log("locationService",this.latitude, this.longitude);
      this.GetAddressByLatLang(this.latitude, this.longitude);
    },this.showLocationError)
  }
  GetAddressByLatLang(latitude,longitude){
    this.isFindMyLocation = false;
    this.locationService.getAddrByLatLanSecond(latitude,longitude).then(res=>{
      this.formatted_address = res[0].formatted_address;
      this.zip_code = res[0].address_components.find(addr => addr.types[0] === "postal_code").short_name;
      console.log("zip_code",this.zip_code);
      this.GetGaragesByPincode(this.zip_code);
    })
  }

  GetGaragesByPincode(workshop_pincode:number){
    this.generalService.getGarageFinderWorkshopData(workshop_pincode).subscribe(res =>{
      console.log("res",res);
      this.workshopData = res.workshops;
      this.tempWorkshopData = res.workshops;
    })
  }
  showLocationError = (error)=> {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        this.snakBar.open("User denied the request for Geolocation.", "", {
          duration: 4000,
        });
        break;
      case error.POSITION_UNAVAILABLE:
        this.snakBar.open("Location information is unavailable.", "", {
          duration: 4000,
        });
        break;
      case error.TIMEOUT:
        this.snakBar.open("The request to get user location timed out.", "", {
          duration: 4000,
        });
        break;
      case error.UNKNOWN_ERROR: 
        this.snakBar.open("An unknown error occurred.", "", {
          duration: 4000,
        });
        break;
    }
  }
  handlePermission() {

      navigator.permissions.query({name:'geolocation'}).then((result)=> {
        if (result.state == 'granted') {
          console.log('Permission ' + result.state);
          this.GetCurrentLocation();
        } else if (result.state == 'prompt') {
          console.log('Permission ' + result.state);
          this.openModel();
        } else if (result.state == 'denied') {
          console.log('Permission ' + result.state);
          this.openModel();
        }
      });
    
  }
  openModel() {
    $('#exampleModalCenter').modal('show'); 
  }
  onSort(){
    this.sortWorkshop = !this.sortWorkshop
    if(this.sortWorkshop){
      this.workshopData.sort((a,b) => (a.workshop_name > b.workshop_name) ? 1 : ((b.workshop_name > a.workshop_name) ? -1 : 0))
    }else{
      this.workshopData.sort((a,b) => (a.workshop_name < b.workshop_name) ? 1 : ((b.workshop_name < a.workshop_name) ? -1 : 0))
    }
  }
  onWheelerSelect(val){
    console.log(val);
    this.workshopData = this.tempWorkshopData;
    if(val == 'bike'){
      this.workshopData = this.workshopData.filter(res=>this.bike.indexOf(res.workshop_type) >-1);
    }
    if(val == 'car'){
      this.workshopData = this.workshopData.filter(res=>this.car.indexOf(res.workshop_type) >-1);
    }
    if(val == 'all'){
      this.workshopData = this.tempWorkshopData;
    }
    console.log("filter",this.workshopData)
  }


  public AddressChange(address: any) {
    //setting address from API to local variable
      console.log("address",address);
      console.log("address",address.geometry.location.lat(),address.geometry.location.lng());
      this.GetAddressByLatLang(address.geometry.location.lat(),address.geometry.location.lng());
    }
  

}

