import { Injectable } from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute} from '@angular/router';
import { el } from 'date-fns/locale';
import { ExpireAccountService } from './expire-account.service';
import {UserPermissionService} from './user-permissions.service';
import { UserserviceService } from './userservice.service';
/**
 * In this file  check wheter user
 * login or not and render to which page
*/
@Injectable()
export class AuthGuardService implements CanActivate {
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    public expire:ExpireAccountService,
    public permit:UserPermissionService,
    private userService:UserserviceService
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.expire.LoginTime();
    var isUserLogin = localStorage.getItem('isUserLogin');
    if(isUserLogin == "true"){
      this.permit.getPermissions(route.routeConfig.path);
    }
    var isTrue = localStorage.getItem('falg');
   
    if(isTrue=='false'){
      //  No expiry condition
      if(this.userService.getData()["role"] == 'supplier' || route.routeConfig.path == 'onlinegarage' || route.routeConfig.path == 'appointment'){
        return true;
      }else{
        this.router.navigate(['membership']);
        localStorage.removeItem("falg");
        return false
      } 
    }else if(isTrue=='true'){
      localStorage.removeItem("falg");
      return true
    }else{
      localStorage.setItem("falg", 'true');
      return true
    }
    
  }
}