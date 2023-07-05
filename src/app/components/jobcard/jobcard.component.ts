import {
  Injector,
  Component,
  QueryList,
  ViewChildren,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  AfterContentInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { DilogOpenService } from "../../services/dilog-open.service";
import {
  NgbDate,
  NgbCalendar,
  NgbDateParserFormatter,
} from "@ng-bootstrap/ng-bootstrap";
import { GeneralService } from "../../services/general.service";
import { UserserviceService } from "../../services/userservice.service";
import { MatSnackBar } from "@angular/material";
import { SpinnerService } from "../../services/spinner.service";
import { ErrorMessgae } from "../../shared/error_message/error";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { PdfgenerateService } from "../../services/pdfgenerate.service";
import { PrintsharepdfService } from "../../services/printsharepdf.service";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  SatDatepickerModule,
} from "saturn-datepicker";
import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from "../../shared/model/date/date.adapter";
import { AbstractService } from "../../services/comman/abstract.service";
import * as glob from "../../shared/usercountry/userCountryGlobal";

import { MessagingService } from "../../services/messaging.service";
import { UserPermissionService } from "../../services/user-permissions.service";
import { viewClassName } from "@angular/compiler";
import { Router } from "@angular/router";
@Component({
  selector: "app-jobcard",
  templateUrl: "./jobcard.component.html",
  styleUrls: ["./jobcard.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS,
    },
  ],
})
/**
 * This compoenet is used as the jobcard
 * dashborad. Short Invoice, Reminder
 * and jobcard are created from here
 * invoices and estimate are print and dowlaoded
 */
export class JobcardComponent implements OnInit, AfterViewInit {
  public model: any;
  startlDate = "";
  endDate = "";
  showDatePicker: boolean = false;
  selectedOption: string = "0";
  hoveredDate: NgbDate;
  showDate: boolean = false;
  fromDate: NgbDate;
  toDate: NgbDate;
  date: string;
  jobcard_status: string = "0";
  start_date: string = "";
  end_date: string = "";
  offset: any = 0;
  search_keywords: string = "";
  vehicle_number: string = "";
  tabelData;
  totalJobcard;
  openJobcard;
  completedJobcard;
  closedJobcard;
  billAmount = 0;
  addOffset;
  hasnext: boolean = false;
  nextUrl: string;
  states = [];
  totalcompleted = "0";
  totalclosed = "0";
  totalpending = "0";
  totaljobcardcount = "0";
  userserviceworkshopid;
  scrollheight = "100";
  mainurl = this.abstract.newmainurl;

  mainurlparam;
  url_param;
  pendingMainClass = "totalandname totaldivv";
  completeMainClass = "totalandname";
  closedMainClass = "totalandname";
  totalMainClass = "totalandname";
  showsearchcnacel: boolean = false;
  permitData;
  public data: any;
  displayedColumns: string[] = [
    "status",
    "jobcard_number",
    "vehicle_number",
    "customer_name",
    "mobile_number",
    "vehicle",
    "pending_amount",
    "total_amount",
    "discount",
    "bill_amount",
    "action",
  ];
  dataSource = new MatTableDataSource();
  selectedvaluefoprsearch;
  currency_symbol: any;

