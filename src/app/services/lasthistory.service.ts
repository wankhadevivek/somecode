import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable, of as observableOf } from 'rxjs';
import { SpinnerService } from './spinner.service';
import { MatSnackBar } from '@angular/material';
import { UserserviceService } from './userservice.service';
import { GeneralService } from './general.service';
import  {ErrorMessgae}  from  '../shared/error_message/error';
/**
 * In this file get the last services
 * of the vechile
*/
@Injectable({
  providedIn: 'root'
})
export class LasthistoryService implements OnInit {
  productsChange :any   
  constructor(private showspinner:SpinnerService,
    private snakBar:MatSnackBar,
    private userService: UserserviceService ,
    private generalService:GeneralService) { }
  ngOnInit() { 
  } 
}
