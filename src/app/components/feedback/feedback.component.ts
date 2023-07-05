//  -------------------- changes  by Aaliya  ------------------------------

import { stringify } from "@angular/compiler/src/util";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSnackBar, MatSort } from "@angular/material";
import { MatTableDataSource } from "@angular/material/table";
import { GeneralService } from "src/app/services/general.service";
import { UserserviceService } from "src/app/services/userservice.service";
import { ErrorMessgae } from "src/app/shared/error_message/error";
import { SpinnerService } from "../../services/spinner.service";

@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.css"],
})
export class FeedbackComponent implements OnInit {
  displayedColumns: string[] = [
    "created_at",
    "jobcard_number",
    "cutsomer_name",
    "overall_rating",
    "comment",
  ];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  allarr = Array();
  tabelData: any;
  scrollheight = "100";
  overallRatingAvg = 0;
  numberOfRatings = 0;
  customerSupportAvg = 0;
  serviceQualityAvg = 0;
  timelinessAvg = 0;
  pricingAvg = 0;
  cusSupportOne: number;
  cusSupportTwo: number;
  cusSupportThree: number;
  cusSupportFour: number;
  cusSupportFive: number;
  serviceQualityOne: number;
  serviceQualityTwo: number;
  serviceQualityThree: number;
  serviceQualityFour: number;
  serviceQualityFive: number;
  timelinessOne: number;
  timelinessFive: number;
  timelinessFour: number;
  timelinessThree: number;
  timelinessTwo: number;
  pricingOne: number;
  pricingTwo: number;
  pricingThree: number;
  pricingFour: number;
  pricingFive: number;
  // ratingInTable: number[] = [1,2,3,4,5];
  pricingAvgRound: number;
  serviceQualityAvgRound: number;
  customerSupportAvgRound: number;
  timelinessAvgRound: number;
  workshop_id: any;
  hasnext: boolean = false;
  nextUrl: string = "";
  userserviceworkshopid: any;