  @ViewChildren("panel", { read: ElementRef }) public panel: ElementRef<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public sendPDF: PrintsharepdfService,
    public pdfService: PdfgenerateService,
    private showspinner: SpinnerService,
    private snakBar: MatSnackBar,
    private userService: UserserviceService,
    private generalService: GeneralService,
    public abstract: AbstractService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private dialogService: DilogOpenService,
    private injector: Injector,
    private permit: UserPermissionService,
    private router: Router,
  ) {
    this.fromDate = calendar.getToday();

    this.toDate = calendar.getNext(calendar.getToday(), "d", 10);
    this.userserviceworkshopid = this.userService.getData()["workshop_id"];
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    /*check permission of view, create, edit, create new*/
    var isUserLogin = localStorage.getItem("isUserLogin");
    if (isUserLogin == "true") {
      try {
        this.permitData = {};
        permit.getPermissionForComponent("jobcards").subscribe((res) => {
          this.permitData = JSON.parse(res.data["jobcards"]);
        });
      } catch (e) {
        this.permitData = { view: 1 };
      }
    }
  }
  formatterr = (result: string) => result.toUpperCase();
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) => (term === "" ? [] : this.states))
    );
  // Gte the Jobcard data to show in tabel
  ngOnInit() {
    this.currency_symbol = glob.currency_symbol;
    this.showspinner.setSpinner(true);
    this.getTabelData();

    this.generalService
      .getLInkStatus(this.userserviceworkshopid)
      .subscribe((datalink) => {
        localStorage.setItem("online_garage", datalink.online_garage);
        this.mainurlparam = datalink.url_param;
        this.url_param = this.mainurl + "cus/" + datalink.url_param;
      });
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

  SetNotificationValues() {
    const message =
      "Get Real-Time Updates about Your Workshop, Customers & Other Important Notifications";
    return new Promise((resolve) => {
      this.dialogService
        .OpenNotificationDialog(message, 0)
        .subscribe((answer) => {
          if (answer == true) {
            localStorage.setItem("notifyActive", "true");
            const messagingService = this.injector.get(MessagingService);

            messagingService.requestPermission();

            messagingService.receiveMessage();

            setTimeout(() => {
              this.generalService
                .updateNotifyParams("set")
                .subscribe((response) => {});
            }, 2500);
            setTimeout(() => resolve("resolved"), 1500);
          } else if (answer == false) {
            // set local storage value to false

            localStorage.setItem("notifyActive", "false");

            this.generalService
              .updateNotifyParams("unset")
              .subscribe((response) => {});

            setTimeout(() => resolve("resolved"), 1500);
          }
        });
    });
  }

  async ngAfterViewInit() {
    if (
      localStorage.getItem("notifyActive") === "false" &&
      localStorage.getItem("already_notified") !== "false"
    ) {
      // setTimeout(() => this.SetNotificationValues(), 1500);
      await this.SetNotificationValues();

      // this.generalService.updateNotifyParams("set").subscribe((response) => {});
      localStorage.setItem("already_notified", "true");
    }
  }

  // get the choice to open the estinate or invoice
  getChoiceLabel(choice: string) {
    return `@${choice} `;
  }
  // search for the data
  searchBar(event) {
    this.offset = 0;
    this.addOffset = 0;
    this.jobcard_status = "3";
    this.start_date = "";
    this.endDate = "";
    this.vehicle_number = "";
    this.search_keywords = event;
    this.showspinner.setSpinner(true);
    this.getDataForSearch();
  }
  // Select the search data for jobacrd dashbaord
  selectedResult(event) {
    this.selectedvaluefoprsearch = event;
    this.showsearchcnacel = true;
    if (event.split(", ").length == 3) {
      this.jobcard_status = "3";
      this.search_keywords = "";
      this.offset = 0;
      this.addOffset = 0;
      this.start_date = "";
      this.end_date = "";
      this.selectedOption = "3";
      this.vehicle_number = event.split(", ")[0];
      this.showspinner.setSpinner(true);
      this.getTabelData();
    }
    if (event == "") {
      this.jobcard_status = "0";
      this.search_keywords = "";
      this.offset = 0;
      this.addOffset = 0;
      this.start_date = "";
      this.end_date = "";
      this.selectedOption = "0";
      this.vehicle_number = "";
      this.showspinner.setSpinner(true);
      this.getTabelData();
    }
  }
  // check the status of the jobacrd
  checkStatus(val, classadd) {
    if (classadd == "pen") {
      this.pendingMainClass = "";
      this.completeMainClass = "";
      this.closedMainClass = "";
      this.totalMainClass = "";
      this.pendingMainClass = "totalandname totaldivv";
      this.completeMainClass = "totalandname";
      this.closedMainClass = "totalandname";
      this.totalMainClass = "totalandname";
    } else if (classadd == "clo") {
      this.pendingMainClass = "";
      this.completeMainClass = "";
      this.closedMainClass = "";
      this.totalMainClass = "";
      this.pendingMainClass = "totalandname";
      this.completeMainClass = "totalandname";
      this.closedMainClass = "totalandname totaldivv";
      this.totalMainClass = "totalandname";
    } else if (classadd == "com") {
      this.pendingMainClass = "";
      this.completeMainClass = "";
      this.closedMainClass = "";
      this.totalMainClass = "";
      this.pendingMainClass = "totalandname";
      this.completeMainClass = "totalandname totaldivv";
      this.closedMainClass = "totalandname";
      this.totalMainClass = "totalandname";
    } else if (classadd == "tot") {
      this.pendingMainClass = "";
      this.completeMainClass = "";
      this.closedMainClass = "";
      this.totalMainClass = "";
      this.pendingMainClass = "totalandname";
      this.completeMainClass = "totalandname";
      this.closedMainClass = "totalandname";
      this.totalMainClass = "totalandname totaldivv";
    }
    this.selectedOption = val;
    if (val == "2") {
      this.showDatePicker = true;
    } else {
      this.showDatePicker = false;
    }
    if (val != "3") {
      this.addOffset = 0;
      this.offset = 0;
      this.jobcard_status = val;
      this.showspinner.setSpinner(true);
      this.getTabelData();
    }
  }
  // Open the filter for end and statt date
  onOpenEndDate(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode("month");
  }
  //select the start date
  onOpenStratDate(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode("month");
  }
  // select the date
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
  // when user hover on the date
  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }
  // insie the date
  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }
  //date in range
  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      date.equals(this.toDate) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }
  // check the inout of search bar
  validateInput(currentValue: NgbDate, input: string): NgbDate {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }
  // show the date picker
  showPicker() {
    this.showDate = true;
    this.date =
      this.fromDate.year +
      "/" +
      this.fromDate.month +
      "/" +
      this.fromDate.day +
      " - " +
      this.toDate.year +
      "/" +
      this.toDate.month +
      "/" +
      this.toDate.day;
  }
  // onscroll of the jobcard dashbaord
  onScroll(event) {
    if (
      event.target.offsetHeight + event.target.scrollTop >=
      event.target.scrollHeight
    ) {
      if (this.hasnext == true) {
        this.showspinner.setSpinner(true);
        this.getDataForPagination();
      }
    }
  }
  // clar the search
  clearSearch() {
    this.selectedvaluefoprsearch = "";
    this.start_date = "";
    this.end_date = "";
    this.search_keywords = "";
    this.vehicle_number = "";
    this.showsearchcnacel = false;
    this.jobcard_status = "0";
    this.checkStatus("0", "pen");
    this.getTabelData();
  }
  // get the tabel data to show
  getTabelData() {
    if (this.jobcard_status != "2") {
      this.start_date = "";
      this.end_date = "";
    }
    this.generalService
      .jobCradDashboard(
        this.userserviceworkshopid,
        this.jobcard_status,
        this.start_date,
        this.end_date,
        this.search_keywords,
        this.vehicle_number
      )
      .subscribe(
        (dashResult) => {
          this.model = "";
          if (dashResult.success == false) {
            this.showspinner.setSpinner(false);
            this.tabelData = undefined;
            this.openJobcard = dashResult["finalamout"]["pending"];
            this.completedJobcard = dashResult["finalamout"]["complete"];
            this.closedJobcard = dashResult["finalamout"]["closed"];
            this.billAmount = dashResult["finalamout"]["total_amount"];
            this.totaljobcardcount =
              dashResult["pendingcount"]["pending"] +
              dashResult["pendingcount"]["complete"] +
              dashResult["pendingcount"]["closed"];
            if (parseInt(this.totaljobcardcount) >= 1000000000) {
              this.totaljobcardcount =
                (parseInt(this.totaljobcardcount) / 1000000000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "G";
            } else if (parseInt(this.totaljobcardcount) >= 1000000) {
              this.totaljobcardcount =
                (parseInt(this.totaljobcardcount) / 1000000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "M";
            } else if (parseInt(this.totaljobcardcount) >= 1000) {
              this.totaljobcardcount =
                (parseInt(this.totaljobcardcount) / 1000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "K";
            } else {
              this.totaljobcardcount = this.totaljobcardcount;
            }

            if (parseInt(dashResult["pendingcount"]["closed"]) >= 1000000000) {
              this.totalclosed =
                (parseInt(dashResult["pendingcount"]["closed"]) / 1000000000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "G";
            } else if (
              parseInt(dashResult["pendingcount"]["closed"]) >= 1000000
            ) {
              this.totalclosed =
                (parseInt(dashResult["pendingcount"]["closed"]) / 1000000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "M";
            } else if (parseInt(dashResult["pendingcount"]["closed"]) >= 1000) {
              this.totalclosed =
                (parseInt(dashResult["pendingcount"]["closed"]) / 1000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "K";
            } else {
              this.totalclosed = dashResult["pendingcount"]["closed"];
            }

            if (parseInt(dashResult["pendingcount"]["pending"]) >= 1000000000) {
              this.totalpending =
                (parseInt(dashResult["pendingcount"]["pending"]) / 1000000000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "G";
            } else if (
              parseInt(dashResult["pendingcount"]["pending"]) >= 1000000
            ) {
              this.totalpending =
                (parseInt(dashResult["pendingcount"]["pending"]) / 1000000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "M";
            } else if (
              parseInt(dashResult["pendingcount"]["pending"]) >= 1000
            ) {
              this.totalpending =
                (parseInt(dashResult["pendingcount"]["pending"]) / 1000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "K";
            } else {
              this.totalpending = dashResult["pendingcount"]["pending"];
            }

            if (
              parseInt(dashResult["pendingcount"]["complete"]) >= 1000000000
            ) {
              this.totalcompleted =
                (parseInt(dashResult["pendingcount"]["complete"]) / 1000000000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "G";
            } else if (
              parseInt(dashResult["pendingcount"]["complete"]) >= 1000000
            ) {
              this.totalcompleted =
                (parseInt(dashResult["pendingcount"]["complete"]) / 1000000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "M";
            } else if (
              parseInt(dashResult["pendingcount"]["complete"]) >= 1000
            ) {
              this.totalcompleted =
                (parseInt(dashResult["pendingcount"]["complete"]) / 1000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "K";
            } else {
              this.totalcompleted = dashResult["pendingcount"]["complete"];
            }
            this.scrollheight = "150";
            // this.snakBar.open("No Record Found","", {
            //   duration: 4000
            // })
          } else if (dashResult.success == true) {
            var tabelDataForMap: any;
            tabelDataForMap = dashResult.jobcards;
            this.tabelData = tabelDataForMap.map(function (tabelinfo) {
              if (tabelinfo.discount.split(" ")[1] == "₹") {
                tabelinfo["discountagain"] =
                  "₹" + " " + tabelinfo.discount.split(" ")[0];
              } else {
                tabelinfo["discountagain"] = tabelinfo.discount;
              }
              if (
                tabelinfo.vehicle_details != null &&
                tabelinfo.vehicle_details != ""
              ) {
                var vehicle_details = JSON.parse(
                  tabelinfo.vehicle_details.replace(/\\/g, "")
                );
              }
              // if(tabelinfo.jobcard_mechanic!=null && tabelinfo.jobcard_mechanic!=""){
              //   var arrMechanicName=[]
              //   var jobcard_mechanic_object = JSON.parse(tabelinfo.jobcard_mechanic.replace(/\\/g, ""))
              //   var jobcard_mechanic_map = jobcard_mechanic_object.map(function(mechanicname){
              //     if(!arrMechanicName.includes(mechanicname)){
              //       arrMechanicName.push(mechanicname)
              //     }
              //     return arrMechanicName;
              //   })
              //   var jobcard_mechanic = arrMechanicName.toString()
              //   console.log(arrMechanicName)
              // }
              tabelinfo.vehicle_details = vehicle_details;
              //tabelinfo.jobcard_mechanic_parsed=jobcard_mechanic
              return tabelinfo;
            });
            this.showspinner.setSpinner(false);
            this.openJobcard = dashResult["finalamout"]["pending"];
            this.completedJobcard = dashResult["finalamout"]["complete"];
            this.closedJobcard = dashResult["finalamout"]["closed"];
            this.billAmount = dashResult["finalamout"]["total_amount"];
            this.totaljobcardcount =
              dashResult["pendingcount"]["closed"] +
              dashResult["pendingcount"]["pending"] +
              dashResult["pendingcount"]["complete"];
            if (parseInt(this.totaljobcardcount) >= 1000000000) {
              this.totaljobcardcount =
                (parseInt(this.totaljobcardcount) / 1000000000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "G";
            } else if (parseInt(this.totaljobcardcount) >= 1000000) {
              this.totaljobcardcount =
                (parseInt(this.totaljobcardcount) / 1000000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "M";
            } else if (parseInt(this.totaljobcardcount) >= 1000) {
              this.totaljobcardcount =
                (parseInt(this.totaljobcardcount) / 1000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "K";
            } else {
              this.totaljobcardcount = this.totaljobcardcount;
            }

            if (parseInt(dashResult["pendingcount"]["closed"]) >= 1000000000) {
              this.totalclosed =
                (parseInt(dashResult["pendingcount"]["closed"]) / 1000000000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "G";
            } else if (
              parseInt(dashResult["pendingcount"]["closed"]) >= 1000000
            ) {
              this.totalclosed =
                (parseInt(dashResult["pendingcount"]["closed"]) / 1000000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "M";
            } else if (parseInt(dashResult["pendingcount"]["closed"]) >= 1000) {
              this.totalclosed =
                (parseInt(dashResult["pendingcount"]["closed"]) / 1000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "K";
            } else {
              this.totalclosed = dashResult["pendingcount"]["closed"];
            }

            if (parseInt(dashResult["pendingcount"]["pending"]) >= 1000000000) {
              this.totalpending =
                (parseInt(dashResult["pendingcount"]["pending"]) / 1000000000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "G";
            } else if (
              parseInt(dashResult["pendingcount"]["pending"]) >= 1000000
            ) {
              this.totalpending =
                (parseInt(dashResult["pendingcount"]["pending"]) / 1000000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "M";
            } else if (
              parseInt(dashResult["pendingcount"]["pending"]) >= 1000
            ) {
              this.totalpending =
                (parseInt(dashResult["pendingcount"]["pending"]) / 1000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "K";
            } else {
              this.totalpending = dashResult["pendingcount"]["pending"];
            }

            if (
              parseInt(dashResult["pendingcount"]["complete"]) >= 1000000000
            ) {
              this.totalcompleted =
                (parseInt(dashResult["pendingcount"]["complete"]) / 1000000000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "G";
            } else if (
              parseInt(dashResult["pendingcount"]["complete"]) >= 1000000
            ) {
              this.totalcompleted =
                (parseInt(dashResult["pendingcount"]["complete"]) / 1000000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "M";
            } else if (
              parseInt(dashResult["pendingcount"]["complete"]) >= 1000
            ) {
              this.totalcompleted =
                (parseInt(dashResult["pendingcount"]["complete"]) / 1000)
                  .toFixed(1)
                  .replace(/\.0$/, "") + "K";
            } else {
              this.totalcompleted = dashResult["pendingcount"]["complete"];
            }

            if (dashResult.has_next == true) {
              //console.log(dashResult.has_next)
              this.hasnext = true;
              this.nextUrl = dashResult.next_page;
            } else {
              this.hasnext = false;
              this.nextUrl = "";
            }

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
  // gte the pagination data
  getDataForPagination() {
    if (this.jobcard_status != "2") {
      this.start_date = "";
      this.end_date = "";
    }
    this.generalService.jobcardpageination(this.nextUrl).subscribe(
      (dashResult) => {
        if (dashResult.success == false) {
          this.showspinner.setSpinner(false);
          this.tabelData = undefined;
          this.snakBar.open("No Record Found", "", {
            duration: 4000,
          });
        } else if (dashResult.success == true) {
          if (dashResult.has_next == true) {
            this.hasnext = true;
            this.nextUrl = dashResult.next_page;
          } else {
            this.hasnext = false;
            this.nextUrl = "";
          }
          for (var i = 0; i < Object.values(dashResult.jobcards).length; i++) {
            if (
              dashResult.jobcards[i].vehicle_details != null &&
              dashResult.jobcards[i].vehicle_details != ""
            ) {
              var vehicle_details = JSON.parse(
                dashResult.jobcards[i].vehicle_details.replace(/\\/g, "")
              );
            }

            if (
              dashResult.jobcards[i].jobcard_mechanic != null &&
              dashResult.jobcards[i].jobcard_mechanic != ""
            ) {
              var arrMechanicName = [];
              var jobcard_mechanic_object = JSON.parse(
                dashResult.jobcards[i].jobcard_mechanic.replace(/\\/g, "")
              );
              var jobcard_mechanic_map = jobcard_mechanic_object.map(function (
                mechanicname
              ) {
                if (!arrMechanicName.includes(mechanicname)) {
                  arrMechanicName.push(mechanicname);
                }
                return arrMechanicName;
              });
              var jobcard_mechanic = arrMechanicName.toString();
              //console.log(arrMechanicName)
            }
            dashResult.jobcards[i].vehicle_details = vehicle_details;
            dashResult.jobcards[i].jobcard_mechanic_parsed = jobcard_mechanic;
            this.tabelData.push(dashResult.jobcards[i]);
          }
          this.tabelData = this.tabelData.reduce(
            (acc, cur) =>
              acc.some((x) => x.jobcard_number === cur.jobcard_number)
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
  // get the search data
  getDataForSearch() {
    if (this.jobcard_status != "2") {
      this.start_date = "";
      this.end_date = "";
    }
    this.generalService
      .jobCradDashboard(
        this.userserviceworkshopid,
        this.jobcard_status,
        this.start_date,
        this.end_date,
        this.search_keywords,
        this.vehicle_number
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
            var dataset = Object.values(dashResult.jobcards);
            for (var i = 0; i < dataset.length; i++) {
              this.states.push(
                dashResult.jobcards[i]["vehicle_number"] +
                  ", " +
                  dashResult.jobcards[i]["cutsomer_name"] +
                  ", " +
                  dashResult.jobcards[i]["customer_mobile"]
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
  // edit the jobacrd
  editJobcard(jobacrd, index) {
    if (jobacrd.jobcard_form_type == "jocard_form") {
      this.openCreateJobCard(jobacrd, jobacrd.jobcard_status, "edit");
    } else if (jobacrd.jobcard_form_type == "reminder_jobcard_form") {
      this.openSetReminder(jobacrd, jobacrd.jobcard_status, "edit");
    } else {
      this.openShortInvoice(jobacrd, jobacrd.jobcard_status, "edit");
    }
  }
  // user when open the craete jobcard

  openCreateJobCard(jobcardarray, jobcardstatus, esitorcreate) {
    this.dialogService
      .CreateJobCard(jobcardarray, jobcardstatus, esitorcreate, "manual")
      .subscribe((datanew) => {
        var getStatus = this.sendPDF.sendEmail("dashboard", datanew);
        if (getStatus == true) {
          this.snakBar.open("Message", "Mail Sent", {
            duration: 4000,
          });
          if (datanew[0].mode == "updateToComplete") {
            this.checkStatus("1", "com");
          } else if (datanew[0].mode == "updateToColosed") {
            this.checkStatus("2", "clo");
          } else {
            if (datanew[0].statusjobcard == 0) {
              this.checkStatus("0", "pen");
            } else if (datanew[0].statusjobcard == 1) {
              this.checkStatus("1", "pen");
            } else {
              this.checkStatus("2", "clo");
            }
          }
        }
        // else if (getStatus == false) {
        //   console.log("its sending false");
        // }
        else {
          if (datanew[0].mode == "updateToComplete") {
            this.checkStatus("1", "com");
          } else if (datanew[0].mode == "updateToColosed") {
            this.checkStatus("2", "clo");
          } else {
            if (datanew[0].statusjobcard == 0) {
              this.checkStatus("0", "pen");
            } else if (datanew[0].statusjobcard == 1) {
              this.checkStatus("1", "com");
            } else if (datanew[0].statusjobcard == 2) {
              this.checkStatus("2", "clo");
            } else if (datanew[0].msg == "cancel") {
              console.log("cancel");
            } else {
              this.checkStatus("2", "clo");
            }
          }
        }
        //this.sentemail(datanew)
      });
  }

  // convert to int
  ConvertToInt(currentPage) {
    return parseInt(currentPage);
  }
  // opne the short invoice
  openShortInvoice(jobcardarray, jobcardstatus, esitorcreate) {
    this.dialogService
      .OpenCreateShortInvoice(jobcardarray, jobcardstatus, esitorcreate)
      .subscribe((data) => {
        this.sendPDF.sendEmail("dashboard", data);
        this.checkStatus("2", "clo");
      });
  }
  // open the set reminder
  openSetReminder(jobcardarray, jobcardstatus, esitorcreate) {
    this.dialogService
      .OpenCreateSetReminder(jobcardarray, jobcardstatus, esitorcreate)
      .subscribe((data) => {
        this.sendPDF.sendEmail("dashboard", data);
        this.checkStatus("2", "clo");
      });
  }
  //open the estimate
  openEstimate(dataofjob, index) {
    if (dataofjob.jobcard_status == "0") {
      this.dialogService
        .OpenInvoiceEstimate("Estimate", "100%", "100%", dataofjob)
        .subscribe((data) => {});
    } else if (dataofjob.jobcard_status == "1") {
      this.dialogService.OpenSelectOption("none").subscribe((data) => {
        if (data != "Estimate") {
          this.dialogService
            .OpenInvoiceEstimate("Invoice", "100%", "100%", dataofjob)
            .subscribe((data) => {});
        } else {
          this.dialogService
            .OpenInvoiceEstimate("Estimate", "100%", "100%", dataofjob)
            .subscribe((data) => {});
        }
      });
    } else {
      this.dialogService
        .OpenInvoiceEstimate("Invoice", "100%", "100%", dataofjob)
        .subscribe((data) => {});
    }
  }
  // open the invoice
  openInvoice(data, index) {
    this.dialogService
      .OpenInvoiceEstimate("Invoice", "100%", "100%", data)
      .subscribe((data) => {});
  }
  redirectToDoc(data, index) {
    let jc_id = ''+data.workshop_id +'-'+ data.id
    this.generalService
      .generateInvoiceURL(jc_id)
      .subscribe((data) => {
        if (data.success){
          // this.router.navigate([`detail_jobcard/${data.redirect_url}`]
          this.router.navigate(['jobcard-detail'], { queryParams: {doc:data.redirect_url} })
        }
        else{
          this.snakBar.open("Something Went Wrong, Please try again", "", {
            duration: 4000,
          });
        }
      },
      (err) => {
        // this.showspinner.setSpinner(false);
        this.snakBar.open("Something Went Wrong, Please try again", "", {
          duration: 4000,
        });
      }
      );
  }
}
