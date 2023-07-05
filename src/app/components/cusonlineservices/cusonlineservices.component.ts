import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl } from '@angular/forms';
import { GeneralService } from '../../services/general.service';
import { UserserviceService } from '../../services/userservice.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { SpinnerService } from '../../services/spinner.service';
import  {ErrorMessgae}  from  '../../shared/error_message/error';
import { AbstractService } from '../../services/comman/abstract.service';
import { EndUserLayoutComponent } from '../enduserlayout/enduserlayout.component';
@Component({
  selector: 'app-cusonlineservices',
  templateUrl: './cusonlineservices.component.html',
  styleUrls: ['./cusonlineservices.component.css']
})
/**
 * Services are shown of the
 * workshop here 
*/
export class CusOnlineServicesComponent implements OnInit {
  workshopOnline
  showonlineservices
  showonlineservicestwo
  allOnlineServices=Array()
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
  urlparam
  paramforhome
  paramforservice
  paramforbooking
  parmforbook
  contactlink
  vehiclepic
  constructor(public abstract:AbstractService,private showspinner:SpinnerService,private router: Router,private snakBar:MatSnackBar,private formbuild: FormBuilder,private generalService: GeneralService,private userService:UserserviceService,
    public usercomp:EndUserLayoutComponent) { 
    if(localStorage.getItem('enduser')){
      this.showloginsection=true
    }else{
      this.showloginsection=false
    }
  }
  // Load all the services
  ngOnInit() { 
        if(localStorage.getItem('work_data')){
          var data=JSON.parse(localStorage.getItem('work_data'))
          this.workshopOnline=true
          this.parmforbook='/cus/'+data.url_param+'/book'
          this.settingsBillData=JSON.parse(data.settings)[0]
          this.workshopname=data.workshop_name
          var vechileTypetoshow=[]
          for (var i=0; i<data.workshop_type.split(',').length; i++){
            if (data.workshop_type.split(',')[i] === "1"){
              if(i==0){
                vechileTypetoshow.push('2')
              }else if(i==1){
                vechileTypetoshow.push('3')
              }else if(i==2){
                vechileTypetoshow.push('4')
              }else if(i==3){
                vechileTypetoshow.push('6')
              }
            }                    
          }
          if(vechileTypetoshow.length==4){
            this.vehiclepic="../../../assets/images/sports-car.png"
          }
          else if(vechileTypetoshow.length!=1){
            if(vechileTypetoshow.includes("6")&&vechileTypetoshow.includes("4")){
              this.vehiclepic="../../../assets/images/sports-car.png"
            }
            else if(vechileTypetoshow.includes("2")&&vechileTypetoshow.includes("4")){
              this.vehiclepic="../../../assets/images/motorcycle.png"
            }
            else if(vechileTypetoshow.includes("2")&&vechileTypetoshow.includes("3")){
              this.vehiclepic="../../../assets/images/motorcycle.png"
            }
            else if(vechileTypetoshow.includes("6")&&vechileTypetoshow.includes("2")){
              this.vehiclepic="../../../assets/images/delivery-truck.png"
            }
            else if(vechileTypetoshow.includes("3")&&vechileTypetoshow.includes("6")){
              this.vehiclepic="../../../assets/images/delivery-truck.png"
            }
            else if(vechileTypetoshow.includes("3")&&vechileTypetoshow.includes("4")){
              this.vehiclepic="../../../assets/images/sports-car.png"
            }
            
          }else{
            if(vechileTypetoshow.includes("2")){
              this.vehiclepic="../../../assets/images/motorcycle.png"
            }
            else if(vechileTypetoshow.includes("3")){
              this.vehiclepic="../../../assets/images/rickshaw.png"
            }
            else if(vechileTypetoshow.includes("4")){
              this.vehiclepic="../../../assets/images/sports-car.png"
            }
            else if(vechileTypetoshow.includes("6")){
              this.vehiclepic="../../../assets/images/delivery-truck.png"
            }
          }
          if(this.settingsBillData.tag_line!=''&&this.settingsBillData.tag_line!=null&&this.settingsBillData.tag_line!=undefined)
          {
            this.workshoptiltle=this.settingsBillData.tag_line
          }else{
            this.workshoptiltle='none'
          }
          if(data.address!="" && data.address!=null){
            if(data.pincode!=0){
              this.workshopaddress=data.address+" ,"+data.city+" ,"+data.state+" ,"+data.pincode
            }else{
              this.workshopaddress=data.address+" ,"+data.city+" ,"+data.state
            }
          }else{
            this.workshopaddress="none"
          }

          if(data.email!=""){
            this.workshopemail=data.email
            this.workshopemailhref="mailto:"+""+data.email
          }else{
            this.workshopemail='none'
            this.workshopemailhref='none'
          }

          if(this.workshopemail!='none' &&this.workshopaddress!='none'&&data.logo!='none'){
            this.workshopverified=true
          }else{
            this.workshopverified=false
          }

          if(data.logo!='none'){
            this.workshoplogo=data.logo
          }else{
            this.workshoplogo=this.abstract.imageUrl1
          }
          

          if(data.onlinedata.length!=0){
            this.showonlineservices=true

            this.allOnlineServices=data.onlinedata

          }else{
            this.showonlineservices=false
          }
          



        }else{
          this.workshopOnline=false
        }
    

  }
  //if user want to book appoitment from the serviices page
  goToBook(){
    this.usercomp.bookingIcon()
  }
}
