import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  
  @ViewChild('f', {static: false}) loginForm: NgForm;
  @ViewChild('admin', {static: false}) admin: any;
  @ViewChild('pwd', {static: false}) pwd: any;
  // admin: string='';
  // pwd: string='';
  constructor( private router: Router) { }

  ngOnInit() {
  }

  onSubmit(){
    // verify
    

    sessionStorage.setItem('admin' ,this.admin.value)
    sessionStorage.setItem('pwd' ,this.pwd.value)

    // sessionStorage.setItem('name', 'Rana Hasnain');
    this.router.navigate(['admin-home']);
  }

}