  constructor(
    private generalService: GeneralService,
    private userService: UserserviceService,
    private showspinner: SpinnerService,
    private snakBar: MatSnackBar
  ) {
    this.workshop_id = this.userService.getData()["workshop_id"];
  }
  ngOnInit() {
    if (this.workshop_id) {
      this.generalService.getfeedback(this.workshop_id).subscribe(
        (feedbackResponse) => {
          this.showspinner.setSpinner(true);
          if (feedbackResponse.success == true) {
            this.overallRatingAvg = feedbackResponse.rating_avg;
            this.numberOfRatings = feedbackResponse.feedback.length;

            var Total =
              feedbackResponse.service_quality_count.one +
              feedbackResponse.service_quality_count.two +
              feedbackResponse.service_quality_count.three +
              feedbackResponse.service_quality_count.four +
              feedbackResponse.service_quality_count.five;

            this.serviceQualityAvg =
              Math.round(
                ((feedbackResponse.service_quality_count.one +
                  feedbackResponse.service_quality_count.two * 2 +
                  feedbackResponse.service_quality_count.three * 3 +
                  feedbackResponse.service_quality_count.four * 4 +
                  feedbackResponse.service_quality_count.five * 5) /
                  Total) *
                  10
              ) / 10;
            this.serviceQualityAvgRound = Math.round(this.serviceQualityAvg);

            this.serviceQualityOne =
              (feedbackResponse.service_quality_count.one / Total) * 100;
            this.serviceQualityTwo =
              (feedbackResponse.service_quality_count.two / Total) * 100;
            this.serviceQualityThree =
              (feedbackResponse.service_quality_count.three / Total) * 100;
            this.serviceQualityFour =
              (feedbackResponse.service_quality_count.four / Total) * 100;
            this.serviceQualityFive =
              (feedbackResponse.service_quality_count.five / Total) * 100;

            Total =
              feedbackResponse.customer_support_count.one +
              feedbackResponse.customer_support_count.two +
              feedbackResponse.customer_support_count.three +
              feedbackResponse.customer_support_count.four +
              feedbackResponse.customer_support_count.five;

            this.customerSupportAvg =
              Math.round(
                ((feedbackResponse.customer_support_count.one +
                  feedbackResponse.customer_support_count.two * 2 +
                  feedbackResponse.customer_support_count.three * 3 +
                  feedbackResponse.customer_support_count.four * 4 +
                  feedbackResponse.customer_support_count.five * 5) /
                  Total) *
                  10
              ) / 10;
            this.customerSupportAvgRound = Math.round(this.customerSupportAvg);

            this.cusSupportOne =
              (feedbackResponse.customer_support_count.one / Total) * 100;
            this.cusSupportTwo =
              (feedbackResponse.customer_support_count.two / Total) * 100;
            this.cusSupportThree =
              (feedbackResponse.customer_support_count.three / Total) * 100;
            this.cusSupportFour =
              (feedbackResponse.customer_support_count.four / Total) * 100;
            this.cusSupportFive =
              (feedbackResponse.customer_support_count.five / Total) * 100;

            Total =
              feedbackResponse.timeliness_count.one +
              feedbackResponse.timeliness_count.two +
              feedbackResponse.timeliness_count.three +
              feedbackResponse.timeliness_count.four +
              feedbackResponse.timeliness_count.five;

            this.timelinessAvg =
              Math.round(
                ((feedbackResponse.timeliness_count.one +
                  feedbackResponse.timeliness_count.two * 2 +
                  feedbackResponse.timeliness_count.three * 3 +
                  feedbackResponse.timeliness_count.four * 4 +
                  feedbackResponse.timeliness_count.five * 5) /
                  Total) *
                  10
              ) / 10;
            this.timelinessAvgRound = Math.round(this.timelinessAvg);

            this.timelinessOne =
              (feedbackResponse.timeliness_count.one / Total) * 100;
            this.timelinessTwo =
              (feedbackResponse.timeliness_count.two / Total) * 100;
            this.timelinessThree =
              (feedbackResponse.timeliness_count.three / Total) * 100;
            this.timelinessFour =
              (feedbackResponse.timeliness_count.four / Total) * 100;
            this.timelinessFive =
              (feedbackResponse.timeliness_count.five / Total) * 100;

            Total =
              feedbackResponse.pricing_count.one +
              feedbackResponse.pricing_count.two +
              feedbackResponse.pricing_count.three +
              feedbackResponse.pricing_count.four +
              feedbackResponse.pricing_count.five;

            this.pricingAvg =
              Math.round(
                ((feedbackResponse.pricing_count.one +
                  feedbackResponse.pricing_count.two * 2 +
                  feedbackResponse.pricing_count.three * 3 +
                  feedbackResponse.pricing_count.four * 4 +
                  feedbackResponse.pricing_count.five * 5) /
                  Total) *
                  10
              ) / 10;
            this.pricingAvgRound = Math.round(this.pricingAvg);

            this.pricingOne =
              (feedbackResponse.pricing_count.one / Total) * 100;
            this.pricingTwo =
              (feedbackResponse.pricing_count.two / Total) * 100;
            this.pricingThree =
              (feedbackResponse.pricing_count.three / Total) * 100;
            this.pricingFour =
              (feedbackResponse.pricing_count.four / Total) * 100;
            this.pricingFive =
              (feedbackResponse.pricing_count.five / Total) * 100;

            this.getTableData();

            this.showspinner.setSpinner(false);
            this.snakBar.open(
              "Message",
              ErrorMessgae[0][feedbackResponse.messgae],
              {
                duration: 4000,
              }
            );
          } else {
            this.showspinner.setSpinner(false);
            this.snakBar.open(
              "Message",
              ErrorMessgae[0][feedbackResponse.messgae],
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
  }

  // =-=-=-=-=-=-=-=-=- changes #2 by Aaliya -=-=-=-=-=-=-=-=-=-

  getTableData(searchKeyword: string = "") {
    this.generalService
      .getfeedback(this.workshop_id, "", searchKeyword)
      .subscribe(
        (feedbackResponse) => {
          this.showspinner.setSpinner(true);
          if (feedbackResponse.success == true) {
            this.allarr = [];
            feedbackResponse.feedback.map((data) => {
              var tabelobj = {
                created_at: data.created_at,
                jobcard_number: data.jobcard_number,
                cutsomer_name: data.cutsomer_name,
                customer_mobile: data.customer_mobile,
                overall_rating: data.overall_rating,
                comment: data.comment,
                expanded: false,
              };
              console.log("data.comment", data.comment.length);

              this.allarr.push(tabelobj);
            });
            if (feedbackResponse.has_next == true) {
              this.hasnext = true;
              this.nextUrl = feedbackResponse.next_page;
            } else {
              this.hasnext = false;
              this.nextUrl = "";
            }

            this.tabelData = this.allarr;
            this.dataSource = new MatTableDataSource(this.tabelData);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.showspinner.setSpinner(false);
            this.snakBar.open(
              "Message",
              ErrorMessgae[0][feedbackResponse.messgae],
              {
                duration: 4000,
              }
            );
          } else {
            this.showspinner.setSpinner(false);
            this.snakBar.open(
              "Message",
              ErrorMessgae[0][feedbackResponse.messgae],
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

  // -=-=-=-=-=-=- TEST #2 -=-=-=-=-=-=-=-

  commentLenght(element: string): boolean {
    return element.length < 50;
  }

  filterTableData(rate: string = "") {
    if (rate == "") {
      this.getTableData();
    } else {
      this.generalService.getRatingFeedback(this.workshop_id, rate).subscribe(
        (feedbackResponse) => {
          this.showspinner.setSpinner(true);
          if (feedbackResponse.success == true) {
            this.allarr = [];
            feedbackResponse.feedback.map((data) => {
              var tabelobj = {
                created_at: data.created_at,
                jobcard_number: data.jobcard_number,
                cutsomer_name: data.cutsomer_name,
                customer_mobile:
                  stringify(data.customer_mobile)[0] +
                  "xxxxxxxx" +
                  stringify(data.customer_mobile)[9],
                overall_rating: data.overall_rating,
                comment: data.comment,
              };
              this.allarr.push(tabelobj);
            });
            if (feedbackResponse.has_next == true) {
              this.hasnext = true;
              this.nextUrl = feedbackResponse.next_page;
            } else {
              this.hasnext = false;
              this.nextUrl = "";
            }

            this.tabelData = this.allarr;
            this.dataSource = new MatTableDataSource(this.tabelData);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.showspinner.setSpinner(false);
            this.snakBar.open("Message", "Table Updated Successfully", {
              duration: 4000,
            });
          } else {
            this.showspinner.setSpinner(false);
            this.snakBar.open(
              "Message",
              ErrorMessgae[0][feedbackResponse.message],
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
  }

  // -=-=-=-=-=- TEST #2 -=-=-=-=-=-=-=-

  // =-=-=-=-=-=-=-=-=- changes #2 by Aaliya -=-=-=-=-=-=-=-=-=-

  onScroll(event) {
    if (
      event.target.offsetHeight + event.target.scrollTop >=
      event.target.scrollHeight
    ) {
      console.log("Scroll");
      if (this.hasnext == true) {
        //console.log(this.hasnext)
        console.log("Has next");
      }
    }
  }

  getDataForPagination() {
    this.generalService
      .Feedbackpageination(this.nextUrl)
      .subscribe((feedbackResponse) => {
        if (feedbackResponse.success == true) {
          this.allarr = [];
          feedbackResponse.feedback.map((data) => {
            var tabelobj = {
              created_at: data.created_at,
              jobcard_number: data.jobcard_number,
              cutsomer_name: data.cutsomer_name,
              customer_mobile:
                stringify(data.customer_mobile)[0] +
                "xxxxxxxx" +
                stringify(data.customer_mobile)[9],
              overall_rating: data.overall_rating,
              comment: data.comment,
            };
            this.allarr.push(tabelobj);
          });
          if (feedbackResponse.has_next == true) {
            this.hasnext = true;
            this.nextUrl = feedbackResponse.next_page;
          } else {
            this.hasnext = false;
            this.nextUrl = "";
          }

          this.tabelData = this.allarr;
          this.dataSource = new MatTableDataSource(this.tabelData);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.showspinner.setSpinner(false);
          this.snakBar.open(
            "Message",
            ErrorMessgae[0][feedbackResponse.messgae],
            {
              duration: 4000,
            }
          );
        } else {
          this.showspinner.setSpinner(false);
          this.snakBar.open(
            "Message",
            ErrorMessgae[0][feedbackResponse.messgae],
            {
              duration: 4000,
            }
          );
        }
      });
  }
}

//  -------------------- changes  by Aaliya  ------------------------------
