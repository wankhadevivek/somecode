import { AbstractControl } from '@angular/forms';
export class MobileNumberValidator {
  static MatchPhone(control: AbstractControl) {
    let mobileOneNo = control.get('mobileOneNo').value;
    let mobileTwoNo = control.get('mobileTwoNo').value;
    if (mobileOneNo == mobileTwoNo) {
      control.get('mobileTwoNo').setErrors({ mobileTwoNo: true });
    }
    else {
      return null;
    }
  }
}