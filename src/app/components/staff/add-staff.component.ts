import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { version } from "moment";
import { GeneralService } from "src/app/services/general.service";
import { SpinnerService } from "src/app/services/spinner.service";
import { UserserviceService } from "src/app/services/userservice.service";
import { ErrorMessgae } from "src/app/shared/error_message/error";
import * as glob from "../../shared/usercountry/userCountryGlobal";
@Component({
  selector: "app-add-staff",
  templateUrl: "./add-staff.component.html",
  styleUrls: ["./staff.component.css"],
})
export class AddStaffComponent implements OnInit {
  satffForm: FormGroup;
  description: string;
  form: FormGroup;
  userworkshopid;

  staffdata;
  isEdit;
  dateField;
  maxDate;
  dateFieldValue;
  valueDate;
  regex = /^\d+(\.\d{1,2})?$/;
  err_check = false;
  currency_symbol: any;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddStaffComponent>,
    private general: GeneralService,
    private snakBar: MatSnackBar,
    private showspinner: SpinnerService,
    private userService: UserserviceService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.staffdata = data.staffData;
    this.isEdit = data.edit;

    const now = new Date();
    this.valueDate = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
  }
  ngOnInit() {
    this.currency_symbol = glob.currency_symbol;
    let name = "";
    let mobile1 = "";
    let mobile2 = "";
    let email = "";
    let stafftype = "Mechanic";
    let joindate = new NgbDate(
      this.valueDate.year,
      this.valueDate.month,
      this.valueDate.date
    );

    // const currentStaff = new Date();
    // joindate={ year: currentStaff.getFullYear(), month: currentStaff.getMonth() + 1, day: currentStaff.getDate()};

    let address = "";
    let salary = 0;
    let incentives = 0;

    if (this.isEdit) {
      name = this.staffdata.name;
      mobile1 = this.staffdata.mobile_no_1;
      mobile2 = this.staffdata.mobile_no_2;
      email = this.staffdata.email;
      stafftype = this.staffdata.type;
      address = this.staffdata.address;

      const [year, month, day] = this.staffdata.created_at.split("-");
      const obj = {
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day.split(" ")[0].trim()),
      };
      this.dateField = obj;

      joindate = new NgbDate(
        this.dateField.year,
        this.dateField.month,
        this.dateField.day
      );

      salary = this.staffdata.salary;
      incentives = this.staffdata.incentives;
    }

    this.satffForm = this.fb.group({
      name: [name, Validators.required],
      mobile1: [
        mobile1,
        [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],
      ],
      mobile2: [mobile2, Validators.pattern(/^[6-9]\d{9}$/)],
      email: [email, Validators.email],
      stafftype: [stafftype],
      joindate: [joindate],
      address: [address],
      salary: [salary, Validators.pattern(this.regex)],
      incentive: [incentives, Validators.pattern(this.regex)],
    });
  }

  closePopup() {
    this.dialogRef.close("okay");
  }
  addstaff(mode, version) {
    if (!this.isEdit) {
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
      this.userworkshopid = this.userService.getData()["workshop_id"];

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
          this.satffForm.getRawValue().address,
          this.satffForm.getRawValue().salary,
          this.satffForm.getRawValue().incentive
        )
        .subscribe(
          (createdStaff) => {
            if (createdStaff.success == true) {
              const work_id = this.userworkshopid.toString();
              // this.showspinner.setSpinnerForLogin(true);
              // this.showspinner.setSpinnerForLogin(false);
              this.snakBar.open(
                "Message",
                ErrorMessgae[0][createdStaff["message"]],
                {
                  duration: 4000,
                }
              );
              this.err_check = true;
              this.dialogRef.close("done");
            }
          },
          (err) => {
            // this.showspinner.setSpinnerForLogin(false);
            this.snakBar.open("Error", ErrorMessgae[0][err], {
              duration: 4000,
            });
          }
        );
    } else if (this.isEdit) {
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
      this.userworkshopid = this.userService.getData()["workshop_id"];

      if (this.satffForm.getRawValue().mobile2 == "") {
        mobile = 0;
      } else {
        mobile = this.satffForm.getRawValue().mobile2;
      }
      this.general
        .UpdateStaff(
          this.userworkshopid,
          this.staffdata.id,
          this.satffForm.getRawValue().stafftype,
          this.satffForm.getRawValue().name,
          this.satffForm.getRawValue().mobile1,
          mobile,
          datejoin,
          this.satffForm.getRawValue().email,
          this.satffForm.getRawValue().address,
          this.satffForm.getRawValue().salary,
          this.satffForm.getRawValue().incentive
        )
        .subscribe(
          (createdStaff) => {
            // this.showspinner.setSpinnerForLogin(true);
            this.showspinner.setSpinnerForLogin(false);
            this.snakBar.open(
              "Message",
              ErrorMessgae[0][createdStaff["message"]],
              {
                duration: 4000,
              }
            );
            this.err_check = true;
            // this.dialogRef.close("done");

            if (createdStaff.success == true) {
              this.dialogRef.close("done");
            }
          },
          (err) => {
            // this.showspinner.setSpinnerForLogin(false);
            this.snakBar.open("Error", ErrorMessgae[0][err], {
              duration: 4000,
            });
          }
        );
    }
    // if (this.err_check) {
    //   this.dialogRef.close(this.staffdata);
    // }

    // this.dialogRef.close(this.staffdata);
  }
}
