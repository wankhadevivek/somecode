import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DilogOpenService } from "../../../services/dilog-open.service";
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { GeneralService } from "../../../services/general.service";
import { UserserviceService } from "../../../services/userservice.service";
import { SpinnerService } from "../../../services/spinner.service";
import { Observable, Subject, merge, forkJoin } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  filter,
} from "rxjs/operators";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { ErrorMessgae } from "../../error_message/error";
import { NgbDatepickerConfig } from "@ng-bootstrap/ng-bootstrap";
import { timingSafeEqual } from "crypto";
import { PrintsharepdfService } from "../../../services/printsharepdf.service";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  SatDatepickerModule,
} from "saturn-datepicker";
import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from "../../model/date/date.adapter";
import { AbstractService } from "../../../services/comman/abstract.service";
import { MatSliderChange } from "@angular/material";
import { coerceNumberProperty } from "@angular/cdk/coercion";
import { DatePipe } from "@angular/common";
import { MechreportService } from "../../../services/mechreport.service";
import { parse } from "querystring";
import { UserPermissionService } from "../../../services/user-permissions.service";
@Component({
  selector: "app-counter-sale",
  templateUrl: "./counter-sale.component.html",
  styleUrls: ["./counter-sale.component.css"],
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
 * In this file counter sale
 * is created or edited
 * new inventriy can be craeted from here
 */
export class CounterSaleComponent implements OnInit {
  counterDateField: any = "";
  newregister: boolean = false;
  classforcredit = "crditopen active";
  classforcash = "vreditclose";
  gstNumberArr = ["0%", "5%", "12%", "18%", "28%"];
  gsttype = ["Exclusive", "Inclusive"];
  spareCategory = [
    "Frequent Items",
    "Engine Parts",
    "Accessories",
    "Body Parts",
    "Electrical Parts",
  ];
  JobCategory = ["in_house", "out_source"];
  units = ["units", "gm", "ltr", "ml", "can", "pouch"];
  regex = /^-?\d+(\.\d{1,2})?$/;
  selectedtype = "spare";
  CreateCustomerForm: FormGroup;
  CreateSpareForm: FormGroup;
  userWorkshopid;
  counterId;
  returnamount = 0;
  returndate = null;
  maxDate;
  states = [];
  allcustomuerdata = [];
  prebalance = 0;
  showtext: boolean = false;
  showtupdate: boolean = false;
  showaddcus: boolean = true;
  showsearccus: boolean = true;
  showeditcus: boolean = false;
  selectedevnet;
  allBillingData;
  billingData;
  counterOpenOrEdit;
  counternumber;
  settingInven;
  searchadded: boolean = false;
  cusname;
  custid;
  cusphone;
  cusemail;
  cusaddress;
  cusgst;
  duplicatefinalamount = 0;
  backupbalacetoshow = 0;
  backuptotalbalnce = 0;
  receviedDateedit = null;
  spareduplicate = Array();
  sparenextpage;
  searchSpareDatasec = [];
  searchSpareDatapagi = [];
  searchSpareData = Array();
  foralltrue: boolean = false;
  showSpareUpdate: boolean = false;
  SelectedDataarrOfVehiclespl;
  sparemaster;
  spareworkshop;
  dynamicPartNumber;
  totalamountonform;
  toShowcgst;
  toShowsgst;
  toShowtotal_gst;
  mainsparecompanyarrspl = Array();
  mainlubecompanyarrspl = Array();
  searchSpareCompany = [];
  mainVehiclearrspl = Array();
  searchVehicleDataSpl = [];
  today = new Date();
  jobmodel: any;
  searchJobData = [];
  showduplicatejob: boolean = false;
  shownegativeinventory: boolean = false;
  negativevalue: string;
  negativearryforjob;
  checkforquantityforjob;
  jobtaxableamount = 0;
  searchJobDatapaginate = [];
  duplicatejobname: string;
  jobduplicate = Array();
  jobsnextpage;
  searchJobDatasec = [];
  jobdatatabel = Array();
  duplicateJob = Array();
  JobTotal = 0;
  reminderArray = Array();
  checkarray = Array();
  calTotalGstForJobamount = 0;
  discountamount = 0;
  discounttpe = "%";
  discountvalue = 0;
  payable = 0;
  showerror: boolean = false;
  receviedty = "partial";
  recveedam = 0;
  amountrece = 0;
  showre: boolean = false;
  balanceshow = 0;
  totalbalance = 0;
  receviedDate = null;
  showerrorinfield: boolean = false;
  showerrorre: boolean = false;
  showdiscountjob: boolean = false;
  refundamount = 0;
  showrefund: boolean = false;
  QuantityObject = Array();
  oldQuantityArray = Array();
  exitdata = "";
  receviedtymethod = "re";
  balacether: boolean = false;
  backupbalance = 0;
  customerinvoices = Array();
  counterDatevalue;
  isredund: boolean = false;
  showrefundvalue = 0;
  showsearchcnacel: boolean = false;
  allSelectedMake = Array();
  dupseletecmodvari = Array();
  searchModelvari = Array();
  vehnextpage;
  searchvehpaginate = Array();
  vechileTypetoshow: Array<any> = [];
  // -------
  mainurl = this.abstract.mainurl;
  userworkshopid;
  onlineenable;
  urlgetforonline;
  urlgetforonlinemain;
  urlgetforonlineclose;
  workshopName;
  phoneNumber;
  contactlink = "";
  userserviceworkshopid;
  permitData;
  isPermitData: any = {};

  constructor(
    private generalService: GeneralService,
    public sendPDF: PrintsharepdfService,
    public mechrepo: MechreportService,
    public abstract: AbstractService,
    private config: NgbDatepickerConfig,
    private snakBar: MatSnackBar,
    private showspinner: SpinnerService,
    private general: GeneralService,
    private userService: UserserviceService,
    private formbuild: FormBuilder,
    private dialogservice: DilogOpenService,
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<CounterSaleComponent>,
    private permit: UserPermissionService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const current = new Date();
    this.maxDate = current;

    this.counterDateField = current;
    this.counterDatevalue =
      this.counterDateField.getFullYear() +
      "-" +
      ("0" + (this.counterDateField.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + this.counterDateField.getDate()).slice(-2);
    this.createCustomer();
    this.createSpareForm();
    this.userWorkshopid = this.userService.getData()["workshop_id"];
    this.counterOpenOrEdit = data.openOrEdit;
    if (data.openOrEdit == "edit") {
      this.counternumber = data.counternumber;
    }
    this.userworkshopid = this.userService.getData()["workshop_id"];

    this.general.getLInkStatus(this.userworkshopid).subscribe((linkget) => {
      if (linkget.success == true) {
        this.onlineenable = linkget.online_garage;
        this.urlgetforonline = this.mainurl + "cus/" + linkget.url_param;
        this.urlgetforonlinemain =
          "\r\n\n" +
          "Check Jobcard Live Status on : " +
          this.mainurl +
          "cus/" +
          linkget.url_param;
        this.urlgetforonlineclose =
          "\r\n" +
          "You can book appointment on " +
          this.mainurl +
          "cus/" +
          linkget.url_param;
      } else {
        this.onlineenable = "false";
        this.urlgetforonline = "";
        this.urlgetforonlinemain = "";
        this.urlgetforonlineclose = "";
      }
    });
    this.isPermitData = 0;
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
  //Load the cutsomer and the counter data
  ngOnInit() {
    if (this.counterOpenOrEdit != "edit") {
      forkJoin(
        this.general.getCounterSaleNumber(this.userWorkshopid),
        this.general.getJobcardSettings(this.userWorkshopid)
      ).subscribe(
        ([counterid, settingdata]) => {
          this.showspinner.setSpinnerForLogin(true);
          if (counterid.success == true) {
            this.counterId = counterid.numbercounter;
          }
          this.showspinner.setSpinnerForLogin(false);
          this.showspinner.setSpinnerForLogin(true);
          this.settingInven = JSON.parse(
            settingdata.jobcard_Settings.settings_inventory.replace(/\\/g, "")
          );

          var settingBillingDataJson = JSON.parse(
            settingdata.jobcard_Settings.settings_billing.replace(/\\/g, "")
          );
          this.allBillingData = settingBillingDataJson[0];

          this.showspinner.setSpinnerForLogin(false);
        },
        (err) => {
          this.showspinner.setSpinnerForLogin(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
    } else {
      this.openEditCounter();
    }
    this.vechileTypetoshow = [];
    for (
      var i = 0;
      i < this.userService.getData()["workshop_type"].split(",").length;
      i++
    ) {
      if (this.userService.getData()["workshop_type"].split(",")[i] === "1") {
        if (i == 0) {
          this.vechileTypetoshow.push("2");
        }
      }
    }
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
  // event_handler_btn(expression){
  //   switch(expression) {
  //     case "view": {
  //       this.isPermitData.view = true;
  //        break;
  //     }
  //     case "edit":  {
  //       this.isPermitData.edit = true;
  //        break;
  //     }
  //     case "create":  {
  //       this.isPermitData.edit = true;
  //       break;
  //    }
  //    case "create_new":  {
  //     //statements;
  //     break;
  //  }
  //     default: {
  //        //statements;
  //        break;
  //     }
  //  }
  // }
  /*check permission func of view, create, edit, create new ..... end*/

  // open edit customer data
  openEditCounter() {
    this.general
      .CounterDetail(this.userWorkshopid, this.counternumber)
      .subscribe(
        (coounterdata) => {
          this.showspinner.setSpinnerForLogin(true);
          if (coounterdata.success == true) {
            this.cusname = coounterdata.customer.customer_name;
            this.custid = coounterdata.customer.id;
            this.cusphone = coounterdata.customer.customer_mobile;
            this.cusemail = coounterdata.customer.email;
            this.cusaddress = coounterdata.customer.address;
            this.cusgst = coounterdata.customer.gstnunber;
            this.showtext = true;
            this.CreateCustomerForm.controls["customerid"].setValue(
              this.custid
            );
            this.CreateCustomerForm.controls["customername"].setValue(
              this.cusname,
              { onlySelf: true }
            );
            this.CreateCustomerForm.controls["mobileOneNo"].setValue(
              this.cusphone,
              { onlySelf: true }
            );
            this.CreateCustomerForm.controls["email"].setValue(this.cusemail, {
              onlySelf: true,
            });
            this.CreateCustomerForm.controls["address"].setValue(
              this.cusaddress,
              { onlySelf: true }
            );
            this.CreateCustomerForm.controls["gstno"].setValue(this.cusgst, {
              onlySelf: true,
            });
            this.CreateCustomerForm.controls["vehiclenumber"].setValue(
              coounterdata.counter.vehicle_number,
              { onlySelf: true }
            );
            this.CreateCustomerForm.controls["customername"].disable();
            this.CreateCustomerForm.controls["mobileOneNo"].disable();
            this.CreateCustomerForm.controls["email"].disable();
            this.CreateCustomerForm.controls["address"].disable();
            this.CreateCustomerForm.controls["gstno"].disable();
            this.showaddcus = false;
            this.showsearccus = false;
            this.showeditcus = true;
            this.counterId = this.counternumber;
            if (coounterdata.customer.recevied_date != null) {
              this.receviedDateedit = coounterdata.customer.recevied_date;
            } else {
              this.receviedDateedit = null;
            }
            this.customerinvoices = JSON.parse(
              coounterdata.customer.invoice_no
            );
            if (coounterdata.customer.balance != "0") {
              this.prebalance =
                parseFloat(coounterdata.customer.balance) -
                parseFloat(coounterdata.counter.balance);
              this.totalbalance = parseFloat(coounterdata.customer.balance);
              this.backuptotalbalnce = parseFloat(
                coounterdata.customer.balance
              );
            } else {
              this.prebalance = 0;
              this.totalbalance =
                parseFloat(coounterdata.customer.balance) +
                parseFloat(coounterdata.counter.balance);
              this.backuptotalbalnce =
                parseFloat(coounterdata.customer.balance) +
                parseFloat(coounterdata.counter.balance);
            }
            this.balanceshow = parseFloat(coounterdata.counter.balance);
            this.backupbalacetoshow = parseFloat(coounterdata.counter.balance);

            if (this.prebalance != 0) {
              this.balacether = true;
              this.backupbalance =
                parseFloat(coounterdata.customer.balance) -
                parseFloat(coounterdata.counter.balance);
            } else {
              this.balacether = false;
              this.backupbalance = 0;
            }

            this.receviedDate = coounterdata.customer.recevied_date;
            this.exitdata = coounterdata.counter.exit_note;
            this.jobdatatabel = JSON.parse(coounterdata.counter.counter_items);
            this.duplicateJob = this.jobdatatabel;
            this.jobdatatabel.map((spareData) => {
              this.oldQuantityArray.push({
                partnumber: spareData.part_number,
                quantity: spareData.quantity,
              });
            });
            if (parseInt(coounterdata.counter.refund_amount) != 0) {
              this.refundamount = parseInt(coounterdata.counter.refund_amount);
              if (coounterdata.counter.is_return == "true") {
                this.showrefundvalue = 0;
              } else {
                this.showrefundvalue = this.refundamount;
              }
              this.showrefund = true;
              this.isredund = coounterdata.counter.is_return;
            }
            this.returnamount = parseInt(coounterdata.counter.return_amount);
            this.counterDateField = new Date(coounterdata.counter.invoice_date);
            this.JobTotal = parseFloat(coounterdata.counter.total_amount);
            this.jobtaxableamount = parseFloat(coounterdata.counter.taxable);
            this.calTotalGstForJobamount = parseFloat(
              coounterdata.counter.total_gst
            );
            this.discounttpe = coounterdata.counter.discount.split(" ")[1];
            this.discountvalue = coounterdata.counter.discount.split(" ")[0];
            this.discountamount = parseFloat(
              coounterdata.counter.discount_amount
            );
            this.receviedty = coounterdata.counter.recived_type;
            this.recveedam = parseFloat(coounterdata.counter.paid);
            this.duplicatefinalamount = this.JobTotal - this.discountamount;
            this.receviedtymethod = coounterdata.counter.payment_method;
            this.allBillingData = JSON.parse(coounterdata.counter.settings);
            this.settingInven = JSON.parse(
              coounterdata.counter.settings
            ).settingInven;
            if (this.receviedty != "partial") {
              this.showre = true;
            }
          } else {
            this.snakBar.open("Message", "Something Went Wrong", {
              duration: 4000,
            });
          }
          this.showspinner.setSpinnerForLogin(false);
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  // Create New Spare form with validations
  createSpareForm() {
    this.CreateSpareForm = this.formbuild.group({
      partnumber: [""],
      partname: ["", Validators.required],
      companynameSpare: ["", Validators.required],
      searchspareVehicle: [""],
      searchspareVehiclemod: [""],
      quantity: [1, Validators.pattern(this.regex)],
      lowerlimit: [0, Validators.pattern(this.regex)],
      variiofspare: [null],
      unit: [null],
      modelofspare: [null],
      makeofspare: [null],
      subcategory: [null],
      gstslab: [this.gstNumberArr[0]],
      gsttype: [this.gsttype[0]],
      rackno: [""],
      purchaseprice: [0, Validators.pattern(this.regex)],
      sellingprice: [
        null,
        [Validators.required, Validators.pattern(this.regex)],
      ],
      hsnno: [""],
    });
  }
  // get the selected type
  checkseletectype(event) {
    this.selectedtype = event;
  }
  // search the pare in inventory
  searchSpareInputnew(event) {
    this.general
      .getJobSpareLube(this.userWorkshopid, this.selectedtype, event)
      .subscribe(
        (SpareSearchData) => {
          this.showspinner.setSpinnerForLogin(true);
          if (SpareSearchData.success == true) {
            if (SpareSearchData.sparedata != undefined) {
              if (SpareSearchData["next_page"] != "Nonextpage") {
                this.sparenextpage = SpareSearchData["next_page"];
              } else {
                this.sparenextpage = "none";
              }
              for (var i = 0; i < SpareSearchData.sparedata.length; i++) {
                if (
                  !this.spareduplicate.includes(
                    SpareSearchData.sparedata[i].part_name
                  )
                ) {
                  if (SpareSearchData.sparedata[i].unit_sale_price != "") {
                    this.spareduplicate.push(
                      SpareSearchData.sparedata[i].part_name
                    );
                    this.searchSpareDatasec.push(
                      SpareSearchData.sparedata[i].part_number
                    );
                  } else {
                    this.spareduplicate.push(
                      SpareSearchData.sparedata[i].part_name
                    );
                    this.searchSpareDatasec.push(
                      SpareSearchData.sparedata[i].part_number
                    );
                  }
                }
              }
              this.searchSpareData = this.searchSpareDatasec;
            }
          } else {
            console.log("No Data");
          }
          this.showspinner.setSpinnerForLogin(false);
        },
        (err) => {
          this.showspinner.setSpinnerForLogin(false);
          this.snakBar.open(err, ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  // load the spare data
  loadMoreDataspare() {
    if (this.sparenextpage != "none") {
      setTimeout(
        () =>
          this.general.inventorylsjpageination(this.sparenextpage).subscribe(
            (SpareSearchData) => {
              this.showspinner.setSpinnerForLogin(true);
              if (SpareSearchData.success == true) {
                if (SpareSearchData.sparedata != undefined) {
                  if (SpareSearchData["next_page"] != "Nonextpage") {
                    this.sparenextpage = SpareSearchData["next_page"];
                  } else {
                    this.sparenextpage = "none";
                  }
                  this.searchSpareDatapagi = this.searchSpareData;
                  for (var i = 0; i < SpareSearchData.sparedata.length; i++) {
                    if (
                      !this.spareduplicate.includes(
                        SpareSearchData.sparedata[i].part_name
                      )
                    ) {
                      if (SpareSearchData.sparedata[i].unit_sale_price != "") {
                        this.spareduplicate.push(
                          SpareSearchData.sparedata[i].part_name
                        );
                        this.searchSpareDatapagi.push(
                          SpareSearchData.sparedata[i].part_number
                        );
                      } else {
                        this.spareduplicate.push(
                          SpareSearchData.sparedata[i].part_name
                        );
                        this.searchSpareDatapagi.push(
                          SpareSearchData.sparedata[i].part_number
                        );
                      }
                    }
                  }
                  this.searchSpareData = [];
                  setTimeout(
                    () => (this.searchSpareData = this.searchSpareDatapagi),
                    100
                  );
                }
              } else {
                console.log("No Data");
              }
              this.showspinner.setSpinnerForLogin(false);
            },
            (err) => {
              this.showspinner.setSpinnerForLogin(false);
              this.snakBar.open(err, ErrorMessgae[0][err], {
                duration: 4000,
              });
            }
          ),
        100
      );
    }
  }
  // add selected spare result
  addselectedSpareResultsearch(event) {
    this.allSelectedMake = [];
    this.dupseletecmodvari = [];
    var workshopid = this.userWorkshopid;
    this.general
      .getJobSpareLubeData(workshopid, this.selectedtype, event)
      .subscribe(
        (SpareData) => {
          if (event != "" && SpareData.sparedata != undefined) {
            if (SpareData.success == true) {
              var vechilevariant = JSON.parse(
                SpareData.sparedata[0].vechile_details.replace(/\\/g, "")
              );
              this.foralltrue = false;
              var vehdetails = JSON.parse(
                SpareData.sparedata[0].vechile_details
              );

              if (vehdetails.length == undefined) {
                var vehdata = [];
                if (vehdetails.make == "All") {
                  this.foralltrue = true;
                  vehdata.push({
                    make: "All",
                    model: "All model",
                    variant: "All variant",
                  });
                } else {
                  this.foralltrue = false;
                  vehdata.push({
                    make: vehdetails.make,
                    model: vehdetails.model,
                    variant: vehdetails.variant,
                  });
                }
                this.allSelectedMake = vehdata;
              } else {
                this.allSelectedMake = vehdetails;
              }
              this.allSelectedMake.map((data) => {
                this.dupseletecmodvari.push(
                  data.make + "  " + data.model + "  " + data.variant
                );
              });
              this.sparemaster = SpareData.sparedata[0].is_master;
              this.spareworkshop = SpareData.sparedata[0].workshop_id;
              this.CreateSpareForm.controls["searchspareVehiclemod"].setValue(
                ""
              );
              this.CreateSpareForm.controls["searchspareVehicle"].setValue("");
              this.CreateSpareForm.controls["partname"].setValue(
                SpareData.sparedata[0].part_name,
                { onlySelf: true }
              );
              this.CreateSpareForm.controls["companynameSpare"].setValue(
                SpareData.sparedata[0].company_name,
                { onlySelf: true }
              );
              this.CreateSpareForm.controls["quantity"].setValue(
                SpareData.sparedata[0].current_quantity,
                { onlySelf: true }
              );
              this.CreateSpareForm.controls["lowerlimit"].setValue(
                SpareData.sparedata[0].lower_limit,
                { onlySelf: true }
              );
              this.CreateSpareForm.controls["unit"].setValue(
                SpareData.sparedata[0].unit,
                { onlySelf: true }
              );
              this.CreateSpareForm.controls["subcategory"].setValue(
                SpareData.sparedata[0].spare_subcategory,
                { onlySelf: true }
              );
              this.CreateSpareForm.controls["gstslab"].setValue(
                SpareData.sparedata[0].sale_gst_rate,
                { onlySelf: true }
              );
              this.CreateSpareForm.controls["gsttype"].setValue(
                SpareData.sparedata[0].sale_tax_type,
                { onlySelf: true }
              );
              this.CreateSpareForm.controls["rackno"].setValue(
                SpareData.sparedata[0].rack_no,
                { onlySelf: true }
              );
              this.CreateSpareForm.controls["purchaseprice"].setValue(
                SpareData.sparedata[0].unit_purchase_price,
                { onlySelf: true }
              );
              this.CreateSpareForm.controls["sellingprice"].setValue(
                SpareData.sparedata[0].unit_sale_price,
                { onlySelf: true }
              );
              this.CreateSpareForm.controls["hsnno"].setValue(
                SpareData.sparedata[0].hsn_no,
                { onlySelf: true }
              );
              this.showSpareUpdate = true;
            }
          } else {
            this.CreateSpareForm.controls["partname"].setValue("", {
              onlySelf: true,
            });
            this.CreateSpareForm.controls["companynameSpare"].setValue("", {
              onlySelf: true,
            });
            this.CreateSpareForm.controls["quantity"].setValue(1, {
              onlySelf: true,
            });
            this.CreateSpareForm.controls["lowerlimit"].setValue(0, {
              onlySelf: true,
            });
            this.CreateSpareForm.controls["unit"].setValue(this.units[0], {
              onlySelf: true,
            });
            this.CreateSpareForm.controls["subcategory"].setValue(
              this.spareCategory[0],
              { onlySelf: true }
            );
            this.CreateSpareForm.controls["gstslab"].setValue(
              this.gstNumberArr[0],
              { onlySelf: true }
            );
            this.CreateSpareForm.controls["gsttype"].setValue(this.gsttype[0], {
              onlySelf: true,
            });
            this.CreateSpareForm.controls["rackno"].setValue("", {
              onlySelf: true,
            });
            this.CreateSpareForm.controls["purchaseprice"].setValue(0, {
              onlySelf: true,
            });
            this.CreateSpareForm.controls["sellingprice"].setValue(null, {
              onlySelf: true,
            });
            this.CreateSpareForm.controls["hsnno"].setValue("", {
              onlySelf: true,
            });
            this.showSpareUpdate = false;
          }
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open(err, ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  // open spare popup for create
  openSparepopup() {
    this.selectedtype = "spare";
    this.foralltrue = false;
    this.allSelectedMake = [];
    this.dupseletecmodvari = [];
    this.showSpareUpdate = false;
    this.SelectedDataarrOfVehiclespl = undefined;
    this.CreateSpareForm.controls["partnumber"].setValue(undefined);
    this.CreateSpareForm.controls["sellingprice"].setValue(null);
    this.CreateSpareForm.controls["companynameSpare"].setValue("");
    this.CreateSpareForm.controls["partname"].setValue("");
    this.CreateSpareForm.controls["searchspareVehicle"].setValue("");
    this.CreateSpareForm.controls["searchspareVehiclemod"].setValue("");
    this.CreateSpareForm.controls["subcategory"].setValue(
      this.spareCategory[0],
      { onlySelf: true }
    );
    this.CreateSpareForm.controls["gstslab"].setValue(this.gstNumberArr[0], {
      onlySelf: true,
    });
    this.CreateSpareForm.controls["gsttype"].setValue(this.gsttype[0], {
      onlySelf: true,
    });
    this.CreateSpareForm.controls["unit"].setValue(this.units[0], {
      onlySelf: true,
    });
    this.CreateSpareForm.controls["quantity"].setValue("1", { onlySelf: true });
    this.CreateSpareForm.controls["sellingprice"].setValue(0, {
      onlySelf: true,
    });
    this.CreateSpareForm.controls["purchaseprice"].setValue(0, {
      onlySelf: true,
    });

    this.totalamountonform = 0;
    this.toShowcgst = 0;
    this.toShowsgst = 0;
    this.toShowtotal_gst = 0;
  }
  // select the compnay
  selectedcomapny(event) {
    if (event != undefined) {
      this.CreateSpareForm.controls["companynameSpare"].setValue(event, {
        onlySelf: true,
      });
    }
  }
  //search the compnay
  searchBarForCompany(event) {
    this.general.searchCompanyName(event, this.selectedtype).subscribe(
      (searchData) => {
        if (searchData["success"] == true) {
          this.searchSpareCompany = [];
          // this.mainsparecompanyarrspl=[]
          searchData["companydetails"].map((data) => {
            this.searchSpareCompany.push(data["company_name"]);
            // this.mainsparecompanyarrspl.push(data)
          });
        } else {
          this.searchSpareCompany = [];
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
  // Search for vechile
  selectedResultForVechilespl(event) {
    if (event != undefined) {
      var splitedevent = event.split("  ");
      this.mainVehiclearrspl.map((selecteData) => {
        if (
          splitedevent[0] == selecteData.make &&
          splitedevent[1] == selecteData.model &&
          splitedevent[2] == selecteData.variant
        ) {
          this.SelectedDataarrOfVehiclespl = selecteData;
        }
        this.CreateSpareForm.controls["searchspareVehicle"].setValue("", {
          onlySelf: true,
        });
      });
    }
  }
  // search the vehciles
  searchBarForVechilespl(event) {
    this.searchVehicleDataSpl = [];
    this.mainVehiclearrspl = [];
    this.general
      .searchMakeModel(event, this.userService.getData()["workshop_type"])
      .subscribe(
        (searchData) => {
          this.showspinner.setSpinner(true);
          if (searchData["success"] == true) {
            this.showspinner.setSpinner(false);
            searchData["vhicledetails"].map((data) => {
              this.searchVehicleDataSpl.push(
                data["make"] + "  " + data["model"] + "  " + data["variant"]
              );
              this.mainVehiclearrspl.push(data);
            });
          } else {
            this.searchVehicleDataSpl = [];
            this.searchVehicleDataSpl.push("No Vehicle Found");
            this.mainVehiclearrspl = [];
            this.showspinner.setSpinner(false);
            this.snakBar.open(
              "Message",
              ErrorMessgae[0][searchData["message"]],
              {
                duration: 4000,
              }
            );
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
  // select the vehciles
  forAllVehicles(event) {
    if (event.currentTarget.checked == true) {
      this.foralltrue = true;
      this.SelectedDataarrOfVehiclespl = {
        make: "All",
        model: "All model",
        variant: "All variant",
      };
      this.allSelectedMake.push(this.SelectedDataarrOfVehiclespl);
    } else {
      this.foralltrue = false;
      this.SelectedDataarrOfVehiclespl = undefined;
      this.allSelectedMake = [];
      this.dupseletecmodvari = [];
    }
  }
  // craete the spare
  createSpareByAPI(mode) {
    var purchase_qty = this.CreateSpareForm.getRawValue().quantity;
    var purchase_total_amount = 0;
    var purchase_discount = "";
    var purchase_cgst = 0;
    var purchase_sgst = 0;
    var purchase_igst = 0;
    var purchase_total_gst = 0;
    var sale_qty = this.CreateSpareForm.getRawValue().quantity;
    var sale_total_amount = 0;
    var sale_discount = "";
    var sale_cgst = 0;
    var sale_sgst = 0;
    var sale_igst = 0;
    var sale_total_gst = 0;
    if (mode == "update" && this.sparemaster == "True") {
      mode = "create";
    }
    var part_number;
    if (this.CreateSpareForm.getRawValue().partnumber == undefined) {
      this.today = new Date();
      part_number =
        this.userService.getData()["workshop_id"].toString() +
        this.today.getFullYear().toString() +
        (this.today.getMonth() + 1).toString() +
        this.today.getDate().toString() +
        this.today.getHours().toString() +
        this.today.getMinutes().toString() +
        this.today.getSeconds().toString();
    } else {
      part_number = this.CreateSpareForm.getRawValue().partnumber;
    }

    if (this.allBillingData.gst_number != "") {
      if (this.CreateSpareForm.getRawValue().gsttype == this.gsttype[0]) {
        if (this.CreateSpareForm.getRawValue().purchaseprice != 0) {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateSpareForm.getRawValue().purchaseprice.toString(),
            this.CreateSpareForm.getRawValue().gstslab,
            this.gsttype[0]
          );
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        } else {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateSpareForm.getRawValue().sellingprice.toString(),
            this.CreateSpareForm.getRawValue().gstslab,
            this.gsttype[0]
          );
          sale_total_amount = GSTCal[0]["totalamount"];
          sale_cgst = GSTCal[0]["CGST"];
          sale_sgst = GSTCal[0]["SGST"];
          sale_total_gst = GSTCal[0]["GSTAmount"];
          this.CreateSpareForm.getRawValue().purchaseprice =
            this.CreateSpareForm.getRawValue().sellingprice;
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        }
      } else {
        if (this.CreateSpareForm.getRawValue().purchaseprice != 0) {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateSpareForm.getRawValue().purchaseprice.toString(),
            this.CreateSpareForm.getRawValue().gstslab,
            this.gsttype[1]
          );
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        } else {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateSpareForm.getRawValue().sellingprice.toString(),
            this.CreateSpareForm.getRawValue().gstslab,
            this.gsttype[1]
          );
          sale_total_amount = GSTCal[0]["totalamount"];
          sale_cgst = GSTCal[0]["CGST"];
          sale_sgst = GSTCal[0]["SGST"];
          sale_total_gst = GSTCal[0]["GSTAmount"];
          this.CreateSpareForm.getRawValue().purchaseprice =
            this.CreateSpareForm.getRawValue().sellingprice;
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        }
      }
    } else {
      if (this.CreateSpareForm.getRawValue().purchaseprice == 0) {
        this.CreateSpareForm.getRawValue().purchaseprice =
          this.CreateSpareForm.getRawValue().sellingprice;
      }
    }
    var sparesubcat;
    var lubesubcat;
    if (this.selectedtype == "spare") {
      sparesubcat = this.CreateSpareForm.getRawValue().subcategory;
      lubesubcat = "";
    } else {
      sparesubcat = "";
      lubesubcat = "";
    }
    this.general
      .saveJobSapreLubeProfile(
        this.selectedtype,
        mode,
        part_number,
        this.CreateSpareForm.getRawValue().partname,
        "",
        this.CreateSpareForm.getRawValue().unit,
        this.selectedtype,
        sparesubcat,
        lubesubcat,
        "",
        JSON.stringify(this.allSelectedMake),
        this.CreateSpareForm.getRawValue().quantity,
        this.CreateSpareForm.getRawValue().lowerlimit,
        this.CreateSpareForm.getRawValue().rackno,
        this.CreateSpareForm.getRawValue().hsnno,
        this.CreateSpareForm.getRawValue().purchaseprice,
        purchase_qty,
        this.CreateSpareForm.getRawValue().gstslab,
        this.CreateSpareForm.getRawValue().gsttype,
        purchase_total_amount,
        purchase_discount,
        purchase_cgst,
        purchase_sgst,
        purchase_igst,
        purchase_total_gst,
        this.CreateSpareForm.getRawValue().sellingprice,
        sale_qty,
        this.CreateSpareForm.getRawValue().gstslab,
        this.CreateSpareForm.getRawValue().gsttype,
        sale_total_amount,
        sale_discount,
        sale_cgst,
        sale_sgst,
        sale_igst,
        sale_total_gst,
        this.CreateSpareForm.getRawValue().companynameSpare,
        this.userWorkshopid
      )
      .subscribe(
        (SaveResult) => {
          this.showspinner.setSpinner(false);
          if (SaveResult.success == true) {
            this.showspinner.setSpinner(false);
            this.snakBar.open(
              "Success",
              ErrorMessgae[0][SaveResult["message"]],
              {
                duration: 4000,
              }
            );
            if (this.selectedtype == "spare") {
              SaveResult.sparedata["amount"] = "";
              SaveResult.sparedata["quantity"] = "1";
              SaveResult.sparedata["showqunatityerrorspare"] = null;
              SaveResult.sparedata["showpriceerrorspare"] = null;
              SaveResult.sparedata["allownegativeinspare"] = null;
              SaveResult.sparedata["checkinsertedspare"] = null;
              SaveResult.sparedata["gstcalculateofspare"] = null;
              SaveResult.sparedata["cgstcalculateofspare"] = null;
              SaveResult.sparedata["sgstcalculateofspare"] = null;
              SaveResult.sparedata["showcalcluationinfo"] = null;
              SaveResult.sparedata["sparegstamounterror"] = null;
              SaveResult.sparedata["sparegsttypeerror"] = null;
              SaveResult.sparedata["jobassignedmechanic"] = [];
              this.makejobtable(SaveResult.sparedata);
              this.shownegativeinventory = false;
              this.JobTotal = this.calculateresult(this.jobdatatabel);
            } else {
              SaveResult.lubedata["amount"] = "";
              SaveResult.lubedata["quantity"] = "1";
              SaveResult.lubedata["showqunatityerrorspare"] = null;
              SaveResult.lubedata["showpriceerrorspare"] = null;
              SaveResult.lubedata["allownegativeinspare"] = null;
              SaveResult.lubedata["checkinsertedspare"] = null;
              SaveResult.lubedata["gstcalculateofspare"] = null;
              SaveResult.lubedata["cgstcalculateofspare"] = null;
              SaveResult.lubedata["sgstcalculateofspare"] = null;
              SaveResult.lubedata["showcalcluationinfo"] = null;
              SaveResult.lubedata["sparegstamounterror"] = null;
              SaveResult.lubedata["sparegsttypeerror"] = null;
              SaveResult.lubedata["jobassignedmechanic"] = [];
              this.makejobtable(SaveResult.lubedata);
              this.JobTotal = this.calculateresult(this.jobdatatabel);
            }
          } else {
            this.showspinner.setSpinner(false);
            this.snakBar.open(
              "Success",
              ErrorMessgae[0][SaveResult["message"]],
              {
                duration: 4000,
              }
            );
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
  //calculate the GST rate
  CalculateInclusiveGSTRate(price, rate, type) {
    if (type == "Inclusive") {
      var GSTAmount =
        parseFloat(price) - parseFloat(price) * (100 / (100 + parseInt(rate)));
      var CGST = GSTAmount / 2;
      var SGST = CGST;
      var totalamount = parseFloat(price) - GSTAmount;
    } else {
      var GSTAmount = (parseFloat(price) * parseInt(rate)) / 100;
      var CGST = GSTAmount / 2;
      var SGST = CGST;
      var totalamount = parseFloat(price) + GSTAmount;
    }
    var amountarr = [];
    amountarr.push({
      GSTAmount: GSTAmount.toFixed(2),
      CGST: CGST.toFixed(2),
      SGST: SGST.toFixed(2),
      totalamount: totalamount.toFixed(2),
      type: type,
    });
    return amountarr;
  }
  // check the priice total
  checkpricefortotal(price, amount, type) {
    this.totalamountonform = price;
    if (this.allBillingData.gst_number != "") {
      var GSTCal = this.CalculateInclusiveGSTRate(price, amount, type);
      this.toShowcgst = GSTCal[0]["CGST"];
      this.toShowsgst = GSTCal[0]["SGST"];
      this.toShowtotal_gst = GSTCal[0]["GSTAmount"];
    }
  }
  // After Search User Select the job to insert it in tabel
  selectedJobResult(event) {
    var partnumber;
    partnumber = event.split("(Part No:-")[1].split(")----")[0];
    if (event.split("(Part No:-").length != 0) {
      this.general
        .getCounterSalePartSearch(this.userWorkshopid, partnumber)
        .subscribe(
          (jobData) => {
            this.jobmodel = "";
            this.showspinner.setSpinnerForLogin(true);
            this.makejobtable(jobData.lubedata[0]);
          },
          (err) => {
            this.showspinner.setSpinnerForLogin(false);
            this.snakBar.open(err, ErrorMessgae[0][err], {
              duration: 4000,
            });
          }
        );
    }
  }
  // Insert the selected record in the job tbael in form
  makejobtable(jobdata) {
    var sparedataQuantity = jobdata.current_quantity;
    var sparedatapartnumber = jobdata.part_number;
    var sparetype = jobdata.category;
    this.duplicateJob.push(jobdata);
    var result = this.duplicateJob.reduce((unique, o) => {
      this.checkforquantityforjob = false;
      if (
        !unique.some(
          (obj) =>
            obj.part_number === o.part_number && obj.part_name === o.part_name
        )
      ) {
        if (o.checkinsertedjob == undefined) {
          if (this.settingInven[0].negative_inventory != 1) {
            if (
              o.current_quantity == "0.0" ||
              o.current_quantity.split("")[0] == "-"
            ) {
              this.negativevalue = o.current_quantity;
              this.negativearryforjob = o;
              this.shownegativeinventory = true;
              this.showduplicatejob = false;
            } else {
              if (this.allBillingData.gst_number != "") {
                if (o.sale_gst_rate != "") {
                  if (o.sale_tax_type == "Inclusive") {
                    if (this.gstNumberArr.includes(o.sale_gst_rate)) {
                      var totalcal = this.CalculateInclusiveGSTRate(
                        o.unit_sale_price,
                        o.sale_gst_rate,
                        o.sale_tax_type
                      );
                      o.gstcalculateofjob = totalcal[0]["GSTAmount"];
                      o.cgstcalculateofjob = totalcal[0]["CGST"];
                      o.sgstcalculateofjob = totalcal[0]["SGST"];
                      o.showcalcluationinfo = true;
                      o.amount = o.unit_sale_price;
                      o.jobgstamounterror = false;
                      if (!this.gsttype.includes(o.sale_tax_type)) {
                        o.jobgsttypeerror = true;
                      } else {
                        o.jobgsttypeerror = false;
                      }
                    } else {
                      o.amount = o.unit_sale_price;
                      o.jobgstamounterror = true;
                      if (!this.gsttype.includes(o.sale_tax_type)) {
                        o.jobgsttypeerror = true;
                      } else {
                        o.jobgsttypeerror = false;
                      }
                    }
                  } else {
                    if (this.gstNumberArr.includes(o.sale_gst_rate)) {
                      var totalcal = this.CalculateInclusiveGSTRate(
                        o.unit_sale_price,
                        o.sale_gst_rate,
                        o.sale_tax_type
                      );
                      o.gstcalculateofjob = totalcal[0]["GSTAmount"];
                      o.cgstcalculateofjob = totalcal[0]["CGST"];
                      o.sgstcalculateofjob = totalcal[0]["SGST"];
                      o.showcalcluationinfo = true;
                      o.amount = totalcal[0]["totalamount"];
                      o.jobgstamounterror = false;
                      if (!this.gsttype.includes(o.sale_tax_type)) {
                        o.jobgsttypeerror = true;
                      } else {
                        o.jobgsttypeerror = false;
                      }
                    } else {
                      o.amount = o.unit_sale_price;
                      o.jobgstamounterror = true;
                      if (!this.gsttype.includes(o.sale_tax_type)) {
                        o.jobgsttypeerror = true;
                      } else {
                        o.jobgsttypeerror = false;
                      }
                    }
                  }
                } else if (o.purchase_gst_rate != "") {
                  if (o.purchase_tax_type != "Inclusive") {
                    if (this.gstNumberArr.includes(o.purchase_gst_rate)) {
                      var totalcal = this.CalculateInclusiveGSTRate(
                        o.unit_sale_price,
                        o.purchase_gst_rate,
                        o.purchase_tax_type
                      );
                      o.gstcalculateofjob = totalcal[0]["GSTAmount"];
                      o.cgstcalculateofjob = totalcal[0]["CGST"];
                      o.sgstcalculateofjob = totalcal[0]["SGST"];
                      o.showcalcluationinfo = true;
                      o.amount = o.unit_sale_price;
                      o.jobgstamounterror = false;
                      if (!this.gsttype.includes(o.purchase_tax_type)) {
                        o.jobgsttypeerror = true;
                      } else {
                        o.jobgsttypeerror = false;
                      }
                    } else {
                      o.amount = o.unit_sale_price;
                      o.jobgstamounterror = true;
                      if (!this.gsttype.includes(o.purchase_tax_type)) {
                        o.jobgsttypeerror = true;
                      } else {
                        o.jobgsttypeerror = false;
                      }
                    }
                  } else {
                    if (this.gstNumberArr.includes(o.purchase_gst_rate)) {
                      var totalcal = this.CalculateInclusiveGSTRate(
                        o.unit_sale_price,
                        o.purchase_gst_rate,
                        o.purchase_tax_type
                      );
                      o.gstcalculateofjob = totalcal[0]["GSTAmount"];
                      o.cgstcalculateofjob = totalcal[0]["CGST"];
                      o.sgstcalculateofjob = totalcal[0]["SGST"];
                      o.showcalcluationinfo = true;
                      o.amount = totalcal[0]["totalamount"];
                      o.jobgstamounterror = false;
                      if (!this.gsttype.includes(o.purchase_tax_type)) {
                        o.jobgsttypeerror = true;
                      } else {
                        o.jobgsttypeerror = false;
                      }
                    } else {
                      o.amount = o.unit_sale_price;
                      o.jobgstamounterror = true;
                      if (!this.gsttype.includes(o.purchase_tax_type)) {
                        o.jobgsttypeerror = true;
                      } else {
                        o.jobgsttypeerror = false;
                      }
                    }
                  }
                } else {
                  o.amount = o.unit_sale_price;
                  o.jobgsttypeerror = true;
                  o.jobgstamounterror = true;
                }
              } else {
                o.amount = o.unit_sale_price;
              }
              o.discounttype = "₹";
              o.discountvalue = "0";
              o.quantity = "1";
              o.qtyduplicate = "1";
              o.return = "0";
              o.showqunatityerrorjob = false;
              o.showdiscountjob = false;
              o.showpriceerrorjob = false;
              o.checkinsertedjob = true;
              o.jobassignedmechanic = [];
              unique.push(o);
              this.showduplicatejob = false;
              this.updateQuantity(
                sparedataQuantity,
                sparedatapartnumber,
                1,
                sparetype,
                "minus"
              );
            }
          } else {
            if (this.allBillingData.gst_number != "") {
              if (o.sale_gst_rate != "") {
                if (o.sale_tax_type == "Inclusive") {
                  if (this.gstNumberArr.includes(o.sale_gst_rate)) {
                    var totalcal = this.CalculateInclusiveGSTRate(
                      o.unit_sale_price,
                      o.sale_gst_rate,
                      o.sale_tax_type
                    );
                    o.gstcalculateofjob = totalcal[0]["GSTAmount"];
                    o.cgstcalculateofjob = totalcal[0]["CGST"];
                    o.sgstcalculateofjob = totalcal[0]["SGST"];
                    o.showcalcluationinfo = true;
                    o.amount = o.unit_sale_price;
                    o.jobgstamounterror = false;
                    if (!this.gsttype.includes(o.sale_tax_type)) {
                      o.jobgsttypeerror = true;
                    } else {
                      o.jobgsttypeerror = false;
                    }
                  } else {
                    o.amount = o.unit_sale_price;
                    o.jobgstamounterror = true;
                    if (!this.gsttype.includes(o.sale_tax_type)) {
                      o.jobgsttypeerror = true;
                    } else {
                      o.jobgsttypeerror = false;
                    }
                  }
                } else {
                  if (this.gstNumberArr.includes(o.sale_gst_rate)) {
                    var totalcal = this.CalculateInclusiveGSTRate(
                      o.unit_sale_price,
                      o.sale_gst_rate,
                      o.sale_tax_type
                    );
                    o.gstcalculateofjob = totalcal[0]["GSTAmount"];
                    o.cgstcalculateofjob = totalcal[0]["CGST"];
                    o.sgstcalculateofjob = totalcal[0]["SGST"];
                    o.showcalcluationinfo = true;
                    o.amount = totalcal[0]["totalamount"];
                    o.jobgstamounterror = false;
                    if (!this.gsttype.includes(o.sale_tax_type)) {
                      o.jobgsttypeerror = true;
                    } else {
                      o.jobgsttypeerror = false;
                    }
                  } else {
                    o.amount = o.unit_sale_price;
                    o.jobgstamounterror = true;
                    if (!this.gsttype.includes(o.sale_tax_type)) {
                      o.jobgsttypeerror = true;
                    } else {
                      o.jobgsttypeerror = false;
                    }
                  }
                }
              } else if (o.purchase_gst_rate != "") {
                if (o.purchase_tax_type != "Inclusive") {
                  if (this.gstNumberArr.includes(o.purchase_gst_rate)) {
                    var totalcal = this.CalculateInclusiveGSTRate(
                      o.unit_sale_price,
                      o.purchase_gst_rate,
                      o.purchase_tax_type
                    );
                    o.gstcalculateofjob = totalcal[0]["GSTAmount"];
                    o.cgstcalculateofjob = totalcal[0]["CGST"];
                    o.sgstcalculateofjob = totalcal[0]["SGST"];
                    o.showcalcluationinfo = true;
                    o.amount = o.unit_sale_price;
                    o.jobgstamounterror = false;
                    if (!this.gsttype.includes(o.purchase_tax_type)) {
                      o.jobgsttypeerror = true;
                    } else {
                      o.jobgsttypeerror = false;
                    }
                  } else {
                    o.amount = o.unit_sale_price;
                    o.jobgstamounterror = true;
                    if (!this.gsttype.includes(o.purchase_tax_type)) {
                      o.jobgsttypeerror = true;
                    } else {
                      o.jobgsttypeerror = false;
                    }
                  }
                } else {
                  if (this.gstNumberArr.includes(o.purchase_gst_rate)) {
                    var totalcal = this.CalculateInclusiveGSTRate(
                      o.unit_sale_price,
                      o.purchase_gst_rate,
                      o.purchase_tax_type
                    );
                    o.gstcalculateofjob = totalcal[0]["GSTAmount"];
                    o.cgstcalculateofjob = totalcal[0]["CGST"];
                    o.sgstcalculateofjob = totalcal[0]["SGST"];
                    o.showcalcluationinfo = true;
                    o.amount = totalcal[0]["totalamount"];
                    o.jobgstamounterror = false;
                    if (!this.gsttype.includes(o.purchase_tax_type)) {
                      o.jobgsttypeerror = true;
                    } else {
                      o.jobgsttypeerror = false;
                    }
                  } else {
                    o.amount = o.unit_sale_price;
                    o.jobgstamounterror = true;
                    if (!this.gsttype.includes(o.purchase_tax_type)) {
                      o.jobgsttypeerror = true;
                    } else {
                      o.jobgsttypeerror = false;
                    }
                  }
                }
              } else {
                o.amount = o.unit_sale_price;
                o.jobgsttypeerror = true;
                o.jobgstamounterror = true;
              }
            } else {
              o.amount = o.unit_sale_price;
            }
            o.discounttype = "₹";
            o.discountvalue = "0";
            o.quantity = "1";
            o.qtyduplicate = "1";
            o.return = "0";
            o.showqunatityerrorjob = false;
            o.showdiscountjob = false;
            o.showpriceerrorjob = false;
            o.checkinsertedjob = true;
            o.jobassignedmechanic = [];
            unique.push(o);
            this.showduplicatejob = false;
            this.updateQuantity(
              sparedataQuantity,
              sparedatapartnumber,
              1,
              sparetype,
              "minus"
            );
          }
        } else {
          unique.push(o);
          this.showduplicatejob = false;
        }
      } else {
        this.showduplicatejob = true;
        this.duplicatejobname = o["part_name"];
      }
      return unique;
    }, []);
    this.jobdatatabel = result;
    this.JobTotal = this.calculateresult(this.jobdatatabel);

    //this.calculateAmountOfBilling()
    this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
    this.jobtaxableamount = this.calcultetaxableamount(this.jobdatatabel);
    this.calculatebal();
    if (this.receviedty != "partial") {
      this.showre = false;
      this.receviedty = "partial";
    }
    //this.checkJobGSTrateandtype()
    //this.updateRemindersOfJob()
    //this.mechanicerror=false
    this.showspinner.setSpinnerForLogin(false);
  }
  // Updated the Negative Qunatity of the Lube
  updateNegativeInventoryForjob() {
    this.selectedtype = this.negativearryforjob.category;
    this.addselectedSpareResultsearch(this.negativearryforjob.part_number);
    this.CreateSpareForm.controls["partnumber"].setValue(
      this.negativearryforjob.part_number,
      { onlySelf: true }
    );
  }
  // add the negative invnetory in counter sale
  addnegativetojob(event) {
    var sparedataQuantity = this.negativearryforjob.current_quantity;
    var sparedatapartnumber = this.negativearryforjob.part_number;
    var type = this.negativearryforjob.category;
    if (event == true) {
      if (this.allBillingData.gst_number != "") {
        if (this.negativearryforjob.sale_gst_rate != "") {
          if (this.negativearryforjob.sale_tax_type == "Inclusive") {
            if (
              this.gstNumberArr.includes(this.negativearryforjob.sale_gst_rate)
            ) {
              var totalcal = this.CalculateInclusiveGSTRate(
                this.negativearryforjob.unit_sale_price,
                this.negativearryforjob.sale_gst_rate,
                this.negativearryforjob.sale_tax_type
              );
              this.negativearryforjob.gstcalculateofjob =
                totalcal[0]["GSTAmount"];
              this.negativearryforjob.cgstcalculateofjob = totalcal[0]["CGST"];
              this.negativearryforjob.sgstcalculateofjob = totalcal[0]["SGST"];
              this.negativearryforjob.showcalcluationinfo = true;
              this.negativearryforjob.amount =
                this.negativearryforjob.unit_sale_price;
              this.negativearryforjob.jobgstamounterror = false;
            } else {
              this.negativearryforjob.amount =
                this.negativearryforjob.unit_sale_price;
              this.negativearryforjob.jobgstamounterror = true;
              if (
                !this.gsttype.includes(this.negativearryforjob.sale_tax_type)
              ) {
                this.negativearryforjob.jobgsttypeerror = true;
              } else {
                this.negativearryforjob.jobgsttypeerror = false;
              }
            }
          } else {
            if (
              this.gstNumberArr.includes(this.negativearryforjob.sale_gst_rate)
            ) {
              var totalcal = this.CalculateInclusiveGSTRate(
                this.negativearryforjob.unit_sale_price,
                this.negativearryforjob.sale_gst_rate,
                this.negativearryforjob.sale_tax_type
              );
              this.negativearryforjob.gstcalculateofjob =
                totalcal[0]["GSTAmount"];
              this.negativearryforjob.cgstcalculateofjob = totalcal[0]["CGST"];
              this.negativearryforjob.sgstcalculateofjob = totalcal[0]["SGST"];
              this.negativearryforjob.showcalcluationinfo = true;
              this.negativearryforjob.amount = totalcal[0]["totalamount"];
              this.negativearryforjob.jobgstamounterror = false;
            } else {
              this.negativearryforjob.amount =
                this.negativearryforjob.unit_sale_price;
              this.negativearryforjob.jobgstamounterror = true;
              if (
                !this.gsttype.includes(this.negativearryforjob.sale_tax_type)
              ) {
                this.negativearryforjob.jobgsttypeerror = true;
              } else {
                this.negativearryforjob.jobgsttypeerror = false;
              }
            }
          }
        } else if (this.negativearryforjob.purchase_gst_rate != "") {
          if (this.negativearryforjob.purchase_tax_type == "Inclusive") {
            if (
              this.gstNumberArr.includes(
                this.negativearryforjob.purchase_gst_rate
              )
            ) {
              var totalcal = this.CalculateInclusiveGSTRate(
                this.negativearryforjob.unit_sale_price,
                this.negativearryforjob.purchase_gst_rate,
                this.negativearryforjob.purchase_tax_type
              );
              this.negativearryforjob.gstcalculateofjob =
                totalcal[0]["GSTAmount"];
              this.negativearryforjob.cgstcalculateofjob = totalcal[0]["CGST"];
              this.negativearryforjob.sgstcalculateofjob = totalcal[0]["SGST"];
              this.negativearryforjob.showcalcluationinfo = true;
              this.negativearryforjob.amount =
                this.negativearryforjob.unit_sale_price;
              this.negativearryforjob.jobgstamounterror = false;
            } else {
              this.negativearryforjob.amount =
                this.negativearryforjob.unit_sale_price;
              this.negativearryforjob.jobgstamounterror = true;
              if (
                !this.gsttype.includes(
                  this.negativearryforjob.purchase_tax_type
                )
              ) {
                this.negativearryforjob.jobgsttypeerror = true;
              } else {
                this.negativearryforjob.jobgsttypeerror = false;
              }
            }
          } else {
            if (
              this.gstNumberArr.includes(
                this.negativearryforjob.purchase_gst_rate
              )
            ) {
              var totalcal = this.CalculateInclusiveGSTRate(
                this.negativearryforjob.unit_sale_price,
                this.negativearryforjob.purchase_gst_rate,
                this.negativearryforjob.purchase_tax_type
              );
              this.negativearryforjob.gstcalculateofjob =
                totalcal[0]["GSTAmount"];
              this.negativearryforjob.cgstcalculateofjob = totalcal[0]["CGST"];
              this.negativearryforjob.sgstcalculateofjob = totalcal[0]["SGST"];
              this.negativearryforjob.showcalcluationinfo = true;
              this.negativearryforjob.amount = totalcal[0]["totalamount"];
              this.negativearryforjob.jobgstamounterror = false;
            } else {
              this.negativearryforjob.amount =
                this.negativearryforjob.unit_sale_price;
              this.negativearryforjob.jobgstamounterror = true;
              if (
                !this.gsttype.includes(
                  this.negativearryforjob.purchase_tax_type
                )
              ) {
                this.negativearryforjob.jobgsttypeerror = true;
              } else {
                this.negativearryforjob.jobgsttypeerror = false;
              }
            }
          }
        } else {
          this.negativearryforjob.amount =
            this.negativearryforjob.unit_sale_price;
          this.negativearryforjob.jobgsttypeerror = true;
          this.negativearryforjob.jobgstamounterror = true;
        }
      } else {
        this.negativearryforjob.amount =
          this.negativearryforjob.unit_sale_price;
      }
      this.negativearryforjob.discounttype = "₹";
      this.negativearryforjob.discountvalue = "0";
      this.negativearryforjob.quantity = "1";
      this.negativearryforjob.qtyduplicate = "1";
      this.negativearryforjob.return = "0";
      this.negativearryforjob.showqunatityerrorjob = false;
      this.negativearryforjob.showdiscountjob = false;
      this.negativearryforjob.showpriceerrorjob = false;
      this.negativearryforjob.checkinsertedjob = true;
      this.jobdatatabel.push(this.negativearryforjob);
      this.shownegativeinventory = false;
      this.duplicateJob = this.jobdatatabel;
      this.JobTotal = this.calculateresult(this.jobdatatabel);

      //this.calculateAmountOfBilling()
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
      this.jobtaxableamount = this.calcultetaxableamount(this.jobdatatabel);
      this.calculatebal();
      if (this.receviedty != "partial") {
        this.showre = false;
        this.receviedty = "partial";
      }
      this.updateQuantity(
        sparedataQuantity,
        sparedatapartnumber,
        1,
        type,
        "minus"
      );
    }
  }
  // load the data of inventory
  loadMoreDatajobs() {
    if (this.jobsnextpage != "none") {
      setTimeout(
        () =>
          this.general.inventorylsjpageination(this.jobsnextpage).subscribe(
            (JobSearchData) => {
              this.showspinner.setSpinnerForLogin(true);
              if (JobSearchData.success == true) {
                if (JobSearchData.jobdata != undefined) {
                  if (JobSearchData["next_page"] != "Nonextpage") {
                    this.jobsnextpage = JobSearchData["next_page"];
                  } else {
                    this.jobsnextpage = "none";
                  }
                  this.searchJobDatapaginate = this.searchJobData;
                  for (var i = 0; i < JobSearchData.jobdata.length; i++) {
                    if (
                      !this.jobduplicate.includes(
                        JobSearchData.jobdata[i].part_number
                      )
                    ) {
                      if (JobSearchData.jobdata[i].unit_sale_price != "") {
                        this.jobduplicate.push(
                          JobSearchData.jobdata[i].part_number
                        );
                        this.searchJobDatapaginate.push(
                          JobSearchData.jobdata[i].part_name +
                            "------" +
                            JobSearchData.jobdata[i].part_number +
                            "------" +
                            JobSearchData.jobdata[i].unit_sale_price
                        );
                      } else {
                        this.jobduplicate.push(
                          JobSearchData.jobdata[i].part_number
                        );
                        this.searchJobDatapaginate.push(
                          JobSearchData.jobdata[i].part_name +
                            "------" +
                            JobSearchData.jobdata[i].part_number
                        );
                      }
                    }
                  }
                  this.searchJobData = [];
                  setTimeout(
                    () => (this.searchJobData = this.searchJobDatapaginate),
                    10
                  );
                }
              } else {
                console.log("No Data");
                //this.searchJobData.push("No Data Found")
              }

              this.showspinner.setSpinnerForLogin(false);
            },
            (err) => {
              this.showspinner.setSpinnerForLogin(false);
              this.snakBar.open(err, ErrorMessgae[0][err], {
                duration: 4000,
              });
            }
          ),
        100
      );
    }
  }
  // search the data of inventory
  searchJobInput(event) {
    this.general
      .getCounterSaleInventorySearch(
        this.userWorkshopid,
        event,
        this.vechileTypetoshow.toString()
      )
      .subscribe(
        (JobSearchData) => {
          this.showspinner.setSpinnerForLogin(true);
          if (JobSearchData.success == true) {
            if (JobSearchData.jobdata != undefined) {
              if (JobSearchData["next_page"] != "Nonextpage") {
                this.jobsnextpage = JobSearchData["next_page"];
              } else {
                this.jobsnextpage = "none";
              }
              //this.searchJobData=[]
              for (var i = 0; i < JobSearchData.lubedata.length; i++) {
                if (
                  !this.jobduplicate.includes(
                    JobSearchData.lubedata[i].part_number
                  )
                ) {
                  if (JobSearchData.lubedata[i].unit_sale_price != "") {
                    this.jobduplicate.push(
                      JobSearchData.lubedata[i].part_number
                    );
                    this.searchJobDatasec.push(
                      JobSearchData.lubedata[i].part_name +
                        " (Part No:-" +
                        JobSearchData.lubedata[i].part_number +
                        ")----Rs." +
                        JobSearchData.lubedata[i].unit_sale_price +
                        "/-"
                    );
                  } else {
                    this.jobduplicate.push(
                      JobSearchData.lubedata[i].part_number
                    );
                    this.searchJobDatasec.push(
                      JobSearchData.lubedata[i].part_name +
                        " (Part No:-" +
                        JobSearchData.lubedata[i].part_number +
                        ")"
                    );
                  }
                }
              }
              this.searchJobData = this.searchJobDatasec;
            }
          } else {
            console.log("No Data");
            //this.searchJobData.push("No Data Found")
          }

          this.showspinner.setSpinnerForLogin(false);
        },
        (err) => {
          this.showspinner.setSpinnerForLogin(false);
          this.snakBar.open(err, ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  //remove the job from the tabel
  removeJobItem(data, index) {
    var sparedataQuantity = data.current_quantity;
    var sparedatapartnumber = data.part_number;
    var oldquantity = data.quantity;
    var type = data.category;
    this.jobdatatabel.splice(index, 1);
    this.duplicateJob = this.jobdatatabel;
    this.JobTotal = this.calculateresult(this.jobdatatabel);
    this.updateQuantity(
      sparedataQuantity,
      sparedatapartnumber,
      oldquantity,
      type,
      "add"
    );
    this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
    this.jobtaxableamount = this.calcultetaxableamount(this.jobdatatabel);
    this.calculatebal();
    if (this.receviedty != "partial") {
      this.showre = false;
      this.receviedty = "partial";
    }
    //this.checkJobGSTrateandtype()
    if ((data.is_master = "True")) {
      this.reminderArray.map((delemapped) => {
        if (data.part_name == delemapped.part_name) {
          this.reminderArray.splice(this.reminderArray.indexOf(delemapped), 1);
        }
      });
      this.checkarray.map((delemapped) => {
        if (data.part_name == delemapped) {
          this.checkarray.splice(this.checkarray.indexOf(delemapped), 1);
        }
      });
    }
  }
  // Calculate GST of inventory
  calTotalGstForJob(object) {
    return object.reduce(function (sum, record) {
      if (record.gstcalculateofjob != undefined)
        return sum + parseFloat(record.gstcalculateofjob);
      else return Math.round(sum);
    }, 0);
  }
  // calculate result
  calculateresult(object) {
    const sum = object.reduce((a, { amount }) => a + parseFloat(amount), 0);
    return sum;
  }
  // calulate the taxable amount
  calcultetaxableamount(object) {

    const taxable = object.reduce(
      (tot, item) =>
        item.sale_tax_type == "Exclusive"
          ? tot + item.amount
          : tot +
            (parseFloat(item.amount) - parseFloat(item.gstcalculateofjob)),
      0
    );

    
    return object.reduce(function (sum, record) {
      if (record.sale_tax_type == "Exclusive")
        return sum + parseFloat(record.amount);
      else
        return (
          sum +
          (parseFloat(record.amount) - parseFloat(record.gstcalculateofjob))
        );
    }, 0);
  }
  // calculate balance
  calculatebal() {
    this.balanceshow = this.JobTotal - this.discountamount - this.recveedam;
    this.totalbalance =
      this.prebalance + this.JobTotal - this.discountamount - this.recveedam;
  }
  // get the discount
  totaldiscountype(event) {
    if (this.receviedty != "partial") {
      this.showre = false;
      this.receviedty = "partial";
    }

    this.discounttpe = event;
    if (event == "₹") {
      this.discountamount = Math.round(this.discountvalue);
      this.balanceshow = this.JobTotal - this.discountamount - this.recveedam;
      this.totalbalance =
        this.prebalance + this.JobTotal - this.discountamount - this.recveedam;
    } else {
      this.discountamount =
        (this.JobTotal * Math.round(this.discountvalue)) / 100;
      this.balanceshow = this.JobTotal - this.discountamount - this.recveedam;
      this.totalbalance =
        this.prebalance + this.JobTotal - this.discountamount - this.recveedam;
    }
  }
  // update siacount
  discountupdate(event) {
    if (event.match(/^\d*\.?\d*$/)) {
      this.showerror = false;
      if (this.receviedty != "partial") {
        this.showre = false;
        this.receviedty = "partial";
      }
      this.discountvalue = event;
      if (this.discounttpe == "₹") {
        this.discountamount = Math.round(this.discountvalue);
        this.balanceshow = this.JobTotal - this.discountamount - this.recveedam;
        this.totalbalance =
          this.prebalance +
          this.JobTotal -
          this.discountamount -
          this.recveedam;
      } else {
        this.discountamount =
          (this.JobTotal * Math.round(this.discountvalue)) / 100;
        this.balanceshow = this.JobTotal - this.discountamount - this.recveedam;
        this.totalbalance =
          this.prebalance +
          this.JobTotal -
          this.discountamount -
          this.recveedam;
      }
    } else {
      this.showerror = true;
    }
  }
  // get the received type
  receviedtype(event) {
    if (event == "partial") {
      this.showre = false;
      this.recveedam = 0;
      this.balanceshow = this.JobTotal - this.discountamount - this.recveedam;
      this.totalbalance = this.prebalance + this.balanceshow;
    } else if (event == "total") {
      this.showre = true;
      this.recveedam = this.JobTotal - this.discountamount;
      if (this.balacether == true || this.prebalance == 0) {
        this.prebalance = this.backupbalance;
        this.totalbalance =
          this.prebalance +
          this.JobTotal -
          this.discountamount -
          this.recveedam;
      } else {
        this.totalbalance =
          this.prebalance +
          this.JobTotal -
          this.discountamount -
          this.recveedam;
      }
      this.balanceshow = this.JobTotal - this.discountamount - this.recveedam;
    } else if (event == "balance") {
      this.showre = true;
      this.recveedam = this.prebalance + (this.JobTotal - this.discountamount);
      var checkdatetime = new Date();
      this.receviedDate =
        checkdatetime.getFullYear() +
        "-" +
        ("0" + (checkdatetime.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + checkdatetime.getDate()).slice(-2) +
        " " +
        ("0" + checkdatetime.getHours()).slice(-2) +
        ":" +
        ("0" + checkdatetime.getMinutes()).slice(-2) +
        ":" +
        ("0" + checkdatetime.getSeconds()).slice(-2);
      this.prebalance = 0;
      this.balanceshow = 0;
      this.totalbalance = 0;
    }
  }
  // get the recevied amount
  receviedamount(event) {
    if (event.match(/^\d*\.?\d*$/)) {
      var checkbalall;
      checkbalall =
        this.prebalance + this.JobTotal - this.discountamount - parseInt(event);
      if (checkbalall < 0) {
        this.showerrorinfield = true;
        this.showerrorre = true;
        this.recveedam = event;
      } else {
        this.showerrorinfield = false;
        this.showerrorre = false;
        this.recveedam = event;
        if (this.JobTotal - this.discountamount - this.recveedam < 0) {
          this.balanceshow = 0;
          if (this.backupbalance > 0) {
            if (this.backupbalance - this.recveedam <= 0) {
              this.prebalance = 0;
              this.totalbalance = 0;
              //this.showre=true
            } else {
              this.showre = false;
              this.prebalance = this.backupbalance - this.recveedam;
              this.totalbalance = this.prebalance + 0;
            }
          } else {
            this.totalbalance = 0;
          }
        } else {
          this.showre = false;
          this.prebalance = this.backupbalance;
          this.balanceshow =
            this.JobTotal - this.discountamount - this.recveedam;
          this.totalbalance =
            this.prebalance +
            this.JobTotal -
            this.discountamount -
            this.recveedam;
        }
      }
    } else {
      this.showerrorre = true;
    }
  }
  // get the job discount vale
  jobdiscountvalue(event, indexdata, index) {
    console.log("jobdiscountvalue", event)
    console.log("match", event.match(/^\d*\.?\d*$/))
    if (event.match(/^\d*\.?\d*$/)) {
      console.log("matcheddddd")
      indexdata["showdiscountjob"] = false;
      this.jobdatatabel[index]["discountvalue"] = event;
      if (this.allBillingData.gst_number != "") {
        if (this.jobdatatabel[index]["sale_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(this.jobdatatabel[index]["unit_sale_price"]),
            this.jobdatatabel[index]["sale_gst_rate"],
            this.jobdatatabel[index]["sale_tax_type"],
            event,
            parseFloat(this.jobdatatabel[index]["quantity"]),
            this.jobdatatabel[index]["discounttype"]
          );

          this.jobdatatabel[index]["gstcalculateofjob"] =
            totalcal[0]["GSTAmount"];
          this.jobdatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
          this.jobdatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
        } else if (this.jobdatatabel[index]["purchase_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseInt(this.jobdatatabel[index]["unit_purchase_price"]),
            this.jobdatatabel[index]["purchase_gst_rate"],
            this.jobdatatabel[index]["purchase_tax_type"],
            event,
            parseFloat(this.jobdatatabel[index]["quantity"]),
            this.jobdatatabel[index]["discounttype"]
          );
          this.jobdatatabel[index]["gstcalculateofjob"] =
            totalcal[0]["GSTAmount"];
          this.jobdatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
          this.jobdatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
        } else {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(this.jobdatatabel[index]["unit_sale_price"]),
            "0",
            "Inclusive",
            event,
            parseFloat(this.jobdatatabel[index]["quantity"]),
            this.jobdatatabel[index]["discounttype"]
          );
          this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
        }
      } else {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseFloat(this.jobdatatabel[index]["unit_sale_price"]),
          "0",
          "Inclusive",
          event,
          parseFloat(this.jobdatatabel[index]["quantity"]),
          this.jobdatatabel[index]["discounttype"]
        );
        this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.JobTotal = this.calculateresult(this.jobdatatabel);
      //this.calculateAmountOfBilling()
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
      this.jobtaxableamount = this.calcultetaxableamount(this.jobdatatabel);
      this.calculatebal();
    } else {
      indexdata["showdiscountjob"] = true;
    }
  }
  //update Discount type eneter
  checkjobdiscountData(event, indexdata, index) {
    this.jobdatatabel[index]["discounttype"] = event;
    if (this.allBillingData.gst_number != "") {
      if (this.jobdatatabel[index]["sale_gst_rate"] != "") {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseFloat(this.jobdatatabel[index]["unit_sale_price"]),
          this.jobdatatabel[index]["sale_gst_rate"],
          this.jobdatatabel[index]["sale_tax_type"],
          parseFloat(this.jobdatatabel[index]["discountvalue"]),
          parseFloat(this.jobdatatabel[index]["quantity"]),
          event
        );

        this.jobdatatabel[index]["gstcalculateofjob"] =
          totalcal[0]["GSTAmount"];
        this.jobdatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
        this.jobdatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
        indexdata["showcalcluationinfo"] = true;
        this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
      } else if (this.jobdatatabel[index]["purchase_gst_rate"] != "") {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseInt(this.jobdatatabel[index]["unit_purchase_price"]),
          this.jobdatatabel[index]["purchase_gst_rate"],
          this.jobdatatabel[index]["purchase_tax_type"],
          parseFloat(this.jobdatatabel[index]["discountvalue"]),
          parseFloat(this.jobdatatabel[index]["quantity"]),
          event
        );
        this.jobdatatabel[index]["gstcalculateofjob"] =
          totalcal[0]["GSTAmount"];
        this.jobdatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
        this.jobdatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
        indexdata["showcalcluationinfo"] = true;
        this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
      } else {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseFloat(this.jobdatatabel[index]["unit_sale_price"]),
          "0",
          "Inclusive",
          parseFloat(this.jobdatatabel[index]["discountvalue"]),
          parseFloat(this.jobdatatabel[index]["quantity"]),
          event
        );
        this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
    } else {
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(this.jobdatatabel[index]["unit_sale_price"]),
        "0",
        "Inclusive",
        parseFloat(this.jobdatatabel[index]["discountvalue"]),
        parseFloat(this.jobdatatabel[index]["quantity"]),
        event
      );
      this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
    }
    this.JobTotal = this.calculateresult(this.jobdatatabel);
    //this.calculateAmountOfBilling()
    this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
    this.jobtaxableamount = this.calcultetaxableamount(this.jobdatatabel);
    this.calculatebal();
  }
  // calculate inclusive GST discount
  CalculateInclusiveGSTRateDiscounted(
    price,
    rate,
    type,
    discount,
    quantity,
    discounttype
  ) {
    var taxableAmt = 0;
    if (discounttype == "₹") {
      if (type == "Inclusive") {
        var taxalbeamount =
          (parseFloat(price) * parseFloat(quantity)) /
            (1 + parseInt(rate) / 100) -
            parseFloat(discount);
        var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
        var CGST = GSTAmount / 2;
        var SGST = CGST;
        taxableAmt = taxalbeamount;
        var totalamount = taxalbeamount + GSTAmount;
      } else {
        var taxalbeamount =
          parseFloat(price) * parseFloat(quantity) - parseFloat(discount);
        var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
        var CGST = GSTAmount / 2;
        var SGST = CGST;
        taxableAmt = taxalbeamount;
        var totalamount = taxalbeamount + GSTAmount;
      }
    } else {
      if (type == "Inclusive") {
        var discountamount =
          ((parseFloat(price) * parseFloat(quantity)) /
            (1 + parseInt(rate) / 100)) *
          (parseFloat(discount) / 100);
        var taxalbeamount =
          (parseFloat(price) * parseFloat(quantity)) /
            (1 + parseInt(rate) / 100) -
          discountamount;
        var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
        var CGST = GSTAmount / 2;
        var SGST = CGST;
        taxableAmt = taxalbeamount;
        var totalamount = taxalbeamount + GSTAmount;
      } else {
        var discountamount =
          parseFloat(price) * parseFloat(quantity) * (parseFloat(discount) / 100);
        var taxalbeamount =
          parseFloat(price) * parseFloat(quantity) - discountamount;
        var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
        var CGST = GSTAmount / 2;
        var SGST = CGST;
        taxableAmt = taxalbeamount;
        var totalamount = taxalbeamount + GSTAmount;
      }
    }

    var amountarr = [];
    amountarr.push({
      GSTAmount: GSTAmount.toFixed(2),
      CGST: CGST.toFixed(2),
      SGST: SGST.toFixed(2),
      totalamount: totalamount.toFixed(2),
      type: type,
      taxableamount: taxalbeamount,
    });
    return amountarr;
  }
  // get the job gst
  checkjobgst(event, data, index, gstVlaue) {
    var amounttocalculate =
      parseFloat(data["unit_sale_price"]) * parseFloat(data["quantity"]);
    if (data["sale_gst_rate"] != "" && data["sale_tax_type"] != "") {
      this.jobdatatabel[index]["sale_gst_rate"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(data["unit_sale_price"]),
        event,
        this.jobdatatabel[index]["sale_tax_type"],
        parseFloat(this.jobdatatabel[index]["discountvalue"]),
        parseFloat(this.jobdatatabel[index]["quantity"]),
        this.jobdatatabel[index]["discounttype"]
      );
      this.jobdatatabel[index]["gstcalculateofjob"] = totalcal[0]["GSTAmount"];
      this.jobdatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
      this.jobdatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
      data["showcalcluationinfo"] = true;
      if (gstVlaue != "gstNull") {
        this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.jobdatatabel[index]["jobgstamounterror"] = false;
      this.JobTotal = this.calculateresult(this.jobdatatabel);
      // this.calculateAmountOfBilling()
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
      this.jobtaxableamount = this.calcultetaxableamount(this.jobdatatabel);
      this.calculatebal();
      // this.checkJobGSTrateandtype()
    } else if (
      data["purchase_gst_rate"] != "" &&
      data["purchase_tax_type"] != ""
    ) {
      this.jobdatatabel[index]["purchase_gst_rate"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(data["unit_sale_price"]),
        event,
        this.jobdatatabel[index]["purchase_tax_type"],
        parseFloat(this.jobdatatabel[index]["discountvalue"]),
        parseFloat(this.jobdatatabel[index]["quantity"]),
        this.jobdatatabel[index]["discounttype"]
      );
      this.jobdatatabel[index]["gstcalculateofjob"] = totalcal[0]["GSTAmount"];
      this.jobdatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
      this.jobdatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
      data["showcalcluationinfo"] = true;
      if (gstVlaue != "gstNull") {
        this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.jobdatatabel[index]["jobgstamounterror"] = false;
      this.JobTotal = this.calculateresult(this.jobdatatabel);
      // this.calculateAmountOfBilling()
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
      this.jobtaxableamount = this.calcultetaxableamount(this.jobdatatabel);
      this.calculatebal();
      // this.checkJobGSTrateandtype()
    } else {
      this.jobdatatabel[index]["jobgstamounterror"] = false;
      this.jobdatatabel[index]["amount"] = data["amount"];
      this.JobTotal = this.calculateresult(this.jobdatatabel);
      // this.calculateAmountOfBilling()
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
      this.jobtaxableamount = this.calcultetaxableamount(this.jobdatatabel);
      this.calculatebal();
      // this.checkJobGSTrateandtype()
    }
  }
  //Value enetered as the job gst type is changed
  checkjobgsttype(event, data, index, gstVlaue) {
    var amounttocalculate =
      parseFloat(data["unit_sale_price"]) * parseFloat(data["quantity"]);
    if (data["sale_gst_rate"] != "" && data["sale_tax_type"] != "") {
      this.jobdatatabel[index]["sale_tax_type"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(data["unit_sale_price"]),
        data["sale_gst_rate"],
        event,
        parseFloat(this.jobdatatabel[index]["discountvalue"]),
        parseFloat(this.jobdatatabel[index]["quantity"]),
        this.jobdatatabel[index]["discounttype"]
      );

      this.jobdatatabel[index]["gstcalculateofjob"] = totalcal[0]["GSTAmount"];
      this.jobdatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
      this.jobdatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
      data["showcalcluationinfo"] = true;
      if (gstVlaue != "gstNull") {
        this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.jobdatatabel[index]["jobgsttypeerror"] = false;
      this.JobTotal = this.calculateresult(this.jobdatatabel);
      // this.calculateAmountOfBilling()
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
      this.jobtaxableamount = this.calcultetaxableamount(this.jobdatatabel);
      this.calculatebal();
      // this.checkJobGSTrateandtype()
    } else if (
      data["purchase_gst_rate"] != "" &&
      data["purchase_tax_type"] != ""
    ) {
      this.jobdatatabel[index]["purchase_tax_type"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(data["unit_sale_price"]),
        data["purchase_gst_rate"],
        event,
        parseFloat(this.jobdatatabel[index]["discountvalue"]),
        parseFloat(this.jobdatatabel[index]["quantity"]),
        this.jobdatatabel[index]["discounttype"]
      );

      this.jobdatatabel[index]["gstcalculateofjob"] = totalcal[0]["GSTAmount"];
      this.jobdatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
      this.jobdatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
      data["showcalcluationinfo"] = true;
      if (gstVlaue != "gstNull") {
        this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.jobdatatabel[index]["jobgsttypeerror"] = false;
      this.JobTotal = this.calculateresult(this.jobdatatabel);
      // this.calculateAmountOfBilling()
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
      this.jobtaxableamount = this.calcultetaxableamount(this.jobdatatabel);
      this.calculatebal();
      // this.checkJobGSTrateandtype()
    } else {
      this.jobdatatabel[index]["jobgsttypeerror"] = false;
      this.jobdatatabel[index]["amount"] = data["amount"];
      this.JobTotal = this.calculateresult(this.jobdatatabel);
      // this.calculateAmountOfBilling()
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
      this.jobtaxableamount = this.calcultetaxableamount(this.jobdatatabel);
      this.calculatebal();
      // this.checkJobGSTrateandtype()
    }
  }
  //check the vaue ienter in inventory
  checkvalueenteredPriceforjob(event, index, indexdata) {
    if (event.match(/^\d*\.?\d*$/)) {
      indexdata["showpriceerrorjob"] = false;
      this.jobdatatabel[index]["price"] = event;
      var amount = parseFloat(indexdata["quantity"]) * parseFloat(event);
      //this.jobdatatabel[index]["amount"]=amount
      if (this.allBillingData.gst_number != "") {
        if (this.jobdatatabel[index]["sale_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            event,
            this.jobdatatabel[index]["sale_gst_rate"],
            this.jobdatatabel[index]["sale_tax_type"],
            parseFloat(this.jobdatatabel[index]["discountvalue"]),
            parseFloat(this.jobdatatabel[index]["quantity"]),
            this.jobdatatabel[index]["discounttype"]
          );

          this.jobdatatabel[index]["gstcalculateofjob"] =
            totalcal[0]["GSTAmount"];
          this.jobdatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
          this.jobdatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
          this.jobdatatabel[index]["unit_sale_price"] = event;
        } else if (this.jobdatatabel[index]["purchase_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            event,
            this.jobdatatabel[index]["purchase_gst_rate"],
            this.jobdatatabel[index]["purchase_tax_type"],
            parseFloat(this.jobdatatabel[index]["discountvalue"]),
            parseFloat(this.jobdatatabel[index]["quantity"]),
            this.jobdatatabel[index]["discounttype"]
          );

          this.jobdatatabel[index]["gstcalculateofjob"] =
            totalcal[0]["GSTAmount"];
          this.jobdatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
          this.jobdatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
          this.jobdatatabel[index]["unit_sale_price"] = event;
        } else {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            event,
            "0",
            "Exclusive",
            parseFloat(this.jobdatatabel[index]["discountvalue"]),
            parseFloat(this.jobdatatabel[index]["quantity"]),
            this.jobdatatabel[index]["discounttype"]
          );
          this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
          this.jobdatatabel[index]["unit_sale_price"] = event;
        }
      } else {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          event,
          "0",
          "Exclusive",
          parseFloat(this.jobdatatabel[index]["discountvalue"]),
          parseFloat(this.jobdatatabel[index]["quantity"]),
          this.jobdatatabel[index]["discounttype"]
        );
        this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
        this.jobdatatabel[index]["unit_sale_price"] = event;
      }
      this.JobTotal = this.calculateresult(this.jobdatatabel);
      // this.calculateAmountOfBilling()
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
      this.jobtaxableamount = this.calcultetaxableamount(this.jobdatatabel);
      this.calculatebal();
    } else {
      indexdata["showpriceerrorjob"] = true;
    }
  }
  // check the price enetr in invnetory
  checkvalueenteredforjob(event, index, indexdata, falg) {
    if (event.match(/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/)) {
      if (event != "") {
        var sparedataQuantity = indexdata.current_quantity;
        var sparedatapartnumber = indexdata.part_number;
        var type = indexdata.category;
        this.updateQuantity(
          sparedataQuantity,
          sparedatapartnumber,
          event,
          type,
          "minus"
        );
      }

      indexdata["showqunatityerrorjob"] = false;
      var amount = parseFloat(indexdata["unit_sale_price"]) * parseFloat(event);
      this.jobdatatabel[index]["quantity"] = event;
      if (falg == true) {
        this.jobdatatabel[index]["qtyduplicate"] = event;
        // var sparedataQuantity=indexdata.current_quantity
        // var sparedatapartnumber=indexdata.part_number
        // var type=indexdata.category
        // this.updateQuantity(sparedataQuantity,sparedatapartnumber,event,type,'minus')
      }

      //this.jobdatatabel[index]["amount"]=amount

      if (this.allBillingData.gst_number != "") {
        if (this.jobdatatabel[index]["sale_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            this.jobdatatabel[index]["unit_sale_price"],
            this.jobdatatabel[index]["sale_gst_rate"],
            this.jobdatatabel[index]["sale_tax_type"],
            parseFloat(this.jobdatatabel[index]["discountvalue"]),
            event,
            this.jobdatatabel[index]["discounttype"]
          );

          this.jobdatatabel[index]["gstcalculateofjob"] =
            totalcal[0]["GSTAmount"];
          this.jobdatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
          this.jobdatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
        } else if (this.jobdatatabel[index]["purchase_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            this.jobdatatabel[index]["unit_sale_price"],
            this.jobdatatabel[index]["purchase_gst_rate"],
            this.jobdatatabel[index]["purchase_tax_type"],
            parseFloat(this.jobdatatabel[index]["discountvalue"]),
            event,
            this.jobdatatabel[index]["discounttype"]
          );

          this.jobdatatabel[index]["gstcalculateofjob"] =
            totalcal[0]["GSTAmount"];
          this.jobdatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
          this.jobdatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
        } else {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            this.jobdatatabel[index]["unit_sale_price"],
            "0",
            "Exclusive",
            parseFloat(this.jobdatatabel[index]["discountvalue"]),
            event,
            this.jobdatatabel[index]["discounttype"]
          );
          this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
        }
      } else {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          this.jobdatatabel[index]["unit_sale_price"],
          "0",
          "Exclusive",
          parseFloat(this.jobdatatabel[index]["discountvalue"]),
          event,
          this.jobdatatabel[index]["discounttype"]
        );
        this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.JobTotal = this.calculateresult(this.jobdatatabel);
      // this.calculateAmountOfBilling()
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
      this.jobtaxableamount = this.calcultetaxableamount(this.jobdatatabel);
      this.calculatebal();
    } else {
      indexdata["showqunatityerrorjob"] = true;
    }
  }
  // return the vakue of inventory
  returnvalue(event, index, indexdata) {
    if (event != "") {
      if (event.match(/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/)) {
        indexdata["showreturnerrorjob"] = false;
        if (parseInt(event) > parseInt(indexdata["qtyduplicate"])) {
          indexdata["showreturnerrorjob"] = true;
        } else {
          indexdata["showreturnerrorjob"] = false;
          var newquabt;
          newquabt = parseInt(indexdata["qtyduplicate"]) - parseInt(event);
          this.jobdatatabel[index]["return"] = event;
          var checkbalfornow;
          //this.calculatebal()

          this.checkvalueenteredforjob(
            newquabt.toString(),
            index,
            indexdata,
            false
          );
          this.returnamount =
            this.duplicatefinalamount - (this.JobTotal - this.discountamount);
          var checkdatetimenow = new Date();
          this.returndate =
            checkdatetimenow.getFullYear() +
            "-" +
            ("0" + (checkdatetimenow.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + checkdatetimenow.getDate()).slice(-2) +
            " " +
            ("0" + checkdatetimenow.getHours()).slice(-2) +
            ":" +
            ("0" + checkdatetimenow.getMinutes()).slice(-2) +
            ":" +
            ("0" + checkdatetimenow.getSeconds()).slice(-2);
          checkbalfornow = this.JobTotal - this.discountamount - this.recveedam;
          if (checkbalfornow < 0) {
            this.balanceshow = 0;
            this.prebalance = this.backupbalance + checkbalfornow;
            this.totalbalance = this.prebalance + this.balanceshow;
            if (this.totalbalance < 0) {
              this.showrefund = true;
              this.refundamount = 0 - (this.prebalance + this.balanceshow);
              this.showrefundvalue = this.refundamount;
              this.totalbalance = 0;
              this.prebalance = 0;
            } else {
              this.showrefund = false;
              this.refundamount = 0;
              this.showrefundvalue = this.refundamount;
            }
          } else {
            this.showrefund = false;
            this.refundamount = 0;
            this.showrefundvalue = this.refundamount;
            this.prebalance = this.backupbalance;
            //this.prebalance=this.totalbalance-checkbalfornow
          }
        }
      } else {
        indexdata["showreturnerrorjob"] = true;
      }
    } else {
      this.jobdatatabel[index]["return"] = "";
    }
  }
  // convet to int
  ConvertToInt(currentPage) {
    var newnum;
    newnum = Math.round(currentPage);
    return parseFloat(newnum).toFixed(2);
  }
  // convert to other type
  ConvertToOther(currentPage) {
    this.discountamount = 0;
    this.balanceshow = 0;
    this.discountvalue = 0;
    this.recveedam = 0;
    if (this.balacether == false) {
      this.totalbalance = 0;
    } else {
      this.totalbalance = this.prebalance + this.balanceshow;
    }
    return this.discountamount.toFixed(2);
  }
  // update the qty of the inventory
  updateQuantity(qunatity, partnumber, addedQuantity, mode, addorminus) {
    var oldQunatity;
    var idofpart;
    this.general
      .getJobSpareLubeData(this.userWorkshopid, mode, partnumber)
      .subscribe(
        (quantityData) => {
          if (mode == "spare") {
            oldQunatity = quantityData.sparedata[0].current_quantity;
            idofpart = quantityData.sparedata[0].id;
          } else {
            oldQunatity = quantityData.lubedata[0].current_quantity;
            idofpart = quantityData.lubedata[0].id;
          }
          if (this.counterOpenOrEdit == "edit") {
            var oldquantity;
            this.oldQuantityArray.filter((data) => {
              if (data.partnumber == partnumber) {
                oldquantity = data.quantity;
              }
            });
            if (oldquantity == undefined) {
              oldquantity = 0;
            }
          }
          if (addorminus == "minus") {
            if (this.counterOpenOrEdit == "edit") {
              var addedupdateQinatity =
                parseInt(oldQunatity) + parseInt(oldquantity);
              var updatedQuantity =
                addedupdateQinatity - parseInt(addedQuantity);
            } else {
              var updatedQuantity =
                parseInt(oldQunatity) - parseInt(addedQuantity);
            }
            if (this.QuantityObject.length != 0) {
              this.QuantityObject.filter((data, index) => {
                if (data.part_number == partnumber) {
                  this.QuantityObject.splice(index, 1);
                }
              });
              this.QuantityObject.push({
                id: idofpart,
                part_number: partnumber,
                current_quantity: updatedQuantity,
              });
            } else {
              this.QuantityObject.push({
                id: idofpart,
                part_number: partnumber,
                current_quantity: updatedQuantity,
              });
            }
          } else {
            if (this.counterOpenOrEdit == "edit") {
              var updatedQuantity =
                parseInt(oldQunatity) + parseInt(oldquantity);
            } else {
              var updatedQuantity = parseInt(oldQunatity);
            }
            if (this.QuantityObject.length != 0) {
              this.QuantityObject.filter((data, index) => {
                if (data.part_number == partnumber) {
                  this.QuantityObject.splice(index, 1);
                }
              });
              this.QuantityObject.push({
                id: idofpart,
                part_number: partnumber,
                current_quantity: updatedQuantity,
              });
            } else {
              this.QuantityObject.push({
                id: idofpart,
                part_number: partnumber,
                current_quantity: updatedQuantity,
              });
            }
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
  // on exit chnage not
  onExitNoteChange(event) {
    this.exitdata = event;
  }
  // Payment received type
  receviedtypemeth(event) {
    this.receviedtymethod = event;
  }
  // selected result
  selectedResult(event) {
    if (this.allcustomuerdata.length != 0) {
      this.selectedevnet = event;
      var name = event.split("(")[0];
      var phone = event.split("(")[1].split(")")[0];
      const cusinfo = this.allcustomuerdata.filter(
        (e) =>
          e.customer_name.includes(name) || e.customer_mobile.includes(phone)
      );
      if (cusinfo[0].invoice_no != "") {
        this.customerinvoices = JSON.parse(cusinfo[0].invoice_no);
      }
      this.prebalance = parseInt(cusinfo[0].balance);
      this.balanceshow = 0;
      this.totalbalance = parseInt(cusinfo[0].balance);
      if (cusinfo[0].balance != "0") {
        this.balacether = true;
        this.backupbalance = parseInt(cusinfo[0].balance);
      }
      this.CreateCustomerForm.controls["customerid"].setValue(cusinfo[0].id);
      this.CreateCustomerForm.controls["customername"].setValue(name, {
        onlySelf: true,
      });
      this.showtext = true;
      this.showeditcus = true;
      this.showaddcus = false;
      this.showtupdate = false;
      this.showsearccus = true;
      this.searchadded = true;
      this.CreateCustomerForm.controls["mobileOneNo"].setValue(
        cusinfo[0].customer_mobile,
        { onlySelf: true }
      );
      this.CreateCustomerForm.controls["email"].setValue(cusinfo[0].email, {
        onlySelf: true,
      });
      this.CreateCustomerForm.controls["address"].setValue(cusinfo[0].address, {
        onlySelf: true,
      });
      this.CreateCustomerForm.controls["gstno"].setValue(cusinfo[0].gstnunber, {
        onlySelf: true,
      });
      this.CreateCustomerForm.controls["customername"].disable();
      this.CreateCustomerForm.controls["mobileOneNo"].disable();
      this.CreateCustomerForm.controls["email"].disable();
      this.CreateCustomerForm.controls["address"].disable();
      this.CreateCustomerForm.controls["gstno"].disable();
    } else {
      this.snakBar.open("Message", "Please Select the Customer", {
        duration: 4000,
      });
    }
  }
  // add the new customer
  addnewcustomer() {
    this.showtext = true;
    this.showaddcus = false;
    this.showsearccus = true;
    this.showeditcus = false;
    this.searchadded = true;
    this.CreateCustomerForm.controls["customerid"].setValue("");
    this.CreateCustomerForm.controls["customername"].setValue("", {
      onlySelf: true,
    });
    this.CreateCustomerForm.controls["mobileOneNo"].setValue("", {
      onlySelf: true,
    });
    this.CreateCustomerForm.controls["email"].setValue("", { onlySelf: true });
    this.CreateCustomerForm.controls["address"].setValue("", {
      onlySelf: true,
    });
    this.CreateCustomerForm.controls["gstno"].setValue("", { onlySelf: true });
  }
  // search the customer
  Searchcustomer() {
    this.showtext = false;
    this.showsearccus = false;
    this.showaddcus = true;
    this.showeditcus = false;
    this.searchadded = false;
    this.CreateCustomerForm.controls["customerid"].setValue("");
    this.CreateCustomerForm.controls["customername"].setValue("", {
      onlySelf: true,
    });
    this.CreateCustomerForm.controls["mobileOneNo"].setValue("", {
      onlySelf: true,
    });
    this.CreateCustomerForm.controls["email"].setValue("", { onlySelf: true });
    this.CreateCustomerForm.controls["address"].setValue("", {
      onlySelf: true,
    });
    this.CreateCustomerForm.controls["gstno"].setValue("", { onlySelf: true });
    this.CreateCustomerForm.controls["customername"].enable();
    this.CreateCustomerForm.controls["mobileOneNo"].enable();
    this.CreateCustomerForm.controls["email"].enable();
    this.CreateCustomerForm.controls["address"].enable();
    this.CreateCustomerForm.controls["gstno"].enable();
  }
  // edit the customer
  editcustomer() {
    this.showtupdate = true;
    this.showsearccus = false;
    this.showaddcus = false;
    this.showeditcus = false;
    this.CreateCustomerForm.controls["customername"].enable();
    this.CreateCustomerForm.controls["mobileOneNo"].enable();
    this.CreateCustomerForm.controls["email"].enable();
    this.CreateCustomerForm.controls["address"].enable();
    this.CreateCustomerForm.controls["gstno"].enable();
  }
  // cancel the update of the customer
  cancelupdate() {
    if (this.counterOpenOrEdit != "edit") {
      this.selectedResult(this.selectedevnet);
    } else {
      this.CreateCustomerForm.controls["customerid"].setValue(this.custid);
      this.CreateCustomerForm.controls["customername"].setValue(this.cusname, {
        onlySelf: true,
      });
      this.CreateCustomerForm.controls["mobileOneNo"].setValue(this.cusphone, {
        onlySelf: true,
      });
      this.CreateCustomerForm.controls["email"].setValue(this.cusemail, {
        onlySelf: true,
      });
      this.CreateCustomerForm.controls["address"].setValue(this.cusaddress, {
        onlySelf: true,
      });
      this.CreateCustomerForm.controls["gstno"].setValue(this.cusgst, {
        onlySelf: true,
      });
      this.CreateCustomerForm.controls["customername"].disable();
      this.CreateCustomerForm.controls["mobileOneNo"].disable();
      this.CreateCustomerForm.controls["email"].disable();
      this.CreateCustomerForm.controls["address"].disable();
      this.CreateCustomerForm.controls["gstno"].disable();
      this.showeditcus = true;
      this.showtupdate = false;
    }
  }
  // update the cutsomer
  updatecustomer() {
    this.general
      .UpdateCounterCustomer(
        this.userWorkshopid,
        this.CreateCustomerForm.getRawValue().customername,
        this.CreateCustomerForm.getRawValue().mobileOneNo,
        this.CreateCustomerForm.getRawValue().email,
        this.CreateCustomerForm.getRawValue().address,
        this.CreateCustomerForm.getRawValue().gstno,
        this.CreateCustomerForm.getRawValue().customerid
      )
      .subscribe(
        (dataupdate) => {
          this.showspinner.setSpinnerForLogin(true);
          if (dataupdate.success == true) {
            this.CreateCustomerForm.controls["customername"].disable();
            this.CreateCustomerForm.controls["mobileOneNo"].disable();
            this.CreateCustomerForm.controls["email"].disable();
            this.CreateCustomerForm.controls["address"].disable();
            this.CreateCustomerForm.controls["gstno"].disable();
            this.showsearccus = true;
            this.showaddcus = false;
            this.showeditcus = true;
            this.showtupdate = false;
            this.showtext = true;
            this.snakBar.open("Message", "Data Updated Successfully", {
              duration: 4000,
            });
          }
          this.showspinner.setSpinnerForLogin(false);
        },
        (error) => {
          this.showspinner.setSpinnerForLogin(false);
          this.snakBar.open("Error", ErrorMessgae[0][error], {
            duration: 4000,
          });
        }
      );
  }
  // search bar for the cutsomer
  searchBar(event) {
    this.general
      .getCounterSaleCustomerSearch(this.userWorkshopid, event)
      .subscribe(
        (dashResult) => {
          if (dashResult.success == false) {
            this.states = [];
            this.states.push("No data Found");
            this.showspinner.setSpinner(false);
          } else if (dashResult.success == true) {
            this.states = [];
            this.allcustomuerdata = [];
            var dataset = Object.values(dashResult["customerdata"]);
            this.allcustomuerdata = dataset;
            for (var i = 0; i < dataset.length; i++) {
              this.states.push(
                dataset[i]["customer_name"] +
                  " (" +
                  dataset[i]["customer_mobile"] +
                  ")"
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
  // close tyhe popup
  closePopup() {
    this.dialogRef.close("okay");
  }
  //get the counter date

  counterDate(event) {
    // console.log(event);
    // this.counterDatevalue =
    //   event.getFullYear() +
    //   "-" +
    //   ("0" + (event.getMonth() + 1)).slice(-2) +
    //   "-" +
    //   ("0" + event.getDate()).slice(-2);
    this.counterDateField =
      event.getFullYear() +
      "-" +
      ("0" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + event.getDate()).slice(-2);
  }
  // check user has credit cart or cash
  checkcreditorcash(values) {
    if (values.currentTarget.checked == true) {
      this.classforcredit = "crditopen";
      this.classforcash = "vreditclose active";
      this.newregister = values.currentTarget.checked;
    } else {
      this.classforcredit = "crditopen active";
      this.classforcash = "vreditclose";
      this.newregister = values.currentTarget.checked;
    }
  }
  // craete new customer
  createCustomer() {
    this.CreateCustomerForm = this.formbuild.group({
      customerid: [""],
      customername: ["", Validators.required],
      mobileOneNo: [
        "",
        [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],
      ],
      email: ["", [Validators.email]],
      address: [""],
      gstno: [""],
      vehiclenumber: [
        "",
        Validators.pattern(
          "^([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{1}[0-9]{4})|" +
            "^([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{1}[0-9]{4})|" +
            "([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{1}[0-9]{3})|([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{4})|" +
            "([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{3})|([a-zA-Z]{2}[0-9]{2}[-]{1}[0-9]{4})|" +
            "([a-zA-Z]{2}[0-9]{2}[-]{1}[0-9]{3})|([a-zA-Z]{3}[0-9]{4})|([a-zA-Z]{3}[0-9]{3})|" +
            "([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{3}[0-9]{4})|([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{3}[0-9]{3})|" +
            "([a-zA-Z]{2}[0-9]{3}[a-zA-Z]{1}[0-9]{4})$"
        ),
      ],
    });
  }
  // hsn number update of inventory
  hsnforjob(event, index, indexdata) {
    this.jobdatatabel[index]["hsn_no"] = event;
  }
  // refund the amount
  refundamountcheck(event) {
    if (event == true) {
      this.isredund = true;
      this.showrefundvalue = 0;
    } else {
      this.isredund = false;
      this.showrefundvalue = this.refundamount;
    }
  }
  // craete or update the counter
  createCounter(mode) {
    var newmode;
    var res;
    if (mode == "createprint") {
      newmode = "create";
      res = {
        status: "truep",
        ivo: this.counterId,
      };
    } else if (mode == "create") {
      newmode = mode;
      res = {
        status: "true",
        ivo: this.counterId,
      };
    } else if (mode == "updateprint") {
      newmode = "update";
      res = {
        status: "truep",
        ivo: this.counterId,
      };
    } else if (mode == "update") {
      newmode = mode;
      res = {
        status: "true",
        ivo: this.counterId,
      };
    }
    var settings;
    if (newmode == "create") {
      this.customerinvoices.push(this.counterId);
      settings = {
        gst_number: this.allBillingData.gst_number,
        newregister: this.newregister,
        settingInven: this.settingInven,
      };
    } else {
      settings = this.allBillingData;
    }
    this.general
      .CreateCounterSale(
        newmode,
        this.userWorkshopid,
        this.counterId,
        this.counterDateField,
        this.CreateCustomerForm.getRawValue().customername,
        this.CreateCustomerForm.getRawValue().mobileOneNo,
        this.JobTotal,
        this.discountvalue + " " + this.discounttpe,
        +this.JobTotal - this.discountamount,
        this.recveedam,
        this.balanceshow,
        this.calTotalGstForJobamount / 2,
        this.calTotalGstForJobamount / 2,
        0.0,
        this.calTotalGstForJobamount,
        JSON.stringify(settings),
        this.exitdata,
        JSON.stringify(this.jobdatatabel),
        this.jobtaxableamount.toString(),
        this.discountamount,
        this.receviedtymethod,
        this.receviedty,
        this.receviedDate,
        this.returnamount.toString(),
        this.returndate,
        JSON.stringify(this.customerinvoices),
        this.CreateCustomerForm.getRawValue().email,
        this.CreateCustomerForm.getRawValue().address,
        "",
        "",
        "",
        this.CreateCustomerForm.getRawValue().gstno,
        this.totalbalance,
        this.CreateCustomerForm.getRawValue().customerid,
        this.refundamount,
        this.isredund.toString(),
        this.CreateCustomerForm.getRawValue().vehiclenumber
      )
      .subscribe(
        (createCounter) => {
          this.showspinner.setSpinnerForLogin(true);
          if (createCounter.success == true) {
            var mesaage;
            if (this.QuantityObject.length != 0) {
              this.general
                .updateLubeSpareQuantity(
                  this.userWorkshopid,
                  this.QuantityObject
                )
                .subscribe(
                  (data) => {
                    console.log(data);
                  },
                  (error) => {
                    this.showspinner.setSpinnerForLogin(false);
                    this.snakBar.open("Error", ErrorMessgae[0][error], {
                      duration: 4000,
                    });
                  }
                );
            }
            if (newmode != "update") {
              mesaage = "Counter Sale Created";
            } else {
              mesaage = "Counter Sale Updated";
            }
            this.snakBar.open("Message", mesaage, {
              duration: 4000,
            });
            this.dialogRef.close(res);
          }
          this.showspinner.setSpinnerForLogin(false);
        },
        (error) => {
          this.showspinner.setSpinnerForLogin(false);
          this.snakBar.open("Error", ErrorMessgae[0][error], {
            duration: 4000,
          });
        }
      );
  }
  // ------------------------
  sharewhatsApp() {
    var WorkshopData = JSON.parse(localStorage.getItem("user"));
    this.workshopName = WorkshopData.workshop_name;
    this.phoneNumber = WorkshopData.workshop_mobile_number_1;
    var totalPayable = Number(this.JobTotal - this.discountamount);
    var received = Number(this.recveedam);
    var totalbalance = Number(this.totalbalance);
    if (WorkshopData.workshop_mobile_number_2 != 0) {
      this.phoneNumber =
        WorkshopData.workshop_mobile_number_1 +
        " / " +
        WorkshopData.workshop_mobile_number_2;
    }
    var whatsappMessage;
    var inventorydata = "";
    var count = 0;
    if (this.jobdatatabel.length != 0) {
      this.jobdatatabel.map((data, index) => {
        var newdata = "";
        count = index + 1;
        newdata = "\r\n" + count + " " + data.part_name + " ₹" + data.amount;
        if (newdata != undefined) {
          inventorydata += newdata;
        }
      });
    }
    whatsappMessage =
      "Dear Customer," +
      "\r\n" +
      "Message from " +
      this.workshopName +
      " " +
      this.phoneNumber +
      "\r\n" +
      "Your Invoice details for " +
      inventorydata +
      "\r\n" +
      "Bill Amount  : ₹  " +
      totalPayable +
      "/-" +
      "\r\n" +
      "Received  : " +
      received +
      "/-" +
      "\r\n" +
      "Balance  : ₹  " +
      totalbalance +
      "/-" +
      "\r\n";
    whatsappMessage = encodeURIComponent(whatsappMessage);
    // this.contactlink =
    //   "https://wa.me/+91" + this.cusphone + "?text=" + whatsappMessage;
    this.contactlink = "https://web.whatsapp.com/send?phone=91"+
      this.cusphone+"&text=" + whatsappMessage;
    console.log("whatsappMessage", whatsappMessage);
    console.log("jobdatatabel", this.jobdatatabel);
    console.log("whatsappMessage", whatsappMessage);
  }

  share() {
    var useremail;

    if (
      this.CreateCustomerForm.getRawValue().email != "" &&
      this.CreateCustomerForm.getRawValue().email != null
    ) {
      useremail = this.CreateCustomerForm.getRawValue().email;
    } else {
      useremail = "noemail";
    }
    this.generalService.getJobcardSettings(this.userWorkshopid).subscribe(
      (settingdata) => {
        this.billingData = JSON.parse(
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

    this.dialogservice.OpenEmailSend(useremail).subscribe((email) => {
      console.log("returns ", email);
      if (email != "noemail") {
        var sendArray = Array();

        sendArray.push({
          workshop_id: this.userWorkshopid,
          invoice_no: this.counternumber,
          settings: this.billingData[0],
          email: useremail,
        });

        this.sendPDF.emailPdfForCounterSale(sendArray);
      } else {
        this.snakBar.open("Message", "Please enter the Valid Email", {
          duration: 4000,
        });
      }
    });
  }

  pdf() {
    var sendArray = Array();

    this.generalService.getJobcardSettings(this.userWorkshopid).subscribe(
      (settingdata) => {
        this.billingData = JSON.parse(
          settingdata.jobcard_Settings.settings_billing.replace(/\\/g, "")
        );
        sendArray.push({
          workshop_id: this.userWorkshopid,
          invoice_no: this.counternumber,
          settings: this.billingData[0],
        });

        this.sendPDF.downloadPdfCounterSale(sendArray);
      },
      (err) => {
        this.showspinner.setSpinnerForLogin(false);
        this.snakBar.open("Error", ErrorMessgae[0][err], {
          duration: 4000,
        });
      }
    );
  }

  // clear the search
  clearSearch() {}
  //Select Model Variant for the compatible
  selectModelVariForComp(event, category) {
    const index = this.searchModelvari.indexOf(event);
    if (index > -1) {
      this.searchModelvari.splice(index, 1);
    }
    if (event.split("--")[0] == "All") {
      this.foralltrue = true;
      this.SelectedDataarrOfVehiclespl = {
        make: "All",
        model: "All",
        variant: "All",
      };
      this.allSelectedMake.push(this.SelectedDataarrOfVehiclespl);
    } else {
      if (
        !this.dupseletecmodvari.includes(
          event.split("--")[0] + " " + "All-model All-variant"
        )
      ) {
        if (event.split("--")[1] == "All-model") {
          if (this.allSelectedMake.length != 0) {
            this.allSelectedMake
              .filter((x) => x.make === event.split("--")[0])
              .forEach((x) =>
                this.allSelectedMake.splice(this.allSelectedMake.indexOf(x), 1)
              );
            this.allSelectedMake.push({
              make: event.split("--")[0],
              model: event.split("--")[1],
              variant: event.split("--")[2],
            });
            this.dupseletecmodvari.push(event);
          } else {
            this.allSelectedMake.push({
              make: event.split("--")[0],
              model: event.split("--")[1],
              variant: event.split("--")[2],
            });
            this.dupseletecmodvari.push(event);
          }
        } else {
          if (event.split("--")[2] == "All-variant") {
            if (this.allSelectedMake.length != 0) {
              this.allSelectedMake
                .filter((x) => x.model === event.split("--")[1])
                .forEach((x) =>
                  this.allSelectedMake.splice(
                    this.allSelectedMake.indexOf(x),
                    1
                  )
                );
            } else {
              this.allSelectedMake.push({
                make: event.split("--")[0],
                model: event.split("--")[1],
                variant: event.split("--")[2],
              });
              this.dupseletecmodvari.push(event);
            }
          }
          if (!this.dupseletecmodvari.includes(event)) {
            if (
              !this.dupseletecmodvari.includes(
                event.split("--")[0] +
                  " " +
                  event.split("--")[1] +
                  " " +
                  "All-variant"
              )
            ) {
              this.allSelectedMake.push({
                make: event.split("--")[0],
                model: event.split("--")[1],
                variant: event.split("--")[2],
              });
              this.dupseletecmodvari.push(event);
            }
          }
        }
      }
    }
    this.CreateSpareForm.controls["searchspareVehicle"].setValue(" ");
  }
  // remove the model
  removemodve(modelindex, makeindex) {
    this.dupseletecmodvari.splice(makeindex, 1);
    this.allSelectedMake.splice(makeindex, 1);
  }
  //search model and varriant for compatible for
  searchModelVariforComp(event) {
    this.searchModelvari = [];
    this.general
      .searchInvenVhecileList(
        event.term,
        this.userService.getData()["workshop_type"]
      )
      .subscribe(
        (searchData) => {
          if (searchData["success"] == true) {
            if (searchData["next_page"] != "Nonextpage") {
              this.vehnextpage = searchData["next_page"];
            } else {
              this.vehnextpage = "none";
            }
            this.searchModelvari = searchData["vhicledetails"];

            this.searchModelvari = this.searchModelvari.filter(
              (v, i, a) => a.indexOf(v) === i
            );
            this.searchModelvari.sort();
          } else {
            this.searchModelvari = [];
          }
        },
        (err) => {
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  // load the vehcile list
  loadMoreDataveh() {
    if (this.vehnextpage != "none") {
      this.general.vehlsjpageination(this.vehnextpage).subscribe(
        (searchData) => {
          this.showspinner.setSpinnerForLogin(true);
          if (searchData.success == true) {
            if (searchData["next_page"] != "Nonextpage") {
              this.vehnextpage = searchData["next_page"];
            } else {
              this.vehnextpage = "none";
            }
            this.searchvehpaginate = this.searchModelvari;
            var temp = searchData["vhicledetails"];
            temp.forEach((element) => {
              this.searchvehpaginate.push(element);
            });
            // this.searchvehpaginate.push(searchData["vhicledetails"]);
            console.log(
              "searchvehpaginate pushhhhhhhh",
              this.searchvehpaginate
            );
            this.searchvehpaginate = this.searchvehpaginate.filter(
              (v, i, a) => a.indexOf(v) === i
            );

            this.searchModelvari = [];
            setTimeout(
              () => (this.searchModelvari = this.searchvehpaginate.sort()),
              10
            );
          } else {
            this.searchModelvari = [];
          }
          this.showspinner.setSpinnerForLogin(false);
        },
        (err) => {
          this.showspinner.setSpinnerForLogin(false);
          this.snakBar.open(err, ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
    }
  }

  onAdd(event) {
    this.dupseletecmodvari.push(event);

    this.allSelectedMake.push({
      make: event.split("--")[0],
      model: event.split("--")[1],
      variant: event.split("--")[2],
    });
  }
  onRemove(event) {
    var index = this.dupseletecmodvari.indexOf(event);

    this.allSelectedMake.splice(index, 1);
    this.dupseletecmodvari.splice(index, 1);
  }
  // serch the vehciles list
  searchModelVariforCompfo(event) {
    this.searchModelvari = [];
    this.general
      .searchInvenVhecileList(
        "all",
        this.userService.getData()["workshop_type"]
      )
      .subscribe(
        (searchData) => {
          if (searchData["success"] == true) {
            if (searchData["next_page"] != "Nonextpage") {
              this.vehnextpage = searchData["next_page"];
            } else {
              this.vehnextpage = "none";
            }
            this.searchModelvari = searchData["vhicledetails"];

            this.searchModelvari = this.searchModelvari.filter(
              (v, i, a) => a.indexOf(v) === i
            );
            this.searchModelvari.sort();
          } else {
            this.searchModelvari = [];
          }
        },
        (err) => {
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
}
