import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { SpinnerService } from '../../../services/spinner.service';
import { UserserviceService } from '../../../services/userservice.service';
import { GeneralService } from '../../../services/general.service';
import { ErrorMessgae } from '../../error_message/error';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import * as glob from "../../../shared/usercountry/userCountryGlobal"
@Component({
  selector: 'app-counter-day',
  templateUrl: './counter-day.component.html',
  styleUrls: ['./counter-day.component.css']
})
/**
 * In this file counter day
 * wise reports are shown same as
 * revenue daywise reports
*/
export class CounterDayComponent implements OnInit {
  date
  userserviceworkshopid
  allReportData=Array()
  displayedColumns: string[]=['customer_details','total','final_amount','receined_mount','balance']
  dataSource = new MatTableDataSource();
  currency_symbol: any;
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
    public dialogRef: MatDialogRef<CounterDayComponent>,
    private showspinner:SpinnerService,
    private snakBar:MatSnackBar,
    private userService: UserserviceService ,
    private generalService:GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.userserviceworkshopid=this.userService.getData()["workshop_id"]
      this.date=new Date(data.string)
  }
  ngOnInit() {
    this.currency_symbol = glob.currency_symbol;
    var month1=this.date.getMonth()+1
    var startDate= this.date.getFullYear()+"-"+("0" + (month1)).slice(-2)+"-"+("0" + (this.date.getDate())).slice(-2)
    var endtDate=this.date.getFullYear()+"-"+month1+"-"+this.date.getDate()
    const current = new Date(endtDate);
    current.setDate(current.getDate() + 1); 
    var month=current.getMonth()+1
    endtDate=current.getFullYear()+"-"+("0" + (month)).slice(-2)+"-"+("0" + (current.getDate())).slice(-2)
    this.generalService.getReports(this.userserviceworkshopid,'counter',startDate,endtDate).subscribe(reports=>{
      this.showspinner.setSpinner(true)
      if(reports["success"]==true){
        this.allReportData=reports["data"]
        this.snakBar.open("Message", "Reports Found", {
          duration: 4000
        })
        this.groupByNonServiceReports()
      }else{
        this.snakBar.open("Message", "No Reports Found", {
          duration: 4000
        })
      }
      this.showspinner.setSpinner(false)
    },err=>{
      this.showspinner.setSpinner(false)
      this.snakBar.open("err", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
  }
  //sort or group by reports except service reports
  groupByNonServiceReports(){
    this.showspinner.setSpinner(true)
    var groupBy = (array, key) => {
      return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
          currentValue
        );
        return result;
      }, {});
    };
    const reportsGroupByvehicleNumber = groupBy(this.allReportData, 'customer_mobile');
    this.getCutsomerData(reportsGroupByvehicleNumber)
  }
  //get Tabel Data for customer
  customerTabelData=Array() 
  getCutsomerData(groupedData){
    this.customerTabelData=[]
    if(groupedData!=undefined){
      if(groupedData.length!=0){
        var sortedData=Object.entries(groupedData)
        sortedData.map(dateGrouped => {
          this.sortDataCustomer(dateGrouped[1],dateGrouped[0])
        });
      }
    }
  }
  //Sort the revenue data
  sortDataCustomer(arrayData,customergroup){
    var total=0
    var final=0
    var received=0
    var balance=0
    var customerdetails
    arrayData.map(data=>{
      total=total+parseInt(data.total_amount)
      final=final+parseInt(data.final_amount)
      received=received+parseInt(data.paid)
      balance=balance+parseInt(data.balance)
      customerdetails=data.customer_name+" "+data.customer_mobile
    })
    this.customerTabelData.push({
      customer:customerdetails,
      balance:balance,
      received:received,
      total:total,
      final:final,
    })
    this.customerTabelData.sort(function(a, b) {
        return parseFloat(b.balance) - parseFloat(a.balance);
    });
    this.dataSource=new MatTableDataSource(this.customerTabelData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  // close the popup
  closePopup(event){
    this.dialogRef.close(event);
  }
}
