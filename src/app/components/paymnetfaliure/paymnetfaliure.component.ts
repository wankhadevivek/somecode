import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-paymnetfaliure',
  templateUrl: './paymnetfaliure.component.html',
  styleUrls: ['./paymnetfaliure.component.css']
})
/**
 * In Compoenet is used when pyament is fail from the workshop end 
*/
export class PaymnetfaliureComponent implements OnInit {
  
  constructor(private router: Router) { 
    
  }
  
  ngOnInit() {
    window.setTimeout(()=>{
      this.router.navigate(['membership']);
  }, 3000);
    
  }
    
}
