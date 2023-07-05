import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GeneralService } from '../../services/general.service';
import { UserserviceService } from '../../services/userservice.service';

import { SpinnerService } from "../../services/spinner.service";
import { tr } from 'date-fns/locale';
// import 'rxjs/add/operator/filter';
@Component({
  selector: 'app-paymnetsuccess',
  templateUrl: './paymnetsuccess.component.html',
  styleUrls: ['./paymnetsuccess.component.css']
})
/**
 * In Compoenet is used when pyament is success from the workshop end 
*/
export class PaymnetsuccessComponent implements OnInit {
  order_id: string
  status: boolean
  constructor(private router: Router,
    private route: ActivatedRoute,
    private showspinner: SpinnerService,
    private general: GeneralService,
    private userService:UserserviceService,) { 
  }
  
  ngOnInit() {
    // check payment sucess
    // get query params
    // order_id={order_id}&order_token={order_token}"
    this.route.queryParams
      .subscribe(params => {
        this.showspinner.setSpinnerForLogin(true);
        console.log(params); // { order: "popular" }

        this.order_id = params.order_id;
        var workshop_id=this.userService.getData()["workshop_id"]
        this.general.paymentOrderStatus(this.order_id, workshop_id)
        .subscribe((resp)=>{
          this.status = resp.status
          this.showspinner.setSpinnerForLogin(false);
          window.setTimeout(()=>{
            this.router.navigate(['membership']);
        }, 3000);

        })

        
      }
      )
    // subcrip to service requesting backned to confirm the order status 
    // show msg accordingly
  //   window.setTimeout(()=>{
  //     this.router.navigate(['membership']);
  // }, 3000);
  }
}
