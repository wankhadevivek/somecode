import { Component, OnInit, ViewChild } from "@angular/core";
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
import {
  NgbDate,
  NgbCalendar,
  NgbDateParserFormatter,
  NgbTypeahead,
} from "@ng-bootstrap/ng-bootstrap";
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
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, merge, Subject, forkJoin } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  filter,
} from "rxjs/operators";
import { AbstractService } from "../../services/comman/abstract.service";
@Component({
  selector: "app-onlinebook",
  templateUrl: "./onlinebook.component.html",
  styleUrls: ["./onlinebook.component.css"],
})
/**
 * In this component onlinebooking is done
 * ask the workshop to have the end -usr app or not
 */
export class OnlinebookComponent implements OnInit {
  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  tabeldata = Array();
  garageonline;
  workshopid;
  url_param;
  jobmodel;
  CreateJobForm: FormGroup;
  regex = /^-?\d+(\.\d{1,2})?$/;
  searchJobData = [];
  foralltrue: boolean = false;
  showJobUpdate: boolean = false;
  jobmodelforcreate: any;
  mainurl = this.abstract.newmainurl;
  searchVehicleDataSpl = [];
  mainurlparam;
  showsearchcnacel: boolean = false;
  duplicateJob = Array();
  showduplicatejob: boolean = false;
  duplicatejobname: string;
  jobdatatabel = Array();
  showlimiterror: boolean = false;
  contactlink;
  editIndex = null;
  jobduplicate = Array();
  jobsnextpage;
  searchJobDatasec = [];
  searchJobDatapaginate = [];
  SelectedDataarrOfVehiclespl;
  vehiclesearchmodelspl: any;
  mainVehiclearrspl = Array();
  jobduplicateinven = Array();
  jobsnextpageinven;
  searchJobDatasecinven = [];
  searchJobDatainven = Array();
  searchJobDatapaginateinven = [];
  jobmaster;
  jobworkshop;
  units = ["units", "gm", "ltr", "ml", "can", "pouch", "qty", "cm", "m"];
  gstNumberArr = ["0%", "5%", "12%", "18%", "28%"];
  totalamountonform = 0;
  today = new Date();
  allBillingData;
  gsttype = ["Exclusive", "Inclusive"];
  toShowcgst = 0;
  toShowsgst = 0;
  toShowtotal_gst = 0;
  JobCategory = ["in_house", "out_source"];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("instance", { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  constructor(
    public abstract: AbstractService,
    private formbuild: FormBuilder,
    public sendPDF: PrintsharepdfService,
    private showspinner: SpinnerService,
    private dialog: DilogOpenService,
    private userservice: UserserviceService,
    public generalservice: GeneralService,
    private snakBar: MatSnackBar
  ) {
    this.workshopid = this.userservice.getData()["workshop_id"];
    this.createJobForm();
  }
  vechileResult = (result: string) => result.toUpperCase();
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
  // get all bookinks
  ngOnInit() {
    this.displayedColumns = ["sr_no", "name_and_des", "price", "action"];

    forkJoin(
      this.generalservice.getJobcardSettings(this.workshopid),
      this.generalservice.getLInkStatus(this.workshopid),
      this.generalservice.onlineServiceDashboard(this.workshopid)
    ).subscribe(
      ([settingdata, datalink, dashboard]) => {
        this.showspinner.setSpinner(true);
        var settingBillingDataJson = JSON.parse(
          settingdata.jobcard_Settings.settings_billing.replace(/\\/g, "")
        );
        this.allBillingData = settingBillingDataJson[0];
        if (datalink.success == true) {
          if (datalink.online_garage == "true") {
            this.garageonline = "true";
            this.mainurlparam = datalink.url_param;
            this.url_param = this.mainurl + "cus/" + datalink.url_param;
          } else {
            this.garageonline = "false";
          }
        }

        if (dashboard.success == true) {
          this.tabeldata = dashboard.jobdata;
          this.duplicateJob = dashboard.jobdata;
          this.dataSource = new MatTableDataSource(dashboard.jobdata);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }
        this.showspinner.setSpinner(false);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  //copy the message here
  copyInputMessage(val: string) {
    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
    this.snakBar.open("Message", "URL Copied", {
      duration: 4000,
    });
  }
  // check the workshop is online or not
  checkOnline(event) {
    if (event.currentTarget.checked == true) {
      this.garageonline = "true";
    } else {
      this.garageonline = "false";
    }
    this.generalservice
      .onlineGrageStatus(this.workshopid, this.garageonline)
      .subscribe(
        (data) => {
          this.showspinner.setSpinner(true);
          if (data.success == true) {
            if (data.url_status == "true") {
              this.garageonline = "true";
              this.mainurlparam = data.url_param;
              this.url_param = this.mainurl + "cus/" + data.url_param;
            } else {
              this.garageonline = "false";
            }
          }
          this.showspinner.setSpinner(false);
        },
        (error) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][error], {
            duration: 4000,
          });
        }
      );
  }
  // clear the search
  clearSearch() {
    this.jobmodel = "";
    this.showsearchcnacel = false;
  }

  checkOnlineActivate() {
    // this.checkOnline(event);
  }
  //Sekect the jobs as the services
  selectedJobResult(event) {
    if (event.split("------").length == 3) {
      this.generalservice
        .getOnlineService(this.workshopid, event.split("------")[1])
        .subscribe(
          (jobData) => {
            this.jobmodel = "";
            this.showspinner.setSpinnerForLogin(true);
            this.showsearchcnacel = false;
            this.makejobtable(jobData.jobdata);
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
  // select the job from search and add to tabel
  makejobtable(jobdata) {
    this.duplicateJob.push(jobdata);
    var result = this.duplicateJob.reduce((unique, o) => {
      if (
        !unique.some(
          (obj) =>
            obj.part_number === o.part_number && obj.part_name === o.part_name
        )
      ) {
        if (unique.length < 15) {
          //unique.push(o);
          if (o.description == null || o.description == "") {
            this.dialog
              .OpenDescriptionPopup(
                o.part_name,
                o.unit_sale_price,
                o.part_number
              )
              .subscribe((dataupdate) => {
                if (dataupdate != false) {
                  if (dataupdate.online_service == "false") {
                    this.generalservice
                      .updateOnlineServive(
                        this.workshopid,
                        dataupdate.part_number,
                        "online",
                        "true"
                      )
                      .subscribe(
                        (statusUpdate) => {
                          if (statusUpdate.success == true) {
                            this.snakBar.open(
                              "Message",
                              "Added Online Service",
                              {
                                duration: 4000,
                              }
                            );
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
                  setTimeout(() => this.ngOnInit(), 100);
                } else {
                  if (o.online_service == "false") {
                    this.generalservice
                      .updateOnlineServive(
                        this.workshopid,
                        o.part_number,
                        "online",
                        "true"
                      )
                      .subscribe(
                        (statusUpdate) => {
                          if (statusUpdate.success == true) {
                            this.snakBar.open(
                              "Message",
                              "Added Online Service",
                              {
                                duration: 4000,
                              }
                            );
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
                  this.ngOnInit();
                }
              });
          } else {
            if (o.online_service == "false") {
              this.generalservice
                .updateOnlineServive(
                  this.workshopid,
                  o.part_number,
                  "online",
                  "true"
                )
                .subscribe(
                  (statusUpdate) => {
                    if (statusUpdate.success == true) {
                      this.snakBar.open("Message", "Added Online Service", {
                        duration: 4000,
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
            unique.push(o);
          }

          this.showlimiterror = false;
        } else {
          this.showlimiterror = true;
        }

        this.tabeldata = unique;
        this.dataSource = new MatTableDataSource(unique);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.showduplicatejob = false;
      } else {
        this.showduplicatejob = true;
        this.duplicatejobname = o["part_name"];
      }
      return unique;
    }, []);
    this.jobdatatabel = result;
    this.showspinner.setSpinnerForLogin(false);
  }
  // hsre the link of online store in whatsapp
  sharewhatsApp() {
    var whatsappMessage;
    var mobile;
    if (this.userservice.getData()["workshop_mobile_number_2"] != 0) {
      mobile =
        this.userservice.getData()["workshop_mobile_number_1"] +
        "/" +
        this.userservice.getData()["workshop_mobile_number_2"];
    } else {
      mobile = this.userservice.getData()["workshop_mobile_number_1"];
    }
    whatsappMessage =
      "Hey! You can now book appointment online or can track older service history online by " +
      this.userservice.getData()["workshop_name"] +
      " this link: " +
      this.url_param +
      "\r\n" +
      "Feel Free to call us on " +
      mobile +
      " if you need any help with booking online." +
      "\r\n" +
      "Thank You.";
    whatsappMessage = encodeURIComponent(whatsappMessage);
    this.contactlink = "https://web.whatsapp.com/send?phone=91&text=" + whatsappMessage;
  }
  // edit the jobs
  editservice(element, i) {
    this.editIndex = i;
    this.addselectedJobResultnew(element.part_number, true);
  }
  // remove the jobs
  removeservice(element, i) {
    var questionForDialog;
    questionForDialog =
      "Are You Sure Want to Remove the Service " + element.part_name;
    this.dialog
      .OpenConfirmDialog(questionForDialog, true, "Remove")
      .subscribe((answer) => {
        if (answer == true) {
          this.generalservice
            .updateOnlineServive(
              this.workshopid,
              element.part_number,
              "online",
              "false"
            )
            .subscribe(
              (statusUpdate) => {
                if (statusUpdate.success == true) {
                  this.tabeldata.splice(i, 1);
                  this.duplicateJob = this.tabeldata;
                  this.dataSource = new MatTableDataSource(this.tabeldata);
                  this.dataSource.sort = this.sort;
                  this.dataSource.paginator = this.paginator;
                  this.snakBar.open("Message", "Removed Online Service", {
                    duration: 4000,
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
      });
  }
  //search the jobs
  searchJobInput(event) {
    if (event != "") {
      this.generalservice.searchOnlineService(this.workshopid, event).subscribe(
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
                    JobSearchData.jobdata[i].part_number
                  )
                ) {
                  if (JobSearchData.jobdata[i].unit_sale_price != "") {
                    this.jobduplicate.push(
                      JobSearchData.jobdata[i].part_number
                    );
                    this.searchJobDatasec.push(
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
                    this.searchJobDatasec.push(
                      JobSearchData.jobdata[i].part_name +
                        "------" +
                        JobSearchData.jobdata[i].part_number
                    );
                  }
                }
              }
              this.searchJobData = this.searchJobDatasec;
            }
          } else {
            console.log("No Data");
            this.snakBar.open("Message", "Please Eneter Keyword", {
              duration: 4000,
            });
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
  }
  // pagination data of jobs
  loadMoreDatajobs() {
    if (this.jobsnextpage != "none") {
      setTimeout(
        () =>
          this.generalservice
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
  // Create New Job form with validations
  createJobForm() {
    this.CreateJobForm = this.formbuild.group({
      partnumber: [""],
      partname: ["", Validators.required],
      companyname: [""],
      description: [""],
      searchspareVehicle: [""],
      quantity: [1, Validators.pattern(this.regex)],
      lowerlimit: [0, Validators.pattern(this.regex)],
      variiofspare: [null],
      unit: [null],
      modelofspare: [null],
      makeofspare: [null],
      subcategory: [null],
      gstslab: [null],
      gsttype: [null],
      rackno: [""],
      purchaseprice: [0, Validators.pattern(this.regex)],
      sellingprice: [
        null,
        [Validators.required, Validators.pattern(this.regex)],
      ],
      hsnno: [""],
    });
  }
  // search for vehicles
  forAllVehicles(event) {
    if (event.currentTarget.checked == true) {
      this.foralltrue = true;
      this.SelectedDataarrOfVehiclespl = {
        make: "All",
        model: "All",
        variant: "All",
      };
    } else {
      this.foralltrue = false;
      this.SelectedDataarrOfVehiclespl = undefined;
    }
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
        this.CreateJobForm.controls["searchspareVehicle"].setValue("", {
          onlySelf: true,
        });
        this.CreateJobForm.controls["searchspareVehicle"].setValue("", {
          onlySelf: true,
        });
        this.CreateJobForm.controls["searchspareVehicle"].setValue("", {
          onlySelf: true,
        });
      });
    }
  }
  // select the vehcile
  searchBarForVechilespl(event) {
    this.searchVehicleDataSpl = [];
    this.mainVehiclearrspl = [];
    this.generalservice
      .searchMakeModel(event, this.userservice.getData()["workshop_type"])
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
  // search the jobs
  searchJobInputnew(event) {
    this.generalservice.searchOnlineService(this.workshopid, event).subscribe(
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
  //pagination of the jobs
  loadMoreDatajobsnew() {
    if (this.jobsnextpageinven != "none") {
      setTimeout(
        () =>
          this.generalservice
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
  // select the search jobs
  addselectedJobResultnew(event, mode) {
    if (mode != true) {
      this.editIndex = null;
    } else {
      this.editIndex = this.editIndex;
    }
    this.generalservice.getOnlineService(this.workshopid, event).subscribe(
      (jobData) => {
        if (event != "" && jobData.jobdata != undefined) {
          if (jobData.success == true) {
            var vechilevariant = JSON.parse(
              jobData.jobdata.vechile_details.replace(/\\/g, "")
            );
            this.foralltrue = false;
            this.SelectedDataarrOfVehiclespl = JSON.parse(
              jobData.jobdata.vechile_details
            );
            if (this.SelectedDataarrOfVehiclespl.make == undefined) {
              this.SelectedDataarrOfVehiclespl = {
                make: this.SelectedDataarrOfVehiclespl.vehicle_make,
                model: this.SelectedDataarrOfVehiclespl.vehicle_model,
                variant: this.SelectedDataarrOfVehiclespl.vehicle_variant,
              };
            }
            if (this.SelectedDataarrOfVehiclespl.make == "All") {
              this.foralltrue = true;
            }
            this.jobmaster = jobData.jobdata.is_master;
            this.jobworkshop = jobData.jobdata.workshop_id;
            this.CreateJobForm.controls["partnumber"].setValue(
              jobData.jobdata.part_number,
              { onlySelf: true }
            );
            this.CreateJobForm.controls["partname"].setValue(
              jobData.jobdata.part_name,
              { onlySelf: true }
            );
            this.CreateJobForm.controls["companyname"].setValue(
              jobData.jobdata.company_name,
              { onlySelf: true }
            );
            this.CreateJobForm.controls["description"].setValue(
              jobData.jobdata.description,
              { onlySelf: true }
            );
            this.CreateJobForm.controls["quantity"].setValue(
              jobData.jobdata.current_quantity,
              { onlySelf: true }
            );
            this.CreateJobForm.controls["lowerlimit"].setValue(
              jobData.jobdata.lower_limit,
              { onlySelf: true }
            );
            this.CreateJobForm.controls["unit"].setValue(jobData.jobdata.unit, {
              onlySelf: true,
            });
            this.CreateJobForm.controls["subcategory"].setValue(
              jobData.jobdata.job_subcategory,
              { onlySelf: true }
            );
            this.CreateJobForm.controls["gstslab"].setValue(
              jobData.jobdata.sale_gst_rate,
              { onlySelf: true }
            );
            this.CreateJobForm.controls["gsttype"].setValue(
              jobData.jobdata.sale_tax_type,
              { onlySelf: true }
            );
            this.CreateJobForm.controls["rackno"].setValue(
              jobData.jobdata.rack_no,
              { onlySelf: true }
            );
            this.CreateJobForm.controls["purchaseprice"].setValue(0, {
              onlySelf: true,
            });
            this.CreateJobForm.controls["sellingprice"].setValue(
              jobData.jobdata.unit_sale_price,
              { onlySelf: true }
            );
            this.CreateJobForm.controls["hsnno"].setValue(
              jobData.jobdata.hsn_no,
              { onlySelf: true }
            );
            this.showJobUpdate = true;
          }
        } else {
          this.CreateJobForm.controls["partname"].setValue("", {
            onlySelf: true,
          });
          this.CreateJobForm.controls["companyname"].setValue("", {
            onlySelf: true,
          });
          this.CreateJobForm.controls["description"].setValue("");
          this.CreateJobForm.controls["quantity"].setValue(1, {
            onlySelf: true,
          });
          this.CreateJobForm.controls["lowerlimit"].setValue(0, {
            onlySelf: true,
          });
          this.CreateJobForm.controls["unit"].setValue(this.units[0], {
            onlySelf: true,
          });
          this.CreateJobForm.controls["subcategory"].setValue(
            this.JobCategory[0],
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
          this.CreateJobForm.controls["hsnno"].setValue("", { onlySelf: true });
          this.showJobUpdate = false;
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
  //open the popup to create or update the job
  openJobpopup() {
    this.foralltrue = false;
    this.SelectedDataarrOfVehiclespl = undefined;
    this.showJobUpdate = false;
    this.CreateJobForm.controls["partnumber"].setValue(undefined, {
      onlySelf: true,
    });
    this.CreateJobForm.controls["sellingprice"].setValue(null);
    this.CreateJobForm.controls["partname"].setValue("");
    this.CreateJobForm.controls["description"].setValue("");
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
    this.CreateJobForm.controls["unit"].setValue(this.units[0], {
      onlySelf: true,
    });
    this.CreateJobForm.controls["hsnno"].setValue("");
    this.toShowcgst = 0;
    this.toShowsgst = 0;
    this.toShowtotal_gst = 0;
    this.totalamountonform = 0;
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
        this.userservice.getData()["workshop_id"].toString() +
        this.today.getFullYear().toString() +
        (this.today.getMonth() + 1).toString() +
        this.today.getDate().toString() +
        this.today.getHours().toString() +
        this.today.getMinutes().toString() +
        this.today.getSeconds().toString();
    } else {
      part_number = this.CreateJobForm.getRawValue().partnumber;
    }
    this.generalservice
      .createUpdateOnlineService(
        mode,
        part_number,
        this.CreateJobForm.value.partname,
        "",
        this.CreateJobForm.value.unit,
        "job",
        "",
        this.CreateJobForm.value.subcategory,
        "",
        JSON.stringify(this.SelectedDataarrOfVehiclespl),
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
        this.CreateJobForm.value.companyname,
        this.workshopid,
        "true",
        this.CreateJobForm.value.description
      )
      .subscribe(
        (SaveResult) => {
          this.showspinner.setSpinnerForLogin(false);
          if (SaveResult.success == true) {
            this.showspinner.setSpinnerForLogin(false);

            if (mode == "update") {
              if (this.editIndex != null) {
                this.tabeldata[this.editIndex]["part_number"] =
                  SaveResult.jobdata.part_number;
                this.tabeldata[this.editIndex]["part_name"] =
                  SaveResult.jobdata.part_name;
                this.tabeldata[this.editIndex]["description"] =
                  SaveResult.jobdata.description;
                this.tabeldata[this.editIndex]["unit_sale_price"] = Math.ceil(
                  SaveResult.jobdata.unit_sale_price
                );
                this.duplicateJob = this.tabeldata;
                this.dataSource = new MatTableDataSource(this.tabeldata);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
              } else {
                this.makejobtable(SaveResult.jobdata);
              }
              this.snakBar.open("Success", "Service Updated Successfully", {
                duration: 4000,
              });
            } else {
              this.makejobtable(SaveResult.jobdata);
              this.snakBar.open("Success", "Service Created Successfully", {
                duration: 4000,
              });
            }
          } else {
            this.showspinner.setSpinnerForLogin(false);
            this.snakBar.open("Success", "Issues While Executing Query", {
              duration: 4000,
            });
          }
          console.log(SaveResult);
        },
        (err) => {
          this.showspinner.setSpinnerForLogin(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  // caluclate the GST
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
}
