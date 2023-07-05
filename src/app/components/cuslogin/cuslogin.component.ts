import {
  Injector,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { GeneralService } from "../../services/general.service";
import { UserserviceService } from "../../services/userservice.service";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { SpinnerService } from "../../services/spinner.service";
import { ErrorMessgae } from "../../shared/error_message/error";
import { AbstractService } from "../../services/comman/abstract.service";
import { DilogOpenService } from "../../services/dilog-open.service";
import { EndUserLayoutComponent } from "../enduserlayout/enduserlayout.component";
import * as glob from "../../shared/usercountry/userCountryGlobal";
import { MessagingService } from "../../services/messaging.service";
import { stringify } from "@angular/compiler/src/util";

@Component({
  selector: "app-cuslogin",
  templateUrl: "./cuslogin.component.html",
  styleUrls: ["./cuslogin.component.css"],
})
/**
 * This compoenet is loaded when the user
 * login and when user hits the end-user app
 * url
 */
export class CusloginComponent implements OnInit {
  workshopOnline;
  showonlineservices;
  showonlineservicestwo;
  onlineserviceonename;
  onlineserviceonedes;
  onlineserviceoneamount;
  onlineservicetwoname;
  onlineservicetwodes;
  onlineservicetwoamount;
  workshopname;
  workshoptiltle;
  workshopaddress;
  workshopemail;
  workshopemailhref;
  workshopverified;
  workshoplogo;
  settingsBillData;
  termsandconditions;
  showloginsection: boolean;
  userdata;
  urlparam;
  paramforhome;
  paramforservice;
  paramforbooking;
  jobcardListed: boolean;
  jobcardData;
  parmforbook;
  contactlink;
  vehiclepic;
  workshopmobile;
  jobtabclass = "";
  jobtabdataclass = "tab-pane fade";
  sparetabclass = "";
  sparetabdataclass = "tab-pane fade";
  lubetabclass = "";
  lubetabdataclass = "tab-pane fade";
  showinvoive: boolean = true;
  showfeedback: boolean = true; //  --- changes  by Aaliya  ---
  showspare: boolean = true;
  showlube: boolean = true;
  showjob: boolean = true;
  showdent: boolean = true;
  showmarks: boolean = true;
  showcustomer: boolean = true;
  showinven: boolean = true;
  customervoice = Array();
  vehicleinventory = Array();
  dentmarks = Array();
  dentphotos = Array();
  spares = Array();
  lubes = Array();
  jobs = Array();
  vehicles: any;
  totalAmount;
  imageHeight = 0;
  imageWidth = 0;
  jobcardnumber;
  intime;
  estimate;
  deliveryby;
  advance;
  discount;
  payable;
  paid;
  balance;
  paymentmode;
  paymentdate;
  cpmpletetime;
  openDetailJobcard: boolean = false;
  secondclass = "col-lg-4 col-sm-4 col-md-4 col-xs-9 detailsjobcard";
  thirdclass = "col-lg-4 col-sm-4 col-md-4 col-xs-9 detailsjobcard";
  rowclass = "row topgargedetails";
  currency_symbol: any;
  xpandStatus = false;
  feedbackForm: FormGroup;
  @ViewChild("myCanvass", { static: false })
  myCanvass: ElementRef<HTMLCanvasElement>;
  feedbackPresent: boolean = false;
  // =================== Change #2 by Aaliya ===========================
  overallRating: number = 0;
  // =================== Change #2 by Aaliya ===========================
  currentYear = new Date().getFullYear();
  constructor(
    private dialogservice: DilogOpenService,
    public abstract: AbstractService,
    private showspinner: SpinnerService,
    private router: Router,
    private snakBar: MatSnackBar,
    private formbuild: FormBuilder,
    private generalService: GeneralService,
    private userService: UserserviceService,
    public usercomp: EndUserLayoutComponent,
    private injector: Injector
  ) {
    this.previousFeedback();
  }
  // Worksop, customer data loaded
  ngOnInit() {
    this.currency_symbol = glob.currency_symbol;
    if (localStorage.getItem("work_data")) {
      this.getcallonconstructor();
      var data = JSON.parse(localStorage.getItem("work_data"));
      this.workshopOnline = true;
      var vechileTypetoshow = [];
      for (var i = 0; i < data.workshop_type.split(",").length; i++) {
        if (data.workshop_type.split(",")[i] === "1") {
          if (i == 0) {
            vechileTypetoshow.push("2");
          } else if (i == 1) {
            vechileTypetoshow.push("3");
          } else if (i == 2) {
            vechileTypetoshow.push("4");
          } else if (i == 3) {
            vechileTypetoshow.push("6");
          }
        }
      }
      if (vechileTypetoshow.length == 4) {
        this.vehiclepic = "../../../assets/images/sports-car.png";
      } else if (vechileTypetoshow.length != 1) {
        if (
          vechileTypetoshow.includes("6") &&
          vechileTypetoshow.includes("4")
        ) {
          this.vehiclepic = "../../../assets/images/sports-car.png";
        } else if (
          vechileTypetoshow.includes("2") &&
          vechileTypetoshow.includes("4")
        ) {
          this.vehiclepic = "../../../assets/images/motorcycle.png";
        } else if (
          vechileTypetoshow.includes("2") &&
          vechileTypetoshow.includes("3")
        ) {
          this.vehiclepic = "../../../assets/images/motorcycle.png";
        } else if (
          vechileTypetoshow.includes("6") &&
          vechileTypetoshow.includes("2")
        ) {
          this.vehiclepic = "../../../assets/images/delivery-truck.png";
        } else if (
          vechileTypetoshow.includes("3") &&
          vechileTypetoshow.includes("6")
        ) {
          this.vehiclepic = "../../../assets/images/delivery-truck.png";
        } else if (
          vechileTypetoshow.includes("3") &&
          vechileTypetoshow.includes("4")
        ) {
          this.vehiclepic = "../../../assets/images/sports-car.png";
        }
      } else {
        if (vechileTypetoshow.includes("2")) {
          this.vehiclepic = "../../../assets/images/motorcycle.png";
        } else if (vechileTypetoshow.includes("3")) {
          this.vehiclepic = "../../../assets/images/rickshaw.png";
        } else if (vechileTypetoshow.includes("4")) {
          this.vehiclepic = "../../../assets/images/sports-car.png";
        } else if (vechileTypetoshow.includes("6")) {
          this.vehiclepic = "../../../assets/images/delivery-truck.png";
        }
      }
      this.parmforbook = "/cus/" + data.url_param + "/book";
      this.paramforservice = "/cus/" + data.url_param + "/services";
      this.settingsBillData = JSON.parse(data.settings)[0];
      this.workshopname = data.workshop_name;
      if (
        this.settingsBillData.tag_line != "" &&
        this.settingsBillData.tag_line != null &&
        this.settingsBillData.tag_line != undefined
      ) {
        this.workshoptiltle = this.settingsBillData.tag_line;
      } else {
        this.workshoptiltle = "none";
      }

      if (data.address != "" && data.address != null) {
        if (data.pincode != 0) {
          this.workshopaddress =
            data.address +
            " ," +
            data.city +
            " ," +
            data.state +
            " ," +
            data.pincode;
        } else {
          this.workshopaddress =
            data.address + " ," + data.city + " ," + data.state;
        }
      } else {
        this.workshopaddress = "none";
      }

      if (data.email != "") {
        this.workshopemail = data.email;
        this.workshopemailhref = "mailto:" + "" + data.email;
      } else {
        this.workshopemail = "none";
        this.workshopemailhref = "none";
      }
      this.workshopmobile = data.workshop_mobile_number_1;
      if (
        this.workshopemail != "none" &&
        this.workshopaddress != "none" &&
        data.logo != "none"
      ) {
        this.workshopverified = true;
      } else {
        this.workshopverified = false;
      }

      if (data.logo != "none") {
        this.workshoplogo = data.logo;
      } else {
        this.workshoplogo = this.abstract.imageUrl1;
      }
      if (
        this.settingsBillData.terms_and_conditions != "" &&
        this.settingsBillData.terms_and_conditions != "0" &&
        this.settingsBillData.terms_and_conditions != null
      ) {
        this.termsandconditions =
          this.settingsBillData.terms_and_conditions.split(";");
      } else {
        this.termsandconditions = "none";
      }

      if (data.onlinedata.length != 0) {
        this.showonlineservices = true;
        this.onlineserviceonename = data.onlinedata[0].part_name;
        if (
          data.onlinedata[0].description != null &&
          data.onlinedata[0].description != ""
        ) {
          this.onlineserviceonedes = data.onlinedata[0].description;
        } else {
          this.onlineserviceonedes = "";
        }
        this.onlineserviceoneamount = parseInt(
          data.onlinedata[0].unit_sale_price
        );
        if (data.onlinedata.length > 1) {
          this.showonlineservicestwo = true;
          this.onlineservicetwoname = data.onlinedata[1].part_name;
          if (
            data.onlinedata[1].description != null &&
            data.onlinedata[1].description != ""
          ) {
            this.onlineservicetwodes = data.onlinedata[1].description;
          } else {
            this.onlineservicetwodes = "";
          }
          this.onlineservicetwoamount = parseInt(
            data.onlinedata[1].unit_sale_price
          );
        } else {
          this.showonlineservicestwo = false;
        }
      } else {
        this.showonlineservices = false;
      }
      if (this.showloginsection == true) {
        this.generalService
          .getLatestJobcard(data.workshop_id, this.userdata.customer_mobile)
          .subscribe(
            (dataJobcard) => {
              this.showspinner.setSpinnerForEnd(true);
              if (dataJobcard.success == true) {
                this.jobcardListed = true;
                this.jobcardData = dataJobcard.jobcards;
                this.jobcardData["vehicle_details"] = JSON.parse(
                  this.jobcardData["vehicle_details"].replace(/\\/g, "")
                );
              } else {
                this.jobcardListed = false;
                this.jobcardData = [];
              }
              this.showspinner.setSpinnerForEnd(false);
            },
            (err) => {
              this.showspinner.setSpinnerForEnd(false);
              this.snakBar.open("Error", ErrorMessgae[0][err], {
                duration: 4000,
              });
            }
          );
      }
    } else {
      this.workshopOnline = false;
    }
  }

  SetNotificationValues() {
    const message =
      "Get Real-Time Updates from Your Workshop, Regarding your Availed Services & Charges Details";
    this.dialogservice
      .OpenNotificationDialog(message, 5.5)
      .subscribe((answer) => {
        if (answer == true) {
          localStorage.setItem("notifyActive", "true");
          const messagingService = this.injector.get(MessagingService);

          messagingService.requestPermission();

          messagingService.receiveMessage();

          setTimeout(() => {
            this.generalService
              .updateEndUserNotifyParams("set", this.userdata.customer_mobile)
              .subscribe((data) => console.log("data"));
          }, 2500);
        } else if (answer == false) {
          // set local storage value to false

          localStorage.setItem("notifyActive", "false");
        }
      });
  }

  ngAfterViewInit() {
    if (
      localStorage.getItem("notifyActive") === "false" &&
      localStorage.getItem("already_notified") !== "true"
    ) {
      this.SetNotificationValues();

      localStorage.setItem("already_notified", "true");
    }
  }

  //  -------------------- changes  by Aaliya  ------------------------------

  
  feedback() {
    this.feedbackForm = this.formbuild.group({
      service_quality: [
        5,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      customer_support: [
        5,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      timeliness: [
        5,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      pricing: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      overall_rating: [
        5,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      comment: [""],
    });
  }
  toOne(x) {
    if (1 <= x && x <= 5) {
      return x;
    } else {
      return 5;
    }
  }
  submitFeedback() {
    if (localStorage.getItem("work_data")) {
      var data = JSON.parse(localStorage.getItem("work_data"));
      this.generalService
        .sendfeedback(
          data.workshop_id,
          this.jobcardnumber,
          this.toOne(this.feedbackForm.getRawValue().service_quality),
          this.toOne(this.feedbackForm.getRawValue().customer_support),
          this.toOne(this.feedbackForm.getRawValue().timeliness),
          this.toOne(this.feedbackForm.getRawValue().pricing),
          this.toOne(this.feedbackForm.getRawValue().overall_rating),
          this.feedbackForm.getRawValue().comment
        )
        .subscribe(
          (feedbackResponse) => {
            this.showspinner.setSpinner(true);
            if (feedbackResponse.success == true) {
              this.showspinner.setSpinner(false);
              this.snakBar.open(
                "Message",
                ErrorMessgae[0][feedbackResponse.message],
                {
                  duration: 4000,
                }
              );
              // console.log("Thank you")
            } else {
              this.showspinner.setSpinner(false);
              this.snakBar.open(
                "Message",
                ErrorMessgae[0][feedbackResponse.message],
                {
                  duration: 4000,
                }
              );
              // console.log("Retry")
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
  // -------------Test -----------------
  previousFeedback() {
    if (localStorage.getItem("work_data")) {
      var data = JSON.parse(localStorage.getItem("work_data"));
      if (localStorage.getItem("enduser")) {
        this.generalService
          .getLatestJobcard(
            data.workshop_id,
            JSON.parse(localStorage.getItem("enduser")).customer_mobile
          )
          .subscribe(
            (dataJobcard) => {
              this.showspinner.setSpinnerForEnd(true);
              this.jobcardnumber = dataJobcard.jobcards.jobcard_number;
              this.showspinner.setSpinnerForEnd(false);
            },
            (err) => {
              this.showspinner.setSpinnerForEnd(false);
              this.feedback();
              this.snakBar.open("Error", ErrorMessgae[0][err], {
                duration: 4000,
              });
            }
          );
      } else {
        this.feedback();
      }

      this.generalService
        .getfeedback(data.workshop_id, this.jobcardnumber)
        .subscribe(
          (prevFeedback) => {
            this.showspinner.setSpinner(true);
            if (prevFeedback.success == true) {
              this.showspinner.setSpinner(false);
              if (stringify(prevFeedback.feedback) != "[]") {
                const len = prevFeedback.feedback.length;
                for (var i = 0; i < len; i++) {
                  if (
                    prevFeedback.feedback[i].jobcard_number ==
                    this.jobcardnumber
                  ) {
                    this.feedbackForm = this.formbuild.group({
                      service_quality: [
                        prevFeedback.feedback[i].service_quality,
                        [
                          Validators.required,
                          Validators.min(1),
                          Validators.max(5),
                        ],
                      ],
                      customer_support: [
                        prevFeedback.feedback[i].customer_support,
                        [
                          Validators.required,
                          Validators.min(1),
                          Validators.max(5),
                        ],
                      ],
                      timeliness: [
                        prevFeedback.feedback[i].timeliness,
                        [
                          Validators.required,
                          Validators.min(1),
                          Validators.max(5),
                        ],
                      ],
                      pricing: [
                        prevFeedback.feedback[i].pricing,
                        [
                          Validators.required,
                          Validators.min(1),
                          Validators.max(5),
                        ],
                      ],
                      overall_rating: [
                        prevFeedback.feedback[i].overall_rating,
                        [
                          Validators.required,
                          Validators.min(1),
                          Validators.max(5),
                        ],
                      ],
                      comment: [prevFeedback.feedback[i].comment],
                    });
                    this.feedbackPresent = true;
                    break;
                  } else {
                    this.feedback();
                    this.snakBar.open(
                      "Message",
                      ErrorMessgae[0][prevFeedback.message],
                      {
                        duration: 4000,
                      }
                    );
                  }
                }
                this.snakBar.open(
                  "Message",
                  ErrorMessgae[0][prevFeedback.message],
                  {
                    duration: 4000,
                  }
                );
              } else {
                this.feedback();
                this.snakBar.open(
                  "Message",
                  ErrorMessgae[0][prevFeedback.message],
                  {
                    duration: 4000,
                  }
                );
              }
            } else {
              this.feedback();
              this.snakBar.open(
                "Message",
                ErrorMessgae[0][prevFeedback.message],
                {
                  duration: 4000,
                }
              );
            }
          },
          (err) => {
            this.showspinner.setSpinner(false);
            this.feedback();
            this.snakBar.open("Error", ErrorMessgae[0][err], {
              duration: 4000,
            });
          }
        );
    } else {
      this.feedback();
    }
  }
  // -------------Test -----------------
  //  -------------------- changes  by Aaliya  ------------------------------

  // What app support
  sharewhatsApp() {
 
    this.contactlink =
      "https://web.whatsapp.com/send?phone=91" +
      this.workshopmobile +
      "&text=Hello! I found your garage online and I have a few questions regarding online services. Are you free to chat now?";
  }
  // get the customer details
  getcallonconstructor() {
    if (localStorage.getItem("enduser")) {
      this.showloginsection = true;
      this.userdata = JSON.parse(localStorage.getItem("enduser"));
    } else {
      this.showloginsection = false;
      this.openVerifyData();
    }
  }
  // convert date
  ConvertTodate(currentPage) {
    return currentPage.replace(/['"]+/g, "");
  }
  // paument popup
  openPaymentNot(data) {
    console.log("this.jobcardData", this.jobcardData);
    console.log("this.type", this.jobcardData.jobcard_status);
    console.log("this.type", typeof this.jobcardData.jobcard_status);
    var mesaagesend;
    if (data == "pay") {
      //mesaagesend="Payment Link Not Generated by Garage"
      mesaagesend = "Coming Soon";
    } else {
      // mesaagesend = "Review Section Not Available";
      mesaagesend =
        "Jobcard is in Open Stage, Review will Be Available in later Stages";
    }
    this.dialogservice
      .openEndUserMessageDialog(mesaagesend)
      .subscribe((dataget) => {
        console.log(dataget);
      });
  }
  // on payments done
  openPayment(amount) {
    this.dialogservice.openEndUserPayment(amount).subscribe((data) => {
      if (data == true) {
        console.log("okay");
      }
    });
  }
  // verify the customer data
  openVerifyData() {
    this.dialogservice.openEndUserLogin("true").subscribe((data) => {
      if (data == "trueokay") {
        this.showloginsection = true;
        this.usercomp.homeIcon();
        this.ngOnInit();
      } else if (data == "truenotokay") {
        this.showloginsection = true;
        this.usercomp.profileIcon();
      } else {
        this.showloginsection = false;
      }
    });
  }
  //logout
  signout() {
    localStorage.clear();
    location.reload();
  }
  // when user open the jobacrd details
  openJobcard(jobcardData, openFeedback = false) {
    if (openFeedback) {
      this.showfeedback = true;
    }
    this.generalService
      .getensjobcarddetails(
        localStorage.getItem("check"),
        jobcardData.jobcard_number
      )
      .subscribe(
        (jobdetalData) => {
          this.showspinner.setSpinnerForEnd(true);
          if (jobdetalData.success == true) {
            if (
              JSON.parse(jobdetalData.jobcards[0].jobcard_customer_voice)
                .length != 0
            ) {
              this.showcustomer = true;
              this.customervoice = JSON.parse(
                jobdetalData.jobcards[0].jobcard_customer_voice
              );
            } else {
              this.showcustomer = false;
              this.customervoice = [];
            }

            if (
              jobdetalData.jobcards[0].jobcard_vehicle_inventory != "" &&
              JSON.parse(jobdetalData.jobcards[0].jobcard_vehicle_inventory)
                .length != 0
            ) {
              this.showinven = true;
              this.vehicleinventory = JSON.parse(
                jobdetalData.jobcards[0].jobcard_vehicle_inventory
              );
            } else {
              this.showinven = false;
              this.vehicleinventory = [];
            }
            if (jobdetalData.jobcards[0].jobcard_dent_photos != ""
            && jobdetalData.jobcards[0].jobcard_dent_photos.includes("https")
             ) {
              this.showdent = true;
              this.dentphotos = jobdetalData.jobcards[0].jobcard_dent_photos
                .replace(/[{""}]/g, "")
                .split(",");
            } 
           else if (jobdetalData.jobcards[0].jobcard_dent_photos != ""
            && !jobdetalData.jobcards[0].jobcard_dent_photos.includes("https")
             ) {
              this.showdent = true;
              JSON.parse(jobdetalData.jobcards[0].jobcard_dent_photos).forEach(photo => {
               var url = `https://drive.google.com/uc?export=view&id=${photo}`
                this.dentphotos.push(url)
              });
              console.log('this.dentphotos', this.dentphotos)
             }
            else {
              this.showdent = false;
              this.dentphotos = [];
            }

            if (
              jobdetalData.jobcards[0].jobcard_dent_marks != "" &&
              JSON.parse(jobdetalData.jobcards[0].jobcard_dent_marks).length !=
                0
            ) {
              this.showmarks = true;
              this.dentmarks = JSON.parse(
                jobdetalData.jobcards[0].jobcard_dent_marks
              );
              this.vehicles = JSON.parse(
                jobdetalData.jobcards[0].vehicle_details
              );
              setTimeout(() => this.dentMarks(), 2000);
            } else {
              this.showmarks = false;
              this.dentmarks = [];
            }
            var sapres = JSON.parse(
              jobdetalData.jobcards[0].jobcard_spare_items
            );
            var jobs = JSON.parse(jobdetalData.jobcards[0].jobcard_job_items);
            var lubes = JSON.parse(
              jobdetalData.jobcards[0].jobcard_lubes_items
            );
            this.totalAmount = Math.round(
              jobdetalData.jobcards[0].total_amount
            );

            if (sapres.length == 0 && lubes.length == 0 && jobs.length != 0) {
              this.jobtabclass = "active";
              this.jobtabdataclass = "tab-pane fade in active";
              this.sparetabclass = "";
              this.sparetabdataclass = "tab-pane fade";
              this.lubetabclass = "";
              this.lubetabdataclass = "tab-pane fade";
            } else if (
              sapres.length == 0 &&
              lubes.length != 0 &&
              jobs.length == 0
            ) {
              this.jobtabclass = "";
              this.jobtabdataclass = "tab-pane fade";
              this.sparetabclass = "";
              this.sparetabdataclass = "tab-pane fade";
              this.lubetabclass = "active";
              this.lubetabdataclass = "tab-pane fade in active";
            } else if (
              sapres.length != 0 &&
              lubes.length == 0 &&
              jobs.length == 0
            ) {
              this.jobtabclass = "";
              this.jobtabdataclass = "tab-pane fade";
              this.sparetabclass = "active";
              this.sparetabdataclass = "tab-pane fade in active";
              this.lubetabclass = "";
              this.lubetabdataclass = "tab-pane fade";
            } else if (sapres.length != 0) {
              this.jobtabclass = "";
              this.jobtabdataclass = "tab-pane fade";
              this.sparetabclass = "active";
              this.sparetabdataclass = "tab-pane fade in active";
              this.lubetabclass = "";
              this.lubetabdataclass = "tab-pane fade";
            }

            if (jobdetalData.jobcards[0].jobcard_status == "0") {
              this.secondclass =
                "col-lg-4 col-sm-4 col-md-4 col-xs-9 detailsjobcard checkonline";
              this.thirdclass =
                "col-lg-4 col-sm-4 col-md-4 col-xs-9 detailsjobcard checkonline";
            }
            if (jobdetalData.jobcards[0].jobcard_status != "0") {
              if (Math.round(jobdetalData.jobcards[0].paid) == 0) {
                this.thirdclass =
                  "col-lg-4 col-sm-4 col-md-4 col-xs-9 detailsjobcard checkonline";
              } else {
                this.thirdclass =
                  "col-lg-4 col-sm-4 col-md-4 col-xs-9 detailsjobcard";
              }
            }

            this.jobcardnumber = jobdetalData.jobcards[0].jobcard_number;
            this.intime = jobdetalData.jobcards[0].created_at;
            this.estimate = Math.round(jobdetalData.jobcards[0].cost_estimate);
            this.deliveryby =
              jobdetalData.jobcards[0].estimated_delivery_datetime;
            this.advance = Math.round(jobdetalData.jobcards[0].advance);
            this.discount = jobdetalData.jobcards[0].discount;
            this.payable = Math.round(jobdetalData.jobcards[0].final_amount);
            this.paid = Math.round(jobdetalData.jobcards[0].paid_amount);
            this.balance = Math.round(jobdetalData.jobcards[0].balance_amount);
            this.paymentmode = jobdetalData.jobcards[0].payment_mode;
            this.cpmpletetime = jobdetalData.jobcards[0].complete_date;
            if (sapres.length != 0 || jobs.length != 0 || lubes.length != 0) {
              this.showinvoive = true;
              if (sapres.length != 0) {
                sapres.map((data) => {
                  this.spares.push({
                    name: data.part_name,
                    qty: data.quantity + " " + data.unit,
                    price: "₹" + " " + Math.round(data.amount),
                  });
                });
              } else {
                this.spares = [];
              }
              if (lubes.length != 0) {
                lubes.map((data) => {
                  this.lubes.push({
                    name: data.part_name,
                    qty: data.quantity + " " + data.unit,
                    price: "₹" + " " + Math.round(data.amount),
                  });
                });
              } else {
                this.lubes = [];
              }
              if (jobs.length != 0) {
                jobs.map((data) => {
                  this.jobs.push({
                    name: data.part_name,
                    qty: data.quantity,
                    price: "₹" + " " + Math.round(data.amount),
                  });
                });
              } else {
                this.spares = [];
              }
            } else {
              this.showinvoive = false;
            }

            //  -------------------- changes  by Aaliya  ------------------------------
            if (jobdetalData.jobcards[0].jobcard_status == "0") {
              this.showfeedback = false;
            } else {
              this.showfeedback = true;

              // -=-=-=-=-=-=-=-=-=- Changes #2 by Aaliya -=-=-=-=-=-=-=-=-

              this.generalService
                .getfeedback(
                  jobcardData.workshop_id,
                  jobcardData.jobcard_number
                )
                .subscribe(
                  (prevFeedback) => {
                    this.showspinner.setSpinner(true);
                    if (prevFeedback.success == true) {
                      this.showspinner.setSpinner(false);
                      this.overallRating =
                        prevFeedback.feedback[0].overall_rating;
                      this.feedbackForm = this.formbuild.group({
                        service_quality: [
                          prevFeedback.feedback[0].service_quality,
                          [
                            Validators.required,
                            Validators.min(1),
                            Validators.max(5),
                          ],
                        ],
                        customer_support: [
                          prevFeedback.feedback[0].customer_support,
                          [
                            Validators.required,
                            Validators.min(1),
                            Validators.max(5),
                          ],
                        ],
                        timeliness: [
                          prevFeedback.feedback[0].timeliness,
                          [
                            Validators.required,
                            Validators.min(1),
                            Validators.max(5),
                          ],
                        ],
                        pricing: [
                          prevFeedback.feedback[0].pricing,
                          [
                            Validators.required,
                            Validators.min(1),
                            Validators.max(5),
                          ],
                        ],
                        overall_rating: [
                          prevFeedback.feedback[0].overall_rating,
                          [
                            Validators.required,
                            Validators.min(1),
                            Validators.max(5),
                          ],
                        ],
                        comment: [prevFeedback.feedback[0].comment],
                      });
                      this.feedbackPresent = true;
                      this.snakBar.open(
                        "Message",
                        ErrorMessgae[0][prevFeedback.messgae],
                        {
                          duration: 4000,
                        }
                      );
                    } else {
                      this.showspinner.setSpinner(false);
                      this.feedback();
                      this.feedbackPresent = false;
                      this.snakBar.open(
                        "Message",
                        ErrorMessgae[0][prevFeedback.messgae],
                        {
                          duration: 4000,
                        }
                      );
                    }
                  },
                  (err) => {
                    this.showspinner.setSpinner(false);
                    this.feedback();
                    this.feedbackPresent = false;
                    this.snakBar.open("Error", ErrorMessgae[0][err], {
                      duration: 4000,
                    });
                  }
                );

              // -=-=-=-=-=-=-=-=-=- Changes #2 by Aaliya -=-=-=-=-=-=-=-=-
            }
            //  -------------------- changes  by Aaliya  ------------------------------
          }
          this.showspinner.setSpinnerForEnd(false);
        },
        (err) => {
          this.showspinner.setSpinnerForEnd(false);
          this.snakBar.open("Message", "Issue in getting Data", {
            duration: 4000,
          });
        }
      );
    this.openDetailJobcard = true;
    this.rowclass = "row topgargedetailsjob";
  }
  // opne back the list
  openList() {
    this.openDetailJobcard = false;
    this.rowclass = "row topgargedetails";
  }
  // dentmarks of the vehicle
  dentMarks() {
    if (this.myCanvass != undefined) {
      // var canvas = (<HTMLCanvasElement>this.myCanvass.nativeElement)
      var context = this.myCanvass.nativeElement.getContext("2d");
      var mapSprite = new Image();
      if (this.vehicles.vehicle_type == "6") {
        mapSprite.src = "../../../../assets/images/car.jpg";
        this.imageHeight = mapSprite.height;
        this.imageWidth = mapSprite.width;
      } else if (this.vehicles.vehicle_type == "6") {
        mapSprite.src = "../../../../assets/images/carsketches.png";
        this.imageHeight = mapSprite.height;
        this.imageWidth = mapSprite.width;
      } else if (this.vehicles.vehicle_type == "4") {
        mapSprite.src = "../../../../assets/images/carsketches.png";
        this.imageHeight = mapSprite.height;
        this.imageWidth = mapSprite.width;
      } else if (this.vehicles.vehicle_type == "3") {
        mapSprite.src = "../../../../assets/images/bike_dent.jpg";
        this.imageHeight = mapSprite.height;
        this.imageWidth = mapSprite.width;
      } else if (this.vehicles.vehicle_type == "2") {
        mapSprite.src = "../../../../assets/images/bike_dent.jpg";
        this.imageHeight = mapSprite.height;
        this.imageWidth = mapSprite.width;
      } else if (this.vehicles.vehicle_type == "2") {
        mapSprite.src = "../../../../assets/images/scooter_dent.jpg";
        this.imageHeight = mapSprite.height;
        this.imageWidth = mapSprite.width;
      }
      var Marker = function () {
        this.Sprite = new Image();
        this.Sprite.src =
          "https://workshopandcustomers.s3.ap-south-1.amazonaws.com/assests/images/close.png";
        this.Width = 10;
        this.Height = 12;
        this.XPos = 0;
        this.YPos = 0;
      };

      var firstLoad = function () {
        context.font = "15px Georgia";
        context.textAlign = "center";
      };

      firstLoad();

      var main = function () {
        draw();
      };

      var draw = () => {
        context.fillRect(0, 0, mapSprite.width, mapSprite.height);

        context.drawImage(mapSprite, 0, 0);

        for (var i = 0; i < this.dentmarks.length; i++) {
          var tempMarker = this.dentmarks[i];
          context.fillStyle = tempMarker.color;
          context.beginPath();
          context.arc(
            tempMarker.XPos,
            tempMarker.YPos,
            5,
            0,
            Math.PI * 2,
            true
          );
          context.fill();
        }
      };
      setInterval(main, 1000 / 60);
    }
  }
  // go to the services page
  goToService() {
    this.usercomp.serviceIcon();
  }
  // go to booking page
  goToBook() {
    this.usercomp.bookingIcon();
  }
}
