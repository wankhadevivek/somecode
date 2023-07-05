import { Injector, Component, OnInit } from "@angular/core";
import { UserserviceService } from "../../../services/userservice.service";
import { PrintsharepdfService } from "src/app/services/printsharepdf.service";
import { ExpireAccountService } from "../../../services/expire-account.service";
import { GeneralService } from "src/app/services/general.service";
import { SpinnerService } from "src/app/services/spinner.service";
import { MatSnackBar } from "@angular/material";
import { ErrorMessgae } from "../../../shared/error_message/error";
import { DilogOpenService } from "../../../services/dilog-open.service";
import { MessagingService } from "../../../services/messaging.service";
import { Router } from "@angular/router";
import { element } from "protractor";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
/**
 * In this Component Header is defiend
 * all action in header are defined here
 */
export class HeaderComponent implements OnInit {
  worksopName: string;
  imagesrc = "../../../assets/images/profile_small.jpg";
  backupImg = "../../../assets/images/profile_small.jpg";
  rechangeData: any;
  daysLeft;
  Gold = 180;
  Platinum = 365;
  Trail = 30;
  DaysForCircle = 0;
  MaxDays = 0;
  daystoadd: any;
  ShowRecharge: boolean = false;
  smsDataLength: any = 0;
  smsArray: any;
  headerClass = "row border-bottom";
  wallet_amount = 0;
  isRole : string;
  isUserLogin:  string;
  userName: string;
  hideUserAccounts: boolean = true
  allAccounts = Array()
  constructor(
    private userService: UserserviceService,
    private injector: Injector,
    private dialogService: DilogOpenService,
    private head: PrintsharepdfService,
    public expiry: ExpireAccountService,
    private showspinner: SpinnerService,
    private snakBar: MatSnackBar,
    public general: GeneralService,
    private router: Router
  ) {}
  // get all the data to show in header
  ngOnInit() {
    this.worksopName = this.userService.getData()["workshop_name"];
    this.isRole = this.userService.getData()["role"];
    this.isUserLogin = localStorage.getItem('isUserLogin');
    this.userName = localStorage.getItem('user_name');

    if (this.isUserLogin == 'false'){
      
 
      if (localStorage.getItem("adminwk") !== null && 
      localStorage.getItem('linkedAcc') !== null){
        console.log('exists')

    

        
      }else{
        
        localStorage.setItem('adminwk', this.userService.getData()["workshop_id"]) ;
      }
      this.general.getLinkedAccounts(localStorage.getItem('adminwk'))
      .subscribe(resp =>{
        
        let tempAcc = Array()
        
        // JSON.parse(resp.linked_workshops).forEach(element => {
        resp.linked_workshops.forEach(element => {
          if(element["profile_image"].length < 10){ 
          element["profile_image"] = this.backupImg
          }

          element["workshop_id"]==this.userService.getData()["workshop_id"] ?
          element["class"] = "admin" 
          
          : element["class"]="other"

          tempAcc.push(element)
            
          });
          this.allAccounts  = tempAcc

          localStorage.setItem('linkedAcc', JSON.stringify(tempAcc))
      },
      (err) => {
        this.showspinner.setSpinner(false);
        this.snakBar.open("Error", ErrorMessgae[0][err], {
          duration: 4000,
        });
      }
      );
    

      
    }
   
    
    if (this.userService.getData()["profile_image"] != "") {
      this.imagesrc = this.userService.getData()["profile_image"];
    }
    this.rechangeData = this.userService.getData()["recharge_data"][0];

    this.general
      .getWalletAmount(this.userService.getData()["workshop_id"])
      .subscribe((data) => {
        this.wallet_amount = data.wallet_amount;
      });
    this.general
      .expiryMembership(this.userService.getData()["workshop_id"])
      .subscribe(
        (memberData) => {
          this.showspinner.setSpinner(true);
          if (memberData.success == true) {
            var days = this.expiry.checkNoOfDays(
              memberData.data_workshop.validity
            );
            var plan = memberData.data_rechrage.recharge_type;
            if (days != false) {
              if (days <= 5) {
                this.daystoadd = days;
                this.ShowRecharge = true;
              } else {
                this.ShowRecharge = false;
              }
              this.daysLeft = days;
              if (plan == "Gold") {
                this.DaysForCircle = this.Gold - parseInt(this.daysLeft);
                this.MaxDays = this.Gold;
              } else if (plan == "Platinum") {
                this.DaysForCircle = this.Platinum - parseInt(this.daysLeft);
                this.MaxDays = this.Platinum;
              } else {
                this.DaysForCircle = this.Trail - parseInt(this.daysLeft);
                this.MaxDays = this.Trail;
              }
            } else {
              this.daysLeft = 0;
              this.DaysForCircle = 0;
              if (plan == "Gold") {
                this.MaxDays = this.Gold;
              } else if (plan == "Platinum") {
                this.MaxDays = this.Platinum;
              } else {
                this.MaxDays = this.Trail;
              }
            }
            this.showspinner.setSpinner(false);
          } else {
            this.DaysForCircle = 0;
            this.MaxDays = 30;
            this.showspinner.setSpinner(false);
          }
          this.getSmsData();
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }

  onSwitchAccount(account){
    localStorage.setItem('switching', 'true')
    if(account.workshop_id !== localStorage.getItem("adminwk")){
    this.general
      .loginUser(account.mobile_number)
      .subscribe(resp =>{


        if (resp.success == true){
          let userObject = resp.data[0];
          // let dataUrl = 'false'
          console.log('changes user')
         
          console.log('userObject', userObject)
         
          if (userObject.signature != " " && !userObject.signature_ibase64) {
            (async () => {
              let blob = await fetch(userObject.signature).then((r) => r.blob());
              let dataUrl = await new Promise((resolve) => {
                let reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
              });
              userObject.signature = dataUrl;
            })
            
          }
          else{
            userObject.signature = "false";
          }
          
            
              // now do something with `dataUrl`
              
          localStorage.removeItem("user");
          this.userService.login(userObject)
          // this.router.navigate(['jobcards']);
          this.ngOnInit()
          console.log('userObject', userObject)
        }
      })
    }
  }
  //Get the SMS data
  getSmsData() {
    this.general
      .getSendSMS(this.userService.getData()["workshop_id"])
      .subscribe(
        (smsData) => {
          this.showspinner.setSpinner(true);
          if (smsData.success == true) {
            this.smsDataLength = smsData.sms.length;
            this.smsArray = smsData.sms;
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
  // Open SMS Popup
  openSMSPoup() {
    this.general
      .getSendSMS(this.userService.getData()["workshop_id"])
      .subscribe(
        (smsData) => {
          this.showspinner.setSpinner(true);
          if (smsData.success == true) {
            this.smsDataLength = smsData.sms.length;
            this.smsArray = smsData.sms;
            if (this.smsArray.length != 0) {
              this.dialogService
                .OpenSmsReport(this.smsArray)
                .subscribe((data) => {
                  console.log(data);
                });
            }
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
  // Upadte profile image
  updateimage() {
    this.hideUserAccounts = true;
    if (this.userService.getData()["profile_image"] != "") {
      this.imagesrc = this.userService.getData()["profile_image"];
    }
  }

  closePopup(event) {

    const message =
      "Get Real-Time Updates about Your Workshop, Customers & Other Important Notifications";

    if (event == true) {
      this.dialogService
        .OpenNotificationDialog(message, 0)
        .subscribe((answer) => {
          if (answer == true) {
            localStorage.setItem("notifyActive", "true");
            const messagingService = this.injector.get(MessagingService);

            messagingService.requestPermission();
            messagingService.receiveMessage();

            setTimeout(
              () =>
                this.general.updateNotifyParams("set").subscribe((response) => {
                  console.log("resss", response);
                }),

              2000
            );
          } else if (answer == false) {
            // set local storage value to false
            localStorage.setItem("notifyActive", "false");
            this.general.updateNotifyParams("unset").subscribe((response) => {
              console.log("resss 22222", response);
            });
          }
        });
    }
  }
  // Logout from the web app
  logout() {
    
    localStorage.removeItem("showpopup");
    localStorage.removeItem("falg");
    localStorage.removeItem("user");
    localStorage.removeItem("dl");
    localStorage.clear();
  }
  addAccount(){

    localStorage.removeItem("user");
    
    
    
  }
  //Select Recharge Type
  selectRecharge() {
    this.general.recharges().subscribe(
      (data) => {
        if (data.success == true) {
          this.dialogService
            .OpenSelectPayment(data, "Gold", this.daystoadd)
            .subscribe((data) => {
              console.log(data);
            });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  // Chnage the header class
  chnageheaderclass() {
    if (this.headerClass != "row border-bottom extend") {
      this.headerClass = "row border-bottom extend";
    } else {
      this.headerClass = "row border-bottom";
    }
  }
}
