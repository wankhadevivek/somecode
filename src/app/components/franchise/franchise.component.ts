import { Component, OnInit } from '@angular/core';
import { GeneralService } from "../../services/general.service";
import { UserserviceService } from "../../services/userservice.service";
import { MatSnackBar } from "@angular/material";
import { SpinnerService } from "../../services/spinner.service";
import { ErrorMessgae } from "../../shared/error_message/error";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import {animate, state, style, transition, trigger} from '@angular/animations';


 interface PeriodicElement {
  name: string;
  mobile: number;
  city: number;
  symbol: string;
  description: string;
}
@Component({
  selector: 'app-franchise',
  templateUrl: './franchise.component.html',
  styleUrls: ['./franchise.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FranchiseComponent implements OnInit {
  ELEMENT_DATA = []
  dataSource
  allWkIDs = ''
  allWkDetils = {}
  displayedColumns = ["id", "name","mobile",  "city",  "count",
  "final_sum",
  "job_total", "lube_total", "spare_total"];
  // columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
  columnsToDisplay = ['name', 'mobile', 'city', 'position'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: PeriodicElement | null;
  datasource = new MatTableDataSource<any>();
  fromDate
  toDate
  noOfFranchise = 0
  totalJc = 0
  totalRev = 0
  constructor(
    private formbuild: FormBuilder,
    private showspinner: SpinnerService,
    private snakBar: MatSnackBar,
    private userService: UserserviceService,
    private generalService: GeneralService,


  ) { }

  ngOnInit() {

    let linkedAcc = JSON.parse(localStorage.getItem('linkedAcc'))
    let adminwk = localStorage.getItem('adminwk')
    // this.noOfFranchise=  linkedAcc.lenght -1
    this.noOfFranchise= Object.keys(linkedAcc).length-1;
    
    linkedAcc.forEach(element => {
      if (element.workshop_id != adminwk){

        this.allWkIDs += element.workshop_id +','
       
        this.allWkDetils[element.workshop_id] = {
          wkId: element.workshop_id,
          mobile: element.mobile_number,
          name: element.workshop_name,
          city: element.city,
          final_sum: 0,
          spare_total:0,
          lube_total:0,
          job_total:0,
          count: 0
        }
      }
      // console.log('element', element)
      // this.ELEMENT_DATA.push(
      //   {
      //     wkId: element.id,
      //     mobile: element.mobile_number,
      //     name: element.workshop_name,
      //     city: element.city,
      //     symbol: 'H',
      //     description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
      //         atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`,
      //   }
      // )
    });

    this.selectDate('current')

    // this.generalService.getFranchiseRevenue(this.allWkIDs, '2021-01-07', '20213-01-07')
    //   .subscribe(data=>{
    //     console.log('dataresponse', data)
    //     console.log('this.allWkDetils', this.allWkDetils)
    //     if(data.success){
    //       let wkResponse = JSON.parse(data.summary)
          
    //       console.log('wkResume', wkResponse)

    //       const keys = Object.keys(wkResponse);

    //       console.log('keys', keys)

    //       keys.forEach(key=>
           
    //         this.allWkDetils[key] = { ...this.allWkDetils[key],
    //            ...wkResponse[key]
    //           }
           
    //           )
    //       let tableData   = Object.values(this.allWkDetils)
    //       // console.log(Object.values(this.allWkDetils))
    //       // this.dataSource.data =tableData
    //       this.dataSource = new MatTableDataSource(tableData);

    //       // console.log(this.dataSource.data)

          
    //     }
    //   })

    // this.ELEMENT_DATA = [
    //   {
    //     position: 1,
    //     name: 'Hydrogen',
    //     weight: 1.0079,
    //     symbol: 'H',
    //     description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
    //         atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`,
    //   }]
      // this.dataSource = this.ELEMENT_DATA;
  }
  selectDate(e) {
    if (e == "current") {
      // this.currentMonthDate();
      const current = new Date();
    const oneMonth = new Date();
    var firstDay = new Date(oneMonth.getFullYear(), oneMonth.getMonth(), 1);
    this.fromDate = firstDay;
    this.toDate = current;
  
    } else if (e == "last") {
      const current = new Date();
    var firstDay = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    var lastDay = new Date(current.getFullYear(), current.getMonth(), 0);
    this.fromDate = firstDay;
    this.toDate = lastDay;
  
    } 
    this.getFranchiseRevenue()
  }
  getFranchiseRevenue(){
    this.totalJc = 0
    this.totalRev = 0
    var startDateor = new Date(this.fromDate);
    var endDateor = new Date(this.toDate);
    var enddateaddd = endDateor.setDate(endDateor.getDate());
    var convertenddatee = new Date(enddateaddd);
    var startDate =
      startDateor.getFullYear() +
      "-" +
      ("0" + (startDateor.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + startDateor.getDate()).slice(-2);
    var endtDate =
      convertenddatee.getFullYear() +
      "-" +
      ("0" + (convertenddatee.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + convertenddatee.getDate()).slice(-2);

      this.generalService.getFranchiseRevenue(this.allWkIDs, startDate, endtDate)
      .subscribe(data=>{
        // console.log('dataresponse', data)
        // console.log('this.allWkDetils', this.allWkDetils)
        if(data.success){
          let wkResponse = JSON.parse(data.summary)
          
          // console.log('wkResume', wkResponse)

          const keys = Object.keys(wkResponse);

          // console.log('keys', keys)

          keys.forEach(key=>{
            
           
            this.allWkDetils[key] = { ...this.allWkDetils[key],
               ...wkResponse[key]
              }
              this.totalJc += wkResponse[key]['count']
              console.log("wkResponse[key]['final_amount']",
              wkResponse[key]['final_sum'])
              this.totalRev += parseInt(wkResponse[key]['final_sum'])
            }
           
              )

            console.log('tab inffff', this.noOfFranchise, this.totalJc, this.totalRev)
          let tableData   = Object.values(this.allWkDetils)
          // console.log(Object.values(this.allWkDetils))
          // this.dataSource.data =tableData
          this.dataSource = new MatTableDataSource(tableData);

          // console.log(this.dataSource.data)

          
        }
      })

  }
}

// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
//   description: string;
// }


// const ELEMENT_DATA: PeriodicElement[] = [
//   {
//     position: 1,
//     name: 'Hydrogen',
//     weight: 1.0079,
//     symbol: 'H',
//     description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
//         atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`,
//   }]
