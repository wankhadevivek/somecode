import { NgModule } from "@angular/core";
import { SatDatepickerModule, SatNativeDateModule } from "saturn-datepicker";
import { MatSidenavModule } from "@angular/material";
import { SidelayoutRoutingModule } from "./sidelayout-routing.module";
import { SidelayoutComponent } from "./sidelayout.component";
import { DashbordComponent } from "../dashbord/dashbord.component";
import { HeaderComponent } from "../shared/header/header.component";
import { MatCheckboxModule } from "@angular/material";
import { MatButtonModule } from "@angular/material";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import {
  MatNativeDateModule,
  MatRippleModule,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTabsModule } from "@angular/material/tabs";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatSliderModule } from "@angular/material/slider";
import { MatPaginatorModule } from "@angular/material/paginator";
import { JobcardComponent } from "../jobcard/jobcard.component";
import { StoreordersComponent } from '../storeorders/storeorders.component';

import { InventoryComponent } from "../inventory/inventory.component";
import { CommonModule, DecimalPipe } from "@angular/common";
import { ChartsModule } from "ng2-charts";
import {
  NgbPaginationModule,
  NgbAlertModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatepickerModule } from "ngx-bootstrap";
import {
  BsDatepickerModule,
  BsDatepickerConfig,
} from "ngx-bootstrap/datepicker";
import { SpinComponent } from "src/app/shared/spinner/spin/spin.component";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { ReportsComponent } from "../reports/reports.component";
import { SettingComponent } from "../setting/setting.component";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { DataTableModule } from "angular-6-datatable";
import { RoundProgressModule } from "angular-svg-round-progressbar";
import { MembershipComponent } from "../membership/membership.component";
import { PagenotfoundComponent } from "../pagenotfound/pagenotfound.component";
import { HighchartsChartModule } from "highcharts-angular";
import { CollectpaymentComponent } from "../collectpayment/collectpayment.component";
import { AppointmentComponent } from "../appointment/appointment.component";
import { OnlinebookComponent } from "../onlinebook/onlinebook.component";
import { FlatpickrModule } from "angularx-flatpickr";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { CounterComponent } from "../counter/counter.component";
import { PurchaseorderComponent } from "../purchaseorder/purchaseorder.component";
import { SupplierComponent } from "../supplier/supplier.component";
import { StaffComponent } from "../staff/staff.component";
import { CashbookComponent } from '../cashbook/cashbook.component';
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from '@ngx-translate/core'
import { OrdersComponent } from "../orders/orders.component";
import { FeedbackComponent } from "../feedback/feedback.component";
import { AccessDeniedComponent } from "../../shared/dialog/access-denied/access-denied.component";
import { FranchiseComponent } from '../franchise/franchise.component';
import { ExpenseComponent } from "../expense/expense.component";

import {NgxPaginationModule} from 'ngx-pagination';
@NgModule({
  declarations: [
    SidelayoutComponent,
    DashbordComponent,
    HeaderComponent,
    JobcardComponent,
    CollectpaymentComponent,
    AppointmentComponent,
    OnlinebookComponent,
    ReportsComponent,
    InventoryComponent,
    PurchaseorderComponent,
    SupplierComponent,
    CounterComponent,
    SettingComponent,
    MembershipComponent,
    SpinComponent,
    PagenotfoundComponent,
    StaffComponent,
    OrdersComponent,
    FeedbackComponent,
    AccessDeniedComponent,
    StoreordersComponent,
    CashbookComponent,
    FranchiseComponent,
    ExpenseComponent
  ],
  exports: [MatSidenavModule, SpinComponent],
  imports: [
    SatDatepickerModule,
    SatNativeDateModule,
    FormsModule,
    HighchartsChartModule,
    DataTableModule,
    RoundProgressModule,
    NgMultiSelectDropDownModule,
    AutocompleteLibModule,
    NgxMaterialTimepickerModule,
    SidelayoutRoutingModule,
    NgbPaginationModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule,
    Ng2SearchPipeModule,
    NgbAlertModule,
    MatSidenavModule,
    CommonModule,
    NgbModule,
    ChartsModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    NgSelectModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    TranslateModule,
    NgxPaginationModule
  ],
  providers: [DecimalPipe, { provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
  bootstrap: [],
})
export class SidelayoutModule {}
