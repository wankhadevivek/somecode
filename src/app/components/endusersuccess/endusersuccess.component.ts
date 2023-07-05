import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-endusersuccess',
  templateUrl: './endusersuccess.component.html',
  styleUrls: ['./endusersuccess.component.css']
})
/**
 * In Compoenet is used when pyament is success from the enduser end 
*/
export class EndusersuccessComponent implements OnInit {
  
  constructor(private router: Router) { 
  }
  
  ngOnInit() {
    window.setTimeout(()=>{
      window.location.replace(localStorage.getItem('urltore'))
  }, 3000);
  }
}
