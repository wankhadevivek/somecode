import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { GeneralService } from "../../services/general.service";
import { UserserviceService } from "../../services/userservice.service";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { SpinnerService } from "../../services/spinner.service";
import { ErrorMessgae } from "../../shared/error_message/error";
import { AbstractService } from "../../services/comman/abstract.service";
import { EndUserLayoutComponent } from "../enduserlayout/enduserlayout.component";
import * as glob from "../../shared/usercountry/userCountryGlobal";
@Component({
  selector: "app-cusonlinebook",
  templateUrl: "./cusonlinebook.component.html",
  styleUrls: ["./cusonlinebook.component.css"],
})
/**
 * In this compoenet booking
 * of an appotment is done
 * all the vehicles of the customer is shown
 * here.
 */
export class CusOnlineBookComponent implements OnInit {
  workshopOnline;
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  showonlineservices;
  showonlineservicestwo;
  allOnlineServices = Array();
  workshopname;
  workshoptiltle;
  workshopaddress;
  workshopemail;
  workshopemailhref;
  workshopverified;
  workshoplogo;
  settingsBillData;
  termsandconditions;
  showloginsection: boolean;
  urlparam;
  paramforhome;
  paramforservice;
  paramforbooking;
  showfirst: boolean = true;
  parmforbook;
  successmessage: boolean = false;
  vehiclesearchmodel;
  searchVehicleData = [];
  customerId;
  vehicleNumber;
  contactlink;
  vehiclepic;
  showVehicles: boolean = true;
  vehiclesAllListArr = Array();
  duplicateArrofVehicles = Array();
  workshopmobile;
  dropcheck: boolean = true;
  pickcheck: boolean = false;
  submitted = false;
  submittedsecond = false;
  todaycalss = "select-timeend";
  toclass = "select-timeend active";
  deliveryDateFieldForAdd;
  timeofservice;
  showStep = true;
  time11 = "select-timeend";
  time12 = "select-timeend active";
  time13 = "select-timeend";
  time14 = "select-timeend";
  time15 = "select-timeend";
  time16 = "select-timeend";
  selectedService = Array();
  totalAmount = 0;
  istrue: boolean = false;
  customername;
  customerphone;
  servicesbooked;
  servicesbookedarr = Array();
  servicetime;
  totalamount;
  vehiclebooknumber;
  vehiclebookdetails;
  bookingid;
  bookaddress;
  maxDate;
  deliveryDateField;
  deliveryTimeField;
  SelectedDataarrOfVehicle;
  vehicelefinal;
  mainVehiclearr = Array();
  currency_symbol: any;

