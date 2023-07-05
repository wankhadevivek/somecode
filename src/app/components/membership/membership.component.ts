import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { GeneralService } from "../../services/general.service";
import { BehaviorSubject, forkJoin, Subscription } from "rxjs";
import { UserserviceService } from "../../services/userservice.service";
import { SpinnerService } from "../../services/spinner.service";
import { ErrorMessgae } from "../../shared/error_message/error";
import { ExpireAccountService } from "../../services/expire-account.service";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { DilogOpenService } from "../../services/dilog-open.service";
import * as glob from "../../shared/usercountry/userCountryGlobal"
@Component({
  selector: "app-membership",
  templateUrl: "./membership.component.html",
  styleUrls: ["./membership.component.css"],
})
/**
 * In this compoenet membership is managed
 * and workshop owner will proceed to pay for
 * recharge a;; banck account details are also managed
 * callled from the settings tab
 */
export class MembershipComponent implements OnInit {
  panelOpenState = false;
  rechangeData;
  loginDays;
  loginDate;
  plan;
  daysLeft;
  workshopRegisterDate;
  expiryDate;
  planPrice;
  Gold = 180;
  Platinum = 365;
  Trail = 30;
  DaysForCircle = 0;
  MaxDays;
  message;
  color;
  orderId = "";
  signature = "";
  urltosubmit = "";
  lastPaymnetDate = "";
  tranactionTabel = Array();
  expireMenber: boolean = false;
  rechargeData: any;
  perviousplan;
  daystoadd: any;
  vendorIdUn: any;
  adddetailsbutton: boolean = true;
  updatebutton: boolean = false;
  accNoForTop = "";
  accDateilsforEdit;
  isexpanded: boolean = false;
  displayedColumns: string[] = [
    "orderid",
    "plantype",
    "amount",
    "paymentmode",
    "status",
    "validitydays",
    "tranactiondate",
    "action",
  ];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  Accform: FormGroup;
  submitted = false;
  currency_symbol: any;
  constructor(
    public expiry: ExpireAccountService,
    private showspinner: SpinnerService,
    private router: Router,
    private snakBar: MatSnackBar,
    private formbuild: FormBuilder,
    private general: GeneralService,
    private userService: UserserviceService,
    private dialogService: DilogOpenService
  ) {
    this.accform();
  }
  ngOnInit() {
    this.currency_symbol = glob.currency_symbol;
    if (localStorage.getItem("clickhere")) {
      this.isexpanded = true;
      localStorage.removeItem("clickhere");
    }
    forkJoin(
      this.general.recharges(),
      this.general.allTransactions(this.userService.getData()["workshop_id"]),
      this.general.expiryMembership(this.userService.getData()["workshop_id"])
    ).subscribe(
      ([recharge, trans, membership]) => {
        this.showspinner.setSpinner(true);
        if (membership.success == true) {
          this.membershipDetails(membership);
          this.getAccountDetails(membership.data_vendor);
        }
        if (recharge.success == true) {
          this.rechargeData = recharge;
        }
        if (trans.success == true) {
          this.transctionsDetails(trans);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  //Check the Membership Details
  membershipDetails(allDetails) {
    var current_date = new Date();
    var month = current_date.getMonth() + 1;
    var dateInFormat =
      current_date.getFullYear() + "-" + month + "-" + current_date.getDate();
    this.loginDate = allDetails.data_workshop.login_date.split(".")[0];
    var Date1 = new Date(dateInFormat);
    var Date2 = new Date(this.loginDate.split(" ")[0]);
    var loginDays = Math.floor(
      (Date2.getTime() - Date1.getTime()) / (1000 * 60 * 60 * 24)
    );
    this.loginDays = Math.abs(loginDays);
    this.rechangeData = allDetails.data_rechrage;
    this.plan = this.rechangeData.recharge_type;
    this.perviousplan = this.rechangeData.recharge_type;
    this.planPrice = this.rechangeData.amount;
    this.expiryDate = allDetails.data_workshop.validity;
    this.workshopRegisterDate =
      allDetails.data_workshop.registration_date.split(".")[0];
    var current_date = new Date();
    var month = current_date.getMonth() + 1;
    var dateInFormat =
      current_date.getFullYear() + "-" + month + "-" + current_date.getDate();
    var Date1 = new Date(dateInFormat);
    var Date2 = new Date(this.expiryDate.split(" ")[0]);
    this.daysLeft = Math.floor(
      (Date2.getTime() - Date1.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (this.daysLeft <= 0) {
      this.daystoadd = this.daysLeft;
      this.message =
        "Your Membership is Expired for " +
        this.plan +
        " Plan. Please Renew your Membership.";
      this.daysLeft = 0;
      this.color = "#ce0e17";
      this.expireMenber = true;
    } else if (this.daysLeft <= 5) {
      this.daystoadd = this.daysLeft;
      this.message =
        "Your Plan " +
        this.plan +
        " will Expire in next " +
        this.daysLeft +
        " days. Please Renew your Membership.";
      this.daysLeft = 0;
      this.color = "#ce0e17";
      this.expireMenber = true;
    } else {
      this.message = this.plan + " Member.";
      this.color = "#42413d";
      this.expireMenber = false;
    }
    if (this.plan == "Gold") {
      this.DaysForCircle = this.Gold - parseInt(this.daysLeft);
      this.MaxDays = this.Gold;
    } else if (this.plan == "Platinum") {
      this.DaysForCircle = this.Platinum - parseInt(this.daysLeft);
      this.MaxDays = this.Platinum;
    } else {
      this.DaysForCircle = this.Trail - parseInt(this.daysLeft);
      this.MaxDays = this.Trail;
    }
    this.showspinner.setSpinner(false);
  }
  //Get All Transctions Details
  transctionsDetails(details) {
    details.all_tarns.map((data) => {
      this.tranactionTabel.push({
        orderid: data.transaction_id,
        plantype: data.recharge_type,
        amount: data.recharge_amount,
        paymentmode: data.payment_mode,
        status: data.recharge_status,
        validitydays: data.validity_days,
        tranactiondate: data.created_at,
      });
    });
    this.lastPaymnetDate = this.tranactionTabel[0]["tranactiondate"];
    this.dataSource = new MatTableDataSource(this.tranactionTabel);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.showspinner.setSpinner(false);
  }
  //Select Recharge Type
  selectRecharge() {
    this.dialogService
      .OpenSelectPayment(this.rechargeData, this.perviousplan, this.daystoadd)
      .subscribe((data) => {
        console.log(data);
      });
  }
  //donlaod invoice
  opnePdf(element) {
    this.dialogService.OpenPaymentType(element).subscribe((data) => {
      console.log(data);
      if (data == true) {
        this.showspinner.setSpinner(true);
        this.snakBar.open("Message", "Downlaoding Invoice", {
          duration: 4000,
        });
        this.showspinner.setSpinner(false);
      }
    });
  }
  //Account form
  //Form Validators for account
  accform() {
    this.Accform = this.formbuild.group({
      name: [
        "",
        [Validators.required, Validators.pattern(/^[a-zA-Z ]{2,30}$/)],
      ],
      phonenumber: [
        "",
        [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],
      ],
      email: ["", [Validators.required, Validators.email]],
      accnumber: ["", [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      accname: [
        "",
        [Validators.required, Validators.pattern(/^[a-zA-Z ]{2,30}$/)],
      ],
      ifsc: ["", [Validators.required, Validators.pattern(/^[a-z0-9]+$/i)]],
      panno: [
        "",
        Validators.pattern(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/),
      ],
      aadharno: ["", Validators.pattern(/^[0-9]*$/)],
      gstin: [
        "",
        Validators.pattern(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
        ),
      ],
      address1: ["", Validators.required],
      address2: [""],
      city: [
        "",
        [Validators.required, Validators.pattern(/^[a-zA-Z ]{2,30}$/)],
      ],
      state: [
        "",
        [Validators.required, Validators.pattern(/^[a-zA-Z ]{2,30}$/)],
      ],
      zipcode: ["", [Validators.required, Validators.pattern(/^[0-9]*$/)]],
    });
  }
  //get account Details
  getAccountDetails(accountdata) {
    if (accountdata.length != 0) {
      this.adddetailsbutton = false;
      var accMainData = JSON.parse(atob(accountdata.details));
      this.accDateilsforEdit = JSON.parse(atob(accountdata.details));
      this.accNoForTop = accMainData.accnumber.replace(/.(?=.{4})/g, "x");
      this.Accform.controls["name"].setValue(accountdata.name, {
        onlySelf: true,
      });
      this.Accform.controls["phonenumber"].setValue(accountdata.phone, {
        onlySelf: true,
      });
      this.Accform.controls["email"].setValue(accountdata.email, {
        onlySelf: true,
      });
      this.Accform.controls["accnumber"].setValue(
        accMainData.accnumber.replace(/.(?=.{4})/g, "x"),
        { onlySelf: false }
      );
      this.Accform.controls["accname"].setValue(accMainData.accname, {
        onlySelf: false,
      });
      this.Accform.controls["ifsc"].setValue(
        accMainData.ifsc.replace(/.(?=.{4})/g, "x"),
        { onlySelf: false }
      );
      this.Accform.controls["panno"].setValue(accMainData.panno, {
        onlySelf: false,
      });
      this.Accform.controls["aadharno"].setValue(accMainData.aadharno, {
        onlySelf: false,
      });
      this.Accform.controls["gstin"].setValue(accountdata.gstin, {
        onlySelf: false,
      });
      this.Accform.controls["address1"].setValue(accountdata.address1, {
        onlySelf: true,
      });
      this.Accform.controls["address2"].setValue(accountdata.address2, {
        onlySelf: true,
      });
      this.Accform.controls["city"].setValue(accountdata.city, {
        onlySelf: true,
      });
      this.Accform.controls["state"].setValue(accountdata.state, {
        onlySelf: true,
      });
      this.Accform.controls["zipcode"].setValue(accountdata.pincode, {
        onlySelf: true,
      });
      this.Accform.controls["accnumber"].disable();
      this.Accform.controls["accname"].disable();
      this.Accform.controls["ifsc"].disable();
      this.Accform.controls["panno"].disable();
      this.Accform.controls["aadharno"].disable();
      this.Accform.controls["gstin"].disable();
      this.Accform.controls["name"].disable(),
        this.Accform.controls["phonenumber"].disable(),
        this.Accform.controls["email"].disable(),
        this.Accform.controls["address1"].disable(),
        this.Accform.controls["address2"].disable(),
        this.Accform.controls["city"].disable(),
        this.Accform.controls["state"].disable(),
        this.Accform.controls["zipcode"].disable();
    }
  }
  //add account
  addAccountDetails(mode) {
    this.submitted = true;
    if (this.Accform.invalid) {
      return;
    } else {
      this.general
        .getOtpForLogin(this.userService.getData()["workshop_mobile_number_1"])
        .subscribe(
          (sendOTP) => {
            this.showspinner.setSpinner(true);
            if (sendOTP.success == true) {
              this.snakBar.open("Message", "OTP Send Successfully", {
                duration: 4000,
              });
              this.dialogService
                .OpenVerifyNumber(
                  this.userService.getData()["workshop_mobile_number_1"],
                  "no"
                )
                .subscribe((sucessotp) => {
                  if (sucessotp == true) {
                    var accountDetails;
                    if (mode == "create") {
                      this.snakBar.open("Message", "Adding Account", {
                        duration: 4000,
                      });
                      accountDetails = {
                        accnumber: this.Accform.getRawValue().accnumber,
                        accname: this.Accform.getRawValue().accname,
                        ifsc: this.Accform.getRawValue().ifsc,
                        panno: this.Accform.getRawValue().panno,
                        aadharno: this.Accform.getRawValue().aadharno,
                      };
                      this.accDateilsforEdit = accountDetails;
                    } else {
                      this.snakBar.open("Message", "Updating Account", {
                        duration: 4000,
                      });
                      accountDetails = {
                        accnumber: this.accDateilsforEdit.accnumber,
                        accname: this.accDateilsforEdit.accname,
                        ifsc: this.accDateilsforEdit.ifsc,
                        panno: this.Accform.getRawValue().panno,
                        aadharno: this.Accform.getRawValue().aadharno,
                      };
                      this.accDateilsforEdit = accountDetails;
                    }

                    this.general
                      .AddAccountDetails(
                        this.userService.getData()["workshop_id"],
                        this.Accform.getRawValue().name,
                        this.Accform.getRawValue().phonenumber,
                        this.Accform.getRawValue().email,
                        btoa(JSON.stringify(accountDetails)),
                        this.Accform.getRawValue().gstin,
                        this.Accform.getRawValue().address1,
                        this.Accform.getRawValue().address2,
                        this.Accform.getRawValue().city,
                        this.Accform.getRawValue().state,
                        this.Accform.getRawValue().zipcode,
                        mode
                      )
                      .subscribe(
                        (accountAdded) => {
                          this.showspinner.setSpinner(true);
                          if (accountAdded["success"] == true) {
                            this.snakBar.open(
                              "Message",
                              accountAdded["message"],
                              {
                                duration: 4000,
                              }
                            );
                            this.vendorIdUn =
                              accountAdded["data"][0]["vendorid"];
                            this.adddetailsbutton = false;
                            this.updatebutton = false;
                            this.accNoForTop =
                              this.Accform.getRawValue().accnumber.replace(
                                /.(?=.{4})/g,
                                "x"
                              );
                            this.Accform.controls["accnumber"].setValue(
                              this.Accform.getRawValue().accnumber.replace(
                                /.(?=.{4})/g,
                                "x"
                              ),
                              { onlySelf: false }
                            );
                            this.Accform.controls["ifsc"].setValue(
                              this.Accform.getRawValue().ifsc.replace(
                                /.(?=.{4})/g,
                                "x"
                              ),
                              { onlySelf: false }
                            );
                            this.Accform.controls["accnumber"].disable();
                            this.Accform.controls["accname"].disable();
                            this.Accform.controls["ifsc"].disable();
                            this.Accform.controls["panno"].disable();
                            this.Accform.controls["aadharno"].disable();
                            this.Accform.controls["gstin"].disable();
                            this.Accform.controls["name"].disable(),
                              this.Accform.controls["phonenumber"].disable(),
                              this.Accform.controls["email"].disable(),
                              this.Accform.controls["address1"].disable(),
                              this.Accform.controls["address2"].disable(),
                              this.Accform.controls["city"].disable(),
                              this.Accform.controls["state"].disable(),
                              this.Accform.controls["zipcode"].disable(),
                              localStorage.setItem("dl", "true");
                          } else {
                            this.snakBar.open(
                              "Message",
                              accountAdded["message"],
                              {
                                duration: 4000,
                              }
                            );
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
                  } else {
                    this.snakBar.open("Message", "OTP not Matched", {
                      duration: 4000,
                    });
                  }
                });
            } else {
              this.snakBar.open("Message", "OTP not Sent", {
                duration: 4000,
              });
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
  }
  //Edit Account Details
  EditAccountDetails() {
    this.updatebutton = true;
    this.Accform.controls["name"].enable(),
      this.Accform.controls["phonenumber"].enable(),
      this.Accform.controls["email"].enable(),
      this.Accform.controls["address1"].enable(),
      this.Accform.controls["address2"].enable(),
      this.Accform.controls["city"].enable(),
      this.Accform.controls["state"].enable(),
      this.Accform.controls["zipcode"].enable();
    this.Accform.controls["panno"].enable();
    this.Accform.controls["aadharno"].enable();
    this.Accform.controls["gstin"].enable();
    // this.submitted = true;
    // if (this.Accform.invalid) {
    //   return;
    // }else{

    // }
  }
  // Reset the account details
  ResetAccountDetails() {
    this.updatebutton = false;
    this.ngOnInit();
  }
}
