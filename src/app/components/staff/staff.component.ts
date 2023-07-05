import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";

import {
  NgbDate,
  NgbCalendar,
  NgbDateParserFormatter,
} from "@ng-bootstrap/ng-bootstrap";
import { GeneralService } from "../../services/general.service";
import { UserserviceService } from "../../services/userservice.service";
import { MatSnackBar } from "@angular/material";
import { SpinnerService } from "../../services/spinner.service";
import { ErrorMessgae } from "../../shared/error_message/error";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  SatDatepickerModule,
} from "saturn-datepicker";
import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from "../../shared/model/date/date.adapter";
import { StaffData } from "../../shared/model/workshop/staff.module";
import { AddStaffComponent } from "./add-staff.component";
import { DilogOpenService } from "src/app/services/dilog-open.service";

@Component({
  selector: "app-staff",
  templateUrl: "./staff.component.html",
  styleUrls: ["./staff.component.css"],
})
export class StaffComponent implements OnInit {
  arr = Array();

  public tabelData = Array();
  displayedColumns = ["id", "name", "mobile_no_1", "type", "address", "action"];
  datasource = new MatTableDataSource<StaffData>();
  userworkshopid;
  isEdit;

  constructor(
    private showspinner: SpinnerService,
    private snakBar: MatSnackBar,
    private userService: UserserviceService,
    private generalService: GeneralService,
    private dialog: MatDialog,
    private dialogService: DilogOpenService
  ) {}

  ngOnInit() {
    // this.showspinner.setSpinner(true);

    this.onGetStaff();
  }
  onGetStaff() {
    this.userworkshopid = this.userService.getData()["workshop_id"];
    this.generalService.getStaffList(this.userworkshopid).subscribe(
      (staffList) => {
        // changes to show not found
        if (staffList.success == false) {
          this.showspinner.setSpinner(false);
          // this.datasource = undefined;

          this.tabelData = undefined;
        } else if (staffList.success == true) {
          this.tabelData = [];
          this.tabelData = staffList.staff;
          // this.datasource.data = staffList.staff;
        }

        if (this.tabelData !== undefined) {
          this.datasource.data = this.tabelData;
        } else {
          this.tabelData = [];
          this.datasource.data = this.tabelData;
          this.tabelData = undefined;
        }

        // ------------------------------------------
      },
      (err) => {
        this.showspinner.setSpinnerForLogin(false);
        this.snakBar.open("Error", ErrorMessgae[0][err], {
          duration: 4000,
        });
      }
    );
  }

  onDeleteStaff(staff_id) {
    let questionForDialog = "Are You Sure Want to Delete the Staff Member ";

    this.dialogService
      .OpenConfirmDialog(questionForDialog, true, "Delete")
      .subscribe((answer) => {
        if (answer == true) {
          this.userworkshopid = this.userService.getData()["workshop_id"];
          this.generalService
            .DeleteStaff(this.userworkshopid, staff_id)
            .subscribe(
              (response) => {
                if (response.success == true) {
                  this.showspinner.setSpinnerForLogin(true);
                  this.snakBar.open(
                    "Message",
                    ErrorMessgae[0][response["message"]],
                    {
                      duration: 4000,
                    }
                  );
                }
                this.onGetStaff();
              },
              (err) => {
                this.showspinner.setSpinnerForLogin(false);
                this.snakBar.open("Error", ErrorMessgae[0][err], {
                  duration: 4000,
                });
              }
            );
        } else {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Message", "Delete Canceled", {
            duration: 4000,
          });
        }
      });
  }

  doFilter(filter: string) {
    this.datasource.filter = filter.trim().toLowerCase();
  }

  openDialog(staffdata, mode) {
    const dialogConfig = new MatDialogConfig();
    this.isEdit = false;
    if (mode === "edit") {
      this.isEdit = true;
    }
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.height = "100%";
    dialogConfig.position = {
      top: "0",
      right: "0",
    };
    dialogConfig.data = {
      staffData: staffdata,
      edit: this.isEdit,
    };
    dialogConfig.panelClass = "custom-modalbox";

    const dialogRef = this.dialog.open(AddStaffComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      this.onGetStaff();
    });
  }
}