  pick_up: any;
  constructor(
    public usercomp: EndUserLayoutComponent,
    public abstract: AbstractService,
    private showspinner: SpinnerService,
    private router: Router,
    private snakBar: MatSnackBar,
    private formbuild: FormBuilder,
    private generalService: GeneralService,
    private userService: UserserviceService
  ) {
    this.firstFormGroup = this.formbuild.group({
      serachvehicle: ["", Validators.required],
      vehiclenumber: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{1}[0-9]{4})|" +
              "^([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{1}[0-9]{4})|" +
              "([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{1}[0-9]{3})|([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{4})|" +
              "([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{3})|([a-zA-Z]{2}[0-9]{2}[-]{1}[0-9]{4})|" +
              "([a-zA-Z]{2}[0-9]{2}[-]{1}[0-9]{3})|([a-zA-Z]{3}[0-9]{4})|([a-zA-Z]{3}[0-9]{3})|" +
              "([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{3}[0-9]{4})|([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{3}[0-9]{3})|" +
              "([a-zA-Z]{2}[0-9]{3}[a-zA-Z]{1}[0-9]{4})$"
          ),
        ],
      ],
      name: ["", Validators.required],
      mobilenumber: [
        "",
        [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],
      ],
      email: ["", Validators.email],
    });
    this.secondFormGroup = this.formbuild.group({
      location: [""],
      pick: [""],
      drop: [""],
    });
    if (localStorage.getItem("enduser")) {
      this.showloginsection = true;
      if (localStorage.getItem("vehdata")) {
        this.openForm(JSON.parse(localStorage.getItem("vehdata")), "yes");
        localStorage.setItem("profileshow", "true");
        this.showVehicles = false;
        this.vehiclesAllListArr = ["1"];
      } else {
        localStorage.removeItem("profileshow");
      }
    } else {
      this.showloginsection = false;
    }
  }
  // Load the data of vehciles and show list of vehicles
  ngOnInit() {
    this.currency_symbol = glob.currency_symbol;
    if (localStorage.getItem("enduser")) {
      var endUserData = JSON.parse(localStorage.getItem("enduser"));
      if (localStorage.getItem("is_register") == "true") {
        if (localStorage.getItem("profileshow") == "true") {
          this.showVehicles = false;
        } else {
          this.showVehicles = true;
        }
        this.vehiclesearchmodel =
          endUserData.vehicle_make +
          " " +
          endUserData.vehicle_model +
          " " +
          endUserData.vehicle_variant;
        this.customerId = endUserData.id;
        this.vehicelefinal = {
          make: endUserData.vehicle_make,
          model: endUserData.vehicle_model,
          variant: endUserData.vehicle_variant,
          vehicle_type: endUserData.vehicle_type,
          type: "",
        };
        this.vehicleNumber = endUserData.vehicle_number;
        this.istrue = false;
      } else {
        if (localStorage.getItem("profileshow") == "true") {
          this.showVehicles = false;
        } else {
          this.showVehicles = true;
        }
        this.vehiclesearchmodel = "";
        this.customerId = "";
        this.firstFormGroup.controls["mobilenumber"].setValue(
          endUserData.customer_mobile,
          { onlySelf: true }
        );
        this.firstFormGroup.controls["mobilenumber"].disable();
      }

      // this.secondFormGroup.controls["pick"].setValue(endUserData.pick_up_address,{onlySelf:true})

      // this.secondFormGroup.controls["drop"].setValue(endUserData.pick_up_address,{onlySelf:true})
    } else {
      this.showVehicles = false;
    }
    if (localStorage.getItem("work_data")) {
      var data = JSON.parse(localStorage.getItem("work_data"));
      this.urlparam = data.url_param;
      this.workshopOnline = true;
      var vechileTypetoshow = [];
      this.paramforbooking = "/cus/" + data.url_param + "/register";
      for (var i = 0; i < data.workshop_type.split(",").length; i++) {
        if (data.workshop_type.split(",")[i] === "1") {
          if (i == 0) {
            vechileTypetoshow.push("2");
          } else if (i == 1) {
            vechileTypetoshow.push("3");
          } else if (i == 2) {
            vechileTypetoshow.push("4");
          } else if (i == 3) {
            vechileTypetoshow.push("6");
          }
        }
      }
      if (vechileTypetoshow.length == 4) {
        this.vehiclepic = "../../../assets/images/sports-car.png";
      } else if (vechileTypetoshow.length != 1) {
        if (
          vechileTypetoshow.includes("6") &&
          vechileTypetoshow.includes("4")
        ) {
          this.vehiclepic = "../../../assets/images/sports-car.png";
        } else if (
          vechileTypetoshow.includes("2") &&
          vechileTypetoshow.includes("4")
        ) {
          this.vehiclepic = "../../../assets/images/motorcycle.png";
        } else if (
          vechileTypetoshow.includes("2") &&
          vechileTypetoshow.includes("3")
        ) {
          this.vehiclepic = "../../../assets/images/motorcycle.png";
        } else if (
          vechileTypetoshow.includes("6") &&
          vechileTypetoshow.includes("2")
        ) {
          this.vehiclepic = "../../../assets/images/delivery-truck.png";
        } else if (
          vechileTypetoshow.includes("3") &&
          vechileTypetoshow.includes("6")
        ) {
          this.vehiclepic = "../../../assets/images/delivery-truck.png";
        } else if (
          vechileTypetoshow.includes("3") &&
          vechileTypetoshow.includes("4")
        ) {
          this.vehiclepic = "../../../assets/images/sports-car.png";
        }
      } else {
        if (vechileTypetoshow.includes("2")) {
          this.vehiclepic = "../../../assets/images/motorcycle.png";
        } else if (vechileTypetoshow.includes("3")) {
          this.vehiclepic = "../../../assets/images/rickshaw.png";
        } else if (vechileTypetoshow.includes("4")) {
          this.vehiclepic = "../../../assets/images/sports-car.png";
        } else if (vechileTypetoshow.includes("6")) {
          this.vehiclepic = "../../../assets/images/delivery-truck.png";
        }
      }
      this.settingsBillData = JSON.parse(data.settings)[0];
      this.workshopname = data.workshop_name;

      if (data.workshop_mobile_number_2 != 0) {
        this.workshopmobile =
          data.workshop_mobile_number_1.toString() +
          "/" +
          data.workshop_mobile_number_2.toString();
      } else {
        this.workshopmobile = data.workshop_mobile_number_1.toString();
      }
      if (
        this.settingsBillData.tag_line != "" &&
        this.settingsBillData.tag_line != null &&
        this.settingsBillData.tag_line != undefined
      ) {
        this.workshoptiltle = this.settingsBillData.tag_line;
      } else {
        this.workshoptiltle = "none";
      }
      if (data.address != "" && data.address != null) {
        if (data.pincode != 0) {
          this.workshopaddress =
            data.address +
            " ," +
            data.city +
            " ," +
            data.state +
            " ," +
            data.pincode;
        } else {
          this.workshopaddress =
            data.address + " ," + data.city + " ," + data.state;
        }
      } else {
        this.workshopaddress = "none";
      }

      if (data.email != "") {
        this.workshopemail = data.email;
        this.workshopemailhref = "mailto:" + "" + data.email;
      } else {
        this.workshopemail = "none";
        this.workshopemailhref = "none";
      }

      if (
        this.workshopemail != "none" &&
        this.workshopaddress != "none" &&
        data.logo != "none"
      ) {
        this.workshopverified = true;
      } else {
        this.workshopverified = false;
      }

      if (data.logo != "none") {
        this.workshoplogo = data.logo;
      } else {
        this.workshoplogo = this.abstract.imageUrl1;
      }

      if (data.onlinedata.length != 0) {
        this.showonlineservices = true;

        this.allOnlineServices = data.onlinedata;

        this.allOnlineServices.map((data) => {
          data.classhave = "select-timeend";
          data.gstcalculateofjob = "0.00";
          data.cgstcalculateofjob = "0.00";
          data.sgstcalculateofjob = "0.00";
          data.showcalcluationinfo = true;
          data.amount = data.unit_purchase_price;
          data.jobgstamounterror = false;
          data.jobgsttypeerror = false;
          data.quantity = data.current_quantity;
          data.showqunatityerrorjob = false;
          data.showpriceerrorjob = false;
          data.checkinsertedjob = true;
          data.jobassignedmechanic = [this.workshopname];
        });
      } else {
        this.showonlineservices = false;
      }
    } else {
      this.workshopOnline = false;
    }
    if (localStorage.getItem("enduser")) {
      this.generalService
        .getEndUserappVehicleList(
          localStorage.getItem("check"),
          endUserData.customer_mobile
        )
        .subscribe(
          (vehicleList) => {
            if (vehicleList.success == true) {
              if (localStorage.getItem("profileshow") == "true") {
                this.showVehicles = false;
              } else {
                this.showVehicles = true;
              }
              vehicleList["customer"].map((data) => {
                if (
                  !this.duplicateArrofVehicles.includes(data.vehicle_number)
                ) {
                  var currentdate = new Date(data.estimated_delivery_datetime);
                  var reminderperioddate = new Date(
                    currentdate.setMonth(
                      currentdate.getMonth() +
                        parseInt(data.reminder.split(" ")[0])
                    )
                  );
                  var todayDate = new Date();
                  var diffdate = this.DaysBetween(
                    todayDate,
                    reminderperioddate
                  );
                  var daysago = "fsdfsd";
                  var darefalg = "true";
                  if (diffdate > 0) {
                    daysago = "due in " + diffdate.toString() + " Days";
                    darefalg = "true";
                  } else {
                    daysago =
                      "due " +
                      diffdate.toString().replace(/-(?=\d)/, "") +
                      " Days ago";
                    darefalg = "false";
                  }
                  this.duplicateArrofVehicles.push(data.vehicle_number);
                  var vehiclede = JSON.parse(data.vehicle_details);
                  this.vehiclesAllListArr.push({
                    vehicleNO: data.vehicle_number,
                    Vehiclemake:
                      vehiclede.make +
                      " " +
                      vehiclede.model +
                      " " +
                      vehiclede.variant,
                    phone: data.customer_mobile,
                    name: data.cutsomer_name,
                    date: reminderperioddate,
                    id: data.workshop_customer_id,
                    due: daysago,
                    km: data.km,
                    darefalg: darefalg,
                  });
                }
              });
            } else {
              this.showVehicles = false;
            }
          },
          (err) => {
            this.showspinner.setSpinnerForEnd(false);
            this.snakBar.open("Message", ErrorMessgae[0][err], {
              duration: 4000,
            });
          }
        );
    }
  }
  // Calculate days
  DaysBetween(StartDate, EndDate) {
    // The number of milliseconds in all UTC days (no DST)
    const oneDay = 1000 * 60 * 60 * 24;

    // A day in UTC always lasts 24 hours (unlike in other time formats)
    const start = Date.UTC(
      EndDate.getFullYear(),
      EndDate.getMonth(),
      EndDate.getDate()
    );
    const end = Date.UTC(
      StartDate.getFullYear(),
      StartDate.getMonth(),
      StartDate.getDate()
    );

    // so it's safe to divide by 24 hours
    return (start - end) / oneDay;
  }
  // Change pick to drop
  changepicktodrop(values: any) {
    if (values.currentTarget.checked == true) {
      this.pickcheck = true;
      this.dropcheck = false;
    } else {
      this.pickcheck = true;
      this.dropcheck = false;
    }
    this.secondFormGroup = this.formbuild.group({
      location: [""],
      pick: ["", Validators.required],
      drop: ["", Validators.required],
    });
    this.submittedsecond = true;
  }
  // Change drop to pick
  cheangedroptopic(values: any) {
    if (values.currentTarget.checked == true) {
      this.dropcheck = true;
      this.pickcheck = false;
    } else {
      this.dropcheck = true;
      this.pickcheck = false;
    }
    this.secondFormGroup = this.formbuild.group({
      location: [""],
      pick: [""],
      drop: [""],
    });
    this.submittedsecond = false;
  }
  // Logout
  signout() {
    localStorage.clear();
    location.reload();
  }
  // get the todat date
  todayDate() {
    this.todaycalss = "select-timeend active";
    this.toclass = "select-timeend";
    const oneMonth = new Date();
    this.maxDate = new Date(oneMonth.setDate(oneMonth.getDate()));
    this.deliveryDateField = this.maxDate;
    this.deliveryDateFieldForAdd =
      this.maxDate.getFullYear() +
      "-" +
      ("0" + (this.maxDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + this.maxDate.getDate()).slice(-2);
  }
  // get the tomorrow date
  tomorrowDate() {
    this.todaycalss = "select-timeend";
    this.toclass = "select-timeend  active";
    const oneMonth = new Date();
    this.maxDate = new Date(oneMonth.setDate(oneMonth.getDate() + 1));
    this.deliveryDateField = this.maxDate;
    this.deliveryDateFieldForAdd =
      this.maxDate.getFullYear() +
      "-" +
      ("0" + (this.maxDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + this.maxDate.getDate()).slice(-2);
    this.deliveryTimeField = "09:00";
    this.timeofservice = "09:00 AM";
  }
  // Open the forms of the boking
  openForm(event, checklocal) {
    if (event == "empty") {
      this.vehiclesearchmodel = "";
      this.firstFormGroup.controls["serachvehicle"].setValue("", {
        onlySelf: true,
      });
      this.firstFormGroup.controls["mobilenumber"].setValue("", {
        onlySelf: true,
      });
      this.firstFormGroup.controls["vehiclenumber"].setValue("", {
        onlySelf: true,
      });
      this.firstFormGroup.controls["name"].setValue("", { onlySelf: true });
      this.firstFormGroup.controls["serachvehicle"].enable();
      this.firstFormGroup.controls["mobilenumber"].enable();
      this.firstFormGroup.controls["vehiclenumber"].enable();
      this.firstFormGroup.controls["name"].enable();
      this.firstFormGroup.controls["email"].enable();
    } else {
      localStorage.removeItem("vehdata");
      this.vehiclesearchmodel = event.Vehiclemake;
      this.firstFormGroup.controls["serachvehicle"].setValue(
        event.Vehiclemake,
        { onlySelf: true }
      );
      this.firstFormGroup.controls["mobilenumber"].setValue(event.phone, {
        onlySelf: true,
      });
      this.firstFormGroup.controls["vehiclenumber"].setValue(event.vehicleNO, {
        onlySelf: true,
      });
      this.firstFormGroup.controls["name"].setValue(event.name, {
        onlySelf: true,
      });
      console.log("event", event);
      this.customerId = event.id;
      this.firstFormGroup.controls["serachvehicle"].disable();
      this.firstFormGroup.controls["mobilenumber"].disable();
      this.firstFormGroup.controls["vehiclenumber"].disable();
      this.firstFormGroup.controls["name"].disable();
      // this.firstFormGroup.controls["email"].disable();
    }
    this.showVehicles = false;
  }
  //opne back the vehcile list
  openList(falg) {
    if (localStorage.getItem("profileshow")) {
      this.usercomp.profileIcon();
      this.router.navigate(["/cus/" + this.urlparam + "/profile"]);
      this.vehiclesAllListArr = [];
    } else {
      this.showVehicles = true;
    }
  }
  // Upadte the first form
  updatefirst() {
    this.submitted = true;
    // this.showfirst=false
    if (this.firstFormGroup.invalid) {
      return;
    } else {
      this.showfirst = false;
      this.tomorrowDate();
    }
  }
  // get 1st time and sabe
  time1() {
    this.time11 = "select-timeend active";
    this.time12 = "select-timeend";
    this.time13 = "select-timeend";
    this.time14 = "select-timeend";
    this.time15 = "select-timeend";
    this.time16 = "select-timeend";
    this.deliveryTimeField = "08:30";
    this.timeofservice = "08:30 AM";
  }
  // get 2nd time and sabe
  time2() {
    this.time11 = "select-timeend";
    this.time12 = "select-timeend active";
    this.time13 = "select-timeend";
    this.time14 = "select-timeend";
    this.time15 = "select-timeend";
    this.time16 = "select-timeend";
    this.deliveryTimeField = "09:00";
    this.timeofservice = "09:00 AM";
  }
  // get 3rd time and sabe
  time3() {
    this.time11 = "select-timeend";
    this.time12 = "select-timeend";
    this.time13 = "select-timeend active";
    this.time14 = "select-timeend";
    this.time15 = "select-timeend";
    this.time16 = "select-timeend";
    this.deliveryTimeField = "09:30";
    this.timeofservice = "09:30 AM";
  }
  // get 4th time and sabe
  time4() {
    this.time11 = "select-timeend";
    this.time12 = "select-timeend";
    this.time13 = "select-timeend";
    this.time14 = "select-timeend active";
    this.time15 = "select-timeend";
    this.time16 = "select-timeend";
    this.deliveryTimeField = "10:00";
    this.timeofservice = "10:00 AM";
  }
  // get 5th time and sabe
  time5() {
    this.time11 = "select-timeend";
    this.time12 = "select-timeend";
    this.time13 = "select-timeend";
    this.time14 = "select-timeend";
    this.time15 = "select-timeend active";
    this.time16 = "select-timeend";
    this.deliveryTimeField = "10:30";
    this.timeofservice = "10:30 AM";
  }
  // get 6th time and sabe
  time6() {
    this.time11 = "select-timeend";
    this.time12 = "select-timeend";
    this.time13 = "select-timeend";
    this.time14 = "select-timeend";
    this.time15 = "select-timeend";
    this.time16 = "select-timeend active";
    this.deliveryTimeField = "11:00";
    this.timeofservice = "11:00 AM";
  }
  // Add and remove the service from the seleted list
  addORRemoveService(alldata, index) {
    if (this.allOnlineServices[index]["classhave"] == "select-timeend") {
      this.allOnlineServices[index]["classhave"] = "select-timeend active";
      this.selectedService.push(this.allOnlineServices[index]);
    } else {
      this.allOnlineServices[index]["classhave"] = "select-timeend";
      if (this.selectedService.length != 0) {
        this.selectedService.splice(
          this.selectedService.findIndex(({ id }) => id == alldata.id),
          1
        );
      }
    }
    if (this.selectedService.length != 0) {
      this.totalAmount = this.calculateresult(this.selectedService);
    } else {
      this.totalAmount = 0;
    }
  }
  // Calculate result
  calculateresult(object) {
    const sum = object.reduce((a, { amount }) => a + parseInt(amount), 0);
    return sum;
  }
  // BAck to 1st form
  backtofirst() {
    this.showfirst = true;
  }
  // Upadte the data of the secind form
  updateSecond() {}
  // Update the data of the 3rd form
  updatethird() {
    this.successmessage = false;
  }
  // Same as pickupaddress
  sameAsPickupAddress(e) {
    if (e.currentTarget.checked == true) {
      this.istrue = true;
      this.pick_up = this.secondFormGroup.getRawValue().pick;
      this.secondFormGroup.controls["drop"].setValue(this.pick_up);
      console.log(this.secondFormGroup.controls["drop"]);
      console.log("e", e);
      console.log(this.pick_up);
    } else {
      this.istrue = false;
      this.secondFormGroup.controls["drop"].setValue("", { onlySelf: true });
    }
  }
  // update the forth form
  updateforth() {
    this.submittedsecond = true;
    if (this.secondFormGroup.invalid) {
      console.log("this.secondFormGroup.invalid");
      console.log(this.secondFormGroup);
      return;
    } else {
      this.generalService
        .saveCustomerDetails(
          localStorage.getItem("check"),
          this.firstFormGroup.getRawValue().name,
          this.firstFormGroup.getRawValue().mobilenumber,
          this.firstFormGroup.getRawValue().email,
          JSON.stringify(this.vehicelefinal),
          this.firstFormGroup.getRawValue().vehiclenumber
        )
        .subscribe(
          (SaveCus) => {
            if (SaveCus.success == true) {
              var parentId;
              if (localStorage.getItem("is_register") == "true") {
                if (localStorage.getItem("enduser")) {
                  parentId = this.customerId;
                } else {
                  parentId = SaveCus.customer.id;
                }
              } else {
                localStorage.setItem("is_register", "true");
                parentId = SaveCus.customer.id;
                localStorage.setItem(
                  "enduser",
                  JSON.stringify(SaveCus.customer)
                );
              }
              var servicesadded;
              if (this.selectedService.length != 0) {
                servicesadded = JSON.stringify(this.selectedService);
              } else {
                servicesadded = "[]";
              }
              var ispick;
              if (this.pickcheck == true) {
                ispick = "yes";
              } else {
                ispick = "no";
              }
              this.generalService
                .saveBooking(
                  localStorage.getItem("check"),
                  this.firstFormGroup.getRawValue().name,
                  this.firstFormGroup.getRawValue().mobilenumber,
                  this.totalAmount.toString(),
                  this.firstFormGroup.getRawValue().email,
                  "",
                  this.secondFormGroup.getRawValue().pick,
                  this.secondFormGroup.getRawValue().drop,
                  this.firstFormGroup.getRawValue().vehiclenumber,
                  JSON.stringify(this.vehicelefinal),
                  this.deliveryDateFieldForAdd,
                  this.deliveryTimeField,
                  servicesadded,
                  SaveCus.customer.id,
                  ispick,
                  ispick,
                  parentId,
                  this.workshopmobile,
                  this.workshopname,
                  "online"
                )
                .subscribe(
                  (saveData) => {
                    this.showspinner.setSpinnerForEnd(true);
                    if (saveData.success == true) {
                      this.successmessage = true;
                      this.showStep = false;
                      this.customername = saveData.booking["customer_name"];
                      this.customerphone = saveData.booking["customer_phone"];
                      if (saveData.booking["services"] != undefined) {
                        JSON.parse(saveData.booking["services"]).map((data) => {
                          this.servicesbookedarr.push(data.part_name);
                        });
                      } else {
                        this.servicesbooked = [];
                      }
                      this.servicesbooked = this.servicesbookedarr.toString();
                      this.servicetime =
                        saveData.booking["date"] +
                        " " +
                        saveData.booking["time"];
                      this.totalamount = saveData.booking["total_amount"];
                      this.vehiclebooknumber =
                        saveData.booking["vehicle_number"];
                      this.vehiclebookdetails =
                        JSON.parse(saveData.booking["vehicle_details"]).make +
                        " " +
                        JSON.parse(saveData.booking["vehicle_details"]).model +
                        " " +
                        JSON.parse(saveData.booking["vehicle_details"]).variant;
                      this.bookaddress =
                        saveData.booking["customer_address_drop"];
                      this.bookingid = saveData.booking["bookingid"];
                      this.showfirst = true;
                      localStorage.setItem(
                        "enduser",
                        JSON.stringify(SaveCus.customer)
                      );
                      if (localStorage.getItem("profileshow")) {
                        this.vehiclesAllListArr = [];
                      }
                      localStorage.removeItem("profileshow");
                      this.showloginsection = true;
                    } else {
                      this.snakBar.open("Message", "Booking Not completed", {
                        duration: 4000,
                      });
                    }
                    this.showspinner.setSpinnerForEnd(false);
                  },
                  (err) => {
                    this.showspinner.setSpinnerForEnd(false);
                    this.snakBar.open("Error", ErrorMessgae[0][err], {
                      duration: 4000,
                    });
                  }
                );
            }
          },
          (err) => {
            this.showspinner.setSpinnerForEnd(false);
            this.snakBar.open("Error", ErrorMessgae[0][err], {
              duration: 4000,
            });
          }
        );
    }
  }
  // back to forth form
  backtoforth() {
    this.successmessage = false;
    this.showfirst = false;
  }
  // save the delivery date
  deliveryDate(event) {
    var eventDate = new Date(event);
    this.deliveryDateFieldForAdd =
      eventDate.getFullYear() +
      "-" +
      ("0" + (eventDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + eventDate.getDate()).slice(-2);
  }
  // save the delivery time
  deliveryTime(event) {
    this.time11 = "select-timeend";
    this.time12 = "select-timeend";
    this.time13 = "select-timeend";
    this.time14 = "select-timeend";
    this.time15 = "select-timeend";
    this.time16 = "select-timeend";
    this.deliveryTimeField = event;
    this.timeofservice = event;
  }
  // Am PM comversion
  formatAMPM(hour, min) {
    var hours = hour;
    var minutes = min;
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? minutes : minutes;
    var strTime = ("0" + hours).slice(-2) + ":" + minutes + " " + ampm;
    return strTime;
  }
  // get the list of vehicles
  selectedResultForVechile(event) {
    if (event != undefined) {
      this.vehiclesearchmodel = event;
      var splitedevent = event.split("  ");
      this.mainVehiclearr.map((selecteData) => {
        if (
          splitedevent[0] == selecteData.make &&
          splitedevent[1] == selecteData.model &&
          splitedevent[2] == selecteData.variant
        ) {
          this.vehicelefinal = {};
          this.vehicelefinal = {
            make: selecteData.make,
            model: selecteData.model,
            variant: selecteData.variant,
            vehicle_type: selecteData.vehicle_type,
            type: selecteData.type,
          };
        }
      });
    }
  }
  // search for the vehiles
  searchBarForVechile(event) {
    this.generalService.getAllVehicleDetails(event).subscribe(
      (searchData) => {
        this.showspinner.setSpinnerForEnd(true);
        if (searchData["success"] == true) {
          this.searchVehicleData = [];
          this.mainVehiclearr = [];
          searchData["vhicledetails"].map((data) => {
            this.searchVehicleData.push(
              data["make"] + "  " + data["model"] + "  " + data["variant"]
            );
            this.mainVehiclearr.push(data);
          });
          this.showspinner.setSpinnerForEnd(false);
        } else {
          this.searchVehicleData = [];
          this.searchVehicleData.push("No Vehicle Found");
          this.mainVehiclearr = [];
          this.showspinner.setSpinnerForEnd(false);
          this.snakBar.open("Message", ErrorMessgae[0][searchData["message"]], {
            duration: 4000,
          });
        }
      },
      (err) => {
        this.showspinner.setSpinnerForEnd(false);
        this.snakBar.open("Error", ErrorMessgae[0][err], {
          duration: 4000,
        });
      }
    );
  }
  // Show bookings
  showallbookings() {
    localStorage.setItem("showbooking", "true");
  }
}
