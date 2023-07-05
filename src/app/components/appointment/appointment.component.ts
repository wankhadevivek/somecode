import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { UserserviceService } from "src/app/services/userservice.service";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import {
  SingleDataSet,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
  Color,
} from "ng2-charts";
import { SpinnerService } from "../../services/spinner.service";
import { GeneralService } from "../../services/general.service";
import { MatSnackBar } from "@angular/material";
import { ErrorMessgae } from "../../shared/error_message/error";
import * as moment from "moment";
import * as _ from "lodash";
import { type } from "os";
import * as pluginLabels from "chartjs-plugin-labels";
import { combineAll } from "rxjs/operators";
import * as Highcharts from "highcharts";
import HC_exporting from "highcharts/modules/exporting";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { DilogOpenService } from "../../services/dilog-open.service";
import { PrintsharepdfService } from "../../services/printsharepdf.service";
import { TokenStorageService } from "../../shared/interceptor/token.service";
import { Subject } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  formatISO,
} from "date-fns";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from "angular-calendar";
import { DatePipe } from "@angular/common";
import * as glob from "../../shared/usercountry/userCountryGlobal";
const colors: any = {
  red: {
    primary: "#ad2121",
    secondary: "#FAE3E3",
  },
  blue: {
    primary: "#8686ea",
    secondary: "#8686ea",
  },
  lightyello: {
    primary: "#efe02b",
    secondary: "#efe02b",
  },
  green: {
    primary: "#56ef77",
    secondary: "#56ef77",
  },
  yellow: {
    primary: "#e3bc08",
    secondary: "#FDF1BA",
  },
};

@Component({
  selector: "app-appointment",
  templateUrl: "./appointment.component.html",
  styleUrls: ["./appointment.component.css"],
})
/**
 * In this compoenet bookings
 * are shown calendar wise and
 * managed here
 */
