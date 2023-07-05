import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { UserserviceService } from "./userservice.service";
import { SpinnerService } from "./spinner.service";
import { MatSnackBar } from "@angular/material";
import { GeneralService } from "./general.service";
import { ErrorMessgae } from "../shared/error_message/error";
import { Router } from "@angular/router";

/**
 * In this file account
 * permissions is check
 * user need access or not
 */
@Injectable({
  providedIn: "root",
})
export class UserPermissionService implements OnInit {
  userWorkshopId;
  permitData: any = {};
  isUserLogin = localStorage.getItem("isUserLogin");
  constructor(
    private userService: UserserviceService,
    private showspinner: SpinnerService,
    private snakBar: MatSnackBar,
    public general: GeneralService,
    private router: Router
  ) {
    this.userWorkshopId = this.userService.getData()["workshop_id"];
  }
  ngOnInit() {}


  getPermissions(routeName) {
  
    if(routeName == 'supplier' || routeName == 'orders'){
      routeName = 'purchaseorder';
    }
    this.general
      .getWorkshopUsersAccess(
        this.userWorkshopId,
        localStorage.getItem("user_name"),
        routeName
      )
      .subscribe(
        (res) => {
        
          if (res.success) {
            if (res.data[routeName] == 0) {
              this.router.navigate(["accessdenied"]);
            } else {
              if (res.data[routeName] != 1) {
                this.setPermissionsVal(res.data[routeName]);
              }
            }
          }
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        })

      }
      setPermissionsVal(value){
        this.permitData = {};
        this.permitData = value;
      }
      getPermissionsVal(key){
          return this.permitData;
      }
      getPermissionForComponent(routeName){
        return this.general
        .getWorkshopUsersAccess(
          this.userWorkshopId,
          localStorage.getItem("user_name"),
          routeName
        );
      }
      utf8_to_b64( str ) {
        return window.btoa(unescape(encodeURIComponent( str )));
      }
      b64_to_utf8( str ) {
        return decodeURIComponent(escape(window.atob( str )));
      }
}