import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { SpinnerService } from "./spinner.service";
import { MatSnackBar } from "@angular/material";
import { UserserviceService } from "./userservice.service";
import { GeneralService } from "./general.service";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { MechrepogenerateService } from "./mechrepogenerate.service";
import { ErrorMessgae } from "../shared/error_message/error";
/**
 * In this file {DF for mech reports
 * is sedn, share or downlaod in opne jobcard
 */
@Injectable({
  providedIn: "root",
})
export class MechreportService implements OnInit {
  userserviceworkshopid;
  constructor(
    private showspinner: SpinnerService,
    private router: Router,
    public pdfService: MechrepogenerateService,
    private snakBar: MatSnackBar,
    private userService: UserserviceService,
    private generalService: GeneralService
  ) {
    this.userserviceworkshopid = this.userService.getData()["workshop_id"];
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }
  historyJobdata;
  ngOnInit() {}
  // Downlaod Mech repo
  downloadPdf(datanew) {
    var data = datanew[0];
    this.showspinner.setSpinner(true);

    this.generalService
      .jobCradDetails(this.userserviceworkshopid, data.jobcard_number)
      .subscribe(
        (jobcardData) => {
          if (jobcardData["success"] == true) {
            var mainTitle;
            mainTitle = "Mechanic Worksheet";
            var name;
            var documentDefinition;
            if (jobcardData["jobcards"][0].vehicle_number != "") {
              name =
                jobcardData["jobcards"][0].jobcard_number +
                " - " +
                jobcardData["jobcards"][0].vehicle_number +
                ".pdf";
            } else {
              name = jobcardData["jobcards"][0].jobcard_number + ".pdf";
            }
            var billformat = data.settings.bill_format;
            this.generalService
              .lastHistoryDates(
                jobcardData["jobcards"][0].workshop_id,
                jobcardData["jobcards"][0].vehicle_number
              )
              .subscribe((datahisdate) => {
                if (datahisdate.success == true) {
                  this.generalService
                    .lastHistoryData(
                      jobcardData["jobcards"][0].workshop_id,
                      jobcardData["jobcards"][0].vehicle_number,
                      datahisdate["history_dates"][0]
                    )
                    .subscribe((datahis) => {
                      if (datahis.success == true) {
                        this.historyJobdata = datahis.jobcards;
                      } else {
                        console.log("No Data Found");
                      }
                    });
                } else {
                  this.historyJobdata = "";
                }
              });

            setTimeout(
              () =>
                (documentDefinition = this.pdfService.generatePDF(
                  "Jobcard",
                  true,
                  mainTitle,
                  billformat,
                  jobcardData["jobcards"][0],
                  data.settings,
                  jobcardData["customer"][0],
                  this.historyJobdata,
                  data.staff
                )),

              1000
            );

            this.snakBar.open("Message", "Getting PDF Ready", {
              duration: 4000,
            });
            setTimeout(
              () => pdfMake.createPdf(documentDefinition).download(name),

              2000
            );
          } else {
            this.showspinner.setSpinner(false);
            this.snakBar.open("Error", "Error in Getting Jobcad Details", {
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
  // print mech repo
  printPDF(datanew) {
    var data = datanew[0];
    // this.showspinner.setSpinner(true);

    this.generalService
      .jobCradDetails(this.userserviceworkshopid, data.jobcard_number)
      .subscribe(
        (jobcardData) => {
          if (jobcardData["success"] == true) {
            var mainTitle;
            mainTitle = "Mechanic Worksheet";
            var name;
            var documentDefinition;
            if (jobcardData["jobcards"][0].vehicle_number != "") {
              name =
                jobcardData["jobcards"][0].jobcard_number +
                " - " +
                jobcardData["jobcards"][0].vehicle_number +
                ".pdf";
            } else {
              name = jobcardData["jobcards"][0].jobcard_number + ".pdf";
            }
            var billformat = data.settings.bill_format;
            this.generalService
              .lastHistoryDates(
                jobcardData["jobcards"][0].workshop_id,
                jobcardData["jobcards"][0].vehicle_number
              )
              .subscribe((datahisdate) => {
                if (datahisdate.success == true) {
                  this.generalService
                    .lastHistoryData(
                      jobcardData["jobcards"][0].workshop_id,
                      jobcardData["jobcards"][0].vehicle_number,
                      datahisdate["history_dates"][0]
                    )
                    .subscribe((datahis) => {
                      if (datahis.success == true) {
                        this.historyJobdata = datahis.jobcards;
                      } else {
                        console.log("No Data Found");
                      }
                    });
                } else {
                  this.historyJobdata = "";
                }
              });
            setTimeout(
              () =>
                (documentDefinition = this.pdfService.generatePDF(
                  "Jobcard",
                  true,
                  mainTitle,
                  billformat,
                  jobcardData["jobcards"][0],
                  data.settings,
                  jobcardData["customer"][0],
                  this.historyJobdata,
                  data.staff
                )),
              1000
            );
            this.snakBar.open("Message", "Getting PDF Ready", {
              duration: 4000,
            });
            setTimeout(
              () => pdfMake.createPdf(documentDefinition).print(),
              2000
            );
          } else {
            this.showspinner.setSpinner(false);
            this.snakBar.open("Error", "Error in Getting Jobcad Details", {
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
}
