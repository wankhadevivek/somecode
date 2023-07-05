import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { $ } from "protractor";
import { DilogOpenService } from "../../services/dilog-open.service";
import { GeneralService } from "../../services/general.service";
import { UserserviceService } from "../../services/userservice.service";
import { ErrorMessgae } from "../../shared/error_message/error";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "app-sidelayout",
  templateUrl: "./sidelayout.component.html",
  styleUrls: ["./sidelayout.component.scss"],
})
/**
 * In this Component all the
 * routes of the web app are defined
 * this compoent is used in the sidebar of the web app
 */
export class SidelayoutComponent implements OnInit {
  events: string[] = [];
  opened: boolean;
  classname: string;
  showUpdate: boolean = false;
  settclass = "";
  onlineclass = "";
  appclass = "";
  collclass = "";
  repoclass = "";
  invenclass = "";
  couclass = "";
  jobclass = "";
  dashclass = "";
  supplierclass = "";
  poclass = "";
  staffclass = "";
  orders = "";
  ordersclass = "";
  feedbackclass = "";
  franchiseclass = "";
  expclass ="";
  collapseclass = "nav nav-second-level collapse";
  roleForNavbar: String = localStorage.getItem('role');
  workshopId = this.userService.getData()["workshop_id"]
  showFranchise = true
  constructor(
    private userService: UserserviceService,
    private snakBar: MatSnackBar,
    public general: GeneralService,
    private dialogService: DilogOpenService,
    public translate: TranslateService
  ) {
    translate.addLangs(['English','Hindi','Hinglish','Marathi']);
    translate.setDefaultLang('English');
    }

