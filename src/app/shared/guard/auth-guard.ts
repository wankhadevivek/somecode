import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { UserserviceService } from 'src/app/services/userservice.service';

/**
 * Guard component to check that user is logged and can loading page
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserserviceService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(localStorage.getItem('user')){
      return true;
    }else{
     this.router.navigate(['/login']);
     return false
    }
  }
}
 