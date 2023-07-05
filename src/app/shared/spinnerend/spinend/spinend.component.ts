import { Component, OnInit, Injectable} from '@angular/core';
import { SpinnerService } from '../../../services/spinner.service';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-spinend',
  templateUrl: './spinend.component.html',
  styleUrls: ['./spinend.component.css']
})
export class SpinendComponent implements OnInit {
  /**
   * In this file spinner(Loader) 
   * is added for end-user app
  */
  show:boolean=false
  constructor(private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.spinnerService.showSpinnerEnd.subscribe(value => { 
      setTimeout(() => {
        this.show = value 
      }, 50);
    });
  }
}