    switchLang(lang: string) {
      this.translate.use(lang);
    }
  //check the path and user the routes
  ngOnInit() {
    
    if (window.location.pathname == "/") {
        this.dashclass = "active";
    } else {
      this.showActive(window.location.pathname.replace("/", ""));
    }
    this.getAppStatu();
    this.classname = "navbar-default navbar-static-side active";

    let linkedAcc = JSON.parse(localStorage.getItem('linkedAcc'))
    let countLinkedWk = Object.keys(linkedAcc).length
    countLinkedWk > 1 ? this.showFranchise = true : this.showFranchise= false
  }
  //Add class to the sdie bar clicked option
  addclass() {
    if (this.classname == "navbar-default navbar-static-side") {
      this.classname = "navbar-default navbar-static-side active";
    } else {
      this.classname = "navbar-default navbar-static-side";
    }
  }
  //Shows active to the selected option
  showActive(value) {
    if (value == "dashboard") {
      this.settclass = "";
      this.onlineclass = "";
      this.appclass = "";
      this.collclass = "";
      this.repoclass = "";
      this.invenclass = "";
      this.couclass = "";
      this.jobclass = "";
      this.dashclass = "active";
      this.supplierclass = "";
      this.poclass = "";
      this.staffclass = "";
      this.orders = "";
      this.feedbackclass = "";
      this.franchiseclass = "";
      this.expclass="";
      this.collapseclass = "nav nav-second-level collapse";

    } 
    else if (value == "franchise") {
      this.settclass = "";
      this.onlineclass = "";
      this.appclass = "";
      this.collclass = "";
      this.repoclass = "";
      this.invenclass = "";
      this.couclass = "";
      this.jobclass = "";
      this.dashclass = "";
      this.supplierclass = "";
      this.poclass = "";
      this.staffclass = "";
      this.orders = "";
      this.feedbackclass = "";
      this.franchiseclass = "active";
      this.expclass="";
      this.collapseclass = "nav nav-second-level collapse";

    }
    
    
    else if (value == "jobcards") {
      this.settclass = "";
      this.onlineclass = "";
      this.appclass = "";
      this.collclass = "";
      this.repoclass = "";
      this.invenclass = "";
      this.couclass = "";
      this.jobclass = "active";
      this.dashclass = "";
      this.supplierclass = "";
      this.poclass = "";
      this.staffclass = "";
      this.ordersclass = "";
      this.feedbackclass = "";
      
      this.collapseclass = "nav nav-second-level collapse";
      this.franchiseclass = "";
      this.expclass="";
    } else if (value == "counter-sale") {
      this.settclass = "";
      this.onlineclass = "";
      this.appclass = "";
      this.collclass = "";
      this.repoclass = "";
      this.invenclass = "";
      this.couclass = "active";
      this.jobclass = "";
      this.dashclass = "";
      this.supplierclass = "";
      this.poclass = "";
      this.staffclass = "";
      this.ordersclass = "";
      this.feedbackclass = "";
      this.collapseclass = "nav nav-second-level collapse";
      this.franchiseclass = "";
      this.expclass="";
    } else if (value == "inventory") {
      if (this.invenclass == "active") {
        this.invenclass == "active"
        this.settclass = "";
        this.onlineclass = "";
        this.appclass = "";
        this.collclass = "";
        this.repoclass = "";
        this.invenclass = "";
        this.couclass = "";
        this.jobclass = "";
        this.dashclass = "";
        this.supplierclass = "";
        this.poclass = "";
        this.staffclass = "";
        this.ordersclass = "";
	      this.feedbackclass = "";
        this.collapseclass = "nav nav-second-level collapse";
        this.franchiseclass = "";
        this.expclass="";
      } else {
        this.settclass = "";
        this.onlineclass = "";
        this.appclass = "";
        this.collclass = "";
        this.repoclass = "";
        this.invenclass = "active";
        this.couclass = "";
        this.jobclass = "";
        this.dashclass = "";
        this.supplierclass = "";
        this.poclass = "";
        this.staffclass = "";
        this.feedbackclass = "";
        this.collapseclass = "nav nav-second-level collapse in";
        this.franchiseclass = "";
        this.expclass="";
      }
    } else if (value == "reports") {
      this.settclass = "";
      this.onlineclass = "";
      this.appclass = "";
      this.collclass = "";
      this.repoclass = "active";
      this.invenclass = "";
      this.couclass = "";
      this.jobclass = "";
      this.dashclass = "";
      this.supplierclass = "";
      this.poclass = "";
      this.staffclass = "";
      this.ordersclass = "";
      this.feedbackclass = "";
      this.collapseclass = "nav nav-second-level collapse";
      this.franchiseclass = "";
      this.expclass="";
    } else if (value == "collect payment") {
      this.settclass = "";
      this.onlineclass = "";
      this.appclass = "";
      this.collclass = "active";
      this.repoclass = "";
      this.invenclass = "";
      this.couclass = "";
      this.jobclass = "";
      this.dashclass = "";
      this.supplierclass = "";
      this.poclass = "";
      this.staffclass = "";
      this.ordersclass = "";
      this.feedbackclass = "";
      this.collapseclass = "nav nav-second-level collapse";
      this.franchiseclass = "";
      this.expclass="";
    } else if (value == "appointment") {
      this.settclass = "";
      this.onlineclass = "";
      this.appclass = "active";
      this.collclass = "";
      this.repoclass = "";
      this.invenclass = "";
      this.couclass = "";
      this.jobclass = "";
      this.dashclass = "";
      this.supplierclass = "";
      this.poclass = "";
      this.staffclass = "";
      this.ordersclass = "";
      this.feedbackclass = "";
      this.collapseclass = "nav nav-second-level collapse";
      this.franchiseclass = "";
      this.expclass="";
    } else if (value == "online garage") {
      this.settclass = "";
      this.onlineclass = "active";
      this.appclass = "";
      this.collclass = "";
      this.repoclass = "";
      this.invenclass = "";
      this.couclass = "";
      this.jobclass = "";
      this.dashclass = "";
      this.supplierclass = "";
      this.poclass = "";
      this.staffclass = "";
      this.ordersclass = "";
      this.feedbackclass = "";
      this.collapseclass = "nav nav-second-level collapse";
      this.franchiseclass = "";
      this.expclass="";
    } else if (value == "settings") {
      this.settclass = "active";
      this.onlineclass = "";
      this.appclass = "";
      this.collclass = "";
      this.repoclass = "";
      this.invenclass = "";
      this.couclass = "";
      this.jobclass = "";
      this.dashclass = "";
      this.supplierclass = "";
      this.poclass = "";
      this.staffclass = "";
      this.ordersclass = "";
      this.feedbackclass = "";
      this.collapseclass = "nav nav-second-level collapse";
      this.franchiseclass = "";
      this.expclass="";
    } else if (value == "supplier") {
      this.settclass = "";
      this.onlineclass = "";
      this.appclass = "";
      this.collclass = "";
      this.repoclass = "";
      this.invenclass = "";
      this.couclass = "";
      this.jobclass = "";
      this.dashclass = "";
      this.supplierclass = "active";
      this.poclass = "";
      this.staffclass = "";
      this.ordersclass = "";
      this.feedbackclass = "";
      this.collapseclass = "nav nav-second-level collapse in";
      this.franchiseclass = "";
      this.expclass="";
    } else if (value == "purchaseorder") {
      this.settclass = "";
      this.onlineclass = "";
      this.appclass = "";
      this.collclass = "";
      this.repoclass = "";
      this.invenclass = "";
      this.couclass = "";
      this.jobclass = "";
      this.dashclass = "";
      this.supplierclass = "";
      this.poclass = "active";
      this.staffclass = "";
      this.ordersclass = "";
      this.feedbackclass = "";
      this.collapseclass = "nav nav-second-level collapse in";
      this.franchiseclass = "";
      this.expclass="";
    } else if (value == "inventorycheck") {
      this.settclass = "";
      this.onlineclass = "";
      this.appclass = "";
      this.collclass = "";
      this.repoclass = "";
      this.invenclass = "";
      this.couclass = "";
      this.jobclass = "";
      this.dashclass = "";
      this.supplierclass = "";
      this.poclass = "";
      this.staffclass = "";
      this.ordersclass = "";
      this.feedbackclass = "";
      this.collapseclass = "nav nav-second-level collapse in";
      this.franchiseclass = "";
      this.expclass="";
    } else if (value == "staff") {
      this.settclass = "";
      this.onlineclass = "";
      this.appclass = "";
      this.collclass = "";
      this.repoclass = "";
      this.invenclass = "";
      this.couclass = "";
      this.jobclass = "";
      this.dashclass = "";
      this.supplierclass = "";
      this.poclass = "";
      this.ordersclass = "";
      this.feedbackclass = "";
      this.staffclass = "active";
      this.collapseclass = "nav nav-second-level collapse";
      this.franchiseclass = "";
      this.expclass="";
    }else if (value == "orders") {
      this.settclass = "";
      this.onlineclass = "";
      this.appclass = "";
      this.collclass = "";
      this.repoclass = "";
      this.invenclass = "";
      this.couclass = "";
      this.jobclass = "";
      this.dashclass = "";
      this.supplierclass = "";
      this.poclass = "";
      this.staffclass = "";
      this.ordersclass = "active";
      this.feedbackclass = "";
      this.collapseclass = "nav nav-second-level collapse";
      this.franchiseclass = "";
      this.expclass="";
    }
    else if (value == "feedback") {
      this.settclass = "";
      this.onlineclass = "";
      this.appclass = "";
      this.collclass = "";
      this.repoclass = "";
      this.invenclass = "";
      this.couclass = "";
      this.jobclass = "";
      this.dashclass = "";
      this.supplierclass = "";
      this.poclass = "";
      this.staffclass = "";
      this.ordersclass = "";
      this.feedbackclass = "active";
      this.collapseclass = "nav nav-second-level collapse";
      this.franchiseclass = "";
      this.expclass="";
    }
    else if (value == "expense") {
      this.settclass = "";
      this.onlineclass = "";
      this.appclass = "";
      this.collclass = "";
      this.repoclass = "";
      this.invenclass = "";
      this.couclass = "";
      this.jobclass = "";
      this.dashclass = "";
      this.supplierclass = "";
      this.poclass = "";
      this.staffclass = "";
      this.ordersclass = "";
      this.feedbackclass = "";
      this.collapseclass = "nav nav-second-level collapse";
      this.franchiseclass = "";
      this.expclass="active";
      
    }
    this.getAppStatu();
  }
  //Get the app status to update or not
  getAppStatu() {
    this.general
      .getAppStatus(this.userService.getData()["workshop_id"])
      .subscribe(
        (memberData) => {
          if (memberData.success == true) {
            this.showUpdate = false;
          } else {
            if (memberData.message == "notok") {
              this.showUpdate = true;
            } else {
              this.showUpdate = false;
            }
          }
        },
        (err) => {
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  //Update the App status
  updateStatus() {
    this.general.updateApp(this.userService.getData()["workshop_id"]).subscribe(
      (memberData) => {
        if (memberData.success == true) {
          this.showUpdate = false;
          location.reload();
        } else {
          this.showUpdate = true;
        }
      },
      (err) => {
        this.snakBar.open("Error", ErrorMessgae[0][err], {
          duration: 4000,
        });
      }
    );
  }
  //Open the infor of the update
  openInfo() {
    this.dialogService.UpdateAppInfo().subscribe((data) => {
      console.log(data);
    });
  }
}
