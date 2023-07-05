import {
  Component,
  QueryList,
  ViewChildren,
  OnInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { Observable, merge, Subject } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  filter,
} from "rxjs/operators";
import { DilogOpenService } from "../../services/dilog-open.service";
import {
  NgbDate,
  NgbCalendar,
  NgbDateParserFormatter,
  NgbTypeahead,
} from "@ng-bootstrap/ng-bootstrap";
import { GeneralService } from "../../services/general.service";
import { UserserviceService } from "../../services/userservice.service";
import { MatSnackBar } from "@angular/material";
import { SpinnerService } from "../../services/spinner.service";
import { ErrorMessgae } from "../../shared/error_message/error";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { PdfcounterService } from "../../services/pdfcounter.service";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import * as glob from "../../shared/usercountry/userCountryGlobal";
import { UserPermissionService } from "../../services/user-permissions.service";
@Component({
  selector: "app-counter",
  templateUrl: "./counter.component.html",
  styleUrls: ["./counter.component.css"],
})
/**
 * This Compoenet is used for the
 * counter sale data to list out
 */
export class CounterComponent implements OnInit {
  userserviceworkshopid;
  tabelData = Array();
  displayedColumns: string[] = [
    "invoice_no",
    "customer_name",
    "mobile_number",
    "pending_amount",
    "total_amount",
    "action",
  ];
  dataSource = new MatTableDataSource();
  settingbilling;
  start_date: string = "";
  end_date: string = "";
  offset: any = 0;
  search_keywords: string = "";
  startDate = "";
  endDate = "";
  addOffset;
  hasnext: boolean = false;
  nextUrl: string;
  states = [];
  showsearchcnacel: boolean = false;
  selectedvaluefoprsearch;
  model;
  scrollheight = "100";
  numberofinvoice = "0";
  receviedamount = "0";
  pendingamout = "0";
  currency_symbol: any;
  permitData;
  isPermitData;
  @ViewChildren("panel", { read: ElementRef }) public panel: ElementRef<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private counterpdf: PdfcounterService,
    private formbuild: FormBuilder,
    private showspinner: SpinnerService,
    private snakBar: MatSnackBar,
    private userService: UserserviceService,
    private generalService: GeneralService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private dialogService: DilogOpenService,
    private permit: UserPermissionService
  ) {
    this.userserviceworkshopid = this.userService.getData()["workshop_id"];
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    /*check permission of view, create, edit, create new*/
    var isUserLogin = localStorage.getItem("isUserLogin");
    if (isUserLogin == "true") {
      try {
        this.permitData = {};
        permit.getPermissionForComponent("countersale").subscribe((res) => {
          this.permitData = JSON.parse(res.data["countersale"]);
          if (this.permitData) {
            this.isPermitData = this.permitData;
          } else {
            this.isPermitData = 0;
          }
        });
      } catch (e) {
        this.permitData = { view: 1 };
      }
    }
  }
  // Load the counter sale data
  ngOnInit() {
    this.currency_symbol = glob.currency_symbol;
    this.generalService
      .getJobcardSettings(this.userserviceworkshopid)
      .subscribe(
        (settingdata) => {
          this.settingbilling = JSON.parse(
            settingdata.jobcard_Settings.settings_billing.replace(/\\/g, "")
          );
        },
        (err) => {
          this.showspinner.setSpinnerForLogin(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
    this.getTabelData();
  }

  /*check permission func of view, create, edit, create new ..... start*/
  event_handler_view() {
    if (this.permitData) {
      if (this.permitData.view != 1) {
        this.snakBar.open("Access denied, Please call admin.", "", {
          duration: 4000,
        });
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
  event_handler_edit() {
    if (this.permitData) {
      if (this.permitData.edit != 1) {
        this.snakBar.open("Access denied, Please call admin.", "", {
          duration: 4000,
        });
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
  event_handler_create() {
    if (this.permitData) {
      if (this.permitData.create != 1) {
        this.snakBar.open("Access denied, Please call admin.", "", {
          duration: 4000,
        });
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
  event_handler_create_new() {
    if (this.permitData) {
      if (this.permitData.create_new != 1) {
        this.snakBar.open("Access denied, Please call admin.", "", {
          duration: 4000,
        });
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
  event_handler_delete() {
    if (this.permitData) {
      this.snakBar.open("Access denied, Please call admin.", "", {
        duration: 4000,
      });
      return false;
    } else {
      return true;
    }
  }
  /*check permission func of view, create, edit, create new ..... end*/

  // Search the counter sale by name,number, counter number
  searchBar(event) {
    this.offset = 0;
    this.addOffset = 0;
    this.start_date = "";
    this.endDate = "";
    this.search_keywords = event;
    this.showspinner.setSpinner(true);
    this.getDataForSearch();
  }
  // select the search result
  selectedResult(event) {
    this.selectedvaluefoprsearch = event;
    this.showsearchcnacel = true;
    if (event.split(", ").length == 3) {
      this.search_keywords = event.split(", ")[2];
      this.offset = 0;
      this.addOffset = 0;
      this.start_date = "";
      this.end_date = "";
      this.showspinner.setSpinner(true);
      this.getTabelData();
    }
    if (event == "") {
      this.search_keywords = "";
      this.offset = 0;
      this.addOffset = 0;
      this.start_date = "";
      this.end_date = "";
      this.showspinner.setSpinner(true);
      this.getTabelData();
    }
  }
  // get paginated data
  getDataForSearch() {
    this.generalService
      .CounterDashboard(
        this.userserviceworkshopid,
        this.start_date,
        this.end_date,
        this.search_keywords
      )
      .subscribe(
        (dashResult) => {
          if (dashResult.success == false) {
            this.states = [];
            this.states.push("No data Found");
            this.showspinner.setSpinner(false);
          } else if (dashResult.success == true) {
            this.states = [];
            if (dashResult.has_next == true) {
              this.hasnext = true;
              this.nextUrl = dashResult.next_page;
            } else {
              this.hasnext = false;
              this.nextUrl = "";
            }
            var dataset = Object.values(dashResult.counter);
            for (var i = 0; i < dataset.length; i++) {
              this.states.push(
                dashResult.counter[i]["customer_name"] +
                  ", " +
                  dashResult.counter[i]["customer_mobile"] +
                  ", " +
                  dashResult.counter[i]["invoice_no"]
              );
            }
            this.showspinner.setSpinner(false);
          } else {
            this.states = [];
            this.states.push("No data Found");
            this.showspinner.setSpinner(false);
          }
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  // gte the counter data
  getTabelData() {
    this.generalService
      .CounterDashboard(
        this.userserviceworkshopid,
        this.start_date,
        this.end_date,
        this.search_keywords
      )
      .subscribe(
        (dashResult) => {
          this.model = "";
          if (dashResult.success == false) {
            this.showspinner.setSpinner(false);
            this.tabelData = undefined;
            this.numberofinvoice = Math.round(
              parseInt(dashResult["total_count"])
            ).toLocaleString();
            this.receviedamount = Math.round(
              parseInt(dashResult["total_amount"])
            ).toLocaleString();
            this.pendingamout = Math.round(
              parseInt(dashResult["total_pending"])
            ).toLocaleString();
            this.scrollheight = "150";
            // this.snakBar.open("No Record Found","", {
            //   duration: 4000
            // })
          } else if (dashResult.success == true) {
            //console.log(dashResult.has_next)
            if (dashResult.has_next == true) {
              //console.log(dashResult.has_next)
              this.hasnext = true;
              this.nextUrl = dashResult.next_page;
            } else {
              this.hasnext = false;
              this.nextUrl = "";
            }
            this.numberofinvoice = Math.round(
              parseInt(dashResult["total_count"])
            ).toLocaleString();
            this.receviedamount = Math.round(
              parseInt(dashResult["total_amount"])
            ).toLocaleString();
            this.pendingamout = Math.round(
              parseInt(dashResult["total_pending"])
            ).toLocaleString();
            var tabelDataForMap: any;
            tabelDataForMap = dashResult.counter;
            this.tabelData = tabelDataForMap.map(function (tabelinfo) {
              return tabelinfo;
            });
            this.addOffset = this.tabelData.length;
            var scrollheight = this.tabelData.length * 100;
            if (scrollheight >= 750) {
              this.scrollheight = "600";
            } else if (scrollheight == 0) {
              this.scrollheight = "150";
            } else {
              this.scrollheight = scrollheight.toString();
            }
            //this.data = this.tabelData
            if (this.tabelData != undefined) {
              this.dataSource = new MatTableDataSource(this.tabelData);
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
              this.showspinner.setSpinner(false);
            } else {
              this.tabelData = [];
              this.dataSource = new MatTableDataSource(this.tabelData);
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
              this.showspinner.setSpinner(false);
            }
          } else {
            this.showspinner.setSpinner(false);
            this.snakBar.open("Error", "", {
              duration: 4000,
            });
          }
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  // clear the search
  clearSearch() {
    this.selectedvaluefoprsearch = "";
    this.start_date = "";
    this.end_date = "";
    this.search_keywords = "";
    this.showsearchcnacel = false;
    this.getTabelData();
  }
  // onscroll
  onScroll(event) {
    if (
      event.target.offsetHeight + event.target.scrollTop >=
      event.target.scrollHeight
    ) {
      //console.log(this.hasnext)
      if (this.hasnext == true) {
        this.showspinner.setSpinner(true);
        this.getDataForPagination();
      }
    }
  }
  // gte the paginated data
  getDataForPagination() {
    this.generalService.Counterpageination(this.nextUrl).subscribe(
      (dashResult) => {
        if (dashResult.success == false) {
          this.showspinner.setSpinner(false);
          this.tabelData = undefined;
          this.snakBar.open("No Record Found", "", {
            duration: 4000,
          });
        } else if (dashResult.success == true) {
          if (dashResult.has_next == true) {
            //console.log(dashResult.has_next)
            this.hasnext = true;
            this.nextUrl = dashResult.next_page;
          } else {
            this.hasnext = false;
            this.nextUrl = "";
          }

          for (var i = 0; i < Object.values(dashResult.counter).length; i++) {
            this.tabelData.push(dashResult.counter[i]);
          }

          this.tabelData = this.tabelData.reduce(
            (acc, cur) =>
              acc.some((x) => x.invoice_no === cur.invoice_no)
                ? acc
                : acc.concat(cur),
            []
          );

          this.dataSource = new MatTableDataSource(this.tabelData);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.showspinner.setSpinner(false);
        } else {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", "", {
            duration: 4000,
          });
        }
      },
      (err) => {
        this.showspinner.setSpinner(false);
        this.snakBar.open("Error", ErrorMessgae[0][err], {
          duration: 4000,
        });
      }
    );
    //this.data = this.tabelData
  }
  // select the date for filter
  onDateSelection(date) {
    var startDate = new Date(date.begin);
    var endDate = new Date(date.end);
    this.start_date =
      startDate.getFullYear() +
      "-" +
      ("0" + (startDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + startDate.getDate()).slice(-2);
    this.end_date =
      endDate.getFullYear() +
      "-" +
      ("0" + (endDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + endDate.getDate()).slice(-2);
    this.addOffset = 0;
    this.offset = 0;
    this.showspinner.setSpinner(true);
    this.getTabelData();
  }
  // edit the counter sale
  editCounter(e) {
    this.dialogService
      .OpenCounterSale("edit", e.invoice_no)
      .subscribe((datacounter) => {
        if (datacounter.status == "true") {
          this.ngOnInit();
        } else if (datacounter.status == "truep") {
          this.ngOnInit();
          this.printCounter({ invoice_no: datacounter.ivo });
        } else {
          this.ngOnInit();
        }
      });
  }
  // opem the new counter sale
  opencounter(status, id) {
    this.dialogService.OpenCounterSale(status, id).subscribe((datacounter) => {
      if (datacounter.status == "true") {
        this.ngOnInit();
      } else if (datacounter.status == "truep") {
        this.ngOnInit();
        this.printCounter({ invoice_no: datacounter.ivo });
      } else {
        this.ngOnInit();
      }
    });
  }
  // Print the counter data as pDF
  printCounter(e) {
    this.generalService
      .CounterDetail(this.userserviceworkshopid, e.invoice_no)
      .subscribe(
        (coounterdata) => {
          if (coounterdata.success == true) {
            var name;
            var documentDefinition;
            name = coounterdata.counter.invoice_no;
            documentDefinition = this.counterpdf.generatePDF(
              coounterdata.counter,
              coounterdata.customer,
              this.settingbilling[0]
            );
            pdfMake.createPdf(documentDefinition).print();
          }
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
}
