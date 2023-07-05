import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { SpinnerService } from '../../../services/spinner.service';
import { UserserviceService } from '../../../services/userservice.service';
import { GeneralService } from '../../../services/general.service';
import { ErrorMessgae } from '../../error_message/error';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
@Component({
  selector: 'app-appoitment-day',
  templateUrl: './appoitment-day.component.html',
  styleUrls: ['./appoitment-day.component.css']
})
/**
 * In this file get all the
 * booking appoitments of the
 * selected date
*/
export class AppoitmentDayComponent implements OnInit {
  eventdata
  allReportData=Array()
  displayedColumns: string[]=['sr_no','Status','time','name','phone','vehiclenumber','vehicledetail','action']
  dataSource = new MatTableDataSource();
  bookingdate
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
    public dialogRef: MatDialogRef<AppoitmentDayComponent>,
    private showspinner:SpinnerService,
    private snakBar:MatSnackBar,
    private userService: UserserviceService ,
    private generalService:GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.eventdata=data.line
  }
  // get the date all booking appoitments
  ngOnInit() {
    this.bookingdate=this.eventdata[0].start
    this.eventdata.map(data=>{
      this.allReportData.push(data.id)
    })
    this.dataSource=new MatTableDataSource(this.allReportData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  // convert o int
  ConvertToInt(currentPage){
    return JSON.parse(currentPage).make+" "+JSON.parse(currentPage).model+" "+JSON.parse(currentPage).variant;
  }
  //close the poup and view the selected booking
  closeandview(alldata){
    var senddata
    senddata={
      "action":"Edited",
      'id':alldata
    }
    this.dialogRef.close(senddata);
  }
  // close the popup
  closePopup(event){
    var senddata
    senddata={
      "action":"noEdited",
      'id':'alldata'
    }
    this.dialogRef.close(senddata);
  }
}
