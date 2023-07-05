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
import * as glob from "../../shared/usercountry/userCountryGlobal";
@Component({
  selector: "app-collectpayment",
  templateUrl: "./collectpayment.component.html",
  styleUrls: ["./collectpayment.component.css"],
})
/**
 * This compoenet is used to track the
 * payments and the settelmenets
 */
export class CollectpaymentComponent implements OnInit {
  displayedColumns: string[] = [
    "date",
    "jobcard_number",
    "customer_details",
    "amount",
    "settel_amount",
    "status",
  ];
  dataSource;
  tabelData;
  checkAccountDetails;
  paymentPending;
  requestedPayment;
  receivedPayment;
  allarr = Array();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  currency_symbol: any;
  constructor(
    public sendPDF: PrintsharepdfService,
    private showspinner: SpinnerService,
    private dialog: DilogOpenService,
    private userservice: UserserviceService,
    public generalservice: GeneralService,
    private snakBar: MatSnackBar
  ) {}
  //load the payment list
  ngOnInit() {
    this.currency_symbol = glob.currency_symbol;
    this.checkAccountDetails = localStorage.getItem("dl");
    this.generalservice
      .receviedPayment(this.userservice.getData()["workshop_id"])
      .subscribe(
        (receviedData) => {
          this.showspinner.setSpinner(true);
          if (receviedData.success == true) {
            this.requestedPayment = receviedData.requestedamountcount;
            this.receivedPayment = receviedData.receviedamount;
            this.paymentPending = receviedData.request_count;
            var objs = receviedData.alljobamount.map(function (x) {
              return {
                job: x["jobcardnumber"],
                amount: x["amount"],
              };
            });
            receviedData.data.map((data) => {
              let obj = objs.find((o) => o.job === data.jobcardnumber);
              var tabelobj = {
                date: data.created_at,
                jobcard_number: data.jobcardnumber,
                customer_details: data.customername,
                amount: obj.amount,
                settel_amount: obj.amount,
              };
              this.allarr.push(tabelobj);
            });
            this.tabelData = this.allarr;
            this.dataSource = new MatTableDataSource(this.tabelData);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.showspinner.setSpinner(false);
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
  // open popup to show details of the tranasctions
  openTransDetails(event) {
    this.dialog.OpenTransDetails(event).subscribe((dataTrans) => {});
  }
  // edit the jobcard
  editJobcard(event) {
    this.generalservice
      .jobCradDetails(this.userservice.getData()["workshop_id"], event)
      .subscribe(
        (jobData) => {
          this.showspinner.setSpinner(true);
          if (jobData.success == true) {
            if (
              jobData.jobcards[0].vehicle_details != null &&
              jobData.jobcards[0].vehicle_details != ""
            ) {
              var vehicle_details = JSON.parse(
                jobData.jobcards[0].vehicle_details.replace(/\\/g, "")
              );
            }
            jobData.jobcards[0].vehicle_details = vehicle_details;
            this.dialog
              .CreateJobCard(
                jobData.jobcards[0],
                jobData.jobcards[0].jobcard_status,
                "edit",
                "manual"
              )
              .subscribe((datanew) => {
                var getStatus = this.sendPDF.sendEmail("dashboard", datanew);
                if (getStatus == true) {
                  this.snakBar.open("Message", "Mail Sent", {
                    duration: 4000,
                  });
                }
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
  }

  // add tthe local
  addlocal() {
    localStorage.setItem("clickhere", "true");
  }
}
