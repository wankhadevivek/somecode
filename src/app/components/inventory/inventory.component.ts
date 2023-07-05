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
import { padNumber } from "@ng-bootstrap/ng-bootstrap/util/util";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { UserPermissionService } from "../../services/user-permissions.service";
import * as glob from "../../shared/usercountry/userCountryGlobal";
import * as FileSaver from "file-saver";
interface FilterQty{
  value: string | number; 
  viewValue: string
}
@Component({
  selector: "app-inventory",
  templateUrl: "./inventory.component.html",
  styleUrls: ["./inventory.component.css"],
})
export class InventoryComponent implements OnInit {
  public model: any;
  total_quantity = 0;
  total_spares_amount = 0;
  total_lubes_amount = 0;
  total_jobs_amount = 0;
  groupCount = 0;
  total_quantity_of_inven = "0";
  sparemodelforcreate: any;
  lubemodelforcreate: any;
  jobmodelforcreate: any;
  selectedOption: string = "spare";
  offset: any = 0;
  today = new Date();
  search_keywords: string = "";
  public tabelData: any;
  addOffset;
  hasnext: boolean = false;
  nextUrl: string;
  states = [];
  totaljobs = "0";
  totallube = "0";
  totalspare = "0";
  userserviceworkshopid;
  scrollheight = "100";
  CreateSpareForm: FormGroup;
  CreateLubeForm: FormGroup;
  CreateJobForm: FormGroup;
  allBillingData;
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
  units = ["units", "gm", "ltr", "ml", "can", "pouch", "qty", "cm", "m"];
  unitsjob = ["units", "Hrs"];
  regex = /^-?\d+(\.\d{1,4})?$/;
  pendingMainClass = "totalandname totaldivv";
  completeMainClass = "totalandname";
  closedMainClass = "totalandname";
  groupMainClass = "totalandname";
  @ViewChildren("panel", { read: ElementRef }) public panel: ElementRef<any>;
  @ViewChild("instance", { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  vehiclesearchmodelspl: any;
  sparecompanyname: any;
  searchSpareCompany = [];
  lubecompanyname: any;
  searchLubeCompany = [];
  public data: any;
  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  searchVehicleDataSpl = [];
  invenstatus = "spare";
  selectedvaluefoprsearch;
  showsearchcnacel: boolean = false;
  checkcopnay = "";
  mainsparecompanyarrspl = Array();
  mainlubecompanyarrspl = Array();
  searchSpareDataForCreate = Array();
  spareduplicate = Array();
  sparenextpage;
  searchSpareDatasec = [];
  searchSpareDatapagi = [];
  foralltrue: boolean = false;
  SelectedDataarrOfVehiclespl;
  sparemaster;
  spareworkshop;
  dynamicPartNumber;
  totalamountonform;
  toShowcgst;
  toShowsgst;
  toShowtotal_gst;
  searchLubeData = Array();
  lubeduplicate = Array();
  lubenextpage;
  searchLubeDatasec = [];
  searchLubeDatapagi = [];
  searchLubeDataForCreate = Array();
  searchJobDataForCreate = Array();
  showLubeUpdate: boolean = false;
  lubemaster;
  lubeworkshop;
  showJobUpdate: boolean = false;
  jobmaster;
  jobworkshop;
  jobduplicate = Array();
  jobsnextpage;
  searchJobDatasec = [];
  searchJobData = Array();
  searchJobDatapaginate = [];
  mainVehiclearrspl = Array();
  allSelectedMake = Array();
  dupseletecmodvari = Array();
  searchModelvari = Array();
  vehnextpage;
  searchvehpaginate = Array();
  showjobsdata: boolean = false;
  showgroupsdata: boolean = false;
  vechileTypetoshow: Array<any> = [];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  permitData;
  allow_create_new: boolean = true;
  allow_create: boolean = true;
  allow_edit: boolean = true;
  group_name: string = "";
  group_model = "";
  groupdatatable = Array();
  jobdatatable = Array();
  jobmodel: any;
  duplicategroup = Array();
  groupduplicate = Array();
  groupTotal = 0;
  groupLubeTotal = 0;
  groupLubeQty = 0;
  groupSpareotal = 0;
  groupSpareQty = 0;
  groupJobTotal = 0;
  groupJobQty = 0;
  isGroupEdit: boolean = false;
  currency_symbol: any; 
  selectedQty:string ='';

  filterQuantities:FilterQty[] = 
  [
    {value: '1', viewValue: 'Available Stock'},
    {value: '10', viewValue: 'Less than 10'},
    {value: '5', viewValue: 'Less than 5'},
    {value: '2', viewValue: 'Less than 2'},
    {value: '0', viewValue: 'Negative Quantity'},
    {value: '', viewValue: 'Apply Quantity Filter'},

  ]
  
  constructor(
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
    this.createSpareForm();
    this.createLubeForm();
    this.createJobForm();
    this.userserviceworkshopid = this.userService.getData()["workshop_id"];
    /*check permission of view, create, edit, create new*/
    var isUserLogin = localStorage.getItem("isUserLogin");
    if (isUserLogin == "true") {
      try {
        this.permitData = {};
        permit.getPermissionForComponent("inventory").subscribe((res) => {
          this.permitData = JSON.parse(res.data["inventory"]);
          if (this.permitData) {
            if (this.permitData["create"] != 1) {
              this.allow_create = false;
            }
            if (this.permitData["edit"] != 1) {
              this.allow_edit = false;
            }
            if (this.permitData["create_new"] != 1) {
              this.allow_create_new = false;
            }
          }
        });
      } catch (e) {
        this.permitData = { view: 1 };
      }
    }
  }
  formatterr = (result: string) => result.toUpperCase();
  vechileResult = (result: string) => result.toUpperCase();
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) => (term === "" ? [] : this.states))
    );
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
  //--------------------------------------------------DASHBOARD DATA-------------------------------------------------------
  // Get all Spares when user realod the page
  ngOnInit() {
    this.currency_symbol = glob.currency_symbol;
    this.showspinner.setSpinner(true);
    this.generalService
      .getJobcardSettings(this.userserviceworkshopid)
      .subscribe(
        (settingdata) => {
          this.showspinner.setSpinner(true);
          var settingBillingDataJson = JSON.parse(
            settingdata.jobcard_Settings.settings_billing.replace(/\\/g, "")
          );
          this.allBillingData = settingBillingDataJson[0];
          if (
            this.allBillingData != undefined &&
            this.allBillingData.gst_number != ""
          ) {
            this.displayedColumns = [
              "part_name",
              "part_number",
              "company_name",
              "sub_category",
              "quantity",
              "units",
              "rackno",
              "selling_price",
              "hsn_no",
              "gst(%)",
              "action",
            ];
          } else {
            this.displayedColumns = [
              "part_name",
              "part_number",
              "company_name",
              "sub_category",
              "quantity",
              "units",
              "rackno",
              "selling_price",
              "action",
            ];
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
    this.getTabelData("spare");
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

  /*check permission func of view, create, edit, create new ..... start*/
  event_handler(type) {
    if (this.permitData) {
      if (this.permitData[type] == 0) {
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

  // ------------------------------Group--------------------------------
  // --------------------------------group for lube
  updateGroup() {
    this.generalService
      .updateGroupItems(
        this.group_name,
        JSON.stringify(this.groupdatatable),
        JSON.stringify(this.SelectedDataarrOfVehiclespl),
        this.groupTotal,
        this.userserviceworkshopid
      )
      .subscribe((result) => {
        this.snakBar.open("Message", result["message"], {
          duration: 4000,
        });
      });

    // if (is_delete == "true") {
    //   this.checkStatusGroup();
    // }
  }
  removeGroup(group) {
    let questionForDialog =
      "Are You Sure Want to Delete " + group.group_name + " Group";

    this.dialogService
      .OpenConfirmDialog(questionForDialog, true, "Delete")
      .subscribe((answer) => {
        if (answer == true) {
          this.generalService
            .deleteGroup(
              group.group_name,

              this.userserviceworkshopid
            )
            .subscribe((result) => {});

          this.checkStatusGroup();
        }
      });
  }

  createGroup() {
    // let count = this.groupdatatable.length
    this.generalService
      .saveGroupItems(
        this.group_name,
        JSON.stringify(this.groupdatatable),
        JSON.stringify(this.SelectedDataarrOfVehiclespl),
        this.groupTotal,
        this.userserviceworkshopid
      )
      .subscribe(
        (createResult) => {
          // console.log("create result", createResult);
          this.snakBar.open(
            "Message",
            ErrorMessgae[0][createResult["message"]],
            {
              duration: 4000,
            }
          );
          this.checkStatusGroup();
        },
        (error) => {
          console.log("error", error);
        }
      );
    this.checkStatusGroup();
  }
  searchLubeGroupInputAlternate(event) {
    //this.searchLubeData=[]
    // this.generalService
    //   .getJobSpareLube(this.userserviceworkshopid, "lube", event)
    this.generalService
      .getWorkshopJobSpareLube(this.userserviceworkshopid, "lube", event)
      .subscribe(
        (LubeSearchData) => {
          this.showspinner.setSpinnerForLogin(true);
          if (LubeSearchData.success == true) {
            if (LubeSearchData.lubedata != undefined) {
              if (LubeSearchData["next_page"] != "Nonextpage") {
                this.lubenextpage = LubeSearchData["next_page"];
              } else {
                this.lubenextpage = "none";
              }
              this.SelectedDataarrOfVehiclespl.filter((modelDetails) => {
                for (var i = 0; i < LubeSearchData.lubedata.length; i++) {
                  this.showspinner.setSpinnerForLogin(true);
                  var vehdata = [];
                  vehdata = JSON.parse(
                    LubeSearchData.lubedata[i].vechile_details
                  );
                  if (vehdata.length == undefined) {
                    if (
                      vehdata["make"] == "All" ||
                      modelDetails["make"] == "All"
                    ) {
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
                      if (vehdata["make"] == modelDetails.make) {
                        if (vehdata["model"] == "All") {
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
                          if (vehdata["model"] == modelDetails.model) {
                            if (vehdata["variant"] == "All") {
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
                            } else {
                              if (vehdata["variant"] == modelDetails.variant) {
                                if (
                                  !this.lubeduplicate.includes(
                                    LubeSearchData.lubedata[i].part_number
                                  )
                                ) {
                                  if (
                                    LubeSearchData.lubedata[i]
                                      .unit_sale_price != ""
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
                  } else {
                    vehdata.filter((dataveh) => {
                      if (dataveh.make == "All") {
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
                        if (dataveh.make == modelDetails.make) {
                          if (dataveh.model == "All-model") {
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
                            if (dataveh.model == modelDetails.model) {
                              if (dataveh.variant == "All-variant") {
                                if (
                                  !this.lubeduplicate.includes(
                                    LubeSearchData.lubedata[i].part_number
                                  )
                                ) {
                                  if (
                                    LubeSearchData.lubedata[i]
                                      .unit_sale_price != ""
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
                              } else {
                                if (dataveh.variant == modelDetails.variant) {
                                  if (
                                    !this.lubeduplicate.includes(
                                      LubeSearchData.lubedata[i].part_number
                                    )
                                  ) {
                                    if (
                                      LubeSearchData.lubedata[i]
                                        .unit_sale_price != ""
                                    ) {
                                      this.lubeduplicate.push(
                                        LubeSearchData.lubedata[i].part_number
                                      );
                                      this.searchLubeDatasec.push(
                                        LubeSearchData.lubedata[i].part_name +
                                          " (Part No:-" +
                                          LubeSearchData.lubedata[i]
                                            .part_number +
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
                                          LubeSearchData.lubedata[i]
                                            .part_number +
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
              });
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
  searchLubeGroupInput(event) {
    //this.searchLubeData=[]
    this.generalService
      .getJobSpareLube(this.userserviceworkshopid, "lube", event)
      .subscribe(
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
                vehdata = JSON.parse(
                  LubeSearchData.lubedata[i].vechile_details
                );
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
                    if (
                      vehdata["make"] == this.SelectedDataarrOfVehiclespl.make
                    ) {
                      if (vehdata["model"] == "All") {
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
                          vehdata["model"] ==
                          this.SelectedDataarrOfVehiclespl.model
                        ) {
                          if (vehdata["variant"] == "All") {
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
                              this.SelectedDataarrOfVehiclespl.variant
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
                      if (
                        dataveh.make == this.SelectedDataarrOfVehiclespl.make
                      ) {
                        if (dataveh.model == "All-model") {
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
                            dataveh.model ==
                            this.SelectedDataarrOfVehiclespl.model
                          ) {
                            if (dataveh.variant == "All-variant") {
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
                            } else {
                              if (
                                dataveh.variant ==
                                this.SelectedDataarrOfVehiclespl.variant
                              ) {
                                if (
                                  !this.lubeduplicate.includes(
                                    LubeSearchData.lubedata[i].part_number
                                  )
                                ) {
                                  if (
                                    LubeSearchData.lubedata[i]
                                      .unit_sale_price != ""
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
  // ---------------------------------------------------

  //  --------------------------------group for spare----------------------
  searchSpareGroupInputAlternate(event) {
    // console.log("searchSpareGroupInput");

    // this.generalService
    //   .getJobSpareLube(this.userserviceworkshopid, "spare", event)
    this.generalService
      .getWorkshopJobSpareLube(this.userserviceworkshopid, "spare", event)
      .subscribe(
        (SpareSearchData) => {
          // console.log("SpareSearchData", SpareSearchData);
          // console.log("init detials", this.SelectedDataarrOfVehiclespl);

          this.showspinner.setSpinnerForLogin(true);
          if (SpareSearchData.success == true) {
            if (SpareSearchData.sparedata != undefined) {
              if (SpareSearchData["next_page"] != "Nonextpage") {
                this.sparenextpage = SpareSearchData["next_page"];
              } else {
                this.sparenextpage = "none";
              }
              this.SelectedDataarrOfVehiclespl.filter((modelDetails) => {
                for (var i = 0; i < SpareSearchData.sparedata.length; i++) {
                  var vehdata = [];
                  vehdata = JSON.parse(
                    SpareSearchData.sparedata[i].vechile_details
                  );
                  if (vehdata.length == undefined) {
                    if (
                      vehdata["make"] == "All" ||
                      modelDetails["make"] == "All"
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
                      if (vehdata["make"] == modelDetails.make) {
                        if (vehdata["model"] == "All") {
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
                          if (vehdata["model"] == modelDetails.model) {
                            if (vehdata["variant"] == "All") {
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
                            } else {
                              if (vehdata["variant"] == modelDetails.variant) {
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
                                        SpareSearchData.sparedata[i]
                                          .part_number +
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
                                        SpareSearchData.sparedata[i]
                                          .part_number +
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
                        if (dataveh.make == modelDetails.make) {
                          if (
                            dataveh.model == "All-model" ||
                            dataveh.model == "All model"
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
                            if (dataveh.model == modelDetails.model) {
                              if (
                                dataveh.variant == "All-variant" ||
                                dataveh.model == "All variant"
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
                                        SpareSearchData.sparedata[i]
                                          .part_number +
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
                                        SpareSearchData.sparedata[i]
                                          .part_number +
                                        ")"
                                    );
                                  }
                                }
                              } else {
                                if (dataveh.variant == modelDetails.variant) {
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
                                          SpareSearchData.sparedata[i]
                                            .part_number +
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
                                          SpareSearchData.sparedata[i]
                                            .part_number +
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
              });
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

  searchSpareGroupInput(event) {
    // console.log("searchSpareGroupInput");

    this.generalService
      .getJobSpareLube(this.userserviceworkshopid, "spare", event)
      .subscribe(
        (SpareSearchData) => {
          // console.log("SpareSearchData", SpareSearchData);
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
                    if (
                      vehdata["make"] == this.SelectedDataarrOfVehiclespl.make
                    ) {
                      if (vehdata["model"] == "All") {
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
                          vehdata["model"] ==
                          this.SelectedDataarrOfVehiclespl.model
                        ) {
                          if (vehdata["variant"] == "All") {
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
                              vehdata["variant"] ==
                              this.SelectedDataarrOfVehiclespl.variant
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
                } else {
                  vehdata.filter((dataveh) => {
                    if (dataveh.make == "All") {
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
                        dataveh.make == this.SelectedDataarrOfVehiclespl.make
                      ) {
                        if (
                          dataveh.model == "All-model" ||
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
                            dataveh.model ==
                            this.SelectedDataarrOfVehiclespl.model
                          ) {
                            if (
                              dataveh.variant == "All-variant" ||
                              dataveh.model == "All variant"
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
                            } else {
                              if (
                                dataveh.variant ==
                                this.SelectedDataarrOfVehiclespl.variant
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
                                        SpareSearchData.sparedata[i]
                                          .part_number +
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
                                        SpareSearchData.sparedata[i]
                                          .part_number +
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
  // -------------------------------------------------------
  editgroup(groupData) {
    this.isGroupEdit = true;
    this.allSelectedMake = JSON.parse(groupData.vechile_details);
    this.dupseletecmodvari = [];
    this.SelectedDataarrOfVehiclespl = JSON.parse(groupData.vechile_details);
    this.group_name = groupData.group_name;
    this.groupdatatable = JSON.parse(groupData.group_items);
    this.duplicategroup = JSON.parse(groupData.group_items);
    this.groupdatatable.map((item) => {
      this.groupduplicate.push(item.part_number);
    });
    this.allSelectedMake.map((data) => {
      // if (data.make == "All") {
      //   this.foralltrue = true;
      // } else {
      //   this.foralltrue = false;
      // }
      this.dupseletecmodvari.push(
        data.make + "--" + data.model + "--" + data.variant
      );
    });
    if (groupData.make.includes("All")) {
      this.foralltrue = true;
    } else {
      this.foralltrue = false;
    }

    this.calculategrouptotal();
  }
  calculategrouptotal() {
    this.groupTotal = 0;
    this.groupLubeTotal = 0;
    this.groupLubeQty = 0;
    this.groupSpareotal = 0;
    this.groupSpareQty = 0;
    this.groupJobTotal = 0;
    this.groupJobQty = 0;
    this.groupdatatable.map((item) => {
      this.groupTotal += parseInt(item.amount);

      if (item.category == "job") {
        this.groupJobTotal += parseInt(item.amount);
        this.groupJobQty += 1;
      } else if (item.category == "spare") {
        this.groupSpareotal += parseInt(item.amount);
        this.groupSpareQty += 1;
      } else {
        this.groupLubeTotal += parseInt(item.amount);
        this.groupLubeQty += 1;
      }
    });
  }
  searchGroupInput(event) {
    // this.generalService
    //   .getJobSpareLube(this.userserviceworkshopid, "job", event)
    this.generalService
      .getWorkshopJobSpareLube(this.userserviceworkshopid, "job", event)
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
              for (var i = 0; i < JobSearchData.jobdata.length; i++) {
                var vehdata = [];
                vehdata = JSON.parse(JobSearchData.jobdata[i].vechile_details);
                if (vehdata.length == undefined) {
                  if (vehdata["make"] == "All") {
                    if (
                      !this.groupduplicate.includes(
                        JobSearchData.jobdata[i].part_number
                      )
                    ) {
                      if (JobSearchData.jobdata[i].unit_sale_price != "") {
                        this.groupduplicate.push(
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
                        this.groupduplicate.push(
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
                      vehdata["make"] == this.SelectedDataarrOfVehiclespl.make
                    ) {
                      if (vehdata["model"] == "All") {
                        if (
                          !this.groupduplicate.includes(
                            JobSearchData.jobdata[i].part_number
                          )
                        ) {
                          if (JobSearchData.jobdata[i].unit_sale_price != "") {
                            this.groupduplicate.push(
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
                            this.groupduplicate.push(
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
                          vehdata["model"] ==
                          this.SelectedDataarrOfVehiclespl.model
                        ) {
                          if (vehdata["variant"] == "All") {
                            if (
                              !this.groupduplicate.includes(
                                JobSearchData.jobdata[i].part_number
                              )
                            ) {
                              if (
                                JobSearchData.jobdata[i].unit_sale_price != ""
                              ) {
                                this.groupduplicate.push(
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
                                this.groupduplicate.push(
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
                              this.SelectedDataarrOfVehiclespl.variant
                            ) {
                              if (
                                !this.groupduplicate.includes(
                                  JobSearchData.jobdata[i].part_number
                                )
                              ) {
                                if (
                                  JobSearchData.jobdata[i].unit_sale_price != ""
                                ) {
                                  this.groupduplicate.push(
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
                                  this.groupduplicate.push(
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
                        !this.groupduplicate.includes(
                          JobSearchData.jobdata[i].part_number
                        )
                      ) {
                        if (JobSearchData.jobdata[i].unit_sale_price != "") {
                          this.groupduplicate.push(
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
                          this.groupduplicate.push(
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
                        dataveh.make == this.SelectedDataarrOfVehiclespl.make
                      ) {
                        if (dataveh.model == "All-model") {
                          if (
                            !this.groupduplicate.includes(
                              JobSearchData.jobdata[i].part_number
                            )
                          ) {
                            if (
                              JobSearchData.jobdata[i].unit_sale_price != ""
                            ) {
                              this.groupduplicate.push(
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
                              this.groupduplicate.push(
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
                            dataveh.model ==
                            this.SelectedDataarrOfVehiclespl.model
                          ) {
                            if (dataveh.variant == "All-variant") {
                              if (
                                !this.groupduplicate.includes(
                                  JobSearchData.jobdata[i].part_number
                                )
                              ) {
                                if (
                                  JobSearchData.jobdata[i].unit_sale_price != ""
                                ) {
                                  this.groupduplicate.push(
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
                                  this.groupduplicate.push(
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
                                this.SelectedDataarrOfVehiclespl.variant
                              ) {
                                if (
                                  !this.groupduplicate.includes(
                                    JobSearchData.jobdata[i].part_number
                                  )
                                ) {
                                  if (
                                    JobSearchData.jobdata[i].unit_sale_price !=
                                    ""
                                  ) {
                                    this.groupduplicate.push(
                                      JobSearchData.jobdata[i].part_number
                                    );
                                    this.searchJobDatasec.push(
                                      JobSearchData.jobdata[i].part_name +
                                        " (Part No:-" +
                                        JobSearchData.jobdata[i].part_number +
                                        ")----Rs." +
                                        JobSearchData.jobdata[i]
                                          .unit_sale_price +
                                        "/-"
                                    );
                                  } else {
                                    this.groupduplicate.push(
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

  makegrouptable(data) {
    this.duplicategroup.push(data);
    var result = this.duplicategroup.reduce((unique, o) => {
      if (
        !unique.some(
          (obj) =>
            obj.part_number === o.part_number && obj.part_name === o.part_name
        )
      ) {
        if (this.allBillingData.gst_number != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            o.unit_sale_price,
            o.sale_gst_rate,
            o.sale_tax_type,
            0,
            1,
            "₹"
          );
          // o.gstcalculateofjob = totalcal[0]["GSTAmount"];
          // o.cgstcalculateofjob = totalcal[0]["CGST"];
          // o.sgstcalculateofjob = totalcal[0]["SGST"];
          // o.showcalcluationinfo = true;
          o.quantity = 1;
          o.amount = totalcal[0]["totalamount"];
          unique.push(o);
        } else {
          o.quantity = 1;

          o.amount = o.unit_sale_price;
          unique.push(o);
        }
      }
      return unique;
    }, []);

    this.groupdatatable = result;
    // console.log("groupdata", this.groupdatatable);
    this.calculategrouptotal();
  }

  selectedJobResult(event, type) {
    // console.log("event", event);
    var partnumber;
    partnumber = event.split("(Part No:-")[1].split(")----")[0];
    if (event.split("(Part No:-").length != 0) {
      this.generalService
        .getJobSpareLubeData(this.userserviceworkshopid, type, partnumber)
        .subscribe(
          (jobData) => {
            this.jobmodel = "";
            this.showspinner.setSpinnerForLogin(true);
            let data = type + "data";

            if (type == "spare") {
              this.makegrouptable(jobData.sparedata[0]);
            } else if (type == "lube") {
              this.makegrouptable(jobData.lubedata[0]);
            } else {
              this.makegrouptable(jobData.jobdata[0]);
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

  removeGroupItem(data, index) {
    // console.log("this.groupdatatable", this.groupdatatable);
    this.groupdatatable.splice(index, 1);
    // console.log("this.groupdatatable", this.groupdatatable);
    this.duplicategroup.splice(index, 1);
    this.calculategrouptotal();
    // update total calculations
  }

  CalculateInclusiveGSTRateDiscounted(
    price,
    rate,
    type,
    discount,
    quantity,
    discounttype
  ) {
    //my checks
    var taxableAmt = 0;
    if (discounttype == "₹") {
      if (type == "Inclusive") {
        var taxalbeamount =
          (parseFloat(price) * parseFloat(quantity)) /
            (1 + parseInt(rate) / 100) -
          parseInt(discount);
        var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
        var CGST = GSTAmount / 2;
        var SGST = CGST;
        taxableAmt = taxalbeamount;
        var totalamount = taxalbeamount + GSTAmount;
      } else {
        var taxalbeamount =
          parseFloat(price) * parseFloat(quantity) - parseInt(discount);
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
          (parseInt(discount) / 100);
        var taxalbeamount =
          (parseFloat(price) * parseFloat(quantity)) /
            (1 + parseInt(rate) / 100) -
          discountamount;
        //
        taxableAmt = taxalbeamount;
        var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
        var CGST = GSTAmount / 2;
        var SGST = CGST;
        var totalamount = taxalbeamount + GSTAmount;
      } else {
        var discountamount =
          parseFloat(price) * parseFloat(quantity) * (parseInt(discount) / 100);
        var taxalbeamount =
          parseFloat(price) * parseFloat(quantity) - discountamount;

        //
        // console.log("checkkkkk tax amt a& dis", taxableAmt, discountamount);
        var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
        var CGST = GSTAmount / 2;
        var SGST = CGST;
        //
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
  checkgroupgsttype(event, data, index, gstVlaue) {
    var amounttocalculate =
      parseFloat(data["unit_sale_price"]) * parseFloat(data["quantity"]);
    if (data["sale_gst_rate"] != "" && data["sale_tax_type"] != "") {
      this.groupdatatable[index]["sale_tax_type"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(this.groupdatatable[index]["unit_sale_price"]),
        this.groupdatatable[index]["sale_gst_rate"],
        event,
        0,
        parseFloat(this.groupdatatable[index]["quantity"]),
        "₹"
      );
      this.groupdatatable[index]["gstcalculateoflube"] =
        totalcal[0]["GSTAmount"];
      this.groupdatatable[index]["cgstcalculateoflube"] = totalcal[0]["CGST"];
      this.groupdatatable[index]["sgstcalculateoflube"] = totalcal[0]["SGST"];
      data["showcalcluationinfo"] = true;
      if (gstVlaue != "gstNull") {
        this.groupdatatable[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.groupdatatable[index]["lubegsttypeerror"] = false;
      // this.LubeTotal = this.calculateresult(this.groupdatatable);
      // this.LubeTotalFinal = this.calculateresultfinal(this.groupdatatable);
      // this.calculateAmountOfBilling();
      // this.groupdatatable[index]["totalitemamount"] = this.getTotalAmount(
      //   data,
      //   index,
      //   "job"
      // );
      // this.calTotalGstForLubeamount = this.calTotalGstForLube(
      //   this.groupdatatable
      // );
      // this.checkLubeGSTrateandtype();
    } else if (
      data["purchase_gst_rate"] != "" &&
      data["purchase_tax_type"] != ""
    ) {
      this.groupdatatable[index]["purchase_tax_type"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(this.groupdatatable[index]["unit_sale_price"]),
        this.groupdatatable[index]["purchase_gst_rate"],
        event,
        0,
        parseFloat(this.groupdatatable[index]["quantity"]),
        "₹"
      );

      this.groupdatatable[index]["gstcalculateoflube"] =
        totalcal[0]["GSTAmount"];
      this.groupdatatable[index]["cgstcalculateoflube"] = totalcal[0]["CGST"];
      this.groupdatatable[index]["sgstcalculateoflube"] = totalcal[0]["SGST"];
      data["showcalcluationinfo"] = true;
      if (gstVlaue != "gstNull") {
        this.groupdatatable[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.groupdatatable[index]["lubegsttypeerror"] = false;
      // this.LubeTotal = this.calculateresult(this.groupdatatable);
      // this.LubeTotalFinal = this.calculateresultfinal(this.groupdatatable);
      // this.calculateAmountOfBilling();
      // this.groupdatatable[index]["totalitemamount"] = this.getTotalAmount(
      //   data,
      //   index,
      //   "job"
      // );
      // this.calTotalGstForLubeamount = this.calTotalGstForLube(
      //   this.groupdatatable
      // );
      // this.checkLubeGSTrateandtype();
    } else {
      this.groupdatatable[index]["lubegsttypeerror"] = false;
      this.groupdatatable[index]["amount"] = data["amount"];
      // this.LubeTotal = this.calculateresult(this.groupdatatable);
      // this.LubeTotalFinal = this.calculateresultfinal(this.groupdatatable);
      // this.calculateAmountOfBilling();
      // this.groupdatatable[index]["totalitemamount"] = this.getTotalAmount(
      //   data,
      //   index,
      //   "job"
      // );
      // this.calTotalGstForLubeamount = this.calTotalGstForLube(
      //   this.groupdatatable
      // );
      // this.checkLubeGSTrateandtype();
    }
  }

  checkgroupgst(event, data, index, gstVlaue) {
    var amounttocalculate =
      parseFloat(data["unit_sale_price"]) * parseFloat(data["quantity"]);
    if (data["sale_gst_rate"] != "" && data["sale_tax_type"] != "") {
      this.groupdatatable[index]["sale_gst_rate"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(this.groupdatatable[index]["unit_sale_price"]),
        event,
        this.groupdatatable[index]["sale_tax_type"],
        0,
        parseFloat(this.groupdatatable[index]["quantity"]),
        "₹"
      );
      this.groupdatatable[index]["gstcalculateoflube"] =
        totalcal[0]["GSTAmount"];
      this.groupdatatable[index]["cgstcalculateoflube"] = totalcal[0]["CGST"];
      this.groupdatatable[index]["sgstcalculateoflube"] = totalcal[0]["SGST"];
      data["showcalcluationinfo"] = true;
      if (gstVlaue != "gstNull") {
        this.groupdatatable[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.groupdatatable[index]["lubegstamounterror"] = false;
      // this.LubeTotal = this.calculateresult(this.groupdatatable);
      // this.LubeTotalFinal = this.calculateresultfinal(this.groupdatatable);
      // this.calculateAmountOfBilling();
      // this.groupdatatable[index]["totalitemamount"] = this.getTotalAmount(
      //   data,
      //   index,
      //   "job"
      // );
      // this.calTotalGstForLubeamount = this.calTotalGstForLube(
      //   this.groupdatatable
      // );
      // this.checkLubeGSTrateandtype();
    } else if (
      data["purchase_gst_rate"] != "" &&
      data["purchase_tax_type"] != ""
    ) {
      this.groupdatatable[index]["purchase_gst_rate"] = event;
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(this.groupdatatable[index]["unit_sale_price"]),
        event,
        this.groupdatatable[index]["purchase_tax_type"],
        0,
        parseFloat(this.groupdatatable[index]["quantity"]),
        "₹"
      );
      this.groupdatatable[index]["gstcalculateoflube"] =
        totalcal[0]["GSTAmount"];
      this.groupdatatable[index]["cgstcalculateoflube"] = totalcal[0]["CGST"];
      this.groupdatatable[index]["sgstcalculateoflube"] = totalcal[0]["SGST"];
      data["showcalcluationinfo"] = true;
      if (gstVlaue != "gstNull") {
        this.groupdatatable[index]["amount"] = totalcal[0]["totalamount"];
      }
      this.groupdatatable[index]["lubegstamounterror"] = false;
      // this.LubeTotal = this.calculateresult(this.groupdatatable);
      // this.LubeTotalFinal = this.calculateresultfinal(this.groupdatatable);
      // this.calculateAmountOfBilling();
      // this.groupdatatable[index]["totalitemamount"] = this.getTotalAmount(
      //   data,
      //   index,
      //   "job"
      // );
      // this.calTotalGstForLubeamount = this.calTotalGstForLube(
      //   this.groupdatatable
      // );
      // this.checkLubeGSTrateandtype();
    } else {
      this.groupdatatable[index]["lubegstamounterror"] = false;
      this.groupdatatable[index]["amount"] = data["amount"];
      // this.LubeTotal = this.calculateresult(this.groupdatatable);
      // this.LubeTotalFinal = this.calculateresultfinal(this.groupdatatable);
      // this.calculateAmountOfBilling();
      // this.groupdatatable[index]["totalitemamount"] = this.getTotalAmount(
      //   data,
      //   index,
      //   "job"
      // );
      // this.calTotalGstForLubeamount = this.calTotalGstForLube(
      //   this.groupdatatable
      // );
      // this.checkLubeGSTrateandtype();
    }
    this.calculategrouptotal();
  }
  checkvalueenteredPriceforgroup(event, index, indexdata) {
    if (event.match(/^\d*\.?\d*$/)) {
      indexdata["showpriceerrorgroup"] = false;
      this.groupdatatable[index]["unit_sale_price"] = event;
      // var amount = parseFloat(indexdata["quantity"]) * parseFloat(event);
      //this.groupdatatable[index]["amount"]=amount
      if (this.allBillingData.gst_number != "") {
        if (this.groupdatatable[index]["sale_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            event,
            this.groupdatatable[index]["sale_gst_rate"],
            this.groupdatatable[index]["sale_tax_type"],

            0,
            parseFloat(this.groupdatatable[index]["quantity"]),
            "₹"
          );

          this.groupdatatable[index]["gstcalculateoflube"] =
            totalcal[0]["GSTAmount"];
          this.groupdatatable[index]["cgstcalculateoflube"] =
            totalcal[0]["CGST"];
          this.groupdatatable[index]["sgstcalculateoflube"] =
            totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.groupdatatable[index]["amount"] = totalcal[0]["totalamount"];
          this.groupdatatable[index]["unit_sale_price"] = event;
        } else if (this.groupdatatable[index]["purchase_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            event,
            this.groupdatatable[index]["purchase_gst_rate"],
            this.groupdatatable[index]["purchase_tax_type"],
            0,
            parseFloat(this.groupdatatable[index]["quantity"]),
            "₹"
          );

          this.groupdatatable[index]["gstcalculateoflube"] =
            totalcal[0]["GSTAmount"];
          this.groupdatatable[index]["cgstcalculateoflube"] =
            totalcal[0]["CGST"];
          this.groupdatatable[index]["sgstcalculateoflube"] =
            totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.groupdatatable[index]["amount"] = totalcal[0]["totalamount"];
          this.groupdatatable[index]["unit_sale_price"] = event;
        } else {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            event,
            "0",
            "Exclusive",
            0,
            parseFloat(this.groupdatatable[index]["quantity"]),
            "₹"
          );
          this.groupdatatable[index]["amount"] = totalcal[0]["totalamount"];
          this.groupdatatable[index]["unit_sale_price"] = event;
        }
      } else {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          event,
          "0",
          "Exclusive",
          0,
          parseFloat(this.groupdatatable[index]["quantity"]),
          "₹"
        );
        this.groupdatatable[index]["amount"] = totalcal[0]["totalamount"];
        this.groupdatatable[index]["unit_sale_price"] = event;
      }
      // this.LubeTotal = this.calculateresult(this.groupdatatable);
      // this.LubeTotalFinal = this.calculateresultfinal(this.groupdatatable);
      // this.calculateAmountOfBilling();
      // this.groupdatatable[index]["totalitemamount"] = this.getTotalAmount(
      //   indexdata,
      //   index,
      //   "job"
      // );
      // this.calTotalGstForLube(this.groupdatatable);

      // this.calTotalGstForLubeamount = this.calTotalGstForLube(
      //   this.groupdatatable
      // );
    } else {
      indexdata["showpriceerrorgroup"] = true;
    }
    this.calculategrouptotal();
  }

  checkvalueenteredforgroup(event, index, indexdata) {
    if (event.match(/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/)) {
      indexdata["showqunatityerrorlube"] = false;
      var amount = parseFloat(indexdata["unit_sale_price"]) * parseFloat(event);
      this.groupdatatable[index]["quantity"] = event;
      //this.groupdatatable[index]["amount"]=amount
      if (this.allBillingData.gst_number != "") {
        if (this.groupdatatable[index]["sale_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(this.groupdatatable[index]["unit_sale_price"]),
            this.groupdatatable[index]["sale_gst_rate"],
            this.groupdatatable[index]["sale_tax_type"],
            0,
            parseFloat(this.groupdatatable[index]["quantity"]),
            "₹"
          );

          this.groupdatatable[index]["gstcalculateoflube"] =
            totalcal[0]["GSTAmount"];
          this.groupdatatable[index]["cgstcalculateoflube"] =
            totalcal[0]["CGST"];
          this.groupdatatable[index]["sgstcalculateoflube"] =
            totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.groupdatatable[index]["amount"] = totalcal[0]["totalamount"];
        } else if (this.groupdatatable[index]["purchase_gst_rate"] != "") {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(this.groupdatatable[index]["unit_sale_price"]),
            this.groupdatatable[index]["purchase_gst_rate"],
            this.groupdatatable[index]["purchase_tax_type"],
            0,
            parseFloat(this.groupdatatable[index]["quantity"]),
            "₹"
          );

          this.groupdatatable[index]["gstcalculateoflube"] =
            totalcal[0]["GSTAmount"];
          this.groupdatatable[index]["cgstcalculateoflube"] =
            totalcal[0]["CGST"];
          this.groupdatatable[index]["sgstcalculateoflube"] =
            totalcal[0]["SGST"];
          indexdata["showcalcluationinfo"] = true;
          this.groupdatatable[index]["amount"] = totalcal[0]["totalamount"];
        } else {
          var totalcal = this.CalculateInclusiveGSTRateDiscounted(
            parseFloat(this.groupdatatable[index]["unit_sale_price"]),
            "0",
            "Exclusive",
            0,
            parseFloat(this.groupdatatable[index]["quantity"]),
            "₹"
          );
          this.groupdatatable[index]["amount"] = totalcal[0]["totalamount"];
        }
      } else {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseFloat(this.groupdatatable[index]["unit_sale_price"]),
          "0",
          "Exclusive",
          0,
          parseFloat(this.groupdatatable[index]["quantity"]),
          "₹"
        );
        this.groupdatatable[index]["amount"] = totalcal[0]["totalamount"];
      }

      // this.groupdatatable[index]["totalitemamount"] = this.getTotalAmount(
      //   indexdata,
      //   index,
      //   "job"
      // );
    } else {
      indexdata["showqunatityerrorlube"] = true;
    }
    this.calculategrouptotal();
  }
  // -------------------------------------------------------------------
  // Get Data when user search the Inventory any job spare or lube
  searchBar(event) {
    this.offset = 0;
    this.addOffset = 0;
    this.search_keywords = event;
    this.showspinner.setSpinner(true);
    this.getDataForSearch();
  }
  // Get results when user select the inventory after search

  selectedResult(event) {
    this.selectedvaluefoprsearch = event;
    this.showsearchcnacel = true;
    let temp = event;
    // console.log("temp", temp);
    let last_index = temp.lastIndexOf(",");
    let type_item = temp.slice(last_index + 1, temp.length).trim();
    // console.log("typee", type_item);
    let next_half = temp.substring(0, last_index).lastIndexOf(",");

    if (event.split(", ").length == 3) {
      this.search_keywords = "";
      this.offset = 0;
      this.addOffset = 0;
      this.showspinner.setSpinner(true);
      this.getSelectedinventory(event.split(", ")[2], event.split(", ")[1]);
    }
    if (event == "") {
      this.search_keywords = "";
      this.offset = 0;
      this.addOffset = 0;
      this.showspinner.setSpinner(true);
      this.getTabelData(this.selectedOption);
    } else {
      this.getSelectedinventory(
        type_item,
        temp.substring(next_half + 1, last_index).trim()
      );
    }
  }
  //API to get selected Inventory
  getSelectedinventory(mode, keyword) {
    this.generalService
      .getJobSpareLubeData(this.userserviceworkshopid, mode, keyword)
      .subscribe(
        (data) => {
          this.model = "";
          this.showspinner.setSpinner(true);
          if (data.success == false) {
            this.showspinner.setSpinner(false);
            this.tabelData = undefined;
          } else if (data.success == true) {
            this.showspinner.setSpinner(false);
            var tabelDataForMap: any;
            if (mode == "lube") {
              tabelDataForMap = data["lubedata"];
            } else if (mode == "spare") {
              tabelDataForMap = data["sparedata"];
            } else if (mode == "job") {
              tabelDataForMap = data["jobdata"];
            }
            this.tabelData = [];
            this.tabelData = tabelDataForMap.map(function (tabelinfo) {
              if (
                tabelinfo.vechile_details != null &&
                tabelinfo.vechile_details != ""
              ) {
                var vechile_details_sorted = JSON.parse(
                  tabelinfo.vechile_details.replace(/\\/g, "")
                );
              }
              tabelinfo.vechile_details = vechile_details_sorted;
              return tabelinfo;
            });

            var scrollheight = this.tabelData.length * 100;
            if (scrollheight >= 750) {
              this.scrollheight = "600";
            } else if (scrollheight == 0) {
              this.scrollheight = "150";
            } else {
              this.scrollheight = scrollheight.toString();
            }
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
  }
  getFilteredInventory(event){
    let classadd = 'clo'
    if (this.invenstatus == 'spare' ) { classadd = 'pen'}
    else if (this.invenstatus == 'lube' ) { classadd = 'com'}

 
    this.checkStatus( this.invenstatus, classadd)
  }
  // Drop down to get Inventory Data like spare lubes and jobs
  checkStatus(val, classadd) {
    if (classadd == "pen") {
      if (
        this.allBillingData != undefined &&
        this.allBillingData.gst_number != ""
      ) {
        this.displayedColumns = [
          "part_name",
          "part_number",
          "company_name",
          "sub_category",
          "quantity",
          "units",
          "rackno",
          "selling_price",
          "hsn_no",
          "gst(%)",
          "action",
        ];
      } else {
        this.displayedColumns = [
          "part_name",
          "part_number",
          "company_name",
          "sub_category",
          "quantity",
          "units",
          "rackno",
          "selling_price",
          "action",
        ];
      }
      this.showgroupsdata = false;
      this.groupMainClass = "totalandname";
      this.showjobsdata = false;
      this.invenstatus = "spare";
      this.pendingMainClass = "";
      this.completeMainClass = "";
      this.closedMainClass = "";
      this.pendingMainClass = "totalandname totaldivv";
      this.completeMainClass = "totalandname";
      this.closedMainClass = "totalandname";
    } else if (classadd == "clo") {
      this.showjobsdata = true;
      if (
        this.allBillingData != undefined &&
        this.allBillingData.gst_number != ""
      ) {
        this.displayedColumns = [
          "part_name",
          "part_number",
          "sub_category",
          "units",
          "selling_price",
          "hsn_no",
          "gst(%)",
          "action",
        ];
      } else {
        this.displayedColumns = [
          "part_name",
          "part_number",
          "sub_category",
          "units",
          "selling_price",
          "action",
        ];
      }
      this.showgroupsdata = false;
      this.groupMainClass = "totalandname";
      this.invenstatus = "job";
      this.pendingMainClass = "";
      this.completeMainClass = "";
      this.closedMainClass = "";
      this.pendingMainClass = "totalandname";
      this.completeMainClass = "totalandname";
      this.closedMainClass = "totalandname totaldivv";
    } else if (classadd == "com") {
      if (
        this.allBillingData != undefined &&
        this.allBillingData.gst_number != ""
      ) {
        this.displayedColumns = [
          "part_name",
          "part_number",
          "company_name",
          "sub_category",
          "quantity",
          "units",
          "rackno",
          "selling_price",
          "hsn_no",
          "gst(%)",
          "action",
        ];
      } else {
        this.displayedColumns = [
          "part_name",
          "part_number",
          "company_name",
          "sub_category",
          "quantity",
          "units",
          "rackno",
          "selling_price",
          "action",
        ];
      }
      this.showgroupsdata = false;
      this.groupMainClass = "totalandname";

      this.showjobsdata = false;
      this.invenstatus = "lube";
      this.pendingMainClass = "";
      this.completeMainClass = "";
      this.closedMainClass = "";
      this.pendingMainClass = "totalandname";
      this.completeMainClass = "totalandname totaldivv";
      this.closedMainClass = "totalandname";
    }
    this.showgroupsdata = false;
    this.groupMainClass = "totalandname";
    this.selectedOption = val;
    this.addOffset = 0;
    this.offset = 0;
    this.showspinner.setSpinner(true);
    this.getTabelData(val);
  }
  checkStatusGroup() {
    this.displayedColumns = [
      "group_name",
      "total_amount",
      "make",
      "created_at",
      "action",
    ];
    this.showgroupsdata = true;
    this.showjobsdata = false;
    this.invenstatus = "";
    this.pendingMainClass = "";
    this.completeMainClass = "";
    this.closedMainClass = "";
    this.groupMainClass = "totalandname totaldivv";
    this.pendingMainClass = "totalandname";
    this.completeMainClass = "totalandname";
    this.closedMainClass = "totalandname";

    this.generalService.getGroupItems(this.userserviceworkshopid).subscribe(
      (dashResult) => {
        if (dashResult.success == false) {
          this.tabelData = undefined;
        } else {
          let hold_group = Array();
          // let make_string = "";
          hold_group = dashResult.data.map((group) => {
            var details = JSON.parse(group.vechile_details);
            let make_string = "";
            group["make"] = "";
            if (Array.isArray(details)) {
              details.forEach((element) => {
                // group.make.push(element.make);
                if (!group.make.includes(element.make)) {
                  group.make = group.make + " " + element.make;
                }
              });
            } else {
              // group.make.push(details.make);
              if (!group.make.includes(details.make)) {
                group.make = group.make + " " + details.make;
              }
            }
            return group;
          });

          this.dataSource = new MatTableDataSource(dashResult.data);

          if (dashResult.data.lenght == 0) {
            this.tabelData = undefined;
          }
        }
        // this.dataSource = new MatTableDataSource(hold_group);
      },
      (error) => {}
    );
  }

  doFilter(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
  }

  // on scroll get data
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
  // Get all daata
  clearSearch() {
    this.selectedvaluefoprsearch = "";
    this.search_keywords = "";
    this.showsearchcnacel = false;
    this.checkStatus("spare", "pen");
    this.getTabelData("spare");
  }
  //Gte the tabel data of inventory
  getTabelData(mode) {
    this.generalService
      .inventoryDashboard(
        this.userserviceworkshopid,
        mode,
        this.search_keywords,
        this.vechileTypetoshow.toString(),
        this.selectedQty
      )
      .subscribe(
        (dashResult) => {
          this.model = "";
          if (dashResult.success == false) {
            this.showspinner.setSpinner(false);
            this.tabelData = undefined;
            if (dashResult["total_jobs"] == null) {
              this.totaljobs = "0";
            } else {
              if (parseInt(dashResult["total_jobs"]) >= 1000000000) {
                this.totaljobs =
                  (parseInt(dashResult["total_jobs"]) / 1000000000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "G";
              } else if (parseInt(dashResult["total_jobs"]) >= 1000000) {
                this.totaljobs =
                  (parseInt(dashResult["total_jobs"]) / 1000000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "M";
              } else if (parseInt(dashResult["total_jobs"]) >= 1000) {
                this.totaljobs =
                  (parseInt(dashResult["total_jobs"]) / 1000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "K";
              } else {
                this.totaljobs = dashResult["total_jobs"];
              }
            }
            if (dashResult["total_lubes"] == null) {
              this.totallube = "0";
            } else {
              if (parseInt(dashResult["total_lubes"]) >= 1000000000) {
                this.totallube =
                  (parseInt(dashResult["total_lubes"]) / 1000000000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "G";
              } else if (parseInt(dashResult["total_lubes"]) >= 1000000) {
                this.totallube =
                  (parseInt(dashResult["total_lubes"]) / 1000000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "M";
              } else if (parseInt(dashResult["total_lubes"]) >= 1000) {
                this.totallube =
                  (parseInt(dashResult["total_lubes"]) / 1000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "K";
              } else {
                this.totallube = dashResult["total_lubes"];
              }
            }
            if (dashResult["total_spares"] == null) {
              this.totalspare = "0";
            } else {
              if (parseInt(dashResult["total_spares"]) >= 1000000000) {
                this.totalspare =
                  (parseInt(dashResult["total_spares"]) / 1000000000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "G";
              } else if (parseInt(dashResult["total_spares"]) >= 1000000) {
                this.totalspare =
                  (parseInt(dashResult["total_spares"]) / 1000000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "M";
              } else if (parseInt(dashResult["total_spares"]) >= 1000) {
                this.totalspare =
                  (parseInt(dashResult["total_spares"]) / 1000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "K";
              } else {
                this.totalspare = dashResult["total_spares"];
              }
            }

            this.total_quantity = dashResult["total_quantity"];
            this.total_spares_amount = dashResult["total_spares_amount"];
            this.total_lubes_amount = dashResult["total_lubes_amount"];
            this.total_jobs_amount = dashResult["total_jobs_amount"];
            if (dashResult["total_quantity_of_inven"] == null) {
              this.total_quantity_of_inven = "0";
            } else {
              if (
                parseInt(dashResult["total_quantity_of_inven"]) >= 1000000000
              ) {
                this.total_quantity_of_inven =
                  (parseInt(dashResult["total_quantity_of_inven"]) / 1000000000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "G";
              } else if (
                parseInt(dashResult["total_quantity_of_inven"]) >= 1000000
              ) {
                this.total_quantity_of_inven =
                  (parseInt(dashResult["total_quantity_of_inven"]) / 1000000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "M";
              } else if (
                parseInt(dashResult["total_quantity_of_inven"]) >= 1000
              ) {
                this.total_quantity_of_inven =
                  (parseInt(dashResult["total_quantity_of_inven"]) / 1000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "K";
              } else {
                this.total_quantity_of_inven =
                  dashResult["total_quantity_of_inven"];
              }
            }
            this.scrollheight = "150";
            // this.snakBar.open("No Record Found","", {
            //   duration: 4000
            // })
          } else if (dashResult.success == true) {
            this.groupCount = dashResult["group_data_count"];
            this.showspinner.setSpinner(false);
            if (dashResult["total_jobs"] == null) {
              this.totaljobs = "0";
            } else {
              if (parseInt(dashResult["total_jobs"]) >= 1000000000) {
                this.totaljobs =
                  (parseInt(dashResult["total_jobs"]) / 1000000000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "G";
              } else if (parseInt(dashResult["total_jobs"]) >= 1000000) {
                this.totaljobs =
                  (parseInt(dashResult["total_jobs"]) / 1000000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "M";
              } else if (parseInt(dashResult["total_jobs"]) >= 1000) {
                this.totaljobs =
                  (parseInt(dashResult["total_jobs"]) / 1000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "K";
              } else {
                this.totaljobs = dashResult["total_jobs"];
              }
            }
            if (dashResult["total_lubes"] == null) {
              this.totallube = "0";
            } else {
              if (parseInt(dashResult["total_lubes"]) >= 1000000000) {
                this.totallube =
                  (parseInt(dashResult["total_lubes"]) / 1000000000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "G";
              } else if (parseInt(dashResult["total_lubes"]) >= 1000000) {
                this.totallube =
                  (parseInt(dashResult["total_lubes"]) / 1000000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "M";
              } else if (parseInt(dashResult["total_lubes"]) >= 1000) {
                this.totallube =
                  (parseInt(dashResult["total_lubes"]) / 1000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "K";
              } else {
                this.totallube = dashResult["total_lubes"];
              }
            }
            if (dashResult["total_spares"] == null) {
              this.totalspare = "0";
            } else {
              if (parseInt(dashResult["total_spares"]) >= 1000000000) {
                this.totalspare =
                  (parseInt(dashResult["total_spares"]) / 1000000000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "G";
              } else if (parseInt(dashResult["total_spares"]) >= 1000000) {
                this.totalspare =
                  (parseInt(dashResult["total_spares"]) / 1000000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "M";
              } else if (parseInt(dashResult["total_spares"]) >= 1000) {
                this.totalspare =
                  (parseInt(dashResult["total_spares"]) / 1000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "K";
              } else {
                this.totalspare = dashResult["total_spares"];
              }
            }

            this.total_quantity = dashResult["total_quantity"];
            this.total_spares_amount = dashResult["total_spares_amount"];
            this.total_lubes_amount = dashResult["total_lubes_amount"];
            this.total_jobs_amount = dashResult["total_jobs_amount"];
            if (dashResult["total_quantity_of_inven"] == null) {
              this.total_quantity_of_inven = "0";
            } else {
              if (
                parseInt(dashResult["total_quantity_of_inven"]) >= 1000000000
              ) {
                this.total_quantity_of_inven =
                  (parseInt(dashResult["total_quantity_of_inven"]) / 1000000000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "G";
              } else if (
                parseInt(dashResult["total_quantity_of_inven"]) >= 1000000
              ) {
                this.total_quantity_of_inven =
                  (parseInt(dashResult["total_quantity_of_inven"]) / 1000000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "M";
              } else if (
                parseInt(dashResult["total_quantity_of_inven"]) >= 1000
              ) {
                this.total_quantity_of_inven =
                  (parseInt(dashResult["total_quantity_of_inven"]) / 1000)
                    .toFixed(1)
                    .replace(/\.0$/, "") + "K";
              } else {
                this.total_quantity_of_inven =
                  dashResult["total_quantity_of_inven"];
              }
            }
            //console.log(dashResult.has_next)
            if (dashResult.has_next == true) {
              //console.log(dashResult.has_next)
              this.hasnext = true;
              this.nextUrl = dashResult.next_page;
            } else {
              this.hasnext = false;
              this.nextUrl = "";
            }
            var tabelDataForMap: any;
            if (mode == "lube") {
              tabelDataForMap = dashResult["lubedata"];
            } else if (mode == "spare") {
              tabelDataForMap = dashResult["sparedata"];
            } else if (mode == "job") {
              tabelDataForMap = dashResult["jobdata"];
            }
            this.tabelData = tabelDataForMap.map(function (tabelinfo) {
              if (
                tabelinfo.vechile_details != null &&
                tabelinfo.vechile_details != ""
              ) {
                var vechile_details_sorted = JSON.parse(
                  tabelinfo.vechile_details.replace(/\\/g, "")
                );
              }
              tabelinfo.vechile_details = vechile_details_sorted;
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
            this.showspinner.setSpinner(false);
          } else {
            this.showspinner.setSpinner(false);
            this.snakBar.open("Error", "", {
              duration: 4000,
            });
          }
          //this.data = this.tabelData
          var unique = this.tabelData.filter(
            (
              (set) => (f) =>
                !set.has(f.part_number || f.is_master == "false") &&
                set.add(f.part_number)
            )(new Set())
          );

          this.dataSource = new MatTableDataSource(unique);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  // Pagination API
  getDataForPagination() {
    this.generalService.inventorypageination(this.nextUrl).subscribe(
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
          var tabelDataForMap: any;
          if (this.selectedOption == "lube") {
            tabelDataForMap = dashResult["lubedata"];
          } else if (this.selectedOption == "spare") {
            tabelDataForMap = dashResult["sparedata"];
          } else if (this.selectedOption == "job") {
            tabelDataForMap = dashResult["jobdata"];
          }
          for (var i = 0; i < Object.values(tabelDataForMap).length; i++) {
            if (
              tabelDataForMap[i].vechile_details != null &&
              tabelDataForMap[i].vechile_details != ""
            ) {
              var vehicle_details = JSON.parse(
                tabelDataForMap[i].vechile_details.replace(/\\/g, "")
              );
            }
            tabelDataForMap[i].vechile_details = vehicle_details;
            this.tabelData.push(tabelDataForMap[i]);
          }
          //this.data = this.tabelData
          var unique = this.tabelData.filter(
            (
              (set) => (f) =>
                !set.has(f.part_number || f.is_master == "false") &&
                set.add(f.part_number)
            )(new Set())
          );

          this.dataSource = new MatTableDataSource(unique);
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
  }
  // Search API
  getDataForSearch() {
  
    this.generalService
      .inventoryDashboard(
        this.userserviceworkshopid,
        this.invenstatus,
        this.search_keywords,
        this.vechileTypetoshow.toString(),
        this.selectedQty

      )
      .subscribe(
        (dashResult) => {
          if (dashResult.success == false) {
            this.states = [];
            this.states.push("No data Found");
            this.showspinner.setSpinner(false);
          } else if (dashResult.success == true) {
            this.states = [];
            if (this.invenstatus == "spare") {
              var dataset = Object.values(dashResult["sparedata"]);
            } else if (this.invenstatus == "lube") {
              var dataset = Object.values(dashResult["lubedata"]);
            } else {
              var dataset = Object.values(dashResult["jobdata"]);
            }

            for (var i = 0; i < dataset.length; i++) {
              this.states.push(
                dataset[i]["part_name"] +
                  ", " +
                  dataset[i]["part_number"] +
                  ", " +
                  dataset[i]["category"]
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
  //---------------------------------------------------------------------------------------------------------------
  //---------------------------------------------SPARES------------------------------------------------------------
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
  // Selecte company
  selectedcomapny(event, category) {
    if (event != undefined) {
      if (category == "spare") {
        this.CreateSpareForm.controls["companynameSpare"].setValue(event, {
          onlySelf: true,
        });
        this.checkcopnay = event;
      } else if (category == "lube") {
        this.CreateLubeForm.controls["companynameLube"].setValue(event, {
          onlySelf: true,
        });
        this.checkcopnay = event;
      }
    }
  }
  // Search bar for comapany
  searchBarForCompany(event, category) {
    this.generalService.searchCompanyName(event, category).subscribe(
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
  // select company for lube
  searchBarForCompanyLube(event, category) {
    this.generalService.searchCompanyName(event, category).subscribe(
      (searchData) => {
        if (searchData["success"] == true) {
          this.searchLubeCompany = [];
          searchData["companydetails"].map((data) => {
            this.searchLubeCompany.push(data["company_name"]);
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
  //API call to Create New Spare
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
    if (this.allSelectedMake.length === 0) {
      this.allSelectedMake.push({
        make: "All",
        model: "All",
        variant: "All",
      });
    }

    this.generalService
      .saveJobSapreLubeProfile(
        "spare",
        mode,
        part_number,
        this.CreateSpareForm.getRawValue().partname,
        "",
        this.CreateSpareForm.getRawValue().unit,
        "spare",
        this.CreateSpareForm.getRawValue().subcategory,
        "",
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
        this.checkcopnay,
        this.userserviceworkshopid
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
          this.checkStatus("spare", "pen");
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  showSpareUpdate: boolean = false;
  searchSpareData = Array();
  //push the seach Spare Resultin the aray so that user can seelect the Spare from dropdown
  searchSpareInput(event) {
    //this.searchSpareData=[]
    this.generalService
      .getJobSpareLube(this.userserviceworkshopid, "spare", event)
      .subscribe(
        (SpareSearchData) => {
          this.showspinner.setSpinner(true);
          if (SpareSearchData.success == true) {
            if (SpareSearchData.sparedata != undefined) {
              for (var i = 0; i < SpareSearchData.sparedata.length; i++) {
                if (SpareSearchData.sparedata[i].unit_sale_price != "") {
                  this.searchSpareData.push(
                    SpareSearchData.sparedata[i].part_name +
                      "------" +
                      SpareSearchData.sparedata[i].part_number +
                      "------" +
                      SpareSearchData.sparedata[i].unit_sale_price
                  );
                } else {
                  this.searchSpareData.push(
                    SpareSearchData.sparedata[i].part_name +
                      "------" +
                      SpareSearchData.sparedata[i].part_number
                  );
                }
              }
            }
          } else {
            this.searchSpareData = [];
          }
          this.showspinner.setSpinner(false);
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open(err, ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  //push the seach Spare Resultin the aray so that user can seelect the Spare from dropdown in side popup
  searchSpareInputToCreate(event) {
    this.searchSpareDataForCreate = [];
    this.generalService
      .getJobSpareLube(this.userserviceworkshopid, "spare", event)
      .subscribe(
        (SpareSearchData) => {
          this.showspinner.setSpinner(true);
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
          this.showspinner.setSpinner(false);
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open(err, ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  //search the spare
  searchSpareInputnew(event) {
    //this.searchSpareData=[]
    this.generalService
      .getJobSpareLube(this.userserviceworkshopid, "spare", event)
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
  //load the search data
  loadMoreDataspare() {
    if (this.sparenextpage != "none") {
      setTimeout(
        () =>
          this.generalService
            .inventorylsjpageination(this.sparenextpage)
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
                    this.searchSpareDatapagi = this.searchSpareData;
                    for (var i = 0; i < SpareSearchData.sparedata.length; i++) {
                      if (
                        !this.spareduplicate.includes(
                          SpareSearchData.sparedata[i].part_name
                        )
                      ) {
                        if (
                          SpareSearchData.sparedata[i].unit_sale_price != ""
                        ) {
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
  //add the result of the selected spare to update the spare details in side popup
  // add the selected result in the fields
  addselectedSpareResult(event, element) {
    this.allSelectedMake = [];
    this.dupseletecmodvari = [];

    if (element != undefined) {
      var workshopid = element["workshop_id"];
      this.generalService
        .getJobSpareLubeData(workshopid, "spare", event)
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
                  this.allSelectedMake.map((data) => {
                    this.dupseletecmodvari.push(
                      data.make + "--" + data.model + "--" + data.variant
                    );
                  });
                } else {
                  this.allSelectedMake = vehdetails;
                }
                // this.allSelectedMake.map((data) => {
                //   this.dupseletecmodvari.push(
                //     data.make + "  " + data.model + "  " + data.variant
                //   );
                // });
                // if(this.SelectedDataarrOfVehiclespl.make==undefined){
                //   this.SelectedDataarrOfVehiclespl={
                //     "make":this.SelectedDataarrOfVehiclespl.vehicle_make,
                //     "model":this.SelectedDataarrOfVehiclespl.vehicle_model,
                //     "variant":this.SelectedDataarrOfVehiclespl.vehicle_variant,
                //   }
                // }
                // if(this.SelectedDataarrOfVehiclespl.make=='All'){
                //   this.foralltrue=true
                // }

                // this.allSelectedMake.map((data) => {
                //   this.dupseletecmodvari.push(data.make);
                // });
                this.allSelectedMake.map((data) => {
                  this.dupseletecmodvari.push(
                    data.make + "--" + data.model + "--" + data.variant
                  );
                });

                this.sparemaster = SpareData.sparedata[0].is_master;
                this.spareworkshop = SpareData.sparedata[0].workshop_id;

                this.CreateSpareForm.controls["searchspareVehicle"].setValue(
                  this.dupseletecmodvari
                );
                this.CreateSpareForm.controls["partname"].setValue(
                  SpareData.sparedata[0].part_name,
                  { onlySelf: true }
                );
                this.CreateSpareForm.controls["companynameSpare"].setValue(
                  SpareData.sparedata[0].company_name,
                  { onlySelf: true }
                );
                this.checkcopnay = SpareData.sparedata[0].company_name;
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
              this.checkcopnay = "";
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
              this.CreateSpareForm.controls["gsttype"].setValue(
                this.gsttype[0],
                { onlySelf: true }
              );
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
  }
  // add the selected result in the fields
  addselectedSpareResultsearch(event) {
    this.allSelectedMake = [];
    this.dupseletecmodvari = [];
    var workshopid = this.userserviceworkshopid;
    this.generalService
      .getJobSpareLubeData(workshopid, "spare", event)
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
              // this.SelectedDataarrOfVehiclespl=JSON.parse(SpareData.sparedata[0].vechile_details)
              // if(this.SelectedDataarrOfVehiclespl.make==undefined){
              //   this.SelectedDataarrOfVehiclespl={
              //     "make":this.SelectedDataarrOfVehiclespl.vehicle_make,
              //     "model":this.SelectedDataarrOfVehiclespl.vehicle_model,
              //     "variant":this.SelectedDataarrOfVehiclespl.vehicle_variant,
              //   }
              // }
              // if(this.SelectedDataarrOfVehiclespl.make=='All'){
              //   this.foralltrue=true
              // }
              this.sparemaster = SpareData.sparedata[0].is_master;
              this.spareworkshop = SpareData.sparedata[0].workshop_id;
              this.CreateSpareForm.controls["searchspareVehicle"].setValue("");
              this.CreateSpareForm.controls["partname"].setValue(
                SpareData.sparedata[0].part_name,
                { onlySelf: true }
              );
              this.CreateSpareForm.controls["companynameSpare"].setValue(
                SpareData.sparedata[0].company_name,
                { onlySelf: true }
              );
              this.checkcopnay = SpareData.sparedata[0].company_name;
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
            this.checkcopnay = "";
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
  // Open sapre popup
  openSparepopup() {
    this.showjobsdata = false;
    this.foralltrue = false;
    this.allSelectedMake = [];
    this.dupseletecmodvari = [];
    this.showSpareUpdate = false;
    this.checkcopnay = "";
    this.SelectedDataarrOfVehiclespl = undefined;
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
  //---------------------------------------------------------------------------------------------------------------
  //---------------------------------------------LUBES------------------------------------------------------------
  // Create New Lube form with validations
  createLubeForm() {
    this.CreateLubeForm = this.formbuild.group({
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
    var purchase_qty = this.CreateLubeForm.getRawValue().quantity;
    var purchase_total_amount = 0;
    var purchase_discount = "";
    var purchase_cgst = 0;
    var purchase_sgst = 0;
    var purchase_igst = 0;
    var purchase_total_gst = 0;
    var sale_qty = this.CreateLubeForm.getRawValue().quantity;
    var sale_total_amount = 0;
    var sale_discount = "";
    var sale_cgst = 0;
    var sale_sgst = 0;
    var sale_igst = 0;
    var sale_total_gst = 0;
    if (mode == "update" && this.lubemaster == "True") {
      mode = "create";
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
    if (this.allBillingData.gst_number != "") {
      if (this.CreateLubeForm.getRawValue().gsttype == this.gsttype[0]) {
        if (this.CreateLubeForm.getRawValue().purchaseprice != 0) {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateLubeForm.getRawValue().purchaseprice.toString(),
            this.CreateLubeForm.getRawValue().gstslab,
            this.gsttype[0]
          );
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        } else {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateLubeForm.getRawValue().sellingprice.toString(),
            this.CreateLubeForm.getRawValue().gstslab,
            this.gsttype[0]
          );
          sale_total_amount = GSTCal[0]["totalamount"];
          sale_cgst = GSTCal[0]["CGST"];
          sale_sgst = GSTCal[0]["SGST"];
          sale_total_gst = GSTCal[0]["GSTAmount"];
          this.CreateLubeForm.getRawValue().purchaseprice =
            this.CreateLubeForm.getRawValue().sellingprice;
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        }
      } else {
        if (this.CreateLubeForm.getRawValue().purchaseprice != 0) {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateLubeForm.getRawValue().purchaseprice.toString(),
            this.CreateLubeForm.getRawValue().gstslab,
            this.gsttype[1]
          );
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        } else {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateLubeForm.getRawValue().sellingprice.toString(),
            this.CreateLubeForm.getRawValue().gstslab,
            this.gsttype[1]
          );
          sale_total_amount = GSTCal[0]["totalamount"];
          sale_cgst = GSTCal[0]["CGST"];
          sale_sgst = GSTCal[0]["SGST"];
          sale_total_gst = GSTCal[0]["GSTAmount"];
          this.CreateLubeForm.getRawValue().purchaseprice =
            this.CreateLubeForm.getRawValue().sellingprice;
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        }
      }
    } else {
      if (this.CreateLubeForm.getRawValue().purchaseprice == 0) {
        this.CreateLubeForm.getRawValue().purchaseprice =
          this.CreateLubeForm.getRawValue().sellingprice;
      }
    }
    if (this.allSelectedMake.length === 0) {
      this.allSelectedMake.push({
        make: "All",
        model: "All",
        variant: "All",
      });
    }
    this.generalService
      .saveJobSapreLubeProfile(
        "lube",
        mode,
        part_number,
        this.CreateLubeForm.getRawValue().partname,
        "",
        this.CreateLubeForm.getRawValue().unit,
        "lube",
        "",
        "",
        this.CreateLubeForm.getRawValue().subcategory,
        JSON.stringify(this.allSelectedMake),
        this.CreateLubeForm.getRawValue().quantity,
        this.CreateLubeForm.getRawValue().lowerlimit,
        this.CreateLubeForm.getRawValue().rackno,
        this.CreateLubeForm.getRawValue().hsnno,
        this.CreateLubeForm.getRawValue().purchaseprice,
        purchase_qty,
        this.CreateLubeForm.getRawValue().gstslab,
        this.CreateLubeForm.getRawValue().gsttype,
        purchase_total_amount,
        purchase_discount,
        purchase_cgst,
        purchase_sgst,
        purchase_igst,
        purchase_total_gst,
        this.CreateLubeForm.getRawValue().sellingprice,
        sale_qty,
        this.CreateLubeForm.getRawValue().gstslab,
        this.CreateLubeForm.getRawValue().gsttype,
        sale_total_amount,
        sale_discount,
        sale_cgst,
        sale_sgst,
        sale_igst,
        sale_total_gst,
        this.checkcopnay,
        this.userserviceworkshopid
      )
      .subscribe(
        (SaveResult) => {
          this.showspinner.setSpinner(true);
          if (SaveResult.success == true) {
            this.showspinner.setSpinner(false);
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
          this.checkStatus("lube", "com");
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  //push the seach Lube Resultin the aray so that user can seelect the Lube from dropdown
  searchLubeInput(event) {
    //this.searchLubeData=[]
    this.generalService
      .getJobSpareLube(this.userserviceworkshopid, "lube", event)
      .subscribe(
        (LubeSearchData) => {
          this.showspinner.setSpinner(true);
          if (LubeSearchData.success == true) {
            if (LubeSearchData.sparedata != undefined) {
              for (var i = 0; i < LubeSearchData.lubedata.length; i++) {
                if (LubeSearchData.lubedata[i].unit_sale_price != "") {
                  this.searchLubeData.push(
                    LubeSearchData.lubedata[i].part_name +
                      "------" +
                      LubeSearchData.lubedata[i].part_number +
                      "------" +
                      LubeSearchData.lubedata[i].unit_sale_price
                  );
                } else {
                  this.searchLubeData.push(
                    LubeSearchData.lubedata[i].part_name +
                      "------" +
                      LubeSearchData.lubedata[i].part_number
                  );
                }
              }
            }
          } else {
            this.searchLubeData = [];
            //this.searchLubeData.push("No Data Found")
          }
          this.showspinner.setSpinner(false);
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open(err, ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  // Search the lube data
  searchLubeInputnew(event) {
    //this.searchLubeData=[]
    this.generalService
      .getJobSpareLube(this.userserviceworkshopid, "lube", event)
      .subscribe(
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
                if (
                  !this.lubeduplicate.includes(
                    LubeSearchData.lubedata[i].part_name
                  )
                ) {
                  if (LubeSearchData.lubedata[i].unit_sale_price != "") {
                    this.lubeduplicate.push(
                      LubeSearchData.lubedata[i].part_name
                    );
                    this.searchLubeDatasec.push(
                      LubeSearchData.lubedata[i].part_number
                    );
                  } else {
                    this.lubeduplicate.push(
                      LubeSearchData.lubedata[i].part_name
                    );
                    this.searchLubeDatasec.push(
                      LubeSearchData.lubedata[i].part_number
                    );
                  }
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
  // load the paginated data
  loadMoreDatalube() {
    if (this.lubenextpage != "none") {
      setTimeout(
        () =>
          this.generalService
            .inventorylsjpageination(this.lubenextpage)
            .subscribe(
              (LubeSearchData) => {
                this.showspinner.setSpinnerForLogin(true);
                if (LubeSearchData.success == true) {
                  if (LubeSearchData.lubedata != undefined) {
                    if (LubeSearchData["next_page"] != "Nonextpage") {
                      this.lubenextpage = LubeSearchData["next_page"];
                    } else {
                      this.lubenextpage = "none";
                    }
                    this.searchLubeDatapagi = this.searchLubeData;
                    for (var i = 0; i < LubeSearchData.lubedata.length; i++) {
                      if (
                        !this.lubeduplicate.includes(
                          LubeSearchData.lubedata[i].part_name
                        )
                      ) {
                        if (LubeSearchData.lubedata[i].unit_sale_price != "") {
                          this.lubeduplicate.push(
                            LubeSearchData.lubedata[i].part_name
                          );
                          this.searchLubeDatapagi.push(
                            LubeSearchData.lubedata[i].part_number
                          );
                        } else {
                          this.lubeduplicate.push(
                            LubeSearchData.lubedata[i].part_name
                          );
                          this.searchLubeDatapagi.push(
                            LubeSearchData.lubedata[i].part_number
                          );
                        }
                      }
                    }
                    this.searchLubeData = [];
                    setTimeout(
                      () => (this.searchLubeData = this.searchLubeDatapagi),
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
  //push the seach Lube Resultin the aray so that user can seelect the Lube from dropdown in side popup
  searchLubeInputToCreate(event) {
    this.searchLubeDataForCreate = [];
    this.generalService
      .getJobSpareLube(this.userserviceworkshopid, "lube", event)
      .subscribe(
        (LubeSearchData) => {
          this.showspinner.setSpinner(true);
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
          this.showspinner.setSpinner(false);
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open(err, ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  //add the result of the selected lube to update the lube details in side popup
  // add the selected result in the fields
  addselectedLubeResult(event, element) {
    this.allSelectedMake = [];
    this.dupseletecmodvari = [];
    if (element != undefined) {
      this.generalService
        .getJobSpareLubeData(element["workshop_id"], "lube", event)
        .subscribe(
          (lubeData) => {
            if (event != "" && lubeData.lubedata != undefined) {
              if (lubeData.success == true) {
                var vechilevariant = JSON.parse(
                  lubeData.lubedata[0].vechile_details.replace(/\\/g, "")
                );
                this.foralltrue = false;
                var vehdetails = JSON.parse(
                  lubeData.lubedata[0].vechile_details
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
                // this.allSelectedMake.map((data) => {
                //   this.dupseletecmodvari.push(
                //     data.make + "  " + data.model + "  " + data.variant
                //   );
                // });

                this.allSelectedMake.map((data) => {
                  this.dupseletecmodvari.push(
                    data.make + "--" + data.model + "--" + data.variant
                  );
                });
                this.lubemaster = lubeData.lubedata[0].is_master;
                this.lubeworkshop = lubeData.lubedata[0].workshop_id;
                this.CreateLubeForm.controls["searchspareVehicle"].setValue(
                  this.dupseletecmodvari
                );
                this.CreateLubeForm.controls["partname"].setValue(
                  lubeData.lubedata[0].part_name,
                  { onlySelf: true }
                );
                this.CreateLubeForm.controls["companynameLube"].setValue(
                  lubeData.lubedata[0].company_name,
                  { onlySelf: true }
                );
                this.checkcopnay = lubeData.lubedata[0].company_name;
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
              this.checkcopnay = "";
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
              this.CreateLubeForm.controls["gsttype"].setValue(
                this.gsttype[0],
                { onlySelf: true }
              );
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
  }
  // add the selected result in the fields
  addselectedLubeResultlube(event) {
    this.allSelectedMake = [];
    this.dupseletecmodvari = [];
    this.generalService
      .getJobSpareLubeData(this.userserviceworkshopid, "lube", event)
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
              this.lubemaster = lubeData.lubedata[0].is_master;
              this.lubeworkshop = lubeData.lubedata[0].workshop_id;
              this.CreateLubeForm.controls["searchspareVehiclemod"].setValue(
                ""
              );
              this.CreateLubeForm.controls["searchspareVehicle"].setValue("");
              this.CreateLubeForm.controls["partname"].setValue(
                lubeData.lubedata[0].part_name,
                { onlySelf: true }
              );
              this.CreateLubeForm.controls["companynameLube"].setValue(
                lubeData.lubedata[0].company_name,
                { onlySelf: true }
              );
              this.checkcopnay = lubeData.lubedata[0].company_name;
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
            this.checkcopnay = "";
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
  //open the popup to create or update the lube
  openLubepopup() {
    this.showjobsdata = false;
    this.allSelectedMake = [];
    this.dupseletecmodvari = [];
    this.foralltrue = false;
    this.SelectedDataarrOfVehiclespl = undefined;
    this.showLubeUpdate = false;
    this.checkcopnay = "";
    this.CreateLubeForm.controls["partnumber"].setValue(undefined, {
      onlySelf: true,
    });
    this.CreateLubeForm.controls["sellingprice"].setValue(null);
    this.CreateLubeForm.controls["companynameLube"].setValue("");
    this.CreateLubeForm.controls["partname"].setValue("");
    this.CreateLubeForm.controls["searchspareVehiclemod"].setValue("");
    this.CreateLubeForm.controls["searchspareVehicle"].setValue("");
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
  //---------------------------------------------------------------------------------------------------------------
  //---------------------------------------------JOBS------------------------------------------------------------
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
    var purchase_qty = this.CreateJobForm.getRawValue().quantity;
    var purchase_total_amount = 0;
    var purchase_discount = "";
    var purchase_cgst = 0;
    var purchase_sgst = 0;
    var purchase_igst = 0;
    var purchase_total_gst = 0;
    var sale_qty = this.CreateJobForm.getRawValue().quantity;
    var sale_total_amount = 0;
    var sale_discount = "";
    var sale_cgst = 0;
    var sale_sgst = 0;
    var sale_igst = 0;
    var sale_total_gst = 0;
    if (mode == "update" && this.jobmaster == "True") {
      mode = "create";
    }
    if (this.allBillingData.gst_number != "") {
      if (this.CreateJobForm.getRawValue().gsttype == this.gsttype[0]) {
        if (this.CreateJobForm.getRawValue().purchaseprice != 0) {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateJobForm.getRawValue().purchaseprice.toString(),
            this.CreateJobForm.getRawValue().gstslab,
            this.gsttype[0]
          );
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        } else {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateJobForm.getRawValue().sellingprice.toString(),
            this.CreateJobForm.getRawValue().gstslab,
            this.gsttype[0]
          );
          sale_total_amount = GSTCal[0]["totalamount"];
          sale_cgst = GSTCal[0]["CGST"];
          sale_sgst = GSTCal[0]["SGST"];
          sale_total_gst = GSTCal[0]["GSTAmount"];
          this.CreateJobForm.getRawValue().purchaseprice =
            this.CreateJobForm.getRawValue().sellingprice;
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        }
      } else {
        if (this.CreateJobForm.getRawValue().purchaseprice != 0) {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateJobForm.getRawValue().purchaseprice.toString(),
            this.CreateJobForm.getRawValue().gstslab,
            this.gsttype[1]
          );
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        } else {
          var GSTCal = this.CalculateInclusiveGSTRate(
            this.CreateJobForm.getRawValue().sellingprice.toString(),
            this.CreateJobForm.getRawValue().gstslab,
            this.gsttype[1]
          );
          sale_total_amount = GSTCal[0]["totalamount"];
          sale_cgst = GSTCal[0]["CGST"];
          sale_sgst = GSTCal[0]["SGST"];
          sale_total_gst = GSTCal[0]["GSTAmount"];
          this.CreateJobForm.getRawValue().purchaseprice =
            this.CreateJobForm.getRawValue().sellingprice;
          purchase_cgst = GSTCal[0]["CGST"];
          purchase_sgst = GSTCal[0]["SGST"];
          purchase_total_gst = GSTCal[0]["GSTAmount"];
          purchase_total_amount = GSTCal[0]["totalamount"];
        }
      }
    } else {
      if (this.CreateJobForm.getRawValue().purchaseprice == 0) {
        this.CreateJobForm.getRawValue().purchaseprice =
          this.CreateJobForm.getRawValue().sellingprice;
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
    if (this.allSelectedMake.length === 0) {
      this.allSelectedMake.push({
        make: "All",
        model: "All",
        variant: "All",
      });
    }
    this.generalService
      .saveJobSapreLubeProfile(
        "job",
        mode,
        part_number,
        this.CreateJobForm.getRawValue().partname,
        "",
        this.CreateJobForm.getRawValue().unit,
        "job",
        "",
        this.CreateJobForm.getRawValue().subcategory,
        "",
        JSON.stringify(this.allSelectedMake),
        this.CreateJobForm.getRawValue().quantity,
        this.CreateJobForm.getRawValue().lowerlimit,
        this.CreateJobForm.getRawValue().rackno,
        this.CreateJobForm.getRawValue().hsnno,
        this.CreateJobForm.getRawValue().purchaseprice,
        purchase_qty,
        this.CreateJobForm.getRawValue().gstslab,
        this.CreateJobForm.getRawValue().gsttype,
        purchase_total_amount,
        purchase_discount,
        purchase_cgst,
        purchase_sgst,
        purchase_igst,
        purchase_total_gst,
        this.CreateJobForm.getRawValue().sellingprice,
        sale_qty,
        this.CreateJobForm.getRawValue().gstslab,
        this.CreateJobForm.getRawValue().gsttype,
        sale_total_amount,
        sale_discount,
        sale_cgst,
        sale_sgst,
        sale_igst,
        sale_total_gst,
        this.CreateJobForm.getRawValue().companynameJob,
        this.userserviceworkshopid
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
          this.checkStatus("job", "clo");
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  //push the seach Job Resultin the aray so that user can seelect the Job from dropdown in side popup
  searchJobInputToCreate(event) {
    this.searchJobDataForCreate = [];
    this.generalService
      .getJobSpareLube(this.userserviceworkshopid, "job", event)
      .subscribe(
        (JobSearchData) => {
          this.showspinner.setSpinner(true);
          if (JobSearchData.success == true) {
            if (JobSearchData.jobdata != undefined) {
              for (var i = 0; i < JobSearchData.jobdata.length; i++) {
                if (JobSearchData.jobdata[i].is_master == "false") {
                  this.searchJobDataForCreate.push(
                    JobSearchData.jobdata[i].part_number
                  );
                }
              }
            }
          } else {
            this.searchJobDataForCreate = [];
          }
          this.showspinner.setSpinner(false);
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open(err, ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  //add the result of the selected job to update the job details in side popup
  addselectedJobResult(event, element) {
    this.allSelectedMake = [];
    this.dupseletecmodvari = [];
    if (element != undefined) {
      this.generalService
        .getJobSpareLubeData(element["workshop_id"], "job", event)
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
                // this.allSelectedMake.map((data) => {
                //   this.dupseletecmodvari.push(
                //     data.make + "  " + data.model + "  " + data.variant
                //   );
                // });
                this.allSelectedMake.map((data) => {
                  this.dupseletecmodvari.push(
                    data.make + "--" + data.model + "--" + data.variant
                  );
                });

                this.jobmaster = jobData.jobdata[0].is_master;
                this.jobworkshop = jobData.jobdata[0].workshop_id;
                this.CreateJobForm.controls["searchspareVehiclemod"].setValue(
                  ""
                );
                this.CreateJobForm.controls["searchspareVehicle"].setValue(
                  this.dupseletecmodvari
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
  }
  // add the selected result in the fields
  addselectedJobResultnew(event) {
    this.allSelectedMake = [];
    this.dupseletecmodvari = [];
    this.generalService
      .getJobSpareLubeData(this.userserviceworkshopid, "job", event)
      .subscribe(
        (jobData) => {
          if (event != "" && jobData.jobdata != undefined) {
            if (jobData.success == true) {
              var vechilevariant = JSON.parse(
                jobData.jobdata[0].vechile_details.replace(/\\/g, "")
              );
              this.foralltrue = false;
              this.SelectedDataarrOfVehiclespl = JSON.parse(
                jobData.jobdata[0].vechile_details
              );
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
              this.jobmaster = jobData.jobdata[0].is_master;
              this.jobworkshop = jobData.jobdata[0].workshop_id;
              this.CreateJobForm.controls["searchspareVehiclemod"].setValue("");
              this.CreateJobForm.controls["searchspareVehicle"].setValue("");
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
  // search job data
  searchJobInput(event) {
    this.generalService
      .getJobSpareLube(this.userserviceworkshopid, "job", event)
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
              for (var i = 0; i < JobSearchData.jobdata.length; i++) {
                if (
                  !this.jobduplicate.includes(
                    JobSearchData.jobdata[i].part_name
                  )
                ) {
                  if (JobSearchData.jobdata[i].unit_sale_price != "") {
                    this.jobduplicate.push(JobSearchData.jobdata[i].part_name);
                    this.searchJobDatasec.push(
                      JobSearchData.jobdata[i].part_number
                    );
                  } else {
                    this.jobduplicate.push(JobSearchData.jobdata[i].part_name);
                    this.searchJobDatasec.push(
                      JobSearchData.jobdata[i].part_number
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
  // load paginated data
  loadMoreDatajobs() {
    if (this.jobsnextpage != "none") {
      setTimeout(
        () =>
          this.generalService
            .inventorylsjpageination(this.jobsnextpage)
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
                    this.searchJobDatapaginate = this.searchJobData;
                    for (var i = 0; i < JobSearchData.jobdata.length; i++) {
                      if (
                        !this.jobduplicate.includes(
                          JobSearchData.jobdata[i].part_name
                        )
                      ) {
                        if (JobSearchData.jobdata[i].unit_sale_price != "") {
                          this.jobduplicate.push(
                            JobSearchData.jobdata[i].part_name
                          );
                          this.searchJobDatapaginate.push(
                            JobSearchData.jobdata[i].part_number
                          );
                        } else {
                          this.jobduplicate.push(
                            JobSearchData.jobdata[i].part_name
                          );
                          this.searchJobDatapaginate.push(
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
  //open the popup to create or update the job
  openJobpopup() {
    this.showjobsdata = true;
    this.allSelectedMake = [];
    this.dupseletecmodvari = [];
    this.foralltrue = false;
    this.SelectedDataarrOfVehiclespl = undefined;
    this.showJobUpdate = false;
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
  openGrouppopup() {
    // this.showjobsdata = true;
    this.allSelectedMake = [];
    this.dupseletecmodvari = [];
    this.SelectedDataarrOfVehiclespl = [
      {
        make: "All",
        model: "All",
        variant: "All",
      },
    ];
    this.group_name = "";
    this.groupdatatable = Array();
    this.group_model = "";
    this.duplicategroup = Array();
    this.groupduplicate = Array();
    this.foralltrue = false;
    this.SelectedDataarrOfVehiclespl = undefined;
    this.showJobUpdate = false;

    this.totalamountonform = 0;
    this.toShowcgst = 0;
    this.toShowsgst = 0;
    this.toShowtotal_gst = 0;

    this.groupTotal = 0;
    this.groupLubeTotal = 0;
    this.groupLubeQty = 0;
    this.groupSpareotal = 0;
    this.groupSpareQty = 0;
    this.groupJobTotal = 0;
    this.groupJobQty = 0;
  }
  //---------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------SHARED---------------------------------------------------------
  //Calcutae the GST rate
  CalculateInclusiveGSTRate(price, rate, type) {
    if (type == "Inclusive") {
      var GSTAmount =
        parseInt(price) - parseInt(price) * (100 / (100 + parseInt(rate)));
      var CGST = GSTAmount / 2;
      var SGST = CGST;
      var totalamount = parseInt(price) - GSTAmount;
    } else {
      var GSTAmount = (parseInt(price) * parseInt(rate)) / 100;
      var CGST = GSTAmount / 2;
      var SGST = CGST;
      var totalamount = parseInt(price) + GSTAmount;
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
  // Search for vechile
  selectedResultForVechilespl(event) {
    if (event != undefined) {
      var splitedevent = event.split(" ");
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
  // Search vechile
  searchBarForVechilespl(event) {
    this.searchVehicleDataSpl = [];
    this.mainVehiclearrspl = [];
    this.generalService
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
  // add the vehcicles
  //sania
  forAllVehicles(event) {
    if (event.currentTarget.checked == true) {
      this.foralltrue = true;
      this.SelectedDataarrOfVehiclespl = {
        make: "All",
        model: "All",
        variant: "All",
      };
      this.allSelectedMake.push(this.SelectedDataarrOfVehiclespl);
    } else {
      this.foralltrue = false;
      this.SelectedDataarrOfVehiclespl = undefined;
      this.allSelectedMake = [];
      this.dupseletecmodvari = [];
    }
  }
  forAllVehiclesGroup(event) {
    if (event.currentTarget.checked == true) {
      this.foralltrue = true;

      this.SelectedDataarrOfVehiclespl = [
        {
          make: "All",
          model: "All",
          variant: "All",
        },
      ];

      this.allSelectedMake.push(this.SelectedDataarrOfVehiclespl);
    } else {
      this.foralltrue = false;
      this.SelectedDataarrOfVehiclespl = undefined;
      this.allSelectedMake = [];
      this.dupseletecmodvari = [];
    }
  }
  //Total Amount calculate
  checkpricefortotal(price, amount, type) {
    this.totalamountonform = price;
    if (this.allBillingData.gst_number != "") {
      var GSTCal = this.CalculateInclusiveGSTRate(price, amount, type);
      this.toShowcgst = GSTCal[0]["CGST"];
      this.toShowsgst = GSTCal[0]["SGST"];
      this.toShowtotal_gst = GSTCal[0]["GSTAmount"];
    }
  }
  //edit job sapre lubes
  editjobsparelube(category, partnumber, index, element) {
    if (category == "spare") {
      this.addselectedSpareResult(partnumber, element);
      this.CreateSpareForm.controls["partnumber"].setValue(partnumber, {
        onlySelf: true,
      });
    } else if (category == "lube") {
      this.addselectedLubeResult(partnumber, element);
      this.CreateLubeForm.controls["partnumber"].setValue(partnumber, {
        onlySelf: true,
      });
    } else if (category == "job") {
      this.addselectedJobResult(partnumber, element);
      this.CreateJobForm.controls["partnumber"].setValue(partnumber, {
        onlySelf: true,
      });
    }
  }
  //delte spare lube or jobs
  removesparejoblube(category, partnumber, index) {
    var questionForDialog;
    if (category == "spare") {
      questionForDialog =
        "Are You Sure Want to Delete the Spare having part number " +
        partnumber;
    } else if (category == "lube") {
      questionForDialog =
        "Are You Sure Want to Delete the Lube having part number " + partnumber;
    } else if (category == "job") {
      questionForDialog =
        "Are You Sure Want to Delete the Job having part number " + partnumber;
    }
    this.dialogService
      .OpenConfirmDialog(questionForDialog, true, "Delete")
      .subscribe((answer) => {
        if (answer == true) {
          this.generalService
            .deleteSpareJobLube(
              category,
              this.userserviceworkshopid,
              partnumber
            )
            .subscribe((delet) => {
              this.showspinner.setSpinner(true);
              if (delet["success"] == true) {
                this.showspinner.setSpinner(false);
                this.snakBar.open(
                  "Message",
                  category.charAt(0).toUpperCase() +
                    category.slice(1) +
                    " Deleted",
                  {
                    duration: 4000,
                  }
                );
                this.selectedOption = category;
                this.getTabelData(category);
              }
            });
        } else {
          this.showspinner.setSpinner(false);
          this.snakBar.open(
            "Message",
            category.charAt(0).toUpperCase() +
              category.slice(1) +
              " Not Deleted",
            {
              duration: 4000,
            }
          );
        }
      });
  }
  //Select Model Variant for the compatible
  selectModelVariForComp(event, category) {
    const index = this.searchModelvari.indexOf(event);
    // if (index > -1) {
    //   this.searchModelvari.splice(index, 1);
    // }
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
  // remove the selcted vehciel
  removemodve(modelindex, makeindex) {
    this.dupseletecmodvari.splice(makeindex, 1);
    this.allSelectedMake.splice(makeindex, 1);
  }
  //search model and varriant for compatible for
  // searc all vehciles
  searchModelVariforComp(event) {
    this.searchModelvari = [];
    this.generalService
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
  // load paginated data
  loadMoreDataveh() {
    if (this.vehnextpage != "none") {
      this.generalService.vehlsjpageination(this.vehnextpage).subscribe(
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

  onAdd(event) {
    this.dupseletecmodvari.push(event);
    this.allSelectedMake.push({
      make: event.split("--")[0],
      model: event.split("--")[1],
      variant: event.split("--")[2],
    });
    this.SelectedDataarrOfVehiclespl = this.allSelectedMake;
  }
  onRemove(event) {
    var temp = this.CreateSpareForm.get("searchspareVehicle").value;

    var index = this.dupseletecmodvari.indexOf(event.label);

    this.allSelectedMake.splice(index, 1);
    this.dupseletecmodvari.splice(index, 1);

    this.SelectedDataarrOfVehiclespl = this.allSelectedMake;
  }
  // search vehciles
  searchModelVariforCompfo(event) {
    this.searchModelvari = [];
    this.generalService
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

  downloadFile() {
    this.generalService.getInventoryCSV(
      this.userserviceworkshopid,
      this.invenstatus,
      this.search_keywords,
      this.vechileTypetoshow.toString(),
      this.selectedQty
    ).subscribe(response => {
    
      var startDateor = new Date();
      var endDate = new Date();
      var startDate =
        startDateor.getFullYear() +
        "-" +
        ("0" + (startDateor.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + startDateor.getDate()).slice(-2);
      
  
      let filename = "Inventory Quantity < " + this.selectedQty +
      this.userserviceworkshopid +
      "-(" +
      startDate +
      ")" ;
    (".csv");
    FileSaver.saveAs(response, filename);
    
    }
    );
  }
}
