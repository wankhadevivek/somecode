import { Component, OnInit, Inject, Injector } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from "@angular/material";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { UserserviceService } from "../../../services/userservice.service";
import { SpinnerService } from "../../../services/spinner.service";
import { GeneralService } from "../../../services/general.service";
import { Router } from "@angular/router";
import { MessagingService } from "../../../services/messaging.service";
@Component({
  selector: "app-end-user-login",
  templateUrl: "./end-user-login.component.html",
  styleUrls: ["./end-user-login.component.css"],
})
/**
 * In this file usr is login
 * or register for the workshop
 * user and our end-user
 */
export class EndUserLoginComponent implements OnInit {
  OTPForm: FormGroup;
  Numberorm: FormGroup;
  submitted = false;
  submittednumber = false;
  shownumberformfalg: boolean = true;
  phonenumber;
  flagupdate;
  constructor(
    private showspinner: SpinnerService,
    private snakBar: MatSnackBar,
    private formbuild: FormBuilder,
    private general: GeneralService,
    private userService: UserserviceService,
    private router: Router,
    public dialogRef: MatDialogRef<EndUserLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private injector: Injector
  ) {
    this.flagupdate = data.flag;
    this.showOtpform();
    this.shownumberform();
  }
  ngOnInit() {}
  //close the poup
  closePopup(event) {
    if (event == true) {
      this.submitted = true;
      if (this.OTPForm.invalid) {
        return;
      } else {
        // send the FCM token to store at server

        if (localStorage.getItem("notifyActive") == "true") {
          const messagingService = this.injector.get(MessagingService);
          messagingService.requestPermission();
          messagingService.receiveMessage();
        }
        // update the token back to the server

        setTimeout(() => {
          this.general
            .updateEndUserNotifyParams(
              "set",
              this.Numberorm.getRawValue().number
            )
            .subscribe((response) => {
              console.log("FCM ok");
            });
        }, 2000);

        this.general
          .verifyEndUserOTP(
            this.Numberorm.getRawValue().number,
            this.OTPForm.getRawValue().otp,
            localStorage.getItem("check")
          )
          .subscribe(
            (verifyNo) => {
              if (verifyNo.success == true) {
                var vehicledata;
                if (verifyNo.data.vehicle_number == "false") {
                  vehicledata = {
                    chassis_number: "",
                    customer_dob: "",
                    customer_email: "",
                    customer_mobile: verifyNo.data.customer_mobile,
                    customer_mobile_2: 0,
                    customer_name: "User",
                    driver_mobile: 0,
                    driver_name: null,
                    drop_address: "",
                    engine_number: "",
                    gst_number: null,
                    id: "142551",
                    km_read: null,
                    pick_up_address: "",
                    vehicle_color: null,
                    vehicle_make: "",
                    vehicle_model: "",
                    vehicle_number: "false",
                    vehicle_type: "",
                    vehicle_variant: "",
                  };
                  localStorage.setItem("is_register", "false");
                  var urlpara = JSON.parse(
                    localStorage.getItem("work_data")
                  ).url_param;
                  localStorage.setItem("enduser", JSON.stringify(vehicledata));
                  this.router.navigate(["/cus/" + urlpara + "/profile"]);
                  this.dialogRef.close("truenotokay");
                } else {
                  vehicledata = verifyNo.data;
                  localStorage.setItem("is_register", "true");
                  localStorage.setItem("enduser", JSON.stringify(vehicledata));
                  this.dialogRef.close("trueokay");
                }
                //location.reload()
                // console.log("ustomerNotifyActive", verifyNo.notifyActive);
                // localStorage.setItem(
                //   "customerNotifyActive",
                //   verifyNo.notifyActive
                // );
              } else {
                this.dialogRef.close("false");
                this.snakBar.open("Message", "OTP Not Verified", {
                  duration: 4000,
                });
              }
            },
            (err) => {
              this.showspinner.setSpinner(false);
              this.snakBar.open("Error", "Error In verify OTP", {
                duration: 4000,
              });
            }
          );
      }
    } else {
      this.dialogRef.close(event);
    }
  }
  //verify the number and login or register
  verifyNumber(e) {
    this.submittednumber = true;
    if (this.Numberorm.invalid) {
      return;
    } else {
      this.general.getEndUserOTP(this.Numberorm.getRawValue().number).subscribe(
        (otp) => {
          this.showspinner.setSpinner(true);
          if (otp.success == true) {
            this.snakBar.open("Message", "OTP Send Successfully", {
              duration: 4000,
            });
            this.shownumberformfalg = false;
            // check if active true
            // if true refresh FCM token
            // update values in the backend
          } else {
            this.snakBar.open("Message", "OTP Not Send", {
              duration: 4000,
            });
          }
          this.showspinner.setSpinner(false);
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Message", "OTP Not Send", {
            duration: 4000,
          });
        }
      );

      this.general
        .getEndUserNotifyParams("get", this.Numberorm.getRawValue().number)
        .subscribe(
          (data) => {
            console.log();
            // store notifyActive in localStorage
            if (data.success == true) {
              localStorage.setItem("notifyActive", data.notifyActive);
              localStorage.setItem("already_notified", "false");
            }
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
  // OTP form
  showOtpform() {
    this.OTPForm = this.formbuild.group({
      otp: ["", [Validators.required, Validators.pattern(/^[0-9]*$/)]],
    });
  }
  // Mobile number form
  shownumberform() {
    this.Numberorm = this.formbuild.group({
      number: ["", [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    });
  }
  // resend OTP
  resend() {
    this.general
      .resendEndUserOTP(this.Numberorm.getRawValue().number)
      .subscribe(
        (otp) => {
          this.showspinner.setSpinner(true);
          if (otp.success == true) {
            this.snakBar.open("Message", "OTP Send Successfully", {
              duration: 4000,
            });
            this.shownumberformfalg = false;
          } else {
            this.snakBar.open("Message", "OTP Not Send", {
              duration: 4000,
            });
          }
          this.showspinner.setSpinner(false);
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Message", "OTP Not Send", {
            duration: 4000,
          });
        }
      );
  }
}
