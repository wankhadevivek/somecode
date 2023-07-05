import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../../services/spinner.service';

@Component({
  selector: 'app-spinlogin',
  templateUrl: './spinlogin.component.html',
  styleUrls: ['./spinlogin.component.css']
})
export class SpinloginComponent implements OnInit {
  /**
   * In this file spinner(Loader) 
   * is added for login 
   * and register and all dialog
  */
  show:boolean=false
  constructor(private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.spinnerService.showSpinnerLogin.subscribe(value => { 
      setTimeout(() => {
        this.show = value 
      }, 50);
    });
  }

}
