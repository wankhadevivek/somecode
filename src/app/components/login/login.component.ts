import { Injector, Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import { GeneralService } from "../../services/general.service";
import { UserserviceService } from "../../services/userservice.service";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { SpinnerService } from "../../services/spinner.service";
import { ErrorMessgae } from "../../shared/error_message/error";
import { el } from "date-fns/locale";
import { MessagingService } from "../../services/messaging.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
/**
 * In this compoenet
 * Login is done user will login here to the app
 */
export class LoginComponent implements OnInit {
  wrongOtpError: boolean = false;
  userNumber: string;
  showerror: boolean = false;
  shwootp: boolean = false;
  timerfalse: boolean = false;
  timeLeft: number;
  interval;
  userObject;
  usingPassword: boolean = false;
  myForm: FormGroup;
  otpForm: FormGroup;
  passForm: FormGroup;
  setPassForm: FormGroup;
  workshopUserForm: FormGroup;
  otpGetFromAPI: string;
  passwordNull: boolean = false;
  otpVerified: boolean = false;
  isWorkshopUser: boolean = false;
  constructor(
    private injector: Injector,
    private showspinner: SpinnerService,
    private router: Router,
    private snakBar: MatSnackBar,
    private formbuild: FormBuilder,
    private generalService: GeneralService,
    private userService: UserserviceService,
 
  ) {
    if (localStorage.getItem("user")) {
      if (this.userService.getData()["role"] == "supplier") {
        this.router.navigate(["orders"]);
      } else {
        this.router.navigate(["jobcards"]);
      }
    } else {
      this.router.navigate(["login"]);
    }
    this.reactiveForm();
    this.showOtpform();
  }
  // Actibve the forms
  ngOnInit() {
    this.showspinner.setSpinnerForLogin(true);
    this.showspinner.setSpinnerForLogin(false);
  }
  // Login form
  reactiveForm() {
    this.myForm = this.formbuild.group({
      phonenumber: [
        "",
        [
          Validators.required,
          Validators.pattern(/^([0|+[0-9]{1,9})?([1-9][0-9]{9})$/),
        ],
      ],
      roleOpt: ["workshop", Validators.required],
    });
    this.workshopUserForm = this.formbuild.group({
      user_name: ["", Validators.required],
      password: [
        "",
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{4}$/)],
      ],
    });
  }
  // OTP form
  showOtpform() {
    this.otpForm = this.formbuild.group({
      otp: ["", [Validators.required, Validators.pattern(/^[0-9]*$/)]],
    });
    this.setPassForm = this.formbuild.group(
      {
        password: [
          "",
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6,16}$/)],
        ],
        confirm_password: [
          "",
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6,16}$/)],
        ],
      },
      { validator: this.passwordConfirming }
    );
    this.passForm = this.formbuild.group({
      password: [
        "",
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6,16}$/)],
      ],
    });
  }
  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get("password").value !== c.get("confirm_password").value) {
      return { invalid: true };
    }
  }
  // the funtion that gets called after entering mobile number to login
  // Submit the number for the OTP and chek in databse
  submitForm() {
    this.userObject = "";
    this.otpGetFromAPI = "";
    this.timeLeft = 60;
    this.timerfalse = false;

    this.generalService.loginUser(this.myForm.value.phonenumber).subscribe(
      (loginData) => {
        this.showspinner.setSpinnerForLogin(true);
        if (
          loginData.success == false ||
          loginData.data[0].role == "supplier"
        ) {
          this.showspinner.setSpinnerForLogin(false);
          this.showerror = true;
          this.shwootp = false;
        } else if (loginData.success == true) {
          localStorage.setItem("isUserLogin", "false");
          localStorage.removeItem("user_name");
          if (this.myForm.value.roleOpt == "workshop") {
            if (
              loginData.data[0].password == undefined ||
              loginData.data[0].password == null
            ) {
              this.passwordNull = true;
              this.sendOtp(this.myForm.value.phonenumber);
              this.shwootp = true;
              this.usingPassword = false;
            } else {
              // setInterval('', 3000);
              setInterval(() => {
                this.usingPassword = true;
                this.shwootp = false;
                this.passwordNull = false;
              }, 3000);
            }
          } else {
            this.isWorkshopUser = true;
          }

          this.userObject = loginData.data[0];
          this.otpGetFromAPI = loginData.data["otp"];

          localStorage.setItem(
            "notifyActive",
            loginData.data[0]["notifyActive"]
          );
          localStorage.setItem("already_notified", "false");

          localStorage.setItem("unique_id", loginData.data[0]["unique_id"]);
          // FCM Token refresh and store in local host
          if (localStorage.getItem("notifyActive") === "true") {
            const messagingService = this.injector.get(MessagingService);
            messagingService.requestPermission();
            messagingService.receiveMessage();
          }
          this.showspinner.setSpinnerForLogin(false);
          this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
              this.timeLeft--;
            } else {
              this.timerfalse = true;
            }
          }, 1000);
        }
      },
      (error) => {
        this.showspinner.setSpinnerForLogin(false);
        this.snakBar.open("Error", ErrorMessgae[0][error], {
          duration: 4000,
        });
      }
    );
  }

  pre_checking() {
    return new Promise((resolve) => {
      if (localStorage.getItem("notifyActive") === "true") {
        const messagingService = this.injector.get(MessagingService);
        messagingService.requestPermission();
        messagingService.receiveMessage();

        setTimeout(
          () => {
            this.generalService
              .updateNotifyParams("set")
              .subscribe((response) => {
                console.log("ok");
              }),
              resolve("resolved");
          },

          15000
        );
      } else {
        resolve("resolved");
      }
    });
  }

  // Submit the OTP amd verify and login
  submitFormForLogin(option) {
    this.showspinner.setSpinnerForLogin(true);
    if (option == "by_otp") {
      this.generalService
        .verifyOTP(this.myForm.value.phonenumber, this.otpForm.value.otp)
        .subscribe(
          (msgResponse) => {
            if (
              msgResponse.type == "success" ||
              msgResponse["type"] == "success"
            ) {
              this.shwootp = false;
              this.otpVerified = true;
              this.wrongOtpError = false;
              this.showspinner.setSpinnerForLogin(false);
            } else {
              this.showspinner.setSpinnerForLogin(false);
              this.snakBar.open("err", msgResponse["message"], {
                duration: 4000,
              });
              this.wrongOtpError = true;
            }
          },
          (err) => {
            this.showspinner.setSpinnerForLogin(false);
            this.snakBar.open("err", ErrorMessgae[0][err], {
              duration: 4000,
            });
          }
        );
    }
    if (option == "by_pass") {
      // if notifyActive true refresh FCM token and send back to the backend

      // await this.pre_checking();
      this.generalService.updateNotifyParams("set").subscribe((response) => {
        console.log("FCM ok");
      }),
        this.generalService
          .verifyPassword(
            this.myForm.value.phonenumber,
            this.passForm.value.password
          )
          .subscribe((msgResponse) => {
            if (msgResponse["type"] == "success") {
              this.wrongOtpError = false;
              this.snakBar.open("Login Success", "", {
                duration: 4000,
              });
              localStorage.setItem("falg", "true");
              // localStorage.setItem("notifyActive", msgResponse["notifyActive"]);
              this.generalService
                .expiryMembership(this.userObject.workshop_id)
                .subscribe(
                  (memberData) => {
                    this.showspinner.setSpinnerForLogin(true);
                    if (memberData.success == true) {
                      memberData.data_workshop.validity;
                      var expiry_date = new Date(
                        memberData.data_workshop.validity.split(" ")[0]
                      );
                      var current_date = new Date();
                      if (memberData.data_workshop.vendorid == null) {
                        localStorage.setItem("dl", "false");
                      } else {
                        localStorage.setItem("dl", "true");
                      }
                      console.log('current_date.getTime()', current_date.getTime())
                      if (current_date.getTime() > expiry_date.getTime()) {
                       
                        this.showspinner.setSpinner(false);
                        localStorage.setItem("falg", "false");
                        localStorage.setItem("showpopup", "true");
                       
                        this.router.navigate(['membership']);
                        
                      } else {
                       
                        this.showspinner.setSpinner(false);
                        localStorage.setItem("falg", "true");
                        localStorage.setItem("showpopup", "true");
                      }
                    } else {
                      this.showspinner.setSpinnerForLogin(false);
                      localStorage.setItem("falg", "true");
                      localStorage.setItem("showpopup", "true");
                    }
                  },
                  (err) => {
                    this.showspinner.setSpinner(false);
                    console.log("error");
                    localStorage.setItem("falg", "true");
                  }
                );
                // if admin and was trying to add new account 
                // make api request to add entry in linkedaccount information 
                this.checkAndLinkWorkshops()

            
              if (this.userObject.signature != " ") {
                (async () => {
                  let blob = await fetch(this.userObject.signature).then((r) =>
                    r.blob()
                  );
                  let dataUrl = await new Promise((resolve) => {
                    let reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                  });
                  // now do something with `dataUrl`
                  this.userObject.signature = dataUrl;
                  this.userService.login(this.userObject);
                })();
              } else {
                this.userObject.signature = "false";
                this.userService.login(this.userObject);
              }
            } else {
              this.showspinner.setSpinnerForLogin(false);
              this.snakBar.open(
                "err",
                msgResponse["message"] || "Please Enter Correct password",
                {
                  duration: 4000,
                }
              );
              this.wrongOtpError = true;
            }
            (err) => {
              this.showspinner.setSpinnerForLogin(false);
              this.snakBar.open("err", ErrorMessgae[0][err], {
                duration: 4000,
              });
            };
          });
    }
  }
  // resend the OTP
  resendOTP() {
    this.generalService.resendOTP(this.myForm.value.phonenumber).subscribe(
      (otp) => {
        if (otp["type"] == "success") {
          this.snakBar.open("OTP Send Sucessfully", "", {
            duration: 4000,
          });
        } else {
          this.snakBar.open("Error", "", {
            duration: 4000,
          });
        }
      },
      (err) => {
        this.snakBar.open("err", ErrorMessgae[0][err], {
          duration: 4000,
        });
      }
    );
  }

  sendOtp(mobileno) {
    this.generalService.getOtpForLogin(mobileno).subscribe(
      (otp) => {
        // console.log("otp", otp);
        if (otp["type"] == "success") {
          this.snakBar.open("OTP Send Sucessfully", "", {
            duration: 4000,
          });
        } else {
          this.snakBar.open("Error", "", {
            duration: 4000,
          });
        }
      },
      (err) => {
        this.snakBar.open("err", ErrorMessgae[0][err], {
          duration: 4000,
        });
      }
    );
  }
  setPassword(mode) {
    this.generalService
      .setUserPassword(
        this.myForm.value.phonenumber,
        mode,
        this.setPassForm.value.password,
        this.setPassForm.value.old_password
      )
      .subscribe((res) => {
        if (res.success) {
          this.snakBar.open("password successfully set", "", {
            duration: 4000,
          });
          this.processToNextStep();
        }
      });
  }
  processToNextStep() {
    this.snakBar.open("Login Success", "", {
      duration: 4000,
    });
    this.checkAndLinkWorkshops()
    localStorage.setItem("falg", "true");
    this.generalService.expiryMembership(this.userObject.workshop_id).subscribe(
      (memberData) => {
        this.showspinner.setSpinnerForLogin(true);
        if (memberData.success == true) {
          memberData.data_workshop.validity;
          var expiry_date = new Date(
            memberData.data_workshop.validity.split(" ")[0]
          );
          var current_date = new Date();
          if (memberData.data_workshop.vendorid == null) {
            localStorage.setItem("dl", "false");
          } else {
            localStorage.setItem("dl", "true");
          }
          if (current_date.getTime() > expiry_date.getTime()) {
            this.showspinner.setSpinner(false);
            localStorage.setItem("falg", "false");
            localStorage.setItem("showpopup", "true");
          } else {
            this.showspinner.setSpinner(false);
            localStorage.setItem("falg", "true");
            localStorage.setItem("showpopup", "true");
          }
        } else {
          this.showspinner.setSpinnerForLogin(false);
          localStorage.setItem("falg", "true");
          localStorage.setItem("showpopup", "true");
        }
      },
      (err) => {
         this.showspinner.setSpinner(false);
        console.log("error");
        localStorage.setItem("falg", "true");
      }
    );
    if (this.userObject.signature != " ") {
      (async () => {
        let blob = await fetch(this.userObject.signature).then((r) => r.blob());
        let dataUrl = await new Promise((resolve) => {
          let reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
        // now do something with `dataUrl`
        this.userObject.signature = dataUrl;
        this.userService.login(this.userObject);
      })();
    } else {
      this.userObject.signature = "false";
      this.userService.login(this.userObject);
    }
  }

  verifyUserWorkshop() {
    this.generalService
      .verifyUserWorkshop(
        this.userObject.workshop_id,
        this.workshopUserForm.value.user_name,
        this.workshopUserForm.value.password
      )
      .subscribe((res) => {
        if (res.success) {
          this.snakBar.open("Login Success", "", {
            duration: 4000,
          });
          localStorage.setItem("falg", "true");
          localStorage.setItem("isUserLogin", "true");
          
          localStorage.setItem(
            "user_name",
            this.workshopUserForm.value.user_name
          );
          // localStorage.setItem("notifyActive", msgResponse["notifyActive"]);
          this.generalService
            .expiryMembership(this.userObject.workshop_id)
            .subscribe(
              (memberData) => {
                this.showspinner.setSpinnerForLogin(true);
                if (memberData.success == true) {
                  memberData.data_workshop.validity;
                  var expiry_date = new Date(
                    memberData.data_workshop.validity.split(" ")[0]
                  );
                  var current_date = new Date();
                  if (memberData.data_workshop.vendorid == null) {
                    localStorage.setItem("dl", "false");
                  } else {
                    localStorage.setItem("dl", "true");
                  }
                  if (current_date.getTime() > expiry_date.getTime()) {
                    this.showspinner.setSpinner(false);
                    localStorage.setItem("falg", "false");
                    localStorage.setItem("showpopup", "true");
                  } else {
                    this.showspinner.setSpinner(false);
                    localStorage.setItem("falg", "true");
                    localStorage.setItem("showpopup", "true");
                  }
                } else {
                  this.showspinner.setSpinnerForLogin(false);
                  localStorage.setItem("falg", "true");
                  localStorage.setItem("showpopup", "true");
                }
              },
              (err) => {
                this.showspinner.setSpinner(false);
                console.log("error");
                localStorage.setItem("falg", "true");
              }
            );
          if (this.userObject.signature != " ") {
            (async () => {
              let blob = await fetch(this.userObject.signature).then((r) =>
                r.blob()
              );
              let dataUrl = await new Promise((resolve) => {
                let reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
              });
              // now do something with `dataUrl`
              this.userObject.signature = dataUrl;
              this.userService.login(this.userObject);
            })();
          } else {
            this.userObject.signature = "false";
            this.userService.login(this.userObject);
          }
        } else {
          localStorage.setItem("isUserLogin", "false");
          this.snakBar.open(
            "Login Failed, Please check username or password",
            "",
            {
              duration: 4000,
            }
          );
        }
      });
  }

  checkAndLinkWorkshops(){
    if (localStorage.getItem("adminwk") !== null && 
                Number(localStorage.getItem("adminwk")) !== this.userObject.workshop_id) {
                  this.generalService
                .addLinkedAccounts(localStorage.getItem("adminwk"), this.userObject.workshop_id)
                .subscribe((resp)=>{
                // console.log(resp)
                },
                (err) => {
                  this.showspinner.setSpinner(false);
                  console.log("error");
             
                }
                )
                  
                }
  }
}
