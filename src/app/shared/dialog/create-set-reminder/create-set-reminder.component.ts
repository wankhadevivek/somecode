import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DilogOpenService } from "../../../services/dilog-open.service";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MatSnackBar,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { GeneralService } from "../../../services/general.service";
import { UserserviceService } from "../../../services/userservice.service";
import { SpinnerService } from "../../../services/spinner.service";
import { Observable, Subject, merge } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  filter,
} from "rxjs/operators";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { ErrorMessgae } from "../../error_message/error";
import { NgbDatepickerConfig } from "@ng-bootstrap/ng-bootstrap";
import { PrintsharepdfService } from "../../../services/printsharepdf.service";
import { LasthistoryService } from "../../../services/lasthistory.service";
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
import { MatSliderChange } from "@angular/material";
import { coerceNumberProperty } from "@angular/cdk/coercion";
import { AbstractService } from "../../../services/comman/abstract.service";
import * as glob from "../../../shared/usercountry/userCountryGlobal";
import { UserPermissionService } from "../../../services/user-permissions.service";
// Note:- Code is almost same as the short invoice form as frontend functionality is same as short invlice from
// things are chnages in the backend so the code is copy pasted here
@Component({
  selector: "app-create-set-reminder",
  templateUrl: "./create-set-reminder.component.html",
  styleUrls: ["./create-set-reminder.component.css"],
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
 * In this file reminder is generated
 * here user havs to select the cutsomer
 * or create a customer and the add the invent-
 * ory here comaplete all the details
 * of the vehcle and the customer
 * and then create it/
 */
export class CreateSetReminderComponent implements OnInit {
  sparemodel: any;
  sparemodelforcreate: any;
  vehiclesearchmodel: any;
  vehiclesearchmodelspl: any;
  lubemodelforcreate: any;
  jobmodelforcreate: any;
  lubemodel: any;
  jobmodel: any;
  showVechileNo: boolean = false;
  getColor: string = "#ffffff";
  samePickup: boolean = false;
  CreateCustomerForm: FormGroup;
  jobCradCreateForm: FormGroup;
  CreateSpareForm: FormGroup;
  CreateLubeForm: FormGroup;
  CreateJobForm: FormGroup;
  satffForm: FormGroup;
  staffarr = Array();
  model;
  jobcardSettingData;
  modelmessage = "Please select Vechile Model";
  varrimessage = "Please select Vechile Variant";
  makemessage = "Please select Vechile Make";
  typemessage = "Please Select Vechile Type";
  vechileType: Array<any> = [];
  vechileTypetoshow: Array<any> = [];
  vechileMake: Array<any> = [this.makemessage];
  vechileModel: Array<any> = [this.modelmessage];
  vechileVarriant: Array<any> = [this.varrimessage];
  vechileMakeForspare: Array<any> = [this.makemessage];
  vechileModelForspare: Array<any> = [this.modelmessage];
  vechileVarriantForspare: Array<any> = [this.varrimessage];
  makeNotSelected: boolean = false;
  modelNotSelected: boolean = false;
  allVechileTypes: any;
  showInvoiceForm: boolean = false;
  dateOfBirth: any = "";
  jocardnumber: string;
  date = new Date();
  yearForJobcard: string;
  askForUpadte: boolean = false;
  showdisable: boolean = false;
  customervoicedata = Array();
  allBillingData;
  term;
  showInput: boolean = false;
  noerror: boolean = true;
  value;
  placeholder: string = "Add Customer Value*";
  borderColor: string;
  showSelectedVoice: boolean = false;
  SelectedVoice = [];
  add: number = 1;
  showAddVoice: boolean = true;
  searchSpareData = [];
  searchSpareDataForCreate = [];
  searchLubeDataForCreate = [];
  searchJobDataForCreate = [];
  searchLubeData = [];
  searchJobData = [];
  searchVehicleData = [];

  searchCustomerData = [];
  detailedCustomerData = [];
  selectedCustomer: any;
  is_set_customer = false;
  is_set_vehicle = true;
  searchCustomerDataPage;
  vehicle_numbers_added = [];
  selectedVehicleCheck = false;

  existing_customer;
  entered_number_valid = true;

  gstNumberArr = ["0%", "5%", "12%", "18%", "28%"];
  gsttype = ["Exclusive", "Inclusive"];
  spareCategory = [
    "Frequent Items",
    "Engine Parts",
    "Accessories",
    "Body Parts",
    "Electrical Parts",
  ];
  checkCustomerVoice = [
    "Servicing",
    "Wheel Allignment",
    "Balancing",
    "Washing",
    "General Repair",
    "Oil Check and Change",
    "Accidental Repair",
    "Customization",
  ];
  JobCategory = ["in_house", "out_source"];
  units = ["units", "gm", "ltr", "ml", "can", "pouch"];
  unitsjob = ["units", "Hrs"];
  sparedatatabel = Array();
  lubedatatabel = Array();
  jobdatatabel = Array();

  totaldatatable = Array();
  duplicateSpare = Array();
  duplicateLube = Array();
  duplicateJob = Array();
  staffListtabel = Array();
  allStaffList = Array();
  selectedStaffId = Array();
  jobcardStaff = Array();
  change: string;
  showduplicateSpare: boolean = false;
  showduplicatejob: boolean = false;
  showduplicatelube: boolean = false;
  disabledmechanicdropdown: boolean = false;
  allowSearchFilter: boolean = true;
  duplicatejobname: string;
  duplicateSparename: string;
  duplicatelubename: string;
  dropdownSettings: any = {};
  jobcarddate = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
  LubeTotal = 0;
  SpareTotal = 0;
  JobTotal = 0;
  LubeTotalFinal = 0;
  SpareTotalFinal = 0;
  JobTotalFinal = 0;
  totalAmount = 0;
  billedAmount = 0;
  advanceAmount = 0;
  discount = 0;
  sGST = 0;
  cGST = 0;
  GST = 0;
  totalPayable = 0;
  totalPaid = 0;
  totalBalance = 0;
  calTotalGstForSpareamount = 0;
  calTotalGstForLubeamount = 0;
  calTotalGstForJobamount = 0;
  settingInven;
  shownegativeinventory: boolean = false;
  negativevalue: string;
  negativearryforspare;
  checkforquantity;
  shownegativeinventoryforlube: boolean = false;
  negativevalueforlube: string;
  negativearryforlube;
  checkforquantityforlube;
  showcalcluationinfo: boolean = false;
  negativevalueforjob: string;
  negativearryforjob;
  checkforquantityforjob;
  eventForDiscount = "%";
  paymentMethod = "";
  Advanceerrors: boolean = false;
  Discounterrors: boolean = false;
  GSTerrors: boolean = false;
  SGSTerrors: boolean = false;
  CGSTerrors: boolean = false;
  Paiderrors: boolean = false;
  showSpareUpdate: boolean = false;
  showLubeUpdate: boolean = false;
  showJobUpdate: boolean = false;
  regex = /^\d+(\.\d{1,2})?$/;
  time = { hour: 13, minute: 30 };
  meridian = true;
  dynamicPartNumber;
  today = new Date();
  totalamountonform = 0;
  toShowcgst = 0;
  toShowsgst = 0;
  toShowtotal_gst = 0;
  showtoupdateform = false;
  customerProfileId;
  customerProfileName;
  customerProfileMobile;
  customerProfileMobile2;
  exitNote = "";
  checqueOrTransticon = "";
  reminderKM;
  reminderperiod;
  deliveryTimeField = "";
  deliveryDateField: any = "";
  deliveryDateFieldForAdd;
  totalamounterror: boolean = false;
  sparegsterror: boolean = false;
  sparelenghtoferror = 0;
  lubegsterror: boolean = false;
  lubelenghtoferror = 0;
  jobgsterror: boolean = false;
  joblenghtoferror = 0;
  assignedMechanicArray = Array();
  mechanicerror: boolean = false;
  ddate: boolean = false;
  dtime: boolean = false;
  validtime: boolean = false;
  ddateenable: boolean = false;
  dtimeenable: boolean = false;
  userworkshopid;
  selectdefaultremonderkm;
  smsAlretValue: boolean = true;
  minDate;
  maxDate;
  startDate;
  todaydob;
  lastdob;
  typeerror: boolean = false;
  makeerror: boolean = false;
  modelerror: boolean = false;
  showpretypeerror: boolean = false;
  showpremaketypeerror: boolean = false;
  showpremakeerror: boolean = false;
  showpremodeltypeerror: boolean = false;
  showpremodelmakeerror: boolean = false;
  showpremodelerror: boolean = false;
  shoeupdate: boolean = false;
  Chequeerror: boolean = false;
  transerror: boolean = false;
  selectedItemOfStaff = Array();
  jobcardEditOrCreate;
  jobcardArrayForEdit;
  jobacrdStatus;

  disableFuelKm = false;
  selectedItemOfSupervisor = "";
  supervisorList = Array();
  customerEditOrCreate;
  createdJobcardSetting: any;
  newregister: boolean = false;
  inputcolor = "#fff";
  totalyclosethejobcard: boolean = false;
  setvechilenumber;
  lubeclass = "totalandname";
  spareclass = "totalandname";
  jobclass = "totalandname totaldivv";
  sparecompanyname: any;
  searchSpareCompany = [];
  lubecompanyname: any;
  searchLubeCompany = [];
  createdAtDate;
  jobduplicate = Array();
  jobsnextpage;
  searchJobDatasec = [];
  alldates: any;
  selectedDate;
  ShoeNextDate: boolean = false;
  ShoePreviousDate: boolean = true;
  dateLength;
  selectedDateIndex;
  historyData: any;
  kmHistory;
  smsHistory;
  Worknotes = Array();
  mechanicData = Array();
  CustomerVoice;
  remiderforsameday;
  reminderKMForHistory;
  jobcardSettingHistory;
  lubesHistoryData;
  spareHistoryData;
  jobHistoryData;
  spareHistoryTotal = 0;
  lubeHistoryTotal = 0;
  jobHistoryTotal = 0;
  satffmasterarr = [];
  dupVehicleType;
  dupSelectedDataarrOfVehicle;
  SelectedDataarrOfVehicle;
  mainVehiclearr = Array();

  SelectedDataarrOfVehiclespl;
  mainVehiclearrspl = Array();
  foralltrue: boolean = false;
  contactlink = "";
  urlgetforonlineclose;
  workshopName;
  phoneNumber;
  onlineenable;
  mainurl = this.abstract.mainurl;
  staffstartDate;
  inventorytypeinven;
  dataofinventory;
  indecofinevntory;
  searchJobDatapaginate = [];
  searchSpareDatapagi = [];
  searchLubeDatapagi = [];
  sparenextpageinven;
  spareduplicateinven = [];
  searchSpareDatasecinven = [];
  searchSpareDatainven = Array();
  searchSpareDatapagiinven = [];
  sparemaster;
  spareworkshop;
  lubeduplicateinven = Array();
  lubenextpageinven;
  searchLubeDatasecinven = [];
  searchLubeDatainven = Array();
  searchLubeDatapagiinven = [];
  lubemaster;
  lubeworkshop;
  jobmaster;
  jobworkshop;
  jobduplicateinven = Array();
  jobsnextpageinven;
  searchJobDatasecinven = [];
  searchJobDatainven = Array();
  searchJobDatapaginateinven = [];
  allSelectedMake = Array();
  dupseletecmodvari = Array();
  searchModelvari = Array();
  vehnextpage;
  searchvehpaginate = Array();
  showjobdiserror: boolean = false;
  jodisvalue = 0;
  showjobdis: boolean = false;
  showjobdisitem: boolean = false;
  showsparediserror: boolean = false;
  spareisvalue = 0;
  showsparedis: boolean = false;
  showsparedisitem: boolean = false;
  showslubediserror: boolean = false;
  lubeisvalue = 0;
  showlubedis: boolean = false;
  showlubedisitem: boolean = false;
  duplicatedisc = 0;
  showdiscountjob: boolean = false;
  reminderArray = Array();
  checkarray = Array();
  spareduplicate = Array();
  sparenextpage;
  searchSpareDatasec = [];
  QuantityObject = Array();
  showdiscountspare: boolean = false;
  mainsparecompanyarrspl = Array();
  mainlubecompanyarrspl = Array();
  lubeduplicate = Array();
  lubenextpage;
  searchLubeDatasec = [];
  showdiscountlube: boolean = false;
  showdisbale: boolean = false;
  reminderOneDate: string;
  reminderOnestatus: string;
  reminderTwoDate: string;
  reminderTwostatus: string;
  reminderthreeDate: string;
  reminderthreetatus: string;
  oldQuantityArray = Array();
  autoTicks = false;
  disabledskide = false;
  max = 100;
  min = 0;
  showTicks = false;
  thumbLabel = true;
  valueset = 30;
  kmvehicleerror: boolean = false;
  kmvehicle = "0";
  regexrkm = /^0|[1-9][0-9]*$/;
  private _tickInterval = 1;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  formatterr = (result: string) => result.toUpperCase();
  vechileResult = (result: string) => result.toUpperCase();
  searchVehicleDataSpl = [];
  itemWiseDiscount;
  currency_symbol: any;
  isShowPartNumber: boolean;

  permitData;
  allow_create_new: boolean = true;
  allow_edit: boolean = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialog: MatDialog,
    public historyService: LasthistoryService,
    public sendPDF: PrintsharepdfService,
    public abstract: AbstractService,
    private config: NgbDatepickerConfig,
    private snakBar: MatSnackBar,
    private showspinner: SpinnerService,
    private general: GeneralService,
    private userService: UserserviceService,
    private formbuild: FormBuilder,
    private dialogservice: DilogOpenService,
    public dialogRef: MatDialogRef<CreateSetReminderComponent>,
    private permit: UserPermissionService
  ) {
    /*check permission of view, create, edit, create new*/
    var isUserLogin = localStorage.getItem("isUserLogin");
    // console.log("isUserLogin", isUserLogin);

    if (isUserLogin == "true") {
      try {
        this.permitData = {};
        permit.getPermissionForComponent("jobcards").subscribe((res) => {
          this.permitData = JSON.parse(res.data["jobcards"]);
          if (this.permitData) {
            if (this.permitData["create_new"] != 1) {
              this.allow_create_new = false;
            }
            if (this.permitData["edit"] != 1) {
              this.allow_edit = false;
            }
          }
        });
      } catch (e) {
        this.permitData = { view: 1 };
      }
    }

    this.jobcardEditOrCreate = data.esitorcreate;
    this.customerEditOrCreate = this.jobcardEditOrCreate;

    //
    if (this.jobcardEditOrCreate == "edit") {
      this.is_set_customer = true;
      this.selectedVehicleCheck = true;
    }
    this.jobcardArrayForEdit = data.jobcardarray;
    this.jobacrdStatus = data.staus;
    if (this.jobacrdStatus == "1" || this.jobacrdStatus == "2") {
      this.disableFuelKm = true;
    }
    this.userworkshopid = this.userService.getData()["workshop_id"];
    this.general.getLInkStatus(this.userworkshopid).subscribe((linkget) => {
      if (linkget.success == true) {
        this.onlineenable = linkget.online_garage;
        this.urlgetforonlineclose =
          "\r\n" +
          "You can book appointment on " +
          this.mainurl +
          "cus/" +
          linkget.url_param;
      } else {
        this.onlineenable = "false";
        this.urlgetforonlineclose = "";
      }
    });
    const current = new Date();
    const oneMonth = new Date();
    this.minDate = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
    this.maxDate = current;
    this.startDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
    this.deliveryDateField = this.maxDate;
    this.deliveryDateFieldForAdd =
      this.maxDate.getFullYear() +
      "-" +
      ("0" + (this.maxDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + this.maxDate.getDate()).slice(-2);
    current.setMinutes(current.getMinutes() + 15);
    this.deliveryTimeField =
      ("0" + current.getHours()).slice(-2) +
      ":" +
      ("0" + current.getMinutes()).slice(-2);
    this.todaydob = current;
    this.lastdob = {
      year: current.getFullYear() - 200,
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
    config.outsideDays = "hidden";
    this.createCustomer();
    this.createSpareForm();
    this.createLubeForm();
    this.createJobForm();
    this.createStaff("none", "none", "none");
  }
  @ViewChild("closebutton", { static: true }) closebutton;
  @ViewChild("instance", { static: true }) instance: NgbTypeahead;
  @ViewChild("element", { static: true }) element: ElementRef;
  @ViewChild("elementofspare", { static: true }) elementofspare: ElementRef;
  @ViewChild("elementoflubecreate", { static: true })
  elementoflubecreate: ElementRef;
  @ViewChild("elementofjobcreate", { static: true })
  elementofjobcreate: ElementRef;
  @ViewChild("elementforjob", { static: true }) elementforjob: ElementRef;
  @ViewChild("elementforlube", { static: true }) elementforlube: ElementRef;
  searchSpare = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) => (term === "" ? this.searchSpareData : this.searchSpareData))
    );
  };
  searchSpareToCreate = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        term === ""
          ? this.searchSpareDataForCreate
          : this.searchSpareDataForCreate
      )
    );
  };
  searchLubeToCreate = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        term === ""
          ? this.searchLubeDataForCreate
          : this.searchLubeDataForCreate
      )
    );
  };
  searchJobToCreate = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        term === "" ? this.searchJobDataForCreate : this.searchJobDataForCreate
      )
    );
  };
  searchLube = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) => (term === "" ? this.searchLubeData : this.searchLubeData))
    );
  };
  searchJob = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) => (term === "" ? this.searchJobData : this.searchJobData))
    );
  };
  searchVechile = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        term === "" ? this.searchVehicleData : this.searchVehicleData
      )
    );
  };
  searchVechilespl = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        term === "" ? this.searchVehicleDataSpl : this.searchVehicleDataSpl
      )
    );
  };
  //Settings API call and Vechile Details API call and created the Jobcard Number
  ngOnInit() {
    this.currency_symbol = glob.currency_symbol;
    this.CreateCustomerForm.controls["vechilenumber"].setValue(
      this.userService.getData()["workshop_rtocode"],
      { onlySelf: true }
    );
    this.createdJobcardSetting = {};
    //console.log(this.userService.getData()["workshop_type"].split(', '))
    this.vechileTypetoshow = [];
    for (
      var i = 0;
      i < this.userService.getData()["workshop_type"].split(",").length;
      i++
    ) {
      if (this.userService.getData()["workshop_type"].split(",")[i] === "1") {
        if (i == 0) {
          this.vechileTypetoshow.push("2");
        } else if (i == 1) {
          this.vechileTypetoshow.push("3");
        } else if (i == 2) {
          this.vechileTypetoshow.push("4");
        } else if (i == 3) {
          this.vechileTypetoshow.push("6");
        }
      }
    }
    // this.getStaff();
    // this.getCustomerVoiceData();
    this.vechileTypetoshow.unshift(this.typemessage);
    this.general.getJobcardSettings(this.userworkshopid).subscribe(
      (settingdata) => {
        this.showspinner.setSpinnerForLogin(true);
        this.settingInven = JSON.parse(
          settingdata.jobcard_Settings.settings_inventory.replace(/\\/g, "")
        );
        var settingBillingDataJson = JSON.parse(
          settingdata.jobcard_Settings.settings_billing.replace(/\\/g, "")
        );
        this.allBillingData = settingBillingDataJson[0];
        if (this.allBillingData != undefined) {
          if (this.jobcardEditOrCreate == "edit") {
            // this.searchVehicleNumber(this.jobcardArrayForEdit.vehicle_number);
            this.searchCustomerEvent(this.jobcardArrayForEdit.vehicle_number);
          }
        }
        if (this.allBillingData.default_running_km.includes("KM") == false) {
          this.reminderKM = this.allBillingData.default_running_km + " KM";
        } else {
          this.reminderKM = this.allBillingData.default_running_km;
        }
        this.reminderperiod = this.allBillingData.default_reminder_period;
        var settingJsonData = JSON.parse(
          settingdata.jobcard_Settings.settings_jobcard.replace(/\\/g, "")
        );
        this.jobcardSettingData = settingJsonData[0];
        if (this.jobcardSettingData.default_mechanic.length == 0) {
          this.jobcardSettingData.default_mechanic = [
            {
              name: this.userService.getData()["name"],
            },
          ];
        }
        this.createdJobcardSetting = this.jobcardSettingData;
        this.itemWiseDiscount = this.createdJobcardSetting.item_wise_discount;
        if (this.jobcardEditOrCreate != "edit") {
          let getYear = settingJsonData[0].year;
          var year = getYear.substr(getYear.length - 4);
          let currenYear = this.date.getFullYear();
          if (currenYear.toString() != year) {
            var alphabet = getYear.split("")[0];
            if (getYear != "") {
              var res =
                alphabet == "z"
                  ? "a"
                  : alphabet == "Z"
                  ? "A"
                  : String.fromCharCode(alphabet.charCodeAt(0) + 1);
              var savYear =
                res +
                getYear.split("")[1] +
                getYear.split("")[2] +
                this.date.getFullYear();
            } else {
              var res = "A";
              let month =
                (this.date.getMonth() + 1).toString().length === 1
                  ? "0" + (this.date.getMonth() + 1)
                  : this.date.getMonth() + 1;
              var savYear = res + month + this.date.getFullYear();
            }
            this.yearForJobcard = res;
            this.general.saveYear(this.userworkshopid, savYear).subscribe(
              (savedata) => {
                this.showspinner.setSpinnerForLogin(true);
                this.snakBar.open("Year Saved", "", {
                  duration: 1000,
                });
                this.showspinner.setSpinnerForLogin(false);
              },
              (err) => {
                this.showspinner.setSpinnerForLogin(false);
                this.snakBar.open("err", ErrorMessgae[0][err], {
                  duration: 4000,
                });
              }
            );
          } else {
            this.yearForJobcard = getYear.split("")[0];
            // this.snakBar.open("Year Matched", "", {
            //   duration: 1000
            // })
            this.showspinner.setSpinnerForLogin(false);
          }
          if (settingJsonData[0].jobcard_no_series_count.length == 1) {
            settingJsonData[0].jobcard_no_series_count =
              "00" + settingJsonData[0].jobcard_no_series_count;
          } else if (settingJsonData[0].jobcard_no_series_count.length == 2) {
            settingJsonData[0].jobcard_no_series_count =
              "0" + settingJsonData[0].jobcard_no_series_count;
          } else {
            settingJsonData[0].jobcard_no_series_count =
              settingJsonData[0].jobcard_no_series_count;
          }
          if (settingJsonData[0].custom_jobcard_number == "0") {
            let month =
              (this.date.getMonth() + 1).toString().length === 1
                ? "0" + (this.date.getMonth() + 1)
                : this.date.getMonth() + 1;
            this.jocardnumber =
              this.yearForJobcard +
              ("0" + month).slice(-2).toString() +
              ("0" + this.date.getDate()).slice(-2).toString() +
              "-" +
              settingJsonData[0].jobcard_no_series_count;
            this.showspinner.setSpinnerForLogin(false);
          } else {
            let month =
              (this.date.getMonth() + 1).toString().length === 1
                ? "0" + (this.date.getMonth() + 1)
                : this.date.getMonth() + 1;
            this.jocardnumber =
              this.yearForJobcard +
              ("0" + month).slice(-2).toString() +
              ("0" + this.date.getDate()).slice(-2).toString() +
              "-C" +
              settingJsonData[0].jobcard_no_series_count;
            this.showspinner.setSpinnerForLogin(false);
          }
        }
      },
      (err) => {
        this.showspinner.setSpinnerForLogin(false);
        this.snakBar.open("Error", ErrorMessgae[0][err], {
          duration: 4000,
        });
      }
    );
    // this.general.getMakeModel().subscribe(tyepData=>{
    //   this.showspinner.setSpinnerForLogin(true)
    //   if(tyepData["success"]==true){
    //     this.allVechileTypes=tyepData["vhicledetails"]

    //     this.CreateCustomerForm.controls["type"].setValue(this.vechileTypetoshow[0],{onlySelf:true})
    //     this.CreateCustomerForm.controls["make"].setValue(this.vechileMake[0],{onlySelf:true})
    //     this.CreateCustomerForm.controls["model"].setValue(this.vechileModel[0],{onlySelf:true})
    //     this.CreateCustomerForm.controls["varri"].setValue(this.vechileVarriant[0],{onlySelf:true})
    //     this.showspinner.setSpinnerForLogin(false)
    //   }else{
    //     this.showspinner.setSpinnerForLogin(false)
    //     this.snakBar.open("No Data", "", {
    //       duration: 4000
    //     })
    //   }
    // },err=>{
    //   this.showspinner.setSpinnerForLogin(false)
    //   this.snakBar.open("Error", ErrorMessgae[0][err], {
    //     duration: 4000
    //   })
    // })
  }

  /*check permission func of view, create, edit, create new ..... start*/
  event_handler_update() {
    var isUserLogin = localStorage.getItem("isUserLogin");
    if (isUserLogin == "true") {
      this.snakBar.open("Access denied, Please call admin.", "", {
        duration: 4000,
      });
      return false;
    }
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
  /*check permission  func of view, create, edit, create new ..... end*/

  get tickInterval(): number | "auto" {
    return this.showTicks ? (this.autoTicks ? "auto" : this._tickInterval) : 0;
  }
  set tickInterval(value) {
    this._tickInterval = coerceNumberProperty(value);
  }
  onSliderChange(event: MatSliderChange) {
    console.log("ok");
  }
  onKmChange(event) {
    if (this.regexrkm.test(event) == false) {
      this.kmvehicleerror = true;
    } else {
      this.kmvehicleerror = false;
      this.kmvehicle = event;
    }
  }
  //---------------------------CUSTOMER FORM--------------------------------------------------------
  // Customer form with validations
  createCustomer() {
    this.CreateCustomerForm = this.formbuild.group({
      vechilenumber: [
        "",
        [
          Validators.required,
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
      ],
      customername: ["", Validators.required],
      searchVehicle: [""],
      chassisnumber: [""],
      mobileOneNo: [
        "",
        [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],
      ],
      mobileTwoNo: ["", Validators.pattern(/^[6-9]\d{9}$/)],
      email: ["", [Validators.email]],
      dropaddress: [""],
      pickupaddress: [""],
      varri: [null],
      dob: [null],
      type: [null],
      model: [null],
      make: [null],
      enginenumber: [""],
      color: [""],
      kmread: [""],
      drivername: [""],
      gstno: [""],
      driverno: ["", Validators.pattern(/^[6-9]\d{9}$/)],
      twowheetertype: [""],
    });
  }
  //API call to Create New Customer
  createCustomerByAPI() {
    this.is_set_customer = true;
    this.closebutton.nativeElement.click();
    this.SelectedDataarrOfVehicle = this.dupSelectedDataarrOfVehicle;
    this.CreateCustomerForm.controls["twowheetertype"].setValue(
      this.dupVehicleType,
      { onlySelf: true }
    );
    this.CreateCustomerForm.value.twowheetertype = this.dupVehicleType;

    if (this.CreateCustomerForm.value.mobileOneNo == "") {
      this.CreateCustomerForm.value.mobileOneNo = 0;
    } else {
      this.CreateCustomerForm.value.mobileOneNo = parseInt(
        this.CreateCustomerForm.value.mobileOneNo
      );
    }
    if (this.CreateCustomerForm.value.mobileTwoNo == "") {
      this.CreateCustomerForm.value.mobileTwoNo = 0;
    } else {
      this.CreateCustomerForm.value.mobileTwoNo = parseInt(
        this.CreateCustomerForm.value.mobileTwoNo
      );
    }
    if (this.CreateCustomerForm.value.driverno == "") {
      this.CreateCustomerForm.value.driverno = 0;
    } else {
      this.CreateCustomerForm.value.driverno = parseInt(
        this.CreateCustomerForm.value.driverno
      );
    }
    if (this.CreateCustomerForm.value.dob == null) {
      this.CreateCustomerForm.value.dob = "";
    } else {
      var dateDob = new Date(this.CreateCustomerForm.value.dob);
      this.CreateCustomerForm.value.dob =
        dateDob.getFullYear() +
        "-" +
        ("0" + (dateDob.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + dateDob.getDate()).slice(-2);
    }
    if (this.samePickup == true) {
      this.CreateCustomerForm.value.dropaddress =
        this.CreateCustomerForm.value.pickupaddress;
    }
    if (this.getColor == undefined) {
      this.getColor = "#ffffff";
    }
    if (this.CreateCustomerForm.value.varri == this.varrimessage) {
      this.CreateCustomerForm.value.varri = "";
    }
    this.general
      .saveCustomerProfile(
        "create",
        this.CreateCustomerForm.value.vechilenumber,
        this.CreateCustomerForm.value.chassisnumber,
        this.SelectedDataarrOfVehicle.vehicle_type,
        this.SelectedDataarrOfVehicle.make,
        this.SelectedDataarrOfVehicle.model,
        this.SelectedDataarrOfVehicle.variant,
        this.CreateCustomerForm.value.customername,
        this.CreateCustomerForm.value.mobileOneNo,
        this.CreateCustomerForm.value.mobileTwoNo,
        this.CreateCustomerForm.value.email,
        this.CreateCustomerForm.value.dob,
        this.CreateCustomerForm.value.pickupaddress,
        this.CreateCustomerForm.value.dropaddress,
        this.CreateCustomerForm.value.enginenumber,
        this.getColor,
        this.CreateCustomerForm.value.drivername,
        this.CreateCustomerForm.value.driverno,
        this.CreateCustomerForm.value.gstno,
        this.CreateCustomerForm.value.kmread,
        this.userworkshopid
      )
      .subscribe(
        (saveCustomer) => {
          this.showspinner.setSpinnerForLogin(true);
          if (saveCustomer.success == true) {
            this.customerProfileId = saveCustomer.customer.id;
            this.customerProfileName = saveCustomer.customer.customer_name;
            this.customerProfileMobile = saveCustomer.customer.customer_mobile;
            this.customerProfileMobile2 =
              saveCustomer.customer.customer_mobile_2;
            this.snakBar.open("Customer Data Saved", "", {
              duration: 4000,
            });
            this.setvechilenumber = this.CreateCustomerForm.value.vechilenumber;
            this.shoeupdate = false;
            this.showdisbale = true;

            // this.inputcolor = "#d2d0d0";
            // this.CreateCustomerForm.controls["vechilenumber"].disable();
            // this.CreateCustomerForm.controls["chassisnumber"].disable();
            // this.CreateCustomerForm.controls["customername"].disable();
            // this.CreateCustomerForm.controls["mobileOneNo"].disable();
            // this.CreateCustomerForm.controls["searchVehicle"].disable();
            // this.CreateCustomerForm.controls["mobileTwoNo"].disable();
            // this.CreateCustomerForm.controls["kmread"].disable();
            // this.CreateCustomerForm.controls["email"].disable();
            // this.CreateCustomerForm.controls["dob"].disable();
            // this.CreateCustomerForm.controls["pickupaddress"].disable();
            // this.CreateCustomerForm.controls["dropaddress"].disable();
            // this.CreateCustomerForm.controls["enginenumber"].disable();
            // this.CreateCustomerForm.controls["color"].disable();
            // this.CreateCustomerForm.controls["drivername"].disable();
            // this.CreateCustomerForm.controls["driverno"].disable();
            // this.CreateCustomerForm.controls["gstno"].disable();
            // this.showspinner.setSpinnerForLogin(false);

            this.searchCustomerEvent("by_id");
          } else {
            this.snakBar.open("Error", ErrorMessgae[0]["message"], {
              duration: 4000,
            });
          }
        },
        (err) => {
          this.showspinner.setSpinnerForLogin(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
    this.showInvoiceForm = true;
    this.getCustomerVoiceData();
  }
  // COlor box while Createing New customer
  openColorBox() {
    this.dialogservice.OpenColorPicker("OPen Picker").subscribe((colorData) => {
      this.getColor = colorData;
    });
  }
  // Validation for Vechile nUmber and chassis number
  checkNewregister(values: any) {
    if (values.currentTarget.checked == true) {
      this.showVechileNo = true;
      this.setValidators(true);
    } else {
      this.showVechileNo = false;
      this.setValidators(false);
    }
  }
  // Validation for Vechile nUmber and chassis number
  setValidators(falg) {
    const vechileNo = this.CreateCustomerForm.get("vechilenumber");
    const chassisNo = this.CreateCustomerForm.get("chassisnumber");
    if (falg == true) {
      this.showVechileNo = true;
      chassisNo.setValidators([Validators.required]);
      vechileNo.setValidators(null);
      this.CreateCustomerForm.controls["vechilenumber"].setValue("", {
        onlySelf: true,
      });
    } else {
      this.showVechileNo = false;
      chassisNo.setValidators(null);
      vechileNo.setValidators([
        Validators.required,
        Validators.pattern(
          "^([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{1}[0-9]{4})|" +
            "^([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{1}[0-9]{4})|" +
            "([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{1}[0-9]{3})|([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{4})|" +
            "([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{3})|([a-zA-Z]{2}[0-9]{2}[-]{1}[0-9]{4})|" +
            "([a-zA-Z]{2}[0-9]{2}[-]{1}[0-9]{3})|([a-zA-Z]{3}[0-9]{4})|([a-zA-Z]{3}[0-9]{3})|" +
            "([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{3}[0-9]{4})|([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{3}[0-9]{3})|" +
            "([a-zA-Z]{2}[0-9]{3}[a-zA-Z]{1}[0-9]{4})$"
        ),
      ]);
      this.CreateCustomerForm.controls["vechilenumber"].setValue(
        this.userService.getData()["workshop_rtocode"],
        { onlySelf: true }
      );
    }
  }
  // MAke Pick and drop address same if selected
  sameAsPickupAddress(values: any) {
    if (values.currentTarget.checked == true) {
      this.samePickup = true;
    } else {
      this.samePickup = false;
    }
  }
  // Show Vechile and chssis number input filed
  showInputField() {
    this.showInput = true;
  }
  // Cllose Vechile and chssis number input filed
  closeInputField() {
    this.showInput = false;
  }

  // **********************************here********************
  checkVehicleNumber(event) {
    if (this.jobcardEditOrCreate == "edit") {
      if (event != this.jobcardArrayForEdit.vehicle_number) {
        this.general
          .searchCustomers(this.userworkshopid, event, "other")
          .subscribe((customerDetail) => {
            
            if (customerDetail.success == true) {
             
              this.existing_customer = customerDetail.data[0].customer_name;
              this.entered_number_valid = false;

             

            } else {
              this.entered_number_valid = true;
            }
          });
      }
      this.entered_number_valid = true;
    } else if (this.jobcardEditOrCreate == "create") {
      this.general
        .searchCustomers(this.userworkshopid, event, "other")
        .subscribe((customerDetail) => {
          if (customerDetail.success == true) {
            this.existing_customer = customerDetail.data[0].customer_name;
            this.entered_number_valid = false;

            this.snakBar.open(
              "Message",
              `Vehicle Already Registered, By User: ${this.existing_customer}`,
              {
                duration: 14000,
              }
            );
          } else {
            this.entered_number_valid = true;
          }
        });
    }
  }
  setCustomerFormOnEdit() {
    this.CreateCustomerForm.controls["vechilenumber"].setValue(
      this.selectedCustomer.vehicle_number,
      {
        onlySelf: true,
      }
    );
    this.CreateCustomerForm.value.vechilenumber =
      this.selectedCustomer.vehicle_number;
    this.CreateCustomerForm.controls["chassisnumber"].setValue(
      this.selectedCustomer.chassis_number,
      {
        onlySelf: true,
      }
    );
    this.CreateCustomerForm.value.chassisnumber =
      this.selectedCustomer.chassis_number;

    this.CreateCustomerForm.controls["customername"].setValue(
      this.selectedCustomer.customer_name,
      { onlySelf: true }
    );
    this.CreateCustomerForm.controls["mobileOneNo"].setValue(
      this.selectedCustomer.customer_mobile,
      { onlySelf: true }
    );
    this.CreateCustomerForm.controls["mobileTwoNo"].setValue(
      this.selectedCustomer.customer_mobile_2,
      { onlySelf: true }
    );

    this.CreateCustomerForm.controls["email"].setValue(
      this.selectedCustomer.customer_email,
      { onlySelf: true }
    );

    this.CreateCustomerForm.controls["pickupaddress"].setValue(
      this.selectedCustomer.pick_up_address,
      {
        onlySelf: true,
      }
    );
    this.CreateCustomerForm.controls["dropaddress"].setValue(
      this.selectedCustomer.drop_address,
      { onlySelf: true }
    );
    this.CreateCustomerForm.controls["enginenumber"].setValue(
      this.selectedCustomer.engine_number,
      { onlySelf: true }
    );
    if (this.selectedCustomer.vehicle_color != 0) {
      this.getColor = this.selectedCustomer.vehicle_color;
      //this.CreateCustomerForm.controls["color"].setValue(this.selectedCustomer.vehicle_color,{onlySelf:true})
    }
    this.CreateCustomerForm.controls["drivername"].setValue(
      this.selectedCustomer.driver_name,
      { onlySelf: true }
    );
    if (this.selectedCustomer.driver_mobile != 0) {
      this.CreateCustomerForm.controls["driverno"].setValue(
        this.selectedCustomer.driver_mobile,
        { onlySelf: true }
      );
    }
    this.CreateCustomerForm.controls["gstno"].setValue(
      this.selectedCustomer.gst_number,
      { onlySelf: true }
    );
    this.CreateCustomerForm.controls["kmread"].setValue(
      this.selectedCustomer.km_read,
      { onlySelf: true }
    );
  }

  searchCustomerEvent(event) {
    var mode;
    var parameter;
    // if (this.jobcardEditOrCreate == "create") {
    //   mode = "by_vehicle";
    //   parameter = event;
    // }
    if (this.jobcardEditOrCreate == "create") {
      mode = "by_id";
      parameter = this.customerProfileId;
    } else {
      mode = "by_id";
      parameter = this.jobcardArrayForEdit.workshop_customer_id;
    }
    this.general
      .searchCustomers(this.userworkshopid, parameter, mode)
      .subscribe(
        (customerDetail) => {
          this.showspinner.setSpinnerForLogin(true);
          if (this.jobcardEditOrCreate != "edit") {
            if (event == "") {
              this.showdisable = false;
            } else {
              this.showdisable = true;
            }
          }
          if (customerDetail.success == true) {
            this.selectedCustomer = customerDetail.customer;

            if (this.jobcardEditOrCreate == "edit") {
              this.general
                .lastHistoryJobcard(this.userworkshopid, event)
                .subscribe((vehicleIs) => {
                  if (
                    vehicleIs.success == true &&
                    vehicleIs.jobcard_status === 2
                  ) {
                    this.dialogservice
                      .OpenLastHistory(vehicleIs, vehicleIs.jobcard_status)
                      .subscribe(() => {
                        console.log("dialog", vehicleIs);
                      });
                  }
                });
            }
            this.askForUpadte = true;
            //this.shoeupdate=true
            this.customerProfileId = customerDetail.customer.id;
            this.customerProfileName = customerDetail.customer.customer_name;
            this.customerProfileMobile =
              customerDetail.customer.customer_mobile;
            this.customerProfileMobile2 =
              customerDetail.customer.customer_mobile_2;
            this.CreateCustomerForm.controls["vechilenumber"].setValue(
              customerDetail.customer.vehicle_number,
              {
                onlySelf: true,
              }
            );
            // this.CreateCustomerForm.value.vechilenumber = event;
            // this.setvechilenumber = event;
            this.CreateCustomerForm.value.vechilenumber =
              customerDetail.customer.vehicle_number;
            this.setvechilenumber = customerDetail.customer.vehicle_number;
            this.CreateCustomerForm.controls["chassisnumber"].setValue(
              customerDetail.customer.chassis_number,
              { onlySelf: true }
            );
            this.CreateCustomerForm.value.chassisnumber =
              customerDetail.customer.chassis_number;
            this.SelectedDataarrOfVehicle = {
              vehicle_type: customerDetail.customer.vehicle_type,
              make: customerDetail.customer.vehicle_make,
              model: customerDetail.customer.vehicle_model,
              variant: customerDetail.customer.vehicle_variant,
            };
            // if(customerDetail.customer.vehicle_type==""){
            //   this.CreateCustomerForm.controls["type"].setValue(this.vechileTypetoshow[0],{onlySelf:true})
            // }else{
            //   this.checkvtypearr(this.vechileTypetoshow,true)
            //   this.CreateCustomerForm.controls["type"].setValue(customerDetail.customer.vehicle_type,{onlySelf:true})
            //   this.CreateCustomerForm.value.type=customerDetail.customer.vehicle_type
            // }
            // if(customerDetail.customer.vehicle_make==""){
            //   this.CreateCustomerForm.controls["make"].setValue(this.vechileMake[0],{onlySelf:true})
            // }else{
            //   this.CreateCustomerForm.controls["make"].setValue(customerDetail.customer.vehicle_make,{onlySelf:true})
            //   this.CreateCustomerForm.value.make=customerDetail.customer.vehicle_make
            // }
            // if(customerDetail.customer.vehicle_model==""){
            //   this.CreateCustomerForm.controls["model"].setValue(this.vechileModel[0],{onlySelf:true})
            // }else{
            //   this.CreateCustomerForm.controls["model"].setValue(customerDetail.customer.vehicle_model,{onlySelf:true})
            //   this.CreateCustomerForm.value.model=customerDetail.customer.vehicle_model
            // }
            // if(customerDetail.customer.vehicle_variant==""){
            //   this.CreateCustomerForm.controls["varri"].setValue(this.vechileVarriant[0],{onlySelf:true})
            // }else{
            //   this.CreateCustomerForm.controls["varri"].setValue(customerDetail.customer.vehicle_variant,{onlySelf:true})
            //   this.CreateCustomerForm.value.varri=customerDetail.customer.vehicle_variant
            // }

            this.vehiclesearchmodel =
              this.SelectedDataarrOfVehicle.make +
              " " +
              this.SelectedDataarrOfVehicle.model +
              " " +
              this.SelectedDataarrOfVehicle.variant;

            this.CreateCustomerForm.controls["customername"].setValue(
              customerDetail.customer.customer_name,
              { onlySelf: true }
            );
            this.CreateCustomerForm.controls["mobileOneNo"].setValue(
              customerDetail.customer.customer_mobile,
              { onlySelf: true }
            );
            this.CreateCustomerForm.controls["mobileOneNo"].setValue(
              customerDetail.customer.customer_mobile,
              { onlySelf: true }
            );
            if (customerDetail.customer.customer_mobile_2 != 0) {
              this.CreateCustomerForm.controls["mobileTwoNo"].setValue(
                customerDetail.customer.customer_mobile_2,
                { onlySelf: true }
              );
            }
            this.CreateCustomerForm.controls["email"].setValue(
              customerDetail.customer.customer_email,
              { onlySelf: true }
            );
            if (customerDetail.customer.customer_dob != "") {
              this.dateOfBirth = new Date(customerDetail.customer.customer_dob);
            }
            this.CreateCustomerForm.controls["pickupaddress"].setValue(
              customerDetail.customer.pick_up_address,
              { onlySelf: true }
            );
            this.CreateCustomerForm.controls["dropaddress"].setValue(
              customerDetail.customer.drop_address,
              { onlySelf: true }
            );
            this.CreateCustomerForm.controls["enginenumber"].setValue(
              customerDetail.customer.engine_number,
              { onlySelf: true }
            );
            if (customerDetail.customer.vehicle_color != 0) {
              this.getColor = customerDetail.customer.vehicle_color;
              //this.CreateCustomerForm.controls["color"].setValue(customerDetail.customer.vehicle_color,{onlySelf:true})
            }
            this.CreateCustomerForm.controls["drivername"].setValue(
              customerDetail.customer.driver_name,
              { onlySelf: true }
            );
            if (customerDetail.customer.driver_mobile != 0) {
              this.CreateCustomerForm.controls["driverno"].setValue(
                customerDetail.customer.driver_mobile,
                { onlySelf: true }
              );
            }
            this.CreateCustomerForm.controls["gstno"].setValue(
              customerDetail.customer.gst_number,
              { onlySelf: true }
            );
            this.CreateCustomerForm.controls["kmread"].setValue(
              customerDetail.customer.km_read,
              { onlySelf: true }
            );
            this.showInvoiceForm = true;
            // if(this.jobcardEditOrCreate=='edit'){
            //   if(this.jobcardArrayForEdit.vehicle_details.type==undefined){
            //     this.allVechileTypes.filter(eventfortype=>{
            //       if(this.jobcardArrayForEdit.vehicle_details.vehicle_make==eventfortype.make && this.jobcardArrayForEdit.vehicle_details.vehicle_model==eventfortype.model){
            //         this.CreateCustomerForm.controls["type"].setValue(eventfortype.vehicle_type,{onlySelf:true})
            //         this.CreateCustomerForm.value.type=eventfortype.vehicle_type
            //       }
            //     })
            //   }else{
            //     this.CreateCustomerForm.controls["type"].setValue(this.jobcardArrayForEdit.vehicle_details.type,{onlySelf:true})
            //     this.CreateCustomerForm.value.type=this.jobcardArrayForEdit.vehicle_details.type
            //   }
            //   this.CreateCustomerForm.controls["make"].setValue(this.jobcardArrayForEdit.vehicle_details.vehicle_make,{onlySelf:true})
            //   this.CreateCustomerForm.value.make=this.jobcardArrayForEdit.vehicle_details.vehicle_make
            //   this.CreateCustomerForm.controls["model"].setValue(this.jobcardArrayForEdit.vehicle_details.vehicle_model,{onlySelf:true})
            //   this.CreateCustomerForm.value.model=this.jobcardArrayForEdit.vehicle_details.vehicle_model
            //   if(this.jobcardArrayForEdit.vehicle_details.vehicle_variant==""){
            //     this.CreateCustomerForm.controls["varri"].setValue(this.varrimessage,{onlySelf:true})
            //     this.CreateCustomerForm.value.varri=this.varrimessage
            //   }else{
            //     this.CreateCustomerForm.controls["varri"].setValue(this.jobcardArrayForEdit.vehicle_details.vehicle_variant,{onlySelf:true})
            //     this.CreateCustomerForm.value.varri=this.jobcardArrayForEdit.vehicle_details.vehicle_variant
            //   }
            // }
            // if(this.CreateCustomerForm.value.type=='2'){
            //   this.allVechileTypes.filter(eventaa=>{
            //     if(this.CreateCustomerForm.value.varri==this.varrimessage){
            //       if(eventaa.make==this.CreateCustomerForm.value.make && eventaa.model==this.CreateCustomerForm.value.model && eventaa.variant==""){
            //         this.CreateCustomerForm.controls["twowheetertype"].setValue(eventaa.type,{onlySelf:true})
            //         this.CreateCustomerForm.value.twowheetertype=eventaa.type
            //       }
            //     }else{
            //       if(this.CreateCustomerForm.value.varri!=null){
            //         if(eventaa.make==this.CreateCustomerForm.value.make && eventaa.model==this.CreateCustomerForm.value.model&& eventaa.variant==this.CreateCustomerForm.value.varri){
            //           this.CreateCustomerForm.controls["twowheetertype"].setValue(eventaa.type,{onlySelf:true})
            //           this.CreateCustomerForm.value.twowheetertype=eventaa.type
            //         }
            //       }else{
            //         if(eventaa.make==this.CreateCustomerForm.value.make && eventaa.model==this.CreateCustomerForm.value.model){
            //           this.CreateCustomerForm.controls["twowheetertype"].setValue(eventaa.type,{onlySelf:true})
            //           this.CreateCustomerForm.value.twowheetertype=eventaa.type
            //         }
            //       }
            //     }
            //   })
            // }
            this.showdisbale = true;
            this.shoeupdate = false;

            // this.inputcolor = "#d2d0d0";
            // this.CreateCustomerForm.controls["vechilenumber"].disable();
            // this.CreateCustomerForm.controls["chassisnumber"].disable();
            // this.CreateCustomerForm.controls["customername"].disable();
            // this.CreateCustomerForm.controls["mobileOneNo"].disable();
            // this.CreateCustomerForm.controls["searchVehicle"].disable();
            // this.CreateCustomerForm.controls["mobileTwoNo"].disable();
            // this.CreateCustomerForm.controls["kmread"].disable();
            // this.CreateCustomerForm.controls["email"].disable();
            // this.CreateCustomerForm.controls["dob"].disable();
            // this.CreateCustomerForm.controls["pickupaddress"].disable();
            // this.CreateCustomerForm.controls["dropaddress"].disable();
            // this.CreateCustomerForm.controls["enginenumber"].disable();
            // this.CreateCustomerForm.controls["color"].disable();
            // this.CreateCustomerForm.controls["drivername"].disable();
            // this.CreateCustomerForm.controls["driverno"].disable();
            // this.CreateCustomerForm.controls["gstno"].disable();

            if (this.jobcardEditOrCreate == "edit") {
              const dateForDiff = new Date();
              if (this.jobcardArrayForEdit.closed_date.length == 10) {
                var date1 = new Date(
                  this.jobcardArrayForEdit.closed_date.replace(/-0+/g, "/")
                );
              } else {
                var date1 = new Date(
                  this.jobcardArrayForEdit.closed_date
                    .split(" ")[0]
                    .replace(/-0+/g, "/")
                );
              }
              const date2 = new Date(
                dateForDiff.getFullYear() +
                  "-" +
                  (dateForDiff.getMonth() + 1) +
                  "-" +
                  dateForDiff.getDate()
              );
              const utc1 = Date.UTC(
                date1.getFullYear(),
                date1.getMonth(),
                date1.getDate()
              );
              const utc2 = Date.UTC(
                date2.getFullYear(),
                date2.getMonth(),
                date2.getDate()
              );
              const _MS_PER_DAY = 1000 * 60 * 60 * 24;
              const diffDays = Math.floor((utc2 - utc1) / _MS_PER_DAY);
              if (diffDays > 3) {
                this.totalyclosethejobcard = false;
                this.disabledskide = false;
              } else {
                this.totalyclosethejobcard = false;
              }
              if (this.jobcardArrayForEdit.sms_alert == "true") {
                this.general
                  .getRemindersOfJobcard(
                    this.userworkshopid,
                    this.jobcardArrayForEdit.jobcard_number
                  )
                  .subscribe((reminders) => {
                    this.showspinner.setSpinnerForLogin(true);
                    if (reminders.success == true) {
                      this.showspinner.setSpinnerForLogin(false);
                      if (
                        reminders.reminders[0].reminder_priority.toLowerCase() ==
                        "servicing"
                      ) {
                        reminders.reminders.map((data) => {
                          if (data.message.includes("is due for")) {
                            this.reminderOneDate = data.date;
                            this.reminderOnestatus = data.status;
                          }
                          if (data.message.includes("Today")) {
                            this.reminderTwoDate = data.date;
                            this.reminderTwostatus = data.status;
                          }
                          if (data.message.includes("was due for")) {
                            this.reminderthreeDate = data.date;
                            this.reminderthreetatus = data.status;
                          }
                        });
                      } else if (
                        reminders.reminders[0].reminder_priority.toLowerCase() ==
                        "washing"
                      ) {
                        reminders.reminders.map((datanew) => {
                          if (datanew.message.includes("Today")) {
                            this.reminderOneDate = datanew.date;
                            this.reminderOnestatus = datanew.status;
                          }
                          if (datanew.message.includes("was due for")) {
                            this.reminderthreeDate = datanew.date;
                            this.reminderthreetatus = datanew.status;
                          }
                        });
                      } else if (
                        reminders.reminders[0].reminder_priority.toLowerCase() ==
                        "general_repair"
                      ) {
                        if (
                          reminders.reminders[0].message.includes(
                            "experience with us"
                          )
                        ) {
                          this.reminderOneDate = reminders.reminders[0].date;
                          this.reminderOnestatus =
                            reminders.reminders[0].status;
                        }
                      } else if (
                        reminders.reminders[0].reminder_priority.toLowerCase() ==
                        "wheel_alignment"
                      ) {
                        reminders.reminders.map((dataallnew) => {
                          if (dataallnew.message.includes("Today")) {
                            this.reminderOneDate = dataallnew.date;
                            this.reminderOnestatus = dataallnew.status;
                          }
                          if (dataallnew.message.includes("was due for")) {
                            this.reminderthreeDate = dataallnew.date;
                            this.reminderthreetatus = dataallnew.status;
                          }
                        });
                      }
                    } else {
                      this.showspinner.setSpinnerForLogin(false);
                      this.snakBar.open(
                        "Message",
                        ErrorMessgae[0][reminders.message],
                        {
                          duration: 4000,
                        }
                      );
                    }
                  });
              }
              this.createdAtDate = new Date(
                this.jobcardArrayForEdit.created_at
              );
              this.createdAtDate.setHours(this.createdAtDate.getHours() + 5);
              this.createdAtDate.setMinutes(
                this.createdAtDate.getMinutes() + 30
              );
              this.jocardnumber = this.jobcardArrayForEdit.jobcard_number;
              this.reminderKM = this.jobcardArrayForEdit.after_km;
              this.kmvehicle = this.jobcardArrayForEdit.km;
              this.valueset = this.jobcardArrayForEdit.fuel;

              this.selectedItemOfSupervisor =
                this.jobcardArrayForEdit.supervisor;
              if (
                this.allBillingData.default_reminder_period !=
                this.jobcardArrayForEdit.reminder
              ) {
                this.allBillingData.default_reminder_period =
                  this.jobcardArrayForEdit.reminder;
                this.reminderperiod = this.jobcardArrayForEdit.reminder;
              } else {
                this.reminderperiod =
                  this.allBillingData.default_reminder_period;
              }
              this.customerProfileId =
                this.jobcardArrayForEdit.workshop_customer_id;
              this.jobcarddate =
                this.jobcardArrayForEdit.created_at.split(" ")[0];
              this.sparedatatabel = JSON.parse(
                this.jobcardArrayForEdit.jobcard_spare_items
              );
              if (this.sparedatatabel.length != 0) {
                this.duplicateSpare = this.sparedatatabel;
                this.SpareTotal = this.calculateresult(this.sparedatatabel);
                this.SpareTotalFinal = this.calculateresultfinal(
                  this.sparedatatabel
                );
                this.calTotalGstForSpareamount = this.calTotalGstForSpare(
                  this.sparedatatabel
                );
              }
              this.lubedatatabel = JSON.parse(
                this.jobcardArrayForEdit.jobcard_lubes_items
              );
              if (this.lubedatatabel.length != 0) {
                this.duplicateLube = this.lubedatatabel;
                this.LubeTotal = this.calculateresult(this.lubedatatabel);
                this.LubeTotalFinal = this.calculateresultfinal(
                  this.lubedatatabel
                );
                this.calTotalGstForLubeamount = this.calTotalGstForLube(
                  this.lubedatatabel
                );
              }
              if (this.sparedatatabel.length != 0) {
                this.sparedatatabel.map((spareData) => {
                  spareData.totalitemamount = this.getTotalAmountEditTime(
                    spareData,
                    "1",
                    "job"
                  );
                  this.oldQuantityArray.push({
                    partnumber: spareData.part_number,
                    quantity: spareData.quantity,
                  });
                });
              }
              if (this.lubedatatabel.length != 0) {
                this.lubedatatabel.map((lubeData) => {
                  lubeData.totalitemamount = this.getTotalAmountEditTime(
                    lubeData,
                    "1",
                    "job"
                  );
                  this.oldQuantityArray.push({
                    partnumber: lubeData.part_number,
                    quantity: lubeData.quantity,
                  });
                });
              }
              this.jobdatatabel = JSON.parse(
                this.jobcardArrayForEdit.jobcard_job_items
              );
              if (this.jobdatatabel.length != 0) {
                this.duplicateJob = this.jobdatatabel;
                this.JobTotal = this.calculateresult(this.jobdatatabel);
                this.JobTotalFinal = this.calculateresultfinal(
                  this.jobdatatabel
                );
                this.calTotalGstForJobamount = this.calTotalGstForJob(
                  this.jobdatatabel
                );
                this.jobdatatabel.map((getmaster) => {
                  getmaster.totalitemamount = this.getTotalAmountEditTime(
                    getmaster,
                    "1",
                    "job"
                  );
                  if (getmaster.is_master == "True") {
                    this.checkarray.push(getmaster.part_name);
                  }
                });
              }
              this.totalAmount = Number(this.jobcardArrayForEdit.total_amount);
              this.advanceAmount = Number(this.jobcardArrayForEdit.advance);
              this.discount = Number(
                this.jobcardArrayForEdit.discount.split(" ")[0]
              );
              this.eventForDiscount =
                this.jobcardArrayForEdit.discount.split(" ")[1];
              this.totalPayable = Number(this.jobcardArrayForEdit.final_amount);
              this.totalPaid = Number(this.jobcardArrayForEdit.paid_amount);
              this.totalBalance = Number(
                this.jobcardArrayForEdit.balance_amount
              );
              this.billedAmount =
                Number(this.jobcardArrayForEdit.final_amount) -
                Number(this.jobcardArrayForEdit.paid_amount);
              this.paymentMethod = this.jobcardArrayForEdit.payment_mode;
              this.checqueOrTransticon = this.jobcardArrayForEdit.cheque;
              this.createdJobcardSetting = JSON.parse(
                this.jobcardArrayForEdit.settings_data_json
              );
              if (!this.createdJobcardSetting.item_wise_discount) {
                this.createdJobcardSetting["item_wise_discount"] =
                  this.jobcardSettingData.item_wise_discount;
                JSON.parse(this.jobcardArrayForEdit.settings_data_json)[
                  "item_wise_discount"
                ] = this.jobcardSettingData.item_wise_discount;
                if (this.sparedatatabel.length != 0) {
                  this.sparedatatabel.map((spareData) => {
                    if (!spareData.discounttype) {
                      spareData.discounttype = "₹";
                      spareData.discountvalue = "0";
                    }
                  });
                } //discountvalue
                if (this.lubedatatabel.length != 0) {
                  this.lubedatatabel.map((lubeData) => {
                    if (!lubeData.discounttype) {
                      lubeData.discounttype = "₹";
                      lubeData.discountvalue = "0";
                    }
                  });
                }
                if (this.jobdatatabel.length != 0) {
                  this.jobdatatabel.map((getmaster) => {
                    if (!getmaster.discounttype) {
                      getmaster.discounttype = "₹";
                      getmaster.discountvalue = "0";
                    }
                  });
                }
              }
              this.allBillingData.gst_number = JSON.parse(
                this.jobcardArrayForEdit.settings_data_json
              ).gst_number;
              if (
                this.jobcardArrayForEdit.section_discount != "" &&
                this.jobcardArrayForEdit.section_discount != null
              ) {
                var sectiondisarr = [];
                sectiondisarr = JSON.parse(
                  this.jobcardArrayForEdit.section_discount
                )[0];
                this.jodisvalue = sectiondisarr["jobdis"];
                if (sectiondisarr["jobdisable"] == "true") {
                  this.showjobdis = true;
                } else {
                  this.showjobdis = false;
                }
                if (sectiondisarr["jobitemdis"] == "true") {
                  this.showjobdisitem = true;
                } else {
                  this.showjobdisitem = false;
                }
                this.spareisvalue = sectiondisarr["sparedis"];
                if (sectiondisarr["sparedisable"] == "true") {
                  this.showsparedis = true;
                } else {
                  this.showsparedis = false;
                }
                if (sectiondisarr["spareitemdis"] == "true") {
                  this.showsparedisitem = true;
                } else {
                  this.showsparedisitem = false;
                }

                this.lubeisvalue = sectiondisarr["lubedis"];
                if (sectiondisarr["lubedisable"] == "true") {
                  this.showlubedis = true;
                } else {
                  this.showlubedis = false;
                }
                if (sectiondisarr["lubeitemdis"] == "true") {
                  this.showlubedisitem = true;
                } else {
                  this.showlubedisitem = false;
                }
              } else {
                this.jodisvalue = 0;
                this.showjobdis = false;
                this.showjobdisitem = false;
                this.spareisvalue = 0;
                this.showsparedis = false;
                this.showsparedisitem = false;
                this.lubeisvalue = 0;
                this.showlubedis = false;
                this.showlubedisitem = false;
              }
              this.showVechileNo = this.createdJobcardSetting.showVechileNo;
              this.smsAlretValue = JSON.parse(
                this.jobcardArrayForEdit.sms_alert
              );
              if (this.createdJobcardSetting.newregister == true) {
                this.newregister = true;
                this.showVechileNo = true;
                //this.setValidators(true)
              } else {
                this.newregister = false;
                this.showVechileNo = false;
                //this.setValidators(false)
              }
              if (this.paymentMethod == "cheque") {
                if (this.checqueOrTransticon == "") {
                  this.Chequeerror = true;
                  this.transerror = false;
                } else {
                  this.Chequeerror = false;
                  this.transerror = false;
                }
              } else if (
                this.paymentMethod != "cash" &&
                this.paymentMethod != "cheque" &&
                this.paymentMethod != ""
              ) {
                if (this.checqueOrTransticon == "") {
                  this.Chequeerror = false;
                  this.transerror = true;
                } else {
                  this.Chequeerror = false;
                  this.transerror = false;
                }
              } else {
                this.Chequeerror = false;
                this.transerror = false;
              }
              this.exitNote = this.jobcardArrayForEdit.exit_note;
              if (
                JSON.parse(this.jobcardArrayForEdit.jobcard_mechanic).length !=
                0
              ) {
                this.staffarr = JSON.parse(
                  this.jobcardArrayForEdit.jobcard_mechanic.replace(/\\/g, "")
                );
                // this.staffarr.map(arrDara=>{
                //   this.staffListtabel.push(arrDara.charAt(0).toUpperCase() + arrDara.slice(1))
                // })
              }
              this.deliveryTimeField =
                this.jobcardArrayForEdit.estimated_delivery_datetime
                  .split(" ")[1]
                  .split(":")[0] +
                ":" +
                this.jobcardArrayForEdit.estimated_delivery_datetime
                  .split(" ")[1]
                  .split(":")[1];
              this.deliveryDateField = new Date(
                this.jobcardArrayForEdit.estimated_delivery_datetime.split(
                  " "
                )[0]
              );
              this.deliveryDateFieldForAdd =
                parseInt(
                  this.jobcardArrayForEdit.estimated_delivery_datetime
                    .split(" ")[0]
                    .split("-")[0]
                ) +
                "-" +
                parseInt(
                  this.jobcardArrayForEdit.estimated_delivery_datetime
                    .split(" ")[0]
                    .split("-")[1]
                    .replace(/\b0/g, "")
                ) +
                "-" +
                parseInt(
                  this.jobcardArrayForEdit.estimated_delivery_datetime
                    .split(" ")[0]
                    .split("-")[2]
                    .replace(/\b0/g, "")
                );
              this.SelectedVoice = JSON.parse(
                this.jobcardArrayForEdit.jobcard_customer_voice
              );
              if (this.SelectedVoice.length != 0) {
                this.showSelectedVoice = true;
              }
              this.SelectedDataarrOfVehicle =
                this.jobcardArrayForEdit.vehicle_details;
              if (this.SelectedDataarrOfVehicle.make == undefined) {
                this.SelectedDataarrOfVehicle = {
                  vehicle_type: this.SelectedDataarrOfVehicle.type,
                  make: this.SelectedDataarrOfVehicle.vehicle_make,
                  model: this.SelectedDataarrOfVehicle.vehicle_model,
                  variant: this.SelectedDataarrOfVehicle.vehicle_variant,
                };
                this.vehiclesearchmodel =
                  this.SelectedDataarrOfVehicle.make +
                  " " +
                  this.SelectedDataarrOfVehicle.model +
                  " " +
                  this.SelectedDataarrOfVehicle.variant;
              }
            }
            this.getCustomerVoiceData();
            this.showspinner.setSpinnerForLogin(false);
          } else if (customerDetail.success == false) {
            //this.checkvtypearr(this.vechileTypetoshow,true)
            //this.shoeupdate=false
            this.askForUpadte = false;
            this.customerProfileId = null;
            this.customerProfileName = "";
            this.customerProfileMobile = 0;
            this.customerProfileMobile2 = 0;
            this.CreateCustomerForm.controls["chassisnumber"].setValue("");
            this.CreateCustomerForm.controls["customername"].setValue("");
            this.CreateCustomerForm.controls["mobileOneNo"].setValue("");
            this.CreateCustomerForm.controls["mobileTwoNo"].setValue("");

            this.CreateCustomerForm.controls["kmread"].setValue("");
            this.CreateCustomerForm.controls["email"].setValue("");

            this.dateOfBirth = "";

            this.CreateCustomerForm.controls["pickupaddress"].setValue("", {
              onlySelf: true,
            });
            this.CreateCustomerForm.controls["dropaddress"].setValue("", {
              onlySelf: true,
            });
            this.CreateCustomerForm.controls["enginenumber"].setValue("", {
              onlySelf: true,
            });

            this.CreateCustomerForm.controls["color"].setValue("", {
              onlySelf: true,
            });

            this.CreateCustomerForm.controls["drivername"].setValue("", {
              onlySelf: true,
            });

            this.CreateCustomerForm.controls["driverno"].setValue("", {
              onlySelf: true,
            });

            this.CreateCustomerForm.controls["gstno"].setValue("", {
              onlySelf: true,
            });
            this.showdisbale = false;
            this.inputcolor = "#fff";
            this.CreateCustomerForm.controls["vechilenumber"].enable();
            this.CreateCustomerForm.controls["chassisnumber"].enable();
            this.CreateCustomerForm.controls["customername"].enable();
            this.CreateCustomerForm.controls["mobileOneNo"].enable();
            this.CreateCustomerForm.controls["searchVehicle"].enable();
            this.CreateCustomerForm.controls["mobileTwoNo"].enable();
            this.CreateCustomerForm.controls["kmread"].enable();
            this.CreateCustomerForm.controls["email"].enable();
            this.CreateCustomerForm.controls["dob"].enable();
            this.CreateCustomerForm.controls["pickupaddress"].enable();
            this.CreateCustomerForm.controls["dropaddress"].enable();
            this.CreateCustomerForm.controls["enginenumber"].enable();
            this.CreateCustomerForm.controls["color"].enable();
            this.CreateCustomerForm.controls["drivername"].enable();
            this.CreateCustomerForm.controls["driverno"].enable();
            this.CreateCustomerForm.controls["gstno"].enable();
            this.showInvoiceForm = false;
            this.showspinner.setSpinnerForLogin(false);
          } else {
            this.askForUpadte = false;
            this.showspinner.setSpinnerForLogin(false);
            console.log("Not found");
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

  searchCustomerInput(event) {
    this.general.searchCustomers(this.userworkshopid, event, "other").subscribe(
      (cusData) => {
        if (cusData.success == true) {
          if (cusData["next_page"] != "Nonextpage") {
            this.searchCustomerDataPage = cusData["next_page"];
          } else {
            this.searchCustomerDataPage = "none";
          }

          this.vehicle_numbers_added = [];
          this.searchCustomerData = [];
          this.detailedCustomerData = [];
          for (var i = 0; i < cusData["data"].length; i++) {
            // console.log("detailse", cusData["data"][i]);

            if (
              !this.vehicle_numbers_added.includes(
                cusData["data"][i]["vehicle_number"]
              )
            ) {
              let customer_entry =
                cusData["data"][i]["customer_name"] +
                "," +
                cusData["data"][i]["customer_mobile"] +
                "," +
                cusData["data"][i]["vehicle_number"];

              this.searchCustomerData.push(customer_entry);
              this.detailedCustomerData.push(cusData["data"][i]);
              this.vehicle_numbers_added.push(
                cusData["data"][i]["vehicle_number"]
              );
            }

            // let customer_entry =
            //   cusData["data"][i]["customer_name"] +
            //   "," +
            //   cusData["data"][i]["customer_mobile"] +
            //   "," +
            //   cusData["data"][i]["vehicle_number"];

            // if (!this.searchCustomerData.includes(customer_entry)) {
            //   this.searchCustomerData.push(customer_entry);
            //   this.detailedCustomerData.push(cusData["data"][i]);
            // }
          }
        } else {
          console.log("No Data");
          //this.searchJobData.push("No Data Found")
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

  addCustomerData(api_data) {
    if (api_data.success == true) {
      if (api_data["next_page"] != "Nonextpage") {
        this.searchCustomerDataPage = api_data["next_page"];
      } else {
        this.searchCustomerDataPage = "none";
      }
      
      for (var i = 0; i < api_data["data"].length; i++) {
        // console.log("detailse", api_data["data"][i]);
        let customer_entry =
          api_data["data"][i]["customer_name"] +
          "," +
          api_data["data"][i]["customer_mobile"] +
          "," +
          api_data["data"][i]["vehicle_number"];

        if (!this.searchCustomerData.includes(customer_entry)) {
          this.searchCustomerData.push(customer_entry);
          this.detailedCustomerData.push(api_data["data"][i]);
        }
      }
    } else {
      console.log("No Data");
      //this.searchJobData.push("No Data Found")
    }
  }

  loadMoreCustomers() {
    if (this.searchCustomerDataPage != "none") {
      setTimeout(
        () =>
          this.general
            .customerPaginatedData(this.searchCustomerDataPage)
            .subscribe(
              (api_data) => {
                // this.addCustomerData(customer);

                if (api_data.success == true) {
                  if (api_data["next_page"] != "Nonextpage") {
                    this.searchCustomerDataPage = api_data["next_page"];
                  } else {
                    this.searchCustomerDataPage = "none";
                  }
                  // console.log("from addCustomerData");
                  // console.log("api_data", api_data);
                  // console.log(
                  //   " this.searchCustomerDataPage ",
                  //   this.searchCustomerDataPage
                  // );
                  // console.log(
                  //   " this.searchCustomerData ",
                  //   this.searchCustomerData
                  // );
                  // console.log(" this.detailed ", this.detailedCustomerData);

                  for (var i = 0; i < api_data["data"].length; i++) {
                    // console.log("detailse", api_data["data"][i]);
                    let customer_entry =
                      api_data["data"][i]["customer_name"] +
                      "," +
                      api_data["data"][i]["customer_mobile"] +
                      "," +
                      api_data["data"][i]["vehicle_number"];

                    if (!this.searchCustomerData.includes(customer_entry)) {
                      this.searchCustomerData.push(customer_entry);
                      this.detailedCustomerData.push(api_data["data"][i]);
                    }
                  }
                } else {
                  console.log("No Data");
                  //this.searchJobData.push("No Data Found")
                }
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

  selectedResultForCustomer(event) {
    if (event.lenght !== 0) {
      let customer_index = this.searchCustomerData.indexOf(event);

      let veh_number = event.split(",")[2];
      
      let customer_displayed = this.detailedCustomerData[customer_index];
      // console.log("customer_displayed", customer_displayed);
      this.general
        .lastHistoryJobcard(this.userworkshopid, veh_number)
        .subscribe(
          (vehicleIs) => {
            if (
              vehicleIs.success == true &&
              (vehicleIs.jobcard_status === 0 || vehicleIs.jobcard_status === 1)
            ) {
              this.showspinner.setSpinnerForLogin(false);

              this.dialogservice
                .OpenLastHistory(vehicleIs, vehicleIs.jobcard_status)
                .subscribe(() => {
                  // console.log("dialog", vehicleIs);
                });
              // } else if (vehicleIs.success == true) {
            } else {
              this.showspinner.setSpinnerForLogin(false);

              if (vehicleIs.success == true && vehicleIs.jobcard_status === 2) {
                this.dialogservice
                  .OpenLastHistory(vehicleIs, vehicleIs.jobcard_status)
                  .subscribe(() => {
                    console.log("dialog", vehicleIs);
                  });
              }

              this.setCustomerForm(customer_displayed);
              this.selectedCustomer = customer_displayed;
              this.is_set_customer = true;

              this.showInvoiceForm = true;

              this.showdisbale = true;
              this.shoeupdate = false;
              // this.inputcolor = "#d2d0d0";

              // this.getStaff();
              this.getCustomerVoiceData();
            }
            // else if (vehicleIs.success == false) {
            //   this.snakBar.open("Message", "try again", {
            //     duration: 4000,
            //   });
            // }
          },
          (err) => {
            this.snakBar.open(err, ErrorMessgae[0][err], {
              duration: 4000,
            });
          }
        );
    }
  }

  setCustomerFormValues() {
    this.setCustomerForm(this.selectedCustomer);
  }

  clearCustomerForm() {
    this.customerProfileId = null;
    this.customerProfileName = "";
    this.customerProfileMobile = 0;
    this.customerProfileMobile2 = 0;

    this.CreateCustomerForm.controls["vechilenumber"].setValue("");

    this.CreateCustomerForm.controls["searchVehicle"].setValue("");

    this.CreateCustomerForm.controls["chassisnumber"].setValue("");
    this.CreateCustomerForm.controls["customername"].setValue("");
    this.CreateCustomerForm.controls["mobileOneNo"].setValue("");
    this.CreateCustomerForm.controls["mobileTwoNo"].setValue("");

    this.CreateCustomerForm.controls["kmread"].setValue("");
    this.CreateCustomerForm.controls["email"].setValue("");

    this.dateOfBirth = "";

    this.CreateCustomerForm.controls["pickupaddress"].setValue("", {
      onlySelf: true,
    });
    this.CreateCustomerForm.controls["dropaddress"].setValue("", {
      onlySelf: true,
    });
    this.CreateCustomerForm.controls["enginenumber"].setValue("", {
      onlySelf: true,
    });

    this.CreateCustomerForm.controls["color"].setValue("", {
      onlySelf: true,
    });

    this.CreateCustomerForm.controls["drivername"].setValue("", {
      onlySelf: true,
    });

    this.CreateCustomerForm.controls["driverno"].setValue("", {
      onlySelf: true,
    });

    this.CreateCustomerForm.controls["gstno"].setValue("", {
      onlySelf: true,
    });
  }

  setCustomerForm(customerDetail) {
    this.customerProfileId = customerDetail.id;
    this.customerProfileName = customerDetail.customer_name;
    this.customerProfileMobile = customerDetail.customer_mobile;
    this.customerProfileMobile2 = customerDetail.customer_mobile_2;
    this.CreateCustomerForm.controls["vechilenumber"].setValue(
      customerDetail.vehicle_number,
      { onlySelf: true }
    );

    //  here
    this.CreateCustomerForm.value.vechilenumber = customerDetail.vehicle_numbe;
    this.CreateCustomerForm.controls["chassisnumber"].setValue(
      customerDetail.chassis_number,
      {
        onlySelf: true,
      }
    );
    this.CreateCustomerForm.value.chassisnumber = customerDetail.chassis_number;
    this.SelectedDataarrOfVehicle = {
      vehicle_type: customerDetail.vehicle_type,
      make: customerDetail.vehicle_make,
      model: customerDetail.vehicle_model,
      variant: customerDetail.vehicle_variant,
    };
    if (this.SelectedDataarrOfVehicle.vehicle_type == "2") {
      this.general
        .getType(
          this.SelectedDataarrOfVehicle.make,
          this.SelectedDataarrOfVehicle.model,
          this.SelectedDataarrOfVehicle.variant
        )
        .subscribe(
          (gettype) => {
            // this.showspinner.setSpinnerForLogin(true);
            if (gettype["success"] == true) {
              this.showspinner.setSpinnerForLogin(false);
              this.CreateCustomerForm.controls["twowheetertype"].setValue(
                gettype["vhicletype"],
                {
                  onlySelf: true,
                }
              );
              this.CreateCustomerForm.value.twowheetertype =
                gettype["vhicletype"];
            } else {
              // this.showspinner.setSpinnerForLogin(true);
              this.snakBar.open(
                "Message",
                ErrorMessgae[0][gettype["message"]],
                {
                  duration: 4000,
                }
              );
            }
          },
          (err) => {
            // sthis.showspinner.setSpinnerForLogin(false);
            this.snakBar.open(err, ErrorMessgae[0][err], {
              duration: 4000,
            });
          }
        );
    }

    this.vehiclesearchmodel =
      this.SelectedDataarrOfVehicle.make +
      " " +
      this.SelectedDataarrOfVehicle.model +
      " " +
      this.SelectedDataarrOfVehicle.variant;

    // this.CreateCustomerForm.controls["searchVehicle"].setValue(
    //   this.vehiclesearchmodel,
    //   {
    //     onlySelf: true,
    //   }
    // );

    this.CreateCustomerForm.controls["customername"].setValue(
      customerDetail.customer_name,
      { onlySelf: true }
    );
    this.CreateCustomerForm.controls["mobileOneNo"].setValue(
      customerDetail.customer_mobile,
      { onlySelf: true }
    );
    this.CreateCustomerForm.controls["mobileOneNo"].setValue(
      customerDetail.customer_mobile,
      { onlySelf: true }
    );
    if (customerDetail.customer_mobile_2 != 0) {
      this.CreateCustomerForm.controls["mobileTwoNo"].setValue(
        customerDetail.customer_mobile_2,
        {
          onlySelf: true,
        }
      );
    }
    this.CreateCustomerForm.controls["email"].setValue(
      customerDetail.customer_email,
      { onlySelf: true }
    );
    if (customerDetail.customer_dob != "") {
      this.dateOfBirth = new Date(customerDetail.customer_dob);
    }
    this.CreateCustomerForm.controls["pickupaddress"].setValue(
      customerDetail.pick_up_address,
      {
        onlySelf: true,
      }
    );
    this.CreateCustomerForm.controls["dropaddress"].setValue(
      customerDetail.drop_address,
      { onlySelf: true }
    );
    this.CreateCustomerForm.controls["enginenumber"].setValue(
      customerDetail.engine_number,
      { onlySelf: true }
    );
    if (customerDetail.vehicle_color != 0) {
      this.getColor = customerDetail.vehicle_color;
      //this.CreateCustomerForm.controls["color"].setValue(customerDetail.vehicle_color,{onlySelf:true})
    }
    this.CreateCustomerForm.controls["drivername"].setValue(
      customerDetail.driver_name,
      { onlySelf: true }
    );
    if (customerDetail.driver_mobile != 0) {
      this.CreateCustomerForm.controls["driverno"].setValue(
        customerDetail.driver_mobile,
        { onlySelf: true }
      );
    }
    this.CreateCustomerForm.controls["gstno"].setValue(
      customerDetail.gst_number,
      { onlySelf: true }
    );
    this.CreateCustomerForm.controls["kmread"].setValue(
      customerDetail.km_read,
      { onlySelf: true }
    );
  }

  onCustomerSearchNew() {
    this.is_set_customer = false;
  }

  // *******************************************
  // Search any vechile number for the workshop for end customer details
  searchVehicleNumber(event) {
    var mode;
    var parameter;
    if (this.jobcardEditOrCreate == "create") {
      mode = "by_vehicle";
      parameter = event;
    } else {
      mode = "by_id";
      parameter = this.jobcardArrayForEdit.workshop_customer_id;
    }
    this.general
      .getVechileCustomerDetail(this.userworkshopid, parameter, mode)
      .subscribe(
        (customerDetail) => {
          this.showspinner.setSpinnerForLogin(true);
          if (this.jobcardEditOrCreate != "edit") {
            if (event == "") {
              this.showdisable = false;
            } else {
              this.showdisable = true;
            }
          }
          if (customerDetail.success == true) {
            this.general
              .lastHistoryJobcard(this.userworkshopid, event)
              .subscribe((vehicleIs) => {
                if (
                  vehicleIs.success == true &&
                  vehicleIs.jobcard_status === 2
                ) {
                  this.dialogservice
                    .OpenLastHistory(vehicleIs, vehicleIs.jobcard_status)
                    .subscribe(() => {
                      // console.log("dialog", vehicleIs);
                    });
                }
              });
            this.askForUpadte = true;
            //this.shoeupdate=true
            this.customerProfileId = customerDetail.customer.id;
            this.customerProfileName = customerDetail.customer.customer_name;
            this.customerProfileMobile =
              customerDetail.customer.customer_mobile;
            this.customerProfileMobile2 =
              customerDetail.customer.customer_mobile_2;
            this.CreateCustomerForm.controls["vechilenumber"].setValue(event, {
              onlySelf: true,
            });
            this.CreateCustomerForm.value.vechilenumber = event;
            this.setvechilenumber = event;
            this.CreateCustomerForm.controls["chassisnumber"].setValue(
              customerDetail.customer.chassis_number,
              { onlySelf: true }
            );
            this.CreateCustomerForm.value.chassisnumber =
              customerDetail.customer.chassis_number;
            this.SelectedDataarrOfVehicle = {
              vehicle_type: customerDetail.customer.vehicle_type,
              make: customerDetail.customer.vehicle_make,
              model: customerDetail.customer.vehicle_model,
              variant: customerDetail.customer.vehicle_variant,
            };
            // if(customerDetail.customer.vehicle_type==""){
            //   this.CreateCustomerForm.controls["type"].setValue(this.vechileTypetoshow[0],{onlySelf:true})
            // }else{
            //   this.checkvtypearr(this.vechileTypetoshow,true)
            //   this.CreateCustomerForm.controls["type"].setValue(customerDetail.customer.vehicle_type,{onlySelf:true})
            //   this.CreateCustomerForm.value.type=customerDetail.customer.vehicle_type
            // }
            // if(customerDetail.customer.vehicle_make==""){
            //   this.CreateCustomerForm.controls["make"].setValue(this.vechileMake[0],{onlySelf:true})
            // }else{
            //   this.CreateCustomerForm.controls["make"].setValue(customerDetail.customer.vehicle_make,{onlySelf:true})
            //   this.CreateCustomerForm.value.make=customerDetail.customer.vehicle_make
            // }
            // if(customerDetail.customer.vehicle_model==""){
            //   this.CreateCustomerForm.controls["model"].setValue(this.vechileModel[0],{onlySelf:true})
            // }else{
            //   this.CreateCustomerForm.controls["model"].setValue(customerDetail.customer.vehicle_model,{onlySelf:true})
            //   this.CreateCustomerForm.value.model=customerDetail.customer.vehicle_model
            // }
            // if(customerDetail.customer.vehicle_variant==""){
            //   this.CreateCustomerForm.controls["varri"].setValue(this.vechileVarriant[0],{onlySelf:true})
            // }else{
            //   this.CreateCustomerForm.controls["varri"].setValue(customerDetail.customer.vehicle_variant,{onlySelf:true})
            //   this.CreateCustomerForm.value.varri=customerDetail.customer.vehicle_variant
            // }
            this.CreateCustomerForm.controls["customername"].setValue(
              customerDetail.customer.customer_name,
              { onlySelf: true }
            );
            this.CreateCustomerForm.controls["mobileOneNo"].setValue(
              customerDetail.customer.customer_mobile,
              { onlySelf: true }
            );
            this.CreateCustomerForm.controls["mobileOneNo"].setValue(
              customerDetail.customer.customer_mobile,
              { onlySelf: true }
            );
            if (customerDetail.customer.customer_mobile_2 != 0) {
              this.CreateCustomerForm.controls["mobileTwoNo"].setValue(
                customerDetail.customer.customer_mobile_2,
                { onlySelf: true }
              );
            }
            this.CreateCustomerForm.controls["email"].setValue(
              customerDetail.customer.customer_email,
              { onlySelf: true }
            );
            if (customerDetail.customer.customer_dob != "") {
              this.dateOfBirth = new Date(customerDetail.customer.customer_dob);
            }
            this.CreateCustomerForm.controls["pickupaddress"].setValue(
              customerDetail.customer.pick_up_address,
              { onlySelf: true }
            );
            this.CreateCustomerForm.controls["dropaddress"].setValue(
              customerDetail.customer.drop_address,
              { onlySelf: true }
            );
            this.CreateCustomerForm.controls["enginenumber"].setValue(
              customerDetail.customer.engine_number,
              { onlySelf: true }
            );
            if (customerDetail.customer.vehicle_color != 0) {
              this.getColor = customerDetail.customer.vehicle_color;
              //this.CreateCustomerForm.controls["color"].setValue(customerDetail.customer.vehicle_color,{onlySelf:true})
            }
            this.CreateCustomerForm.controls["drivername"].setValue(
              customerDetail.customer.driver_name,
              { onlySelf: true }
            );
            if (customerDetail.customer.driver_mobile != 0) {
              this.CreateCustomerForm.controls["driverno"].setValue(
                customerDetail.customer.driver_mobile,
                { onlySelf: true }
              );
            }
            this.CreateCustomerForm.controls["gstno"].setValue(
              customerDetail.customer.gst_number,
              { onlySelf: true }
            );
            this.CreateCustomerForm.controls["kmread"].setValue(
              customerDetail.customer.km_read,
              { onlySelf: true }
            );
            this.showInvoiceForm = true;
            // if(this.jobcardEditOrCreate=='edit'){
            //   if(this.jobcardArrayForEdit.vehicle_details.type==undefined){
            //     this.allVechileTypes.filter(eventfortype=>{
            //       if(this.jobcardArrayForEdit.vehicle_details.vehicle_make==eventfortype.make && this.jobcardArrayForEdit.vehicle_details.vehicle_model==eventfortype.model){
            //         this.CreateCustomerForm.controls["type"].setValue(eventfortype.vehicle_type,{onlySelf:true})
            //         this.CreateCustomerForm.value.type=eventfortype.vehicle_type
            //       }
            //     })
            //   }else{
            //     this.CreateCustomerForm.controls["type"].setValue(this.jobcardArrayForEdit.vehicle_details.type,{onlySelf:true})
            //     this.CreateCustomerForm.value.type=this.jobcardArrayForEdit.vehicle_details.type
            //   }
            //   this.CreateCustomerForm.controls["make"].setValue(this.jobcardArrayForEdit.vehicle_details.vehicle_make,{onlySelf:true})
            //   this.CreateCustomerForm.value.make=this.jobcardArrayForEdit.vehicle_details.vehicle_make
            //   this.CreateCustomerForm.controls["model"].setValue(this.jobcardArrayForEdit.vehicle_details.vehicle_model,{onlySelf:true})
            //   this.CreateCustomerForm.value.model=this.jobcardArrayForEdit.vehicle_details.vehicle_model
            //   if(this.jobcardArrayForEdit.vehicle_details.vehicle_variant==""){
            //     this.CreateCustomerForm.controls["varri"].setValue(this.varrimessage,{onlySelf:true})
            //     this.CreateCustomerForm.value.varri=this.varrimessage
            //   }else{
            //     this.CreateCustomerForm.controls["varri"].setValue(this.jobcardArrayForEdit.vehicle_details.vehicle_variant,{onlySelf:true})
            //     this.CreateCustomerForm.value.varri=this.jobcardArrayForEdit.vehicle_details.vehicle_variant
            //   }
            // }
            // if(this.CreateCustomerForm.value.type=='2'){
            //   this.allVechileTypes.filter(eventaa=>{
            //     if(this.CreateCustomerForm.value.varri==this.varrimessage){
            //       if(eventaa.make==this.CreateCustomerForm.value.make && eventaa.model==this.CreateCustomerForm.value.model && eventaa.variant==""){
            //         this.CreateCustomerForm.controls["twowheetertype"].setValue(eventaa.type,{onlySelf:true})
            //         this.CreateCustomerForm.value.twowheetertype=eventaa.type
            //       }
            //     }else{
            //       if(this.CreateCustomerForm.value.varri!=null){
            //         if(eventaa.make==this.CreateCustomerForm.value.make && eventaa.model==this.CreateCustomerForm.value.model&& eventaa.variant==this.CreateCustomerForm.value.varri){
            //           this.CreateCustomerForm.controls["twowheetertype"].setValue(eventaa.type,{onlySelf:true})
            //           this.CreateCustomerForm.value.twowheetertype=eventaa.type
            //         }
            //       }else{
            //         if(eventaa.make==this.CreateCustomerForm.value.make && eventaa.model==this.CreateCustomerForm.value.model){
            //           this.CreateCustomerForm.controls["twowheetertype"].setValue(eventaa.type,{onlySelf:true})
            //           this.CreateCustomerForm.value.twowheetertype=eventaa.type
            //         }
            //       }
            //     }
            //   })
            // }
            this.showdisbale = true;
            this.shoeupdate = false;

            // this.inputcolor = "#d2d0d0";
            // this.CreateCustomerForm.controls["vechilenumber"].disable();
            // this.CreateCustomerForm.controls["chassisnumber"].disable();
            // this.CreateCustomerForm.controls["customername"].disable();
            // this.CreateCustomerForm.controls["mobileOneNo"].disable();
            // this.CreateCustomerForm.controls["searchVehicle"].disable();
            // this.CreateCustomerForm.controls["mobileTwoNo"].disable();
            // this.CreateCustomerForm.controls["kmread"].disable();
            // this.CreateCustomerForm.controls["email"].disable();
            // this.CreateCustomerForm.controls["dob"].disable();
            // this.CreateCustomerForm.controls["pickupaddress"].disable();
            // this.CreateCustomerForm.controls["dropaddress"].disable();
            // this.CreateCustomerForm.controls["enginenumber"].disable();
            // this.CreateCustomerForm.controls["color"].disable();
            // this.CreateCustomerForm.controls["drivername"].disable();
            // this.CreateCustomerForm.controls["driverno"].disable();
            // this.CreateCustomerForm.controls["gstno"].disable();

            if (this.jobcardEditOrCreate == "edit") {
              const dateForDiff = new Date();
              if (this.jobcardArrayForEdit.closed_date.length == 10) {
                var date1 = new Date(
                  this.jobcardArrayForEdit.closed_date.replace(/-0+/g, "/")
                );
              } else {
                var date1 = new Date(
                  this.jobcardArrayForEdit.closed_date
                    .split(" ")[0]
                    .replace(/-0+/g, "/")
                );
              }
              const date2 = new Date(
                dateForDiff.getFullYear() +
                  "-" +
                  (dateForDiff.getMonth() + 1) +
                  "-" +
                  dateForDiff.getDate()
              );
              const utc1 = Date.UTC(
                date1.getFullYear(),
                date1.getMonth(),
                date1.getDate()
              );
              const utc2 = Date.UTC(
                date2.getFullYear(),
                date2.getMonth(),
                date2.getDate()
              );
              const _MS_PER_DAY = 1000 * 60 * 60 * 24;
              const diffDays = Math.floor((utc2 - utc1) / _MS_PER_DAY);
              if (diffDays > 3) {
                this.totalyclosethejobcard = false;
                this.disabledskide = false;
              } else {
                this.totalyclosethejobcard = false;
              }
              if (this.jobcardArrayForEdit.sms_alert == "true") {
                this.general
                  .getRemindersOfJobcard(
                    this.userworkshopid,
                    this.jobcardArrayForEdit.jobcard_number
                  )
                  .subscribe((reminders) => {
                    this.showspinner.setSpinnerForLogin(true);
                    if (reminders.success == true) {
                      this.showspinner.setSpinnerForLogin(false);
                      if (
                        reminders.reminders[0].reminder_priority.toLowerCase() ==
                        "servicing"
                      ) {
                        reminders.reminders.map((data) => {
                          if (data.message.includes("is due for")) {
                            this.reminderOneDate = data.date;
                            this.reminderOnestatus = data.status;
                          }
                          if (data.message.includes("Today")) {
                            this.reminderTwoDate = data.date;
                            this.reminderTwostatus = data.status;
                          }
                          if (data.message.includes("was due for")) {
                            this.reminderthreeDate = data.date;
                            this.reminderthreetatus = data.status;
                          }
                        });
                      } else if (
                        reminders.reminders[0].reminder_priority.toLowerCase() ==
                        "washing"
                      ) {
                        reminders.reminders.map((datanew) => {
                          if (datanew.message.includes("Today")) {
                            this.reminderOneDate = datanew.date;
                            this.reminderOnestatus = datanew.status;
                          }
                          if (datanew.message.includes("was due for")) {
                            this.reminderthreeDate = datanew.date;
                            this.reminderthreetatus = datanew.status;
                          }
                        });
                      } else if (
                        reminders.reminders[0].reminder_priority.toLowerCase() ==
                        "general_repair"
                      ) {
                        if (
                          reminders.reminders[0].message.includes(
                            "experience with us"
                          )
                        ) {
                          this.reminderOneDate = reminders.reminders[0].date;
                          this.reminderOnestatus =
                            reminders.reminders[0].status;
                        }
                      } else if (
                        reminders.reminders[0].reminder_priority.toLowerCase() ==
                        "wheel_alignment"
                      ) {
                        reminders.reminders.map((dataallnew) => {
                          if (dataallnew.message.includes("Today")) {
                            this.reminderOneDate = dataallnew.date;
                            this.reminderOnestatus = dataallnew.status;
                          }
                          if (dataallnew.message.includes("was due for")) {
                            this.reminderthreeDate = dataallnew.date;
                            this.reminderthreetatus = dataallnew.status;
                          }
                        });
                      }
                    } else {
                      this.showspinner.setSpinnerForLogin(false);
                      this.snakBar.open(
                        "Message",
                        ErrorMessgae[0][reminders.message],
                        {
                          duration: 4000,
                        }
                      );
                    }
                  });
              }
              this.createdAtDate = new Date(
                this.jobcardArrayForEdit.created_at
              );
              this.createdAtDate.setHours(this.createdAtDate.getHours() + 5);
              this.createdAtDate.setMinutes(
                this.createdAtDate.getMinutes() + 30
              );
              this.jocardnumber = this.jobcardArrayForEdit.jobcard_number;
              this.reminderKM = this.jobcardArrayForEdit.after_km;
              this.kmvehicle = this.jobcardArrayForEdit.km;
              this.valueset = this.jobcardArrayForEdit.fuel;

              this.selectedItemOfSupervisor =
                this.jobcardArrayForEdit.supervisor;
              if (
                this.allBillingData.default_reminder_period !=
                this.jobcardArrayForEdit.reminder
              ) {
                this.allBillingData.default_reminder_period =
                  this.jobcardArrayForEdit.reminder;
                this.reminderperiod = this.jobcardArrayForEdit.reminder;
              } else {
                this.reminderperiod =
                  this.allBillingData.default_reminder_period;
              }
              this.customerProfileId =
                this.jobcardArrayForEdit.workshop_customer_id;
              this.jobcarddate =
                this.jobcardArrayForEdit.created_at.split(" ")[0];
              this.sparedatatabel = JSON.parse(
                this.jobcardArrayForEdit.jobcard_spare_items
              );
              if (this.sparedatatabel.length != 0) {
                this.duplicateSpare = this.sparedatatabel;
                this.SpareTotal = this.calculateresult(this.sparedatatabel);
                this.SpareTotalFinal = this.calculateresultfinal(
                  this.sparedatatabel
                );
                this.calTotalGstForSpareamount = this.calTotalGstForSpare(
                  this.sparedatatabel
                );
              }
              this.lubedatatabel = JSON.parse(
                this.jobcardArrayForEdit.jobcard_lubes_items
              );
              if (this.lubedatatabel.length != 0) {
                this.duplicateLube = this.lubedatatabel;
                this.LubeTotal = this.calculateresult(this.lubedatatabel);
                this.LubeTotalFinal = this.calculateresultfinal(
                  this.lubedatatabel
                );
                this.calTotalGstForLubeamount = this.calTotalGstForLube(
                  this.lubedatatabel
                );
              }
              if (this.sparedatatabel.length != 0) {
                this.sparedatatabel.map((spareData) => {
                  spareData.totalitemamount = this.getTotalAmountEditTime(
                    spareData,
                    "1",
                    "job"
                  );
                  this.oldQuantityArray.push({
                    partnumber: spareData.part_number,
                    quantity: spareData.quantity,
                  });
                });
              }
              if (this.lubedatatabel.length != 0) {
                this.lubedatatabel.map((lubeData) => {
                  lubeData.totalitemamount = this.getTotalAmountEditTime(
                    lubeData,
                    "1",
                    "job"
                  );
                  this.oldQuantityArray.push({
                    partnumber: lubeData.part_number,
                    quantity: lubeData.quantity,
                  });
                });
              }
              this.jobdatatabel = JSON.parse(
                this.jobcardArrayForEdit.jobcard_job_items
              );
              if (this.jobdatatabel.length != 0) {
                this.duplicateJob = this.jobdatatabel;
                this.JobTotal = this.calculateresult(this.jobdatatabel);
                this.JobTotalFinal = this.calculateresultfinal(
                  this.jobdatatabel
                );
                this.calTotalGstForJobamount = this.calTotalGstForJob(
                  this.jobdatatabel
                );
                this.jobdatatabel.map((getmaster) => {
                  getmaster.totalitemamount = this.getTotalAmountEditTime(
                    getmaster,
                    "1",
                    "job"
                  );
                  if (getmaster.is_master == "True") {
                    this.checkarray.push(getmaster.part_name);
                  }
                });
              }
              this.totalAmount = Number(this.jobcardArrayForEdit.total_amount);
              this.advanceAmount = Number(this.jobcardArrayForEdit.advance);
              this.discount = Number(
                this.jobcardArrayForEdit.discount.split(" ")[0]
              );
              this.eventForDiscount =
                this.jobcardArrayForEdit.discount.split(" ")[1];
              this.totalPayable = Number(this.jobcardArrayForEdit.final_amount);
              this.totalPaid = Number(this.jobcardArrayForEdit.paid_amount);
              this.totalBalance = Number(
                this.jobcardArrayForEdit.balance_amount
              );
              this.billedAmount =
                Number(this.jobcardArrayForEdit.final_amount) -
                Number(this.jobcardArrayForEdit.paid_amount);
              this.paymentMethod = this.jobcardArrayForEdit.payment_mode;
              this.checqueOrTransticon = this.jobcardArrayForEdit.cheque;
              this.createdJobcardSetting = JSON.parse(
                this.jobcardArrayForEdit.settings_data_json
              );
              if (!this.createdJobcardSetting.item_wise_discount) {
                this.createdJobcardSetting["item_wise_discount"] =
                  this.jobcardSettingData.item_wise_discount;
                JSON.parse(this.jobcardArrayForEdit.settings_data_json)[
                  "item_wise_discount"
                ] = this.jobcardSettingData.item_wise_discount;
                if (this.sparedatatabel.length != 0) {
                  this.sparedatatabel.map((spareData) => {
                    if (!spareData.discounttype) {
                      spareData.discounttype = "₹";
                      spareData.discountvalue = "0";
                    }
                  });
                } //discountvalue
                if (this.lubedatatabel.length != 0) {
                  this.lubedatatabel.map((lubeData) => {
                    if (!lubeData.discounttype) {
                      lubeData.discounttype = "₹";
                      lubeData.discountvalue = "0";
                    }
                  });
                }
                if (this.jobdatatabel.length != 0) {
                  this.jobdatatabel.map((getmaster) => {
                    if (!getmaster.discounttype) {
                      getmaster.discounttype = "₹";
                      getmaster.discountvalue = "0";
                    }
                  });
                }
              }
              this.allBillingData.gst_number = JSON.parse(
                this.jobcardArrayForEdit.settings_data_json
              ).gst_number;
              if (
                this.jobcardArrayForEdit.section_discount != "" &&
                this.jobcardArrayForEdit.section_discount != null
              ) {
                var sectiondisarr = [];
                sectiondisarr = JSON.parse(
                  this.jobcardArrayForEdit.section_discount
                )[0];
                this.jodisvalue = sectiondisarr["jobdis"];
                if (sectiondisarr["jobdisable"] == "true") {
                  this.showjobdis = true;
                } else {
                  this.showjobdis = false;
                }
                if (sectiondisarr["jobitemdis"] == "true") {
                  this.showjobdisitem = true;
                } else {
                  this.showjobdisitem = false;
                }
                this.spareisvalue = sectiondisarr["sparedis"];
                if (sectiondisarr["sparedisable"] == "true") {
                  this.showsparedis = true;
                } else {
                  this.showsparedis = false;
                }
                if (sectiondisarr["spareitemdis"] == "true") {
                  this.showsparedisitem = true;
                } else {
                  this.showsparedisitem = false;
                }

                this.lubeisvalue = sectiondisarr["lubedis"];
                if (sectiondisarr["lubedisable"] == "true") {
                  this.showlubedis = true;
                } else {
                  this.showlubedis = false;
                }
                if (sectiondisarr["lubeitemdis"] == "true") {
                  this.showlubedisitem = true;
                } else {
                  this.showlubedisitem = false;
                }
              } else {
                this.jodisvalue = 0;
                this.showjobdis = false;
                this.showjobdisitem = false;
                this.spareisvalue = 0;
                this.showsparedis = false;
                this.showsparedisitem = false;
                this.lubeisvalue = 0;
                this.showlubedis = false;
                this.showlubedisitem = false;
              }
              this.showVechileNo = this.createdJobcardSetting.showVechileNo;
              this.smsAlretValue = JSON.parse(
                this.jobcardArrayForEdit.sms_alert
              );
              if (this.createdJobcardSetting.newregister == true) {
                this.newregister = true;
                this.showVechileNo = true;
                //this.setValidators(true)
              } else {
                this.newregister = false;
                this.showVechileNo = false;
                //this.setValidators(false)
              }
              if (this.paymentMethod == "cheque") {
                if (this.checqueOrTransticon == "") {
                  this.Chequeerror = true;
                  this.transerror = false;
                } else {
                  this.Chequeerror = false;
                  this.transerror = false;
                }
              } else if (
                this.paymentMethod != "cash" &&
                this.paymentMethod != "cheque" &&
                this.paymentMethod != ""
              ) {
                if (this.checqueOrTransticon == "") {
                  this.Chequeerror = false;
                  this.transerror = true;
                } else {
                  this.Chequeerror = false;
                  this.transerror = false;
                }
              } else {
                this.Chequeerror = false;
                this.transerror = false;
              }
              this.exitNote = this.jobcardArrayForEdit.exit_note;
              if (
                JSON.parse(this.jobcardArrayForEdit.jobcard_mechanic).length !=
                0
              ) {
                this.staffarr = JSON.parse(
                  this.jobcardArrayForEdit.jobcard_mechanic.replace(/\\/g, "")
                );
                // this.staffarr.map(arrDara=>{
                //   this.staffListtabel.push(arrDara.charAt(0).toUpperCase() + arrDara.slice(1))
                // })
              }
              this.deliveryTimeField =
                this.jobcardArrayForEdit.estimated_delivery_datetime
                  .split(" ")[1]
                  .split(":")[0] +
                ":" +
                this.jobcardArrayForEdit.estimated_delivery_datetime
                  .split(" ")[1]
                  .split(":")[1];
              this.deliveryDateField = new Date(
                this.jobcardArrayForEdit.estimated_delivery_datetime.split(
                  " "
                )[0]
              );
              this.deliveryDateFieldForAdd =
                parseInt(
                  this.jobcardArrayForEdit.estimated_delivery_datetime
                    .split(" ")[0]
                    .split("-")[0]
                ) +
                "-" +
                parseInt(
                  this.jobcardArrayForEdit.estimated_delivery_datetime
                    .split(" ")[0]
                    .split("-")[1]
                    .replace(/\b0/g, "")
                ) +
                "-" +
                parseInt(
                  this.jobcardArrayForEdit.estimated_delivery_datetime
                    .split(" ")[0]
                    .split("-")[2]
                    .replace(/\b0/g, "")
                );
              this.SelectedVoice = JSON.parse(
                this.jobcardArrayForEdit.jobcard_customer_voice
              );
              if (this.SelectedVoice.length != 0) {
                this.showSelectedVoice = true;
              }
              this.SelectedDataarrOfVehicle =
                this.jobcardArrayForEdit.vehicle_details;
              if (this.SelectedDataarrOfVehicle.make == undefined) {
                this.SelectedDataarrOfVehicle = {
                  vehicle_type: this.SelectedDataarrOfVehicle.type,
                  make: this.SelectedDataarrOfVehicle.vehicle_make,
                  model: this.SelectedDataarrOfVehicle.vehicle_model,
                  variant: this.SelectedDataarrOfVehicle.vehicle_variant,
                };
              }
            }
            this.getCustomerVoiceData();
            this.showspinner.setSpinnerForLogin(false);
          } else if (customerDetail.success == false) {
            //this.checkvtypearr(this.vechileTypetoshow,true)
            //this.shoeupdate=false
            this.askForUpadte = false;
            this.customerProfileId = null;
            this.customerProfileName = "";
            this.customerProfileMobile = 0;
            this.customerProfileMobile2 = 0;
            this.CreateCustomerForm.controls["chassisnumber"].setValue("");
            this.CreateCustomerForm.controls["customername"].setValue("");
            this.CreateCustomerForm.controls["mobileOneNo"].setValue("");
            this.CreateCustomerForm.controls["mobileTwoNo"].setValue("");

            this.CreateCustomerForm.controls["kmread"].setValue("");
            this.CreateCustomerForm.controls["email"].setValue("");

            this.dateOfBirth = "";

            this.CreateCustomerForm.controls["pickupaddress"].setValue("", {
              onlySelf: true,
            });
            this.CreateCustomerForm.controls["dropaddress"].setValue("", {
              onlySelf: true,
            });
            this.CreateCustomerForm.controls["enginenumber"].setValue("", {
              onlySelf: true,
            });

            this.CreateCustomerForm.controls["color"].setValue("", {
              onlySelf: true,
            });

            this.CreateCustomerForm.controls["drivername"].setValue("", {
              onlySelf: true,
            });

            this.CreateCustomerForm.controls["driverno"].setValue("", {
              onlySelf: true,
            });

            this.CreateCustomerForm.controls["gstno"].setValue("", {
              onlySelf: true,
            });
            this.showdisbale = false;
            this.inputcolor = "#fff";
            this.CreateCustomerForm.controls["vechilenumber"].enable();
            this.CreateCustomerForm.controls["chassisnumber"].enable();
            this.CreateCustomerForm.controls["customername"].enable();
            this.CreateCustomerForm.controls["mobileOneNo"].enable();
            this.CreateCustomerForm.controls["searchVehicle"].enable();
            this.CreateCustomerForm.controls["mobileTwoNo"].enable();
            this.CreateCustomerForm.controls["kmread"].enable();
            this.CreateCustomerForm.controls["email"].enable();
            this.CreateCustomerForm.controls["dob"].enable();
            this.CreateCustomerForm.controls["pickupaddress"].enable();
            this.CreateCustomerForm.controls["dropaddress"].enable();
            this.CreateCustomerForm.controls["enginenumber"].enable();
            this.CreateCustomerForm.controls["color"].enable();
            this.CreateCustomerForm.controls["drivername"].enable();
            this.CreateCustomerForm.controls["driverno"].enable();
            this.CreateCustomerForm.controls["gstno"].enable();
            this.showInvoiceForm = false;
            this.showspinner.setSpinnerForLogin(false);
          } else {
            this.askForUpadte = false;
            this.showspinner.setSpinnerForLogin(false);
            console.log("Not found");
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
  //Update cutsomer details
  updatecustomerdetails() {
    this.closebutton.nativeElement.click();
    if (this.dupSelectedDataarrOfVehicle) {
      this.SelectedDataarrOfVehicle = this.dupSelectedDataarrOfVehicle;

      this.CreateCustomerForm.controls["twowheetertype"].setValue(
        this.dupVehicleType,
        { onlySelf: true }
      );
      this.CreateCustomerForm.value.twowheetertype = this.dupVehicleType;
    }
    if (this.CreateCustomerForm.value.mobileOneNo == "") {
      this.CreateCustomerForm.value.mobileOneNo = 0;
    } else {
      this.CreateCustomerForm.value.mobileOneNo = parseInt(
        this.CreateCustomerForm.value.mobileOneNo
      );
    }
    if (this.CreateCustomerForm.value.mobileTwoNo == "") {
      this.CreateCustomerForm.value.mobileTwoNo = 0;
    } else {
      this.CreateCustomerForm.value.mobileTwoNo = parseInt(
        this.CreateCustomerForm.value.mobileTwoNo
      );
    }
    if (this.CreateCustomerForm.value.driverno == "") {
      this.CreateCustomerForm.value.driverno = 0;
    } else {
      this.CreateCustomerForm.value.driverno = parseInt(
        this.CreateCustomerForm.value.driverno
      );
    }
    if (
      this.CreateCustomerForm.value.dob == null ||
      this.CreateCustomerForm.value.dob == "" ||
      this.CreateCustomerForm.value.dob == undefined
    ) {
      this.CreateCustomerForm.value.dob = "";
    } else {
      var dateDob = new Date(this.CreateCustomerForm.value.dob);
      this.CreateCustomerForm.value.dob =
        dateDob.getFullYear() +
        "-" +
        ("0" + (dateDob.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + dateDob.getDate()).slice(-2);
    }
    if (this.samePickup == true) {
      this.CreateCustomerForm.value.dropaddress =
        this.CreateCustomerForm.value.pickupaddress;
    }
    if (this.getColor == undefined) {
      this.getColor = "#ffffff";
    }
    if (this.CreateCustomerForm.value.varri == this.varrimessage) {
      this.CreateCustomerForm.value.varri = "";
    }
    var jobcardnumberforcus;
    if (this.jobcardEditOrCreate == "create") {
      jobcardnumberforcus = this.jocardnumber;
    } else {
      jobcardnumberforcus = this.jobcardArrayForEdit.jobcard_number;
    }
    this.general
      .CreateNewCustomerUpdateJobcard(
        jobcardnumberforcus,
        this.CreateCustomerForm.value.vechilenumber,
        this.CreateCustomerForm.value.chassisnumber,
        this.SelectedDataarrOfVehicle.vehicle_type,
        this.SelectedDataarrOfVehicle.make,
        this.SelectedDataarrOfVehicle.model,
        this.SelectedDataarrOfVehicle.variant,
        this.CreateCustomerForm.value.customername,
        this.CreateCustomerForm.value.mobileOneNo,
        this.CreateCustomerForm.value.mobileTwoNo,
        this.CreateCustomerForm.value.email,
        this.CreateCustomerForm.value.dob,
        this.CreateCustomerForm.value.pickupaddress,
        this.CreateCustomerForm.value.dropaddress,
        this.CreateCustomerForm.value.enginenumber,
        this.getColor,
        this.CreateCustomerForm.value.drivername,
        this.CreateCustomerForm.value.driverno,
        this.CreateCustomerForm.value.gstno,
        this.CreateCustomerForm.value.kmread,
        this.userworkshopid
      )
      .subscribe(
        (saveCustomer) => {
          this.showspinner.setSpinnerForLogin(true);
          if (saveCustomer["success"] == true) {
            (this.selectedCustomer.customer_name =
              this.CreateCustomerForm.value.customername),
              (this.selectedCustomer.customer_mobile =
                this.CreateCustomerForm.value.mobileOneNo),
              (this.selectedCustomer.customer_mobile_2 =
                this.CreateCustomerForm.value.mobileTwoNo),
              (this.selectedCustomer.chassis_number =
                this.CreateCustomerForm.value.chassisnumber),
              (this.selectedCustomer.vehicle_type =
                this.SelectedDataarrOfVehicle.vehicle_type),
              (this.selectedCustomer.vehicle_number =
                this.CreateCustomerForm.value.vechilenumber),
              (this.selectedCustomer.engine_number =
                this.CreateCustomerForm.value.enginenumber),
              (this.selectedCustomer.vehicle_make =
                this.SelectedDataarrOfVehicle.make),
              (this.selectedCustomer.vehicle_model =
                this.SelectedDataarrOfVehicle.model),
              (this.selectedCustomer.customer_email =
                this.CreateCustomerForm.value.email),
              (this.selectedCustomer.customer_dob =
                this.CreateCustomerForm.value.dob),
              (this.selectedCustomer.pick_up_address =
                this.CreateCustomerForm.value.pickupaddress),
              (this.selectedCustomer.drop_address =
                this.CreateCustomerForm.value.dropaddress),
              (this.selectedCustomer.driver_name =
                this.CreateCustomerForm.value.drivername),
              (this.selectedCustomer.driver_mobile =
                this.CreateCustomerForm.value.driverno),
              (this.customerProfileId = saveCustomer["id"]);
            this.customerProfileName =
              this.CreateCustomerForm.getRawValue().customername;
            this.customerProfileMobile =
              this.CreateCustomerForm.getRawValue().mobileOneNo;
            this.snakBar.open("Customer Data Updated", "", {
              duration: 4000,
            });
            this.setvechilenumber = this.CreateCustomerForm.value.vechilenumber;
            this.shoeupdate = false;
            this.showdisbale = true;

            // this.inputcolor = "#d2d0d0";
            // this.CreateCustomerForm.controls["vechilenumber"].disable();
            // this.CreateCustomerForm.controls["chassisnumber"].disable();
            // this.CreateCustomerForm.controls["customername"].disable();
            // this.CreateCustomerForm.controls["mobileOneNo"].disable();
            // this.CreateCustomerForm.controls["searchVehicle"].disable();
            // this.CreateCustomerForm.controls["mobileTwoNo"].disable();
            // this.CreateCustomerForm.controls["kmread"].disable();
            // this.CreateCustomerForm.controls["email"].disable();
            // this.CreateCustomerForm.controls["dob"].disable();
            // this.CreateCustomerForm.controls["pickupaddress"].disable();
            // this.CreateCustomerForm.controls["dropaddress"].disable();
            // this.CreateCustomerForm.controls["enginenumber"].disable();
            // this.CreateCustomerForm.controls["color"].disable();
            // this.CreateCustomerForm.controls["drivername"].disable();
            // this.CreateCustomerForm.controls["driverno"].disable();
            // this.CreateCustomerForm.controls["gstno"].disable();
            this.showspinner.setSpinnerForLogin(false);
          } else {
            this.customerProfileId = saveCustomer["id"];
            this.setvechilenumber = this.CreateCustomerForm.value.vechilenumber;
            this.shoeupdate = false;
            this.showdisbale = true;

            // this.inputcolor = "#d2d0d0";
            // this.CreateCustomerForm.controls["vechilenumber"].disable();
            // this.CreateCustomerForm.controls["chassisnumber"].disable();
            // this.CreateCustomerForm.controls["customername"].disable();
            // this.CreateCustomerForm.controls["mobileOneNo"].disable();
            // this.CreateCustomerForm.controls["searchVehicle"].disable();
            // this.CreateCustomerForm.controls["mobileTwoNo"].disable();
            // this.CreateCustomerForm.controls["kmread"].disable();
            // this.CreateCustomerForm.controls["email"].disable();
            // this.CreateCustomerForm.controls["dob"].disable();
            // this.CreateCustomerForm.controls["pickupaddress"].disable();
            // this.CreateCustomerForm.controls["dropaddress"].disable();
            // this.CreateCustomerForm.controls["enginenumber"].disable();
            // this.CreateCustomerForm.controls["color"].disable();
            // this.CreateCustomerForm.controls["drivername"].disable();
            // this.CreateCustomerForm.controls["driverno"].disable();
            // this.CreateCustomerForm.controls["gstno"].disable();
            this.showspinner.setSpinnerForLogin(false);
            this.snakBar.open("Message", "Please Create Jobcard", {
              duration: 4000,
            });
          }
        },
        (err) => {
          this.showspinner.setSpinnerForLogin(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  // cancel update of the customer details
  cancelupdatecustomerdetails() {
    this.shoeupdate = false;
    this.showdisbale = true;
    this.inputcolor = "#d2d0d0";
    this.CreateCustomerForm.controls["vechilenumber"].disable();
    this.CreateCustomerForm.controls["chassisnumber"].disable();
    this.CreateCustomerForm.controls["customername"].disable();
    this.CreateCustomerForm.controls["mobileOneNo"].disable();
    this.CreateCustomerForm.controls["searchVehicle"].disable();
    this.CreateCustomerForm.controls["mobileTwoNo"].disable();
    this.CreateCustomerForm.controls["kmread"].disable();
    this.CreateCustomerForm.controls["email"].disable();
    this.CreateCustomerForm.controls["dob"].disable();
    this.CreateCustomerForm.controls["pickupaddress"].disable();
    this.CreateCustomerForm.controls["dropaddress"].disable();
    this.CreateCustomerForm.controls["enginenumber"].disable();
    this.CreateCustomerForm.controls["color"].disable();
    this.CreateCustomerForm.controls["drivername"].disable();
    this.CreateCustomerForm.controls["driverno"].disable();
    this.CreateCustomerForm.controls["gstno"].disable();
  }
  //---------------------------SHORT INVOICE FORM---------------------------------------------------
  // Select the Discount will be in percent or in rupee
  selectDiscountOption(event) {
    this.eventForDiscount = event;
    this.calculateDiscount(this.eventForDiscount);
  }
  // Calculation on discount change
  onDiscountChange(e) {
    if (this.regex.test(e) == false) {
      this.Discounterrors = true;
    } else {
      if (this.duplicatedisc > e) {
        this.Discounterrors = true;
      } else {
        this.Discounterrors = false;
        this.discount = parseInt(e);
        this.calculateDiscount(this.eventForDiscount);
      }
    }
  }
  // Calculation on Advance change
  onAdvanceChange(e) {
    if (this.regex.test(e) == false) {
      this.Advanceerrors = true;
    } else {
      this.Advanceerrors = false;
      this.advanceAmount = e;
      //this.calculateDiscount(this.eventForDiscount)
    }
  }
  // Calculation on Paid change
  onPaidChange(e) {
    if (this.regex.test(e) == false) {
      this.Paiderrors = true;
    } else {
      if (
        this.totalyclosethejobcard == true &&
        Number(this.jobcardArrayForEdit.balance_amount) != 0
      ) {
        if (Number(this.jobcardArrayForEdit.paid_amount) > Number(e)) {
          this.Paiderrors = true;
        } else {
          this.Paiderrors = false;
        }
      } else {
        this.Paiderrors = false;
      }
      this.totalPaid = e;
      this.totalBalance = this.totalPayable - this.totalPaid;
      this.billedAmount = this.totalPayable - this.totalPaid;
    }
  }
  // Calculation on CGST change
  onCgstChnage(e) {
    if (this.regex.test(e) == false) {
      this.CGSTerrors = true;
    } else {
      this.CGSTerrors = false;
    }
  }
  // Calculation on GST change
  onGstChnage(e) {
    if (this.regex.test(e) == false) {
      this.GSTerrors = true;
    } else {
      this.GSTerrors = false;
    }
  }
  // Calculation on SGST change
  onSgstChnage(e) {
    if (this.regex.test(e) == false) {
      this.SGSTerrors = true;
    } else {
      this.SGSTerrors = false;
    }
  }
  // Calculation on Total Amount change
  onTotalAmountChnage(e) {
    this.calculateDiscount(this.eventForDiscount);
    if (this.regex.test(e) == false) {
      this.totalamounterror = true;
    } else {
      this.totalamounterror = false;
    }
  }

  //function for the total table
  getTotal() {
    this.totaldatatable = [
      ...this.jobdatatabel,
      ...this.sparedatatabel,
      ...this.lubedatatabel,
    ];
  }
  //function for every delete through total table
  onRemoveFromTotal(data) {
    if (data.category == "spare") {
      var pos = this.sparedatatabel
        .map(function (e) {
          return e.id;
        })
        .indexOf(data.id);
      // console.log("pos", pos);
      this.removeSpareItem(data, pos);
    } else if (data.category == "lube") {
      var pos = this.lubedatatabel
        .map(function (e) {
          return e.id;
        })
        .indexOf(data.id);
      // console.log("pos", pos);
      this.removeLubeItem(data, pos);
    } else if (data.category == "job") {
      var pos = this.jobdatatabel
        .map(function (e) {
          return e.id;
        })
        .indexOf(data.id);
      // console.log("pos", pos);
      this.removeJobItem(data, pos);
    }
    this.totaldatatable = this.totaldatatable.filter(
      (obj) => obj.id !== data.id
    );
  }
  // Calculation on Discount Amount change
  calculateDiscount(eventcheck) {
    if (eventcheck == "%") {
      this.totalPayable = Number(
        Math.round(
          this.totalAmount * ((100 - this.discount) / 100) - this.advanceAmount
        ).toFixed(2)
      );
      // this.totalPaid = Math.round(this.totalPayable);

      this.totalBalance = this.totalPayable - this.totalPaid;
      this.billedAmount = this.totalPayable - this.totalPaid;
    } else {
      this.totalPayable = this.totalAmount - this.advanceAmount - this.discount;
      //this.totalPaid=this.totalPayable
      this.totalBalance = this.totalPayable - this.totalPaid;
      this.billedAmount = this.totalPayable - this.totalPaid;
    }
    this.gstUpdatedCal();
  }
  // Payment model changes
  onPaymentChnage(event) {
    if (event == "cheque") {
      this.paymentMethod = "cheque";
      if (this.checqueOrTransticon == "") {
        this.Chequeerror = true;
        this.transerror = false;
      } else {
        this.Chequeerror = false;
        this.transerror = false;
      }
    } else if (event != "cash" && event != "cheque" && event != "") {
      this.paymentMethod = event;
      if (this.checqueOrTransticon == "") {
        this.Chequeerror = false;
        this.transerror = true;
      } else {
        this.Chequeerror = false;
        this.transerror = false;
      }
    } else {
      this.paymentMethod = event;
      this.Chequeerror = false;
      this.transerror = false;
    }
  }
  // Exit note
  onExitNoteChange(event) {
    this.exitNote = event;
  }
  // Tranaction id
  addtrantion(event) {
    if (event == "") {
      if (this.paymentMethod == "cheque") {
        this.Chequeerror = true;
        this.transerror = false;
      } else if (this.paymentMethod == "transanction") {
        this.transerror = true;
        this.Chequeerror = false;
      } else {
        this.transerror = false;
        this.Chequeerror = false;
      }
    } else {
      this.transerror = false;
      this.Chequeerror = false;
    }
    this.checqueOrTransticon = event;
  }
  // Short invoice Reminder option
  reminderOption(event) {
    this.reminderKM = event;
  }
  // Short invoice Reminder Period
  reminderPriod(event) {
    this.reminderperiod = event;
  }
  // Short invoice Deliver Date with validation
  deliveryDate(event) {
    this.ddate = false;
    //this.ddateenable=true
    var eventDate = new Date(event);
    this.deliveryDateFieldForAdd =
      eventDate.getFullYear() +
      "-" +
      ("0" + (eventDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + eventDate.getDate()).slice(-2);
    if (this.deliveryTimeField == "") {
      this.dtime = true;
    } else {
      this.dtime = false;
    }
  }
  // Short invoice Deliver Time with validation
  convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(" ");

    let [hours, minutes] = time.split(":");

    if (hours === "12") {
      hours = "00";
    }

    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  };
  deliveryTime(event) {
    this.dtime = false;
    //this.dtimeenable=true
    this.deliveryTimeField = this.convertTime12to24(event);
    if (this.deliveryDateFieldForAdd == undefined) {
      this.ddate = true;
    } else {
      this.ddate = false;
    }
  }
  // Calculate total Billing of the short invoice
  calculateAmountOfBilling() {
    setTimeout(
      () =>
        (this.totalAmount = this.SpareTotal + this.LubeTotal + this.JobTotal),
      100
    );
    setTimeout(() => this.onTotalAmountChnage(this.totalAmount), 200);
  }
  // Calculate total Price for the Short Invoice
  checkpricefortotal(price, amount, type) {
    this.totalamountonform = price;
    if (this.allBillingData.gst_number != "") {
      var GSTCal = this.CalculateInclusiveGSTRate(price, amount, type);
      this.toShowcgst = GSTCal[0]["CGST"];
      this.toShowsgst = GSTCal[0]["SGST"];
      this.toShowtotal_gst = GSTCal[0]["GSTAmount"];
    }
  }
  //Create Short Invoice Form BY API
  createShortInvoice(mode) {
    var checkstaffarr = Array();
    var jobcardSettings;
    if (this.jobcardEditOrCreate == "edit") {
      if (!this.createdJobcardSetting.item_wise_discount) {
        this.createdJobcardSetting["item_wise_discount"] =
          this.jobcardSettingData.item_wise_discount;
        jobcardSettings = this.createdJobcardSetting;
      } else {
        jobcardSettings = JSON.parse(
          this.jobcardArrayForEdit.settings_data_json
        );
      }
    } else {
      jobcardSettings = {
        jobwise_mechanic: this.jobcardSettingData.jobwise_mechanic,
        gst_number: this.allBillingData.gst_number,
        showVechileNo: this.showVechileNo,
        samePickup: this.samePickup,
        engine_chassis_number: this.jobcardSettingData.engine_chassis_number,
        vehicle_color: this.jobcardSettingData.vehicle_color,
        customer_mobile_number: this.jobcardSettingData.customer_mobile_number,
        customer_email: this.jobcardSettingData.customer_email,
        customer_birthday: this.jobcardSettingData.customer_birthday,
        customer_pickup_address:
          this.jobcardSettingData.customer_pickup_address,
        customer_delivery_address:
          this.jobcardSettingData.customer_delivery_address,
        driver_details: this.jobcardSettingData.driver_details,
        item_wise_discount: this.jobcardSettingData.item_wise_discount,
        newregister: this.newregister,
      };
    }
    if (this.jobcardEditOrCreate != "edit") {
      if (this.jobcardSettingData.jobwise_mechanic != 0) {
        if (this.sparedatatabel.length != 0) {
          this.sparedatatabel = this.sparedatatabel.map((spare) => {
            spare.spareassignedmechanic.map((data) => {
              if (!checkstaffarr.includes(data)) {
                checkstaffarr.push(data);
                this.assignedMechanicArray.push(data);
                if (!this.jobcardStaff.includes(data)) {
                  this.jobcardStaff.push(data);
                }
              }
            });
            return spare;
          });
        }
        if (this.jobdatatabel.length != 0) {
          this.jobdatatabel = this.jobdatatabel.map((job) => {
            job.jobassignedmechanic.map((datajob) => {
              if (!checkstaffarr.includes(datajob)) {
                checkstaffarr.push(datajob);
                this.assignedMechanicArray.push(datajob);

                if (!this.jobcardStaff.includes(datajob)) {
                  this.jobcardStaff.push(datajob);
                }
              }
            });
            return job;
          });
        }
        if (this.lubedatatabel.length != 0) {
          this.lubedatatabel = this.lubedatatabel.map((lube) => {
            lube.lubeassignedmechanic.map((datalube) => {
              if (!checkstaffarr.includes(datalube)) {
                checkstaffarr.push(datalube);
                this.assignedMechanicArray.push(datalube);

                if (!this.jobcardStaff.includes(datalube)) {
                  this.jobcardStaff.push(datalube);
                }
              }
            });
            return lube;
          });
        }
      }
    } else {
      if (this.createdJobcardSetting.jobwise_mechanic != 0) {
        if (this.sparedatatabel.length != 0) {
          this.sparedatatabel = this.sparedatatabel.map((spare) => {
            spare.spareassignedmechanic.map((data) => {
              if (!checkstaffarr.includes(data)) {
                checkstaffarr.push(data);
                this.assignedMechanicArray.push(data);

                if (!this.jobcardStaff.includes(data)) {
                  this.jobcardStaff.push(data);
                }
              }
            });
            return spare;
          });
        }
        if (this.jobdatatabel.length != 0) {
          this.jobdatatabel = this.jobdatatabel.map((job) => {
            job.jobassignedmechanic.map((datajob) => {
              if (!checkstaffarr.includes(datajob)) {
                checkstaffarr.push(datajob);
                this.assignedMechanicArray.push(datajob);

                if (!this.jobcardStaff.includes(datajob)) {
                  this.jobcardStaff.push(datajob);
                }
              }
            });
            return job;
          });
        }
        if (this.lubedatatabel.length != 0) {
          this.lubedatatabel = this.lubedatatabel.map((lube) => {
            lube.lubeassignedmechanic.map((datalube) => {
              if (!checkstaffarr.includes(datalube)) {
                checkstaffarr.push(datalube);
                this.assignedMechanicArray.push(datalube);
                if (!this.jobcardStaff.includes(datalube)) {
                  this.jobcardStaff.push(datalube);
                }
              }
            });
            lube.userEditTotalAmount = lube.amount;
            lube.userEditAmt = lube.unit_sale_price;
            lube.userEditQty = lube.qunatity;
            return lube;
          });
        }
      }
    }
    // var vechileDetails
    // var makeVechile
    // var modelVechile
    // var variVechile
    // var varitype
    // if(this.CreateCustomerForm.getRawValue().make==this.makemessage){
    //   makeVechile=""
    // }else{
    //   makeVechile=this.CreateCustomerForm.getRawValue().make
    // }
    // if(this.CreateCustomerForm.getRawValue().model==this.modelmessage){
    //   modelVechile=""
    // }else{
    //   modelVechile=this.CreateCustomerForm.getRawValue().model
    // }
    // if(this.CreateCustomerForm.getRawValue().varri==this.varrimessage){
    //   variVechile=""
    // }else{
    //   variVechile=this.CreateCustomerForm.getRawValue().varri
    // }
    // if(this.CreateCustomerForm.getRawValue().type==""){
    //   variVechile=""
    // }else{
    //   varitype=this.CreateCustomerForm.getRawValue().type
    // }
    // vechileDetails={"type":varitype,
    //                 "vehicle_make":makeVechile,
    //                 "vehicle_model":modelVechile,
    //                 "vehicle_variant":variVechile
    //                 }
    // if (
    //   this.deliveryDateFieldForAdd != undefined &&
    //   this.deliveryTimeField != null
    // ) {
    //   var deliveryDteTime =
    //     this.deliveryDateFieldForAdd + " " + this.deliveryTimeField + ":00";
    // } else {
    //   var deliveryDteTime =
    //     this.today.getFullYear().toString() +
    //     "-" +
    //     (this.today.getMonth() + 1).toString() +
    //     "-" +
    //     this.today.getDate().toString() +
    //     " 00:00:00";
    // }
    let deliveryDayDefault;
    let deliveryTimeDefault;

    this.deliveryDateFieldForAdd != undefined ?
    deliveryDayDefault = this.deliveryDateFieldForAdd :
    deliveryDayDefault = this.today.getFullYear().toString() +
    "-" +
    (this.today.getMonth() + 1).toString() +
    "-" +
    this.today.getDate().toString() 
   

    this.deliveryTimeField != null ?
    deliveryTimeDefault = this.deliveryTimeField + ":00":
    deliveryTimeDefault = "00:00:00" 
    
    var deliveryDteTime = deliveryDayDefault + ' ' + deliveryTimeDefault
   
    var currentdate = new Date(deliveryDteTime);
    var reminderperioddate = new Date(
      currentdate.setMonth(
        currentdate.getMonth() + parseInt(this.reminderperiod.split(" ")[0])
      )
    );
    var remiderforsameday =
      reminderperioddate.getFullYear().toString() +
      "-" +
      ("0" + (reminderperioddate.getMonth() + 1)).slice(-2).toString() +
      "-" +
      ("0" + reminderperioddate.getDate()).slice(-2).toString() +
      " 08:00:00";
    var remiderforsamedayonlydate =
      reminderperioddate.getFullYear().toString() +
      "-" +
      ("0" + (reminderperioddate.getMonth() + 1)).slice(-2).toString() +
      "-" +
      ("0" + reminderperioddate.getDate()).slice(-2).toString();
    var parseddate = new Date(remiderforsameday);
    var newaddfivedate = new Date(parseddate.setDate(parseddate.getDate() + 5));
    var newminusfivedate = new Date(
      parseddate.setDate(parseddate.getDate() - 5)
    );
    var remiderforsamedayaddfive =
      newaddfivedate.getFullYear().toString() +
      "-" +
      ("0" + (newaddfivedate.getMonth() + 1)).slice(-2).toString() +
      "-" +
      ("0" + newaddfivedate.getDate()).slice(-2).toString() +
      " 08:00:00";
    var remiderforsamedayaddfiveonlydate =
      newaddfivedate.getFullYear().toString() +
      "-" +
      ("0" + (newaddfivedate.getMonth() + 1)).slice(-2).toString() +
      "-" +
      ("0" + newaddfivedate.getDate()).slice(-2).toString();
    if (newminusfivedate.getDate() - 5 == 0) {
      var remiderforsamedayminusfive =
        newminusfivedate.getFullYear().toString() +
        "-" +
        ("0" + (newminusfivedate.getMonth() + 1)).slice(-2).toString() +
        "-" +
        ("0" + (newminusfivedate.getDate() - 5 + 1)).slice(-2).toString() +
        " 08:00:00";
      var remiderforsamedayminusfiveonlydate =
        newminusfivedate.getFullYear().toString() +
        "-" +
        ("0" + (newminusfivedate.getMonth() + 1)).slice(-2).toString() +
        "-" +
        ("0" + (newminusfivedate.getDate() - 5 + 1)).slice(-2).toString();
    } else {
      var remiderforsamedayminusfive =
        newminusfivedate.getFullYear().toString() +
        "-" +
        ("0" + (newminusfivedate.getMonth() + 1)).slice(-2).toString() +
        "-" +
        ("0" + (newminusfivedate.getDate() - 5)).slice(-2).toString() +
        " 08:00:00";
      var remiderforsamedayminusfiveonlydate =
        newminusfivedate.getFullYear().toString() +
        "-" +
        ("0" + (newminusfivedate.getMonth() + 1)).slice(-2).toString() +
        "-" +
        ("0" + (newminusfivedate.getDate() - 5)).slice(-2).toString();
    }
    var getreminders = this.createReminderMessage(
      remiderforsamedayonlydate,
      remiderforsamedayaddfiveonlydate,
      remiderforsamedayminusfiveonlydate
    );
    var reminder_priority = getreminders[0];
    var reminderoneres = getreminders[1];
    var remindertwores = getreminders[2];
    var reminderthreeres = getreminders[3];

    if (this.assignedMechanicArray.length == 0) {
      this.assignedMechanicArray = this.selectedItemOfStaff;
    }
    var setmode;
    var status;
    var completedate;
    var closeddate;
    if (mode == "update") {
      setmode = mode;
      completedate = this.jobcardArrayForEdit.complete_date;
      closeddate = this.jobcardArrayForEdit.closed_date;
      status = parseInt(this.jobacrdStatus);
    } else if (mode == "create") {
      setmode = mode;
      status = 2;
      completedate = deliveryDteTime;
     
      closeddate = deliveryDteTime;
      // completedate = "";
      var currentdateforcard = new Date();
      // closeddate =
      //   currentdateforcard.getFullYear().toString() +
      //   "-" +
      //   ("0" + (currentdateforcard.getMonth() + 1)).slice(-2).toString() +
      //   "-" +
      //   ("0" + currentdateforcard.getDate()).slice(-2).toString() +
      //   " " +
      //   currentdateforcard.getHours().toString() +
      //   ":" +
      //   ("0" + currentdateforcard.getMinutes()).slice(-2).toString() +
      //   ":" +
      //   ("0" + currentdateforcard.getSeconds()).slice(-2).toString();
    } else if (mode == "updateToComplete") {
      setmode = "update";
      status = 2;
      completedate = this.jobcardArrayForEdit.complete_date;
      closeddate = this.jobcardArrayForEdit.closed_date;
    } else if (mode == "updateToColosed") {
      setmode = "update";
      status = 2;
      completedate = this.jobcardArrayForEdit.complete_date;
      closeddate = this.jobcardArrayForEdit.closed_date;
    }
    if (mode == "create") {
      this.general
        .jobCradstatus(this.userworkshopid, this.jocardnumber)
        .subscribe((stats) => {
          if (stats["success"] == false) {
            let getYear = this.jobcardSettingData.year;
            this.yearForJobcard = getYear.split("")[0];
            if (this.jobcardSettingData.jobcard_no_series_count.length == 1) {
              this.jobcardSettingData.jobcard_no_series_count =
                "00" + this.jobcardSettingData.jobcard_no_series_count + 1;
            } else if (
              this.jobcardSettingData.jobcard_no_series_count.length == 2
            ) {
              this.jobcardSettingData.jobcard_no_series_count =
                "0" + this.jobcardSettingData.jobcard_no_series_count + 1;
            } else {
              this.jobcardSettingData.jobcard_no_series_count =
                this.jobcardSettingData.jobcard_no_series_count + 1;
            }
            if (this.jobcardSettingData.custom_jobcard_number == "0") {
              let month =
                (this.date.getMonth() + 1).toString().length === 1
                  ? "0" + (this.date.getMonth() + 1)
                  : this.date.getMonth() + 1;
              this.jocardnumber =
                this.yearForJobcard +
                ("0" + month).slice(-2).toString() +
                ("0" + this.date.getDate()).slice(-2).toString() +
                "-" +
                this.jobcardSettingData.jobcard_no_series_count;
            } else {
              let month =
                (this.date.getMonth() + 1).toString().length === 1
                  ? "0" + (this.date.getMonth() + 1)
                  : this.date.getMonth() + 1;
              this.jocardnumber =
                this.yearForJobcard +
                ("0" + month).slice(-2).toString() +
                ("0" + this.date.getDate()).slice(-2).toString() +
                "-C" +
                this.jobcardSettingData.jobcard_no_series_count;
            }
          }
        });
    }
    var jobtotaldiscount = 0;
    var sparetotaldiscount = 0;
    var lubetotaldiscount = 0;
    var jobtotalamt = 0;
    var sparetotalamt = 0;
    var lubetotalamt = 0;
    if (this.jobdatatabel.length != 0) {
      this.jobdatatabel.map((disc) => {
        jobtotalamt += parseInt(disc.amount)
        if (disc.discounttype == "₹") {
          jobtotaldiscount +=
            parseInt(disc.discountvalue) * parseFloat(disc.quantity);
        } else {
          var discountedvalue;
          if (disc.sale_tax_type == "Inclusive") {
            discountedvalue =
              ((parseFloat(disc.unit_sale_price) * parseFloat(disc.quantity)) /
                (1 + parseInt(disc.sale_gst_rate) / 100)) *
              (parseInt(disc.discountvalue) / 100);
          } else {
            discountedvalue =
              parseFloat(disc.unit_sale_price) *
              parseFloat(disc.quantity) *
              (parseInt(disc.discountvalue) / 100);
          }
          jobtotaldiscount += discountedvalue;
        }
      });
    }

    if (this.sparedatatabel.length != 0) {
      this.sparedatatabel.map((disc) => {
        sparetotalamt += parseInt(disc.amount)
        if (disc.discounttype == "₹") {
          sparetotaldiscount += parseInt(disc.discountvalue);
        } else {
          var discountedvalue;
          if (disc.sale_tax_type == "Inclusive") {
            discountedvalue =
              (parseFloat(disc.unit_sale_price) /
                (1 + parseInt(disc.sale_gst_rate) / 100)) *
              (parseInt(disc.discountvalue) / 100);
          } else {
            discountedvalue =
              parseFloat(disc.unit_sale_price) *
              (parseInt(disc.discountvalue) / 100);
          }
          sparetotaldiscount += discountedvalue;
        }
      });
    }

    if (this.lubedatatabel.length != 0) {
      this.lubedatatabel.map((disc) => {
        lubetotalamt += parseInt(disc.amount)
        if (disc.discounttype == "₹") {
          lubetotaldiscount += parseInt(disc.discountvalue);
        } else {
          var discountedvalue;
          if (disc.sale_tax_type == "Inclusive") {
            discountedvalue =
              (parseFloat(disc.unit_sale_price) /
                (1 + parseInt(disc.sale_gst_rate) / 100)) *
              (parseInt(disc.discountvalue) / 100);
          } else {
            discountedvalue =
              parseFloat(disc.unit_sale_price) *
              (parseInt(disc.discountvalue) / 100);
          }
          lubetotaldiscount += discountedvalue;
        }
      });
    }
    var sectiondis = [];
    sectiondis.push({
      jobdis: this.jodisvalue,
      jobdisable: this.showjobdis.toString(),
      jobitemdis: this.showjobdisitem.toString(),
      sparedis: this.spareisvalue,
      sparedisable: this.showsparedis.toString(),
      spareitemdis: this.showsparedisitem.toString(),
      lubedis: this.lubeisvalue,
      lubedisable: this.showlubedis.toString(),
      lubeitemdis: this.showlubedisitem.toString(),
    });
    this.general
      .createShortInvoice(
        setmode,
        this.userworkshopid,
        this.jocardnumber,
        JSON.stringify(this.sparedatatabel),
        JSON.stringify(this.jobdatatabel),
        // JSON.stringify(this.assignedMechanicArray),
        JSON.stringify(this.jobcardStaff),
        "",
        "",
        "",
        JSON.stringify(this.lubedatatabel),
        JSON.stringify(this.SelectedVoice),
        this.CreateCustomerForm.getRawValue().vechilenumber,
        this.customerProfileId,
        JSON.stringify(this.SelectedDataarrOfVehicle),
        deliveryDteTime,
        null,
        1,
        "",
        status,
        this.totalAmount,
        this.advanceAmount,
        this.discount + " " + this.eventForDiscount,
        this.totalPayable,
        this.totalBalance,
        this.totalPaid,
        (this.calTotalGstForSpareamount +
          this.calTotalGstForLubeamount +
          this.calTotalGstForJobamount) /
          2,
        (this.calTotalGstForSpareamount +
          this.calTotalGstForLubeamount +
          this.calTotalGstForJobamount) /
          2,
        null,
        this.calTotalGstForSpareamount +
          this.calTotalGstForLubeamount +
          this.calTotalGstForJobamount,
        this.exitNote, //nul,
        "",
        sparetotalamt,
        lubetotalamt,
        jobtotalamt,
        this.reminderKM,
        this.reminderperiod,
        this.paymentMethod,
        this.checqueOrTransticon, //nul,
        sparetotaldiscount.toFixed(2),
        lubetotaldiscount.toFixed(2),
        jobtotaldiscount.toFixed(2),
        null,
        null,
        "",
        null,
        1,
        "1",
        this.customerProfileName,
        this.customerProfileMobile,
        "reminder_jobcard_form",
        this.smsAlretValue.toString(),
        remiderforsamedayminusfive,
        remiderforsameday,
        remiderforsamedayaddfive,
        reminderoneres,
        remindertwores,
        reminderthreeres,
        reminder_priority,
        JSON.stringify(jobcardSettings),
        completedate,
        closeddate,
        this.kmvehicle,
        this.valueset,
        "manual",
        JSON.stringify(sectiondis),
        this.selectedItemOfSupervisor
      )
      .subscribe(
        (createResult) => {
          this.showspinner.setSpinnerForLogin(true);
          if (createResult.success == true) {
            if (mode != "create") {
              this.showspinner.setSpinnerForLogin(false);
              this.snakBar.open("Message", "Jobcard Updated Successfully", {
                duration: 4000,
              });
            } else {
              this.showspinner.setSpinnerForLogin(false);
              this.snakBar.open(
                "Message",
                ErrorMessgae[0][createResult["message"]],
                {
                  duration: 4000,
                }
              );
            }
            if (this.QuantityObject.length != 0) {
              this.general
                .updateLubeSpareQuantity(
                  this.userworkshopid,
                  this.QuantityObject
                )
                .subscribe(
                  (data) => {
                    // console.log(data);
                  },
                  (error) => {
                    this.showspinner.setSpinnerForLogin(false);
                    this.snakBar.open("Error", ErrorMessgae[0][error], {
                      duration: 4000,
                    });
                  }
                );
            }
            // if(mode=='create'){
            //   if(this.smsAlretValue==true){
            //     if(this.customerProfileMobile2==0){
            //       var message="Dear Customer, Your"+this.SelectedDataarrOfVehicle.model+" "+this.CreateCustomerForm.getRawValue().vechilenumber.substr(this.CreateCustomerForm.getRawValue().vechilenumber.length - 4) +" is ready. Apprx. Bill Amount: Rs."+this.totalPayable+"/- Pickup your Vehicle.Thanks. "+ this.userService.getData()["workshop_name"]+" "+this.customerProfileMobile
            //       if(message.length>160){
            //         var message="Dear Customer, Your"+this.SelectedDataarrOfVehicle.model+" "+this.CreateCustomerForm.getRawValue().vechilenumber.substr(this.CreateCustomerForm.getRawValue().vechilenumber.length - 4) +" is ready. Apprx. Bill Amount: Rs."+this.totalPayable+"/- Pickup your Vehicle.Thanks. "+ this.userService.getData()["workshop_name"].substring(0, 5)+" "+this.customerProfileMobile
            //       }
            //     }else{
            //       var message="Dear Customer, Your"+this.SelectedDataarrOfVehicle.model+" "+this.CreateCustomerForm.getRawValue().vechilenumber.substr(this.CreateCustomerForm.getRawValue().vechilenumber.length - 4) +" is ready. Apprx. Bill Amount: Rs."+this.totalPayable+"/- Pickup your Vehicle.Thanks. "+ this.userService.getData()["workshop_name"]+" "+this.customerProfileMobile+"/"+this.customerProfileMobile2
            //       if(message.length>160){
            //         var message="Dear Customer, Your"+this.SelectedDataarrOfVehicle.model+" "+this.CreateCustomerForm.getRawValue().vechilenumber.substr(this.CreateCustomerForm.getRawValue().vechilenumber.length - 4) +" is ready. Apprx. Bill Amount: Rs."+this.totalPayable+"/- Pickup your Vehicle.Thanks. "+ this.userService.getData()["workshop_name"]+" "+this.customerProfileMobile
            //       }if(message.length>160){
            //         var message="Dear Customer, Your"+this.SelectedDataarrOfVehicle.model+" "+this.CreateCustomerForm.getRawValue().vechilenumber.substr(this.CreateCustomerForm.getRawValue().vechilenumber.length - 4) +" is ready. Apprx. Bill Amount: Rs."+this.totalPayable+"/- Pickup your Vehicle.Thanks. "+ this.userService.getData()["workshop_name"].substring(0, 5)+" "+this.customerProfileMobile
            //       }
            //     }
            //     var currentdate = new Date();
            //     var dateformsg = currentdate.getFullYear().toString()+"-"+("0" + (currentdate.getMonth()+1)).slice(-2).toString()+"-"+("0" + currentdate.getDate()).slice(-2).toString()+" "+currentdate.getHours().toString()+":"+("0" + currentdate.getMinutes()).slice(-2).toString()+":"+("0" + currentdate.getSeconds()).slice(-2).toString()
            //     this.general.sendsms(this.userworkshopid,
            //       this.jocardnumber,
            //       this.CreateCustomerForm.getRawValue().mobileOneNo,message,
            //       "reminder_jobcard",dateformsg).subscribe(send=>{
            //       this.showspinner.setSpinnerForLogin(true)
            //         if(send["success"]==true){
            //           this.showspinner.setSpinnerForLogin(false)
            //           this.snakBar.open("Message", ErrorMessgae[0][send["message"]], {
            //             duration: 4000
            //           })
            //         }else{
            //           this.showspinner.setSpinnerForLogin(false)
            //           this.snakBar.open("Message", ErrorMessgae[0][send["message"]], {
            //             duration: 4000
            //           })
            //         }
            //     },error=>{
            //       this.showspinner.setSpinnerForLogin(false)
            //       this.snakBar.open("Error", ErrorMessgae[0][error], {
            //         duration: 4000
            //       })
            //     })
            //   }
            // }
            var sendArray = Array();
            sendArray.push({
              status: true,
              settings: this.allBillingData,
              jobcard_number: this.jocardnumber,
              statusjobcard: status,
              smsalert: this.smsAlretValue,
              cutsomeremial: this.CreateCustomerForm.getRawValue().email,
              cutsomerphone: this.CreateCustomerForm.getRawValue().mobileTwoNo,
              mode: mode,
            });
            this.dialogRef.close(sendArray);
          } else {
            this.showspinner.setSpinnerForLogin(false);
            this.snakBar.open(
              "Message",
              ErrorMessgae[0][createResult["message"]],
              {
                duration: 4000,
              }
            );
          }
        },
        (err) => {
          this.showspinner.setSpinnerForLogin(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  //Create the message for the reminder
  createReminderMessage(sameday, addfiveday, minusfiveday) {
    if (this.CreateCustomerForm.getRawValue().vechilenumber == "") {
      var vechilenumberformessage =
        this.CreateCustomerForm.getRawValue().chassisnumber;
    } else {
      var vechilenumberformessage =
        this.CreateCustomerForm.getRawValue().vechilenumber;
    }
    if (this.userService.getData()["workshop_mobile_number_2"] == 0) {
      var priority = "servicing";
      if (this.checkarray.includes("Servicing")) {
        var reminderonemessage =
          "Dear Customer,\nYour Vehicle " +
          this.SelectedDataarrOfVehicle.model +
          " " +
          vechilenumberformessage +
          " is due for Servicing on " +
          sameday +
          ". Visit Us to ensure Hassle Free Service.\n" +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"];
        if (reminderonemessage.length > 160) {
          var reminderonemessage =
            "Dear Customer,\nYour Vehicle " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " is due for Servicing on " +
            sameday +
            ". Visit Us to ensure Hassle Free Service.\n" +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
        var remindertwomessage =
          "Dear Customer,\nYour Vehicle " +
          this.SelectedDataarrOfVehicle.model +
          " " +
          vechilenumberformessage +
          " is due for Servicing Today. Visit Us to ensure Hassle Free Service.\n" +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"];
        if (remindertwomessage.length > 160) {
          var remindertwomessage =
            "Dear Customer,\nYour Vehicle " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " is due for Servicing Today. Visit Us to ensure Hassle Free Service.\n" +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
        var reminderthreemessage =
          "Dear Customer,\nYour " +
          this.SelectedDataarrOfVehicle.model +
          " " +
          vechilenumberformessage +
          " was due for Servicing " +
          sameday +
          ". Visit Us to ensure Hassle Free Service.\n " +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"];
        if (reminderthreemessage.length > 160) {
          var reminderthreemessage =
            "Dear Customer,\nYour " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " was due for Servicing " +
            sameday +
            ". Visit Us to ensure Hassle Free Service.\n " +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
      } else if (this.checkarray.includes("Wheel Balancing")) {
        var priority = "wheel_alignment";
        var reminderonemessage = "";
        var remindertwomessage =
          "Dear Customer,\nYour Vehicle " +
          this.SelectedDataarrOfVehicle.model +
          " " +
          vechilenumberformessage +
          " is due for Wheel Allignment Today. Visit Us to ensure safe Driving. " +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"];
        if (remindertwomessage.length > 160) {
          var remindertwomessage =
            "Dear Customer,\nYour Vehicle " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " is due for Wheel Allignment Today. Visit Us to ensure safe Driving. " +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
        var reminderthreemessage =
          "Dear Customer,\nYour " +
          this.SelectedDataarrOfVehicle.model +
          " " +
          vechilenumberformessage +
          " was due for Wheel Allignment " +
          sameday +
          ". Visit Us to ensure safe Driving. " +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"];
        if (reminderthreemessage.length > 160) {
          var reminderthreemessage =
            "Dear Customer,\nYour " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " was due for Wheel Allignment " +
            sameday +
            ". Visit Us to ensure safe Driving. " +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
      } else if (this.checkarray.includes("Washing")) {
        var priority = "washing";
        var reminderonemessage = "";
        var remindertwomessage =
          "Dear Customer,\nYour " +
          this.SelectedDataarrOfVehicle.model +
          " " +
          vechilenumberformessage +
          " is due for Washing Today. Visit Us. And feel good in a clean Vehicle! " +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"];
        if (remindertwomessage.length > 160) {
          var remindertwomessage =
            "Dear Customer,\nYour" +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " is due for Washing Today. Visit Us. And feel good in a clean Vehicle! " +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
        var reminderthreemessage =
          "Dear Customer,\nYour " +
          this.SelectedDataarrOfVehicle.model +
          " " +
          vechilenumberformessage +
          " was due for Washing " +
          sameday +
          ". Visit Us. And feel good in a clean Vehicle! " +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"];
        if (reminderthreemessage.length > 160) {
          var reminderthreemessage =
            "Dear Customer,\nYour " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " was due for Washing " +
            sameday +
            ". Visit Us. And feel good in a clean Vehicle! " +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
      } else if (this.checkarray.includes("General Servicing")) {
        var priority = "general_repair";
        var reminderonemessage = "";
        var remindertwomessage =
          "Dear Customer,\nYour hope you had a great experience with us. Happy to serve you again. Keep Riding. Visit Us!" +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"];
        if (remindertwomessage.length > 160) {
          var remindertwomessage =
            "Dear Customer,\nYour hope you had a great experience with us. Happy to serve you again. Keep Riding. Visit Us!" +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
        var reminderthreemessage = "";
      } else {
        var priority = "servicing";
        var reminderonemessage =
          "Dear Customer,\nYour Vehicle " +
          this.SelectedDataarrOfVehicle.model +
          " " +
          vechilenumberformessage +
          " is due for Servicing on " +
          sameday +
          ". Visit Us to ensure Hassle Free Service.\n " +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"];
        if (reminderonemessage.length > 160) {
          var reminderonemessage =
            "Dear Customer,\nYour Vehicle " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " is due for Servicing on " +
            sameday +
            ". Visit Us to ensure Hassle Free Service.\n " +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
        var remindertwomessage =
          "Dear Customer,\nYour Vehicle " +
          this.SelectedDataarrOfVehicle.model +
          " " +
          vechilenumberformessage +
          " is due for Servicing Today. Visit Us to ensure Hassle Free Service.\n " +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"];
        if (remindertwomessage.length > 160) {
          var remindertwomessage =
            "Dear Customer,\nYour Vehicle " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " is due for Servicing Today. Visit Us to ensure Hassle Free Service.\n " +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
        var reminderthreemessage =
          "Dear Customer,\nYour " +
          this.SelectedDataarrOfVehicle.model +
          " " +
          vechilenumberformessage +
          " was due for Servicing " +
          sameday +
          ". Visit Us to ensure Hussle Free Service.\n " +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"];
        if (reminderthreemessage.length > 160) {
          var reminderthreemessage =
            "Dear Customer,\nYour " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " was due for Servicing " +
            sameday +
            ". Visit Us to ensure Hussle Free Service.\n" +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
      }
    } else {
      if (this.checkarray.includes("Servicing")) {
        var priority = "servicing";
        var reminderonemessage =
          "Dear Customer,\nYour Vehicle " +
          this.SelectedDataarrOfVehicle.model +
          " " +
          vechilenumberformessage +
          " is due for Servicing on " +
          sameday +
          ". Visit Us to ensure Hassle Free Service.\n " +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"] +
          "/" +
          this.userService.getData()["workshop_mobile_number_2"];
        if (reminderonemessage.length > 160) {
          var reminderonemessage =
            "Dear Customer,\nYour Vehicle " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " is due for Servicing on " +
            sameday +
            ". Visit Us to ensure Hassle Free Service.\n " +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"] +
            "/" +
            this.userService.getData()["workshop_mobile_number_2"];
        }
        if (reminderonemessage.length > 160) {
          var reminderonemessage =
            "Dear Customer,\nYour Vehicle " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " is due for Servicing on " +
            sameday +
            ". Visit Us to ensure Hassle Free Service.\n" +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
        var remindertwomessage =
          "Dear Customer,\nYour Vehicle " +
          this.SelectedDataarrOfVehicle.model +
          " " +
          vechilenumberformessage +
          " is due for Servicing Today. Visit Us to ensure Hassle Free Service.\n" +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"] +
          "/" +
          this.userService.getData()["workshop_mobile_number_2"];
        if (remindertwomessage.length > 160) {
          var remindertwomessage =
            "Dear Customer,\nYour Vehicle " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " is due for Servicing Today. Visit Us to ensure Hassle Free Service.\n" +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"] +
            "/" +
            this.userService.getData()["workshop_mobile_number_2"];
        }
        if (remindertwomessage.length > 160) {
          var remindertwomessage =
            "Dear Customer,\nYour Vehicle " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " is due for Servicing Today. Visit Us to ensure Hassle Free Service.\n" +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
        var reminderthreemessage =
          "Dear Customer,\nYour " +
          this.SelectedDataarrOfVehicle.model +
          " " +
          vechilenumberformessage +
          " was due for Servicing " +
          sameday +
          ". Visit Us to ensure Hussle Free Service.\n" +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"] +
          "/" +
          this.userService.getData()["workshop_mobile_number_2"];
        if (reminderthreemessage.length > 160) {
          var reminderthreemessage =
            "Dear Customer,\nYour " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " was due for Servicing " +
            sameday +
            ". Visit Us to ensure Hussle Free Service.\n" +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"] +
            "/" +
            this.userService.getData()["workshop_mobile_number_2"];
        }
        if (reminderthreemessage.length > 160) {
          var reminderthreemessage =
            "Dear Customer,\nYour " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " was due for Servicing " +
            sameday +
            ". Visit Us to ensure Hussle Free Service.\n" +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
      } else if (this.checkarray.includes("Wheel Allignment")) {
        var priority = "wheel_alignment";
        var reminderonemessage = "";
        var remindertwomessage =
          "Dear Customer,\nYour Vehicle " +
          this.SelectedDataarrOfVehicle.model +
          " " +
          vechilenumberformessage +
          " is due for Wheel Allignment Today. Visit Us to ensure safe Driving. " +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"] +
          "/" +
          this.userService.getData()["workshop_mobile_number_2"];
        if (remindertwomessage.length > 160) {
          var remindertwomessage =
            "Dear Customer,\nYour Vehicle " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " is due for Wheel Allignment Today. Visit Us to ensure safe Driving. " +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"] +
            "/" +
            this.userService.getData()["workshop_mobile_number_2"];
        }
        if (remindertwomessage.length > 160) {
          var remindertwomessage =
            "Dear Customer,\nYour Vehicle " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " is due for Wheel Allignment Today. Visit Us to ensure safe Driving. " +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
        var reminderthreemessage =
          "Dear Customer,\nYour " +
          this.SelectedDataarrOfVehicle.model +
          " " +
          vechilenumberformessage +
          " was due for Wheel Allignment " +
          sameday +
          ". Visit Us to ensure safe Driving. " +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"] +
          "/" +
          this.userService.getData()["workshop_mobile_number_2"];
        if (reminderthreemessage.length > 160) {
          var reminderthreemessage =
            "Dear Customer,\nYour " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " was due for Wheel Allignment " +
            sameday +
            ". Visit Us to ensure safe Driving. " +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"] +
            "/" +
            this.userService.getData()["workshop_mobile_number_2"];
        }
        if (reminderthreemessage.length > 160) {
          var reminderthreemessage =
            "Dear Customer,\nYour " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " was due for Wheel Allignment " +
            sameday +
            ". Visit Us to ensure safe Driving. " +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
      } else if (this.checkarray.includes("Washing")) {
        var priority = "washing";
        var reminderonemessage = "";
        var remindertwomessage =
          "Dear Customer,\nYour " +
          this.SelectedDataarrOfVehicle.model +
          " " +
          vechilenumberformessage +
          " is due for Washing Today. Visit Us. And feel good in a clean Vehicle! " +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"] +
          "/" +
          this.userService.getData()["workshop_mobile_number_2"];
        if (remindertwomessage.length > 160) {
          var remindertwomessage =
            "Dear Customer,\nYour " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " is due for Washing Today. Visit Us. And feel good in a clean Vehicle! " +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"] +
            "/" +
            this.userService.getData()["workshop_mobile_number_2"];
        }
        if (remindertwomessage.length > 160) {
          var remindertwomessage =
            "Dear Customer,\nYour " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " is due for Washing Today. Visit Us. And feel good in a clean Vehicle! " +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
        var reminderthreemessage =
          "Dear Customer,\nYour " +
          this.SelectedDataarrOfVehicle.model +
          " " +
          vechilenumberformessage +
          " was due for Washing " +
          sameday +
          ". Visit Us. And feel good in a clean Vehicle! " +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"] +
          "/" +
          this.userService.getData()["workshop_mobile_number_2"];
        if (reminderthreemessage.length > 160) {
          var reminderthreemessage =
            "Dear Customer,\nYour " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " was due for Washing " +
            sameday +
            ". Visit Us. And feel good in a clean Vehicle! " +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"] +
            "/" +
            this.userService.getData()["workshop_mobile_number_2"];
        }
        if (reminderthreemessage.length > 160) {
          var reminderthreemessage =
            "Dear Customer,\nYour " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " was due for Washing " +
            sameday +
            ". Visit Us. And feel good in a clean Vehicle! " +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
      } else if (this.checkarray.includes("General Repair")) {
        var priority = "general_repair";
        var reminderonemessage = "";
        var remindertwomessage =
          "Dear Customer,\nYour hope you had a great experience with us. Happy to serve you again. Keep Riding. Visit Us! " +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"] +
          "/" +
          this.userService.getData()["workshop_mobile_number_2"];
        if (remindertwomessage.length > 160) {
          var remindertwomessage =
            "Dear Customer,\nYour hope you had a great experience with us. Happy to serve you again. Keep Riding. Visit Us! " +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"] +
            "/" +
            this.userService.getData()["workshop_mobile_number_2"];
        }
        if (remindertwomessage.length > 160) {
          var remindertwomessage =
            "Dear Customer,\nYour hope you had a great experience with us. Happy to serve you again. Keep Riding. Visit Us! " +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
        var reminderthreemessage = "";
      } else {
        var priority = "servicing";
        var reminderonemessage =
          "Dear Customer,\nYour Vehicle " +
          this.SelectedDataarrOfVehicle.model +
          " " +
          vechilenumberformessage +
          " is due for Servicing on " +
          sameday +
          ". Visit Us to ensure Hassle Free Service.\n" +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"] +
          "/" +
          this.userService.getData()["workshop_mobile_number_2"];
        if (reminderonemessage.length > 160) {
          var reminderonemessage =
            "Dear Customer,\nYour Vehicle " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " is due for Servicing on " +
            sameday +
            ". Visit Us to ensure Hassle Free Service.\n" +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"] +
            "/" +
            this.userService.getData()["workshop_mobile_number_2"];
        }
        if (reminderonemessage.length > 160) {
          var reminderonemessage =
            "Dear Customer,\nYour Vehicle " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " is due for Servicing on " +
            sameday +
            ". Visit Us to ensure Hassle Free Service.\n" +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
        var remindertwomessage =
          "Dear Customer,\nYour Vehicle " +
          this.SelectedDataarrOfVehicle.model +
          " " +
          vechilenumberformessage +
          " is due for Servicing Today. Visit Us to ensure Hassle Free Service.\n" +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"] +
          "/" +
          this.userService.getData()["workshop_mobile_number_2"];
        if (remindertwomessage.length > 160) {
          var remindertwomessage =
            "Dear Customer,\nYour Vehicle" +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " is due for Servicing Today. Visit Us to ensure Hassle Free Service.\n" +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"] +
            "/" +
            this.userService.getData()["workshop_mobile_number_2"];
        }
        if (remindertwomessage.length > 160) {
          var remindertwomessage =
            "Dear Customer,\nYour Vehicle" +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " is due for Servicing Today. Visit Us to ensure Hassle Free Service.\n" +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
        var reminderthreemessage =
          "Dear Customer,\nYour " +
          this.SelectedDataarrOfVehicle.model +
          " " +
          vechilenumberformessage +
          " was due for Servicing " +
          sameday +
          ". Visit Us to ensure Hussle Free Service.\n" +
          this.userService.getData()["workshop_name"] +
          " " +
          this.userService.getData()["workshop_mobile_number_1"] +
          "/" +
          this.userService.getData()["workshop_mobile_number_2"];
        if (reminderthreemessage.length > 160) {
          var reminderthreemessage =
            "Dear Customer,\nYour Vehicle " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " was due for Servicing " +
            sameday +
            ". Visit Us to ensure Hussle Free Service.\n" +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"] +
            "/" +
            this.userService.getData()["workshop_mobile_number_2"];
        }
        if (reminderthreemessage.length > 160) {
          var reminderthreemessage =
            "Dear Customer,\nYour " +
            this.SelectedDataarrOfVehicle.model +
            " " +
            vechilenumberformessage +
            " was due for Servicing " +
            sameday +
            ". Visit Us to ensure Hussle Free Service.\n" +
            this.userService.getData()["workshop_name"].substring(0, 5) +
            " " +
            this.userService.getData()["workshop_mobile_number_1"];
        }
      }
    }
    return [
      priority,
      reminderonemessage,
      remindertwomessage,
      reminderthreemessage,
    ];
  }
  // Selecte Comman Assined Mecahnic
  onItemSelectAssigned(event, selecttype) {
    if (
      this.sparedatatabel.length != 0 ||
      this.lubedatatabel.length != 0 ||
      this.jobdatatabel.length != 0
    ) {
      this.mechanicerror = false;
      if (selecttype == "all") {
        this.assignedMechanicArray = event;
      } else {
        this.assignedMechanicArray.push(event);
      }
    } else {
      this.mechanicerror = true;
      if (selecttype == "all") {
        this.assignedMechanicArray = event;
      } else {
        this.assignedMechanicArray.push(event);
      }
    }
  }
  // DeSelect Comman Assined Mecahnic
  onDeSelectAssigned(event, selecttype) {
    if (
      this.sparedatatabel.length != 0 ||
      this.lubedatatabel.length != 0 ||
      this.jobdatatabel.length != 0
    ) {
      this.mechanicerror = false;
      if (selecttype == "all") {
        this.assignedMechanicArray = event;
      } else {
        this.assignedMechanicArray = this.assignedMechanicArray.filter(
          (mechanic) => mechanic.name != event.name
        );
      }
    } else {
      this.mechanicerror = true;
      if (selecttype == "all") {
        this.assignedMechanicArray = event;
      } else {
        this.assignedMechanicArray = this.assignedMechanicArray.filter(
          (mechanic) => mechanic.name != event.name
        );
      }
    }
  }
  //remove the disable from the fileds to edit
  removedisable() {
    this.shoeupdate = true;
    this.showdisbale = false;
    this.inputcolor = "#fff";
    this.CreateCustomerForm.controls["vechilenumber"].enable();
    this.CreateCustomerForm.controls["chassisnumber"].enable();
    this.CreateCustomerForm.controls["customername"].enable();
    this.CreateCustomerForm.controls["mobileOneNo"].enable();
    this.CreateCustomerForm.controls["searchVehicle"].enable();
    this.CreateCustomerForm.controls["mobileTwoNo"].enable();
    this.CreateCustomerForm.controls["kmread"].enable();
    this.CreateCustomerForm.controls["email"].enable();
    this.CreateCustomerForm.controls["dob"].enable();
    this.CreateCustomerForm.controls["pickupaddress"].enable();
    this.CreateCustomerForm.controls["dropaddress"].enable();
    this.CreateCustomerForm.controls["enginenumber"].enable();
    this.CreateCustomerForm.controls["color"].enable();
    this.CreateCustomerForm.controls["drivername"].enable();
    this.CreateCustomerForm.controls["driverno"].enable();
    this.CreateCustomerForm.controls["gstno"].enable();
  }
  //set sms alerts
  smsAlert(event) {
    if (event.currentTarget.checked == true) {
      this.smsAlretValue = true;
    } else {
      this.smsAlretValue = false;
    }
  }
  //---------------------------LUBES FORM-----------------------------------------------------------
  // After Search User Select the lube to insert it in tabel
  selectedLubeResult(event) {
    var partnumber;
    partnumber = event.split("(Part No:-")[1].split(")----")[0];
    if (event.split("(Part No:-").length != 0) {
      this.general
        .getJobSpareLubeData(this.userworkshopid, "lube", partnumber)
        .subscribe(
          (LubeData) => {
            this.lubemodel = "";
            this.showspinner.setSpinnerForLogin(true);
            this.makelubetable(LubeData.lubedata[0]);
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
  //Calculate Discount value eneter
  lubeiscountvalue(event, indexdata, index, flag) {
    if (event.match(/^\d*\.?\d*$/)) {
      indexdata["showdiscountlube"] = false;
      this.lubedatatabel[index]["discountvalue"] = event;
      if (this.allBillingData.gst_number != "") {
        if (this.lubedatatabel[index]["sale_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(this.lubedatatabel[index]["unit_sale_price"]),
            this.lubedatatabel[index]["sale_gst_rate"],
            this.lubedatatabel[index]["sale_tax_type"],
            event,
            // my edit
            parseFloat(this.lubedatatabel[index]["quantity"]),
            this.lubedatatabel[index]["discounttype"]
          );

          // this.lubedatatabel[index]["gstcalculateofjob"] =
          //   totalcal[0]["GSTAmount"];
          // this.lubedatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
          // this.lubedatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
          this.lubedatatabel[index]["gstcalculateoflube"] =
            totalcal[0]["GSTAmount"];
          this.lubedatatabel[index]["cgstcalculateoflube"] =
            totalcal[0]["CGST"];
          this.lubedatatabel[index]["sgstcalculateoflube"] =
            totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.lubedatatabel[index]["amount"] = totalcal[0]["totalamount"];
        } else if (this.lubedatatabel[index]["purchase_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(this.lubedatatabel[index]["unit_purchase_price"]),
            this.lubedatatabel[index]["purchase_gst_rate"],
            this.lubedatatabel[index]["purchase_tax_type"],
            event,
            parseFloat(this.lubedatatabel[index]["quantity"]),
            this.lubedatatabel[index]["discounttype"]
          );
          // this.lubedatatabel[index]["gstcalculateofjob"] =
          //   totalcal[0]["GSTAmount"];
          // this.lubedatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
          // this.lubedatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
          this.lubedatatabel[index]["gstcalculateoflube"] =
            totalcal[0]["GSTAmount"];
          this.lubedatatabel[index]["cgstcalculateoflube"] =
            totalcal[0]["CGST"];
          this.lubedatatabel[index]["sgstcalculateoflube"] =
            totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.lubedatatabel[index]["amount"] = totalcal[0]["totalamount"];
        } else {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(this.lubedatatabel[index]["unit_sale_price"]),
            "0",
            "Inclusive",
            event,
            parseFloat(this.lubedatatabel[index]["quantity"]),
            this.lubedatatabel[index]["discounttype"]
          );
          this.lubedatatabel[index]["amount"] = totalcal[0]["totalamount"];
        }
      } else {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseFloat(this.lubedatatabel[index]["unit_sale_price"]),
          "0",
          "Inclusive",
          event,
          parseFloat(this.lubedatatabel[index]["quantity"]),
          this.lubedatatabel[index]["discounttype"]
        );
        this.lubedatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.LubeTotal = this.calculateresult(this.lubedatatabel);
      this.LubeTotalFinal = this.calculateresultfinal(this.lubedatatabel);
      this.calculateAmountOfBilling();
      this.calTotalGstForLubeamount = this.calTotalGstForLube(
        this.lubedatatabel
      );
      if (flag == "false") {
        if (event >= 0) {
          if (this.lubedatatabel.length != 0) {
            var idarr = [];
            this.lubedatatabel.filter((data) => {
              if (data.discountvalue != 0) {
                idarr.push(data.discountvalue);
              }
              if (data.discounttype != "%") {
                idarr.push(data.discountvalue);
              }
            });
            if (idarr.length != 0) {
              this.showlubedis = true;
              this.lubeisvalue = 0;
            } else {
              this.showlubedis = false;
            }
          }
        }
      }
    } else {
      indexdata["showdiscountlube"] = true;
    }
  }
  //update Discount type eneter
  checklubediscountData(event, indexdata, index, flag) {
    this.lubedatatabel[index]["discounttype"] = event;
    if (this.allBillingData.gst_number != "") {
      if (this.lubedatatabel[index]["sale_gst_rate"] != "") {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseFloat(this.lubedatatabel[index]["unit_sale_price"]),
          this.lubedatatabel[index]["sale_gst_rate"],
          this.lubedatatabel[index]["sale_tax_type"],
          parseInt(this.lubedatatabel[index]["discountvalue"]),
          parseFloat(this.lubedatatabel[index]["quantity"]),
          event
        );

        // this.lubedatatabel[index]["gstcalculateofjob"] =
        //   totalcal[0]["GSTAmount"];
        // this.lubedatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
        // this.lubedatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
        this.lubedatatabel[index]["gstcalculateoflube"] =
          totalcal[0]["GSTAmount"];
        this.lubedatatabel[index]["cgstcalculateoflube"] = totalcal[0]["CGST"];
        this.lubedatatabel[index]["sgstcalculateoflube"] = totalcal[0]["SGST"];
        indexdata["showcalcluationinfo"] = true;
        this.lubedatatabel[index]["amount"] = totalcal[0]["totalamount"];
      } else if (this.lubedatatabel[index]["purchase_gst_rate"] != "") {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseFloat(this.lubedatatabel[index]["unit_purchase_price"]),
          this.lubedatatabel[index]["purchase_gst_rate"],
          this.lubedatatabel[index]["purchase_tax_type"],
          parseInt(this.lubedatatabel[index]["discountvalue"]),
          parseFloat(this.lubedatatabel[index]["quantity"]),
          event
        );
        // this.lubedatatabel[index]["gstcalculateofjob"] =
        //   totalcal[0]["GSTAmount"];
        // this.lubedatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
        // this.lubedatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
        this.lubedatatabel[index]["gstcalculateoflube"] =
          totalcal[0]["GSTAmount"];
        this.lubedatatabel[index]["cgstcalculateoflube"] = totalcal[0]["CGST"];
        this.lubedatatabel[index]["sgstcalculateoflube"] = totalcal[0]["SGST"];
        indexdata["showcalcluationinfo"] = true;
        this.lubedatatabel[index]["amount"] = totalcal[0]["totalamount"];
      } else {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseFloat(this.lubedatatabel[index]["unit_sale_price"]),
          "0",
          "Inclusive",
          parseInt(this.lubedatatabel[index]["discountvalue"]),
          parseFloat(this.lubedatatabel[index]["quantity"]),
          event
        );
        this.lubedatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
    } else {
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(this.lubedatatabel[index]["unit_sale_price"]),
        "0",
        "Inclusive",
        parseInt(this.lubedatatabel[index]["discountvalue"]),
        parseFloat(this.lubedatatabel[index]["quantity"]),
        event
      );
      this.lubedatatabel[index]["amount"] = totalcal[0]["totalamount"];
    }
    this.LubeTotal = this.calculateresult(this.lubedatatabel);
    this.LubeTotalFinal = this.calculateresultfinal(this.lubedatatabel);
    this.calculateAmountOfBilling();
    //
    this.calTotalGstForLubeamount = this.calTotalGstForLube(this.lubedatatabel);
    if (flag == "false") {
      if (event != "%") {
        if (this.lubedatatabel.length != 0) {
          var idarr = [];
          this.lubedatatabel.filter((data) => {
            if (data.discountvalue != 0) {
              idarr.push(data.discountvalue);
            }
            if (data.discounttype != "%") {
              idarr.push(data.discountvalue);
            }
          });
          if (idarr.length != 0) {
            this.showlubedis = true;
            this.lubeisvalue = 0;
          } else {
            this.showlubedis = true;
          }
        }
      } else {
        if (this.lubedatatabel.length != 0) {
          var idarr = [];
          this.lubedatatabel.filter((data) => {
            if (data.discountvalue != 0) {
              idarr.push(data.discountvalue);
            }
            if (data.discounttype != "%") {
              idarr.push(data.discountvalue);
            }
          });
          if (idarr.length != 0) {
            this.showlubedis = true;
            this.lubeisvalue = 0;
          } else {
            this.showlubedis = false;
          }
        }
      }
    }
  }
  // Insert the selected record in the lube tbael in form
  makelubetable(lubeData) {
    var sparedataQuantity = lubeData.current_quantity;
    var sparedatapartnumber = lubeData.part_number;
    this.duplicateLube.push(lubeData);
    var result = this.duplicateLube.reduce((unique, o) => {
      this.checkforquantityforlube = false;
      if (
        !unique.some(
          (obj) =>
            obj.part_number === o.part_number && obj.part_name === o.part_name
        )
      ) {
        if (o.checkinsertedlube == undefined) {
          if (this.settingInven[0].negative_inventory != 1) {
            if (
              o.current_quantity == "0.0" ||
              o.current_quantity.split("")[0] == "-"
            ) {
              this.negativevalue = o.current_quantity;
              this.negativearryforlube = o;
              this.shownegativeinventoryforlube = true;
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
                      o.gstcalculateoflube = totalcal[0]["GSTAmount"];
                      o.cgstcalculateoflube = totalcal[0]["CGST"];
                      o.sgstcalculateoflube = totalcal[0]["SGST"];
                      o.showcalcluationinfo = true;
                      o.amount = o.unit_sale_price;
                      o.lubegstamounterror = false;
                      if (!this.gsttype.includes(o.sale_tax_type)) {
                        o.lubegsttypeerror = true;
                      } else {
                        o.lubegsttypeerror = false;
                      }
                    } else {
                      o.amount = o.unit_sale_price;
                      o.lubegstamounterror = true;
                      if (!this.gsttype.includes(o.sale_tax_type)) {
                        o.lubegsttypeerror = true;
                      } else {
                        o.lubegsttypeerror = false;
                      }
                    }
                  } else {
                    if (this.gstNumberArr.includes(o.sale_gst_rate)) {
                      var totalcal = this.CalculateInclusiveGSTRate(
                        o.unit_sale_price,
                        o.sale_gst_rate,
                        o.sale_tax_type
                      );
                      o.gstcalculateoflube = totalcal[0]["GSTAmount"];
                      o.cgstcalculateoflube = totalcal[0]["CGST"];
                      o.sgstcalculateoflube = totalcal[0]["SGST"];
                      o.showcalcluationinfo = true;
                      o.amount = totalcal[0]["totalamount"];
                      o.lubegstamounterror = false;
                      if (!this.gsttype.includes(o.sale_tax_type)) {
                        o.lubegsttypeerror = true;
                      } else {
                        o.lubegsttypeerror = false;
                      }
                    } else {
                      o.amount = o.unit_sale_price;
                      o.lubegstamounterror = true;
                      if (!this.gsttype.includes(o.sale_tax_type)) {
                        o.lubegsttypeerror = true;
                      } else {
                        o.lubegsttypeerror = false;
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
                      o.gstcalculateoflube = totalcal[0]["GSTAmount"];
                      o.cgstcalculateoflube = totalcal[0]["CGST"];
                      o.sgstcalculateoflube = totalcal[0]["SGST"];
                      o.showcalcluationinfo = true;
                      o.amount = o.unit_sale_price;
                      o.lubegstamounterror = false;
                      if (!this.gsttype.includes(o.purchase_tax_type)) {
                        o.lubegsttypeerror = true;
                      } else {
                        o.lubegsttypeerror = false;
                      }
                    } else {
                      o.amount = o.unit_sale_price;
                      o.lubegstamounterror = true;
                      if (!this.gsttype.includes(o.purchase_tax_type)) {
                        o.lubegsttypeerror = true;
                      } else {
                        o.lubegsttypeerror = false;
                      }
                    }
                  } else {
                    if (this.gstNumberArr.includes(o.purchase_gst_rate)) {
                      var totalcal = this.CalculateInclusiveGSTRate(
                        o.unit_sale_price,
                        o.purchase_gst_rate,
                        o.purchase_tax_type
                      );
                      o.gstcalculateoflube = totalcal[0]["GSTAmount"];
                      o.cgstcalculateoflube = totalcal[0]["CGST"];
                      o.sgstcalculateoflube = totalcal[0]["SGST"];
                      o.showcalcluationinfo = true;
                      o.amount = totalcal[0]["totalamount"];
                      o.lubegstamounterror = false;
                      if (!this.gsttype.includes(o.purchase_tax_type)) {
                        o.lubegsttypeerror = true;
                      } else {
                        o.lubegsttypeerror = false;
                      }
                    } else {
                      o.amount = o.unit_sale_price;
                      o.lubegstamounterror = true;
                      if (!this.gsttype.includes(o.purchase_tax_type)) {
                        o.lubegsttypeerror = true;
                      } else {
                        o.lubegsttypeerror = false;
                      }
                    }
                  }
                } else {
                  o.amount = o.unit_sale_price;
                  o.lubegsttypeerror = true;
                  o.lubegstamounterror = true;
                }
              } else {
                o.amount = o.unit_sale_price;
              }
              o.quantity = "1";
              o.discounttype = "%";
              o.discountvalue == this.lubeisvalue;
              o.showqunatityerrorlube = false;
              o.showpriceerrorlube = false;
              o.checkinsertedlube = true;
              // o.lubeassignedmechanic = [
              //   this.jobcardSettingData.default_mechanic[0].name
              //     .charAt(0)
              //     .toUpperCase() +
              //     this.jobcardSettingData.default_mechanic[0].name.slice(1),
              // ];
              o.lubeassignedmechanic = this.selectedStaffId;
              o["totalitemamount"] = this.getTotalAmount(o, "1", "job");
              unique.push(o);
              this.shownegativeinventoryforlube = false;
              this.showduplicatelube = false;
              this.updateQuantity(
                sparedataQuantity,
                sparedatapartnumber,
                1,
                "lube",
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
                    o.gstcalculateoflube = totalcal[0]["GSTAmount"];
                    o.cgstcalculateoflube = totalcal[0]["CGST"];
                    o.sgstcalculateoflube = totalcal[0]["SGST"];
                    o.showcalcluationinfo = true;
                    o.amount = o.unit_sale_price;
                    o.lubegstamounterror = false;
                    if (!this.gsttype.includes(o.sale_tax_type)) {
                      o.lubegsttypeerror = true;
                    } else {
                      o.lubegsttypeerror = false;
                    }
                  } else {
                    o.amount = o.unit_sale_price;
                    o.lubegstamounterror = true;
                    if (!this.gsttype.includes(o.sale_tax_type)) {
                      o.lubegsttypeerror = true;
                    } else {
                      o.lubegsttypeerror = false;
                    }
                  }
                } else {
                  if (this.gstNumberArr.includes(o.sale_gst_rate)) {
                    var totalcal = this.CalculateInclusiveGSTRate(
                      o.unit_sale_price,
                      o.sale_gst_rate,
                      o.sale_tax_type
                    );
                    o.gstcalculateoflube = totalcal[0]["GSTAmount"];
                    o.cgstcalculateoflube = totalcal[0]["CGST"];
                    o.sgstcalculateoflube = totalcal[0]["SGST"];
                    o.showcalcluationinfo = true;
                    o.amount = totalcal[0]["totalamount"];
                    o.lubegstamounterror = false;
                    if (!this.gsttype.includes(o.sale_tax_type)) {
                      o.lubegsttypeerror = true;
                    } else {
                      o.lubegsttypeerror = false;
                    }
                  } else {
                    o.amount = o.unit_sale_price;
                    o.lubegstamounterror = true;
                    if (!this.gsttype.includes(o.sale_tax_type)) {
                      o.lubegsttypeerror = true;
                    } else {
                      o.lubegsttypeerror = false;
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
                    o.gstcalculateoflube = totalcal[0]["GSTAmount"];
                    o.cgstcalculateoflube = totalcal[0]["CGST"];
                    o.sgstcalculateoflube = totalcal[0]["SGST"];
                    o.showcalcluationinfo = true;
                    o.amount = o.unit_sale_price;
                    o.lubegstamounterror = false;
                    if (!this.gsttype.includes(o.purchase_tax_type)) {
                      o.lubegsttypeerror = true;
                    } else {
                      o.lubegsttypeerror = false;
                    }
                  } else {
                    o.amount = o.unit_sale_price;
                    o.lubegstamounterror = true;
                    if (!this.gsttype.includes(o.purchase_tax_type)) {
                      o.lubegsttypeerror = true;
                    } else {
                      o.lubegsttypeerror = false;
                    }
                  }
                } else {
                  if (this.gstNumberArr.includes(o.purchase_gst_rate)) {
                    var totalcal = this.CalculateInclusiveGSTRate(
                      o.unit_sale_price,
                      o.purchase_gst_rate,
                      o.purchase_tax_type
                    );
                    o.gstcalculateoflube = totalcal[0]["GSTAmount"];
                    o.cgstcalculateoflube = totalcal[0]["CGST"];
                    o.sgstcalculateoflube = totalcal[0]["SGST"];
                    o.showcalcluationinfo = true;
                    o.amount = totalcal[0]["totalamount"];
                    o.lubegstamounterror = false;
                    if (!this.gsttype.includes(o.purchase_tax_type)) {
                      o.lubegsttypeerror = true;
                    } else {
                      o.lubegsttypeerror = false;
                    }
                  } else {
                    o.amount = o.unit_sale_price;
                    o.lubegstamounterror = true;
                    if (!this.gsttype.includes(o.purchase_tax_type)) {
                      o.lubegsttypeerror = true;
                    } else {
                      o.lubegsttypeerror = false;
                    }
                  }
                }
              } else {
                o.amount = o.unit_sale_price;
                o.lubegsttypeerror = true;
                o.lubegstamounterror = true;
              }
            } else {
              o.amount = o.unit_sale_price;
            }
            o.quantity = "1";
            o.discounttype = "%";
            o.discountvalue == this.lubeisvalue;
            o.showqunatityerrorlube = false;
            o.showpriceerrorlube = false;
            o.checkinsertedlube = true;
            o.lubeassignedmechanic = this.selectedStaffId;
            o["totalitemamount"] = this.getTotalAmount(o, "1", "job");
            unique.push(o);
            this.shownegativeinventoryforlube = false;
            this.showduplicatelube = false;
            this.updateQuantity(
              sparedataQuantity,
              sparedatapartnumber,
              1,
              "lube",
              "minus"
            );
          }
        } else {
          o["totalitemamount"] = this.getTotalAmount(o, "1", "job");
          unique.push(o);
          this.shownegativeinventoryforlube = false;
          this.showduplicatelube = false;
        }
      } else {
        this.showduplicatelube = true;
        this.shownegativeinventoryforlube = false;
        this.duplicatelubename = o["part_name"];
      }
      return unique;
    }, []);
    this.lubedatatabel = result;
    this.LubeTotal = this.calculateresult(this.lubedatatabel);
    this.LubeTotalFinal = this.calculateresultfinal(this.lubedatatabel);
    this.calculateAmountOfBilling();
    this.calTotalGstForLubeamount = this.calTotalGstForLube(this.lubedatatabel);
    if (this.lubeisvalue != 0) {
      this.checkdiscountoflube(this.lubeisvalue, "false");
    }
    this.checkLubeGSTrateandtype();
    this.mechanicerror = false;
    this.showspinner.setSpinnerForLogin(false);
  }
  // Add the negative Quantity lube forcefully if user wants to add that
  addnegativetolube(event) {
    var sparedataQuantity = this.negativearryforlube.current_quantity;
    var sparedatapartnumber = this.negativearryforlube.part_number;
    if (event == true) {
      if (this.allBillingData.gst_number != "") {
        if (this.negativearryforlube.sale_gst_rate != "") {
          if (this.negativearryforlube.sale_tax_type == "Inclusive") {
            if (
              this.gstNumberArr.includes(this.negativearryforlube.sale_gst_rate)
            ) {
              var totalcal = this.CalculateInclusiveGSTRate(
                this.negativearryforlube.unit_sale_price,
                this.negativearryforlube.sale_gst_rate,
                this.negativearryforlube.sale_tax_type
              );
              this.negativearryforlube.gstcalculateoflube =
                totalcal[0]["GSTAmount"];
              this.negativearryforlube.cgstcalculateoflube =
                totalcal[0]["CGST"];
              this.negativearryforlube.sgstcalculateoflube =
                totalcal[0]["SGST"];
              this.negativearryforlube.showcalcluationinfo = true;
              this.negativearryforlube.amount =
                this.negativearryforlube.unit_sale_price;
              this.negativearryforlube.lubegstamounterror = false;
            } else {
              this.negativearryforlube.amount =
                this.negativearryforlube.unit_sale_price;
              this.negativearryforlube.lubegstamounterror = true;
              if (
                !this.gsttype.includes(this.negativearryforlube.sale_tax_type)
              ) {
                this.negativearryforlube.lubegsttypeerror = true;
              } else {
                this.negativearryforlube.lubegsttypeerror = false;
              }
            }
          } else {
            if (
              this.gstNumberArr.includes(this.negativearryforlube.sale_gst_rate)
            ) {
              var totalcal = this.CalculateInclusiveGSTRate(
                this.negativearryforlube.unit_sale_price,
                this.negativearryforlube.sale_gst_rate,
                this.negativearryforlube.sale_tax_type
              );
              this.negativearryforlube.gstcalculateoflube =
                totalcal[0]["GSTAmount"];
              this.negativearryforlube.cgstcalculateoflube =
                totalcal[0]["CGST"];
              this.negativearryforlube.sgstcalculateoflube =
                totalcal[0]["SGST"];
              this.negativearryforlube.showcalcluationinfo = true;
              this.negativearryforlube.amount = totalcal[0]["totalamount"];
              this.negativearryforlube.lubegstamounterror = false;
            } else {
              this.negativearryforlube.amount =
                this.negativearryforlube.unit_sale_price;
              this.negativearryforlube.lubegstamounterror = true;
              if (
                !this.gsttype.includes(this.negativearryforlube.sale_tax_type)
              ) {
                this.negativearryforlube.lubegsttypeerror = true;
              } else {
                this.negativearryforlube.lubegsttypeerror = false;
              }
            }
          }
        } else if (this.negativearryforlube.purchase_gst_rate != "") {
          if (this.negativearryforlube.purchase_tax_type == "Inclusive") {
            if (
              this.gstNumberArr.includes(
                this.negativearryforlube.purchase_gst_rate
              )
            ) {
              var totalcal = this.CalculateInclusiveGSTRate(
                this.negativearryforlube.unit_sale_price,
                this.negativearryforlube.purchase_gst_rate,
                this.negativearryforlube.purchase_tax_type
              );
              this.negativearryforlube.gstcalculateoflube =
                totalcal[0]["GSTAmount"];
              this.negativearryforlube.cgstcalculateoflube =
                totalcal[0]["CGST"];
              this.negativearryforlube.sgstcalculateoflube =
                totalcal[0]["SGST"];
              this.negativearryforlube.showcalcluationinfo = true;
              this.negativearryforlube.amount =
                this.negativearryforlube.unit_sale_price;
              this.negativearryforlube.lubegstamounterror = false;
            } else {
              this.negativearryforlube.amount =
                this.negativearryforlube.unit_sale_price;
              this.negativearryforlube.lubegstamounterror = true;
              if (
                !this.gsttype.includes(
                  this.negativearryforlube.purchase_tax_type
                )
              ) {
                this.negativearryforlube.lubegsttypeerror = true;
              } else {
                this.negativearryforlube.lubegsttypeerror = false;
              }
            }
          } else {
            if (
              this.gstNumberArr.includes(
                this.negativearryforlube.purchase_gst_rate
              )
            ) {
              var totalcal = this.CalculateInclusiveGSTRate(
                this.negativearryforlube.unit_sale_price,
                this.negativearryforlube.purchase_gst_rate,
                this.negativearryforlube.purchase_tax_type
              );
              this.negativearryforlube.gstcalculateoflube =
                totalcal[0]["GSTAmount"];
              this.negativearryforlube.cgstcalculateoflube =
                totalcal[0]["CGST"];
              this.negativearryforlube.sgstcalculateoflube =
                totalcal[0]["SGST"];
              this.negativearryforlube.showcalcluationinfo = true;
              this.negativearryforlube.amount = totalcal[0]["totalamount"];
              this.negativearryforlube.lubegstamounterror = false;
            } else {
              this.negativearryforlube.amount =
                this.negativearryforlube.unit_sale_price;
              this.negativearryforlube.lubegstamounterror = true;
              if (
                !this.gsttype.includes(
                  this.negativearryforlube.purchase_tax_type
                )
              ) {
                this.negativearryforlube.lubegsttypeerror = true;
              } else {
                this.negativearryforlube.lubegsttypeerror = false;
              }
            }
          }
        } else {
          this.negativearryforlube.amount =
            this.negativearryforlube.unit_sale_price;
          this.negativearryforlube.lubegsttypeerror = true;
          this.negativearryforlube.lubegstamounterror = true;
        }
      } else {
        this.negativearryforlube.amount =
          this.negativearryforlube.unit_sale_price;
      }
      this.negativearryforlube.quantity = "1";
      this.negativearryforlube.discounttype = "%";
      this.negativearryforlube.discountvalue = this.lubeisvalue;
      this.negativearryforlube.showqunatityerrorlube = false;
      this.negativearryforlube.showpriceerrorlube = false;
      this.negativearryforlube.checkinsertedlube = true;
      this.negativearryforlube.totalitemamount = this.getTotalAmount(
        this.negativearryforlube,
        "1",
        "job"
      );
      this.lubedatatabel.push(this.negativearryforlube);
      this.shownegativeinventory = false;
      this.duplicateLube = this.lubedatatabel;
      this.LubeTotal = this.calculateresult(this.lubedatatabel);
      this.LubeTotalFinal = this.calculateresultfinal(this.lubedatatabel);
      this.calculateAmountOfBilling();
      this.calTotalGstForLubeamount = this.calTotalGstForLube(
        this.lubedatatabel
      );
      if (this.lubeisvalue != 0) {
        this.checkdiscountoflube(this.lubeisvalue, "false");
      }
      this.checkLubeGSTrateandtype();
      this.mechanicerror = false;
      this.updateQuantity(
        sparedataQuantity,
        sparedatapartnumber,
        1,
        "lube",
        "minus"
      );
    }
  }
  // Updated the Negative Qunatity of the Lube
  updateNegativeInventoryForLube() {
    this.addselectedLubeResult(this.negativearryforlube.part_number);
    this.CreateLubeForm.controls["partnumber"].setValue(
      this.negativearryforlube.part_number,
      { onlySelf: true }
    );
  }
  //push the seach Lube Resultin the aray so that user can seelect the Lube from dropdown
  searchLubeInput(event) {
    //this.searchLubeData=[]
    this.general.getJobSpareLube(this.userworkshopid, "lube", event).subscribe(
      (LubeSearchData) => {
        this.showspinner.setSpinnerForLogin(true);
        if (LubeSearchData.success == true) {
          if (LubeSearchData.lubedata != undefined) {
            if (LubeSearchData["next_page"] != "Nonextpage") {
              this.lubenextpage = LubeSearchData["next_page"];
            } else {
              this.lubenextpage = "none";
            }
            for (var i = 0; i < LubeSearchData.lubedata.length; i++) {
              this.showspinner.setSpinnerForLogin(true);
              var vehdata = [];
              vehdata = JSON.parse(LubeSearchData.lubedata[i].vechile_details);
              if (vehdata.length == undefined) {
                if (vehdata["make"] == "All") {
                  if (
                    !this.lubeduplicate.includes(
                      LubeSearchData.lubedata[i].part_number
                    )
                  ) {
                    if (LubeSearchData.lubedata[i].unit_sale_price != "") {
                      this.lubeduplicate.push(
                        LubeSearchData.lubedata[i].part_number
                      );
                      this.searchLubeDatasec.push(
                        LubeSearchData.lubedata[i].part_name +
                          " (Part No:-" +
                          LubeSearchData.lubedata[i].part_number +
                          ")----Rs." +
                          LubeSearchData.lubedata[i].unit_sale_price +
                          "/-"
                      );
                    } else {
                      this.lubeduplicate.push(
                        LubeSearchData.lubedata[i].part_number
                      );
                      this.searchLubeDatasec.push(
                        LubeSearchData.lubedata[i].part_name +
                          " (Part No:-" +
                          LubeSearchData.lubedata[i].part_number +
                          ")"
                      );
                    }
                  }
                } else {
                  if (vehdata["make"] == this.SelectedDataarrOfVehicle.make) {
                    if (vehdata["model"] == "All-model"||
                    vehdata["model"] == "All" ||
                    vehdata["model"] == "All model") {
                      if (
                        !this.lubeduplicate.includes(
                          LubeSearchData.lubedata[i].part_number
                        )
                      ) {
                        if (LubeSearchData.lubedata[i].unit_sale_price != "") {
                          this.lubeduplicate.push(
                            LubeSearchData.lubedata[i].part_number
                          );
                          this.searchLubeDatasec.push(
                            LubeSearchData.lubedata[i].part_name +
                              " (Part No:-" +
                              LubeSearchData.lubedata[i].part_number +
                              ")----Rs." +
                              LubeSearchData.lubedata[i].unit_sale_price +
                              "/-"
                          );
                        } else {
                          this.lubeduplicate.push(
                            LubeSearchData.lubedata[i].part_number
                          );
                          this.searchLubeDatasec.push(
                            LubeSearchData.lubedata[i].part_name +
                              " (Part No:-" +
                              LubeSearchData.lubedata[i].part_number +
                              ")"
                          );
                        }
                      }
                    } else {
                      if (
                        vehdata["model"] == this.SelectedDataarrOfVehicle.model
                      ) {
                        if (vehdata["variant"] == "All-variant" ||
                        vehdata["variant"] == "All" ||
                        vehdata["variant"] == "All variant") {
                          if (
                            !this.lubeduplicate.includes(
                              LubeSearchData.lubedata[i].part_number
                            )
                          ) {
                            if (
                              LubeSearchData.lubedata[i].unit_sale_price != ""
                            ) {
                              this.lubeduplicate.push(
                                LubeSearchData.lubedata[i].part_number
                              );
                              this.searchLubeDatasec.push(
                                LubeSearchData.lubedata[i].part_name +
                                  " (Part No:-" +
                                  LubeSearchData.lubedata[i].part_number +
                                  ")----Rs." +
                                  LubeSearchData.lubedata[i].unit_sale_price +
                                  "/-"
                              );
                            } else {
                              this.lubeduplicate.push(
                                LubeSearchData.lubedata[i].part_number
                              );
                              this.searchLubeDatasec.push(
                                LubeSearchData.lubedata[i].part_name +
                                  " (Part No:-" +
                                  LubeSearchData.lubedata[i].part_number +
                                  ")"
                              );
                            }
                          }
                        } else {
                          if (
                            vehdata["variant"] ==
                            this.SelectedDataarrOfVehicle.variant
                          ) {
                            if (
                              !this.lubeduplicate.includes(
                                LubeSearchData.lubedata[i].part_number
                              )
                            ) {
                              if (
                                LubeSearchData.lubedata[i].unit_sale_price != ""
                              ) {
                                this.lubeduplicate.push(
                                  LubeSearchData.lubedata[i].part_number
                                );
                                this.searchLubeDatasec.push(
                                  LubeSearchData.lubedata[i].part_name +
                                    " (Part No:-" +
                                    LubeSearchData.lubedata[i].part_number +
                                    ")----Rs." +
                                    LubeSearchData.lubedata[i].unit_sale_price +
                                    "/-"
                                );
                              } else {
                                this.lubeduplicate.push(
                                  LubeSearchData.lubedata[i].part_number
                                );
                                this.searchLubeDatasec.push(
                                  LubeSearchData.lubedata[i].part_name +
                                    " (Part No:-" +
                                    LubeSearchData.lubedata[i].part_number +
                                    ")"
                                );
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                vehdata.filter((dataveh) => {
                  if (dataveh.make == "All") {
                    if (
                      !this.lubeduplicate.includes(
                        LubeSearchData.lubedata[i].part_number
                      )
                    ) {
                      if (LubeSearchData.lubedata[i].unit_sale_price != "") {
                        this.lubeduplicate.push(
                          LubeSearchData.lubedata[i].part_number
                        );
                        this.searchLubeDatasec.push(
                          LubeSearchData.lubedata[i].part_name +
                            " (Part No:-" +
                            LubeSearchData.lubedata[i].part_number +
                            ")----Rs." +
                            LubeSearchData.lubedata[i].unit_sale_price +
                            "/-"
                        );
                      } else {
                        this.lubeduplicate.push(
                          LubeSearchData.lubedata[i].part_number
                        );
                        this.searchLubeDatasec.push(
                          LubeSearchData.lubedata[i].part_name +
                            " (Part No:-" +
                            LubeSearchData.lubedata[i].part_number +
                            ")"
                        );
                      }
                    }
                  } else {
                    if (dataveh.make == this.SelectedDataarrOfVehicle.make) {
                      if (dataveh.model == "All-model"||
                      dataveh.model == "All" ||
                      dataveh.model == "All model") {
                        if (
                          !this.lubeduplicate.includes(
                            LubeSearchData.lubedata[i].part_number
                          )
                        ) {
                          if (
                            LubeSearchData.lubedata[i].unit_sale_price != ""
                          ) {
                            this.lubeduplicate.push(
                              LubeSearchData.lubedata[i].part_number
                            );
                            this.searchLubeDatasec.push(
                              LubeSearchData.lubedata[i].part_name +
                                " (Part No:-" +
                                LubeSearchData.lubedata[i].part_number +
                                ")----Rs." +
                                LubeSearchData.lubedata[i].unit_sale_price +
                                "/-"
                            );
                          } else {
                            this.lubeduplicate.push(
                              LubeSearchData.lubedata[i].part_number
                            );
                            this.searchLubeDatasec.push(
                              LubeSearchData.lubedata[i].part_name +
                                " (Part No:-" +
                                LubeSearchData.lubedata[i].part_number +
                                ")"
                            );
                          }
                        }
                      } else {
                        if (
                          dataveh.model == this.SelectedDataarrOfVehicle.model
                        ) {
                          if (dataveh.variant == "All-variant" ||
                          dataveh.variant == "All" ||
                          dataveh.variant == "All variant") {
                            if (
                              !this.lubeduplicate.includes(
                                LubeSearchData.lubedata[i].part_number
                              )
                            ) {
                              if (
                                LubeSearchData.lubedata[i].unit_sale_price != ""
                              ) {
                                this.lubeduplicate.push(
                                  LubeSearchData.lubedata[i].part_number
                                );
                                this.searchLubeDatasec.push(
                                  LubeSearchData.lubedata[i].part_name +
                                    " (Part No:-" +
                                    LubeSearchData.lubedata[i].part_number +
                                    ")----Rs." +
                                    LubeSearchData.lubedata[i].unit_sale_price +
                                    "/-"
                                );
                              } else {
                                this.lubeduplicate.push(
                                  LubeSearchData.lubedata[i].part_number
                                );
                                this.searchLubeDatasec.push(
                                  LubeSearchData.lubedata[i].part_name +
                                    " (Part No:-" +
                                    LubeSearchData.lubedata[i].part_number +
                                    ")"
                                );
                              }
                            }
                          } else {
                            if (
                              dataveh.variant ==
                              this.SelectedDataarrOfVehicle.variant
                            ) {
                              if (
                                !this.lubeduplicate.includes(
                                  LubeSearchData.lubedata[i].part_number
                                )
                              ) {
                                if (
                                  LubeSearchData.lubedata[i].unit_sale_price !=
                                  ""
                                ) {
                                  this.lubeduplicate.push(
                                    LubeSearchData.lubedata[i].part_number
                                  );
                                  this.searchLubeDatasec.push(
                                    LubeSearchData.lubedata[i].part_name +
                                      " (Part No:-" +
                                      LubeSearchData.lubedata[i].part_number +
                                      ")----Rs." +
                                      LubeSearchData.lubedata[i]
                                        .unit_sale_price +
                                      "/-"
                                  );
                                } else {
                                  this.lubeduplicate.push(
                                    LubeSearchData.lubedata[i].part_number
                                  );
                                  this.searchLubeDatasec.push(
                                    LubeSearchData.lubedata[i].part_name +
                                      " (Part No:-" +
                                      LubeSearchData.lubedata[i].part_number +
                                      ")"
                                  );
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                });
              }
            }
            this.searchLubeData = this.searchLubeDatasec;
            this.showspinner.setSpinnerForLogin(false);
          }
        } else {
          console.log("No Data");
          //this.searchLubeData.push("No Data Found")
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
  //push the seach Lube Resultin the aray so that user can seelect the Lube from dropdown in side popup
  searchLubeInputToCreate(event) {
    this.searchLubeDataForCreate = [];
    this.general.getJobSpareLube(this.userworkshopid, "lube", event).subscribe(
      (LubeSearchData) => {
        this.showspinner.setSpinnerForLogin(true);
        if (LubeSearchData.success == true) {
          if (LubeSearchData.lubedata != undefined) {
            for (var i = 0; i < LubeSearchData.lubedata.length; i++) {
              this.searchLubeDataForCreate.push(
                LubeSearchData.lubedata[i].part_number
              );
            }
          }
        } else {
          this.searchLubeDataForCreate = [];
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
  //add the result of the selected lube to update the lube details in side popup
  addselectedLubeResult(event) {
    this.allSelectedMake = [];
    this.dupseletecmodvari = [];

    this.general
      .getJobSpareLubeData(this.userworkshopid, "lube", event)
      .subscribe(
        (lubeData) => {
          if (event != "" && lubeData.lubedata != undefined) {
            if (lubeData.success == true) {
              var vechilevariant = JSON.parse(
                lubeData.lubedata[0].vechile_details.replace(/\\/g, "")
              );
              this.foralltrue = false;
              var vehdetails = JSON.parse(lubeData.lubedata[0].vechile_details);

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
              this.CreateSpareForm.controls["searchspareVehiclemod"].setValue(
                ""
              );
              this.CreateSpareForm.controls["searchspareVehicle"].setValue("");
              this.CreateLubeForm.controls["workshopiddatalube"].setValue(
                lubeData.lubedata[0].workshop_id,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["partname"].setValue(
                lubeData.lubedata[0].part_name,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["companynameLube"].setValue(
                lubeData.lubedata[0].company_name,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["quantity"].setValue(
                lubeData.lubedata[0].current_quantity,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["lowerlimit"].setValue(
                lubeData.lubedata[0].lower_limit,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["unit"].setValue(
                lubeData.lubedata[0].unit,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["subcategory"].setValue(
                lubeData.lubedata[0].lube_subcategory,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["gstslab"].setValue(
                lubeData.lubedata[0].sale_gst_rate,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["gsttype"].setValue(
                lubeData.lubedata[0].sale_tax_type,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["rackno"].setValue(
                lubeData.lubedata[0].rack_no,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["purchaseprice"].setValue(
                lubeData.lubedata[0].unit_purchase_price,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["sellingprice"].setValue(
                lubeData.lubedata[0].unit_sale_price,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["hsnno"].setValue(
                lubeData.lubedata[0].hsn_no,
                { onlySelf: true }
              );
              this.showLubeUpdate = true;
            }
          } else {
            this.CreateLubeForm.controls["workshopiddatalube"].setValue(
              this.userworkshopid,
              { onlySelf: true }
            );
            this.CreateLubeForm.controls["partname"].setValue("", {
              onlySelf: true,
            });
            this.CreateLubeForm.controls["companynameLube"].setValue("", {
              onlySelf: true,
            });
            this.CreateLubeForm.controls["quantity"].setValue(1, {
              onlySelf: true,
            });
            this.CreateLubeForm.controls["lowerlimit"].setValue(0, {
              onlySelf: true,
            });
            this.CreateLubeForm.controls["unit"].setValue(this.units[2], {
              onlySelf: true,
            });
            this.CreateLubeForm.controls["subcategory"].setValue(
              this.spareCategory[0],
              { onlySelf: true }
            );
            this.CreateLubeForm.controls["gstslab"].setValue(
              this.gstNumberArr[0],
              { onlySelf: true }
            );
            this.CreateLubeForm.controls["gsttype"].setValue(this.gsttype[0], {
              onlySelf: true,
            });
            this.CreateLubeForm.controls["rackno"].setValue("", {
              onlySelf: true,
            });
            this.CreateLubeForm.controls["purchaseprice"].setValue(0, {
              onlySelf: true,
            });
            this.CreateLubeForm.controls["sellingprice"].setValue(null, {
              onlySelf: true,
            });
            this.CreateLubeForm.controls["hsnno"].setValue("", {
              onlySelf: true,
            });
            this.showLubeUpdate = false;
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
  //remove the lube from the tabel
  removeLubeItem(data, index) {
    if (this.jobcardEditOrCreate == "edit") {
      var sparedataQuantity = data.current_quantity;
      var sparedatapartnumber = data.part_number;
      var oldquantity = data.quantity;
      this.updateQuantity(
        sparedataQuantity,
        sparedatapartnumber,
        oldquantity,
        "lube",
        "add"
      );
    }
    this.lubedatatabel.splice(index, 1);
    this.duplicateLube = this.lubedatatabel;
    this.LubeTotal = this.calculateresult(this.lubedatatabel);
    this.LubeTotalFinal = this.calculateresultfinal(this.lubedatatabel);
    this.calculateAmountOfBilling();
    this.calTotalGstForLubeamount = this.calTotalGstForLube(this.lubedatatabel);
    this.checkLubeGSTrateandtype();
    this.getTotalDiscountInRupee();
    // this.QuantityObject.filter((dataa, index) => {
    //   if (dataa.part_number == data.part_number) {
    //     this.QuantityObject.splice(index, 1);
    //   }
    // });
    this.oldQuantityArray.filter((dataa, index) => {
      if (dataa.partnumber == data.part_number) {
        // this.oldQuantityArray.splice(index, 1);
        dataa.quantity = 0
      }
    });
  }
  //open the popup to create or update the lube
  openLubepopup() {
    this.foralltrue = false;
    this.SelectedDataarrOfVehiclespl = undefined;
    this.showLubeUpdate = false;
    this.foralltrue = false;
    this.allSelectedMake = [];
    this.allSelectedMake.push(this.SelectedDataarrOfVehicle);
    this.dupseletecmodvari = [];

    this.CreateSpareForm.controls["searchspareVehiclemod"].setValue("");
    this.CreateLubeForm.controls["workshopiddatalube"].setValue(
      this.userworkshopid,
      { onlySelf: true }
    );
    this.CreateLubeForm.controls["partnumber"].setValue(undefined, {
      onlySelf: true,
    });
    this.CreateLubeForm.controls["sellingprice"].setValue(null);
    this.CreateLubeForm.controls["companynameLube"].setValue("");
    this.CreateLubeForm.controls["partname"].setValue("");
    this.CreateLubeForm.controls["subcategory"].setValue(
      this.spareCategory[0],
      { onlySelf: true }
    );
    this.CreateLubeForm.controls["gstslab"].setValue(this.gstNumberArr[0], {
      onlySelf: true,
    });
    this.CreateLubeForm.controls["gsttype"].setValue(this.gsttype[0], {
      onlySelf: true,
    });
    this.CreateLubeForm.controls["unit"].setValue(this.units[2], {
      onlySelf: true,
    });
    this.CreateLubeForm.controls["quantity"].setValue("1", { onlySelf: true });
    this.CreateLubeForm.controls["sellingprice"].setValue(0, {
      onlySelf: true,
    });
    this.CreateLubeForm.controls["purchaseprice"].setValue(0, {
      onlySelf: true,
    });
    this.totalamountonform = 0;
    this.toShowcgst = 0;
    this.toShowsgst = 0;
    this.toShowtotal_gst = 0;
    this.CreateSpareForm.invalid;
  }
  //Value enetered as the lube qunatity is changed
  checkvalueenteredforlube(event, index, indexdata) {
    // if (event.match(/^[0-9]*$/))
    if (event.match(/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/)) {
      if (event != "") {
        var sparedataQuantity = indexdata.current_quantity;
        var sparedatapartnumber = indexdata.part_number;
        this.updateQuantity(
          sparedataQuantity,
          sparedatapartnumber,
          event,
          "lube",
          "minus"
        );
      }
      indexdata["showqunatityerrorlube"] = false;
      var amount = parseFloat(indexdata["unit_sale_price"]) * parseFloat(event);
      this.lubedatatabel[index]["quantity"] = event;
      //this.lubedatatabel[index]["amount"]=amount
      if (this.allBillingData.gst_number != "") {
        if (this.lubedatatabel[index]["sale_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(this.lubedatatabel[index]["unit_sale_price"]),
            this.lubedatatabel[index]["sale_gst_rate"],
            this.lubedatatabel[index]["sale_tax_type"],
            parseInt(this.lubedatatabel[index]["discountvalue"]),
            event,
            this.lubedatatabel[index]["discounttype"]
          );

          this.lubedatatabel[index]["gstcalculateoflube"] =
            totalcal[0]["GSTAmount"];
          this.lubedatatabel[index]["cgstcalculateoflube"] =
            totalcal[0]["CGST"];
          this.lubedatatabel[index]["sgstcalculateoflube"] =
            totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.lubedatatabel[index]["amount"] = totalcal[0]["totalamount"];
        } else if (this.lubedatatabel[index]["purchase_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(this.lubedatatabel[index]["unit_sale_price"]),
            this.lubedatatabel[index]["purchase_gst_rate"],
            this.lubedatatabel[index]["purchase_tax_type"],
            parseInt(this.lubedatatabel[index]["discountvalue"]),
            event,
            this.lubedatatabel[index]["discounttype"]
          );

          this.lubedatatabel[index]["gstcalculateoflube"] =
            totalcal[0]["GSTAmount"];
          this.lubedatatabel[index]["cgstcalculateoflube"] =
            totalcal[0]["CGST"];
          this.lubedatatabel[index]["sgstcalculateoflube"] =
            totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.lubedatatabel[index]["amount"] = totalcal[0]["totalamount"];
        } else {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(this.lubedatatabel[index]["unit_sale_price"]),
            "0",
            "Exclusive",
            parseInt(this.lubedatatabel[index]["discountvalue"]),
            event,
            this.lubedatatabel[index]["discounttype"]
          );
          this.lubedatatabel[index]["amount"] = totalcal[0]["totalamount"];
        }
      } else {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseFloat(this.lubedatatabel[index]["unit_sale_price"]),
          "0",
          "Exclusive",
          parseInt(this.lubedatatabel[index]["discountvalue"]),
          event,
          this.lubedatatabel[index]["discounttype"]
        );
        this.lubedatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.LubeTotal = this.calculateresult(this.lubedatatabel);
      this.LubeTotalFinal = this.calculateresultfinal(this.lubedatatabel);
      this.calculateAmountOfBilling();
      this.calTotalGstForLubeamount = this.calTotalGstForLube(
        this.lubedatatabel
      );
      this.lubedatatabel[index]["totalitemamount"] = this.getTotalAmount(
        indexdata,
        index,
        "job"
      );
    } else {
      indexdata["showqunatityerrorlube"] = true;
    }
  }
  //Value enetered as the lube unit price is changed
  checkvalueenteredPriceforlube(event, index, indexdata) {
    if (event.match(/^\d*\.?\d*$/)) {
      indexdata["showpriceerrorlube"] = false;
      this.lubedatatabel[index]["unit_sale_price"] = event;
      var amount = parseFloat(indexdata["quantity"]) * parseFloat(event);
      //this.lubedatatabel[index]["amount"]=amount
      if (this.allBillingData.gst_number != "") {
        if (this.lubedatatabel[index]["sale_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            event,
            this.lubedatatabel[index]["sale_gst_rate"],
            this.lubedatatabel[index]["sale_tax_type"],
            parseInt(this.lubedatatabel[index]["discountvalue"]),
            //my edit
            parseFloat(this.lubedatatabel[index]["quantity"]),
            this.lubedatatabel[index]["discounttype"]
          );

          this.lubedatatabel[index]["gstcalculateoflube"] =
            totalcal[0]["GSTAmount"];
          this.lubedatatabel[index]["cgstcalculateoflube"] =
            totalcal[0]["CGST"];
          this.lubedatatabel[index]["sgstcalculateoflube"] =
            totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.lubedatatabel[index]["amount"] = totalcal[0]["totalamount"];
          this.lubedatatabel[index]["unit_sale_price"] = event;
        } else if (this.lubedatatabel[index]["purchase_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            event,
            this.lubedatatabel[index]["purchase_gst_rate"],
            this.lubedatatabel[index]["purchase_tax_type"],
            parseInt(this.lubedatatabel[index]["discountvalue"]),
            parseFloat(this.lubedatatabel[index]["quantity"]),
            this.lubedatatabel[index]["discounttype"]
          );

          this.lubedatatabel[index]["gstcalculateoflube"] =
            totalcal[0]["GSTAmount"];
          this.lubedatatabel[index]["cgstcalculateoflube"] =
            totalcal[0]["CGST"];
          this.lubedatatabel[index]["sgstcalculateoflube"] =
            totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.lubedatatabel[index]["amount"] = totalcal[0]["totalamount"];
          this.lubedatatabel[index]["unit_sale_price"] = event;
        } else {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            event,
            "0",
            "Exclusive",
            parseInt(this.lubedatatabel[index]["discountvalue"]),
            parseFloat(this.lubedatatabel[index]["quantity"]),
            this.lubedatatabel[index]["discounttype"]
          );
          this.lubedatatabel[index]["amount"] = totalcal[0]["totalamount"];
          this.lubedatatabel[index]["unit_sale_price"] = event;
        }
      } else {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          event,
          "0",
          "Exclusive",
          parseInt(this.lubedatatabel[index]["discountvalue"]),
          parseFloat(this.lubedatatabel[index]["quantity"]),
          this.lubedatatabel[index]["discounttype"]
        );
        this.lubedatatabel[index]["amount"] = totalcal[0]["totalamount"];
        this.lubedatatabel[index]["unit_sale_price"] = event;
      }
      this.LubeTotal = this.calculateresult(this.lubedatatabel);
      this.LubeTotalFinal = this.calculateresultfinal(this.lubedatatabel);
      this.calculateAmountOfBilling();
      this.lubedatatabel[index]["totalitemamount"] = this.getTotalAmount(
        indexdata,
        index,
        "job"
      );
      // this.calTotalGstForLube(this.lubedatatabel);
      this.calTotalGstForLubeamount = this.calTotalGstForLube(
        this.lubedatatabel
      );
    } else {
      indexdata["showpriceerrorlube"] = true;
    }
  }
  //Value enetered as the lube gst amount is changed
  checklubegst(event, data, index, gstVlaue) {
    var amounttocalculate =
      parseFloat(data["unit_sale_price"]) * parseFloat(data["quantity"]);
    if (data["sale_gst_rate"] != "" && data["sale_tax_type"] != "") {
      this.lubedatatabel[index]["sale_gst_rate"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(this.lubedatatabel[index]["unit_sale_price"]),
        event,
        this.lubedatatabel[index]["sale_tax_type"],
        parseInt(this.lubedatatabel[index]["discountvalue"]),
        parseFloat(this.lubedatatabel[index]["quantity"]),
        this.lubedatatabel[index]["discounttype"]
      );
      this.lubedatatabel[index]["gstcalculateoflube"] =
        totalcal[0]["GSTAmount"];
      this.lubedatatabel[index]["cgstcalculateoflube"] = totalcal[0]["CGST"];
      this.lubedatatabel[index]["sgstcalculateoflube"] = totalcal[0]["SGST"];
      data["showcalcluationinfo"] = true;
      if (gstVlaue != "gstNull") {
        this.lubedatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.lubedatatabel[index]["lubegstamounterror"] = false;
      this.LubeTotal = this.calculateresult(this.lubedatatabel);
      this.LubeTotalFinal = this.calculateresultfinal(this.lubedatatabel);
      this.calculateAmountOfBilling();
      this.lubedatatabel[index]["totalitemamount"] = this.getTotalAmount(
        data,
        index,
        "job"
      );
      this.calTotalGstForLubeamount = this.calTotalGstForLube(
        this.lubedatatabel
      );
      this.checkLubeGSTrateandtype();
    } else if (
      data["purchase_gst_rate"] != "" &&
      data["purchase_tax_type"] != ""
    ) {
      this.lubedatatabel[index]["purchase_gst_rate"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(this.lubedatatabel[index]["unit_sale_price"]),
        event,
        this.lubedatatabel[index]["purchase_tax_type"],
        parseInt(this.lubedatatabel[index]["discountvalue"]),
        parseFloat(this.lubedatatabel[index]["quantity"]),
        this.lubedatatabel[index]["discounttype"]
      );
      this.lubedatatabel[index]["gstcalculateoflube"] =
        totalcal[0]["GSTAmount"];
      this.lubedatatabel[index]["cgstcalculateoflube"] = totalcal[0]["CGST"];
      this.lubedatatabel[index]["sgstcalculateoflube"] = totalcal[0]["SGST"];
      data["showcalcluationinfo"] = true;
      if (gstVlaue != "gstNull") {
        this.lubedatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.lubedatatabel[index]["lubegstamounterror"] = false;
      this.LubeTotal = this.calculateresult(this.lubedatatabel);
      this.LubeTotalFinal = this.calculateresultfinal(this.lubedatatabel);
      this.calculateAmountOfBilling();
      this.lubedatatabel[index]["totalitemamount"] = this.getTotalAmount(
        data,
        index,
        "job"
      );
      this.calTotalGstForLubeamount = this.calTotalGstForLube(
        this.lubedatatabel
      );
      this.checkLubeGSTrateandtype();
    } else {
      this.lubedatatabel[index]["lubegstamounterror"] = false;
      this.lubedatatabel[index]["amount"] = data["amount"];
      this.LubeTotal = this.calculateresult(this.lubedatatabel);
      this.LubeTotalFinal = this.calculateresultfinal(this.lubedatatabel);
      this.calculateAmountOfBilling();
      this.lubedatatabel[index]["totalitemamount"] = this.getTotalAmount(
        data,
        index,
        "job"
      );
      this.calTotalGstForLubeamount = this.calTotalGstForLube(
        this.lubedatatabel
      );
      this.checkLubeGSTrateandtype();
    }
  }
  //Value enetered as the lube gst type is changed
  checklubegsttype(event, data, index, gstVlaue) {
    var amounttocalculate =
      parseFloat(data["unit_sale_price"]) * parseFloat(data["quantity"]);
    if (data["sale_gst_rate"] != "" && data["sale_tax_type"] != "") {
      this.lubedatatabel[index]["sale_tax_type"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(this.lubedatatabel[index]["unit_sale_price"]),
        this.lubedatatabel[index]["sale_gst_rate"],
        event,
        parseInt(this.lubedatatabel[index]["discountvalue"]),
        //my edit
        parseFloat(this.lubedatatabel[index]["quantity"]),
        this.lubedatatabel[index]["discounttype"]
      );
      this.lubedatatabel[index]["gstcalculateoflube"] =
        totalcal[0]["GSTAmount"];
      this.lubedatatabel[index]["cgstcalculateoflube"] = totalcal[0]["CGST"];
      this.lubedatatabel[index]["sgstcalculateoflube"] = totalcal[0]["SGST"];
      data["showcalcluationinfo"] = true;
      if (gstVlaue != "gstNull") {
        this.lubedatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.lubedatatabel[index]["lubegsttypeerror"] = false;
      this.LubeTotal = this.calculateresult(this.lubedatatabel);
      this.LubeTotalFinal = this.calculateresultfinal(this.lubedatatabel);
      this.calculateAmountOfBilling();
      this.lubedatatabel[index]["totalitemamount"] = this.getTotalAmount(
        data,
        index,
        "job"
      );
      this.calTotalGstForLubeamount = this.calTotalGstForLube(
        this.lubedatatabel
      );
      this.checkLubeGSTrateandtype();
    } else if (
      data["purchase_gst_rate"] != "" &&
      data["purchase_tax_type"] != ""
    ) {
      this.lubedatatabel[index]["purchase_tax_type"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(this.lubedatatabel[index]["unit_sale_price"]),
        this.lubedatatabel[index]["purchase_gst_rate"],
        event,
        parseInt(this.lubedatatabel[index]["discountvalue"]),
        parseFloat(this.lubedatatabel[index]["quantity"]),
        this.lubedatatabel[index]["discounttype"]
      );

      this.lubedatatabel[index]["gstcalculateoflube"] =
        totalcal[0]["GSTAmount"];
      this.lubedatatabel[index]["cgstcalculateoflube"] = totalcal[0]["CGST"];
      this.lubedatatabel[index]["sgstcalculateoflube"] = totalcal[0]["SGST"];
      data["showcalcluationinfo"] = true;
      if (gstVlaue != "gstNull") {
        this.lubedatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.lubedatatabel[index]["lubegsttypeerror"] = false;
      this.LubeTotal = this.calculateresult(this.lubedatatabel);
      this.LubeTotalFinal = this.calculateresultfinal(this.lubedatatabel);
      this.calculateAmountOfBilling();
      this.lubedatatabel[index]["totalitemamount"] = this.getTotalAmount(
        data,
        index,
        "job"
      );
      this.calTotalGstForLubeamount = this.calTotalGstForLube(
        this.lubedatatabel
      );
      this.checkLubeGSTrateandtype();
    } else {
      this.lubedatatabel[index]["lubegsttypeerror"] = false;
      this.lubedatatabel[index]["amount"] = data["amount"];
      this.LubeTotal = this.calculateresult(this.lubedatatabel);
      this.LubeTotalFinal = this.calculateresultfinal(this.lubedatatabel);
      this.calculateAmountOfBilling();
      this.lubedatatabel[index]["totalitemamount"] = this.getTotalAmount(
        data,
        index,
        "job"
      );
      this.calTotalGstForLubeamount = this.calTotalGstForLube(
        this.lubedatatabel
      );
      this.checkLubeGSTrateandtype();
    }
  }
  //Value enetered as the lube gst type and amount is changed in side popup
  checkLubeGSTrateandtype() {
    var lubedatatabelfilter = this.lubedatatabel.filter(
      (lube) => lube.lubegsttypeerror == true || lube.lubegstamounterror == true
    );
    if (lubedatatabelfilter.length != 0) {
      this.lubegsterror = true;
      this.lubelenghtoferror = lubedatatabelfilter.length;
    } else {
      this.lubegsterror = false;
      this.lubelenghtoferror = 0;
    }
  }
  // Create New Lube form with validations
  createLubeForm() {
    this.CreateLubeForm = this.formbuild.group({
      workshopiddatalube: [this.userworkshopid],
      partnumber: [""],
      partname: ["", Validators.required],
      companynameLube: ["", Validators.required],
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
  //API call to Create New Lube
  createLubeByAPI(mode) {
    var purchase_qty = this.CreateLubeForm.value.quantity;
    var purchase_total_amount = 0;
    var purchase_discount = "";
    var purchase_cgst = 0;
    var purchase_sgst = 0;
    var purchase_igst = 0;
    var purchase_total_gst = 0;
    var sale_qty = this.CreateLubeForm.value.quantity;
    var sale_total_amount = 0;
    var sale_discount = "";
    var sale_cgst = 0;
    var sale_sgst = 0;
    var sale_igst = 0;
    var sale_total_gst = 0;
    if (this.allBillingData.gst_number != "") {
      if (this.CreateLubeForm.value.gsttype == this.gsttype[0]) {
        if (this.CreateLubeForm.value.purchaseprice != 0) {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateLubeForm.value.purchaseprice.toString(),
            this.CreateLubeForm.value.gstslab,
            this.gsttype[0]
          );
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        } else {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateLubeForm.value.sellingprice.toString(),
            this.CreateLubeForm.value.gstslab,
            this.gsttype[0]
          );
          sale_total_amount = GSTCal[0]["totalamount"];
          sale_cgst = GSTCal[0]["CGST"];
          sale_sgst = GSTCal[0]["SGST"];
          sale_total_gst = GSTCal[0]["GSTAmount"];
          this.CreateLubeForm.value.purchaseprice =
            this.CreateLubeForm.value.sellingprice;
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        }
      } else {
        if (this.CreateLubeForm.value.purchaseprice != 0) {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateLubeForm.value.purchaseprice.toString(),
            this.CreateLubeForm.value.gstslab,
            this.gsttype[1]
          );
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        } else {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateLubeForm.value.sellingprice.toString(),
            this.CreateLubeForm.value.gstslab,
            this.gsttype[1]
          );
          sale_total_amount = GSTCal[0]["totalamount"];
          sale_cgst = GSTCal[0]["CGST"];
          sale_sgst = GSTCal[0]["SGST"];
          sale_total_gst = GSTCal[0]["GSTAmount"];
          this.CreateLubeForm.value.purchaseprice =
            this.CreateLubeForm.value.sellingprice;
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        }
      }
    } else {
      if (this.CreateLubeForm.value.purchaseprice == 0) {
        this.CreateLubeForm.value.purchaseprice =
          this.CreateLubeForm.value.sellingprice;
      }
    }
    var workshopid;
    if (this.CreateLubeForm.value.workshopiddatalube == "1") {
      mode = "create";
      workshopid = this.userworkshopid;
    } else {
      mode = mode;
      workshopid = this.CreateLubeForm.value.workshopiddatalube;
    }
    var part_number;
    if (this.CreateLubeForm.getRawValue().partnumber == undefined) {
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
      part_number = this.CreateLubeForm.getRawValue().partnumber;
    }
    this.general
      .saveJobSapreLubeProfile(
        "lube",
        mode,
        part_number,
        this.CreateLubeForm.value.partname,
        "",
        this.CreateLubeForm.value.unit,
        "lube",
        "",
        "",
        this.CreateLubeForm.value.subcategory,
        JSON.stringify(this.allSelectedMake),
        this.CreateLubeForm.value.quantity,
        this.CreateLubeForm.value.lowerlimit,
        this.CreateLubeForm.value.rackno,
        this.CreateLubeForm.value.hsnno,
        this.CreateLubeForm.value.purchaseprice,
        purchase_qty,
        this.CreateLubeForm.value.gstslab,
        this.CreateLubeForm.value.gsttype,
        purchase_total_amount,
        purchase_discount,
        purchase_cgst,
        purchase_sgst,
        purchase_igst,
        purchase_total_gst,
        this.CreateLubeForm.value.sellingprice,
        sale_qty,
        this.CreateLubeForm.value.gstslab,
        this.CreateLubeForm.value.gsttype,
        sale_total_amount,
        sale_discount,
        sale_cgst,
        sale_sgst,
        sale_igst,
        sale_total_gst,
        this.CreateLubeForm.value.companynameLube,
        workshopid
      )
      .subscribe(
        (SaveResult) => {
          this.showspinner.setSpinnerForLogin(true);
          if (SaveResult.success == true) {
            this.showspinner.setSpinnerForLogin(false);
            this.snakBar.open(
              "Success",
              ErrorMessgae[0][SaveResult["message"]],
              {
                duration: 4000,
              }
            );
            SaveResult.lubedata["amount"] = "";
            SaveResult.lubedata["quantity"] = "1";
            SaveResult.lubedata["showqunatityerrorlube"] = null;
            SaveResult.lubedata["showpriceerrorlube"] = null;
            SaveResult.lubedata["allownegativeinlube"] = null;
            SaveResult.lubedata["checkinsertedlube"] = null;
            SaveResult.lubedata["gstcalculateoflube"] = null;
            SaveResult.lubedata["cgstcalculateoflube"] = null;
            SaveResult.lubedata["sgstcalculateoflube"] = null;
            SaveResult.lubedata["showcalcluationinfo"] = null;
            SaveResult.lubedata["lubegstamounterror"] = null;
            SaveResult.lubedata["lubegsttypeerror"] = null;
            if (this.assignedMechanicArray.length == 0) {
              SaveResult.lubedata["lubeassignedmechanic"] = [
                this.jobcardSettingData.default_mechanic[0].name
                  .charAt(0)
                  .toUpperCase() +
                  this.jobcardSettingData.default_mechanic[0].name.slice(1),
              ];
            } else {
              SaveResult.lubedata["lubeassignedmechanic"] =
                this.assignedMechanicArray;
            }
            this.makelubetable(SaveResult.lubedata);
            this.LubeTotal = this.calculateresult(this.lubedatatabel);
            this.LubeTotalFinal = this.calculateresultfinal(this.lubedatatabel);
            this.calculateAmountOfBilling();
            this.calTotalGstForLubeamount = this.calTotalGstForLube(
              this.lubedatatabel
            );
          } else {
            this.showspinner.setSpinnerForLogin(false);
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
          this.showspinner.setSpinnerForLogin(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  //select the comaoy for inventiory
  selectedcomapny(event, category) {
    if (event != undefined) {
      if (category == "spare") {
        this.CreateSpareForm.controls["companynameSpare"].setValue(event, {
          onlySelf: true,
        });
      } else if (category == "lube") {
        this.CreateLubeForm.controls["companynameLube"].setValue(event, {
          onlySelf: true,
        });
      }
    }
  }
  //search the company
  searchBarForCompany(event, category) {
    this.general.searchCompanyName(event, category).subscribe(
      (searchData) => {
        if (searchData["success"] == true) {
          this.searchSpareCompany = [];
          searchData["companydetails"].map((data) => {
            this.searchSpareCompany.push(data["company_name"]);
            this.mainsparecompanyarrspl.push(data);
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
  //search the company for lube
  searchBarForCompanyLube(event, category) {
    this.general.searchCompanyName(event, category).subscribe(
      (searchData) => {
        if (searchData["success"] == true) {
          this.searchLubeCompany = [];
          searchData["companydetails"].map((data) => {
            this.searchLubeCompany.push(data["company_name"]);
            this.mainlubecompanyarrspl.push(data);
          });
        } else {
          this.searchLubeCompany = [];
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
  // Select Assigned Mechanic
  onDeSelectAssignedLube(event, selecttype, data, index) {
    if (selecttype == "all") {
      this.lubedatatabel[index]["lubeassignedmechanic"] = event;
    } else {
      this.lubedatatabel[index]["lubeassignedmechanic"] = this.lubedatatabel[
        index
      ]["lubeassignedmechanic"].filter(
        (mechanic) => mechanic.name != event.name
      );
    }
  }
  // DeSelect Assigned Mechanic
  onItemSelectAssignedLube(event, selecttype, data, index) {
    if (selecttype == "all") {
      this.lubedatatabel[index]["lubeassignedmechanic"] = event;
    } else {
      this.lubedatatabel[index]["lubeassignedmechanic"].push(event);
    }
  }
  //---------------------------SPARES FORM----------------------------------------------------------
  // Get all lubes all spares all jobs when user cliks on search bar first time
  getallData(mode) {
    if (mode == "job") {
      this.jobclass = "";
      this.spareclass = "";
      this.lubeclass = "";
      this.jobclass = "totalandname totaldivv";
      this.spareclass = "totalandname";
      this.lubeclass = "totalandname";
    } else if (mode == "lube") {
      this.jobclass = "";
      this.spareclass = "";
      this.lubeclass = "";
      this.jobclass = "totalandname";
      this.spareclass = "totalandname";
      this.lubeclass = "totalandname totaldivv";
    } else if (mode == "spare") {
      this.jobclass = "";
      this.spareclass = "";
      this.lubeclass = "";
      this.jobclass = "totalandname";
      this.spareclass = "totalandname totaldivv";
      this.lubeclass = "totalandname";
    }
    // this.general.getJobSpareLubeAllData(this.userworkshopid,mode).subscribe(getAll=>{
    //   this.showspinner.setSpinnerForLogin(true)
    //   if(getAll.success==true && getAll.data=="sapre"){
    //     if(getAll.sparedata!=undefined){
    //       //this.searchSpareData=[]
    //       for(var i=0;i<getAll.sparedata.length;i++){
    //         if(!this.spareduplicate.includes(getAll.sparedata[i].part_name)){
    //           if(getAll.sparedata[i].unit_sale_price!=''){
    //             this.spareduplicate.push(getAll.sparedata[i].part_name)
    //             this.searchSpareData.push(getAll.sparedata[i].part_name+'------'+getAll.sparedata[i].part_number+'------'+getAll.sparedata[i].unit_sale_price)
    //           }else{
    //             this.spareduplicate.push(getAll.sparedata[i].part_name)
    //             this.searchSpareData.push(getAll.sparedata[i].part_name+'------'+getAll.sparedata[i].part_number)
    //           }
    //         }

    //       }
    //       this.showspinner.setSpinnerForLogin(false)
    //     }
    //   }else{
    //     //this.searchSpareData=["Enter Part Number or part name"]
    //     this.showspinner.setSpinnerForLogin(false)
    //     //this.searchSpareData.push("No Data Found")
    //   }
    //   if(getAll.success==true&& getAll.data=="lube"){
    //     if(getAll.lubedata!=undefined){
    //       //this.searchLubeData=[]
    //       for(var i=0;i<getAll.lubedata.length;i++){
    //         if(!this.lubeduplicate.includes(getAll.lubedata[i].part_name)){
    //           if(getAll.lubedata[i].unit_sale_price!=''){
    //             this.lubeduplicate.push(getAll.lubedata[i].part_name)
    //             this.searchLubeData.push(getAll.lubedata[i].part_name+'------'+getAll.lubedata[i].part_number+'------'+getAll.lubedata[i].unit_sale_price)
    //           }else{
    //             this.lubeduplicate.push(getAll.lubedata[i].part_name)
    //             this.searchLubeData.push(getAll.lubedata[i].part_name+'------'+getAll.lubedata[i].part_number)
    //           }
    //         }

    //       }
    //     }
    //     this.showspinner.setSpinnerForLogin(false)
    //   }else{
    //     //this.searchLubeData=[]
    //     this.showspinner.setSpinnerForLogin(false)
    //     //this.searchLubeData.push("No Data Found")
    //   }

    //   if(getAll.success==true&& getAll.data=="job"){
    //     if(getAll.jobdata!=undefined){
    //       //this.searchJobData=[]
    //       for(var i=0;i<getAll.jobdata.length;i++){
    //         if(!this.jobduplicate.includes(getAll.jobdata[i].part_name)){
    //           if(getAll.jobdata[i].unit_sale_price!=''){
    //             this.jobduplicate.push(getAll.jobdata[i].part_name)
    //             this.searchJobData.push(getAll.jobdata[i].part_name+'------'+getAll.jobdata[i].part_number+'------'+getAll.jobdata[i].unit_sale_price)
    //           }else{
    //             this.jobduplicate.push(getAll.jobdata[i].part_name)
    //             this.searchJobData.push(getAll.jobdata[i].part_name+'------'+getAll.jobdata[i].part_number)
    //           }
    //         }

    //       }
    //     }
    //     this.showspinner.setSpinnerForLogin(false)
    //   }else{
    //     //this.searchJobData=[]
    //     this.showspinner.setSpinnerForLogin(false)
    //     //this.searchJobData.push("No Data Found")
    //   }

    // },err=>{
    //   this.showspinner.setSpinnerForLogin(false)
    //     this.snakBar.open(err, ErrorMessgae[0][err], {
    //       duration: 4000
    //     })
    // })
  }
  // After Search User Select the spare to insert it in tabel
  selectedSpareResult(event) {
    var partnumber;
    partnumber = event.split("(Part No:-")[1].split(")----")[0];
    if (event.split("(Part No:-").length != 0) {
      this.general
        .getJobSpareLubeData(this.userworkshopid, "spare", partnumber)
        .subscribe(
          (SpareData) => {
            this.sparemodel = "";
            this.showspinner.setSpinnerForLogin(true);
            this.makesparetable(SpareData.sparedata[0]);
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
  // Insert the selected record in the spare tbael in form
  makesparetable(spareData) {
    var sparedataQuantity = spareData.current_quantity;
    var sparedatapartnumber = spareData.part_number;
    this.duplicateSpare.push(spareData);
    var result = this.duplicateSpare.reduce((unique, o) => {
      this.checkforquantity = false;
      if (!unique.some((obj) => obj.part_number === o.part_number)) {
        if (o.checkinsertedspare == undefined) {
          if (this.settingInven[0].negative_inventory != 1) {
            if (
              o.current_quantity == "0.0" ||
              o.current_quantity.split("")[0] == "-"
            ) {
              this.negativevalue = o.current_quantity;
              this.negativearryforspare = o;
              this.shownegativeinventory = true;
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
                      o.gstcalculateofspare = totalcal[0]["GSTAmount"];
                      o.cgstcalculateofspare = totalcal[0]["CGST"];
                      o.sgstcalculateofspare = totalcal[0]["SGST"];
                      o.showcalcluationinfo = true;
                      o.amount = o.unit_sale_price;
                      o.sparegstamounterror = false;
                      if (!this.gsttype.includes(o.sale_tax_type)) {
                        o.sparegsttypeerror = true;
                      } else {
                        o.sparegsttypeerror = false;
                      }
                    } else {
                      o.amount = o.unit_sale_price;
                      o.sparegstamounterror = true;
                      if (!this.gsttype.includes(o.sale_tax_type)) {
                        o.sparegsttypeerror = true;
                      } else {
                        o.sparegsttypeerror = false;
                      }
                    }
                  } else {
                    if (this.gstNumberArr.includes(o.sale_gst_rate)) {
                      var totalcal = this.CalculateInclusiveGSTRate(
                        o.unit_sale_price,
                        o.sale_gst_rate,
                        o.sale_tax_type
                      );
                      o.gstcalculateofspare = totalcal[0]["GSTAmount"];
                      o.cgstcalculateofspare = totalcal[0]["CGST"];
                      o.sgstcalculateofspare = totalcal[0]["SGST"];
                      o.showcalcluationinfo = true;
                      o.amount = totalcal[0]["totalamount"];
                      o.sparegstamounterror = false;
                      if (!this.gsttype.includes(o.sale_tax_type)) {
                        o.sparegsttypeerror = true;
                      } else {
                        o.sparegsttypeerror = false;
                      }
                    } else {
                      o.amount = o.unit_sale_price;
                      o.sparegstamounterror = true;
                      if (!this.gsttype.includes(o.sale_tax_type)) {
                        o.sparegsttypeerror = true;
                      } else {
                        o.sparegsttypeerror = false;
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
                      o.gstcalculateofspare = totalcal[0]["GSTAmount"];
                      o.cgstcalculateofspare = totalcal[0]["CGST"];
                      o.sgstcalculateofspare = totalcal[0]["SGST"];
                      o.showcalcluationinfo = true;
                      o.amount = o.unit_sale_price;
                      o.sparegstamounterror = false;
                      if (!this.gsttype.includes(o.purchase_tax_type)) {
                        o.sparegsttypeerror = true;
                      } else {
                        o.sparegsttypeerror = false;
                      }
                    } else {
                      o.amount = o.unit_sale_price;
                      o.sparegstamounterror = true;
                      if (!this.gsttype.includes(o.purchase_tax_type)) {
                        o.sparegsttypeerror = true;
                      } else {
                        o.sparegsttypeerror = false;
                      }
                    }
                  } else {
                    if (this.gstNumberArr.includes(o.purchase_gst_rate)) {
                      var totalcal = this.CalculateInclusiveGSTRate(
                        o.unit_sale_price,
                        o.purchase_gst_rate,
                        o.purchase_tax_type
                      );
                      o.gstcalculateofspare = totalcal[0]["GSTAmount"];
                      o.cgstcalculateofspare = totalcal[0]["CGST"];
                      o.sgstcalculateofspare = totalcal[0]["SGST"];
                      o.showcalcluationinfo = true;
                      o.amount = totalcal[0]["totalamount"];
                      o.sparegstamounterror = false;
                      if (!this.gsttype.includes(o.purchase_tax_type)) {
                        o.sparegsttypeerror = true;
                      } else {
                        o.sparegsttypeerror = false;
                      }
                    } else {
                      o.amount = o.unit_sale_price;
                      o.sparegstamounterror = true;
                      if (!this.gsttype.includes(o.purchase_tax_type)) {
                        o.sparegsttypeerror = true;
                      } else {
                        o.sparegsttypeerror = false;
                      }
                    }
                  }
                } else {
                  o.amount = o.unit_sale_price;
                  o.sparegsttypeerror = true;
                  o.sparegstamounterror = true;
                }
              } else {
                o.amount = o.unit_sale_price;
              }
              o.quantity = "1";
              o.discounttype = "%";
              o.discountvalue = this.spareisvalue;
              o.showqunatityerrorspare = false;
              o.showpriceerrorspare = false;
              o.checkinsertedspare = true;
              // o.spareassignedmechanic = [
              //   this.jobcardSettingData.default_mechanic[0].name
              //     .charAt(0)
              //     .toUpperCase() +
              //     this.jobcardSettingData.default_mechanic[0].name.slice(1),
              // ];
              o.spareassignedmechanic = this.selectedStaffId;
              o["totalitemamount"] = this.getTotalAmount(o, "1", "job");
              unique.push(o);
              this.shownegativeinventory = false;
              this.showduplicateSpare = false;
              this.updateQuantity(
                sparedataQuantity,
                sparedatapartnumber,
                1,
                "spare",
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
                    o.gstcalculateofspare = totalcal[0]["GSTAmount"];
                    o.cgstcalculateofspare = totalcal[0]["CGST"];
                    o.sgstcalculateofspare = totalcal[0]["SGST"];
                    o.showcalcluationinfo = true;
                    o.amount = o.unit_sale_price;
                    o.sparegstamounterror = false;
                    if (!this.gsttype.includes(o.sale_tax_type)) {
                      o.sparegsttypeerror = true;
                    } else {
                      o.sparegsttypeerror = false;
                    }
                  } else {
                    o.amount = o.unit_sale_price;
                    o.sparegstamounterror = true;
                    if (!this.gsttype.includes(o.sale_tax_type)) {
                      o.sparegsttypeerror = true;
                    } else {
                      o.sparegsttypeerror = false;
                    }
                  }
                } else {
                  if (this.gstNumberArr.includes(o.sale_gst_rate)) {
                    var totalcal = this.CalculateInclusiveGSTRate(
                      o.unit_sale_price,
                      o.sale_gst_rate,
                      o.sale_tax_type
                    );
                    o.gstcalculateofspare = totalcal[0]["GSTAmount"];
                    o.cgstcalculateofspare = totalcal[0]["CGST"];
                    o.sgstcalculateofspare = totalcal[0]["SGST"];
                    o.showcalcluationinfo = true;
                    o.amount = totalcal[0]["totalamount"];
                    o.sparegstamounterror = false;
                    if (!this.gsttype.includes(o.sale_tax_type)) {
                      o.sparegsttypeerror = true;
                    } else {
                      o.sparegsttypeerror = false;
                    }
                  } else {
                    o.amount = o.unit_sale_price;
                    o.sparegstamounterror = true;
                    if (!this.gsttype.includes(o.sale_tax_type)) {
                      o.sparegsttypeerror = true;
                    } else {
                      o.sparegsttypeerror = false;
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
                    o.gstcalculateofspare = totalcal[0]["GSTAmount"];
                    o.cgstcalculateofspare = totalcal[0]["CGST"];
                    o.sgstcalculateofspare = totalcal[0]["SGST"];
                    o.showcalcluationinfo = true;
                    o.amount = o.unit_sale_price;
                    o.sparegstamounterror = false;
                    if (!this.gsttype.includes(o.purchase_tax_type)) {
                      o.sparegsttypeerror = true;
                    } else {
                      o.sparegsttypeerror = false;
                    }
                  } else {
                    o.amount = o.unit_sale_price;
                    o.sparegstamounterror = true;
                    if (!this.gsttype.includes(o.purchase_tax_type)) {
                      o.sparegsttypeerror = true;
                    } else {
                      o.sparegsttypeerror = false;
                    }
                  }
                } else {
                  if (this.gstNumberArr.includes(o.purchase_gst_rate)) {
                    var totalcal = this.CalculateInclusiveGSTRate(
                      o.unit_sale_price,
                      o.purchase_gst_rate,
                      o.purchase_tax_type
                    );
                    o.gstcalculateofspare = totalcal[0]["GSTAmount"];
                    o.cgstcalculateofspare = totalcal[0]["CGST"];
                    o.sgstcalculateofspare = totalcal[0]["SGST"];
                    o.showcalcluationinfo = true;
                    o.amount = totalcal[0]["totalamount"];
                    o.sparegstamounterror = false;
                    if (!this.gsttype.includes(o.purchase_tax_type)) {
                      o.sparegsttypeerror = true;
                    } else {
                      o.sparegsttypeerror = false;
                    }
                  } else {
                    o.amount = o.unit_sale_price;
                    o.sparegstamounterror = true;
                    if (!this.gsttype.includes(o.purchase_tax_type)) {
                      o.sparegsttypeerror = true;
                    } else {
                      o.sparegsttypeerror = false;
                    }
                  }
                }
              } else {
                o.amount = o.unit_sale_price;
                o.sparegsttypeerror = true;
                o.sparegstamounterror = true;
              }
            } else {
              o.amount = o.unit_sale_price;
            }
            o.quantity = "1";
            o.discounttype = "%";
            o.discountvalue = this.spareisvalue;
            o.showqunatityerrorspare = false;
            o.showpriceerrorspare = false;
            o.checkinsertedspare = true;
            // o.spareassignedmechanic = [
            //   this.jobcardSettingData.default_mechanic[0].name
            //     .charAt(0)
            //     .toUpperCase() +
            //     this.jobcardSettingData.default_mechanic[0].name.slice(1),
            // ];
            o.spareassignedmechanic = this.selectedStaffId;
            o["totalitemamount"] = this.getTotalAmount(o, "1", "job");
            unique.push(o);
            this.shownegativeinventory = false;
            this.showduplicateSpare = false;
            this.updateQuantity(
              sparedataQuantity,
              sparedatapartnumber,
              1,
              "spare",
              "minus"
            );
          }
        } else {
          o["totalitemamount"] = this.getTotalAmount(o, "1", "job");
          unique.push(o);
          this.shownegativeinventory = false;
          this.showduplicateSpare = false;
        }
      } else {
        this.showduplicateSpare = true;
        this.shownegativeinventory = false;
        this.duplicateSparename = o["part_name"];
      }
      return unique;
    }, []);
    this.sparedatatabel = result;
    this.SpareTotal = this.calculateresult(this.sparedatatabel);
    this.SpareTotalFinal = this.calculateresultfinal(this.sparedatatabel);
    this.calculateAmountOfBilling();
    this.calTotalGstForSpareamount = this.calTotalGstForSpare(
      this.sparedatatabel
    );
    this.checkSpareGSTrateandtype();
    if (this.spareisvalue != 0) {
      this.checkdiscountofspare(this.spareisvalue, "false");
    }
    this.showspinner.setSpinnerForLogin(false);
    this.mechanicerror = false;
  }
  //get the discount vale
  sparediscountvalue(event, indexdata, index, flag) {
    if (event.match(/^\d*\.?\d*$/)) {
      indexdata["showdiscountspare"] = false;
      this.sparedatatabel[index]["discountvalue"] = event;
      if (this.allBillingData.gst_number != "") {
        if (this.sparedatatabel[index]["sale_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(this.sparedatatabel[index]["unit_sale_price"]),
            this.sparedatatabel[index]["sale_gst_rate"],
            this.sparedatatabel[index]["sale_tax_type"],
            event,
            parseFloat(this.sparedatatabel[index]["quantity"]),
            this.sparedatatabel[index]["discounttype"]
          );

          // this.sparedatatabel[index]["gstcalculateofjob"] =
          //   totalcal[0]["GSTAmount"];
          // this.sparedatatabel[index]["cgstcalculateofjob"] =
          //   totalcal[0]["CGST"];
          // this.sparedatatabel[index]["sgstcalculateofjob"] =
          //   totalcal[0]["SGST"];
          this.sparedatatabel[index]["gstcalculateofspare"] =
            totalcal[0]["GSTAmount"];
          this.sparedatatabel[index]["cgstcalculateofspare"] =
            totalcal[0]["CGST"];
          this.sparedatatabel[index]["sgstcalculateofspare"] =
            totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.sparedatatabel[index]["amount"] = totalcal[0]["totalamount"];
        } else if (this.sparedatatabel[index]["purchase_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseInt(this.sparedatatabel[index]["unit_purchase_price"]),
            this.sparedatatabel[index]["purchase_gst_rate"],
            this.sparedatatabel[index]["purchase_tax_type"],
            event,
            parseFloat(this.sparedatatabel[index]["quantity"]),
            this.sparedatatabel[index]["discounttype"]
          );
          this.sparedatatabel[index]["gstcalculateofspare"] =
            totalcal[0]["GSTAmount"];
          this.sparedatatabel[index]["cgstcalculateofspare"] =
            totalcal[0]["CGST"];
          this.sparedatatabel[index]["sgstcalculateofspare"] =
            totalcal[0]["SGST"];
          totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.sparedatatabel[index]["amount"] = totalcal[0]["totalamount"];
        } else {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(this.sparedatatabel[index]["unit_sale_price"]),
            "0",
            "Inclusive",
            event,
            parseFloat(this.sparedatatabel[index]["quantity"]),
            this.sparedatatabel[index]["discounttype"]
          );
          this.sparedatatabel[index]["amount"] = totalcal[0]["totalamount"];
        }
      } else {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseFloat(this.sparedatatabel[index]["unit_sale_price"]),
          "0",
          "Inclusive",
          event,
          parseFloat(this.sparedatatabel[index]["quantity"]),
          this.sparedatatabel[index]["discounttype"]
        );
        this.sparedatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.SpareTotal = this.calculateresult(this.sparedatatabel);
      this.SpareTotalFinal = this.calculateresultfinal(this.sparedatatabel);
      this.calculateAmountOfBilling();
      this.sparedatatabel[index]["totalitemamount"] = this.getTotalAmount(
        indexdata,
        index,
        "job"
      );
      //
      this.calTotalGstForSpareamount = this.calTotalGstForSpare(
        this.sparedatatabel
      );
      if (flag == "false") {
        if (event >= 0) {
          if (this.sparedatatabel.length != 0) {
            var idarr = [];
            this.sparedatatabel.filter((data) => {
              if (data.discountvalue != 0) {
                idarr.push(data.discountvalue);
              }
              if (data.discounttype != "%") {
                idarr.push(data.discountvalue);
              }
            });
            if (idarr.length != 0) {
              this.showsparedis = true;
              this.spareisvalue = 0;
            } else {
              this.showsparedis = false;
            }
          }
        }
      }
    } else {
      indexdata["showdiscountspare"] = true;
    }
  }
  //update Discount type eneter
  checksparediscountData(event, indexdata, index, falg) {
    this.sparedatatabel[index]["discounttype"] = event;
    if (this.allBillingData.gst_number != "") {
      if (this.sparedatatabel[index]["sale_gst_rate"] != "") {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseFloat(this.sparedatatabel[index]["unit_sale_price"]),
          this.sparedatatabel[index]["sale_gst_rate"],
          this.sparedatatabel[index]["sale_tax_type"],
          parseInt(this.sparedatatabel[index]["discountvalue"]),
          parseFloat(this.sparedatatabel[index]["quantity"]),
          event
        );

        // this.sparedatatabel[index]["gstcalculateofjob"] =
        //   totalcal[0]["GSTAmount"];
        // this.sparedatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
        // this.sparedatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
        this.sparedatatabel[index]["gstcalculateofspare"] =
          totalcal[0]["GSTAmount"];
        this.sparedatatabel[index]["cgstcalculateofspare"] =
          totalcal[0]["CGST"];
        this.sparedatatabel[index]["sgstcalculateofspare"] =
          totalcal[0]["SGST"];
        indexdata["showcalcluationinfo"] = true;
        this.sparedatatabel[index]["amount"] = totalcal[0]["totalamount"];
      } else if (this.sparedatatabel[index]["purchase_gst_rate"] != "") {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseFloat(this.sparedatatabel[index]["unit_purchase_price"]),
          this.sparedatatabel[index]["purchase_gst_rate"],
          this.sparedatatabel[index]["purchase_tax_type"],
          parseInt(this.sparedatatabel[index]["discountvalue"]),
          parseFloat(this.sparedatatabel[index]["quantity"]),
          event
        );
        // this.sparedatatabel[index]["gstcalculateofjob"] =
        //   totalcal[0]["GSTAmount"];
        // this.sparedatatabel[index]["cgstcalculateofjob"] = totalcal[0]["CGST"];
        // this.sparedatatabel[index]["sgstcalculateofjob"] = totalcal[0]["SGST"];
        this.sparedatatabel[index]["gstcalculateofspare"] =
          totalcal[0]["GSTAmount"];
        this.sparedatatabel[index]["cgstcalculateofspare"] =
          totalcal[0]["CGST"];
        this.sparedatatabel[index]["sgstcalculateofspare"] =
          totalcal[0]["SGST"];
        indexdata["showcalcluationinfo"] = true;
        this.sparedatatabel[index]["amount"] = totalcal[0]["totalamount"];
      } else {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseFloat(this.sparedatatabel[index]["unit_sale_price"]),
          "0",
          "Inclusive",
          parseInt(this.sparedatatabel[index]["discountvalue"]),
          parseFloat(this.sparedatatabel[index]["quantity"]),
          event
        );
        this.sparedatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
    } else {
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(this.sparedatatabel[index]["unit_sale_price"]),
        "0",
        "Inclusive",
        parseInt(this.sparedatatabel[index]["discountvalue"]),
        parseFloat(this.sparedatatabel[index]["quantity"]),
        event
      );
      this.sparedatatabel[index]["amount"] = totalcal[0]["totalamount"];
    }
    this.SpareTotal = this.calculateresult(this.sparedatatabel);
    this.SpareTotalFinal = this.calculateresultfinal(this.sparedatatabel);
    this.calculateAmountOfBilling();
    this.sparedatatabel[index]["totalitemamount"] = this.getTotalAmount(
      indexdata,
      index,
      "job"
    );
    //
    this.calTotalGstForSpareamount = this.calTotalGstForSpare(
      this.sparedatatabel
    );
    if (falg == "false") {
      if (event != "%") {
        if (this.sparedatatabel.length != 0) {
          var idarr = [];
          this.sparedatatabel.filter((data) => {
            if (data.discountvalue != 0) {
              idarr.push(data.discountvalue);
            }
            if (data.discounttype != "%") {
              idarr.push(data.discountvalue);
            }
          });
          if (idarr.length != 0) {
            this.showsparedis = true;
            this.spareisvalue = 0;
          } else {
            this.showsparedis = true;
          }
        }
      } else {
        if (this.sparedatatabel.length != 0) {
          var idarr = [];
          this.sparedatatabel.filter((data) => {
            if (data.discountvalue != 0) {
              idarr.push(data.discountvalue);
            }
            if (data.discounttype != "%") {
              idarr.push(data.discountvalue);
            }
          });
          if (idarr.length != 0) {
            this.showsparedis = true;
            this.spareisvalue = 0;
          } else {
            this.showsparedis = false;
          }
        }
      }
    }
  }
  // Add the negative Quantity Spare forcefully if user wants to add that
  addnegative(event) {
    var sparedataQuantity = this.negativearryforspare.current_quantity;
    var sparedatapartnumber = this.negativearryforspare.part_number;
    if (event == true) {
      if (this.allBillingData.gst_number != "") {
        if (this.negativearryforspare.sale_gst_rate != "") {
          if (this.negativearryforspare.sale_tax_type == "Inclusive") {
            if (
              this.gstNumberArr.includes(
                this.negativearryforspare.sale_gst_rate
              )
            ) {
              var totalcal = this.CalculateInclusiveGSTRate(
                this.negativearryforspare.unit_sale_price,
                this.negativearryforspare.sale_gst_rate,
                this.negativearryforspare.sale_tax_type
              );
              this.negativearryforspare.gstcalculateofspare =
                totalcal[0]["GSTAmount"];
              this.negativearryforspare.cgstcalculateofspare =
                totalcal[0]["CGST"];
              this.negativearryforspare.sgstcalculateofspare =
                totalcal[0]["SGST"];
              this.negativearryforspare.showcalcluationinfo = true;
              this.negativearryforspare.amount =
                this.negativearryforspare.unit_sale_price;
              this.negativearryforspare.sparegstamounterror = false;
            } else {
              this.negativearryforspare.amount =
                this.negativearryforspare.unit_sale_price;
              this.negativearryforspare.sparegstamounterror = true;
              if (
                !this.gsttype.includes(this.negativearryforspare.sale_tax_type)
              ) {
                this.negativearryforspare.sparegsttypeerror = true;
              } else {
                this.negativearryforspare.sparegsttypeerror = false;
              }
            }
          } else {
            if (
              this.gstNumberArr.includes(
                this.negativearryforspare.sale_gst_rate
              )
            ) {
              var totalcal = this.CalculateInclusiveGSTRate(
                this.negativearryforspare.unit_sale_price,
                this.negativearryforspare.sale_gst_rate,
                this.negativearryforspare.sale_tax_type
              );
              this.negativearryforspare.gstcalculateofspare =
                totalcal[0]["GSTAmount"];
              this.negativearryforspare.cgstcalculateofspare =
                totalcal[0]["CGST"];
              this.negativearryforspare.sgstcalculateofspare =
                totalcal[0]["SGST"];
              this.negativearryforspare.showcalcluationinfo = true;
              this.negativearryforspare.amount = totalcal[0]["totalamount"];
              this.negativearryforspare.sparegstamounterror = false;
            } else {
              this.negativearryforspare.amount =
                this.negativearryforspare.unit_sale_price;
              this.negativearryforspare.sparegstamounterror = true;
              if (
                !this.gsttype.includes(this.negativearryforspare.sale_tax_type)
              ) {
                this.negativearryforspare.sparegsttypeerror = true;
              } else {
                this.negativearryforspare.sparegsttypeerror = false;
              }
            }
          }
        } else if (this.negativearryforspare.purchase_gst_rate != "") {
          if (this.negativearryforspare.purchase_tax_type == "Inclusive") {
            if (
              this.gstNumberArr.includes(
                this.negativearryforspare.purchase_gst_rate
              )
            ) {
              var totalcal = this.CalculateInclusiveGSTRate(
                this.negativearryforspare.unit_sale_price,
                this.negativearryforspare.purchase_gst_rate,
                this.negativearryforspare.purchase_tax_type
              );
              this.negativearryforspare.gstcalculateofspare =
                totalcal[0]["GSTAmount"];
              this.negativearryforspare.cgstcalculateofspare =
                totalcal[0]["CGST"];
              this.negativearryforspare.sgstcalculateofspare =
                totalcal[0]["SGST"];
              this.negativearryforspare.showcalcluationinfo = true;
              this.negativearryforspare.amount =
                this.negativearryforspare.unit_sale_price;
              this.negativearryforspare.sparegstamounterror = false;
            } else {
              this.negativearryforspare.amount =
                this.negativearryforspare.unit_sale_price;
              this.negativearryforspare.sparegstamounterror = true;
              if (
                !this.gsttype.includes(
                  this.negativearryforspare.purchase_tax_type
                )
              ) {
                this.negativearryforspare.sparegsttypeerror = true;
              } else {
                this.negativearryforspare.sparegsttypeerror = false;
              }
            }
          } else {
            if (
              this.gstNumberArr.includes(
                this.negativearryforspare.purchase_gst_rate
              )
            ) {
              var totalcal = this.CalculateInclusiveGSTRate(
                this.negativearryforspare.unit_sale_price,
                this.negativearryforspare.purchase_gst_rate,
                this.negativearryforspare.purchase_tax_type
              );
              this.negativearryforspare.gstcalculateofspare =
                totalcal[0]["GSTAmount"];
              this.negativearryforspare.cgstcalculateofspare =
                totalcal[0]["CGST"];
              this.negativearryforspare.sgstcalculateofspare =
                totalcal[0]["SGST"];
              this.negativearryforspare.showcalcluationinfo = true;
              this.negativearryforspare.amount = totalcal[0]["totalamount"];
              this.negativearryforspare.sparegstamounterror = false;
            } else {
              this.negativearryforspare.amount =
                this.negativearryforspare.unit_sale_price;
              this.negativearryforspare.sparegstamounterror = true;
              if (
                !this.gsttype.includes(
                  this.negativearryforspare.purchase_tax_type
                )
              ) {
                this.negativearryforspare.sparegsttypeerror = true;
              } else {
                this.negativearryforspare.sparegsttypeerror = false;
              }
            }
          }
        } else {
          this.negativearryforspare.amount =
            this.negativearryforspare.unit_sale_price;
          this.negativearryforspare.sparegsttypeerror = true;
          this.negativearryforspare.sparegstamounterror = true;
        }
      } else {
        this.negativearryforspare.amount =
          this.negativearryforspare.unit_sale_price;
      }
      this.negativearryforspare.quantity = "1";
      this.negativearryforspare.discounttype = "%";
      this.negativearryforspare.discountvalue = this.spareisvalue;
      this.negativearryforspare.showqunatityerrorspare = false;
      this.negativearryforspare.showpriceerrorspare = false;
      this.negativearryforspare.checkinsertedspare = true;
      this.sparedatatabel.push(this.negativearryforspare);
      this.shownegativeinventory = false;
      this.duplicateSpare = this.sparedatatabel;
      this.negativearryforspare.totalitemamount = this.getTotalAmount(
        this.negativearryforspare,
        "1",
        "job"
      );
      this.SpareTotal = this.calculateresult(this.sparedatatabel);
      this.SpareTotalFinal = this.calculateresultfinal(this.sparedatatabel);
      this.calculateAmountOfBilling();
      this.calTotalGstForSpareamount = this.calTotalGstForSpare(
        this.sparedatatabel
      );
      this.checkSpareGSTrateandtype();
      this.updateQuantity(
        sparedataQuantity,
        sparedatapartnumber,
        1,
        "spare",
        "minus"
      );
      if (this.spareisvalue != 0) {
        this.checkdiscountofspare(this.spareisvalue, "false");
      }
      this.mechanicerror = false;
    }
  }
  // Updated the Negative Qunatity of the spare
  updateNegativeInventory() {
    this.addselectedSpareResult(this.negativearryforspare.part_number);
    this.CreateSpareForm.controls["partnumber"].setValue(
      this.negativearryforspare.part_number,
      { onlySelf: true }
    );
  }
  //push the seach Spare Resultin the aray so that user can seelect the Spare from dropdown
  searchSpareInput(event) {
    this.general.getJobSpareLube(this.userworkshopid, "spare", event).subscribe(
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
              var vehdata = [];
              vehdata = JSON.parse(
                SpareSearchData.sparedata[i].vechile_details
              );

              
              if (vehdata.length == undefined) {
                if (vehdata["make"] == "All") {
                  if (
                    !this.spareduplicate.includes(
                      SpareSearchData.sparedata[i].part_number
                    )
                  ) {
                    if (SpareSearchData.sparedata[i].unit_sale_price != "") {
                      this.spareduplicate.push(
                        SpareSearchData.sparedata[i].part_number
                      );
                      this.searchSpareDatasec.push(
                        SpareSearchData.sparedata[i].part_name +
                          " (Part No:-" +
                          SpareSearchData.sparedata[i].part_number +
                          ")----Rs." +
                          SpareSearchData.sparedata[i].unit_sale_price +
                          "/-"
                      );
                    } else {
                      this.spareduplicate.push(
                        SpareSearchData.sparedata[i].part_number
                      );
                      this.searchSpareDatasec.push(
                        SpareSearchData.sparedata[i].part_name +
                          " (Part No:-" +
                          SpareSearchData.sparedata[i].part_number +
                          ")"
                      );
                    }
                  }
                } else {
                  if (vehdata["make"] == this.SelectedDataarrOfVehicle.make) {
                    if (vehdata["model"] == "All-model"||
                    vehdata["model"] == "All" ||
                    vehdata["model"] == "All model") {
                      if (
                        !this.spareduplicate.includes(
                          SpareSearchData.sparedata[i].part_number
                        )
                      ) {
                        if (
                          SpareSearchData.sparedata[i].unit_sale_price != ""
                        ) {
                          this.spareduplicate.push(
                            SpareSearchData.sparedata[i].part_number
                          );
                          this.searchSpareDatasec.push(
                            SpareSearchData.sparedata[i].part_name +
                              " (Part No:-" +
                              SpareSearchData.sparedata[i].part_number +
                              ")----Rs." +
                              SpareSearchData.sparedata[i].unit_sale_price +
                              "/-"
                          );
                        } else {
                          this.spareduplicate.push(
                            SpareSearchData.sparedata[i].part_number
                          );
                          this.searchSpareDatasec.push(
                            SpareSearchData.sparedata[i].part_name +
                              " (Part No:-" +
                              SpareSearchData.sparedata[i].part_number +
                              ")"
                          );
                        }
                      }
                    } else {
                      if (
                        vehdata["model"] == this.SelectedDataarrOfVehicle.model
                      ) {
                        if (vehdata["variant"] == "All" || vehdata["variant"] == "All-variant") {
                          if (
                            !this.spareduplicate.includes(
                              SpareSearchData.sparedata[i].part_number
                            )
                          ) {
                            if (
                              SpareSearchData.sparedata[i].unit_sale_price != ""
                            ) {
                              this.spareduplicate.push(
                                SpareSearchData.sparedata[i].part_number
                              );
                              this.searchSpareDatasec.push(
                                SpareSearchData.sparedata[i].part_name +
                                  " (Part No:-" +
                                  SpareSearchData.sparedata[i].part_number +
                                  ")----Rs." +
                                  SpareSearchData.sparedata[i].unit_sale_price +
                                  "/-"
                              );
                            } else {
                              this.spareduplicate.push(
                                SpareSearchData.sparedata[i].part_number
                              );
                              this.searchSpareDatasec.push(
                                SpareSearchData.sparedata[i].part_name +
                                  " (Part No:-" +
                                  SpareSearchData.sparedata[i].part_number +
                                  ")"
                              );
                            }
                          }
                        } else {
                          if (
                            vehdata["variant"] ==
                            this.SelectedDataarrOfVehicle.variant
                          ) {
                            if (
                              !this.spareduplicate.includes(
                                SpareSearchData.sparedata[i].part_number
                              )
                            ) {
                              if (
                                SpareSearchData.sparedata[i].unit_sale_price !=
                                ""
                              ) {
                                this.spareduplicate.push(
                                  SpareSearchData.sparedata[i].part_number
                                );
                                this.searchSpareDatasec.push(
                                  SpareSearchData.sparedata[i].part_name +
                                    " (Part No:-" +
                                    SpareSearchData.sparedata[i].part_number +
                                    ")----Rs." +
                                    SpareSearchData.sparedata[i]
                                      .unit_sale_price +
                                    "/-"
                                );
                              } else {
                                this.spareduplicate.push(
                                  SpareSearchData.sparedata[i].part_number
                                );
                                this.searchSpareDatasec.push(
                                  SpareSearchData.sparedata[i].part_name +
                                    " (Part No:-" +
                                    SpareSearchData.sparedata[i].part_number +
                                    ")"
                                );
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                vehdata.filter((dataveh) => {
                  

                  if (dataveh.make == "All") {
                    if (
                      !this.spareduplicate.includes(
                        SpareSearchData.sparedata[i].part_number
                      )
                    ) {
                      if (SpareSearchData.sparedata[i].unit_sale_price != "") {
                        this.spareduplicate.push(
                          SpareSearchData.sparedata[i].part_number
                        );
                        this.searchSpareDatasec.push(
                          SpareSearchData.sparedata[i].part_name +
                            " (Part No:-" +
                            SpareSearchData.sparedata[i].part_number +
                            ")----Rs." +
                            SpareSearchData.sparedata[i].unit_sale_price +
                            "/-"
                        );
                      } else {
                        this.spareduplicate.push(
                          SpareSearchData.sparedata[i].part_number
                        );
                        this.searchSpareDatasec.push(
                          SpareSearchData.sparedata[i].part_name +
                            " (Part No:-" +
                            SpareSearchData.sparedata[i].part_number +
                            ")"
                        );
                      }
                    }
                  } else {
                    if (dataveh.make == this.SelectedDataarrOfVehicle.make) {
                      if (
                        dataveh.model == "All-model" ||
                        dataveh.model == "All" ||
                        dataveh.model == "All model"
                      ) {
                        if (
                          !this.spareduplicate.includes(
                            SpareSearchData.sparedata[i].part_number
                          )
                        ) {
                          if (
                            SpareSearchData.sparedata[i].unit_sale_price != ""
                          ) {
                            this.spareduplicate.push(
                              SpareSearchData.sparedata[i].part_number
                            );
                            this.searchSpareDatasec.push(
                              SpareSearchData.sparedata[i].part_name +
                                " (Part No:-" +
                                SpareSearchData.sparedata[i].part_number +
                                ")----Rs." +
                                SpareSearchData.sparedata[i].unit_sale_price +
                                "/-"
                            );
                          } else {
                            this.spareduplicate.push(
                              SpareSearchData.sparedata[i].part_number
                            );
                            this.searchSpareDatasec.push(
                              SpareSearchData.sparedata[i].part_name +
                                " (Part No:-" +
                                SpareSearchData.sparedata[i].part_number +
                                ")"
                            );
                          }
                        }
                      } else {
                        if (
                          dataveh.model == this.SelectedDataarrOfVehicle.model
                        ) {
                          if (
                            dataveh.variant == "All-variant" ||
                            dataveh.variant == "All" ||
                            dataveh.variant == "All variant"
                          ) {
                            if (
                              !this.spareduplicate.includes(
                                SpareSearchData.sparedata[i].part_number
                              )
                            ) {
                              if (
                                SpareSearchData.sparedata[i].unit_sale_price !=
                                ""
                              ) {
                                this.spareduplicate.push(
                                  SpareSearchData.sparedata[i].part_number
                                );
                                this.searchSpareDatasec.push(
                                  SpareSearchData.sparedata[i].part_name +
                                    " (Part No:-" +
                                    SpareSearchData.sparedata[i].part_number +
                                    ")----Rs." +
                                    SpareSearchData.sparedata[i]
                                      .unit_sale_price +
                                    "/-"
                                );
                              } else {
                                this.spareduplicate.push(
                                  SpareSearchData.sparedata[i].part_number
                                );
                                this.searchSpareDatasec.push(
                                  SpareSearchData.sparedata[i].part_name +
                                    " (Part No:-" +
                                    SpareSearchData.sparedata[i].part_number +
                                    ")"
                                );
                              }
                            }
                          } else {
                            if (
                              dataveh.variant ==
                              this.SelectedDataarrOfVehicle.variant
                            ) {
                              if (
                                !this.spareduplicate.includes(
                                  SpareSearchData.sparedata[i].part_number
                                )
                              ) {
                                if (
                                  SpareSearchData.sparedata[i]
                                    .unit_sale_price != ""
                                ) {
                                  this.spareduplicate.push(
                                    SpareSearchData.sparedata[i].part_number
                                  );
                                  this.searchSpareDatasec.push(
                                    SpareSearchData.sparedata[i].part_name +
                                      " (Part No:-" +
                                      SpareSearchData.sparedata[i].part_number +
                                      ")----Rs." +
                                      SpareSearchData.sparedata[i]
                                        .unit_sale_price +
                                      "/-"
                                  );
                                } else {
                                  this.spareduplicate.push(
                                    SpareSearchData.sparedata[i].part_number
                                  );
                                  this.searchSpareDatasec.push(
                                    SpareSearchData.sparedata[i].part_name +
                                      " (Part No:-" +
                                      SpareSearchData.sparedata[i].part_number +
                                      ")"
                                  );
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                });
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
  //push the seach Spare Resultin the aray so that user can seelect the Spare from dropdown in side popup
  searchSpareInputToCreate(event) {
    this.searchSpareDataForCreate = [];
    this.general.getJobSpareLube(this.userworkshopid, "spare", event).subscribe(
      (SpareSearchData) => {
        this.showspinner.setSpinnerForLogin(true);
        if (SpareSearchData.success == true) {
          if (SpareSearchData.sparedata != undefined) {
            for (var i = 0; i < SpareSearchData.sparedata.length; i++) {
              this.searchSpareDataForCreate.push(
                SpareSearchData.sparedata[i].part_number
              );
            }
          }
        } else {
          this.searchSpareDataForCreate = [];
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
  //add the result of the selected spare to update the spare details in side popup
  addselectedSpareResult(event) {
    this.allSelectedMake = [];
    this.dupseletecmodvari = [];

    this.general
      .getJobSpareLubeData(this.userworkshopid, "spare", event)
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
              this.CreateSpareForm.controls["searchspareVehiclemod"].setValue(
                ""
              );
              this.CreateSpareForm.controls["searchspareVehicle"].setValue("");
              this.CreateSpareForm.controls["workshopiddata"].setValue(
                SpareData.sparedata[0].workshop_id,
                { onlySelf: true }
              );
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
            this.CreateSpareForm.controls["workshopiddata"].setValue(
              this.userworkshopid,
              { onlySelf: true }
            );
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
          this.showspinner.setSpinnerForLogin(false);
          this.snakBar.open(err, ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  //remove the spare from the tabel
  removeSpareItem(data, index) {
    if (this.jobcardEditOrCreate == "edit") {
      var sparedataQuantity = data.current_quantity;
      var sparedatapartnumber = data.part_number;
      var oldquantity = data.quantity;
      this.updateQuantity(
        sparedataQuantity,
        sparedatapartnumber,
        oldquantity,
        "spare",
        "add"
      );
    }
    this.sparedatatabel.splice(index, 1);
    this.duplicateSpare = this.sparedatatabel;
    this.SpareTotal = this.calculateresult(this.sparedatatabel);
    this.SpareTotalFinal = this.calculateresultfinal(this.sparedatatabel);
    this.calculateAmountOfBilling();
    this.calTotalGstForSpareamount = this.calTotalGstForSpare(
      this.sparedatatabel
    );
    this.checkSpareGSTrateandtype();
    this.getTotalDiscountInRupee();
    // this.QuantityObject.filter((dataa, index) => {
    //   if (dataa.part_number == data.part_number) {
    //     this.QuantityObject.splice(index, 1);
    //   }
    // });
    this.oldQuantityArray.filter((dataa, index) => {
      if (dataa.partnumber == data.part_number) {
        // this.oldQuantityArray.splice(index, 1);
        dataa.quantity = 0
      }
    });
  }
  //open the popup to create or update the spare
  openSparepopup() {
    this.foralltrue = false;
    this.showSpareUpdate = false;
    this.SelectedDataarrOfVehiclespl = this.SelectedDataarrOfVehicle;
    this.foralltrue = false;

    this.allSelectedMake = [];
    this.allSelectedMake.push(this.SelectedDataarrOfVehicle);
    this.dupseletecmodvari = [];

    this.CreateSpareForm.controls["searchspareVehiclemod"].setValue("");
    this.CreateSpareForm.controls["workshopiddata"].setValue(
      this.userworkshopid
    );
    this.CreateSpareForm.controls["partnumber"].setValue(undefined);
    this.CreateSpareForm.controls["sellingprice"].setValue(null);
    this.CreateSpareForm.controls["companynameSpare"].setValue("");
    this.CreateSpareForm.controls["partname"].setValue("");
    this.CreateSpareForm.controls["searchspareVehicle"].setValue("");
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
  //Value enetered as the spare qunatity is changed
  checkvalueentered(event, index, indexdata) {
    // if (event.match(/^[0-9]*$/))
    if (event.match(/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/)) {
      if (event != "") {
        var sparedataQuantity = indexdata.current_quantity;
        var sparedatapartnumber = indexdata.part_number;
        this.updateQuantity(
          sparedataQuantity,
          sparedatapartnumber,
          event,
          "spare",
          "minus"
        );
      }
      indexdata["showqunatityerrorspare"] = false;
      var amount = parseFloat(indexdata["unit_sale_price"]) * parseFloat(event);
      this.sparedatatabel[index]["quantity"] = event;
      if (this.allBillingData.gst_number != "") {
        if (this.sparedatatabel[index]["sale_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            this.sparedatatabel[index]["unit_sale_price"],
            this.sparedatatabel[index]["sale_gst_rate"],
            this.sparedatatabel[index]["sale_tax_type"],
            parseInt(this.sparedatatabel[index]["discountvalue"]),
            event,
            this.sparedatatabel[index]["discounttype"]
          );

          this.sparedatatabel[index]["gstcalculateofspare"] =
            totalcal[0]["GSTAmount"];
          this.sparedatatabel[index]["cgstcalculateofspare"] =
            totalcal[0]["CGST"];
          this.sparedatatabel[index]["sgstcalculateofspare"] =
            totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.sparedatatabel[index]["amount"] = totalcal[0]["totalamount"];
        } else if (this.sparedatatabel[index]["purchase_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            this.sparedatatabel[index]["unit_sale_price"],
            this.sparedatatabel[index]["purchase_gst_rate"],
            this.sparedatatabel[index]["purchase_tax_type"],
            parseInt(this.sparedatatabel[index]["discountvalue"]),
            event,
            this.sparedatatabel[index]["discounttype"]
          );

          this.sparedatatabel[index]["gstcalculateofspare"] =
            totalcal[0]["GSTAmount"];
          this.sparedatatabel[index]["cgstcalculateofspare"] =
            totalcal[0]["CGST"];
          this.sparedatatabel[index]["sgstcalculateofspare"] =
            totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.sparedatatabel[index]["amount"] = totalcal[0]["totalamount"];
        } else {
          this.sparedatatabel[index]["amount"] = amount;
        }
      } else {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          this.sparedatatabel[index]["unit_sale_price"],
          "0",
          "Exclusive",
          parseInt(this.sparedatatabel[index]["discountvalue"]),
          event,
          this.sparedatatabel[index]["discounttype"]
        );
        this.sparedatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.SpareTotal = this.calculateresult(this.sparedatatabel);
      this.SpareTotalFinal = this.calculateresultfinal(this.sparedatatabel);
      this.calculateAmountOfBilling();
      this.sparedatatabel[index]["totalitemamount"] = this.getTotalAmount(
        indexdata,
        index,
        "job"
      );
      this.calTotalGstForSpareamount = this.calTotalGstForSpare(
        this.sparedatatabel
      );
    } else {
      indexdata["showqunatityerrorspare"] = false;
      indexdata["showcalcluationinfo"] = false;
    }
  }
  //Value enetered as the spare unit price is changed
  checkvalueenteredforspare(event, index, indexdata) {
    if (event.match(/^\d*\.?\d*$/)) {
      indexdata["showpriceerrorspare"] = false;
      this.sparedatatabel[index]["unit_sale_price"] = event;
      var amount = parseFloat(indexdata["quantity"]) * parseFloat(event);
      if (this.allBillingData.gst_number != "") {
        if (this.sparedatatabel[index]["sale_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            event,
            this.sparedatatabel[index]["sale_gst_rate"],
            this.sparedatatabel[index]["sale_tax_type"],
            parseInt(this.sparedatatabel[index]["discountvalue"]),
            this.sparedatatabel[index]["quantity"],
            this.sparedatatabel[index]["discounttype"]
          );

          this.sparedatatabel[index]["gstcalculateofspare"] =
            totalcal[0]["GSTAmount"];
          this.sparedatatabel[index]["cgstcalculateofspare"] =
            totalcal[0]["CGST"];
          this.sparedatatabel[index]["sgstcalculateofspare"] =
            totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.sparedatatabel[index]["amount"] = totalcal[0]["totalamount"];
          this.sparedatatabel[index]["unit_sale_price"] = event;
        } else if (this.sparedatatabel[index]["purchase_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            event,
            this.sparedatatabel[index]["purchase_gst_rate"],
            this.sparedatatabel[index]["purchase_tax_type"],
            parseInt(this.sparedatatabel[index]["discountvalue"]),
            this.sparedatatabel[index]["quantity"],
            this.sparedatatabel[index]["discounttype"]
          );

          this.sparedatatabel[index]["gstcalculateofspare"] =
            totalcal[0]["GSTAmount"];
          this.sparedatatabel[index]["cgstcalculateofspare"] =
            totalcal[0]["CGST"];
          this.sparedatatabel[index]["sgstcalculateofspare"] =
            totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.sparedatatabel[index]["amount"] = totalcal[0]["totalamount"];
          this.sparedatatabel[index]["unit_sale_price"] = event;
        } else {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            event,
            "0",
            "Exclusive",
            parseInt(this.sparedatatabel[index]["discountvalue"]),
            this.sparedatatabel[index]["quantity"],
            this.sparedatatabel[index]["discounttype"]
          );
          this.sparedatatabel[index]["amount"] = totalcal[0]["totalamount"];
          this.sparedatatabel[index]["unit_sale_price"] = event;
        }
        this.SpareTotal = this.calculateresult(this.sparedatatabel);
        this.SpareTotalFinal = this.calculateresultfinal(this.sparedatatabel);
        this.calculateAmountOfBilling();
        this.sparedatatabel[index]["totalitemamount"] = this.getTotalAmount(
          indexdata,
          index,
          "job"
        );
        this.calTotalGstForSpareamount = this.calTotalGstForSpare(
          this.sparedatatabel
        );
      } else {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          event,
          "0",
          "Exclusive",
          parseInt(this.sparedatatabel[index]["discountvalue"]),
          this.sparedatatabel[index]["quantity"],
          this.sparedatatabel[index]["discounttype"]
        );
        this.sparedatatabel[index]["amount"] = totalcal[0]["totalamount"];
        this.sparedatatabel[index]["unit_sale_price"] = event;
        this.SpareTotal = this.calculateresult(this.sparedatatabel);
        this.SpareTotalFinal = this.calculateresultfinal(this.sparedatatabel);
        this.calculateAmountOfBilling();
        this.sparedatatabel[index]["totalitemamount"] = this.getTotalAmount(
          indexdata,
          index,
          "job"
        );
        this.calTotalGstForSpareamount = this.calTotalGstForSpare(
          this.sparedatatabel
        );
      }
    } else {
      indexdata["showpriceerrorspare"] = true;
    }
  }
  //Value enetered as the spare gst amount is changed
  checksparegst(event, data, index, gstVlaue) {
    var amounttocalculate =
      parseFloat(data["unit_sale_price"]) * parseFloat(data["quantity"]);
    if (data["sale_gst_rate"] != "" && data["sale_tax_type"] != "") {
      this.sparedatatabel[index]["sale_gst_rate"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(data["unit_sale_price"]),
        event,
        data["sale_tax_type"],
        parseInt(this.sparedatatabel[index]["discountvalue"]),
        this.sparedatatabel[index]["quantity"],
        this.sparedatatabel[index]["discounttype"]
      );

      this.sparedatatabel[index]["gstcalculateofspare"] =
        totalcal[0]["GSTAmount"];
      this.sparedatatabel[index]["cgstcalculateofspare"] = totalcal[0]["CGST"];
      this.sparedatatabel[index]["sgstcalculateofspare"] = totalcal[0]["SGST"];
      data["showcalcluationinfo"] = true;
      if (gstVlaue != "gstNull") {
        this.sparedatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.sparedatatabel[index]["sparegstamounterror"] = false;
      this.SpareTotal = this.calculateresult(this.sparedatatabel);
      this.SpareTotalFinal = this.calculateresultfinal(this.sparedatatabel);
      this.calTotalGstForSpareamount = this.calTotalGstForSpare(
        this.sparedatatabel
      );
      this.calculateAmountOfBilling();
      this.sparedatatabel[index]["totalitemamount"] = this.getTotalAmount(
        data,
        index,
        "job"
      );
      this.checkSpareGSTrateandtype();
    } else if (
      data["purchase_gst_rate"] != "" &&
      data["purchase_tax_type"] != ""
    ) {
      this.sparedatatabel[index]["purchase_gst_rate"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(data["unit_sale_price"]),
        event,
        data["purchase_tax_type"],
        parseInt(this.sparedatatabel[index]["discountvalue"]),
        this.sparedatatabel[index]["quantity"],
        this.sparedatatabel[index]["discounttype"]
      );

      this.sparedatatabel[index]["gstcalculateofspare"] =
        totalcal[0]["GSTAmount"];
      this.sparedatatabel[index]["cgstcalculateofspare"] = totalcal[0]["CGST"];
      this.sparedatatabel[index]["sgstcalculateofspare"] = totalcal[0]["SGST"];
      data["showcalcluationinfo"] = true;
      if (gstVlaue != "gstNull") {
        this.sparedatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.sparedatatabel[index]["sparegstamounterror"] = false;
      this.SpareTotal = this.calculateresult(this.sparedatatabel);
      this.SpareTotalFinal = this.calculateresultfinal(this.sparedatatabel);
      this.calculateAmountOfBilling();
      this.sparedatatabel[index]["totalitemamount"] = this.getTotalAmount(
        data,
        index,
        "job"
      );
      this.calTotalGstForSpareamount = this.calTotalGstForSpare(
        this.sparedatatabel
      );
      this.checkSpareGSTrateandtype();
    } else {
      this.sparedatatabel[index]["sparegstamounterror"] = false;
      this.sparedatatabel[index]["amount"] = data["amount"];
      this.SpareTotal = this.calculateresult(this.sparedatatabel);
      this.SpareTotalFinal = this.calculateresultfinal(this.sparedatatabel);
      this.calculateAmountOfBilling();
      this.sparedatatabel[index]["totalitemamount"] = this.getTotalAmount(
        data,
        index,
        "job"
      );
      this.calTotalGstForSpareamount = this.calTotalGstForSpare(
        this.sparedatatabel
      );
      this.checkSpareGSTrateandtype();
    }
  }
  //Value enetered as the spare gst type is changed
  checksparegsttype(event, data, index, gstVlaue) {
    var amounttocalculate =
      parseFloat(data["unit_sale_price"]) * parseFloat(data["quantity"]);
    if (data["sale_gst_rate"] != "" && data["sale_tax_type"] != "") {
      this.sparedatatabel[index]["sale_tax_type"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(data["unit_sale_price"]),
        data["sale_gst_rate"],
        event,
        parseInt(this.sparedatatabel[index]["discountvalue"]),
        this.sparedatatabel[index]["quantity"],
        this.sparedatatabel[index]["discounttype"]
      );

      this.sparedatatabel[index]["gstcalculateofspare"] =
        totalcal[0]["GSTAmount"];
      this.sparedatatabel[index]["cgstcalculateofspare"] = totalcal[0]["CGST"];
      this.sparedatatabel[index]["sgstcalculateofspare"] = totalcal[0]["SGST"];
      data["showcalcluationinfo"] = true;
      if (gstVlaue != "gstNull") {
        this.sparedatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.sparedatatabel[index]["sparegsttypeerror"] = false;
      this.SpareTotal = this.calculateresult(this.sparedatatabel);
      this.SpareTotalFinal = this.calculateresultfinal(this.sparedatatabel);
      this.calculateAmountOfBilling();
      this.sparedatatabel[index]["totalitemamount"] = this.getTotalAmount(
        data,
        index,
        "job"
      );
      this.calTotalGstForSpareamount = this.calTotalGstForSpare(
        this.sparedatatabel
      );
      this.checkSpareGSTrateandtype();
    } else if (
      data["purchase_gst_rate"] != "" &&
      data["purchase_tax_type"] != ""
    ) {
      this.sparedatatabel[index]["purchase_tax_type"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(data["unit_sale_price"]),
        data["purchase_gst_rate"],
        event,
        parseInt(this.sparedatatabel[index]["discountvalue"]),
        this.sparedatatabel[index]["quantity"],
        this.sparedatatabel[index]["discounttype"]
      );

      this.sparedatatabel[index]["gstcalculateofspare"] =
        totalcal[0]["GSTAmount"];
      this.sparedatatabel[index]["cgstcalculateofspare"] = totalcal[0]["CGST"];
      this.sparedatatabel[index]["sgstcalculateofspare"] = totalcal[0]["SGST"];
      data["showcalcluationinfo"] = true;
      if (gstVlaue != "gstNull") {
        this.sparedatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.sparedatatabel[index]["sparegsttypeerror"] = false;
      this.SpareTotal = this.calculateresult(this.sparedatatabel);
      this.SpareTotalFinal = this.calculateresultfinal(this.sparedatatabel);
      this.calculateAmountOfBilling();
      this.sparedatatabel[index]["totalitemamount"] = this.getTotalAmount(
        data,
        index,
        "job"
      );
      this.calTotalGstForSpareamount = this.calTotalGstForSpare(
        this.sparedatatabel
      );
      this.checkSpareGSTrateandtype();
    } else {
      this.sparedatatabel[index]["sparegsttypeerror"] = false;
      this.sparedatatabel[index]["amount"] = data["amount"];
      this.SpareTotal = this.calculateresult(this.sparedatatabel);
      this.SpareTotalFinal = this.calculateresultfinal(this.sparedatatabel);
      this.calculateAmountOfBilling();
      this.sparedatatabel[index]["totalitemamount"] = this.getTotalAmount(
        data,
        index,
        "job"
      );
      this.calTotalGstForSpareamount = this.calTotalGstForSpare(
        this.sparedatatabel
      );
      this.checkSpareGSTrateandtype();
    }
  }
  //Value enetered as the spare gst type and amount is changed in side popup
  checkSpareGSTrateandtype() {
    var sparedatatabelfilter = this.sparedatatabel.filter(
      (spare) =>
        spare.sparegsttypeerror == true || spare.sparegstamounterror == true
    );
    if (sparedatatabelfilter.length != 0) {
      this.sparegsterror = true;
      this.sparelenghtoferror = sparedatatabelfilter.length;
    } else {
      this.sparegsterror = false;
      this.sparelenghtoferror = 0;
    }
  }
  // Create New Spare form with validations
  createSpareForm() {
    this.CreateSpareForm = this.formbuild.group({
      workshopiddata: [this.userworkshopid],
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
  //API call to Create New Spare
  createSpareByAPI(mode) {
    var purchase_qty = this.CreateSpareForm.value.quantity;
    var purchase_total_amount = 0;
    var purchase_discount = "";
    var purchase_cgst = 0;
    var purchase_sgst = 0;
    var purchase_igst = 0;
    var purchase_total_gst = 0;
    var sale_qty = this.CreateSpareForm.value.quantity;
    var sale_total_amount = 0;
    var sale_discount = "";
    var sale_cgst = 0;
    var sale_sgst = 0;
    var sale_igst = 0;
    var sale_total_gst = 0;

    if (this.allBillingData.gst_number != "") {
      if (this.CreateSpareForm.value.gsttype == this.gsttype[0]) {
        if (this.CreateSpareForm.value.purchaseprice != 0) {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateSpareForm.value.purchaseprice.toString(),
            this.CreateSpareForm.value.gstslab,
            this.gsttype[0]
          );
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        } else {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateSpareForm.value.sellingprice.toString(),
            this.CreateSpareForm.value.gstslab,
            this.gsttype[0]
          );
          sale_total_amount = GSTCal[0]["totalamount"];
          sale_cgst = GSTCal[0]["CGST"];
          sale_sgst = GSTCal[0]["SGST"];
          sale_total_gst = GSTCal[0]["GSTAmount"];
          this.CreateSpareForm.value.purchaseprice =
            this.CreateSpareForm.value.sellingprice;
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        }
      } else {
        if (this.CreateSpareForm.value.purchaseprice != 0) {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateSpareForm.value.purchaseprice.toString(),
            this.CreateSpareForm.value.gstslab,
            this.gsttype[1]
          );
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        } else {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateSpareForm.value.sellingprice.toString(),
            this.CreateSpareForm.value.gstslab,
            this.gsttype[1]
          );
          sale_total_amount = GSTCal[0]["totalamount"];
          sale_cgst = GSTCal[0]["CGST"];
          sale_sgst = GSTCal[0]["SGST"];
          sale_total_gst = GSTCal[0]["GSTAmount"];
          this.CreateSpareForm.value.purchaseprice =
            this.CreateSpareForm.value.sellingprice;
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        }
      }
    } else {
      if (this.CreateSpareForm.value.purchaseprice == 0) {
        this.CreateSpareForm.value.purchaseprice =
          this.CreateSpareForm.value.sellingprice;
      }
    }
    var workshopid;
    if (this.CreateSpareForm.value.workshopiddata == "1") {
      mode = "create";
      workshopid = this.userworkshopid;
    } else {
      mode = mode;
      workshopid = this.CreateSpareForm.value.workshopiddata;
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
    this.general
      .saveJobSapreLubeProfile(
        "spare",
        mode,
        part_number,
        this.CreateSpareForm.value.partname,
        "",
        this.CreateSpareForm.value.unit,
        "spare",
        this.CreateSpareForm.value.subcategory,
        "",
        "",
        JSON.stringify(this.allSelectedMake),
        this.CreateSpareForm.value.quantity,
        this.CreateSpareForm.value.lowerlimit,
        this.CreateSpareForm.value.rackno,
        this.CreateSpareForm.value.hsnno,
        this.CreateSpareForm.value.purchaseprice,
        purchase_qty,
        this.CreateSpareForm.value.gstslab,
        this.CreateSpareForm.value.gsttype,
        purchase_total_amount,
        purchase_discount,
        purchase_cgst,
        purchase_sgst,
        purchase_igst,
        purchase_total_gst,
        this.CreateSpareForm.value.sellingprice,
        sale_qty,
        this.CreateSpareForm.value.gstslab,
        this.CreateSpareForm.value.gsttype,
        sale_total_amount,
        sale_discount,
        sale_cgst,
        sale_sgst,
        sale_igst,
        sale_total_gst,
        this.CreateSpareForm.value.companynameSpare,
        workshopid
      )
      .subscribe(
        (SaveResult) => {
          this.showspinner.setSpinnerForLogin(false);
          if (SaveResult.success == true) {
            this.showspinner.setSpinnerForLogin(false);
            this.snakBar.open(
              "Success",
              ErrorMessgae[0][SaveResult["message"]],
              {
                duration: 4000,
              }
            );
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
            if (this.assignedMechanicArray.length == 0) {
              SaveResult.sparedata["spareassignedmechanic"] = [
                this.jobcardSettingData.default_mechanic[0].name
                  .charAt(0)
                  .toUpperCase() +
                  this.jobcardSettingData.default_mechanic[0].name.slice(1),
              ];
            } else {
              SaveResult.sparedata["spareassignedmechanic"] =
                this.assignedMechanicArray;
            }
            this.makesparetable(SaveResult.sparedata);
            this.SpareTotal = this.calculateresult(this.sparedatatabel);
            this.SpareTotalFinal = this.calculateresultfinal(
              this.sparedatatabel
            );
            this.calculateAmountOfBilling();
            this.calTotalGstForSpareamount = this.calTotalGstForSpare(
              this.sparedatatabel
            );
          } else {
            this.showspinner.setSpinnerForLogin(false);
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
          this.showspinner.setSpinnerForLogin(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  // Select Assigned Mechanic
  onDeSelectAssignedSpare(event, selecttype, data, index) {
    if (selecttype == "all") {
      this.sparedatatabel[index]["spareassignedmechanic"] = event;
    } else {
      this.sparedatatabel[index]["spareassignedmechanic"] = this.sparedatatabel[
        index
      ]["spareassignedmechanic"].filter(
        (mechanic) => mechanic.name != event.name
      );
    }
  }
  // DeSelect Assigned Mechanic
  onItemSelectAssignedSpare(event, selecttype, data, index) {
    if (selecttype == "all") {
      this.sparedatatabel[index]["spareassignedmechanic"] = event;
    } else {
      this.sparedatatabel[index]["spareassignedmechanic"].push(event);
    }
  }
  //---------------------------JOBS FORM------------------------------------------------------------
  // After Search User Select the job to insert it in tabel
  selectedJobResult(event) {
    var partnumber;
    partnumber = event.split("(Part No:-")[1].split(")----")[0];
    if (event.split("(Part No:-").length != 0) {
      this.general
        .getJobSpareLubeData(this.userworkshopid, "job", partnumber)
        .subscribe(
          (jobData) => {
            this.jobmodel = "";
            this.showspinner.setSpinnerForLogin(true);
            this.makejobtable(jobData.jobdata[0]);
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
    this.duplicateJob.push(jobdata);
    var result = this.duplicateJob.reduce((unique, o) => {
      if (
        !unique.some(
          (obj) =>
            obj.part_number === o.part_number && obj.part_name === o.part_name
        )
      ) {
        if (o.checkinsertedjob == undefined) {
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
          o.quantity = "1";
          o.discounttype = "%";
          o.discountvalue = this.jodisvalue;
          o.showqunatityerrorjob = false;
          o.showpriceerrorjob = false;
          o.checkinsertedjob = true;
          // o.jobassignedmechanic = [
          //   this.jobcardSettingData.default_mechanic[0].name
          //     .charAt(0)
          //     .toUpperCase() +
          //     this.jobcardSettingData.default_mechanic[0].name.slice(1),
          // ];
          o.jobassignedmechanic = this.selectedStaffId;
          o["totalitemamount"] = this.getTotalAmount(o, "1", "job");
          unique.push(o);
          this.showduplicatejob = false;
        } else {
          o["totalitemamount"] = this.getTotalAmount(o, "1", "job");
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
    if (this.jodisvalue != 0) {
      this.checkdiscountofjob(this.jodisvalue, "false");
    }
    this.JobTotal = this.calculateresult(this.jobdatatabel);
    this.JobTotalFinal = this.calculateresultfinal(this.jobdatatabel);
    this.calculateAmountOfBilling();
    this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
    this.checkJobGSTrateandtype();
    this.updateRemindersOfJob();
    this.mechanicerror = false;
    this.showspinner.setSpinnerForLogin(false);
  }
  //Calculate Discount value eneter
  jobdiscountvalue(event, indexdata, index, falg) {
    if (event.match(/^\d*\.?\d*$/)) {
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
            parseFloat(this.jobdatatabel[index]["unit_purchase_price"]),
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
      this.JobTotalFinal = this.calculateresultfinal(this.jobdatatabel);
      this.calculateAmountOfBilling();
      this.jobdatatabel[index]["totalitemamount"] = this.getTotalAmount(
        indexdata,
        index,
        "job"
      );
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
      if (falg == "false") {
        if (event >= 0) {
          if (this.jobdatatabel.length != 0) {
            var idarr = [];
            this.jobdatatabel.filter((data) => {
              if (data.discountvalue != 0) {
                idarr.push(data.discountvalue);
              }
              if (data.discounttype != "%") {
                idarr.push(data.discountvalue);
              }
            });
            if (idarr.length != 0) {
              this.showjobdis = true;
              this.jodisvalue = 0;
            } else {
              this.showjobdis = false;
            }
          }
        }
      }
    } else {
      indexdata["showdiscountjob"] = true;
    }
  }
  //update Discount type eneter
  checkjobdiscountData(event, indexdata, index, flag) {
    this.jobdatatabel[index]["discounttype"] = event;
    if (this.allBillingData.gst_number != "") {
      if (this.jobdatatabel[index]["sale_gst_rate"] != "") {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseFloat(this.jobdatatabel[index]["unit_sale_price"]),
          this.jobdatatabel[index]["sale_gst_rate"],
          this.jobdatatabel[index]["sale_tax_type"],
          parseInt(this.jobdatatabel[index]["discountvalue"]),
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
          parseInt(this.jobdatatabel[index]["discountvalue"]),
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
          parseInt(this.jobdatatabel[index]["discountvalue"]),
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
        parseInt(this.jobdatatabel[index]["discountvalue"]),
        parseFloat(this.jobdatatabel[index]["quantity"]),
        event
      );
      this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
    }
    this.JobTotal = this.calculateresult(this.jobdatatabel);
    this.JobTotalFinal = this.calculateresultfinal(this.jobdatatabel);
    this.calculateAmountOfBilling();
    this.jobdatatabel[index]["totalitemamount"] = this.getTotalAmount(
      indexdata,
      index,
      "job"
    );
    this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
    if (flag == "false") {
      if (event != "%") {
        if (this.jobdatatabel.length != 0) {
          var idarr = [];
          this.jobdatatabel.filter((data) => {
            if (data.discountvalue != 0) {
              idarr.push(data.discountvalue);
            }
            if (data.discounttype != "%") {
              idarr.push(data.discountvalue);
            }
          });
          if (idarr.length != 0) {
            this.showjobdis = true;
            this.jodisvalue = 0;
          } else {
            this.showjobdis = true;
          }
        }
      } else {
        if (this.jobdatatabel.length != 0) {
          var idarr = [];
          this.jobdatatabel.filter((data) => {
            if (data.discountvalue != 0) {
              idarr.push(data.discountvalue);
            }
            if (data.discounttype != "%") {
              idarr.push(data.discountvalue);
            }
          });
          if (idarr.length != 0) {
            this.showjobdis = true;
            this.jodisvalue = 0;
          } else {
            this.showjobdis = false;
          }
        }
      }
    }
  }
  //get the total amount
  getTotalAmount(alldata, index, category) {
    if (this.createdJobcardSetting.item_wise_discount != 0) {
      if (this.allBillingData.gst_number != "") {
        if (alldata["sale_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(alldata["unit_sale_price"]),
            alldata["sale_gst_rate"],
            alldata["sale_tax_type"],
            0,
            parseFloat(alldata["quantity"]),
            "%"
          );
          this.getTotalDiscountInRupee();
          return totalcal[0]["totalamount"];
        } else if (alldata["purchase_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(alldata["unit_purchase_price"]),
            alldata["purchase_gst_rate"],
            alldata["purchase_tax_type"],
            0,
            parseFloat(alldata["quantity"]),
            "%"
          );
          this.getTotalDiscountInRupee();
          return totalcal[0]["totalamount"];
        } else {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(alldata["unit_sale_price"]),
            "0",
            "Inclusive",
            0,
            parseFloat(alldata["quantity"]),
            "%"
          );
          this.getTotalDiscountInRupee();
          return totalcal[0]["totalamount"];
        }
      } else {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseFloat(alldata["unit_sale_price"]),
          "0",
          "Inclusive",
          0,
          parseFloat(alldata["quantity"]),
          "%"
        );
        this.getTotalDiscountInRupee();
        return totalcal[0]["totalamount"];
      }
    } else {
      return alldata["amount"];
    }
  }
  //get amount in rupees
  getTotalDiscountInRupee() {
    if (this.createdJobcardSetting.item_wise_discount != 0) {
      this.eventForDiscount = "₹";
      var jobtotaldiscount = 0;
      var sparetotaldiscount = 0;
      var lubetotaldiscount = 0;
      if (this.jobdatatabel.length != 0) {
        this.jobdatatabel.map((disc) => {
          if (disc.discounttype == "₹") {
            jobtotaldiscount += parseInt(disc.discountvalue);
          } else {
            var discountedvalue;
            if (this.allBillingData.gst_number != "" && disc.sale_tax_type == "Inclusive"){
              discountedvalue =
                ((parseFloat(disc.unit_sale_price) *
                  parseFloat(disc.quantity)) /
                  (1 + parseInt(disc.sale_gst_rate) / 100)) *
                (parseInt(disc.discountvalue) / 100);
            } else {
              discountedvalue =
                parseFloat(disc.unit_sale_price) *
                parseFloat(disc.quantity) *
                (parseInt(disc.discountvalue) / 100);
            }
            jobtotaldiscount += discountedvalue;
          }
        });
      }
      if (this.sparedatatabel.length != 0) {
        this.sparedatatabel.map((disc) => {
          if (disc.discounttype == "₹") {
            sparetotaldiscount += parseInt(disc.discountvalue);
          } else {
            var discountedvalue;
            if (this.allBillingData.gst_number != "" && disc.sale_tax_type == "Inclusive") {
              discountedvalue =
                ((parseFloat(disc.unit_sale_price) *
                  parseFloat(disc.quantity)) /
                  (1 + parseInt(disc.sale_gst_rate) / 100)) *
                (parseInt(disc.discountvalue) / 100);
            } else {
              discountedvalue =
                parseFloat(disc.unit_sale_price) *
                parseFloat(disc.quantity) *
                (parseInt(disc.discountvalue) / 100);
            }
            sparetotaldiscount += discountedvalue;
          }
        });
      }
      if (this.lubedatatabel.length != 0) {
        this.lubedatatabel.map((disc) => {
          if (disc.discounttype == "₹") {
            lubetotaldiscount += parseInt(disc.discountvalue);
          } else {
            var discountedvalue;
            if (this.allBillingData.gst_number != "" && disc.sale_tax_type == "Inclusive") {
              discountedvalue =
                ((parseFloat(disc.unit_sale_price) *
                  parseFloat(disc.quantity)) /
                  (1 + parseInt(disc.sale_gst_rate) / 100)) *
                (parseInt(disc.discountvalue) / 100);
            } else {
              discountedvalue =
                parseFloat(disc.unit_sale_price) *
                parseFloat(disc.quantity) *
                (parseInt(disc.discountvalue) / 100);
            }
            lubetotaldiscount += discountedvalue;
          }
        });
      }
      this.discount = Math.round(
        jobtotaldiscount + sparetotaldiscount + lubetotaldiscount
      );
      this.duplicatedisc = this.discount;
    }
  }
  //get amount on ejobcard edit time
  getTotalAmountEditTime(alldata, index, category) {
    if (this.createdJobcardSetting.item_wise_discount != 0) {
      if (this.allBillingData.gst_number != "") {
        if (alldata["sale_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(alldata["unit_sale_price"]),
            alldata["sale_gst_rate"],
            alldata["sale_tax_type"],
            0,
            parseFloat(alldata["quantity"]),
            "%"
          );
          this.getTotalDiscountInRupeeEditTime();
          return totalcal[0]["totalamount"];
        } else if (alldata["purchase_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(alldata["unit_purchase_price"]),
            alldata["purchase_gst_rate"],
            alldata["purchase_tax_type"],
            0,
            parseFloat(alldata["quantity"]),
            "%"
          );
          this.getTotalDiscountInRupeeEditTime();
          return totalcal[0]["totalamount"];
        } else {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(alldata["unit_sale_price"]),
            "0",
            "Inclusive",
            0,
            parseFloat(alldata["quantity"]),
            "%"
          );
          this.getTotalDiscountInRupeeEditTime();
          return totalcal[0]["totalamount"];
        }
      } else {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseFloat(alldata["unit_sale_price"]),
          "0",
          "Inclusive",
          0,
          parseFloat(alldata["quantity"]),
          "%"
        );
        this.getTotalDiscountInRupeeEditTime();
        return totalcal[0]["totalamount"];
      }
    } else {
      this.getTotalDiscountInRupeeEditTime();
      return alldata["amount"];
    }
  }
  //gte amount in rs on edit time
  getTotalDiscountInRupeeEditTime() {
    if (this.createdJobcardSetting.item_wise_discount != 0) {
      this.eventForDiscount = "₹";
      var jobtotaldiscount = 0;
      var sparetotaldiscount = 0;
      var lubetotaldiscount = 0;
      if (this.jobdatatabel.length != 0) {
        this.jobdatatabel.map((disc) => {
          if (disc.discounttype == "₹") {
            jobtotaldiscount += parseInt(disc.discountvalue);
          } else {
            var discountedvalue;
            if (disc.sale_tax_type == "Inclusive") {
              discountedvalue =
                ((parseFloat(disc.unit_sale_price) *
                  parseFloat(disc.quantity)) /
                  (1 + parseInt(disc.sale_gst_rate) / 100)) *
                (parseInt(disc.discountvalue) / 100);
            } else {
              discountedvalue =
                parseFloat(disc.unit_sale_price) *
                parseFloat(disc.quantity) *
                (parseInt(disc.discountvalue) / 100);
            }
            jobtotaldiscount += discountedvalue;
          }
        });
      }
      if (this.sparedatatabel.length != 0) {
        this.sparedatatabel.map((disc) => {
          if (disc.discounttype == "₹") {
            sparetotaldiscount += parseInt(disc.discountvalue);
          } else {
            var discountedvalue;
            if (disc.sale_tax_type == "Inclusive") {
              discountedvalue =
                (parseFloat(disc.unit_sale_price) /
                  (1 + parseInt(disc.sale_gst_rate) / 100)) *
                (parseInt(disc.discountvalue) / 100);
            } else {
              discountedvalue =
                parseFloat(disc.unit_sale_price) *
                parseFloat(disc.quantity) *
                (parseInt(disc.discountvalue) / 100);
            }
            sparetotaldiscount += discountedvalue;
          }
        });
      }
      if (this.lubedatatabel.length != 0) {
        this.lubedatatabel.map((disc) => {
          if (disc.discounttype == "₹") {
            lubetotaldiscount += parseInt(disc.discountvalue);
          } else {
            var discountedvalue;
            if (disc.sale_tax_type == "Inclusive") {
              discountedvalue =
                (parseFloat(disc.unit_sale_price) /
                  (1 + parseInt(disc.sale_gst_rate) / 100)) *
                (parseInt(disc.discountvalue) / 100);
            } else {
              discountedvalue =
                parseFloat(disc.unit_sale_price) *
                parseFloat(disc.quantity) *
                (parseInt(disc.discountvalue) / 100);
            }
            lubetotaldiscount += discountedvalue;
          }
        });
      }
      this.duplicatedisc = Math.round(
        jobtotaldiscount + sparetotaldiscount + lubetotaldiscount
      );
    }
  }
  //Reminders for the jobs
  updateRemindersOfJob() {
    this.jobdatatabel.map((jobs) => {
      if (jobs.is_master == "True") {
        if (!this.checkarray.includes(jobs.part_name)) {
          this.checkarray.push(jobs.part_name);
          this.reminderArray.push(jobs);
        }
      }
    });
  }
  //Add Option of Mater jobs to Table
  addOptionToJobs(jobtype) {
    this.selectedJobResult("job (Part No:-" + jobtype + ")------job");
  }
  // Updated the Negative Qunatity of the Job
  updateNegativeInventoryForJob() {
    this.addselectedJobResult(this.negativearryforspare.part_number);
    this.CreateJobForm.controls["partnumber"].setValue(
      this.negativearryforjob.part_number,
      { onlySelf: true }
    );
  }
  //push the seach Job Resultin the aray so that user can seelect the Job from dropdown in side popup
  searchJobInputToCreate(event) {
    this.searchJobDataForCreate = [];
    this.general.getJobSpareLube(this.userworkshopid, "job", event).subscribe(
      (JobSearchData) => {
        this.showspinner.setSpinnerForLogin(true);
        if (JobSearchData.success == true) {
          if (JobSearchData.jobdata != undefined) {
            for (var i = 0; i < JobSearchData.jobdata.length; i++) {
              this.searchJobDataForCreate.push(
                JobSearchData.jobdata[i].part_number
              );
            }
          }
        } else {
          this.searchJobDataForCreate = [];
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
  //add the result of the selected job to update the job details in side popup
  addselectedJobResult(event) {
    this.allSelectedMake = [];
    this.dupseletecmodvari = [];

    this.general
      .getJobSpareLubeData(this.userworkshopid, "job", event)
      .subscribe(
        (jobData) => {
          if (event != "" && jobData.jobdata != undefined) {
            if (jobData.jobdata[0].is_master == "false") {
              if (jobData.success == true) {
                var vechilevariant = JSON.parse(
                  jobData.jobdata[0].vechile_details.replace(/\\/g, "")
                );
                this.foralltrue = false;
                var vehdetails = JSON.parse(jobData.jobdata[0].vechile_details);

                if (vehdetails.length == undefined) {
                  var vehdata = [];
                  if (vehdetails.make == "All") {
                    this.foralltrue = true;
                    vehdata.push({
                      make: "All",
                      model: "All",
                      variant: "All",
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
                this.CreateSpareForm.controls["searchspareVehiclemod"].setValue(
                  ""
                );
                this.CreateSpareForm.controls["searchspareVehicle"].setValue(
                  ""
                );
                this.CreateJobForm.controls["partname"].setValue(
                  jobData.jobdata[0].part_name,
                  { onlySelf: true }
                );
                this.CreateJobForm.controls["companynameJob"].setValue(
                  jobData.jobdata[0].company_name,
                  { onlySelf: true }
                );
                this.CreateJobForm.controls["quantity"].setValue(
                  jobData.jobdata[0].current_quantity,
                  { onlySelf: true }
                );
                this.CreateJobForm.controls["lowerlimit"].setValue(
                  jobData.jobdata[0].lower_limit,
                  { onlySelf: true }
                );
                this.CreateJobForm.controls["unit"].setValue(
                  jobData.jobdata[0].unit,
                  { onlySelf: true }
                );
                this.CreateJobForm.controls["subcategory"].setValue(
                  jobData.jobdata[0].job_subcategory,
                  { onlySelf: true }
                );
                this.CreateJobForm.controls["gstslab"].setValue(
                  jobData.jobdata[0].sale_gst_rate,
                  { onlySelf: true }
                );
                this.CreateJobForm.controls["gsttype"].setValue(
                  jobData.jobdata[0].sale_tax_type,
                  { onlySelf: true }
                );
                this.CreateJobForm.controls["rackno"].setValue(
                  jobData.jobdata[0].rack_no,
                  { onlySelf: true }
                );
                this.CreateJobForm.controls["purchaseprice"].setValue(0, {
                  onlySelf: true,
                });
                this.CreateJobForm.controls["sellingprice"].setValue(
                  jobData.jobdata[0].unit_sale_price,
                  { onlySelf: true }
                );
                this.CreateJobForm.controls["hsnno"].setValue(
                  jobData.jobdata[0].hsn_no,
                  { onlySelf: true }
                );
                this.showJobUpdate = true;
              }
            }
          } else {
            this.CreateJobForm.controls["partname"].setValue("", {
              onlySelf: true,
            });
            this.CreateJobForm.controls["companynameJob"].setValue("", {
              onlySelf: true,
            });
            this.CreateJobForm.controls["quantity"].setValue(1, {
              onlySelf: true,
            });
            this.CreateJobForm.controls["lowerlimit"].setValue(0, {
              onlySelf: true,
            });
            this.CreateJobForm.controls["unit"].setValue(this.unitsjob[0], {
              onlySelf: true,
            });
            this.CreateJobForm.controls["subcategory"].setValue(
              this.spareCategory[0],
              { onlySelf: true }
            );
            this.CreateJobForm.controls["gstslab"].setValue(
              this.gstNumberArr[0],
              { onlySelf: true }
            );
            this.CreateJobForm.controls["gsttype"].setValue(this.gsttype[0], {
              onlySelf: true,
            });
            this.CreateJobForm.controls["rackno"].setValue("", {
              onlySelf: true,
            });
            this.CreateJobForm.controls["purchaseprice"].setValue(0, {
              onlySelf: true,
            });
            this.CreateJobForm.controls["sellingprice"].setValue(null, {
              onlySelf: true,
            });
            this.CreateJobForm.controls["hsnno"].setValue("", {
              onlySelf: true,
            });
            this.showLubeUpdate = false;
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
  //push the seach job Resultin the aray so that user can seelect the job from dropdown
  searchJobInput(event) {
    this.general.getJobSpareLube(this.userworkshopid, "job", event).subscribe(
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
            for (var i = 0; i < JobSearchData.jobdata.length; i++) {
              var vehdata = [];
              vehdata = JSON.parse(JobSearchData.jobdata[i].vechile_details);
              if (vehdata.length == undefined) {
                if (vehdata["make"] == "All") {
                  if (
                    !this.jobduplicate.includes(
                      JobSearchData.jobdata[i].part_number
                    )
                  ) {
                    if (JobSearchData.jobdata[i].unit_sale_price != "") {
                      this.jobduplicate.push(
                        JobSearchData.jobdata[i].part_number
                      );
                      this.searchJobDatasec.push(
                        JobSearchData.jobdata[i].part_name +
                          " (Part No:-" +
                          JobSearchData.jobdata[i].part_number +
                          ")----Rs." +
                          JobSearchData.jobdata[i].unit_sale_price +
                          "/-"
                      );
                    } else {
                      this.jobduplicate.push(
                        JobSearchData.jobdata[i].part_number
                      );
                      this.searchJobDatasec.push(
                        JobSearchData.jobdata[i].part_name +
                          " (Part No:-" +
                          JobSearchData.jobdata[i].part_number +
                          ")"
                      );
                    }
                  }
                } else {
                  if (vehdata["make"] == this.SelectedDataarrOfVehicle.make) {
                    if (vehdata["model"] == "All") {
                      if (
                        !this.jobduplicate.includes(
                          JobSearchData.jobdata[i].part_number
                        )
                      ) {
                        if (JobSearchData.jobdata[i].unit_sale_price != "") {
                          this.jobduplicate.push(
                            JobSearchData.jobdata[i].part_number
                          );
                          this.searchJobDatasec.push(
                            JobSearchData.jobdata[i].part_name +
                              " (Part No:-" +
                              JobSearchData.jobdata[i].part_number +
                              ")----Rs." +
                              JobSearchData.jobdata[i].unit_sale_price +
                              "/-"
                          );
                        } else {
                          this.jobduplicate.push(
                            JobSearchData.jobdata[i].part_number
                          );
                          this.searchJobDatasec.push(
                            JobSearchData.jobdata[i].part_name +
                              " (Part No:-" +
                              JobSearchData.jobdata[i].part_number +
                              ")"
                          );
                        }
                      }
                    } else {
                      if (
                        vehdata["model"] == this.SelectedDataarrOfVehicle.model
                      ) {
                        if (vehdata["variant"] == "All") {
                          if (
                            !this.jobduplicate.includes(
                              JobSearchData.jobdata[i].part_number
                            )
                          ) {
                            if (
                              JobSearchData.jobdata[i].unit_sale_price != ""
                            ) {
                              this.jobduplicate.push(
                                JobSearchData.jobdata[i].part_number
                              );
                              this.searchJobDatasec.push(
                                JobSearchData.jobdata[i].part_name +
                                  " (Part No:-" +
                                  JobSearchData.jobdata[i].part_number +
                                  ")----Rs." +
                                  JobSearchData.jobdata[i].unit_sale_price +
                                  "/-"
                              );
                            } else {
                              this.jobduplicate.push(
                                JobSearchData.jobdata[i].part_number
                              );
                              this.searchJobDatasec.push(
                                JobSearchData.jobdata[i].part_name +
                                  " (Part No:-" +
                                  JobSearchData.jobdata[i].part_number +
                                  ")"
                              );
                            }
                          }
                        } else {
                          if (
                            vehdata["variant"] ==
                            this.SelectedDataarrOfVehicle.variant
                          ) {
                            if (
                              !this.jobduplicate.includes(
                                JobSearchData.jobdata[i].part_number
                              )
                            ) {
                              if (
                                JobSearchData.jobdata[i].unit_sale_price != ""
                              ) {
                                this.jobduplicate.push(
                                  JobSearchData.jobdata[i].part_number
                                );
                                this.searchJobDatasec.push(
                                  JobSearchData.jobdata[i].part_name +
                                    " (Part No:-" +
                                    JobSearchData.jobdata[i].part_number +
                                    ")----Rs." +
                                    JobSearchData.jobdata[i].unit_sale_price +
                                    "/-"
                                );
                              } else {
                                this.jobduplicate.push(
                                  JobSearchData.jobdata[i].part_number
                                );
                                this.searchJobDatasec.push(
                                  JobSearchData.jobdata[i].part_name +
                                    " (Part No:-" +
                                    JobSearchData.jobdata[i].part_number +
                                    ")"
                                );
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                vehdata.filter((dataveh) => {
                  if (dataveh.make == "All") {
                    if (
                      !this.jobduplicate.includes(
                        JobSearchData.jobdata[i].part_number
                      )
                    ) {
                      if (JobSearchData.jobdata[i].unit_sale_price != "") {
                        this.jobduplicate.push(
                          JobSearchData.jobdata[i].part_number
                        );
                        this.searchJobDatasec.push(
                          JobSearchData.jobdata[i].part_name +
                            " (Part No:-" +
                            JobSearchData.jobdata[i].part_number +
                            ")----Rs." +
                            JobSearchData.jobdata[i].unit_sale_price +
                            "/-"
                        );
                      } else {
                        this.jobduplicate.push(
                          JobSearchData.jobdata[i].part_number
                        );
                        this.searchJobDatasec.push(
                          JobSearchData.jobdata[i].part_name +
                            " (Part No:-" +
                            JobSearchData.jobdata[i].part_number +
                            ")"
                        );
                      }
                    }
                  } else {
                    if (dataveh.make == this.SelectedDataarrOfVehicle.make) {
                      if (dataveh.model == "All-model") {
                        if (
                          !this.jobduplicate.includes(
                            JobSearchData.jobdata[i].part_number
                          )
                        ) {
                          if (JobSearchData.jobdata[i].unit_sale_price != "") {
                            this.jobduplicate.push(
                              JobSearchData.jobdata[i].part_number
                            );
                            this.searchJobDatasec.push(
                              JobSearchData.jobdata[i].part_name +
                                " (Part No:-" +
                                JobSearchData.jobdata[i].part_number +
                                ")----Rs." +
                                JobSearchData.jobdata[i].unit_sale_price +
                                "/-"
                            );
                          } else {
                            this.jobduplicate.push(
                              JobSearchData.jobdata[i].part_number
                            );
                            this.searchJobDatasec.push(
                              JobSearchData.jobdata[i].part_name +
                                " (Part No:-" +
                                JobSearchData.jobdata[i].part_number +
                                ")"
                            );
                          }
                        }
                      } else {
                        if (
                          dataveh.model == this.SelectedDataarrOfVehicle.model
                        ) {
                          if (dataveh.variant == "All-variant") {
                            if (
                              !this.jobduplicate.includes(
                                JobSearchData.jobdata[i].part_number
                              )
                            ) {
                              if (
                                JobSearchData.jobdata[i].unit_sale_price != ""
                              ) {
                                this.jobduplicate.push(
                                  JobSearchData.jobdata[i].part_number
                                );
                                this.searchJobDatasec.push(
                                  JobSearchData.jobdata[i].part_name +
                                    " (Part No:-" +
                                    JobSearchData.jobdata[i].part_number +
                                    ")----Rs." +
                                    JobSearchData.jobdata[i].unit_sale_price +
                                    "/-"
                                );
                              } else {
                                this.jobduplicate.push(
                                  JobSearchData.jobdata[i].part_number
                                );
                                this.searchJobDatasec.push(
                                  JobSearchData.jobdata[i].part_name +
                                    " (Part No:-" +
                                    JobSearchData.jobdata[i].part_number +
                                    ")"
                                );
                              }
                            }
                          } else {
                            if (
                              dataveh.variant ==
                              this.SelectedDataarrOfVehicle.variant
                            ) {
                              if (
                                !this.jobduplicate.includes(
                                  JobSearchData.jobdata[i].part_number
                                )
                              ) {
                                if (
                                  JobSearchData.jobdata[i].unit_sale_price != ""
                                ) {
                                  this.jobduplicate.push(
                                    JobSearchData.jobdata[i].part_number
                                  );
                                  this.searchJobDatasec.push(
                                    JobSearchData.jobdata[i].part_name +
                                      " (Part No:-" +
                                      JobSearchData.jobdata[i].part_number +
                                      ")----Rs." +
                                      JobSearchData.jobdata[i].unit_sale_price +
                                      "/-"
                                  );
                                } else {
                                  this.jobduplicate.push(
                                    JobSearchData.jobdata[i].part_number
                                  );
                                  this.searchJobDatasec.push(
                                    JobSearchData.jobdata[i].part_name +
                                      " (Part No:-" +
                                      JobSearchData.jobdata[i].part_number +
                                      ")"
                                  );
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                });
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
    this.jobdatatabel.splice(index, 1);
    this.duplicateJob = this.jobdatatabel;
    this.JobTotal = this.calculateresult(this.jobdatatabel);
    this.JobTotalFinal = this.calculateresultfinal(this.jobdatatabel);
    this.calculateAmountOfBilling();
    this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
    this.getTotalDiscountInRupee();
    this.checkJobGSTrateandtype();
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
  //open the popup to create or update the job
  openJobpopup() {
    this.foralltrue = false;
    this.SelectedDataarrOfVehiclespl = undefined;
    this.showJobUpdate = false;
    this.foralltrue = false;
    this.allSelectedMake = [];
    this.allSelectedMake.push(this.SelectedDataarrOfVehicle);
    this.dupseletecmodvari = [];

    this.CreateSpareForm.controls["searchspareVehiclemod"].setValue("");
    this.CreateJobForm.controls["partnumber"].setValue(undefined, {
      onlySelf: true,
    });
    this.CreateJobForm.controls["sellingprice"].setValue(null);
    this.CreateJobForm.controls["partname"].setValue("");
    this.CreateJobForm.controls["purchaseprice"].setValue(0, {
      onlySelf: true,
    });
    this.CreateJobForm.controls["subcategory"].setValue(this.JobCategory[1], {
      onlySelf: true,
    });
    this.CreateJobForm.controls["gstslab"].setValue(this.gstNumberArr[0], {
      onlySelf: true,
    });
    this.CreateJobForm.controls["gsttype"].setValue(this.gsttype[0], {
      onlySelf: true,
    });
    this.CreateJobForm.controls["unit"].setValue(this.unitsjob[0], {
      onlySelf: true,
    });
    this.CreateJobForm.controls["hsnno"].setValue("");

    this.totalamountonform = 0;
    this.toShowcgst = 0;
    this.toShowsgst = 0;
    this.toShowtotal_gst = 0;
  }
  //Value enetered as the job qunatity is changed
  checkvalueenteredforjob(event, index, indexdata) {
    // if (event.match(/^[0-9]*$/))
    if (event.match(/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/)) {
      indexdata["showqunatityerrorjob"] = false;
      var amount = parseFloat(indexdata["unit_sale_price"]) * parseFloat(event);
      this.jobdatatabel[index]["quantity"] = event;
      //this.jobdatatabel[index]["amount"]=amount

      if (this.allBillingData.gst_number != "") {
        if (this.jobdatatabel[index]["sale_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            this.jobdatatabel[index]["unit_sale_price"],
            this.jobdatatabel[index]["sale_gst_rate"],
            this.jobdatatabel[index]["sale_tax_type"],
            parseInt(this.jobdatatabel[index]["discountvalue"]),
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
            parseInt(this.jobdatatabel[index]["discountvalue"]),
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
            parseInt(this.jobdatatabel[index]["discountvalue"]),
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
          parseInt(this.jobdatatabel[index]["discountvalue"]),
          event,
          this.jobdatatabel[index]["discounttype"]
        );
        this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.JobTotal = this.calculateresult(this.jobdatatabel);
      this.JobTotalFinal = this.calculateresultfinal(this.jobdatatabel);
      this.calculateAmountOfBilling();
      this.jobdatatabel[index]["totalitemamount"] = this.getTotalAmount(
        indexdata,
        index,
        "job"
      );
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
    } else {
      indexdata["showqunatityerrorjob"] = true;
    }
  }
  //hsn for the job
  hsnforjob(event, index, indexdata) {
    this.jobdatatabel[index]["hsn_no"] = event;
  }
  //hsn for the lube
  hsnforlube(event, index, indexdata) {
    this.lubedatatabel[index]["hsn_no"] = event;
  }
  //hsn for the spare
  hsnforspare(event, index, indexdata) {
    this.sparedatatabel[index]["hsn_no"] = event;
  }
  //Value enetered as the job unit price is changed
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
          this.jobdatatabel[index]["unit_sale_price"] = event;
        } else if (this.jobdatatabel[index]["purchase_gst_rate"] != "") {
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
          this.jobdatatabel[index]["unit_sale_price"] = event;
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
          this.jobdatatabel[index]["unit_sale_price"] = event;
        }
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
        this.jobdatatabel[index]["unit_sale_price"] = event;
      }
      this.JobTotal = this.calculateresult(this.jobdatatabel);
      this.JobTotalFinal = this.calculateresultfinal(this.jobdatatabel);
      this.calculateAmountOfBilling();
      this.jobdatatabel[index]["totalitemamount"] = this.getTotalAmount(
        indexdata,
        index,
        "job"
      );
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
    } else {
      indexdata["showpriceerrorjob"] = true;
    }
  }
  //Value enetered as the job gst amount is changed
  checkjobgst(event, data, index, gstVlaue) {
    var amounttocalculate =
      parseFloat(data["unit_sale_price"]) * parseFloat(data["quantity"]);
    if (data["sale_gst_rate"] != "" && data["sale_tax_type"] != "") {
      this.jobdatatabel[index]["sale_gst_rate"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(data["unit_sale_price"]),
        event,
        this.jobdatatabel[index]["sale_tax_type"],
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
      this.jobdatatabel[index]["jobgstamounterror"] = false;
      this.JobTotal = this.calculateresult(this.jobdatatabel);
      this.JobTotalFinal = this.calculateresultfinal(this.jobdatatabel);
      this.calculateAmountOfBilling();
      this.jobdatatabel[index]["totalitemamount"] = this.getTotalAmount(
        data,
        index,
        "job"
      );
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
      this.checkJobGSTrateandtype();
    } else if (
      data["purchase_gst_rate"] != "" &&
      data["purchase_tax_type"] != ""
    ) {
      this.jobdatatabel[index]["purchase_gst_rate"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(data["unit_sale_price"]),
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
      if (gstVlaue != "gstNull") {
        this.jobdatatabel[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.jobdatatabel[index]["jobgstamounterror"] = false;
      this.JobTotal = this.calculateresult(this.jobdatatabel);
      this.JobTotalFinal = this.calculateresultfinal(this.jobdatatabel);
      this.calculateAmountOfBilling();
      this.jobdatatabel[index]["totalitemamount"] = this.getTotalAmount(
        data,
        index,
        "job"
      );
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
      this.checkJobGSTrateandtype();
    } else {
      this.jobdatatabel[index]["jobgstamounterror"] = false;
      this.jobdatatabel[index]["amount"] = data["amount"];
      this.JobTotal = this.calculateresult(this.jobdatatabel);
      this.JobTotalFinal = this.calculateresultfinal(this.jobdatatabel);
      this.calculateAmountOfBilling();
      this.jobdatatabel[index]["totalitemamount"] = this.getTotalAmount(
        data,
        index,
        "job"
      );
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
      this.checkJobGSTrateandtype();
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
      this.jobdatatabel[index]["jobgsttypeerror"] = false;
      this.JobTotal = this.calculateresult(this.jobdatatabel);
      this.JobTotalFinal = this.calculateresultfinal(this.jobdatatabel);
      this.calculateAmountOfBilling();
      this.jobdatatabel[index]["totalitemamount"] = this.getTotalAmount(
        data,
        index,
        "job"
      );
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
      this.checkJobGSTrateandtype();
    } else if (
      data["purchase_gst_rate"] != "" &&
      data["purchase_tax_type"] != ""
    ) {
      this.jobdatatabel[index]["purchase_tax_type"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(data["unit_sale_price"]),
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
      this.jobdatatabel[index]["jobgsttypeerror"] = false;
      this.JobTotal = this.calculateresult(this.jobdatatabel);
      this.JobTotalFinal = this.calculateresultfinal(this.jobdatatabel);
      this.calculateAmountOfBilling();
      this.jobdatatabel[index]["totalitemamount"] = this.getTotalAmount(
        data,
        index,
        "job"
      );
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
      this.checkJobGSTrateandtype();
    } else {
      this.jobdatatabel[index]["jobgsttypeerror"] = false;
      this.jobdatatabel[index]["amount"] = data["amount"];
      this.JobTotal = this.calculateresult(this.jobdatatabel);
      this.JobTotalFinal = this.calculateresultfinal(this.jobdatatabel);
      this.calculateAmountOfBilling();
      this.jobdatatabel[index]["totalitemamount"] = this.getTotalAmount(
        data,
        index,
        "job"
      );
      this.calTotalGstForJobamount = this.calTotalGstForJob(this.jobdatatabel);
      this.checkJobGSTrateandtype();
    }
  }
  //Value enetered as the job gst type and amount is changed in side popup
  checkJobGSTrateandtype() {
    var jobdatatabelfilter = this.jobdatatabel.filter(
      (job) => job.jobgsttypeerror == true || job.jobgstamounterror == true
    );
    if (jobdatatabelfilter.length != 0) {
      this.jobgsterror = true;
      this.joblenghtoferror = jobdatatabelfilter.length;
    } else {
      this.jobgsterror = false;
      this.joblenghtoferror = 0;
    }
  }
  // Create New Job form with validations
  createJobForm() {
    this.CreateJobForm = this.formbuild.group({
      partnumber: [""],
      partname: ["", Validators.required],
      companynameJob: [""],
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
  //API call to Create New Job
  createJobByAPI(mode) {
    var purchase_qty = this.CreateJobForm.value.quantity;
    var purchase_total_amount = 0;
    var purchase_discount = "";
    var purchase_cgst = 0;
    var purchase_sgst = 0;
    var purchase_igst = 0;
    var purchase_total_gst = 0;
    var sale_qty = this.CreateJobForm.value.quantity;
    var sale_total_amount = 0;
    var sale_discount = "";
    var sale_cgst = 0;
    var sale_sgst = 0;
    var sale_igst = 0;
    var sale_total_gst = 0;
    // var vechileDetails
    // var makeVechile
    // var modelVechile
    // var variVechile
    // if(this.CreateCustomerForm.value.make==this.makemessage){
    //   makeVechile=""
    // }else{
    //   makeVechile=this.CreateCustomerForm.value.make
    // }
    // if(this.CreateCustomerForm.value.model==this.modelmessage){
    //   modelVechile=""
    // }else{
    //   modelVechile=this.CreateCustomerForm.value.model
    // }
    // if(this.CreateCustomerForm.value.varri==this.varrimessage){
    //   variVechile=""
    // }else{
    //   variVechile=this.CreateCustomerForm.value.varri
    // }
    // vechileDetails={"vehicle_make":makeVechile,
    //                 "vehicle_model":modelVechile,
    //                 "vehicle_variant":variVechile
    //                }
    if (this.allBillingData.gst_number != "") {
      if (this.CreateJobForm.value.gsttype == this.gsttype[0]) {
        if (this.CreateJobForm.value.purchaseprice != 0) {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateJobForm.value.purchaseprice.toString(),
            this.CreateJobForm.value.gstslab,
            this.gsttype[0]
          );
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        } else {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateJobForm.value.sellingprice.toString(),
            this.CreateJobForm.value.gstslab,
            this.gsttype[0]
          );
          sale_total_amount = GSTCal[0]["totalamount"];
          sale_cgst = GSTCal[0]["CGST"];
          sale_sgst = GSTCal[0]["SGST"];
          sale_total_gst = GSTCal[0]["GSTAmount"];
          this.CreateJobForm.value.purchaseprice =
            this.CreateJobForm.value.sellingprice;
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        }
      } else {
        if (this.CreateJobForm.value.purchaseprice != 0) {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateJobForm.value.purchaseprice.toString(),
            this.CreateJobForm.value.gstslab,
            this.gsttype[1]
          );
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        } else {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateJobForm.value.sellingprice.toString(),
            this.CreateJobForm.value.gstslab,
            this.gsttype[1]
          );
          sale_total_amount = GSTCal[0]["totalamount"];
          sale_cgst = GSTCal[0]["CGST"];
          sale_sgst = GSTCal[0]["SGST"];
          sale_total_gst = GSTCal[0]["GSTAmount"];
          this.CreateJobForm.value.purchaseprice =
            this.CreateJobForm.value.sellingprice;
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        }
      }
    } else {
      if (this.CreateJobForm.value.purchaseprice == 0) {
        this.CreateJobForm.value.purchaseprice =
          this.CreateJobForm.value.sellingprice;
      }
    }
    var part_number;
    if (this.CreateJobForm.getRawValue().partnumber == undefined) {
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
      part_number = this.CreateJobForm.getRawValue().partnumber;
    }
    this.general
      .saveJobSapreLubeProfile(
        "job",
        mode,
        part_number,
        this.CreateJobForm.value.partname,
        "",
        this.CreateJobForm.value.unit,
        "job",
        "",
        this.CreateJobForm.value.subcategory,
        "",
        JSON.stringify(this.allSelectedMake),
        this.CreateJobForm.value.quantity,
        this.CreateJobForm.value.lowerlimit,
        this.CreateJobForm.value.rackno,
        this.CreateJobForm.value.hsnno,
        this.CreateJobForm.value.purchaseprice,
        purchase_qty,
        this.CreateJobForm.value.gstslab,
        this.CreateJobForm.value.gsttype,
        purchase_total_amount,
        purchase_discount,
        purchase_cgst,
        purchase_sgst,
        purchase_igst,
        purchase_total_gst,
        this.CreateJobForm.value.sellingprice,
        sale_qty,
        this.CreateJobForm.value.gstslab,
        this.CreateJobForm.value.gsttype,
        sale_total_amount,
        sale_discount,
        sale_cgst,
        sale_sgst,
        sale_igst,
        sale_total_gst,
        this.CreateJobForm.value.companynameJob,
        this.userworkshopid
      )
      .subscribe(
        (SaveResult) => {
          this.showspinner.setSpinnerForLogin(false);
          if (SaveResult.success == true) {
            this.showspinner.setSpinnerForLogin(false);
            this.snakBar.open(
              "Success",
              ErrorMessgae[0][SaveResult["message"]],
              {
                duration: 4000,
              }
            );
            SaveResult.jobdata["amount"] = "";
            SaveResult.jobdata["quantity"] = "1";
            SaveResult.jobdata["showqunatityerrorjob"] = null;
            SaveResult.jobdata["showpriceerrorjob"] = null;
            SaveResult.jobdata["allownegativeinjob"] = null;
            SaveResult.jobdata["checkinsertedjob"] = null;
            SaveResult.jobdata["gstcalculateofjob"] = null;
            SaveResult.jobdata["cgstcalculateofjob"] = null;
            SaveResult.jobdata["sgstcalculateoflube"] = null;
            SaveResult.jobdata["showcalcluationinfo"] = null;
            SaveResult.jobdata["jobgstamounterror"] = null;
            SaveResult.jobdata["jobgsttypeerror"] = null;
            if (this.assignedMechanicArray.length == 0) {
              SaveResult.jobdata["jobassignedmechanic"] = [
                this.jobcardSettingData.default_mechanic[0].name
                  .charAt(0)
                  .toUpperCase() +
                  this.jobcardSettingData.default_mechanic[0].name.slice(1),
              ];
            } else {
              SaveResult.jobdata["jobassignedmechanic"] =
                this.assignedMechanicArray;
            }
            this.makejobtable(SaveResult.jobdata);
            this.JobTotal = this.calculateresult(this.jobdatatabel);
            this.JobTotalFinal = this.calculateresultfinal(this.jobdatatabel);
            this.calculateAmountOfBilling();
            this.calTotalGstForJobamount = this.calTotalGstForJob(
              this.jobdatatabel
            );
          } else {
            this.showspinner.setSpinnerForLogin(false);
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
          this.showspinner.setSpinnerForLogin(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  // Select Assigned Mechanic
  onDeSelectAssignedJob(event, selecttype, data, index) {
    if (selecttype == "all") {
      this.jobdatatabel[index]["jobassignedmechanic"] = event;
    } else {
      this.jobdatatabel[index]["jobassignedmechanic"] = this.jobdatatabel[
        index
      ]["jobassignedmechanic"].filter(
        (mechanic) => mechanic.name != event.name
      );
    }
  }
  // DeSelect Assigned Mechanic
  onItemSelectAssignedJob(event, selecttype, data, index) {
    if (selecttype == "all") {
      this.jobdatatabel[index]["jobassignedmechanic"] = event;
    } else {
      this.jobdatatabel[index]["jobassignedmechanic"].push(event);
    }
  }
  //---------------------------CALCULATIONS---------------------------------------------------------
  // Calculate The GST SGST CGST and total amont
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
  //Calculate GST and total of amount when there is discount
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
        // my edit float all quantity
        var taxalbeamount =
          (parseFloat(price) * parseFloat(quantity)) /
            (1 + parseInt(rate) / 100) -
          parseInt(discount);
        var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
        var CGST = GSTAmount / 2;
        var SGST = CGST;
        var totalamount = taxalbeamount + GSTAmount;
      } else {
        var taxalbeamount =
          parseFloat(price) * parseFloat(quantity) - parseInt(discount);
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
          (parseInt(discount) / 100);
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
          parseFloat(price) * parseFloat(quantity) * (parseInt(discount) / 100);
        var taxalbeamount =
          parseFloat(price) * parseFloat(quantity) - discountamount;
        var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
        var CGST = GSTAmount / 2;
        var SGST = CGST;
        var totalamount = taxalbeamount + GSTAmount;
      }
    }
    this.gstUpdatedCal();
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
  gstUpdatedCal() {
    if (this.allBillingData.gst_number != "") {
      var newArray = [];
      newArray = this.lubedatatabel
        .concat(this.jobdatatabel)
        .concat(this.sparedatatabel);

      const sum = Math.round(
        newArray.reduce((a, { amount }) => a + parseFloat(amount), 0)
      );

      // this.tableBilledAmount = sum;
      this.totalAmount = sum;
      this.totalPayable = sum;
      this.billedAmount = sum;
      this.totalBalance = Math.round(
        this.totalPayable - (this.advanceAmount + this.totalPaid)
      );

      this.discount = 0;
    }
  }
  // Calculate total amount for spare lubes and jobs
  calculateresult(object) {
    // const sum = object.reduce((a, {amount}) => a + parseFloat(amount), 0);
    // const disval=this.calspediscount(object)
    // return Math.round(sum+disval);
    var totalcategoryamouny = 0;
    object.map((alldata) => {
      if (this.allBillingData.gst_number != "") {
        if (alldata["sale_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(alldata["unit_sale_price"]),
            alldata["sale_gst_rate"],
            alldata["sale_tax_type"],
            0,
            parseFloat(alldata["quantity"]),
            "%"
          );
          totalcategoryamouny += parseFloat(totalcal[0]["totalamount"]);
        } else if (alldata["purchase_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(alldata["unit_purchase_price"]),
            alldata["purchase_gst_rate"],
            alldata["purchase_tax_type"],
            0,
            parseFloat(alldata["quantity"]),
            "%"
          );
          totalcategoryamouny += parseFloat(totalcal[0]["totalamount"]);
        } else {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(alldata["unit_sale_price"]),
            "0",
            "Inclusive",
            0,
            parseFloat(alldata["quantity"]),
            "%"
          );
          totalcategoryamouny += parseFloat(totalcal[0]["totalamount"]);
        }
      } else {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseFloat(alldata["unit_sale_price"]),
          "0",
          "Inclusive",
          0,
          parseFloat(alldata["quantity"]),
          "%"
        );
        totalcategoryamouny += parseFloat(totalcal[0]["totalamount"]);
      }
    });
    return totalcategoryamouny;
  }
  //calculate jobcard final result
  calculateresultfinal(object) {
    var jobtotaldiscount = 0;
    if (object.length != 0) {
      object.map((disc) => {
        if (disc.discounttype == "₹") {
          jobtotaldiscount += parseInt(disc.discountvalue);
        } else {
          var discountedvalue;
         if (this.allBillingData.gst_number != "" && disc.sale_tax_type == "Inclusive") {
            discountedvalue =
              ((parseFloat(disc.unit_sale_price) * parseFloat(disc.quantity)) /
                (1 + parseInt(disc.sale_gst_rate) / 100)) *
              (parseInt(disc.discountvalue) / 100);
          } else {
            discountedvalue =
              parseFloat(disc.unit_sale_price) *
              parseFloat(disc.quantity) *
              (parseInt(disc.discountvalue) / 100);
          }
          jobtotaldiscount += discountedvalue;
        }
      });
    }
    return jobtotaldiscount;
  }
  //calculate spare discount
  calspediscount(object) {
    var jobtotaldiscount = 0;
    if (object.length != 0) {
      object.map((disc) => {
        if (disc.discounttype == "₹") {
          jobtotaldiscount +=
            parseInt(disc.discountvalue) * parseFloat(disc.quantity);
        } else {
          var discountedvalue;
          if (disc.sale_tax_type == "Inclusive") {
            discountedvalue =
              ((parseFloat(disc.unit_sale_price) * parseFloat(disc.quantity)) /
                (1 + parseInt(disc.sale_gst_rate) / 100)) *
              (parseInt(disc.discountvalue) / 100);
          } else {
            discountedvalue =
              parseFloat(disc.unit_sale_price) *
              parseFloat(disc.quantity) *
              (parseInt(disc.discountvalue) / 100);
          }
          jobtotaldiscount += discountedvalue;
        }
      });
    }
    return jobtotaldiscount;
  }
  // Calculate total GST for spare
  calTotalGstForSpare(object) {
    return object.reduce(function (sum, record) {
      if (record.gstcalculateofspare != undefined)
        return sum + parseFloat(record.gstcalculateofspare);
      else return Math.round(sum);
    }, 0);
  }
  // Calculate total GST for lubes
  calTotalGstForLube(object) {
    return object.reduce(function (sum, record) {
      if (record.gstcalculateoflube != undefined)
        return sum + parseFloat(record.gstcalculateoflube);
      else return Math.round(sum);
    }, 0);
  }
  // Calculate total GST for jobs
  calTotalGstForJob(object) {
    return object.reduce(function (sum, record) {
      if (record.gstcalculateofjob != undefined)
        return sum + parseFloat(record.gstcalculateofjob);
      else return Math.round(sum);
    }, 0);
  }
  //---------------------------Last History-------------------------------------------------------------
  //get dates of the hsitory when user created the cutsomer or when get all the cutsoerm details
  getHistoryDates() {
    this.general
      .lastHistoryDates(
        this.userworkshopid,
        this.CreateCustomerForm.getRawValue().vechilenumber
      )
      .subscribe(
        (dates) => {
          this.showspinner.setSpinnerForLogin(true);
          if (dates["success"] == true) {
            this.alldates = dates["history_dates"];
            this.selectedDate = this.alldates[0];
            this.dateLength = this.alldates.length - 1;
            this.selectedDateIndex = 0;
            if (this.alldates.length > 1) {
              this.ShoePreviousDate = true;
            } else {
              this.ShoePreviousDate = false;
            }
          } else {
            this.snakBar.open("Message", ErrorMessgae[0][dates["messgae"]], {
              duration: 4000,
            });
            this.alldates = "none";
            this.selectedDate = "none";
          }
          this.getStaff();
        },
        (err) => {
          this.showspinner.setSpinnerForLogin(false);
          this.snakBar.open("Error", err, {
            duration: 4000,
          });
        }
      );
  }
  //Get Previous Date
  getPreviousDate(index) {
    if (this.dateLength >= index) {
      this.selectedDateIndex = index + 1;
      this.selectedDate = this.alldates[index + 1];
      this.getHistoryData();
      if (this.selectedDateIndex != this.dateLength) {
        this.ShoePreviousDate = true;
      } else {
        this.ShoePreviousDate = false;
      }
      this.ShoeNextDate = true;
    } else {
      this.ShoePreviousDate = false;
      this.ShoeNextDate = true;
    }
  }
  // Get Next Date
  getNextDate(index) {
    if (this.dateLength >= index) {
      this.selectedDateIndex = index - 1;
      this.selectedDate = this.alldates[index - 1];
      this.getHistoryData();
      if (this.selectedDateIndex != 0) {
        this.ShoeNextDate = true;
      } else {
        this.ShoeNextDate = false;
      }
      this.ShoePreviousDate = true;
    } else {
      this.ShoePreviousDate = false;
      this.ShoeNextDate = true;
    }
  }
  //convert to int
  ConvertToInt(currentPage) {
    return parseInt(currentPage);
  }
  //get hsitory Data
  getHistoryData() {
    this.Worknotes = [];
    this.CustomerVoice = "";
    this.remiderforsameday = "";
    this.general
      .lastHistoryData(
        this.userworkshopid,
        this.CreateCustomerForm.getRawValue().vechilenumber,
        this.selectedDate
      )
      .subscribe(
        (dateData) => {
          this.showspinner.setSpinnerForLogin(true);
          if (dateData.success == true) {
            this.showspinner.setSpinnerForLogin(false);
            this.historyData = dateData.jobcards;
            this.kmHistory = dateData["kmread"];
            if ((this.smsHistory = dateData["sms_data_to_show"] != "")) {
              this.smsHistory = dateData["sms_data_to_show"];
            } else {
              this.smsHistory = "nodata";
            }

            this.jobcardSettingHistory = JSON.parse(
              this.historyData.settings_data_json
            )[0];
            if (this.historyData.jobcard_spare_items != "[]") {
              this.spareHistoryData = JSON.parse(
                this.historyData.jobcard_spare_items
              );
              this.spareHistoryTotal = this.calculateresult(
                this.spareHistoryData
              );
            } else {
              this.spareHistoryData = "no data";
              this.spareHistoryTotal = 0;
            }
            if (this.historyData.jobcard_lubes_items != "[]") {
              this.lubesHistoryData = JSON.parse(
                this.historyData.jobcard_lubes_items
              );
              this.lubeHistoryTotal = this.calculateresult(
                this.lubesHistoryData
              );
            } else {
              this.lubesHistoryData = "no data";
              this.lubeHistoryTotal = 0;
            }
            if (this.historyData.jobcard_job_items != "[]") {
              this.jobHistoryData = JSON.parse(
                this.historyData.jobcard_job_items
              );
              this.jobHistoryTotal = this.calculateresult(this.jobHistoryData);
            } else {
              this.jobHistoryData = "no data";
              this.jobHistoryTotal = 0;
            }
            if (
              this.historyData.jobcard_customer_voice != "" &&
              this.historyData.jobcard_customer_voice != "[]"
            ) {
              this.CustomerVoice = JSON.parse(
                this.historyData.jobcard_customer_voice
              ).join();
            } else {
              this.CustomerVoice = "nodata";
            }
            if (
              this.historyData.work_note != "" &&
              this.historyData.work_note != "[]"
            ) {
              JSON.parse(this.historyData.work_note).map((datawork) => {
                if (datawork.notes != "") {
                  this.Worknotes.push(datawork.notes);
                }
              });
              this.Worknotes.join();
            } else {
              this.Worknotes = [];
            }
            if (
              this.historyData.jobcard_mechanic != "" &&
              this.historyData.jobcard_mechanic != "[]"
            ) {
              JSON.parse(this.historyData.jobcard_mechanic).map((datawork) => {
                if (datawork.name != "") {
                  this.mechanicData.push(datawork.name);
                }
              });
              this.mechanicData.join();
            } else {
              this.mechanicData = [];
            }
            if (this.historyData.after_km == "No KM Reminder") {
              this.reminderKMForHistory = this.kmHistory;
            } else {
              this.reminderKMForHistory =
                parseInt(this.kmHistory) +
                parseInt(this.historyData.after_km.split(" ")[0]);
            }
            var currentdate = new Date(
              this.historyData.estimated_delivery_datetime
            );
            var reminderperioddate = new Date(
              currentdate.setMonth(
                currentdate.getMonth() +
                  parseInt(this.historyData.reminder.split(" ")[0])
              )
            );
            this.remiderforsameday =
              reminderperioddate.getFullYear().toString() +
              "-" +
              ("0" + (reminderperioddate.getMonth() + 1)).slice(-2).toString() +
              "-" +
              ("0" + reminderperioddate.getDate()).slice(-2).toString() +
              " 08:00:00";

            // console.log(this.historyData)
            // console.log(this.kmHistory)
            // console.log(this.smsHistory)
          } else {
            this.showspinner.setSpinnerForLogin(false);
            this.snakBar.open("Message", ErrorMessgae[0][dateData["message"]], {
              duration: 4000,
            });
          }
        },
        (err) => {
          this.showspinner.setSpinnerForLogin(false);
          this.snakBar.open("Error", err, {
            duration: 4000,
          });
        }
      );
  }
  //---------------------------End Last History---------------------------------------------------------
  //---------------------------SHARED---------------------------------------------------------
  //Update Quantity Of Lube and Spare
  updateQuantity(qunatity, partnumber, addedQuantity, mode, addorminus) {
    var oldQunatity;
    var idofpart;
    this.general
      .getJobSpareLubeData(this.userworkshopid, mode, partnumber)
      .subscribe(
        (quantityData) => {
          if (mode == "spare") {
            oldQunatity = quantityData.sparedata[0].current_quantity;
            idofpart = quantityData.sparedata[0].id;
          } else {
            oldQunatity = quantityData.lubedata[0].current_quantity;
            idofpart = quantityData.lubedata[0].id;
          }
          if (this.jobcardEditOrCreate == "edit") {
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
            if (this.jobcardEditOrCreate == "edit") {
              var addedupdateQinatity =
                parseFloat(oldQunatity) + parseFloat(oldquantity);
              var updatedQuantity =
                addedupdateQinatity - parseFloat(addedQuantity);
            } else {
              var updatedQuantity =
              parseFloat(oldQunatity) - parseFloat(addedQuantity);
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
            if (this.jobcardEditOrCreate == "edit") {
              var updatedQuantity =
                parseFloat(oldQunatity) + parseFloat(addedQuantity);
            } else {
              var updatedQuantity = parseFloat(oldQunatity);
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
  //Validation for search
  checkSearch(valueofsearch) {
    if (valueofsearch == "") {
      this.value = undefined;
    } else {
      this.value = valueofsearch;
    }
  }
  //Get Customer Voice Data
  getCustomerVoiceData() {
    this.general.getCustomerVoice(this.userworkshopid).subscribe(
      (Customervoicework) => {
        if (Customervoicework["success"] == true) {
          for (var i = 0; i < Customervoicework["mastervoice"].length; i++) {
            this.customervoicedata.push({
              voice: Customervoicework["mastervoice"][i],
              selected: false,
            });
          }
          if (this.jobcardEditOrCreate == "edit") {
            this.customervoicedata.map((customerVoice) => {
              if (
                JSON.parse(
                  this.jobcardArrayForEdit.jobcard_customer_voice
                ).includes(customerVoice.voice)
              ) {
                customerVoice.selected = true;
              }
            });
          }
        }
        this.getHistoryDates();
      },
      (err) => {
        this.snakBar.open("Error", ErrorMessgae[0][err], {
          duration: 4000,
        });
      }
    );
  }
  // Get Staff List
  getStaff() {
    this.general.getStaffList(this.userworkshopid).subscribe(
      (staffList) => {
        this.showspinner.setSpinnerForLogin(true);
        this.selectedItemOfStaff = Array();
        this.satffmasterarr.push(this.userService.getData()["name"]);

        if (staffList.success == true) {
          this.supervisorList = Array();
          this.allStaffList = staffList.staff;

          let sup_list = staffList.staff.filter(
            (staff) => staff.type == "Supervisor"
          );

          sup_list.map((data) => {
            this.supervisorList.push(
              data.name.charAt(0).toUpperCase() + data.name.slice(1)
            );
          });

          // setting the value in the assign mechanic field
          // during update jobcard
          if (this.jobcardEditOrCreate == "edit") {
            // let mechanics =JSON.parse(this.jobcardArrayForEdit["jobcard_mechanic"])
            this.jobcardStaff = JSON.parse(
              this.jobcardArrayForEdit["jobcard_mechanic"]
            );

            this.selectedStaffId.push(this.jobcardSettingData.default_mechanic);
            // console.log("this.jobcardstaff", .jobcardStaff);
          }

          // setting the value in the assign mechanic field
          // during creation set the value as mentioned in the
          // jobcard setting default mechanic

          if (this.jobcardEditOrCreate == "create") {
            this.jobcardStaff.push(this.jobcardSettingData.default_mechanic);
            this.selectedStaffId.push(this.jobcardSettingData.default_mechanic);
          }

          if (this.staffListtabel.length == 0) {
            staffList.staff.map((data) => {
              this.staffListtabel.push(
                data.name.charAt(0).toUpperCase() + data.name.slice(1)
              );
            });
            this.staffListtabel.sort();
          } else {
            staffList.staff.map((data) => {
              if (
                !this.staffListtabel.includes(
                  data.name.charAt(0).toUpperCase() + data.name.slice(1)
                )
              ) {
                this.staffListtabel.push(
                  data.name.charAt(0).toUpperCase() + data.name.slice(1)
                );
              }
            });
            this.staffListtabel.sort();
          }
          if (this.staffarr.length != 0) {
            this.staffListtabel.map((datanew) => {
              if (
                this.staffarr.includes(
                  datanew.charAt(0).toUpperCase() + datanew.slice(1)
                )
              ) {
                this.selectedItemOfStaff.push(
                  datanew.charAt(0).toUpperCase() + datanew.slice(1)
                );
              }
            });
          } else {
            this.selectedItemOfStaff.push(this.staffListtabel[0]);
          }
        } else {
          this.showspinner.setSpinnerForLogin(false);
          this.staffListtabel = this.satffmasterarr;
          this.staffListtabel.sort();
          if (this.jobcardEditOrCreate == "create") {
            this.selectedItemOfStaff = this.satffmasterarr;
          }
        }

        this.showspinner.setSpinnerForLogin(false);
      },
      (err) => {
        this.showspinner.setSpinnerForLogin(false);
      }
    );
    this.dropdownSettings = {
      singleSelection: false,
      idField: "mobile_no_1",
      textField: "name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 6,
      allowSearchFilter: this.allowSearchFilter,
    };
    this.getallData("job");
  }
  //Create New Customer Voice
  addCutsomerVoice(customervlaue) {
    if (customervlaue == undefined) {
      this.placeholder = "Please enter Customer Voice";
      this.borderColor = "red";
    } else {
      this.borderColor = "";
      this.general
        .AddCustomerVoice(this.userworkshopid, customervlaue)
        .subscribe(
          (saveVoice) => {
            this.showspinner.setSpinnerForLogin(true);
            if (saveVoice["success"] == true) {
              var key = { voice: customervlaue, selected: true };
              this.customervoicedata.splice(0, 0, key);
              this.showspinner.setSpinnerForLogin(false);
              this.showInput = false;
              this.snakBar.open("Customer Voice Added", "", {
                duration: 4000,
              });
            } else {
              this.snakBar.open(
                "Message",
                ErrorMessgae[0][saveVoice["message"]],
                {
                  duration: 4000,
                }
              );
            }
          },
          (err) => {
            this.showspinner.setSpinnerForLogin(false);
            this.snakBar.open("Error", ErrorMessgae[0][err], {
              duration: 4000,
            });
          }
        );
    }
  }
  // Save and store into array
  SaveCustomerVoice() {
    this.SelectedVoice = this.customervoicedata
      .filter((x) => x.selected)
      .map((x) => x.voice);
    if (this.SelectedVoice.length != 0) {
      this.showSelectedVoice = true;
    } else {
      this.showSelectedVoice = false;
    }
  }
  //check the customer voice
  checkcustomervoice(data, index) {
    if (this.customervoicedata[index].selected == false) {
      this.customervoicedata[index].selected = true;
    } else {
      this.customervoicedata[index].selected = false;
    }
  }
  //Close the popup
  closePopup() {
    var sendArray = Array();
    sendArray.push({
      status: false,
    });
    this.dialogRef.close(sendArray);
  }
  // Search for vechile
  selectedResultForVechile(event) {
    if (event != undefined) {
      this.selectedVehicleCheck = true;
      var splitedevent = event.split("  ");
      this.mainVehiclearr.map((selecteData) => {
        if (
          splitedevent[0] == selecteData.make &&
          splitedevent[1] == selecteData.model &&
          splitedevent[2] == selecteData.variant
        ) {
          this.dupSelectedDataarrOfVehicle = selecteData;
          this.dupVehicleType = selecteData.type;
          // this.SelectedDataarrOfVehicle = selecteData;
          // this.CreateCustomerForm.controls["twowheetertype"].setValue(
          //   selecteData.type,
          //   { onlySelf: true }
          // );
          // this.CreateCustomerForm.value.twowheetertype = selecteData.type;
        }
        // this.CreateCustomerForm.controls["searchVehicle"].setValue("", {
        //   onlySelf: true,
        // });
      });
    }
  }
  //serach for vehciles
  searchBarForVechile(event) {
    this.selectedVehicleCheck = false;
    this.general
      .searchMakeModel(event, this.userService.getData()["workshop_type"])
      .subscribe(
        (searchData) => {
          this.showspinner.setSpinnerForLogin(true);
          if (searchData["success"] == true) {
            this.searchVehicleData = [];
            this.mainVehiclearr = [];

            searchData["vhicledetails"].map((data) => {
              this.searchVehicleData.push(
                data["make"] + "  " + data["model"] + "  " + data["variant"]
              );
              this.mainVehiclearr.push(data);
            });
            this.showspinner.setSpinnerForLogin(false);
          } else {
            this.searchVehicleData = [];
            this.searchVehicleData.push("No Vehicle Found");
            this.mainVehiclearr = [];
            this.showspinner.setSpinnerForLogin(false);
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
          this.showspinner.setSpinnerForLogin(false);
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
        this.CreateJobForm.controls["searchspareVehicle"].setValue("", {
          onlySelf: true,
        });
        this.CreateLubeForm.controls["searchspareVehicle"].setValue("", {
          onlySelf: true,
        });
      });
    }
  }
  //search for veicles
  searchBarForVechilespl(event) {
    this.general
      .searchMakeModel(event, this.userService.getData()["workshop_type"])
      .subscribe(
        (searchData) => {
          this.showspinner.setSpinnerForLogin(true);
          if (searchData["success"] == true) {
            this.searchVehicleDataSpl = [];
            this.mainVehiclearrspl = [];

            searchData["vhicledetails"].map((data) => {
              this.searchVehicleDataSpl.push(
                data["make"] + "  " + data["model"] + "  " + data["variant"]
              );
              this.mainVehiclearrspl.push(data);
            });
            this.showspinner.setSpinnerForLogin(false);
          } else {
            this.searchVehicleDataSpl = [];
            this.searchVehicleDataSpl.push("No Vehicle Found");
            this.mainVehiclearrspl = [];
            this.showspinner.setSpinnerForLogin(false);
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
          this.showspinner.setSpinnerForLogin(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  //select all vehciles
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
  //print Download OR share the invoice or estimate
  print() {
    var sendArray = Array();
    sendArray.push({
      status: true,
      settings: this.allBillingData,
      jobcard_number: this.jobcardArrayForEdit.jobcard_number,
      statusjobcard: this.jobcardArrayForEdit.jobcard_status,
      smsalert: this.jobcardArrayForEdit.sms_alert,
      cutsomeremial: this.CreateCustomerForm.getRawValue().email,
      cutsomerphone: this.CreateCustomerForm.getRawValue().mobileTwoNo,
    });
    this.sendPDF.printPDF(sendArray);
  }
  //share on whatsapp
  sharewhatsApp() {
    var WorkshopData = JSON.parse(localStorage.getItem("user"));
    this.workshopName = WorkshopData.workshop_name;
    this.phoneNumber = WorkshopData.workshop_mobile_number_1;
    if (WorkshopData.workshop_mobile_number_2 != 0) {
      this.phoneNumber =
        WorkshopData.workshop_mobile_number_1 +
        " / " +
        WorkshopData.workshop_mobile_number_2;
    }
    var whatsappMessage;
    var inventorydata = "";
    var count = 0;
    if (this.lubedatatabel.length != 0) {
      this.lubedatatabel.map((data, index) => {
        var newdata = "";
        count = index + 1;
        newdata = "\r\n" + count + " " + data.part_name + " ₹" + data.amount;
        if (newdata != undefined) {
          inventorydata += newdata;
        }
      });
    }
    if (this.sparedatatabel.length != 0) {
      this.sparedatatabel.map((data, index) => {
        var newdata = "";
        if (index == 0) {
          count = count + index + 1;
        } else {
          count = count + 1;
        }
        newdata = "\r\n" + count + " " + data.part_name + " ₹" + data.amount;
        if (newdata != undefined) {
          inventorydata += newdata;
        }
      });
    }
    if (this.jobdatatabel.length != 0) {
      this.jobdatatabel.map((data, index) => {
        var newdata = "";
        if (index == 0) {
          count = count + index + 1;
        } else {
          count = count + 1;
        }
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
      "Your invoice details for " +
      this.SelectedDataarrOfVehicle.make +
      " " +
      this.SelectedDataarrOfVehicle.model +
      " " +
      this.SelectedDataarrOfVehicle.variant +
      " " +
      this.jobcardArrayForEdit.vehicle_number +
      "\r\n" +
      inventorydata +
      "\r\n" +
      "Bill Amount  : ₹  " +
      this.jobcardArrayForEdit.final_amount +
      "/-" +
      "\r\n" +
      "Labour Charges  : ₹  " +
      this.JobTotal +
      "/-" +
      "\r\n" +
      "Sparepart amount  : ₹  " +
      this.SpareTotal +
      "/-" +
      "\r\n" +
      "Lubes Amount  : ₹  " +
      this.LubeTotal +
      "/-" +
      "\r\n" +
      "Discount  : " +
      this.jobcardArrayForEdit.discount +
      "/-" +
      "\r\n" +
      "Balance  : ₹  " +
      this.jobcardArrayForEdit.balance_amount +
      "/-" +
      "\r\n" +
      "Visit Again." +
      "\r\n" +
      this.urlgetforonlineclose;
    // var whatsappMessage= "Hello!"+"\r\n\r\n"+"I found your garage online and I have a few questions regarding online services. Are you free to chat now?"
    whatsappMessage = encodeURIComponent(whatsappMessage);
    // this.contactlink =
    //   "https://wa.me/+91" +
    //   this.customerProfileMobile +
    //   "?text=" +
    //   whatsappMessage;
    this.contactlink = "https://web.whatsapp.com/send?phone=91"+
      this.customerProfileMobile+"&text=" + whatsappMessage;
  }
  //share on email
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

    this.dialogservice.OpenEmailSend(useremail).subscribe((email) => {
      if (email != "noemail") {
        var sendArray = Array();
        sendArray.push({
          status: true,
          settings: this.allBillingData,
          jobcard_number: this.jobcardArrayForEdit.jobcard_number,
          statusjobcard: this.jobcardArrayForEdit.jobcard_status,
          smsalert: this.jobcardArrayForEdit.sms_alert,
          cutsomeremial: email,
          cutsomerphone: this.CreateCustomerForm.getRawValue().mobileTwoNo,
        });
        this.sendPDF.emailPdfForCreate(sendArray);
      } else {
        this.snakBar.open("Message", "Please enter the Valid Email", {
          duration: 4000,
        });
      }
    });
  }
  //pdf downlaod or print
  pdf() {
    var sendArray = Array();
    sendArray.push({
      status: true,
      settings: this.allBillingData,
      jobcard_number: this.jobcardArrayForEdit.jobcard_number,
      statusjobcard: this.jobcardArrayForEdit.jobcard_status,
      smsalert: this.jobcardArrayForEdit.sms_alert,
      cutsomeremial: this.CreateCustomerForm.getRawValue().email,
      cutsomerphone: this.CreateCustomerForm.getRawValue().mobileTwoNo,
    });
    this.sendPDF.downloadPdf(sendArray);
  }
  //---------------------------End Shared---------------------------------------------------------

  //---------------------------Satff-------------------------------------------------------------------
  // Create Staff Validation
  createStaff(inventorytype, data, index) {
    this.inventorytypeinven = inventorytype;
    this.dataofinventory = data;
    this.indecofinevntory = index;
    const currentStaff = new Date();
    this.staffstartDate = {
      year: currentStaff.getFullYear(),
      month: currentStaff.getMonth() + 1,
      day: currentStaff.getDate(),
    };
    this.satffForm = this.formbuild.group({
      name: ["", Validators.required],
      mobile1: ["", [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      mobile2: ["", Validators.pattern(/^[6-9]\d{9}$/)],
      email: ["", Validators.email],
      stafftype: ["Mechanic"],
      joindate: [this.staffstartDate],
      salary: [0, Validators.pattern(this.regex)],
      incentive: ["0", Validators.pattern(this.regex)],
    });
  }
  //Create Staff API
  addstaff(mode, vesion) {
    var mobile;
    var address = "";
    var datejoin =
      this.satffForm.getRawValue().joindate["year"] +
      "-" +
      this.satffForm.getRawValue().joindate["month"] +
      "-" +
      this.satffForm.getRawValue().joindate["day"] +
      " " +
      "00:00:00";
    if (this.satffForm.getRawValue().mobile2 == "") {
      mobile = 0;
    } else {
      mobile = this.satffForm.getRawValue().mobile2;
    }
    this.general
      .CreateNewStaff(
        this.userworkshopid,
        mode,
        this.satffForm.getRawValue().stafftype,
        this.satffForm.getRawValue().name,
        this.satffForm.getRawValue().mobile1,
        mobile,
        datejoin,
        this.satffForm.getRawValue().email,
        address,
        this.satffForm.getRawValue().salary,
        this.satffForm.getRawValue().incentive
      )
      .subscribe(
        (createdStaff) => {
          this.showspinner.setSpinnerForLogin(true);
          this.snakBar.open(
            "Message",
            ErrorMessgae[0][createdStaff["message"]],
            {
              duration: 4000,
            }
          );
          this.staffListtabel.push(
            createdStaff.staff.name.charAt(0).toUpperCase() +
              createdStaff.staff.name.slice(1)
          );
          this.staffListtabel.sort();
          if (this.inventorytypeinven == "none") {
            this.selectedItemOfStaff.push(
              createdStaff.staff.name.charAt(0).toUpperCase() +
                createdStaff.staff.name.slice(1)
            );
          } else {
            if (this.inventorytypeinven == "spare") {
              this.sparedatatabel[this.indecofinevntory][
                "spareassignedmechanic"
              ].push(
                createdStaff.staff.name.charAt(0).toUpperCase() +
                  createdStaff.staff.name.slice(1)
              );
              this.dataofinventory = this.sparedatatabel[this.indecofinevntory];
            } else if (this.inventorytypeinven == "lube") {
              this.lubedatatabel[this.indecofinevntory][
                "lubeassignedmechanic"
              ].push(
                createdStaff.staff.name.charAt(0).toUpperCase() +
                  createdStaff.staff.name.slice(1)
              );
              this.dataofinventory = this.lubedatatabel[this.indecofinevntory];
            } else if (this.inventorytypeinven == "job") {
              this.jobdatatabel[this.indecofinevntory][
                "jobassignedmechanic"
              ].push(
                createdStaff.staff.name.charAt(0).toUpperCase() +
                  createdStaff.staff.name.slice(1)
              );
              this.dataofinventory = this.jobdatatabel[this.indecofinevntory];
            }
          }
          if (createdStaff["success"] == true) {
            if (vesion == "new") {
              this.createStaff(
                this.inventorytypeinven,
                this.dataofinventory,
                this.indecofinevntory
              );
            }
          }
          this.showspinner.setSpinnerForLogin(false);
        },
        (err) => {
          this.showspinner.setSpinnerForLogin(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  //---------------------------Satff-------------------------------------------------------------------
  //load more data fo jobs
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
                  this.searchJobDatasec = [];
                  for (var i = 0; i < JobSearchData.jobdata.length; i++) {
                    var vehdata = [];
                    vehdata = JSON.parse(JobSearchData.jobdata[i].vechile_details);
                    if (vehdata.length == undefined) {
                      if (vehdata["make"] == "All") {
                        if (
                          !this.jobduplicate.includes(
                            JobSearchData.jobdata[i].part_number
                          )
                        ) {
                          if (JobSearchData.jobdata[i].unit_sale_price != "") {
                            this.jobduplicate.push(
                              JobSearchData.jobdata[i].part_number
                            );
                            this.searchJobDatasec.push(
                              JobSearchData.jobdata[i].part_name +
                                " (Part No:-" +
                                JobSearchData.jobdata[i].part_number +
                                ")----Rs." +
                                JobSearchData.jobdata[i].unit_sale_price +
                                "/-"
                            );
                          } else {
                            this.jobduplicate.push(
                              JobSearchData.jobdata[i].part_number
                            );
                            this.searchJobDatasec.push(
                              JobSearchData.jobdata[i].part_name +
                                " (Part No:-" +
                                JobSearchData.jobdata[i].part_number +
                                ")"
                            );
                          }
                        }
                      } else {
                        if (vehdata["make"] == this.SelectedDataarrOfVehicle.make) {
                          if (vehdata["model"] == "All") {
                            if (
                              !this.jobduplicate.includes(
                                JobSearchData.jobdata[i].part_number
                              )
                            ) {
                              if (JobSearchData.jobdata[i].unit_sale_price != "") {
                                this.jobduplicate.push(
                                  JobSearchData.jobdata[i].part_number
                                );
                                this.searchJobDatasec.push(
                                  JobSearchData.jobdata[i].part_name +
                                    " (Part No:-" +
                                    JobSearchData.jobdata[i].part_number +
                                    ")----Rs." +
                                    JobSearchData.jobdata[i].unit_sale_price +
                                    "/-"
                                );
                              } else {
                                this.jobduplicate.push(
                                  JobSearchData.jobdata[i].part_number
                                );
                                this.searchJobDatasec.push(
                                  JobSearchData.jobdata[i].part_name +
                                    " (Part No:-" +
                                    JobSearchData.jobdata[i].part_number +
                                    ")"
                                );
                              }
                            }
                          } else {
                            if (
                              vehdata["model"] == this.SelectedDataarrOfVehicle.model
                            ) {
                              if (vehdata["variant"] == "All") {
                                if (
                                  !this.jobduplicate.includes(
                                    JobSearchData.jobdata[i].part_number
                                  )
                                ) {
                                  if (
                                    JobSearchData.jobdata[i].unit_sale_price != ""
                                  ) {
                                    this.jobduplicate.push(
                                      JobSearchData.jobdata[i].part_number
                                    );
                                    this.searchJobDatasec.push(
                                      JobSearchData.jobdata[i].part_name +
                                        " (Part No:-" +
                                        JobSearchData.jobdata[i].part_number +
                                        ")----Rs." +
                                        JobSearchData.jobdata[i].unit_sale_price +
                                        "/-"
                                    );
                                  } else {
                                    this.jobduplicate.push(
                                      JobSearchData.jobdata[i].part_number
                                    );
                                    this.searchJobDatasec.push(
                                      JobSearchData.jobdata[i].part_name +
                                        " (Part No:-" +
                                        JobSearchData.jobdata[i].part_number +
                                        ")"
                                    );
                                  }
                                }
                              } else {
                                if (
                                  vehdata["variant"] ==
                                  this.SelectedDataarrOfVehicle.variant
                                ) {
                                  if (
                                    !this.jobduplicate.includes(
                                      JobSearchData.jobdata[i].part_number
                                    )
                                  ) {
                                    if (
                                      JobSearchData.jobdata[i].unit_sale_price != ""
                                    ) {
                                      this.jobduplicate.push(
                                        JobSearchData.jobdata[i].part_number
                                      );
                                      this.searchJobDatasec.push(
                                        JobSearchData.jobdata[i].part_name +
                                          " (Part No:-" +
                                          JobSearchData.jobdata[i].part_number +
                                          ")----Rs." +
                                          JobSearchData.jobdata[i].unit_sale_price +
                                          "/-"
                                      );
                                    } else {
                                      this.jobduplicate.push(
                                        JobSearchData.jobdata[i].part_number
                                      );
                                      this.searchJobDatasec.push(
                                        JobSearchData.jobdata[i].part_name +
                                          " (Part No:-" +
                                          JobSearchData.jobdata[i].part_number +
                                          ")"
                                      );
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    } else {
                      vehdata.filter((dataveh) => {
                        if(dataveh == null){
                         
                          this.showspinner.setSpinnerForLogin(false);
                        }else{
                          if (dataveh.make == "All") {
                            if (
                              !this.jobduplicate.includes(
                                JobSearchData.jobdata[i].part_number
                              )
                            ) {
                              if (JobSearchData.jobdata[i].unit_sale_price != "") {
                                this.jobduplicate.push(
                                  JobSearchData.jobdata[i].part_number
                                );
                                this.searchJobDatasec.push(
                                  JobSearchData.jobdata[i].part_name +
                                    " (Part No:-" +
                                    JobSearchData.jobdata[i].part_number +
                                    ")----Rs." +
                                    JobSearchData.jobdata[i].unit_sale_price +
                                    "/-"
                                );
                              } else {
                                this.jobduplicate.push(
                                  JobSearchData.jobdata[i].part_number
                                );
                                this.searchJobDatasec.push(
                                  JobSearchData.jobdata[i].part_name +
                                    " (Part No:-" +
                                    JobSearchData.jobdata[i].part_number +
                                    ")"
                                );
                              }
                            }
                          } else {
                            if (dataveh.make == this.SelectedDataarrOfVehicle.make) {
                              if (dataveh.model == "All-model") {
                                if (
                                  !this.jobduplicate.includes(
                                    JobSearchData.jobdata[i].part_number
                                  )
                                ) {
                                  if (JobSearchData.jobdata[i].unit_sale_price != "") {
                                    this.jobduplicate.push(
                                      JobSearchData.jobdata[i].part_number
                                    );
                                    this.searchJobDatasec.push(
                                      JobSearchData.jobdata[i].part_name +
                                        " (Part No:-" +
                                        JobSearchData.jobdata[i].part_number +
                                        ")----Rs." +
                                        JobSearchData.jobdata[i].unit_sale_price +
                                        "/-"
                                    );
                                  } else {
                                    this.jobduplicate.push(
                                      JobSearchData.jobdata[i].part_number
                                    );
                                    this.searchJobDatasec.push(
                                      JobSearchData.jobdata[i].part_name +
                                        " (Part No:-" +
                                        JobSearchData.jobdata[i].part_number +
                                        ")"
                                    );
                                  }
                                }
                              } else {
                                if (
                                  dataveh.model == this.SelectedDataarrOfVehicle.model
                                ) {
                                  if (dataveh.variant == "All-variant") {
                                    if (
                                      !this.jobduplicate.includes(
                                        JobSearchData.jobdata[i].part_number
                                      )
                                    ) {
                                      if (
                                        JobSearchData.jobdata[i].unit_sale_price != ""
                                      ) {
                                        this.jobduplicate.push(
                                          JobSearchData.jobdata[i].part_number
                                        );
                                        this.searchJobDatasec.push(
                                          JobSearchData.jobdata[i].part_name +
                                            " (Part No:-" +
                                            JobSearchData.jobdata[i].part_number +
                                            ")----Rs." +
                                            JobSearchData.jobdata[i].unit_sale_price +
                                            "/-"
                                        );
                                      } else {
                                        this.jobduplicate.push(
                                          JobSearchData.jobdata[i].part_number
                                        );
                                        this.searchJobDatasec.push(
                                          JobSearchData.jobdata[i].part_name +
                                            " (Part No:-" +
                                            JobSearchData.jobdata[i].part_number +
                                            ")"
                                        );
                                      }
                                    }
                                  } else {
                                    if (
                                      dataveh.variant ==
                                      this.SelectedDataarrOfVehicle.variant
                                    ) {
                                      if (
                                        !this.jobduplicate.includes(
                                          JobSearchData.jobdata[i].part_number
                                        )
                                      ) {
                                        if (
                                          JobSearchData.jobdata[i].unit_sale_price != ""
                                        ) {
                                          this.jobduplicate.push(
                                            JobSearchData.jobdata[i].part_number
                                          );
                                          this.searchJobDatasec.push(
                                            JobSearchData.jobdata[i].part_name +
                                              " (Part No:-" +
                                              JobSearchData.jobdata[i].part_number +
                                              ")----Rs." +
                                              JobSearchData.jobdata[i].unit_sale_price +
                                              "/-"
                                          );
                                        } else {
                                          this.jobduplicate.push(
                                            JobSearchData.jobdata[i].part_number
                                          );
                                          this.searchJobDatasec.push(
                                            JobSearchData.jobdata[i].part_name +
                                              " (Part No:-" +
                                              JobSearchData.jobdata[i].part_number +
                                              ")"
                                          );
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      });
                    }
                  }
                  this.searchJobData = [...this.searchJobData, ...this.searchJobDatasec];
                  
                  // setTimeout(
                  //   () => (this.searchJobData = this.searchJobDatapaginate),
                  //   10
                  // );
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
  //load more data fo spare
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
                  // this.searchSpareDatapagi = this.searchSpareData;
                  this.searchSpareDatasec = []
                  for (var i = 0; i < SpareSearchData.sparedata.length; i++) {
              var vehdata = [];
              vehdata = JSON.parse(
                SpareSearchData.sparedata[i].vechile_details
              );
              if (vehdata.length == undefined) {
                if (vehdata["make"] == "All"
                ) {
                  if (
                    !this.spareduplicate.includes(
                      SpareSearchData.sparedata[i].part_number
                    )
                  ) {
                    if (SpareSearchData.sparedata[i].unit_sale_price != "") {
                      this.spareduplicate.push(
                        SpareSearchData.sparedata[i].part_number
                      );
                      this.searchSpareDatasec.push(
                        SpareSearchData.sparedata[i].part_name +
                          " (Part No:-" +
                          SpareSearchData.sparedata[i].part_number +
                          ")----Rs." +
                          SpareSearchData.sparedata[i].unit_sale_price +
                          "/-"
                      );
                    } else {
                      this.spareduplicate.push(
                        SpareSearchData.sparedata[i].part_number
                      );
                      this.searchSpareDatasec.push(
                        SpareSearchData.sparedata[i].part_name +
                          " (Part No:-" +
                          SpareSearchData.sparedata[i].part_number +
                          ")"
                      );
                    }
                  }
                } else {
                  if (vehdata["make"] == this.SelectedDataarrOfVehicle.make) {
                    if (vehdata["model"] == "All-model"||
                    vehdata["model"] == "All" ||
                    vehdata["model"] == "All model") {
                      if (
                        !this.spareduplicate.includes(
                          SpareSearchData.sparedata[i].part_number
                        )
                      ) {
                        if (
                          SpareSearchData.sparedata[i].unit_sale_price != ""
                        ) {
                          this.spareduplicate.push(
                            SpareSearchData.sparedata[i].part_number
                          );
                          this.searchSpareDatasec.push(
                            SpareSearchData.sparedata[i].part_name +
                              " (Part No:-" +
                              SpareSearchData.sparedata[i].part_number +
                              ")----Rs." +
                              SpareSearchData.sparedata[i].unit_sale_price +
                              "/-"
                          );
                        } else {
                          this.spareduplicate.push(
                            SpareSearchData.sparedata[i].part_number
                          );
                          this.searchSpareDatasec.push(
                            SpareSearchData.sparedata[i].part_name +
                              " (Part No:-" +
                              SpareSearchData.sparedata[i].part_number +
                              ")"
                          );
                        }
                      }
                    } else {
                      if (
                        vehdata["model"] == this.SelectedDataarrOfVehicle.model
                      ) {
                        if (vehdata["variant"] == "All" ||
                        vehdata["variant"] == "All-variant" ) {
                          if (
                            !this.spareduplicate.includes(
                              SpareSearchData.sparedata[i].part_number
                            )
                          ) {
                            if (
                              SpareSearchData.sparedata[i].unit_sale_price != ""
                            ) {
                              this.spareduplicate.push(
                                SpareSearchData.sparedata[i].part_number
                              );
                              this.searchSpareDatasec.push(
                                SpareSearchData.sparedata[i].part_name +
                                  " (Part No:-" +
                                  SpareSearchData.sparedata[i].part_number +
                                  ")----Rs." +
                                  SpareSearchData.sparedata[i].unit_sale_price +
                                  "/-"
                              );
                            } else {
                              this.spareduplicate.push(
                                SpareSearchData.sparedata[i].part_number
                              );
                              this.searchSpareDatasec.push(
                                SpareSearchData.sparedata[i].part_name +
                                  " (Part No:-" +
                                  SpareSearchData.sparedata[i].part_number +
                                  ")"
                              );
                            }
                          }
                        } else {
                          if (
                            vehdata["variant"] ==
                            this.SelectedDataarrOfVehicle.variant
                          ) {
                            if (
                              !this.spareduplicate.includes(
                                SpareSearchData.sparedata[i].part_number
                              )
                            ) {
                              if (
                                SpareSearchData.sparedata[i].unit_sale_price !=
                                ""
                              ) {
                                this.spareduplicate.push(
                                  SpareSearchData.sparedata[i].part_number
                                );
                                this.searchSpareDatasec.push(
                                  SpareSearchData.sparedata[i].part_name +
                                    " (Part No:-" +
                                    SpareSearchData.sparedata[i].part_number +
                                    ")----Rs." +
                                    SpareSearchData.sparedata[i]
                                      .unit_sale_price +
                                    "/-"
                                );
                              } else {
                                this.spareduplicate.push(
                                  SpareSearchData.sparedata[i].part_number
                                );
                                this.searchSpareDatasec.push(
                                  SpareSearchData.sparedata[i].part_name +
                                    " (Part No:-" +
                                    SpareSearchData.sparedata[i].part_number +
                                    ")"
                                );
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                vehdata.filter((dataveh) => {
                  if (dataveh.make == "All") {
                    if (
                      !this.spareduplicate.includes(
                        SpareSearchData.sparedata[i].part_number
                      )
                    ) {
                      if (SpareSearchData.sparedata[i].unit_sale_price != "") {
                        this.spareduplicate.push(
                          SpareSearchData.sparedata[i].part_number
                        );
                        this.searchSpareDatasec.push(
                          SpareSearchData.sparedata[i].part_name +
                            " (Part No:-" +
                            SpareSearchData.sparedata[i].part_number +
                            ")----Rs." +
                            SpareSearchData.sparedata[i].unit_sale_price +
                            "/-"
                        );
                      } else {
                        this.spareduplicate.push(
                          SpareSearchData.sparedata[i].part_number
                        );
                        this.searchSpareDatasec.push(
                          SpareSearchData.sparedata[i].part_name +
                            " (Part No:-" +
                            SpareSearchData.sparedata[i].part_number +
                            ")"
                        );
                      }
                    }
                  } else {
                    if (dataveh.make == this.SelectedDataarrOfVehicle.make) {
                      if (dataveh.model == "All-model" ||
                      dataveh.model == "All" ||
                      dataveh.model == "All model") {
                        if (
                          !this.spareduplicate.includes(
                            SpareSearchData.sparedata[i].part_number
                          )
                        ) {
                          if (
                            SpareSearchData.sparedata[i].unit_sale_price != ""
                          ) {
                            this.spareduplicate.push(
                              SpareSearchData.sparedata[i].part_number
                            );
                            this.searchSpareDatasec.push(
                              SpareSearchData.sparedata[i].part_name +
                                " (Part No:-" +
                                SpareSearchData.sparedata[i].part_number +
                                ")----Rs." +
                                SpareSearchData.sparedata[i].unit_sale_price +
                                "/-"
                            );
                          } else {
                            this.spareduplicate.push(
                              SpareSearchData.sparedata[i].part_number
                            );
                            this.searchSpareDatasec.push(
                              SpareSearchData.sparedata[i].part_name +
                                " (Part No:-" +
                                SpareSearchData.sparedata[i].part_number +
                                ")"
                            );
                          }
                        }
                      } else {
                        if (
                          dataveh.model == this.SelectedDataarrOfVehicle.model
                        ) {
                          if (dataveh.variant == "All-variant" ||
                          dataveh.variant == "All" ||
                          dataveh.variant == "All variant") {
                            if (
                              !this.spareduplicate.includes(
                                SpareSearchData.sparedata[i].part_number
                              )
                            ) {
                              if (
                                SpareSearchData.sparedata[i].unit_sale_price !=
                                ""
                              ) {
                                this.spareduplicate.push(
                                  SpareSearchData.sparedata[i].part_number
                                );
                                this.searchSpareDatasec.push(
                                  SpareSearchData.sparedata[i].part_name +
                                    " (Part No:-" +
                                    SpareSearchData.sparedata[i].part_number +
                                    ")----Rs." +
                                    SpareSearchData.sparedata[i]
                                      .unit_sale_price +
                                    "/-"
                                );
                              } else {
                                this.spareduplicate.push(
                                  SpareSearchData.sparedata[i].part_number
                                );
                                this.searchSpareDatasec.push(
                                  SpareSearchData.sparedata[i].part_name +
                                    " (Part No:-" +
                                    SpareSearchData.sparedata[i].part_number +
                                    ")"
                                );
                              }
                            }
                          } else {
                            if (
                              dataveh.variant ==
                              this.SelectedDataarrOfVehicle.variant
                            ) {
                              if (
                                !this.spareduplicate.includes(
                                  SpareSearchData.sparedata[i].part_number
                                )
                              ) {
                                if (
                                  SpareSearchData.sparedata[i]
                                    .unit_sale_price != ""
                                ) {
                                  this.spareduplicate.push(
                                    SpareSearchData.sparedata[i].part_number
                                  );
                                  this.searchSpareDatasec.push(
                                    SpareSearchData.sparedata[i].part_name +
                                      " (Part No:-" +
                                      SpareSearchData.sparedata[i].part_number +
                                      ")----Rs." +
                                      SpareSearchData.sparedata[i]
                                        .unit_sale_price +
                                      "/-"
                                  );
                                } else {
                                  this.spareduplicate.push(
                                    SpareSearchData.sparedata[i].part_number
                                  );
                                  this.searchSpareDatasec.push(
                                    SpareSearchData.sparedata[i].part_name +
                                      " (Part No:-" +
                                      SpareSearchData.sparedata[i].part_number +
                                      ")"
                                  );
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                });
              }
            }
            this.searchSpareData = [...this.searchSpareData, ...this.searchSpareDatasec];
         
                  // this.searchSpareData = [];
                  // setTimeout(
                  //   () => (this.searchSpareData = this.searchSpareDatapagi),
                  //   100
                  // );
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
  //load more data fo lube
  loadMoreDatalube() {
    if (this.lubenextpage != "none") {
      setTimeout(
        () =>
          this.general.inventorylsjpageination(this.lubenextpage).subscribe(
            (LubeSearchData) => {
              this.showspinner.setSpinnerForLogin(true);
              if (LubeSearchData.success == true) {
                if (LubeSearchData.lubedata != undefined) {
                  if (LubeSearchData["next_page"] != "Nonextpage") {
                    this.lubenextpage = LubeSearchData["next_page"];
                  } else {
                    this.lubenextpage = "none";
                  }
                  // this.searchLubeDatapagi = this.searchLubeData;
                  this.searchLubeDatasec = [];
                  for (var i = 0; i < LubeSearchData.lubedata.length; i++) {
                    this.showspinner.setSpinnerForLogin(true);
                    var vehdata = [];
                    vehdata = JSON.parse(LubeSearchData.lubedata[i].vechile_details);
                    if (vehdata.length == undefined) {
                      if (vehdata["make"] == "All") {
                        if (
                          !this.lubeduplicate.includes(
                            LubeSearchData.lubedata[i].part_number
                          )
                        ) {
                          if (LubeSearchData.lubedata[i].unit_sale_price != "") {
                            this.lubeduplicate.push(
                              LubeSearchData.lubedata[i].part_number
                            );
                            this.searchLubeDatasec.push(
                              LubeSearchData.lubedata[i].part_name +
                                " (Part No:-" +
                                LubeSearchData.lubedata[i].part_number +
                                ")----Rs." +
                                LubeSearchData.lubedata[i].unit_sale_price +
                                "/-"
                            );
                          } else {
                            this.lubeduplicate.push(
                              LubeSearchData.lubedata[i].part_number
                            );
                            this.searchLubeDatasec.push(
                              LubeSearchData.lubedata[i].part_name +
                                " (Part No:-" +
                                LubeSearchData.lubedata[i].part_number +
                                ")"
                            );
                          }
                        }
                      } else {
                        if (vehdata["make"] == this.SelectedDataarrOfVehicle.make) {
                          if (vehdata["model"] == "All-model"||
                          vehdata["model"] == "All" ||
                          vehdata["model"] == "All model") {
                            if (
                              !this.lubeduplicate.includes(
                                LubeSearchData.lubedata[i].part_number
                              )
                            ) {
                              if (LubeSearchData.lubedata[i].unit_sale_price != "") {
                                this.lubeduplicate.push(
                                  LubeSearchData.lubedata[i].part_number
                                );
                                this.searchLubeDatasec.push(
                                  LubeSearchData.lubedata[i].part_name +
                                    " (Part No:-" +
                                    LubeSearchData.lubedata[i].part_number +
                                    ")----Rs." +
                                    LubeSearchData.lubedata[i].unit_sale_price +
                                    "/-"
                                );
                              } else {
                                this.lubeduplicate.push(
                                  LubeSearchData.lubedata[i].part_number
                                );
                                this.searchLubeDatasec.push(
                                  LubeSearchData.lubedata[i].part_name +
                                    " (Part No:-" +
                                    LubeSearchData.lubedata[i].part_number +
                                    ")"
                                );
                              }
                            }
                          } else {
                            if (
                              vehdata["model"] == this.SelectedDataarrOfVehicle.model
                            ) {
                              if (vehdata["variant"] == "All-variant" ||
                              vehdata["variant"] == "All" ||
                              vehdata["variant"] == "All variant") {
                                if (
                                  !this.lubeduplicate.includes(
                                    LubeSearchData.lubedata[i].part_number
                                  )
                                ) {
                                  if (
                                    LubeSearchData.lubedata[i].unit_sale_price != ""
                                  ) {
                                    this.lubeduplicate.push(
                                      LubeSearchData.lubedata[i].part_number
                                    );
                                    this.searchLubeDatasec.push(
                                      LubeSearchData.lubedata[i].part_name +
                                        " (Part No:-" +
                                        LubeSearchData.lubedata[i].part_number +
                                        ")----Rs." +
                                        LubeSearchData.lubedata[i].unit_sale_price +
                                        "/-"
                                    );
                                  } else {
                                    this.lubeduplicate.push(
                                      LubeSearchData.lubedata[i].part_number
                                    );
                                    this.searchLubeDatasec.push(
                                      LubeSearchData.lubedata[i].part_name +
                                        " (Part No:-" +
                                        LubeSearchData.lubedata[i].part_number +
                                        ")"
                                    );
                                  }
                                }
                              } else {
                                if (
                                  vehdata["variant"] ==
                                  this.SelectedDataarrOfVehicle.variant
                                ) {
                                  if (
                                    !this.lubeduplicate.includes(
                                      LubeSearchData.lubedata[i].part_number
                                    )
                                  ) {
                                    if (
                                      LubeSearchData.lubedata[i].unit_sale_price != ""
                                    ) {
                                      this.lubeduplicate.push(
                                        LubeSearchData.lubedata[i].part_number
                                      );
                                      this.searchLubeDatasec.push(
                                        LubeSearchData.lubedata[i].part_name +
                                          " (Part No:-" +
                                          LubeSearchData.lubedata[i].part_number +
                                          ")----Rs." +
                                          LubeSearchData.lubedata[i].unit_sale_price +
                                          "/-"
                                      );
                                    } else {
                                      this.lubeduplicate.push(
                                        LubeSearchData.lubedata[i].part_number
                                      );
                                      this.searchLubeDatasec.push(
                                        LubeSearchData.lubedata[i].part_name +
                                          " (Part No:-" +
                                          LubeSearchData.lubedata[i].part_number +
                                          ")"
                                      );
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    } else {
                      vehdata.filter((dataveh) => {
                        if (dataveh.make == "All") {
                          if (
                            !this.lubeduplicate.includes(
                              LubeSearchData.lubedata[i].part_number
                            )
                          ) {
                            if (LubeSearchData.lubedata[i].unit_sale_price != "") {
                              this.lubeduplicate.push(
                                LubeSearchData.lubedata[i].part_number
                              );
                              this.searchLubeDatasec.push(
                                LubeSearchData.lubedata[i].part_name +
                                  " (Part No:-" +
                                  LubeSearchData.lubedata[i].part_number +
                                  ")----Rs." +
                                  LubeSearchData.lubedata[i].unit_sale_price +
                                  "/-"
                              );
                            } else {
                              this.lubeduplicate.push(
                                LubeSearchData.lubedata[i].part_number
                              );
                              this.searchLubeDatasec.push(
                                LubeSearchData.lubedata[i].part_name +
                                  " (Part No:-" +
                                  LubeSearchData.lubedata[i].part_number +
                                  ")"
                              );
                            }
                          }
                        } else {
                          if (dataveh.make == this.SelectedDataarrOfVehicle.make) {
                            if (dataveh.model == "All-model"||
                            dataveh.model == "All" ||
                            dataveh.model == "All model") {
                              if (
                                !this.lubeduplicate.includes(
                                  LubeSearchData.lubedata[i].part_number
                                )
                              ) {
                                if (
                                  LubeSearchData.lubedata[i].unit_sale_price != ""
                                ) {
                                  this.lubeduplicate.push(
                                    LubeSearchData.lubedata[i].part_number
                                  );
                                  this.searchLubeDatasec.push(
                                    LubeSearchData.lubedata[i].part_name +
                                      " (Part No:-" +
                                      LubeSearchData.lubedata[i].part_number +
                                      ")----Rs." +
                                      LubeSearchData.lubedata[i].unit_sale_price +
                                      "/-"
                                  );
                                } else {
                                  this.lubeduplicate.push(
                                    LubeSearchData.lubedata[i].part_number
                                  );
                                  this.searchLubeDatasec.push(
                                    LubeSearchData.lubedata[i].part_name +
                                      " (Part No:-" +
                                      LubeSearchData.lubedata[i].part_number +
                                      ")"
                                  );
                                }
                              }
                            } else {
                              if (
                                dataveh.model == this.SelectedDataarrOfVehicle.model
                              ) {
                                if (dataveh.variant == "All-variant" ||
                                dataveh.variant == "All" ||
                                dataveh.variant == "All variant") {
                                  if (
                                    !this.lubeduplicate.includes(
                                      LubeSearchData.lubedata[i].part_number
                                    )
                                  ) {
                                    if (
                                      LubeSearchData.lubedata[i].unit_sale_price != ""
                                    ) {
                                      this.lubeduplicate.push(
                                        LubeSearchData.lubedata[i].part_number
                                      );
                                      this.searchLubeDatasec.push(
                                        LubeSearchData.lubedata[i].part_name +
                                          " (Part No:-" +
                                          LubeSearchData.lubedata[i].part_number +
                                          ")----Rs." +
                                          LubeSearchData.lubedata[i].unit_sale_price +
                                          "/-"
                                      );
                                    } else {
                                      this.lubeduplicate.push(
                                        LubeSearchData.lubedata[i].part_number
                                      );
                                      this.searchLubeDatasec.push(
                                        LubeSearchData.lubedata[i].part_name +
                                          " (Part No:-" +
                                          LubeSearchData.lubedata[i].part_number +
                                          ")"
                                      );
                                    }
                                  }
                                } else {
                                  if (
                                    dataveh.variant ==
                                    this.SelectedDataarrOfVehicle.variant
                                  ) {
                                    if (
                                      !this.lubeduplicate.includes(
                                        LubeSearchData.lubedata[i].part_number
                                      )
                                    ) {
                                      if (
                                        LubeSearchData.lubedata[i].unit_sale_price !=
                                        ""
                                      ) {
                                        this.lubeduplicate.push(
                                          LubeSearchData.lubedata[i].part_number
                                        );
                                        this.searchLubeDatasec.push(
                                          LubeSearchData.lubedata[i].part_name +
                                            " (Part No:-" +
                                            LubeSearchData.lubedata[i].part_number +
                                            ")----Rs." +
                                            LubeSearchData.lubedata[i]
                                              .unit_sale_price +
                                            "/-"
                                        );
                                      } else {
                                        this.lubeduplicate.push(
                                          LubeSearchData.lubedata[i].part_number
                                        );
                                        this.searchLubeDatasec.push(
                                          LubeSearchData.lubedata[i].part_name +
                                            " (Part No:-" +
                                            LubeSearchData.lubedata[i].part_number +
                                            ")"
                                        );
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      });
                    }
                  }
                  this.searchLubeData =[...this.searchLubeData, ...this.searchLubeDatasec];
                  // setTimeout(
                  //   () => (this.searchLubeData = this.searchLubeDatapagi),
                  //   10
                  // );
                }
              } else {
                console.log("No Data");
                //this.searchLubeData.push("No Data Found")
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
  //searc inventory of spare
  searchSpareInputnew(event) {
    //this.searchSpareData=[]
    this.general.getJobSpareLube(this.userworkshopid, "spare", event).subscribe(
      (SpareSearchData) => {
        this.showspinner.setSpinnerForLogin(true);
        if (SpareSearchData.success == true) {
          if (SpareSearchData.sparedata != undefined) {
            if (SpareSearchData["next_page"] != "Nonextpage") {
              this.sparenextpageinven = SpareSearchData["next_page"];
            } else {
              this.sparenextpageinven = "none";
            }
            for (var i = 0; i < SpareSearchData.sparedata.length; i++) {
              if (
                !this.spareduplicateinven.includes(
                  SpareSearchData.sparedata[i].part_name
                )
              ) {
                if (SpareSearchData.sparedata[i].unit_sale_price != "") {
                  this.spareduplicateinven.push(
                    SpareSearchData.sparedata[i].part_name
                  );
                  this.searchSpareDatasecinven.push(
                    SpareSearchData.sparedata[i].part_number
                  );
                } else {
                  this.spareduplicateinven.push(
                    SpareSearchData.sparedata[i].part_name
                  );
                  this.searchSpareDatasecinven.push(
                    SpareSearchData.sparedata[i].part_number
                  );
                }
              }
            }
            this.searchSpareDatainven = this.searchSpareDatasecinven;
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
  //paginatio in search
  loadMoreDatasparenew() {
    if (this.sparenextpageinven != "none") {
      setTimeout(
        () =>
          this.general
            .inventorylsjpageination(this.sparenextpageinven)
            .subscribe(
              (SpareSearchData) => {
                this.showspinner.setSpinnerForLogin(true);
                if (SpareSearchData.success == true) {
                  if (SpareSearchData.sparedata != undefined) {
                    if (SpareSearchData["next_page"] != "Nonextpage") {
                      this.sparenextpageinven = SpareSearchData["next_page"];
                    } else {
                      this.sparenextpageinven = "none";
                    }
                    this.searchSpareDatapagiinven = this.searchSpareDatainven;
                    for (var i = 0; i < SpareSearchData.sparedata.length; i++) {
                      if (
                        !this.spareduplicateinven.includes(
                          SpareSearchData.sparedata[i].part_name
                        )
                      ) {
                        if (
                          SpareSearchData.sparedata[i].unit_sale_price != ""
                        ) {
                          this.spareduplicateinven.push(
                            SpareSearchData.sparedata[i].part_name
                          );
                          this.searchSpareDatapagiinven.push(
                            SpareSearchData.sparedata[i].part_number
                          );
                        } else {
                          this.spareduplicateinven.push(
                            SpareSearchData.sparedata[i].part_name
                          );
                          this.searchSpareDatapagiinven.push(
                            SpareSearchData.sparedata[i].part_number
                          );
                        }
                      }
                    }
                    this.searchSpareDatainven = [];
                    setTimeout(
                      () =>
                        (this.searchSpareDatainven =
                          this.searchSpareDatapagiinven),
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
  //selected rsult of the spare
  addselectedSpareResultsearch(event) {
    this.allSelectedMake = [];
    this.dupseletecmodvari = [];

    var workshopid = this.userworkshopid;
    this.general.getJobSpareLubeData(workshopid, "spare", event).subscribe(
      (SpareData) => {
        if (event != "" && SpareData.sparedata != undefined) {
          if (SpareData.success == true) {
            var vechilevariant = JSON.parse(
              SpareData.sparedata[0].vechile_details.replace(/\\/g, "")
            );
            this.foralltrue = false;
            var vehdetails = JSON.parse(SpareData.sparedata[0].vechile_details);

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
            this.CreateSpareForm.controls["searchspareVehiclemod"].setValue("");
            this.CreateSpareForm.controls["searchspareVehicle"].setValue("");
            this.sparemaster = SpareData.sparedata[0].is_master;
            this.spareworkshop = SpareData.sparedata[0].workshop_id;
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
  //searc inventory of lube
  searchLubeInputnew(event) {
    //this.searchLubeData=[]
    this.general.getJobSpareLube(this.userworkshopid, "lube", event).subscribe(
      (LubeSearchData) => {
        this.showspinner.setSpinnerForLogin(true);
        if (LubeSearchData.success == true) {
          if (LubeSearchData.lubedata != undefined) {
            if (LubeSearchData["next_page"] != "Nonextpage") {
              this.lubenextpageinven = LubeSearchData["next_page"];
            } else {
              this.lubenextpageinven = "none";
            }
            for (var i = 0; i < LubeSearchData.lubedata.length; i++) {
              this.showspinner.setSpinnerForLogin(true);
              if (
                !this.lubeduplicateinven.includes(
                  LubeSearchData.lubedata[i].part_name
                )
              ) {
                if (LubeSearchData.lubedata[i].unit_sale_price != "") {
                  this.lubeduplicateinven.push(
                    LubeSearchData.lubedata[i].part_name
                  );
                  this.searchLubeDatasecinven.push(
                    LubeSearchData.lubedata[i].part_number
                  );
                } else {
                  this.lubeduplicateinven.push(
                    LubeSearchData.lubedata[i].part_name
                  );
                  this.searchLubeDatasecinven.push(
                    LubeSearchData.lubedata[i].part_number
                  );
                }
              }
            }
            this.searchLubeDatainven = this.searchLubeDatasecinven;
            this.showspinner.setSpinnerForLogin(false);
          }
        } else {
          console.log("No Data");
          //this.searchLubeData.push("No Data Found")
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
  //paginatio in search
  loadMoreDatalubenew() {
    if (this.lubenextpageinven != "none") {
      setTimeout(
        () =>
          this.general
            .inventorylsjpageination(this.lubenextpageinven)
            .subscribe(
              (LubeSearchData) => {
                this.showspinner.setSpinnerForLogin(true);
                if (LubeSearchData.success == true) {
                  if (LubeSearchData.lubedata != undefined) {
                    if (LubeSearchData["next_page"] != "Nonextpage") {
                      this.lubenextpageinven = LubeSearchData["next_page"];
                    } else {
                      this.lubenextpageinven = "none";
                    }
                    this.searchLubeDatapagiinven = this.searchLubeData;
                    for (var i = 0; i < LubeSearchData.lubedata.length; i++) {
                      if (
                        !this.lubeduplicateinven.includes(
                          LubeSearchData.lubedata[i].part_name
                        )
                      ) {
                        if (LubeSearchData.lubedata[i].unit_sale_price != "") {
                          this.lubeduplicateinven.push(
                            LubeSearchData.lubedata[i].part_name
                          );
                          this.searchLubeDatapagiinven.push(
                            LubeSearchData.lubedata[i].part_number
                          );
                        } else {
                          this.lubeduplicateinven.push(
                            LubeSearchData.lubedata[i].part_name
                          );
                          this.searchLubeDatapagiinven.push(
                            LubeSearchData.lubedata[i].part_number
                          );
                        }
                      }
                    }
                    this.searchLubeDatainven = [];
                    setTimeout(
                      () =>
                        (this.searchLubeDatainven =
                          this.searchLubeDatapagiinven),
                      10
                    );
                  }
                } else {
                  console.log("No Data");
                  //this.searchLubeData.push("No Data Found")
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
  //selected rsult of the lube
  addselectedLubeResultlube(event) {
    this.allSelectedMake = [];
    this.dupseletecmodvari = [];

    this.general
      .getJobSpareLubeData(this.userworkshopid, "lube", event)
      .subscribe(
        (lubeData) => {
          if (event != "" && lubeData.lubedata != undefined) {
            if (lubeData.success == true) {
              var vechilevariant = JSON.parse(
                lubeData.lubedata[0].vechile_details.replace(/\\/g, "")
              );
              this.foralltrue = false;
              var vehdetails = JSON.parse(lubeData.lubedata[0].vechile_details);

              if (vehdetails.length == undefined) {
                var vehdata = [];
                if (vehdetails.make == "All") {
                  this.foralltrue = true;
                  vehdata.push({
                    make: "All",
                    model: "All",
                    variant: "All",
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
              this.CreateSpareForm.controls["searchspareVehiclemod"].setValue(
                ""
              );
              this.CreateSpareForm.controls["searchspareVehicle"].setValue("");
              this.lubemaster = lubeData.lubedata[0].is_master;
              this.lubeworkshop = lubeData.lubedata[0].workshop_id;
              this.CreateLubeForm.controls["partname"].setValue(
                lubeData.lubedata[0].part_name,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["companynameLube"].setValue(
                lubeData.lubedata[0].company_name,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["quantity"].setValue(
                lubeData.lubedata[0].current_quantity,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["lowerlimit"].setValue(
                lubeData.lubedata[0].lower_limit,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["unit"].setValue(
                lubeData.lubedata[0].unit,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["subcategory"].setValue(
                lubeData.lubedata[0].lube_subcategory,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["gstslab"].setValue(
                lubeData.lubedata[0].sale_gst_rate,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["gsttype"].setValue(
                lubeData.lubedata[0].sale_tax_type,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["rackno"].setValue(
                lubeData.lubedata[0].rack_no,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["purchaseprice"].setValue(
                lubeData.lubedata[0].unit_purchase_price,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["sellingprice"].setValue(
                lubeData.lubedata[0].unit_sale_price,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["hsnno"].setValue(
                lubeData.lubedata[0].hsn_no,
                { onlySelf: true }
              );
              this.showLubeUpdate = true;
            }
          } else {
            this.CreateLubeForm.controls["partname"].setValue("", {
              onlySelf: true,
            });
            this.CreateLubeForm.controls["companynameLube"].setValue("", {
              onlySelf: true,
            });
            this.CreateLubeForm.controls["quantity"].setValue(1, {
              onlySelf: true,
            });
            this.CreateLubeForm.controls["lowerlimit"].setValue(0, {
              onlySelf: true,
            });
            this.CreateLubeForm.controls["unit"].setValue(this.units[2], {
              onlySelf: true,
            });
            this.CreateLubeForm.controls["subcategory"].setValue(
              this.spareCategory[0],
              { onlySelf: true }
            );
            this.CreateLubeForm.controls["gstslab"].setValue(
              this.gstNumberArr[0],
              { onlySelf: true }
            );
            this.CreateLubeForm.controls["gsttype"].setValue(this.gsttype[0], {
              onlySelf: true,
            });
            this.CreateLubeForm.controls["rackno"].setValue("", {
              onlySelf: true,
            });
            this.CreateLubeForm.controls["purchaseprice"].setValue(0, {
              onlySelf: true,
            });
            this.CreateLubeForm.controls["sellingprice"].setValue(null, {
              onlySelf: true,
            });
            this.CreateLubeForm.controls["hsnno"].setValue("", {
              onlySelf: true,
            });
            this.showLubeUpdate = false;
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
  //selected rsult of the job
  addselectedJobResultnew(event) {
    this.allSelectedMake = [];
    this.dupseletecmodvari = [];

    this.general
      .getJobSpareLubeData(this.userworkshopid, "job", event)
      .subscribe(
        (jobData) => {
          if (event != "" && jobData.jobdata != undefined) {
            if (jobData.success == true) {
              var vechilevariant = JSON.parse(
                jobData.jobdata[0].vechile_details.replace(/\\/g, "")
              );
              this.foralltrue = false;
              var vehdetails = JSON.parse(jobData.jobdata[0].vechile_details);

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
              this.CreateSpareForm.controls["searchspareVehiclemod"].setValue(
                ""
              );
              this.CreateSpareForm.controls["searchspareVehicle"].setValue("");
              this.jobmaster = jobData.jobdata[0].is_master;
              this.jobworkshop = jobData.jobdata[0].workshop_id;
              this.CreateJobForm.controls["partname"].setValue(
                jobData.jobdata[0].part_name,
                { onlySelf: true }
              );
              this.CreateJobForm.controls["companynameJob"].setValue(
                jobData.jobdata[0].company_name,
                { onlySelf: true }
              );
              this.CreateJobForm.controls["quantity"].setValue(
                jobData.jobdata[0].current_quantity,
                { onlySelf: true }
              );
              this.CreateJobForm.controls["lowerlimit"].setValue(
                jobData.jobdata[0].lower_limit,
                { onlySelf: true }
              );
              this.CreateJobForm.controls["unit"].setValue(
                jobData.jobdata[0].unit,
                { onlySelf: true }
              );
              this.CreateJobForm.controls["subcategory"].setValue(
                jobData.jobdata[0].job_subcategory,
                { onlySelf: true }
              );
              this.CreateJobForm.controls["gstslab"].setValue(
                jobData.jobdata[0].sale_gst_rate,
                { onlySelf: true }
              );
              this.CreateJobForm.controls["gsttype"].setValue(
                jobData.jobdata[0].sale_tax_type,
                { onlySelf: true }
              );
              this.CreateJobForm.controls["rackno"].setValue(
                jobData.jobdata[0].rack_no,
                { onlySelf: true }
              );
              this.CreateJobForm.controls["purchaseprice"].setValue(0, {
                onlySelf: true,
              });
              this.CreateJobForm.controls["sellingprice"].setValue(
                jobData.jobdata[0].unit_sale_price,
                { onlySelf: true }
              );
              this.CreateJobForm.controls["hsnno"].setValue(
                jobData.jobdata[0].hsn_no,
                { onlySelf: true }
              );
              this.showJobUpdate = true;
            }
          } else {
            this.CreateJobForm.controls["partname"].setValue("", {
              onlySelf: true,
            });
            this.CreateJobForm.controls["companynameJob"].setValue("", {
              onlySelf: true,
            });
            this.CreateJobForm.controls["quantity"].setValue(1, {
              onlySelf: true,
            });
            this.CreateJobForm.controls["lowerlimit"].setValue(0, {
              onlySelf: true,
            });
            this.CreateJobForm.controls["unit"].setValue(this.unitsjob[0], {
              onlySelf: true,
            });
            this.CreateJobForm.controls["subcategory"].setValue(
              this.spareCategory[0],
              { onlySelf: true }
            );
            this.CreateJobForm.controls["gstslab"].setValue(
              this.gstNumberArr[0],
              { onlySelf: true }
            );
            this.CreateJobForm.controls["gsttype"].setValue(this.gsttype[0], {
              onlySelf: true,
            });
            this.CreateJobForm.controls["rackno"].setValue("", {
              onlySelf: true,
            });
            this.CreateJobForm.controls["purchaseprice"].setValue(0, {
              onlySelf: true,
            });
            this.CreateJobForm.controls["sellingprice"].setValue(null, {
              onlySelf: true,
            });
            this.CreateJobForm.controls["hsnno"].setValue("", {
              onlySelf: true,
            });
            this.showLubeUpdate = false;
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
  //push the seach job Resultin the aray so that user can seelect the job from dropdown
  searchJobInputnew(event) {
    this.general.getJobSpareLube(this.userworkshopid, "job", event).subscribe(
      (JobSearchData) => {
        this.showspinner.setSpinnerForLogin(true);
        if (JobSearchData.success == true) {
          if (JobSearchData.jobdata != undefined) {
            if (JobSearchData["next_page"] != "Nonextpage") {
              this.jobsnextpageinven = JobSearchData["next_page"];
            } else {
              this.jobsnextpageinven = "none";
            }
            //this.searchJobData=[]
            for (var i = 0; i < JobSearchData.jobdata.length; i++) {
              if (
                !this.jobduplicateinven.includes(
                  JobSearchData.jobdata[i].part_name
                )
              ) {
                if (JobSearchData.jobdata[i].unit_sale_price != "") {
                  this.jobduplicateinven.push(
                    JobSearchData.jobdata[i].part_name
                  );
                  this.searchJobDatasecinven.push(
                    JobSearchData.jobdata[i].part_number
                  );
                } else {
                  this.jobduplicateinven.push(
                    JobSearchData.jobdata[i].part_name
                  );
                  this.searchJobDatasecinven.push(
                    JobSearchData.jobdata[i].part_number
                  );
                }
              }
            }
            this.searchJobDatainven = this.searchJobDatasecinven;
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
  //pagination in search
  loadMoreDatajobsnew() {
    if (this.jobsnextpageinven != "none") {
      setTimeout(
        () =>
          this.general
            .inventorylsjpageination(this.jobsnextpageinven)
            .subscribe(
              (JobSearchData) => {
                this.showspinner.setSpinnerForLogin(true);
                if (JobSearchData.success == true) {
                  if (JobSearchData.jobdata != undefined) {
                    if (JobSearchData["next_page"] != "Nonextpage") {
                      this.jobsnextpageinven = JobSearchData["next_page"];
                    } else {
                      this.jobsnextpageinven = "none";
                    }
                    this.searchJobDatapaginateinven = this.searchJobData;
                    for (var i = 0; i < JobSearchData.jobdata.length; i++) {
                      if (
                        !this.jobduplicateinven.includes(
                          JobSearchData.jobdata[i].part_name
                        )
                      ) {
                        if (JobSearchData.jobdata[i].unit_sale_price != "") {
                          this.jobduplicateinven.push(
                            JobSearchData.jobdata[i].part_name
                          );
                          this.searchJobDatapaginateinven.push(
                            JobSearchData.jobdata[i].part_number
                          );
                        } else {
                          this.jobduplicateinven.push(
                            JobSearchData.jobdata[i].part_name
                          );
                          this.searchJobDatapaginateinven.push(
                            JobSearchData.jobdata[i].part_number
                          );
                        }
                      }
                    }
                    this.searchJobDatainven = [];
                    setTimeout(
                      () =>
                        (this.searchJobDatainven =
                          this.searchJobDatapaginateinven),
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
    if (category == "spare") {
      this.CreateSpareForm.controls["searchspareVehicle"].setValue(" ");
    } else if (category == "lube") {
      this.CreateLubeForm.controls["searchspareVehicle"].setValue(" ");
    } else {
      this.CreateJobForm.controls["searchspareVehicle"].setValue(" ");
    }
  }
  //remove the selected result
  removemodve(modelindex, makeindex) {
    this.dupseletecmodvari.splice(makeindex, 1);
    this.allSelectedMake.splice(makeindex, 1);
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
    var index = this.dupseletecmodvari.indexOf(event.label);

    this.allSelectedMake.splice(index + 1, 1);
    this.dupseletecmodvari.splice(index, 1);
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
  //load data of vehicle in search
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
  //search all vehicles
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
  // check the discount of jobacrd job
  checkdiscountofjob(event, falg) {
    if (falg == "true") {
      if (event.match(/^[0-9]*$/)) {
        this.showjobdiserror = false;
        this.jodisvalue = event;
        if (event > 0) {
          this.showjobdisitem = true;
          if (this.jobdatatabel.length != 0) {
            this.jobdatatabel.map((data, index) => {
              data.discountvalue = this.jodisvalue;
              data.discounttype = "%";
              this.checkjobdiscountData("%", data, index, "true");
            });
          }
        } else {
          this.showjobdisitem = false;
          if (this.jobdatatabel.length != 0) {
            this.jobdatatabel.map((data, index) => {
              data.discountvalue = this.jodisvalue;
              data.discounttype = "%";
              this.checkjobdiscountData("%", data, index, "true");
            });
          }
        }
      } else {
        this.showjobdiserror = true;
      }
    } else {
      this.jodisvalue = event;
      if (event > 0) {
        this.showjobdisitem = true;
        if (this.jobdatatabel.length != 0) {
          this.jobdatatabel.map((data, index) => {
            data.discountvalue = this.jodisvalue;
            data.discounttype = "%";
            this.checkjobdiscountData("%", data, index, "true");
          });
        }
      } else {
        this.showjobdisitem = false;
        if (this.jobdatatabel.length != 0) {
          this.jobdatatabel.map((data, index) => {
            data.discountvalue = this.jodisvalue;
            data.discounttype = "%";
            this.checkjobdiscountData("%", data, index, "true");
          });
        }
      }
    }
  }
  // check the discount of jobacrd spare
  checkdiscountofspare(event, falg) {
    if (falg == "true") {
      if (event.match(/^[0-9]*$/)) {
        this.showsparediserror = false;
        this.spareisvalue = event;
        if (event > 0) {
          this.showsparedisitem = true;
          if (this.sparedatatabel.length != 0) {
            this.sparedatatabel.map((data, index) => {
              data.discountvalue = this.spareisvalue;
              data.discounttype = "%";
              this.checksparediscountData("%", data, index, "true");
            });
          }
        } else {
          this.showsparedisitem = false;
          if (this.sparedatatabel.length != 0) {
            this.sparedatatabel.map((data, index) => {
              data.discountvalue = this.spareisvalue;
              data.discounttype = "%";
              this.checksparediscountData("%", data, index, "true");
            });
          }
        }
      } else {
        this.showsparediserror = true;
      }
    } else {
      this.spareisvalue = event;
      if (event > 0) {
        this.showsparedisitem = true;
        if (this.sparedatatabel.length != 0) {
          this.sparedatatabel.map((data, index) => {
            data.discountvalue = this.spareisvalue;
            data.discounttype = "%";
            this.checksparediscountData("%", data, index, "true");
          });
        }
      } else {
        this.showsparedisitem = false;
        if (this.sparedatatabel.length != 0) {
          this.sparedatatabel.map((data, index) => {
            data.discountvalue = this.spareisvalue;
            data.discounttype = "%";
            this.checksparediscountData("%", data, index, "true");
          });
        }
      }
    }
  }
  // check the discount of jobacrd lube
  checkdiscountoflube(event, falg) {
    if (falg == "true") {
      if (event.match(/^[0-9]*$/)) {
        this.showslubediserror = false;
        this.lubeisvalue = event;
        if (event > 0) {
          this.showlubedisitem = true;
          if (this.lubedatatabel.length != 0) {
            this.lubedatatabel.map((data, index) => {
              data.discountvalue = this.lubeisvalue;
              data.discounttype = "%";
              this.checklubediscountData("%", data, index, "true");
            });
          }
        } else {
          this.showlubedisitem = false;
          if (this.lubedatatabel.length != 0) {
            this.lubedatatabel.map((data, index) => {
              data.discountvalue = this.lubeisvalue;
              data.discounttype = "%";
              this.checklubediscountData("%", data, index, "true");
            });
          }
        }
      } else {
        this.showslubediserror = true;
      }
    } else {
      this.lubeisvalue = event;
      if (event > 0) {
        this.showlubedisitem = true;
        if (this.lubedatatabel.length != 0) {
          this.lubedatatabel.map((data, index) => {
            data.discountvalue = this.lubeisvalue;
            data.discounttype = "%";
            this.checklubediscountData("%", data, index, "true");
          });
        }
      } else {
        this.showlubedisitem = false;
        if (this.lubedatatabel.length != 0) {
          this.lubedatatabel.map((data, index) => {
            data.discountvalue = this.lubeisvalue;
            data.discounttype = "%";
            this.checklubediscountData("%", data, index, "true");
          });
        }
      }
    }
  }
  isShowPartName() {
    if (this.isShowPartNumber == true) {
      this.isShowPartNumber = false;
    } else {
      this.isShowPartNumber = true;
    }
  }
}
