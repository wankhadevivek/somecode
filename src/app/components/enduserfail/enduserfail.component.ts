import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-enduserfail',
  templateUrl: './enduserfail.component.html',
  styleUrls: ['./enduserfail.component.css']
})

/**
 * In Compoenet is used when pyament is fail from the enduser end 
*/
export class EnduserfailComponent implements OnInit {
  
  constructor(private router: Router) { 
    
  }
  
  ngOnInit() {
    window.setTimeout(()=>{
      window.location.replace(localStorage.getItem('urltore'))
  }, 3000);
    
  }
    
}
