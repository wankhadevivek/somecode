import { Component, OnInit, Injectable} from '@angular/core';
import { SpinnerService } from '../../../services/spinner.service';
@Injectable({
  providedIn: 'root'
})
@Component({ 
  selector: 'app-spin',
  templateUrl: './spin.component.html',
  styleUrls: ['./spin.component.css']
})
export class SpinComponent implements OnInit {
  /**
   * In this file spinner(Loader) 
   * is added for web app
  */
  show:boolean=false
  constructor(private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.spinnerService.showSpinner.subscribe(value => { 
      setTimeout(() => {
        this.show = value 
      }, 50);
    });
  }
}
