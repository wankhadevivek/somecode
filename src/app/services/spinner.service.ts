import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

/**
 * To show spinner
 */
@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  showSpinner = new BehaviorSubject<boolean>(false);
  showSpinnerLogin= new BehaviorSubject<boolean>(false);
  showSpinnerEnd= new BehaviorSubject<boolean>(false);
  constructor() {
  }

  setSpinner(value: boolean) {
    this.showSpinner.next(value);
  }
  setSpinnerForLogin(value: boolean) {
    this.showSpinnerLogin.next(value);
  }
  setSpinnerForEnd(value: boolean) {
    this.showSpinnerEnd.next(value);
  }
}
