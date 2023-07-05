import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashbordComponent } from "../dashbord/dashbord.component";
import { SidelayoutComponent } from "./sidelayout.component";
import { JobcardComponent } from "../jobcard/jobcard.component";
import { InventoryComponent } from "../inventory/inventory.component";
import { SettingComponent } from "../setting/setting.component";
import { ReportsComponent } from "../reports/reports.component";
import { AuthGuardService } from "../../services/auth-guard.service";
import { MembershipComponent } from "../membership/membership.component";
import { CollectpaymentComponent } from "../collectpayment/collectpayment.component";
import { AppointmentComponent } from "../appointment/appointment.component";
import { OnlinebookComponent } from "../onlinebook/onlinebook.component";
import { CounterComponent } from "../counter/counter.component";
import { SupplierComponent } from "../supplier/supplier.component";
import { PurchaseorderComponent } from "../purchaseorder/purchaseorder.component";
import { StaffComponent } from "../staff/staff.component";
import { FeedbackComponent } from "../feedback/feedback.component";
import { OrdersComponent } from "../orders/orders.component";
import { AccessDeniedComponent } from "src/app/shared/dialog/access-denied/access-denied.component";
import { StoreordersComponent } from "../storeorders/storeorders.component";

import { CashbookComponent } from '../cashbook/cashbook.component';
import { FranchiseComponent } from '../franchise/franchise.component';
import { ExpenseComponent } from "../expense/expense.component";

/**
 * In this routing compaoment
 * all the routes of the side laytout are described
 */

const routes: Routes = [
  {
    path: "",
    component: SidelayoutComponent,
    children: [
      {
        path: "dashboard",
        component: DashbordComponent,
        canActivate: [AuthGuardService],
      }, // Dashboard Routes
      //{path: '', component: DashbordComponent, canActivate: [AuthGuardService]},
      {
        path: "jobcards",
        component: JobcardComponent,
        canActivate: [AuthGuardService],
      }, // Jobcard Routes
      {
        path: "inventory",
        component: InventoryComponent,
        canActivate: [AuthGuardService],
      }, // Inventory Routes
      {
        path: "supplier",
        component: SupplierComponent,
        canActivate: [AuthGuardService],
      }, // Supplier Routes
      {
        path: "purchaseorder",
        component: PurchaseorderComponent,
        canActivate: [AuthGuardService],
      }, // Purchase Order Routes
      // {
      //   path: "cashbook",
      //   component: CashbookComponent,
      //   canActivate: [AuthGuardService],
      // }, 
      {
        path: "countersale",
        component: CounterComponent,
        canActivate: [AuthGuardService],
      }, // Counter Sale Routes
      {
        path: "settings",
        component: SettingComponent,
        canActivate: [AuthGuardService],
      }, // Settings Routes
      {
        path: "reports",
        component: ReportsComponent,
        canActivate: [AuthGuardService],
      }, // Reports Routes
      {
        path: "collect",
        component: CollectpaymentComponent,
        canActivate: [AuthGuardService],
      }, // Collect Payment Routes
      // {path: 'appointment', component: AppointmentComponent, canActivate: [AuthGuardService]},// Appoitment Routes
      // {path: 'onlinegarage', component: OnlinebookComponent, canActivate: [AuthGuardService]},// Online Garage Routes
      { 
        path: "appointment",
        component: AppointmentComponent,
        canActivate: [AuthGuardService]
      }, // Appoitment Routes
      { 
        path: "onlinegarage", 
        component: OnlinebookComponent,
        canActivate: [AuthGuardService]
      }, // Online Garage Routes
      { path: "membership", component: MembershipComponent }, // Membership Routes
      {
        path: "staff",
        canActivate: [AuthGuardService],
        component: StaffComponent,
      }, // Staff Routes,
      {
        path: "orders",
        component: OrdersComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "feedback",
        component: FeedbackComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "storeorders",
        component: StoreordersComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "franchise",
        component: FranchiseComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "expense",
        component: ExpenseComponent,
        canActivate: [AuthGuardService],
      },
      { path: "accessdenied", component: AccessDeniedComponent }, // accessdenied Routes
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService],
})
export class SidelayoutRoutingModule {}
