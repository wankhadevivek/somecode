import { Injectable, OnInit } from '@angular/core';
import { User } from '../shared/model/user/user.module';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { SpinnerService } from './spinner.service';
import { TokenStorageService } from './../shared/interceptor/token.service';

@Injectable({
  providedIn: 'root'
})
/**
 * In this file when
 * user is login or register
 * data is updated in the 
 * localstorage and render to the
 * jobcard page
*/
export class UserserviceService implements OnInit {
  username: string
  user = new BehaviorSubject<User>(null);
  redirectToOperation: boolean = false
  profiledata
  constructor(private showspinner:SpinnerService,
    private router: Router, private token:TokenStorageService) { }
  ngOnInit() {
    localStorage.setItem("username","Nav")
  }
  //when user login or register
  login(userData){
    

    localStorage.setItem('user',JSON.stringify(userData));
    localStorage.setItem('role',userData.role);
    localStorage.setItem('supplier_id',userData.workshop_id);
    this.setCountryDetails(userData);
    this.token.saveToken(userData['token'])
    this.profiledata=JSON.parse(localStorage.getItem('user'))
    if(this.profiledata.logo!=" "){
      (async function() {
        let profiledata=JSON.parse(localStorage.getItem('user'))
        let blob = await fetch(profiledata.logo).then(r => r.blob());
    
        let dataUrl = await new Promise(resolve => {
          let reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
        // now do something with `dataUrl`
        profiledata.logo=dataUrl
        localStorage.setItem("user", JSON.stringify(profiledata));
      })();
      
    }else{
      this.profiledata.logo='false'
      localStorage.setItem("user", JSON.stringify(this.profiledata));
    }
    
    this.user.next(userData);
    this.goToManagementPanel();
  }
  // user login or register to the Onlie store
  loginStore(userData){
    localStorage.setItem('user',JSON.stringify(userData));
    this.profiledata=JSON.parse(localStorage.getItem('user'))
    if(this.profiledata.logo!=" "){
      (async function() {
        let profiledata=JSON.parse(localStorage.getItem('user'))
        let blob = await fetch(profiledata.logo).then(r => r.blob());
        
        let dataUrl = await new Promise(resolve => {
          let reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
        // now do something with `dataUrl`
        profiledata.logo=dataUrl
        localStorage.setItem("user", JSON.stringify(profiledata));
      })();
      
    }else{
      this.profiledata.logo='false'
      localStorage.setItem("user", JSON.stringify(this.profiledata));
    }
  }
  // Redirect to jobcard page
  goToManagementPanel(){

    this.showspinner.setSpinnerForLogin(true);
    

    if(localStorage.getItem("adminwk") !== null
    && localStorage.getItem("switching")  !== null
    && localStorage.getItem("switching") =='true'){
   
      localStorage.removeItem("switching")
      this.router.navigate(['jobcards']);
      window.location.reload();
      
      // this.router.navigateByUrl(`/dashboard`).then(
      //   () => {
      //     this.router.navigateByUrl(`/jobcard`);
      //   });
    }
    else if(this.getData()['role'] == 'supplier'){
      this.router.navigate(['orders']);
    }else{
      if(this.getData()['online_garage'] == "false"){
        this.router.navigate(['onlinegarage']);
      }else{
        this.router.navigate(['jobcards']);
      }
    }
  }
  // get the user data
  public getData(): User {
    const user = localStorage.getItem('user');
    const usertask = localStorage.getItem('user');
    return user === null ? null : JSON.parse(user);
  }

  setCountryDetails(data){
    if(data.country_currency != null){
      localStorage.setItem('country_currency',JSON.stringify(data.country_currency));
    }else{
      localStorage.setItem('country_currency','₹');
    }
    localStorage.setItem('country_code',JSON.stringify(data.country_code));
  }
  removeItems(){
    localStorage.removeItem('showpopup');
    localStorage.removeItem('falg');
    localStorage.removeItem('user');
    localStorage.removeItem('dl');        
  }   
}
