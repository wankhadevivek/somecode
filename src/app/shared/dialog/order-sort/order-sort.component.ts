import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { SpinnerService } from '../../../services/spinner.service';
import { UserserviceService } from '../../../services/userservice.service';
import { GeneralService } from '../../../services/general.service';
import { ErrorMessgae } from '../../error_message/error';
@Component({
  selector: 'app-order-sort',
  templateUrl: './order-sort.component.html',
  styleUrls: ['./order-sort.component.css']
})
/**
 * In this file for products
 * sort this is used in
 * online store
*/
export class OrderSortComponent implements OnInit {
  userserviceworkshopid
  allReportData=Array()
  allSMS=Array()
  sortType=[{"name":'Name:Ascending',value:'accname'},
            {"name":'Name:Descending',value:'decname'},
            {"name":'Price:Low to High',value:'accprice'},
            {"name":'Price:High to Low',value:'decprice'}
          ]
  constructor(
    public dialogRef: MatDialogRef<OrderSortComponent>,
    private showspinner:SpinnerService,
    private snakBar:MatSnackBar,
    private userService: UserserviceService ,
    private generalService:GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.userserviceworkshopid=this.userService.getData()["workshop_id"]
      this.allReportData=data.array
  }

  ngOnInit() {
  }
  checkAnswer(event){
    this.dialogRef.close(event);
  }
}
