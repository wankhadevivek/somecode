import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { SpinnerService } from "./spinner.service";
import { MatSnackBar } from "@angular/material";
import { UserserviceService } from "./userservice.service";
import { GeneralService } from "./general.service";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { PdfgenerateService } from "./pdfgenerate.service";
import { ErrorMessgae } from "../shared/error_message/error";
import { PdfcounterService } from "./pdfcounter.service";
/**
 * In this file ask the user
 * and get the return value
 * for the send, sgare ,print, downlaod
 * invoice or estimate
 */
@Injectable({
  providedIn: "root",
})
export class PrintsharepdfService implements OnInit {
  userserviceworkshopid;

  constructor(
    private showspinner: SpinnerService,
    private router: Router,
    public pdfService: PdfgenerateService,
    private snakBar: MatSnackBar,
    private counterpdf: PdfcounterService,
    private userService: UserserviceService,
    private generalService: GeneralService
  ) {
    this.userserviceworkshopid = this.userService.getData()["workshop_id"];
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }
  ngOnInit() {}
  // Send email of invoice or estimate
  sendEmail(flag, datanew) {
    var data = datanew[0];
    if (data.status != false) {
      if (data.mode != "update") {
        if (data.smsalert == true) {
          if (data.cutsomeremial != "" && data.cutsomeremial != null) {
            this.snakBar.open("Message", "Sending Email To Customer", {
              duration: 4000,
            });
            this.showspinner.setSpinner(true);

            this.generalService
              .jobCradDetails(this.userserviceworkshopid, data.jobcard_number)
              .subscribe(
                (jobcardData) => {
                  if (jobcardData["success"] == true) {
                    var mainTitle;
                    if (data.statusjobcard == 0) {
                      mainTitle = "Estimate";
                    } else {
                      mainTitle = "Invoice";
                    }
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
                    documentDefinition = this.pdfService.generatePDF(
                      "Jobcard",
                      true,
                      mainTitle,
                      billformat,
                      jobcardData["jobcards"][0],
                      data.settings,
                      jobcardData["customer"][0]
                    );
                    pdfMake
                      .createPdf(documentDefinition)
                      .getBase64((dataUrl) => {
                        var pdfFile = dataUrl;
                        var binary = atob(pdfFile.replace(/\s/g, ""));
                        var len = pdfFile.length;
                        var buffer = new ArrayBuffer(len);
                        var view = new Uint8Array(buffer);
                        for (var i = 0; i < len; i++) {
                          view[i] = binary.charCodeAt(i);
                        }
                        var fileBlob = new Blob([view], {
                          type: "application/pdf",
                        });
                        var bodyMessage;
                        var subject;
                        var workshopname =
                          this.userService.getData()["workshop_name"];
                        var mobile;
                        if (data.cutsomerphone == 0) {
                          mobile = jobcardData["customer"][0].customer_mobile;
                        } else {
                          mobile =
                            jobcardData["customer"][0].customer_mobile +
                            " / " +
                            data.cutsomerphone;
                        }
                        if (
                          typeof jobcardData["jobcards"][0].vehicle_details ==
                          "string"
                        ) {
                          var vehicle =
                            JSON.parse(
                              jobcardData["jobcards"][0].vehicle_details
                            ).make +
                            " " +
                            JSON.parse(
                              jobcardData["jobcards"][0].vehicle_details
                            ).model +
                            " " +
                            JSON.parse(
                              jobcardData["jobcards"][0].vehicle_details
                            ).variant;
                        } else {
                          var vehicle =
                            jobcardData["jobcards"][0].vehicle_details.make +
                            " " +
                            jobcardData["jobcards"][0].vehicle_details.model +
                            " " +
                            jobcardData["jobcards"][0].vehicle_details.variant;
                        }
                        var amPM = new Date(
                          jobcardData["jobcards"][0].estimated_delivery_datetime
                        )
                          .toLocaleString("en-US")
                          .toString()
                          .split(" ");
                        var fullDate = new Date(
                          jobcardData["jobcards"][0].estimated_delivery_datetime
                        )
                          .toString()
                          .split(" ");
                        var shoedate =
                          fullDate[1] +
                          " " +
                          fullDate[2] +
                          " " +
                          fullDate[3] +
                          ", " +
                          fullDate[4].split(":")[0] +
                          ":" +
                          fullDate[4].split(":")[1] +
                          " " +
                          amPM[2];

                        if (jobcardData["jobcards"][0].jobcard_status == "0") {
                          subject = "Estimation Details and Delivery Deatails";

                          bodyMessage =
                            "<p> Dear Customer, </p>\n\n <p>Welcome to " +
                            workshopname +
                            " !</p>\n<p>Mobile Number: " +
                            mobile +
                            "</p>\n\n\n<p> Jobcard <b>" +
                            jobcardData["jobcards"][0].jobcard_number +
                            "</b> created for</p>\n\n\n<p> " +
                            vehicle +
                            " <b>" +
                            jobcardData["jobcards"][0].vehicle_number +
                            "</b> .</p>\n\n <p><b>Estimation: Rs." +
                            jobcardData["jobcards"][0].cost_estimate +
                            "/-</b></p><p>  Expected Ready by <b>" +
                            shoedate +
                            "</b></p>\n\n\n\n<p>" +
                            data.linkforpay +
                            "\n\n\n\nThanks.</p>";
                        } else if (
                          jobcardData["jobcards"][0].jobcard_status == "1"
                        ) {
                          subject = "Jobcard Completed";
                          bodyMessage =
                            "<p> Dear Customer, </p>\n\n <p>Your " +
                            vehicle +
                            " <b>" +
                            jobcardData["jobcards"][0].vehicle_number +
                            "</b> is ready.</p>\n\n <p><b>Apprx. Bill Amount: Rs." +
                            jobcardData["jobcards"][0].final_amount +
                            "/-</b></p>\n\n<p>" +
                            data.linkforpay +
                            "</p>\n\n<p>Pickup your Vehicle</p>\n\n\n\n<p> Thanks.</p>\n\n<p>" +
                            workshopname +
                            "</p>\n\n<p>" +
                            mobile +
                            "</p>";
                        } else if (
                          jobcardData["jobcards"][0].jobcard_status == "2"
                        ) {
                          subject = "Next Servicing due on Date";
                          var currentdate = new Date(
                            jobcardData[
                              "jobcards"
                            ][0].estimated_delivery_datetime
                          );
                          var reminderperioddate = new Date(
                            currentdate.setMonth(
                              currentdate.getMonth() +
                                parseInt(
                                  jobcardData["jobcards"][0].reminder.split(
                                    " "
                                  )[0]
                                )
                            )
                          );
                          var reminderdate =
                            reminderperioddate.getFullYear().toString() +
                            "-" +
                            ("0" + (reminderperioddate.getMonth() + 1))
                              .slice(-2)
                              .toString() +
                            "-" +
                            ("0" + reminderperioddate.getDate())
                              .slice(-2)
                              .toString() +
                            " 08:00:00";
                          var fullDatenew = new Date(reminderdate)
                            .toString()
                            .split(" ");
                          bodyMessage =
                            "<p> Dear Customer, </p>\n\n <p>Jobcard for your vehicle " +
                            vehicle +
                            " has been closed.</p>\n\n <p><b>Your Final Bill Amount is Rs." +
                            jobcardData["jobcards"][0].final_amount +
                            "/-</b></p>\n\n<p>Next serving for your vehicle is scheduled on <b>" +
                            fullDatenew[1] +
                            " " +
                            fullDatenew[2] +
                            " " +
                            fullDatenew[3] +
                            "</b></p>\n\n<p> Thank you for choosing our Service!</p>\n\n<p>" +
                            workshopname +
                            "</p>\n\n<p>" +
                            mobile +
                            "</p>";
                        }

                        this.generalService
                          .sendEmail(
                            this.userService.getData()["workshop_id"],
                            bodyMessage,
                            subject,
                            workshopname,
                            data.cutsomeremial,
                            fileBlob,
                            name
                          )
                          .subscribe(
                            (sent) => {
                              this.showspinner.setSpinner(true);
                              this.snakBar.open(
                                "Message",
                                ErrorMessgae[0][sent["message"]],
                                {
                                  duration: 4000,
                                }
                              );
                              this.showspinner.setSpinner(false);
                              this.snakBar.open(
                                "Message",
                                ErrorMessgae[0][sent["message"]],
                                {
                                  duration: 4000,
                                }
                              );
                              if (sent["success"] == true) {
                                return true;
                              } else {
                                return false;
                              }
                            },
                            (err) => {
                              this.showspinner.setSpinner(false);
                              this.snakBar.open("Error", err, {
                                duration: 4000,
                              });
                            }
                          );
                      });
                  } else {
                    this.showspinner.setSpinner(false);
                    this.snakBar.open(
                      "Error",
                      "Error in Getting Jobcad Details",
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
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  // Downlaod of invoice or estimate
  downloadPdf(datanew) {
    var data = datanew[0];
    // this.showspinner.setSpinner(true);

    this.generalService
      .jobCradDetails(this.userserviceworkshopid, data.jobcard_number)
      .subscribe(
        (jobcardData) => {
          if (jobcardData["success"] == true) {
            var mainTitle;
            if (data.statusjobcard == 0) {
              mainTitle = "Estimate";
            } else {
              mainTitle = "Invoice";
            }
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
            documentDefinition = this.pdfService.generatePDF(
              "Jobcard",
              true,
              mainTitle,
              billformat,
              jobcardData["jobcards"][0],
              data.settings,
              jobcardData["customer"][0]
            );
            pdfMake.createPdf(documentDefinition).download(name);
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
  // Print of invoice or estimate
  printPDF(datanew) {
    var data = datanew[0];
    // this.showspinner.setSpinner(true);

    this.generalService
      .jobCradDetails(this.userserviceworkshopid, data.jobcard_number)
      .subscribe(
        (jobcardData) => {
          
          if (jobcardData["success"] == true) {
            var mainTitle;
            if (data.statusjobcard == 0) {
              mainTitle = "Estimate";
            } else {
              mainTitle = "Invoice";
            }

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
            //sania
            // wasnt displaying gst when called from inside jobcard
            var temp = jobcardData["customer"];
            var len = temp.length;

            var billformat = data.settings.bill_format;

            documentDefinition = this.pdfService.generatePDF(
              "Jobcard",
              true,
              mainTitle,
              billformat,
              jobcardData["jobcards"][0],
              data.settings,
              jobcardData["customer"][0]
            );
            pdfMake.createPdf(documentDefinition).print();
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
  // Send email of invoice or estimate when user craete
  emailPdfForCreate(datanew) {
    var data = datanew[0];
    this.snakBar.open("Message", "Sending Email To Customer", {
      duration: 4000,
    });
    this.showspinner.setSpinner(true);

    this.generalService
      .jobCradDetails(this.userserviceworkshopid, data.jobcard_number)
      .subscribe(
        (jobcardData) => {
          if (jobcardData["success"] == true) {
            var mainTitle;
            if (data.statusjobcard == 0) {
              mainTitle = "Estimate";
            } else {
              mainTitle = "Invoice";
            }
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
            documentDefinition = this.pdfService.generatePDF(
              "Jobcard",
              true,
              mainTitle,
              billformat,
              jobcardData["jobcards"][0],
              data.settings,
              jobcardData["customer"][0]
            );
            pdfMake.createPdf(documentDefinition).getBase64((dataUrl) => {
              var pdfFile = dataUrl;
              var binary = atob(pdfFile.replace(/\s/g, ""));
              var len = pdfFile.length;
              var buffer = new ArrayBuffer(len);
              var view = new Uint8Array(buffer);
              for (var i = 0; i < len; i++) {
                view[i] = binary.charCodeAt(i);
              }
              var fileBlob = new Blob([view], { type: "application/pdf" });
              var bodyMessage;
              var subject;
              var workshopname = this.userService.getData()["workshop_name"];
              var mobile;
              if (data.cutsomerphone == 0) {
                mobile = jobcardData["customer"][0].customer_mobile;
              } else {
                mobile =
                  jobcardData["customer"][0].customer_mobile +
                  " / " +
                  data.cutsomerphone;
              }
              if (
                typeof jobcardData["jobcards"][0].vehicle_details == "string"
              ) {
                var vehicle =
                  JSON.parse(jobcardData["jobcards"][0].vehicle_details).make +
                  " " +
                  JSON.parse(jobcardData["jobcards"][0].vehicle_details).model +
                  " " +
                  JSON.parse(jobcardData["jobcards"][0].vehicle_details)
                    .variant;
              }
              var amPM = new Date(
                jobcardData["jobcards"][0].estimated_delivery_datetime
              )
                .toLocaleString("en-US")
                .toString()
                .split(" ");
              var fullDate = new Date(
                jobcardData["jobcards"][0].estimated_delivery_datetime
              )
                .toString()
                .split(" ");
              var shoedate =
                fullDate[1] +
                " " +
                fullDate[2] +
                ", " +
                fullDate[3] +
                ", " +
                fullDate[4].split(":")[0] +
                ":" +
                fullDate[4].split(":")[1] +
                " " +
                amPM[2];

              if (jobcardData["jobcards"][0].jobcard_status == "0") {
                subject = "Estimation Details and Delivery Deatails";

                bodyMessage =
                  "<p> Dear Customer, </p>\n\n <p>Welcome to " +
                  workshopname +
                  " !</p>\n<p>Mobile Number: " +
                  mobile +
                  "</p>\n\n\n<p> Jobcard <b>" +
                  jobcardData["jobcards"][0].jobcard_number +
                  "</b> created for</p>\n\n\n<p> " +
                  vehicle +
                  " <b>" +
                  jobcardData["jobcards"][0].vehicle_number +
                  "</b> .</p>\n\n <p><b>Estimation: Rs." +
                  jobcardData["jobcards"][0].cost_estimate +
                  "/-</b></p><p>  Expected Ready by <b>" +
                  shoedate +
                  "</b></p>\n\n\n\n<p> Thanks.</p>";
              } else if (jobcardData["jobcards"][0].jobcard_status == "1") {
                subject = "Jobcard Completed";
                bodyMessage =
                  "<p> Dear Customer, </p>\n\n <p>Your " +
                  vehicle +
                  " <b>" +
                  jobcardData["jobcards"][0].vehicle_number +
                  "</b> is ready.</p>\n\n <p><b>Apprx. Bill Amount: Rs." +
                  jobcardData["jobcards"][0].final_amount +
                  "/-</b></p><p>  Pickup your Vehicle</p>\n\n\n\n<p> Thanks.</p>\n\n<p>" +
                  workshopname +
                  "</p>\n\n<p>" +
                  mobile +
                  "</p>";
              } else if (jobcardData["jobcards"][0].jobcard_status == "2") {
                subject = "Next Servicing due on Date";
                var currentdate = new Date(
                  jobcardData["jobcards"][0].estimated_delivery_datetime
                );
                var reminderperioddate = new Date(
                  currentdate.setMonth(
                    currentdate.getMonth() +
                      parseInt(
                        jobcardData["jobcards"][0].reminder.split(" ")[0]
                      )
                  )
                );
                var reminderdate =
                  reminderperioddate.getFullYear().toString() +
                  "-" +
                  ("0" + (reminderperioddate.getMonth() + 1))
                    .slice(-2)
                    .toString() +
                  "-" +
                  ("0" + reminderperioddate.getDate()).slice(-2).toString() +
                  " 08:00:00";
                var fullDatenew = new Date(reminderdate).toString().split(" ");
                bodyMessage =
                  "<p> Dear Customer, </p>\n\n <p>Jobcard for your vehicle " +
                  vehicle +
                  " has been closed.</p>\n\n <p><b>Your Final Bill Amount is Rs." +
                  jobcardData["jobcards"][0].final_amount +
                  "/-</b></p>\n\n<p>Next serving for your vehicle is scheduled on <b>" +
                  fullDatenew[1] +
                  " " +
                  fullDatenew[2] +
                  " " +
                  fullDatenew[3] +
                  "</b></p>\n\n<p> Thank you for choosing our Service!</p>\n\n<p>" +
                  workshopname +
                  "</p>\n\n<p>" +
                  mobile +
                  "</p>";
              }

              this.generalService
                .sendEmail(
                  this.userService.getData()["workshop_id"],
                  bodyMessage,
                  subject,
                  workshopname,
                  data.cutsomeremial,
                  fileBlob,
                  name
                )
                .subscribe(
                  (sent) => {
                    this.showspinner.setSpinner(true);
                    this.snakBar.open(
                      "Message",
                      ErrorMessgae[0][sent["message"]],
                      {
                        duration: 4000,
                      }
                    );
                    this.showspinner.setSpinner(false);
                    this.snakBar.open(
                      "Message",
                      ErrorMessgae[0][sent["message"]],
                      {
                        duration: 4000,
                      }
                    );
                    if (sent["success"] == true) {
                      return true;
                    } else {
                      return false;
                    }
                  },
                  (err) => {
                    this.showspinner.setSpinner(false);
                    this.snakBar.open("Error", err, {
                      duration: 4000,
                    });
                  }
                );
            });
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
  emailPdfForCounterSale(datanew) {
    var data = datanew[0];
    this.snakBar.open("Message", "Sending Email To Customer", {
      duration: 4000,
    });
    this.showspinner.setSpinner(true);

    this.generalService
      .CounterDetail(this.userserviceworkshopid, data.invoice_no)
      .subscribe(
        (coounterdata) => {
          if (coounterdata.success == true) {
            var name;
            var documentDefinition;
            name = coounterdata.counter.invoice_no;
            documentDefinition = this.counterpdf.generatePDF(
              coounterdata.counter,
              coounterdata.customer,
              data.settings
            );
            pdfMake.createPdf(documentDefinition).getBase64((dataUrl) => {
              var pdfFile = dataUrl;
              var binary = atob(pdfFile.replace(/\s/g, ""));
              var len = pdfFile.length;
              var buffer = new ArrayBuffer(len);
              var view = new Uint8Array(buffer);
              for (var i = 0; i < len; i++) {
                view[i] = binary.charCodeAt(i);
              }
              var fileBlob = new Blob([view], { type: "application/pdf" });
              var bodyMessage;
              var subject = "Invoice Details";
              var workshopname = this.userService.getData()["workshop_name"];
              var totalbalance = parseFloat(coounterdata.customer.balance);

              var mobile =
                this.userService.getData()["workshop_mobile_number_1"];

              bodyMessage =
                "<p> Dear Customer, </p>\n\n <p>Thanks For Visiting " +
                workshopname +
                " !</p>\n<p>Mobile Number: " +
                mobile +
                "</p>\n\n\n <p><b>Your Final Bill Amount is Rs." +
                totalbalance +
                "/-</b></p>\n\n<p> Thank you for choosing our Service!</p>\n\n<p>" +
                workshopname +
                "</p>\n\n<p>";

              this.generalService
                .sendEmail(
                  this.userService.getData()["workshop_id"],
                  bodyMessage,
                  subject,
                  workshopname,
                  data.email,
                  fileBlob,
                  name
                )
                .subscribe(
                  (sent) => {
                    this.showspinner.setSpinner(true);
                    this.snakBar.open(
                      "Message",
                      ErrorMessgae[0][sent["message"]],
                      {
                        duration: 4000,
                      }
                    );
                    this.showspinner.setSpinner(false);
                    this.snakBar.open(
                      "Message",
                      ErrorMessgae[0][sent["message"]],
                      {
                        duration: 4000,
                      }
                    );
                    if (sent["success"] == true) {
                      return true;
                    } else {
                      return false;
                    }
                  },
                  (err) => {
                    this.showspinner.setSpinner(false);
                    this.snakBar.open("Error", err, {
                      duration: 4000,
                    });
                  }
                );
            });
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
  downloadPdfCounterSale(datanew) {
    var data = datanew[0];
    this.showspinner.setSpinner(true);

    this.generalService
      .CounterDetail(this.userserviceworkshopid, data.invoice_no)
      .subscribe(
        (coounterdata) => {
          if (coounterdata.success == true) {
            var name;
            var documentDefinition;
            name = coounterdata.counter.invoice_no;
            documentDefinition = this.counterpdf.generatePDF(
              coounterdata.counter,
              coounterdata.customer,
              data.settings
            );

            pdfMake.createPdf(documentDefinition).download(name);
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