export class AppointmentComponent implements OnInit {
  @ViewChild("modalContent", { static: true }) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  actions: CalendarEventAction[] = [
    {
      label: '<span class="editbook">View</span>',
      a11yLabel: "Edit",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent("Edited", event);
      },
    },
  ];

  reason;
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = Array();
  activeDayIsOpen: boolean = false;
  showapp: boolean = false;
  bookingsta;
  bookCustomerName;
  bookCustomermobile;
  bookCustomervehicle;
  bookCustomerdate;
  bookCustomeraddress;
  showaddressall: boolean = false;
  bookCustomerservices;
  bookCustomeramount;
  bookCustomerbookingdate;
  bookingcustomerid;
  bookingtype;
  bookdropaddress;
  isPickOrDrop;
  bookcustomerstatus;
  isedited;
  showthisdec: boolean = false;
  showconfirm: boolean = false;
  showreshedule: boolean = false;
  showcrejob: boolean = false;
  mainvehicledetails;
  customervehiclenumber;
  jobitems;
  customeridforjob;
  jobcreated: boolean = false;
  jobcardnumber;
  jobcardamount;
  deliverydatetime;
  creteddate;
  contactlink;
  btnFlag;
  currency_symbol: any;
  workshopmobile;
  workshopname;
  alldata;
  constructor(
    private modal: NgbModal,
    public sendPDF: PrintsharepdfService,
    private showspinner: SpinnerService,
    private dialog: DilogOpenService,
    private userservice: UserserviceService,
    public generalservice: GeneralService,
    public getUserIn: TokenStorageService,
    private snakBar: MatSnackBar,
    public datepipe: DatePipe
  ) {}
  // load the calendar and bookings in the calendar
  ngOnInit() {
    this.currency_symbol = glob.currency_symbol;
    this.events = [];
    // var data = JSON.parse(localStorage.getItem("work_data"));
    var data = JSON.parse(localStorage.getItem("user"));
    this.workshopname = data.workshop_name;
    this.workshopmobile = data.workshop_mobile_number_1;
    this.generalservice
      .getAllBookings(this.userservice.getData()["workshop_id"])
      .subscribe(
        (bookData) => {
          this.showspinner.setSpinner(true);
          if (bookData.success == true) {
            var neawArr;
            neawArr = bookData.booking;
            this.alldata = bookData.booking;
            neawArr.map((data) => {
              var colorinser;
              var status;
              if (data.status == "in process") {
                colorinser = colors.blue;
                status = "Open(" + data.bookingid + ")\n";
              } else if (data.status == "rejected") {
                // declined
                colorinser = colors.lightyello;

                status = "Declined(" + data.bookingid + ")\n";
              } else if (data.status == "approved") {
                colorinser = colors.green;
                status = "Approved(" + data.bookingid + ")\n";
              } else if (data.status == "completed") {
                colorinser = colors.yellow;
                status = "Completed(" + data.bookingid + ")\n";
              } else if (data.status == "deleted") {
                colorinser = colors.red;
                status = "Deleted(" + data.bookingid + ")\n";
              }
              var vehicledetail;
              vehicledetail =
                JSON.parse(data.vehicle_details).make +
                " " +
                JSON.parse(data.vehicle_details).model +
                " " +
                JSON.parse(data.vehicle_details).variant;
              this.events.push({
                id: data,
                start: new Date(data.date + " " + data.time),
                title:
                  status +
                  "\nTime: " +
                  data.time +
                  "AM\nName: " +
                  data.customer_name +
                  "(" +
                  data.customer_phone +
                  ")\n" +
                  "Vehicle:" +
                  vehicledetail +
                  " " +
                  "(" +
                  data.vehicle_number +
                  ")",
                color: colorinser,
                actions: this.actions,
                allDay: true,
              });
            });
          }
          this.dayClickedagain(new Date());
          this.showspinner.setSpinner(false);
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
    //check subscription is expired show hide create jobcard btn
    var expiry_date = new Date(
      this.getUserIn.getUser().recharge_data[0].expiry_date
    );
    var current_date = new Date();
    if (current_date.getTime() > expiry_date.getTime()) {
      this.btnFlag = false;
    } else {
      this.btnFlag = true;
    }
  }

  // check the days clicked
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
  // check the days clicked again
  dayClickedagain(date): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        this.events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = false;
      }
      this.viewDate = date;
    }
  }
  // check event chnages
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent("Dropped or resized", event);
  }
  // handel event on clcik of the date
  handleEvent(action: string, event: CalendarEvent): void {
    if (action == "Edited") {
      this.showapp = true;
      if (event.id["booking_type"] == "maual") {
        this.bookingtype = "Manual";
      } else {
        this.bookingtype = "Online";
      }
      if (event.id["is_pick"] == "yes") {
        this.isPickOrDrop = "Pick Up";
      } else {
        this.isPickOrDrop = "Drop";
      }
      this.isedited = event.id["isedited"];
      if (event.id["status"] == "rejected") {
        this.bookingsta = "Booking Cancelled";
        this.showcrejob = true;
        this.showthisdec = true;
        this.showconfirm = true;
        this.showreshedule = true;
        this.jobcreated = false;
      } else if (event.id["status"] == "approved") {
        this.bookingsta = "Booking Confirmed";
        this.showthisdec = true;
        this.showconfirm = true;
        this.showreshedule = false;
        this.showcrejob = false;
        this.jobcreated = false;
      } else if (event.id["status"] == "in process") {
        this.bookingsta = "Booking Received";
        this.showthisdec = false;
        this.showconfirm = false;
        this.showreshedule = false;
        this.jobcreated = false;
        this.showcrejob = false;
      } else if (event.id["status"] == "deleted") {
        this.bookingsta = "Booking Deleted";
        this.showthisdec = true;
        this.showconfirm = true;
        this.showreshedule = true;
        this.jobcreated = false;
        this.showcrejob = true;
      } else if (event.id["status"] == "completed") {
        this.bookingsta = "Jobcard Created";
        this.showthisdec = true;
        this.showconfirm = true;
        this.showreshedule = true;
        this.jobcreated = true;
        this.showcrejob = false;
        this.getJobcardDetails(event.id["jobcard_number"]);
      } else {
        this.bookingsta = "Booking Received";
        this.showthisdec = false;
        this.showconfirm = false;
        this.showreshedule = false;
        this.jobcreated = false;
        this.showcrejob = false;
      }
      // this.reason = event.id["reason"];
      this.jobitems = event.id["services"];
      this.customeridforjob = event.id["customer_id"];
      this.customervehiclenumber = event.id["vehicle_number"];
      this.bookcustomerstatus = event.id["status"];
      this.isedited = event.id["edited"];
      this.bookdropaddress = event.id["customer_address_drop"];
      this.bookingcustomerid = event.id["bookingid"];
      this.bookCustomermobile = event.id["customer_phone"];
      this.bookCustomerName = event.id["customer_name"];
      this.bookCustomerdate = event.id["created_at"];
      this.bookCustomerbookingdate = event.id["date"] + " " + event.id["time"];
      this.bookCustomeramount = event.id["total_amount"];
      this.bookCustomeraddress = event.id["customer_address_pick"];
      if (event.id["is_pick"] == "yes") {
        this.showaddressall = true;
      } else {
        this.showaddressall = false;
      }
      this.mainvehicledetails = event.id["vehicle_details"];
      this.bookCustomervehicle =
        JSON.parse(event.id["vehicle_details"]).make +
        " " +
        JSON.parse(event.id["vehicle_details"]).model +
        " " +
        JSON.parse(event.id["vehicle_details"]).variant;
      var sevicesname = Array();
      if (event.id["services"] != "") {
        JSON.parse(event.id["services"]).map((data) => {
          sevicesname.push(data.part_name);
        });
      }
      if (sevicesname.length != 0) {
        this.bookCustomerservices = sevicesname.toString();
      } else {
        this.bookCustomerservices = "No Service Selected";
      }
    }
  }
  // check event
  checkevent(event) {
    if (event.day.events.length != 0) {
      this.dialog.OpenAppoitmentDay(event.day.events).subscribe((event) => {
        if (event.action == "Edited") {
          this.showapp = true;
          if (event.id["booking_type"] == "maual") {
            this.bookingtype = "Manual";
          } else {
            this.bookingtype = "Online";
          }
          if (event.id["is_pick"] == "yes") {
            this.isPickOrDrop = "Pick & Drop";
          } else {
            this.isPickOrDrop = "Visit";
          }
          this.isedited = event.id["isedited"];
          if (event.id["status"] == "rejected") {
            this.bookingsta = "Booking Cancelled";
            this.showcrejob = true;
            this.showthisdec = true;
            this.showconfirm = true;
            this.showreshedule = true;
            this.jobcreated = false;
          } else if (event.id["status"] == "approved") {
            this.bookingsta = "Booking Confirmed";
            this.showthisdec = true;
            this.showconfirm = true;
            this.showreshedule = false;
            this.showcrejob = false;
            this.jobcreated = false;
          } else if (event.id["status"] == "in process") {
            this.bookingsta = "Booking Received";
            this.showthisdec = false;
            this.showconfirm = false;
            this.showreshedule = false;
            this.jobcreated = false;
            this.showcrejob = false;
          } else if (event.id["status"] == "deleted") {
            this.bookingsta = "Booking Deleted";
            this.showthisdec = true;
            this.showconfirm = true;
            this.showreshedule = true;
            this.jobcreated = false;
            this.showcrejob = true;
          } else if (event.id["status"] == "completed") {
            this.bookingsta = "Jobcard Created";
            this.showthisdec = true;
            this.showconfirm = true;
            this.showreshedule = true;
            this.jobcreated = true;
            this.showcrejob = false;
            this.getJobcardDetails(event.id["jobcard_number"]);
          } else {
            this.bookingsta = "Booking Received";
            this.showthisdec = false;
            this.showconfirm = false;
            this.showreshedule = false;
            this.jobcreated = false;
            this.showcrejob = false;
          }

          this.reason = event.id["reason"];
          this.jobitems = event.id["services"];
          this.customeridforjob = event.id["customer_id"];
          this.customervehiclenumber = event.id["vehicle_number"];
          this.bookcustomerstatus = event.id["status"];
          this.isedited = event.id["edited"];
          this.bookdropaddress = event.id["customer_address_drop"];
          this.bookingcustomerid = event.id["bookingid"];
          this.bookCustomermobile = event.id["customer_phone"];
          this.bookCustomerName = event.id["customer_name"];
          this.bookCustomerdate = event.id["created_at"];
          this.bookCustomerbookingdate =
            event.id["date"] + " " + event.id["time"];
          this.bookCustomeramount = event.id["total_amount"];
          this.bookCustomeraddress = event.id["customer_address_pick"];
          if (event.id["is_pick"] == "yes") {
            this.showaddressall = true;
          } else {
            this.showaddressall = false;
          }
          this.mainvehicledetails = event.id["vehicle_details"];
          this.bookCustomervehicle =
            JSON.parse(event.id["vehicle_details"]).make +
            " " +
            JSON.parse(event.id["vehicle_details"]).model +
            " " +
            JSON.parse(event.id["vehicle_details"]).variant;
          var sevicesname = Array();
          if (event.id["services"] != "") {
            JSON.parse(event.id["services"]).map((data) => {
              sevicesname.push(data.part_name);
            });
          }
          if (sevicesname.length != 0) {
            this.bookCustomerservices = sevicesname.toString();
          } else {
            this.bookCustomerservices = "No Service Selected";
          }
        }
      });
    }
  }
  // show the bookig details
  showallbook() {
    this.showapp = false;
    //this.ngOnInit()
  }
  // add the venet
  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: "New event",
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }
  // set the view of event
  setView(view: CalendarView) {
    this.view = view;
  }
  // close the month view
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  // opne list of appoitmet popup day wise
  openBookappoitment() {
    this.dialog.OpenBookingForm("data").subscribe((getData) => {
      this.showspinner.setSpinner(false);
      if (getData == "true") {
        this.ngOnInit();
      }
    });
  }
  // open confirm boc to confimr booking
  openConfirmBookingBox() {
    var questionForDialog;
    questionForDialog = "Are you Sure want to confirm the booking?";
    this.dialog
      .OpenConfirmDialog(questionForDialog, true, "Confirm")
      .subscribe((answer) => {
        if (answer == true) {
          this.generalservice
            .updateBookingStatusConfirm(
              this.userservice.getData()["workshop_id"],
              this.bookingcustomerid,
              "confirm"
            )
            .subscribe((delet) => {
              this.showspinner.setSpinner(true);
              if (delet["success"] == true) {
                this.bookingsta = "Booking Confirmed";
                this.showthisdec = true;
                this.showconfirm = true;
                this.showreshedule = false;
                this.showcrejob = false;
                this.jobcreated = false;
                this.showspinner.setSpinner(false);
                this.snakBar.open("Message", "Booking Confirmed Successfully", {
                  duration: 4000,
                });
              }
            });
        } else {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Message", "Booking Not Confirmed", {
            duration: 4000,
          });
        }
      });
  }
  // popup to decline booking
  openDeclinedBox() {
    this.dialog
      .OpenBookingFormDeclineOrUpdate(this.bookingcustomerid, "decline")
      .subscribe((answer) => {
        if (answer.success == true) {
          this.snakBar.open("Message", "Booking Declined Successfully", {
            duration: 4000,
          });
          this.reason = answer.data;
          this.bookingsta = "Booking Cancelled";
          this.showcrejob = true;
          this.showthisdec = true;
          this.showconfirm = true;
          this.showreshedule = true;
          this.jobcreated = false;
        } else {
          this.snakBar.open("Message", "Booking Not Declined", {
            duration: 4000,
          });
        }
      });
  }
  // popup to reshulde booking
  openToReschedule() {
    this.dialog
      .OpenBookingFormDeclineOrUpdate(this.bookingcustomerid, "res")
      .subscribe((answer) => {
        if (answer.success != undefined) {
          if (answer.success == true) {
            this.bookCustomerbookingdate = answer.data;
            this.snakBar.open("Message", "Booking Reschedule Successfully", {
              duration: 4000,
            });
          } else {
            this.snakBar.open("Message", "Booking Not Reschedule", {
              duration: 4000,
            });
          }
        } else {
          this.snakBar.open("Message", "Booking Not Reschedule", {
            duration: 4000,
          });
        }
      });
  }
  // popup to create jobcard
  openToCreateJobcard() {
    var jobcardarray;
    var jobstotal;

    this.generalservice
      .checkVehicleNumber(
        this.userservice.getData()["workshop_id"],
        this.customervehiclenumber
      )
      .subscribe(
        (vehicleIs) => {
          if (vehicleIs.success == true) {
            this.showspinner.setSpinnerForLogin(false);
            this.snakBar.open(
              "Message",
              "Jobcard is in Open or Complete State",
              {
                duration: 4000,
              }
            );
          } else {
            if (JSON.parse(this.jobitems).length != 0) {
              this.jobitems = this.jobitems;
              jobstotal = JSON.parse(this.jobitems).length;
            } else {
              this.jobitems = "[]";
              jobstotal = 0;
            }
            var mecanic = Array();
            mecanic.push(this.userservice.getData()["name"]);
            jobcardarray = {
              additional_notes: "",
              advance: "0.0",
              after_km: "No KM Reminder",
              balance_amount: this.bookCustomeramount,
              cgst: "0.0",
              cheque: "",
              closed_date: "",
              complete_date: "",
              complete_time: null,
              cost_estimate: this.bookCustomeramount,
              count_for_cost_estimate_change: "1",
              count_for_est_changes: "1",
              created_at: "",
              customer_mobile: this.bookCustomermobile,
              cutsomer_name: this.bookCustomerName,
              discount: "0 %",
              discountagain: "0 %",
              estimated_delivery_datetime: "",
              exit_date_time: null,
              exit_note: "",
              final_amount: this.bookCustomeramount,
              fuel: "0",
              gst_number: "",
              igst: null,
              job_total_discount: "",
              jobcard_customer_voice: "[]",
              jobcard_dent_marks: "[]",
              jobcard_dent_photos: "",
              jobcard_form_type: "jocard_form",
              jobcard_job_items: this.jobitems,
              jobcard_lubes_items: "[]",
              jobcard_mechanic: JSON.stringify(mecanic),
              jobcard_number: "",
              jobcard_spare_items: "[]",
              jobcard_status: "nostaus",
              jobcard_vehicle_inventory: "[]",
              jobs_total: jobstotal,
              km: "0",
              lube_total_discount: "",
              lubes_total: "0.0",
              manual_or_book: "online",
              paid_amount: "0.0",
              payment_mode: "",
              previous_cost_estimate: "1.0",
              previous_estimated_delivery_datetime: null,
              reminder: "1 Months",
              settings_data_json: "",
              sgst: "0.0",
              sms_alert: "true",
              spare_total: "0.0",
              spare_total_discount: "",
              total_amount: this.bookCustomeramount,
              total_gst: "0.0",
              updated_at: null,
              vedio: "false",
              vehicle_details: this.mainvehicledetails,
              vehicle_number: this.customervehiclenumber,
              work_note: "[]",
              workshop_customer_id: this.customeridforjob,
              worksng_in: "false",
              supervisor: "",
            };

            console.log("jobcardarray", jobcardarray);

            this.dialog
              .CreateJobCard(jobcardarray, "nostaus", "edit", "online")
              .subscribe((datanew) => {
                if (datanew[0].status == true) {
                  var getStatus = this.sendPDF.sendEmail("dashboard", datanew);
                  if (getStatus == true) {
                    this.snakBar.open(
                      "Message",
                      "Mail Sent and Jobcard Created",
                      {
                        duration: 4000,
                      }
                    );
                  } else {
                    this.showspinner.setSpinner(false);
                    this.snakBar.open("Message", "Jobcard Created", {
                      duration: 4000,
                    });
                  }
                  this.bookingsta = "Jobcard Created";
                  this.jobcreated = true;
                  this.showcrejob = false;
                  this.showthisdec = true;
                  this.showconfirm = true;
                  this.showreshedule = true;
                  this.generalservice
                    .updateBookingStatusComplete(
                      this.userservice.getData()["workshop_id"],
                      this.bookingcustomerid,
                      datanew[0].jobcard_number
                    )
                    .subscribe(
                      (dataupdate) => {
                        this.showspinner.setSpinner(true);
                        if (dataupdate.success == true) {
                          this.snakBar.open("Message", "Jobcard Created", {
                            duration: 4000,
                          });
                        }
                        this.showspinner.setSpinner(false);
                      },
                      (err) => {
                        this.showspinner.setSpinner(false);
                        this.snakBar.open("Error", ErrorMessgae[0][err], {
                          duration: 4000,
                        });
                      }
                    );
                  this.getJobcardDetails(datanew[0].jobcard_number);
                  this.showspinner.setSpinner(false);
                } else {
                  this.showspinner.setSpinner(false);
                  this.snakBar.open("Message", "Jobcard Not Created", {
                    duration: 4000,
                  });
                }
              });
          }
        },
        (err) => {
          this.showspinner.setSpinnerForLogin(false);
          this.snakBar.open(err, ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  // popupto get jobcard details
  getJobcardDetails(jobcardnumber) {
    this.generalservice
      .jobCradDetails(this.userservice.getData()["workshop_id"], jobcardnumber)
      .subscribe(
        (data) => {
          this.showspinner.setSpinner(true);
          if (data.success == true) {
            this.jobcardnumber = data.jobcards[0].jobcard_number;
            this.jobcardamount = data.jobcards[0].total_amount;
            this.deliverydatetime =
              data.jobcards[0].estimated_delivery_datetime;
            this.creteddate = new Date(data.jobcards[0].created_at);
            this.creteddate.setHours(this.creteddate.getHours() + 5);
            this.creteddate.setMinutes(this.creteddate.getMinutes() + 30);
          }
          this.showspinner.setSpinner(false);
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  // share on whatsapp
  sharewhatsApp() {
    var app_time = this.datepipe.transform(
      this.bookCustomerbookingdate,
      "d MMM, y, h:mm a"
    );

    if (this.bookcustomerstatus == "in process") {
      this.contactlink =
        "https://web.whatsapp.com/send?phone=91" +
        this.bookCustomermobile +
        `&text=Dear Customer, Your booking has been received for ${this.bookCustomervehicle}  - ${this.customervehiclenumber}.` +
        ` Thank you for choosing us. We will connect with you soon. ${this.workshopname} ${this.workshopmobile}`;
    } else if (this.bookcustomerstatus == "rescheduled") {
      this.contactlink =
        "https://web.whatsapp.com/send?phone=91" +
        this.bookCustomermobile +
        "&text=Dear Customer, We are rescheduling your service booking for" +
        this.bookCustomervehicle +
        "-" +
        this.customervehiclenumber +
        +`New booking Details Date: ${app_time}` +
        `Sorry for the inconvenience caused.For any queries, feel free to contact us.${this.workshopname} ${this.workshopmobile}`;
    } else if (this.bookcustomerstatus == "approved") {
      
      this.contactlink =
        "https://web.whatsapp.com/send?phone=91" +
        this.bookCustomermobile +
        "&text=Dear Customer, Your booking has been confirmed for " +
        this.bookCustomervehicle +
        this.customervehiclenumber +
        " Our executive will contact you soon." +
        app_time +
        " Thank you for choosing us. We will connect with you soon." +
        this.workshopname +
        this.workshopmobile;
    } else if (this.bookcustomerstatus == "rejected") {
      
      this.contactlink =
        "https://web.whatsapp.com/send?phone=91" +
        this.bookCustomermobile +
        `&text=Dear Customer, We regret to inform you that, your booking has been declined for the following Reason:` +
        " '" +
        this.reason.toUpperCase() +
        "'." +
        "\r\n\r\n" +
        ` Sorry for the inconvenience caused. For any queries, feel free to contact us. ${this.workshopname} ${this.workshopmobile}`;
    }

    // this.contactlink = "https://wa.me/+91" + this.bookCustomermobile;
  }
}
