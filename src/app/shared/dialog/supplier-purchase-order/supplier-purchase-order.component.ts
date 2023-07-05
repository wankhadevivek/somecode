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
  import * as glob from "../../../shared/usercountry/userCountryGlobal";
  
  @Component({
    selector: "app-supplier-purchase-order",
    templateUrl: "./supplier-purchase-order.component.html",
    styleUrls: ["./supplier-purchase-order.css"],
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
   * In this file purchase-order
   * is created or edited
   * new inventriy can be craeted from here
   */
  export class SupplierPurchaseOrder implements OnInit {
    counterDateField: any = "";
    poDateField: any = "";
    transport;
    DeliveryDateField: any = "";
    vehiclenumber;
    deliveryperson;
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
    TransportForm: FormGroup;
    userWorkshopid;
    counterId = "0";
    returnamount = 0;
    returndate = null;
    maxDate;
    states = [];
    allcustomuerdata = [];
    prebalance = 0;
    showtext: boolean = false;
    showtupdate: boolean = false;
    showaddcus: boolean = true;
    showsearccus: boolean = false;
    showeditcus: boolean = false;
    selectedevnet;
    allBillingData;
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
    DeliveryDateValue;
    poDateValue;
    isredund: boolean = false;
    showrefundvalue = 0;
    showsearchcnacel: boolean = false;
    allSelectedMake = Array();
    dupseletecmodvari = Array();
    searchModelvari = Array();
    vehnextpage;
    searchvehpaginate = Array();
    CreateSupplierForm: FormGroup;
    showCreateButton: boolean = true;
    poNumberdata = "";
    billerror: boolean = false;
    poerror: boolean = false;
    showbutton: boolean = false;
    showmasterinven: boolean = false;
    cusbla = "0";
    masterdata = Array();
    vechileTypetoshow: Array<any> = [];
    currency_symbol: any;
    po_status: string;
    openStage: boolean = false;
    placedStage: boolean = false;
    receivedStage: boolean = false;
    closedStage: boolean = false;
    cancelStage:boolean = false;
    confirmStage:boolean = false;
    addstockwithpo:boolean = false;
    isRunSpinner:boolean = false;
    existingSupplierData: any;
    isExistingSupplier:boolean = false;
    isSupplierNotFound:boolean = false;
    workshopDetails :any;
    // getLatlong 
    longitude: number; 
    latitude: number;  
    master_supplier_id:any;
    DispatchDateField: any = "";
    DispatchDateValue;
    cancelBySupplier:boolean = false;
    cancelByWorkshop:boolean = false;
    dispatchStage:boolean = false;

    // original qty
    stockOgQty = {} //{partnumber : qty
    // removed items to be updated on po update
    removedStock = {}

    constructor(
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
      public dialogRef: MatDialogRef<SupplierPurchaseOrder>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      const current = new Date();
      this.maxDate = current;
      this.counterDateField = current;
      this.poDateField = current;
      this.DeliveryDateField = current;
      this.DispatchDateField = current;
      this.counterDatevalue =
        this.counterDateField.getFullYear() +
        "-" +
        ("0" + (this.counterDateField.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + this.counterDateField.getDate()).slice(-2);
      this.poDateValue =
        this.poDateField.getFullYear() +
        "-" +
        ("0" + (this.poDateField.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + this.poDateField.getDate()).slice(-2);
      this.DeliveryDateValue =
        this.DeliveryDateField.getFullYear() +
        "-" +
        ("0" + (this.DeliveryDateField.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + this.DeliveryDateField.getDate()).slice(-2);
        this.DispatchDateValue =  this.DispatchDateField.getFullYear() +
        "-" +
        ("0" + (this.DispatchDateField.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + this.DispatchDateField.getDate()).slice(-2);
      this.createSpareForm();
      this.createSupplierForm();
      this.createTransportForm();
      this.createCustomer();
      // this.userWorkshopid = this.userService.getData()["workshop_id"];
      this.counterOpenOrEdit = data.openOrEdit;
      if (data.openOrEdit == "edit") {
        this.counternumber = data.counternumber;
        this.cusbla = data.bal;
      }
      this.po_status = data.status;
      this.userWorkshopid = data.workshop;
      this.getPoStatus(this.po_status);
      this.getWorkshopData(data.workshop)
      console.log("po_status",data);
    }
    
  
    //Load the cutsomer and the counter data
    ngOnInit() {
      this.currency_symbol = glob.currency_symbol;
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
      if (this.counterOpenOrEdit == "edit") {
        this.openEditCounter();
      }
      this.showspinner.setSpinner(false);
    }


    getWorkshopData(workshopId){
      this.showspinner.setSpinner(true);
      this.general.getWorkshopDetailsById(workshopId).subscribe(
        (datacheck) => {
          this.showspinner.setSpinner(false);
          this.workshopDetails = datacheck;
          console.log("this.workshopDetails",this.workshopDetails);
          // this.CreateCustomerForm.controls["customerid"].setValue(this.custid);
          this.CreateCustomerForm.controls["customername"].setValue(this.workshopDetails.workshop_name);
          this.CreateCustomerForm.controls["mobileOneNo"].setValue(this.workshopDetails.workshop_mobile_number_1);
          this.CreateCustomerForm.controls["email"].setValue(this.workshopDetails.email);
          this.CreateCustomerForm.controls["address"].setValue(this.workshopDetails.address);
          this.CreateCustomerForm.controls["master_supplier_id"].setValue(this.workshopDetails.workshop_id);
          this.CreateCustomerForm.controls["workshop_id"].setValue(this.workshopDetails.workshop_id);
          this.CreateCustomerForm.controls["mobileTwoNo"].setValue(this.workshopDetails.workshop_mobile_number_2);
          
          // this.CreateCustomerForm.controls["gstno"].setValue(this.workshopDetails.gstno, {
          //   onlySelf: true,
          // });
          
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
    }
  

    billpoNumber(event, mode) {
      if (mode == "po") {
        this.poNumberdata = event;
        this.pobillNumbercheck(event, "po");
      } else {
        this.counterId = event;
        this.pobillNumbercheck(event, "bill");
      }
    }
    pobillNumbercheck(event, mode) {
      this.general.SearchBillPONO(this.userService.getData()["workshop_id"], event, mode).subscribe(
        (datacheck) => {
          console.log("bill number>>",datacheck);
          this.showspinner.setSpinner(true);
          if (datacheck.success == false) {
            if (mode == "bill") {
              this.billerror = true;
            } else {
              this.poerror = true;
            }
          } else {
            if (mode == "bill") {
              this.billerror = false;
            } else {
              this.poerror = false;
            }
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
    transportdata(event) {
      this.transport = event;
    }
    vehicleNumber(event) {
      if (
        event.match(
          "^([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{1}[0-9]{4})|" +
            "([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{1}[0-9]{3})|([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{4})|" +
            "([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{3})|([a-zA-Z]{2}[0-9]{2}[-]{1}[0-9]{4})|" +
            "([a-zA-Z]{2}[0-9]{2}[-]{1}[0-9]{3})|([a-zA-Z]{3}[0-9]{4})|([a-zA-Z]{3}[0-9]{3})|" +
            "([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{3}[0-9]{4})|([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{3}[0-9]{3})|" +
            "([a-zA-Z]{2}[0-9]{3}[a-zA-Z]{1}[0-9]{4})$"
        )
      ) {
        console.log("notok");
      } else {
        console.log("notok");
      }
      this.vehiclenumber = event;
    }
    personname(event) {
      this.deliveryperson = event;
    }
    // open edit customer data
    openEditCounter() {
      this.general.PODetail(this.userWorkshopid, this.counternumber).subscribe(
        (coounterdata) => {
          // console.log("openEditCounter>>",coounterdata);
          this.showspinner.setSpinnerForLogin(true);
          if (coounterdata.success == true) {
            this.cusname = coounterdata.order.supplier_name;
            this.custid = coounterdata.order.supplier_id;
            this.cusphone = coounterdata.order.supplier_mobile;
            this.showtext = true;
            this.showsearccus = false;
            this.showeditcus = true;
            this.counterId = coounterdata.order.bill_no;
            this.master_supplier_id = coounterdata.order.master_supplier_id
            if (coounterdata.order.recevied_date != null) {
              this.receviedDateedit = coounterdata.order.recevied_date;
            } else {
              this.receviedDateedit = null;
            }
            if (coounterdata.order.balance_amount != "0") {
              this.prebalance =
                parseFloat(this.cusbla) -
                parseFloat(coounterdata.order.balance_amount);
              this.totalbalance = parseFloat(this.cusbla);
              this.backuptotalbalnce = parseFloat(this.cusbla);
            } else {
              this.prebalance = 0;
              this.totalbalance =
                parseFloat(this.cusbla) +
                parseFloat(coounterdata.order.balance_amount);
              this.backuptotalbalnce =
                parseFloat(this.cusbla) +
                parseFloat(coounterdata.order.balance_amount);
            }
            this.balanceshow = parseFloat(coounterdata.order.balance_amount);
            this.backupbalacetoshow = parseFloat(
              coounterdata.order.balance_amount
            );
  
            if (this.prebalance != 0) {
              this.balacether = true;
              this.backupbalance =
                parseFloat(this.cusbla) -
                parseFloat(coounterdata.order.balance_amount);
            } else {
              this.balacether = false;
              this.backupbalance = 0;
            }
  
            this.receviedDate = coounterdata.order.recevied_date;
            this.exitdata = coounterdata.order.exit_note;
  
            // changing the table and data to accept the discount and gst calculations
  
            this.jobdatatabel = JSON.parse(coounterdata.order.stock_items);
            this.new_cal();
  
            this.duplicateJob = this.jobdatatabel;
            this.jobdatatabel.map((spareData) => {
              this.stockOgQty[spareData.part_number] = spareData.quantity
              this.oldQuantityArray.push({
                partnumber: spareData.part_number,
                quantity: spareData.quantity,
              });
            });
            if (parseInt(coounterdata.order.refund_amount) != 0) {
              this.refundamount = parseInt(coounterdata.order.refund_amount);
              if (coounterdata.order.is_return == "true") {
                this.showrefundvalue = 0;
              } else {
                this.showrefundvalue = this.refundamount;
              }
              this.showrefund = true;
              if (coounterdata.order.is_return == "true") {
                this.isredund = true;
              } else {
                this.isredund = false;
              }
            }
            this.returnamount = parseInt(coounterdata.order.return_amount);
            this.poNumberdata = coounterdata.order.po_no;
            this.poDateField = new Date(coounterdata.order.po_date);
            this.TransportForm.controls["transport"].setValue(
              coounterdata.order.transport
            );
            this.TransportForm.controls["vehicle"].setValue(
              coounterdata.order.vehicle_number,
              { onlySelf: true }
            );
            this.TransportForm.controls["person"].setValue(
              coounterdata.order.person_name,
              { onlySelf: true }
            );
            this.TransportForm.controls["ltno"].setValue(
              coounterdata.order.ltno,
              { onlySelf: true }
            );
            this.DeliveryDateField = new Date(coounterdata.order.deliverydate);
            if(coounterdata.order.dispatchdate){
              this.DeliveryDateValue = new Date(coounterdata.order.dispatchdate);
            }
            this.counterDateField = new Date(coounterdata.order.bill_date);
            this.JobTotal = parseFloat(coounterdata.order.total_amount);
            //this.jobtaxableamount=parseFloat(coounterdata.order.taxable)
            this.calTotalGstForJobamount = parseFloat(
              coounterdata.order.gst_amount
            );
            this.discounttpe = coounterdata.order.discount.split(" ")[1];
            this.discountvalue = 0;
            this.discountamount = parseFloat(coounterdata.order.discount);
            this.receviedty = coounterdata.order.payment_type;
            this.recveedam = parseFloat(coounterdata.order.paid_amount);
            this.duplicatefinalamount = this.JobTotal - this.discountamount;
            this.receviedtymethod = coounterdata.order.payment_mode;
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
  
    new_cal() {
      // console.log("----------",this.jobdatatabel)
      this.jobdatatabel.map((spareData) => {
        spareData.unit_purchase_price = spareData.amount / spareData.quantity;
      });
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
      var GSTCal = this.CalculateInclusiveGSTRate(price, amount, type);
      this.toShowcgst = GSTCal[0]["CGST"];
      this.toShowsgst = GSTCal[0]["SGST"];
      this.toShowtotal_gst = GSTCal[0]["GSTAmount"];
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
              if(!(partnumber in this.stockOgQty)){
                this.stockOgQty[partnumber] = 0
                }
                if((partnumber in this.removedStock)){
                  delete this.removedStock[partnumber]
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
    }
    // Insert the selected record in the job tbael in form
    makejobtable(jobdata) {
      console.log("makejobtable>>",jobdata);
      this.masterdata = [];
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
            if (o.is_master == "false") {
              this.showmasterinven = false;
              this.masterdata = [];
              if (o.sale_gst_rate != "") {
                if (o.sale_tax_type == "Inclusive") {
                  if (this.gstNumberArr.includes(o.sale_gst_rate)) {
                    var totalcal = this.CalculateInclusiveGSTRate(
                      o.unit_purchase_price,
                      o.sale_gst_rate,
                      o.sale_tax_type
                    );
                    o.gstcalculateofjob = totalcal[0]["GSTAmount"];
                    o.cgstcalculateofjob = totalcal[0]["CGST"];
                    o.sgstcalculateofjob = totalcal[0]["SGST"];
  
                    o.showcalcluationinfo = true;
                    o.amount = o.unit_purchase_price;
                    o.jobgstamounterror = false;
                    if (!this.gsttype.includes(o.sale_tax_type)) {
                      o.jobgsttypeerror = true;
                    } else {
                      o.jobgsttypeerror = false;
                    }
                  } else {
                    o.amount = o.unit_purchase_price;
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
                      o.unit_purchase_price,
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
                    o.amount = o.unit_purchase_price;
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
                      o.unit_purchase_price,
                      o.purchase_gst_rate,
                      o.purchase_tax_type
                    );
                    o.gstcalculateofjob = totalcal[0]["GSTAmount"];
                    o.cgstcalculateofjob = totalcal[0]["CGST"];
                    o.sgstcalculateofjob = totalcal[0]["SGST"];
  
                    o.showcalcluationinfo = true;
                    o.amount = o.unit_purchase_price;
                    o.jobgstamounterror = false;
                    if (!this.gsttype.includes(o.purchase_tax_type)) {
                      o.jobgsttypeerror = true;
                    } else {
                      o.jobgsttypeerror = false;
                    }
                  } else {
                    o.amount = o.unit_purchase_price;
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
                      o.unit_purchase_price,
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
                    o.amount = o.unit_purchase_price;
                    o.jobgstamounterror = true;
                    if (!this.gsttype.includes(o.purchase_tax_type)) {
                      o.jobgsttypeerror = true;
                    } else {
                      o.jobgsttypeerror = false;
                    }
                  }
                }
              } else {
                o.amount = o.unit_purchase_price;
                o.jobgsttypeerror = true;
                o.jobgstamounterror = true;
              }
              o.discounttype = "₹";
              o.discountvalue = "0";
              o.quantity = "1";
              o.qtyduplicate = "1";
              o.return = "0";
              o.alterqty = o.current_quantity;
              o.alterunit = o.unit_purchase_price;
              o.altersell = o.unit_sale_price;
              o.altergsttype = o.purchase_tax_type;
              o.altergstvalue = o.purchase_gst_rate;
  
              o.new_purchase_price = o.amount;
              o.showqunatityerrorjob = false;
              o.showdiscountjob = false;
              o.showpriceerrorjob = false;
              o.showpriceerrorjobunit = false;
              o.checkinsertedjob = true;
              o.showmasterinven = false;
              o.jobassignedmechanic = [];
              o.available = true;
              unique.push(o);
              this.showduplicatejob = false;
            } else {
              this.showmasterinven = true;
              this.masterdata = o;
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
    //add the master list to the create invnetory
    addinvne(event) {
      this.masterdata;
      this.selectedtype = this.masterdata["category"];
      if (this.masterdata["category"] == "spare") {
        this.CreateSpareForm.controls["subcategory"].setValue(
          this.masterdata["spare_subcategory"],
          { onlySelf: true }
        );
      } else {
        this.CreateSpareForm.controls["subcategory"].setValue(
          this.masterdata["lube_subcategory"],
          { onlySelf: true }
        );
      }
      this.foralltrue = false;
      this.allSelectedMake = JSON.parse(this.masterdata["vechile_details"]);
      this.dupseletecmodvari = [];
      this.showSpareUpdate = false;
      this.SelectedDataarrOfVehiclespl = this.masterdata["vechile_details"];
      this.CreateSpareForm.controls["partnumber"].setValue(
        this.masterdata["part_number"]
      );
      this.CreateSpareForm.controls["sellingprice"].setValue(
        this.masterdata["unit_sale_price"]
      );
      this.CreateSpareForm.controls["companynameSpare"].setValue(
        this.masterdata["company_name"]
      );
      this.CreateSpareForm.controls["partname"].setValue(
        this.masterdata["part_name"]
      );
      this.CreateSpareForm.controls["gstslab"].setValue(
        this.masterdata["sale_gst_rate"],
        { onlySelf: true }
      );
      this.CreateSpareForm.controls["gsttype"].setValue(
        this.masterdata["sale_tax_type"],
        { onlySelf: true }
      );
      this.CreateSpareForm.controls["unit"].setValue(this.masterdata["unit"], {
        onlySelf: true,
      });
      this.CreateSpareForm.controls["quantity"].setValue("0", { onlySelf: true });
      this.CreateSpareForm.controls["hsnno"].setValue(this.masterdata["hsn_no"], {
        onlySelf: true,
      });
      this.CreateSpareForm.controls["sellingprice"].setValue(
        this.masterdata["unit_sale_price"],
        { onlySelf: true }
      );
      this.CreateSpareForm.controls["purchaseprice"].setValue(
        this.masterdata["unit_purchase_price"],
        { onlySelf: true }
      );
      this.createSpareByAPI("create");
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
      if((data.part_number in this.stockOgQty)){
        delete this.stockOgQty[data.part_number]
   }
      this.removedStock[data.part_number] =  {
        qty:  -1 *data["quantity"] ,
        unit: data["unit_purchase_price"],
        sell: data["unit_sale_price"],
        gsttype: data["sale_tax_type"],
        gstvalue: data["purchase_gst_rate"],
      };
      // this.updateQuantity(
      //   this.jobdatatabel[index]["alterqty"],
      //   this.jobdatatabel[index]["part_number"],
      //   this.jobdatatabel[index]["altersell"],
      //   this.jobdatatabel[index]["alterunit"],
      //   this.jobdatatabel[index]["altergsttype"],
      //   this.jobdatatabel[index]["altergstvalue"],
      //   "all"
      // );
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
      this.jobdatatabel.splice(index, 1);
      this.duplicateJob = this.jobdatatabel;
      this.JobTotal = this.calculateresult(this.jobdatatabel);
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
      if (event.match(/^\d*\.?\d*$/)) {
        indexdata["showdiscountjob"] = false;
        this.jobdatatabel[index]["discountvalue"] = event;
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          //  changed the data provided to this method and how the returned value is stored
          // parseFloat(this.jobdatatabel[index]["unit_purchase_price"]),
          parseFloat(this.jobdatatabel[index]["alterunit"]),
          this.jobdatatabel[index]["purchase_gst_rate"],
          this.jobdatatabel[index]["purchase_tax_type"],
          event,
          parseFloat(this.jobdatatabel[index]["quantity"]),
          this.jobdatatabel[index]["discounttype"]
        );
  
        this.jobdatatabel[index]["gstcalculateofjob"] = totalcal[0]["GSTAmount"];
        this.jobdatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
        this.jobdatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
        indexdata["showcalcluationinfo"] = true;
        this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
  
        this.jobdatatabel[index]["unit_purchase_price"] =
          totalcal[0]["unit_price"];
  
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
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        // parseFloat(this.jobdatatabel[index]["unit_purchase_price"]),
        parseFloat(this.jobdatatabel[index]["alterunit"]),
        this.jobdatatabel[index]["purchase_gst_rate"],
        this.jobdatatabel[index]["purchase_tax_type"],
        parseFloat(this.jobdatatabel[index]["discountvalue"]),
        parseFloat(this.jobdatatabel[index]["quantity"]),
        event
      );
  
      this.jobdatatabel[index]["gstcalculateofjob"] = totalcal[0]["GSTAmount"];
      this.jobdatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
      this.jobdatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
      indexdata["showcalcluationinfo"] = true;
      this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
  
      this.jobdatatabel[index]["unit_purchase_price"] = totalcal[0]["unit_price"];
  
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
      if (discounttype == "₹") {
        if (type == "Inclusive") {
          var taxalbeamount =
            (parseFloat(price) * parseFloat(quantity)) /
              (1 + parseInt(rate) / 100) -
              parseFloat(discount);
          var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
          var CGST = GSTAmount / 2;
          var SGST = CGST;
          var totalamount = taxalbeamount + GSTAmount;
        } else {
          var taxalbeamount =
            parseFloat(price) * parseFloat(quantity) - parseFloat(discount);
          var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
          var CGST = GSTAmount / 2;
          var SGST = CGST;
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
          var totalamount = taxalbeamount + GSTAmount;
        } else {
          var discountamount =
            parseFloat(price) * parseFloat(quantity) * (parseFloat(discount) / 100);
          var taxalbeamount =
            parseFloat(price) * parseFloat(quantity) - discountamount;
          var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
          var CGST = GSTAmount / 2;
          var SGST = CGST;
          var totalamount = taxalbeamount + GSTAmount;
        }
      }
      var unit_price = totalamount / quantity;
      var amountarr = [];
      amountarr.push({
        GSTAmount: GSTAmount.toFixed(2),
        CGST: CGST.toFixed(2),
        SGST: SGST.toFixed(2),
        totalamount: totalamount.toFixed(2),
        type: type,
        unit_price: unit_price.toFixed(2),
      });
      return amountarr;
    }
  
    checkjobdiscount(event, data, index, value) {
      this.jobdatatabel[index]["discountvalue"] = event;
  
      var totalamount = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(this.jobdatatabel[index]["alterunit"]),
        // parseFloat(data["unit_purchase_price"]),
        this.jobdatatabel[index]["purchase_gst_rate"],
        this.jobdatatabel[index]["purchase_tax_type"],
        event,
        parseFloat(this.jobdatatabel[index]["quantity"]),
        this.jobdatatabel[index]["discounttype"]
      );
  
      console.log("after cals", totalamount);
    }
    // get the job gst
    checkjobgst(event, data, index, gstVlaue) {
      var amounttocalculate =
        parseFloat(data["unit_purchase_price"]) * parseFloat(data["quantity"]);
      this.jobdatatabel[index]["purchase_gst_rate"] = event;
      this.jobdatatabel[index]["sale_gst_rate"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        // parseFloat(data["unit_purchase_price"]),
        parseFloat(this.jobdatatabel[index]["alterunit"]),
        event,
        this.jobdatatabel[index]["purchase_tax_type"],
        parseInt(this.jobdatatabel[index]["discountvalue"]),
        parseFloat(this.jobdatatabel[index]["quantity"]),
        this.jobdatatabel[index]["discounttype"]
      );
      this.jobdatatabel[index]["gstcalculateofjob"] = totalcal[0]["GSTAmount"];
      this.jobdatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
      this.jobdatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
      data["showcalcluationinfo"] = true;
      this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
      this.jobdatatabel[index]["unit_purchase_price"] = totalcal[0]["unit_price"];
      this.jobdatatabel[index]["jobgstamounterror"] = false;
  
      this.JobTotal = this.calculateresult(this.jobdatatabel);
      //this.updateQuantity('',this.jobdatatabel[index]["part_number"],'','','',event,'gstvalue')
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
      this.jobtaxableamount = this.calcultetaxableamount(this.jobdatatabel);
      this.calculatebal();
    }
    //Value enetered as the job gst type is changed
    checkjobgsttype(event, data, index, gstVlaue) {
      var amounttocalculate =
        parseFloat(data["unit_purchase_price"]) * parseFloat(data["quantity"]);
      this.jobdatatabel[index]["sale_tax_type"] = event;
      this.jobdatatabel[index]["purchase_tax_type"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        // parseFloat(data["unit_purchase_price"]),
        parseFloat(this.jobdatatabel[index]["alterunit"]),
        data["purchase_gst_rate"],
        event,
        parseInt(this.jobdatatabel[index]["discountvalue"]),
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
      this.jobdatatabel[index]["unit_purchase_price"] = totalcal[0]["unit_price"];
      this.jobdatatabel[index]["jobgsttypeerror"] = false;
      this.JobTotal = this.calculateresult(this.jobdatatabel);
      //this.updateQuantity('',this.jobdatatabel[index]["part_number"],'','',event,'','gsttype')
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
      this.jobtaxableamount = this.calcultetaxableamount(this.jobdatatabel);
      this.calculatebal();
      // this.checkJobGSTrateandtype()
    }
    //check the vaue ienter in inventory
    checkvalueenteredPriceforjob(event, index, indexdata) {
      if (event.match(/^\d*\.?\d*$/)) {
        indexdata["showpriceerrorjob"] = false;
        this.jobdatatabel[index]["price"] = event;
  
        var amount = parseFloat(indexdata["quantity"]) * parseFloat(event);
        //this.jobdatatabel[index]["amount"]=amount
        if (this.jobdatatabel[index]["purchase_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            event,
            this.jobdatatabel[index]["purchase_gst_rate"],
            this.jobdatatabel[index]["purchase_tax_type"],
            parseInt(this.jobdatatabel[index]["discountvalue"]),
            parseFloat(this.jobdatatabel[index]["quantity"]),
            this.jobdatatabel[index]["discounttype"]
          );
  
          this.jobdatatabel[index]["gstcalculateofjob"] =
            totalcal[0]["GSTAmount"];
          this.jobdatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
          this.jobdatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
          this.jobdatatabel[index]["unit_purchase_price"] =
            totalcal[0]["unit_price"];
          // this.jobdatatabel[index]["unit_purchase_price"] = event;
          this.jobdatatabel[index]["alterunit"] = event;
        } else {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            event,
            "0",
            "Exclusive",
            parseInt(this.jobdatatabel[index]["discountvalue"]),
            parseFloat(this.jobdatatabel[index]["quantity"]),
            this.jobdatatabel[index]["discounttype"]
          );
          this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
  
          // i hid it didnt make sense to add to sale price check
          // this.jobdatatabel[index]["unit_sale_price"] = event;
  
          this.jobdatatabel[index]["alterunit"] = event;
        }
        this.JobTotal = this.calculateresult(this.jobdatatabel);
        //this.updateQuantity('',this.jobdatatabel[index]["part_number"],'',event,'','','unit')
        this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
        this.jobtaxableamount = this.calcultetaxableamount(this.jobdatatabel);
        this.calculatebal();
      } else {
        indexdata["showpriceerrorjob"] = true;
      }
    }
    //check the vaue ienter in inventory
    checkvalueenteredPriceforjobunit(event, index, indexdata) {
      if (event.match(/^\d*\.?\d*$/)) {
        indexdata["showpriceerrorjobunit"] = false;
        this.jobdatatabel[index]["unit_sale_price"] = event;
        //this.updateQuantity('',this.jobdatatabel[index]["part_number"],event,'','','','sell')
        //   this.jobdatatabel[index]["price"]=event
        //   var amount = parseFloat(indexdata["quantity"])*parseFloat(event)
        //   //this.jobdatatabel[index]["amount"]=amount
        //   if(this.allBillingData.gst_number!=''){
        //     if(this.jobdatatabel[index]["sale_gst_rate"]!=''){
        //       var totalcal= this.CalculateInclusiveGSTRateDiscounted(
        //         event,
        //         this.jobdatatabel[index]["sale_gst_rate"],this.jobdatatabel[index]["sale_tax_type"],
        //         parseInt(this.jobdatatabel[index]["discountvalue"]),
        //         parseFloat(this.jobdatatabel[index]["quantity"]),
        //         this.jobdatatabel[index]["discounttype"])
  
        //       this.jobdatatabel[index]["gstcalculateofjob"]=totalcal[0]["GSTAmount"]
        //       this.jobdatatabel[index]["cgstcalculateofjob"]=totalcal[0]["CGST"]
        //       this.jobdatatabel[index]["sgstcalculateofjob"]=totalcal[0]["SGST"]
        //       indexdata["showcalcluationinfo"]=true
        //       this.jobdatatabel[index]["amount"]= totalcal[0]["totalamount"]
        //         this.jobdatatabel[index]["unit_sale_price"]=event
        //     }else if(this.jobdatatabel[index]["purchase_gst_rate"]!=''){
        //       var totalcal= this.CalculateInclusiveGSTRateDiscounted(
        //         event,
        //         this.jobdatatabel[index]["purchase_gst_rate"],this.jobdatatabel[index]["purchase_tax_type"],
        //         parseInt(this.jobdatatabel[index]["discountvalue"]),
        //         parseFloat(this.jobdatatabel[index]["quantity"]),
        //         this.jobdatatabel[index]["discounttype"])
  
        //       this.jobdatatabel[index]["gstcalculateofjob"]=totalcal[0]["GSTAmount"]
        //       this.jobdatatabel[index]["cgstcalculateofjob"]=totalcal[0]["CGST"]
        //       this.jobdatatabel[index]["sgstcalculateofjob"]=totalcal[0]["SGST"]
        //       indexdata["showcalcluationinfo"]=true
        //       this.jobdatatabel[index]["amount"]= totalcal[0]["totalamount"]
        //         this.jobdatatabel[index]["unit_sale_price"]=event
        //     }else{
        //       var totalcal= this.CalculateInclusiveGSTRateDiscounted(
        //         event,
        //         '0','Exclusive',
        //         parseInt(this.jobdatatabel[index]["discountvalue"]),
        //         parseFloat(this.jobdatatabel[index]["quantity"]),
        //         this.jobdatatabel[index]["discounttype"])
        //       this.jobdatatabel[index]["amount"]= totalcal[0]["totalamount"]
        //       this.jobdatatabel[index]["unit_sale_price"]=event
        //     }
        //   }else{
        //     var totalcal= this.CalculateInclusiveGSTRateDiscounted(
        //       event,
        //       '0','Exclusive',
        //       parseInt(this.jobdatatabel[index]["discountvalue"]),
        //       parseFloat(this.jobdatatabel[index]["quantity"]),
        //       this.jobdatatabel[index]["discounttype"])
        //     this.jobdatatabel[index]["amount"]= totalcal[0]["totalamount"]
        //         this.jobdatatabel[index]["unit_sale_price"]=event
        //   }
        //   this.JobTotal=this.calculateresult(this.jobdatatabel)
        //   // this.calculateAmountOfBilling()
        //   this.calTotalGstForJobamount=this.calTotalGstForJob(this.jobdatatabel)
        //   this.jobtaxableamount=this.calcultetaxableamount(this.jobdatatabel)
        //   this.calculatebal()
  
        // }else{
        //   indexdata["showpriceerrorjobunit"]=true
      }
    }
    // check the price enetr in invnetory
    checkvalueenteredforjob(event, index, indexdata, falg) {
      if (event.match(/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/)) {
        indexdata["showqunatityerrorjob"] = false;
        var amount =
          parseFloat(indexdata["unit_purchase_price"]) * parseFloat(event);
        this.jobdatatabel[index]["current_quantity"] =
          parseFloat(event) + parseFloat(this.jobdatatabel[index]["alterqty"]);
        this.jobdatatabel[index]["quantity"] = parseFloat(event);
        if (falg == true) {
          this.jobdatatabel[index]["qtyduplicate"] = event;
        }
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          // this.jobdatatabel[index]["unit_purchase_price"],
          this.jobdatatabel[index]["alterunit"],
          this.jobdatatabel[index]["purchase_gst_rate"],
          this.jobdatatabel[index]["purchase_tax_type"],
          parseInt(this.jobdatatabel[index]["discountvalue"]),
          event,
          this.jobdatatabel[index]["discounttype"]
        );
  
        this.jobdatatabel[index]["gstcalculateofjob"] = totalcal[0]["GSTAmount"];
        this.jobdatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
        this.jobdatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
        indexdata["showcalcluationinfo"] = true;
        this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
  
        this.jobdatatabel[index]["unit_purchase_price"] =
          totalcal[0]["unit_price"];
  
        this.JobTotal = this.calculateresult(this.jobdatatabel);
        //this.updateQuantity(event,this.jobdatatabel[index]["part_number"],'','','','','qty')
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
    updateQuantity(qunatity, partnumber, sell, unit, gsttype, gstvale, mode) {
      this.general
        .UpdateStock(
          mode,
          this.userWorkshopid,
          partnumber,
          qunatity,
          unit,
          sell,
          gsttype,
          gstvale
        )
        .subscribe(
          (updateData) => {
            this.showspinner.setSpinner(true);
            if (updateData.success == true) {
              console.log("ok");
            } else {
              console.log("notok");
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
            e.supplier_name.includes(name) || e.supplier_mobile1.includes(phone)
        );
        this.prebalance = parseInt(cusinfo[0].balance);
        this.balanceshow = 0;
        this.totalbalance = parseInt(cusinfo[0].balance);
        if (cusinfo[0].balance != "0") {
          this.balacether = true;
          this.backupbalance = parseInt(cusinfo[0].balance);
        }
        this.showtext = true;
        this.showeditcus = true;
        this.showsearccus = true;
      } else {
        this.snakBar.open("Message", "Please Select the Customer", {
          duration: 4000,
        });
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
              "([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{1}[0-9]{3})|([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{4})|" +
              "([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{3})|([a-zA-Z]{2}[0-9]{2}[-]{1}[0-9]{4})|" +
              "([a-zA-Z]{2}[0-9]{2}[-]{1}[0-9]{3})|([a-zA-Z]{3}[0-9]{4})|([a-zA-Z]{3}[0-9]{3})|" +
              "([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{3}[0-9]{4})|([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{3}[0-9]{3})|" +
              "([a-zA-Z]{2}[0-9]{3}[a-zA-Z]{1}[0-9]{4})$"
          ),
        ],
        master_supplier_id: [""],
        workshop_id: [""],
        mobileTwoNo: [""],
      });
    }
    //cretae form of supplier
    createSupplierForm() {
      this.CreateSupplierForm = this.formbuild.group({
        id: [""],
        firstname: ["", Validators.required],
        contact1: ["", [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
        contact2: ["", Validators.pattern(/^[6-9]\d{9}$/)],
        email: ["", [Validators.required, Validators.email]],
        firm: ["", Validators.required],
        address: ["", Validators.required],
        gst: [
          "",
          Validators.pattern(
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
          ),
        ],
        master_supplier_id: [""]
      });
    }
    //cretae form of Transport
    createTransportForm() {
      this.TransportForm = this.formbuild.group({
        transport: [""],
        vehicle: [
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
        person: [""],
        ltno: [""],
      });
    }
  
    // search bar for the cutsomer
    searchBar(event) {
      this.general.SupplierDashboard(this.userWorkshopid, event).subscribe(
        (dashResult) => {
          if (dashResult.success == false) {
            this.states = [];
            this.states.push("No data Found");
            this.showspinner.setSpinner(false);
          } else if (dashResult.success == true) {
            this.states = [];
            this.allcustomuerdata = [];
            var dataset = Object.values(dashResult["supplier"]);
            this.allcustomuerdata = dataset;
            for (var i = 0; i < dataset.length; i++) {
              this.states.push(
                dataset[i]["business_name"] +
                  " (" +
                  dataset[i]["supplier_mobile1"] +
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
    closePopup(){
        this.dialogRef.close("okay");
        if(localStorage.getItem("params")){
          localStorage.removeItem("params");
          localStorage.removeItem("po");
          localStorage.removeItem("workshop_id");
        }
    }
    //get the counter date
    counterDate(event) {
      this.counterDatevalue =
        event.getFullYear() +
        "-" +
        ("0" + (event.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + event.getDate()).slice(-2);
    }
    poDate(event) {
      this.poDateValue =
        event.getFullYear() +
        "-" +
        ("0" + (event.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + event.getDate()).slice(-2);
    }
    deliveryDate(event) {
      this.DeliveryDateValue =
        event.getFullYear() +
        "-" +
        ("0" + (event.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + event.getDate()).slice(-2);
    }
    dispatchDate(event) {
      this.DispatchDateValue =
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
    // craete or update the PO
    createPO(mode) {
      var recevieddate;
      var po_status= 8;
      this.showbutton = true;
      if (this.recveedam != 0) {
      }
      this.general
        .CreateUpdatePO(
          mode,
          this.userWorkshopid,
          this.counterId,
          JSON.stringify(this.jobdatatabel),
          this.CreateCustomerForm.getRawValue().customerid,
          this.poNumberdata,
          this.JobTotal.toString(),
          this.discountvalue + " " + this.discounttpe,
          this.balanceshow.toString(),
          this.recveedam.toString(),
          this.calTotalGstForJobamount.toString(),
          (this.calTotalGstForJobamount / 2).toString(),
          (this.calTotalGstForJobamount / 2).toString(),
          "",
          this.receviedty,
          (+this.JobTotal - this.discountamount).toString(),
          this.receviedtymethod,
          this.poDateValue,
          this.counterDatevalue,
          this.CreateCustomerForm.getRawValue().customername,
          this.CreateCustomerForm.getRawValue().mobileOneNo,
          this.exitdata,
          this.receviedDate,
          this.returnamount.toString(),
          this.returndate,
          this.refundamount.toString(),
          this.isredund.toString(),
          this.TransportForm.getRawValue().vehicle,
          this.TransportForm.getRawValue().transport,
          this.DeliveryDateValue,
          this.TransportForm.getRawValue().person,
          this.totalbalance.toString(),
          this.TransportForm.getRawValue().ltno,
          po_status,
          this.CreateCustomerForm.getRawValue().master_supplier_id,
          this.DispatchDateValue
        )
        .subscribe(
          (createCounter) => {
            this.showspinner.setSpinnerForLogin(true);
            if (createCounter.success == true) {
              var mesaage;
              if (this.jobdatatabel.length != 0 
                || Object.keys(this.removedStock).length !=0) {
                let payload = {}
                this.jobdatatabel.map((datajob) => {
                  payload[datajob["part_number"]] =  {
                    qty:  parseFloat(datajob["quantity"]) -
                    this.stockOgQty[datajob["part_number"]],
                    unit: datajob["unit_purchase_price"],
                    sell: datajob["unit_sale_price"],
                    gsttype: datajob["sale_tax_type"],
                    gstvalue: datajob["purchase_gst_rate"],
                  };
                  // this.updateQuantity(
                  //   parseFloat(datajob["quantity"]) +
                  //     parseFloat(datajob["alterqty"]),
                  //   datajob["part_number"],
                  //   datajob["unit_sale_price"],
                  //   datajob["unit_purchase_price"],
                  //   datajob["sale_tax_type"],
                  //   datajob["purchase_gst_rate"],
                  //   "all"
                  // );
                });
                if (Object.keys(this.removedStock).length > 0){
                  payload ={...payload, ...this.removedStock}
                }
          
                this.general.UpdatePOStock(
                  'all',
                  this.userWorkshopid,
                  payload
                ).subscribe(
                  (updateData) => {
                    this.showspinner.setSpinner(true);
                    if (updateData.success == true) {
                      console.log("ok");
                    } else {
                      console.log("notok");
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
              if (mode != "update") {
                mesaage = "Purchase Order Created";
              } else {
                mesaage = "Purchase Order Updated";
              }
              this.snakBar.open("Message", mesaage, {
                duration: 4000,
              });
              this.dialogRef.close("res");
            } else {
              this.showbutton = false;
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
          event,
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
              this.searchvehpaginate.push(searchData["vhicledetails"]);
  
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
  // Viraj Purchase order 
    getPoStatus(po){
      console.log("po:",po)
      switch(po) { 
        case '0': { 
          this.openStage = true;
           break; 
        } 
        case '1': { 
          this.placedStage = true;
           break; 
        } 
        case '2': {
          
          this.receivedStage = true; 
          break; 
        } 
        case '3': { 
          this.closedStage = true; 
          break; 
        } 
        case '4': { 
          this.cancelStage = true;
          this.cancelByWorkshop = true; 
          break; 
        }
        case '5': { 
           this.confirmStage = true; 
          break; 
        }
        case '6': { 
          this.cancelStage = true; 
          this.cancelBySupplier = true; 
         break; 
       } 
       case '7': { 
        this.dispatchStage = true; 
       break; 
      }
      default: { 
          this.addstockwithpo = true; 
          break; 
        } 
     }
    }
  
    UpdatePOStatus(mode){
      var poStatus 
      if(this.openStage){
        poStatus = 1;
      }else if(this.placedStage){
        //confirm order here
        poStatus = 5;
      }else if(this.confirmStage){
        poStatus = 7;
      }else if(this.receivedStage){
        poStatus = 3;
      }
      if(mode == 'cancel'){
        mode = 'update';
        poStatus = 6;
      }
   
  
      this.general
        .CreateUpdatePO(
          mode,
          this.userWorkshopid,
          this.counterId,
          JSON.stringify(this.jobdatatabel),
          this.custid,
          this.poNumberdata,
          this.JobTotal.toString(),
          this.discountvalue + " " + this.discounttpe,
          this.balanceshow.toString(),
          this.recveedam.toString(),
          this.calTotalGstForJobamount.toString(),
          (this.calTotalGstForJobamount / 2).toString(),
          (this.calTotalGstForJobamount / 2).toString(),
          "",
          this.receviedty,
          (+this.JobTotal - this.discountamount).toString(),
          this.receviedtymethod,
          this.poDateValue,
          this.counterDatevalue,
          this.cusname,
          this.cusphone,
          this.exitdata,
          this.receviedDate,
          this.returnamount.toString(),
          this.returndate,
          this.refundamount.toString(),
          this.isredund.toString(),
          this.TransportForm.getRawValue().vehicle,
          this.TransportForm.getRawValue().transport,
          this.DeliveryDateValue,
          this.TransportForm.getRawValue().person,
          this.totalbalance.toString(),
          this.TransportForm.getRawValue().ltno,
          poStatus,
          this.master_supplier_id,
          this.DispatchDateValue
        )
        .subscribe(
          (createCounter) => {
            this.showspinner.setSpinnerForLogin(true);
            if (createCounter.success == true) {
              var mesaage;
              if (this.jobdatatabel.length != 0) {
                this.jobdatatabel.map((datajob) => {
                  this.updateQuantity(
                    parseFloat(datajob["quantity"]) +
                      parseFloat(datajob["alterqty"]),
                    datajob["part_number"],
                    datajob["unit_sale_price"],
                    datajob["unit_purchase_price"],
                    datajob["sale_tax_type"],
                    datajob["purchase_gst_rate"],
                    "all"
                  );
                });
              }
              if (mode != "update") {
                mesaage = "Purchase Order Created";
              } else {
                mesaage = "Purchase Order Updated";
              }
              this.snakBar.open("Message", mesaage, {
                duration: 4000,
              });
              this.dialogRef.close("res");
            } else {
              this.showbutton = false;
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
  
    getSupplierDetailsByPhone(number){
      var MobileNo = '';
      MobileNo = number;
      if(MobileNo.length > 8){
        this.showspinner.setSpinner(true)
        this.isRunSpinner = true;
        this.general.AllSupplierDetails(MobileNo, this.userWorkshopid).subscribe(dashResult=>{  
          this.showspinner.setSpinner(false) 
          this.isRunSpinner = false;
          console.log("dashResult>>",dashResult);
          if(dashResult.success){
            this.existingSupplierData = dashResult.customer;
            if(dashResult.customer){
              this.isExistingSupplier = true;
              this.CreateSupplierForm.controls["address"].setValue(dashResult.customer.supplier_address);
              this.CreateSupplierForm.controls["gst"].setValue(dashResult.customer.supplier_gst_no);
              this.CreateSupplierForm.controls["firstname"].setValue(dashResult.customer.supplier_name);
              this.CreateSupplierForm.controls["contact1"].setValue(dashResult.customer.supplier_mobile1);
              this.CreateSupplierForm.controls["contact2"].setValue(dashResult.customer.supplier_mobile2);
              this.CreateSupplierForm.controls["email"].setValue(dashResult.customer.supplier_email);
              this.CreateSupplierForm.controls["firm"].setValue(dashResult.customer.business_name);
              this.CreateSupplierForm.controls["master_supplier_id"].setValue(dashResult.customer.master_supplier_id);
            }else{
              this.isExistingSupplier = false;
            }
          }else{
            if(dashResult[0]){
                if(dashResult[0].message == 105){
                this.isExistingSupplier = true;
                this.CreateSupplierForm.controls["contact1"].setValue("");
                this.snakBar.open("Message", 'Supplier already added', {
                  duration: 4000
                })
              }
            }else{
              this.isSupplierNotFound = true;
              this.isExistingSupplier = false;
              this.snakBar.open("Message", 'Supplier not found', {
                duration: 4000
              })
            }
          }
        })
      }
      
    }
  
    getLocation(): void{
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position)=>{
            this.longitude = position.coords.longitude;
            this.latitude = position.coords.latitude;
            this.general.getAddrByLatLanSecond(this.longitude, this.latitude).subscribe(addr =>{
                console.log("address", addr);
            })
          });
      } else {
         console.log("No support for geolocation")
      }
    }
    createSupplier(e){
      console.log(e);
    }
    
    
  
  
  
  }
  