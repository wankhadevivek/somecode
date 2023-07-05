import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { $ } from 'protractor';
import { GeneralService } from '../../services/general.service';
import  {ErrorMessgae}  from  '../../shared/error_message/error';
import { MatSnackBar } from '@angular/material';
import { AbstractService } from '../../services/comman/abstract.service';
import { DilogOpenService } from 'src/app/services/dilog-open.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-enduserlayout',
  templateUrl: './enduserlayout.component.html',
  styleUrls: ['./enduserlayout.component.scss']
})
/**
 * This comonenet is used for
 * the routing of the ned user app all
 * pages home, profile,book, services 
*/
export class EndUserLayoutComponent implements OnInit {
  events: string[] = [];
  cusname='User'
  cusphome 
  cusphometel
  cusdescription
  checkWorkshopData:boolean
  showloginsection:boolean
  workshopOnline:boolean
  workshoplogo
  urlparam
  paramforhome
  paramforservice
  paramforbooking
  parmforbook
  contactlink
  profilelink
  showhead:boolean=true
  homeClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
  serviceClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
  bookingClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
  profileclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
  showprosec:boolean=true
  constructor(private generalService: GeneralService,
    private dialogservice:DilogOpenService,
    private title: Title,
    private meta: Meta,
    private router: Router,
    private snakBar:MatSnackBar,
    public abstract:AbstractService,
    public translate: TranslateService) {
      var myDynamicManifest
      if(localStorage.getItem('work_data')){
        var data
        var logo
        data=JSON.parse(localStorage.getItem('work_data'))
        if(data.logo.includes((data.workshop_id).toString())){
          logo=data.logo
        }else{
          logo=this.abstract.imageUrl3
        }
        this.cusdescription = "Online Booking"
        myDynamicManifest = {
          "name": data.workshop_name,
          "short_name": data.workshop_name,
          "description":"Online Booking",
          "start_url": window.location.href,
          "background_color": "#fafafa",
          "theme_color": "#1976d2",
          "display": "fullscreen",
          "orientation":"portrait",
          "icons": [{
            "src": logo,
            "sizes":"512x512",
            "type": "image/png"
          }]
        }
      }else{
        this.cusdescription = "Online Garage"
        myDynamicManifest = {
          "name": "Online Garage",
          "short_name": "Online Garage",
          "theme_color": "#1976d2",
          "background_color": "#fafafa",
          "display": "standalone",
          "icons": [{
            "src": this.abstract.imageUrl1,
            "sizes": "256x256",
            "type": "image/png"
          }]
        }
      }
      const stringManifest = JSON.stringify(myDynamicManifest);
      const blob = new Blob([stringManifest], {type: 'application/json'});
      const manifestURL = URL.createObjectURL(blob);
      document.querySelector('#my-manifest-placeholder').setAttribute('href', manifestURL);
      // viraj
      translate.addLangs(['English','Hindi','Marathi','Indo']);
      translate.setDefaultLang('English');
  }
   //load the data and routes
  ngOnInit() {
    if(localStorage.getItem('enduser')){
      this.showloginsection=true
      if(localStorage.getItem('enduser')==undefined){
        localStorage.removeItem('enduser');
        localStorage.removeItem('check');
        localStorage.removeItem('work_data');
        localStorage.removeItem('is_register');
        location.reload()
      }
      this.cusname=JSON.parse(localStorage.getItem('enduser')).customer_name
      this.cusphome=JSON.parse(localStorage.getItem('enduser')).customer_mobile
      this.cusphometel="tel:"+this.cusphome
      if(!localStorage.getItem('is_register')){
        localStorage.setItem("is_register", 'true');
      }
    }else{
      this.showloginsection=false
      this.showprosec=false
    }
    if(localStorage.getItem('work_data')){
      this.checkWorkshopData=false
      //this.title.setTitle('Jobcards');
    }else{
      this.checkWorkshopData=true
    }
    var urlparam=window.location.pathname.split('/')[3]
    if(urlparam=="register"){
     this.homeClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
     this.serviceClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
     this.bookingClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon active text-center"
    }else if(urlparam=="services"){
      this.homeClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
      this.serviceClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon active text-center"
      this.bookingClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
    }else{
      this.homeClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon active text-center"
      this.serviceClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
      this.bookingClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
    }
    this.generalService.getWorkshopDetails(window.location.href.split('/')[4].substring(3)).subscribe(data=>{
      if(data.success==true){
        this.urlparam=data.url_param
        this.paramforbooking= '/cus/'+this.urlparam+'/register'
        this.paramforhome='/cus/'+this.urlparam
        this.paramforservice='/cus/'+this.urlparam+'/services'
        this.parmforbook='/cus/'+this.urlparam+'/book'
        //this.contactlink="https://wa.me/+91"+data.workshop_mobile_number_1+"?text=Hello! I found your garage online and I have a few questions regarding online services. Are you free to chat now?"
        this.profilelink='/cus/'+this.urlparam+'/profile'
        this.workshopOnline=true
        this.title.setTitle(data.workshop_name);
        localStorage.setItem("check", data.workshop_id);
        localStorage.setItem("work_data", JSON.stringify(data));
        console.log("workshop_name data",data)
        this.meta.addTags([
          { name: 'description', content: this.cusdescription + " "+ data.workshop_name + '' },
          { name: 'keywords', content: data.workshop_name +", "+this.cusdescription + ", jobcard tracking" }  
        ]);


        if(data.logo!='none'){
          this.workshoplogo=data.logo 
        }else{
          this.workshoplogo=this.abstract.imageUrl1
        }
      }else{
        this.workshopOnline=false
      }
      },err=>{
        this.snakBar.open("Error", ErrorMessgae[0][err], {
          duration: 4000
        })
      }) 
  }
   //when profile opnes either on looad or in click
  opneprofile(check){
    if(localStorage.getItem('enduser')){
      this.showprosec=true
      this.showloginsection=true
      this.cusname=JSON.parse(localStorage.getItem('enduser')).customer_name
    }else{
      this.showprosec=false
      this.showloginsection=false
    }
    if(check=='true'){
      this.showhead=false
    }else{
      this.showhead=true
    }
  }
   //when end user click on home icon
  homeIcon(){
    this.homeClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon active text-center"
    this.serviceClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
    this.bookingClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
    this.profileclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
    this.opneprofile('false')
  }
   //when end user click on booking icon
  bookingIcon(){
    this.opneprofile('false')
    this.homeClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
    this.serviceClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
    this.bookingClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon active text-center"
    this.profileclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
    this.opneprofile('false')
  }
   //when end user click on service icon
  serviceIcon(){
    this.homeClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
    this.serviceClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon active text-center"
    this.bookingClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
    this.profileclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
    this.opneprofile('false')
  }
  //when end user click on profile icon
  profileIcon(){
    if(localStorage.getItem('enduser')){
      this.showprosec=true
      this.profileclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon active text-center"
      this.homeClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
      this.serviceClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
      this.bookingClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
      this.opneprofile('true')
    }else{
      this.showprosec=false
      this.dialogservice.openEndUserLogin('true').subscribe(data=>{
        if(data=='trueokay'){
          this.showloginsection=true
          this.homeIcon()
          this.router.navigate(['/cus/'+this.urlparam]);
        }else if(data=='truenotokay'){
          this.showloginsection=true
          this.profileIcon()
        }else{
          this.showloginsection=false
        }
        // this.ngOnInit()
        // this.usercomp.ngOnInit()
      })
    }
  }
}
