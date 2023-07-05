import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth-service";

import {
  
    MatSnackBar,
   
  } from "@angular/material";
  

@Injectable()
export class AuthGuard implements CanActivate{

    constructor(
        private authService : AuthService,
        private router : Router,
        private snakBar: MatSnackBar
    ){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
     boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

        return this.authService.AdminVeriy()
        .toPromise()
        .then((response)=>{
            if(response.success == true){
                return true
            }
            else{
                this.router.navigate(['admin'])
                this.snakBar.open("Authentication Required", "Enter Correct Username and Password", {
                    duration: 3000,
                  });
                return false
             
            }
        })
        .catch(err=> {
            this.snakBar.open("Authentication Required", "Enter Correct Username and Password", {
                duration: 3000,
              });
            return false})
        
    }
}