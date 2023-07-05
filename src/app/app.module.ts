/**
 * NavEra
 * In this File all the modules are defined
 * of angular cli as well as custom.
 * Here all dialog modules are also defined
 * In this file all the modules are of parent
 */

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginComponent } from "./components/login/login.component";
import { SatDatepickerModule, SatNativeDateModule } from "saturn-datepicker";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SignupComponent } from "./components/signup/signup.component";
import { MatDialogModule } from "@angular/material";
import { CreateJobCardComponent } from "./shared/dialog/create-job-card/create-job-card.component";
import { ConfirmDialogComponent } from "./shared/dialog/confirm-dialog/confirm-dialog.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ColorPickerComponent } from "./shared/dialog/color-picker/color-picker.component";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ColorAlphaModule } from "ngx-color/alpha";
import { ColorBlockModule } from "ngx-color/block";
import { ColorChromeModule } from "ngx-color/chrome";
import { ColorCircleModule } from "ngx-color/circle";
import { ColorCompactModule } from "ngx-color/compact";
import { ColorGithubModule } from "ngx-color/github";
import { ColorHueModule } from "ngx-color/hue";
import { ColorMaterialModule } from "ngx-color/material";
import { ColorPhotoshopModule } from "ngx-color/photoshop";
import { ColorSketchModule } from "ngx-color/sketch";
import { ColorSliderModule } from "ngx-color/slider";
import { ColorSwatchesModule } from "ngx-color/swatches";
import { ColorTwitterModule } from "ngx-color/twitter";
import { ColorShadeModule } from "ngx-color/shade";
import { CommonModule, DatePipe, DecimalPipe } from "@angular/common";
import { ChartsModule } from "ng2-charts";
import { DatepickerModule } from "ngx-bootstrap";
import { SpinloginComponent } from "./shared/spinnerlogin/spinlogin/spinlogin.component";
import { CreateShortInvoiceComponent } from "./shared/dialog/create-short-invoice/create-short-invoice.component";
import { CreateSetReminderComponent } from "./shared/dialog/create-set-reminder/create-set-reminder.component";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpRequestInterceptor } from "./shared/interceptor/api-interceptor";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { VerifyNumberComponent } from "./shared/dialog/verify-number/verify-number.component";
import { AddDescriptionComponent } from "./shared/dialog/add-description/add-description.component";
import { InvoiceEstimateComponent } from "./shared/dialog/invoice-estimate/invoice-estimate.component";
import { NgxPrintModule } from "ngx-print";
import { EmailSendComponent } from "./shared/dialog/email-send/email-send.component";
import { SelectOptionComponent } from "./shared/dialog/select-option/select-option.component";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ReportsDayComponent } from "./shared/dialog/reports-day/reports-day.component";
import { ImageCropComponent } from "./shared/dialog/image-crop/image-crop.component";
import { ImageCropperModule } from "ngx-image-cropper";
import { PaymnetfaliureComponent } from "./components/paymnetfaliure/paymnetfaliure.component";
import { PaymnetsuccessComponent } from "./components/paymnetsuccess/paymnetsuccess.component";
import { SelectPaymentComponent } from "./shared/dialog/select-payment/select-payment.component";
import { SmsReportComponent } from "./shared/dialog/sms-report/sms-report.component";
import { PaymentInvoiceComponent } from "./shared/dialog/payment-invoice/payment-invoice.component";
import { RememAccdetailsComponent } from "./shared/dialog/remem-accdetails/remem-accdetails.component";
import { GetLinkComponent } from "./shared/dialog/get-link/get-link.component";
import { MatStepperModule } from "@angular/material/stepper";
import { MatSliderModule } from "@angular/material/slider";
import { MatExpansionModule } from "@angular/material/expansion";
import { TransactionDetailsComponent } from "./shared/dialog/transaction-details/transaction-details.component";
import { AppoitmentBookingComponent } from "./shared/dialog/appoitment-booking/appoitment-booking.component";
import { EndUserLoginComponent } from "./shared/dialog/end-user-login/end-user-login.component";
import { MatIconModule } from "@angular/material/icon";
import { EndUserPaymentComponent } from "./shared/dialog/end-user-payment/end-user-payment.component";
import { EndusersuccessComponent } from "./components/endusersuccess/endusersuccess.component";
import { EnduserfailComponent } from "./components/enduserfail/enduserfail.component";
import { EndUserMessageComponent } from "./shared/dialog/end-user-message/end-user-message.component";
import { SelectOptionOpenComponent } from "./shared/dialog/select-option-open/select-option-open.component";
import { BookDeclineComponent } from "./shared/dialog/book-decline/book-decline.component";
import { PilotappComponent } from "./components/pilotapp/pilotapp.component";
import { FestiveComponent } from "./components/festive/festive.component";
import { CounterSaleComponent } from "./shared/dialog/counter-sale/counter-sale.component";
import { AppoitmentDayComponent } from "./shared/dialog/appoitment-day/appoitment-day.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { CounterDayComponent } from "./shared/dialog/counter-day/counter-day.component";
import { UpdateAppComponent } from "./shared/dialog/update-app/update-app.component";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ScrollDispatchModule } from "@angular/cdk/scrolling";
import { OrderSortComponent } from "./shared/dialog/order-sort/order-sort.component";
import { StoreLoginComponent } from "./shared/dialog/store-login/store-login.component";
import { PurchaseOrderComponent } from "./shared/dialog/purchase-order/purchase-order.component";
import { AddStaffComponent } from "./components/staff/add-staff.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { LastJobcardHistoryComponent } from "./shared/dialog/last-jobcard-history/last-jobcard-history.component";

import { FloorPipe } from "./services/roundoff-pipe.service";

import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
import { ForgetPasswordComponent } from "./components/forget-password/forget-password.component";

import { MatToolbarModule } from "@angular/material/toolbar";

import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";

import { MatTabsModule } from "@angular/material/tabs";

import { MatDividerModule } from "@angular/material/divider";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import {NgxPaginationModule} from 'ngx-pagination';
import { MatBadgeModule } from "@angular/material/badge";
import { CreatePurchaseOrderComponent } from './shared/dialog/create-purchase-order/create-purchase-order.component';
import { InvoiceEstimatePoComponent } from './shared/dialog/invoice-estimate-po/invoice-estimate-po.component';
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireModule } from "@angular/fire";
import { MessagingService } from "./services/messaging.service";
import { AsyncPipe } from "../../node_modules/@angular/common";
import { SupplierLoginComponent } from './components/supplier-login/supplier-login.component';
import { AllowNotificationComponent } from './shared/dialog/allow-notification/allow-notification.component';
import {MatButtonModule} from '@angular/material/button';
import {SupplierPurchaseOrder } from './shared/dialog/supplier-purchase-order/supplier-purchase-order.component';
import { AdminPanelModule } from "./components/admin-panel/admin-panel.module";
import { JobcardDetailComponent } from './components/jobcard-detail/jobcard-detail.component';
import { SafeStylePipe } from "./shared/pipe/safecss.pipe";
import { AddExpenseComponent } from './shared/dialog/add-expense/add-expense.component';


// import { StoreordersComponent } from './components/storeorders/storeorders.component';

@NgModule({
  declarations: [

    AppComponent,
    LoginComponent,
    SignupComponent,
    PilotappComponent,
    FestiveComponent,
    PaymnetsuccessComponent,
    PaymnetfaliureComponent,
    EndusersuccessComponent,
    EnduserfailComponent,
    CreateJobCardComponent,
    CounterSaleComponent,
    PurchaseOrderComponent,
    AppoitmentBookingComponent,
    AppoitmentDayComponent,
    BookDeclineComponent,
    ReportsDayComponent,
    CounterDayComponent,
    ConfirmDialogComponent,
    VerifyNumberComponent,
    EndUserLoginComponent,
    EndUserMessageComponent,
    EndUserPaymentComponent,
    AddDescriptionComponent,
    ImageCropComponent,
    EmailSendComponent,
    InvoiceEstimateComponent,
    ColorPickerComponent,
    SelectOptionComponent,
    SelectOptionOpenComponent,
    SpinloginComponent,
    CreateShortInvoiceComponent,
    CreateSetReminderComponent,
    SelectPaymentComponent,
    SmsReportComponent,
    OrderSortComponent,
    StoreLoginComponent,
    RememAccdetailsComponent,
    TransactionDetailsComponent,
    UpdateAppComponent,
    PaymentInvoiceComponent,
    GetLinkComponent,
    AddStaffComponent,
    LastJobcardHistoryComponent,
    FloorPipe,
    ForgetPasswordComponent,
    CreatePurchaseOrderComponent,
    InvoiceEstimatePoComponent,
    SupplierLoginComponent,
    AllowNotificationComponent,
    SupplierPurchaseOrder,
    JobcardDetailComponent,
    SafeStylePipe,
    AddExpenseComponent,
  
    
    
   
  
    
  ],
  exports: [
    EndUserPaymentComponent,
    GetLinkComponent,
    RememAccdetailsComponent,
    UpdateAppComponent,
    TransactionDetailsComponent,
    PaymentInvoiceComponent,
    SelectPaymentComponent,
    StoreLoginComponent,
    OrderSortComponent,
    SmsReportComponent,
    CounterDayComponent,
    ReportsDayComponent,
    ImageCropComponent,
    SelectOptionOpenComponent,
    SelectOptionComponent,
    PurchaseOrderComponent,
    CounterSaleComponent,
    CreateJobCardComponent,
    BookDeclineComponent,
    AppoitmentDayComponent,
    AppoitmentBookingComponent,
    InvoiceEstimateComponent,
    EmailSendComponent,
    AddDescriptionComponent,
    VerifyNumberComponent,
    ConfirmDialogComponent,
    ColorPickerComponent,
    SpinloginComponent,
    CreateSetReminderComponent,
    CreateShortInvoiceComponent,
    LastJobcardHistoryComponent,
    AddExpenseComponent,

    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatSliderModule,
    MatTabsModule,
    MatBadgeModule,
    MatButtonModule
  ],
  imports: [
    ScrollToModule.forRoot(),
    MatExpansionModule,
    InfiniteScrollModule,
    ScrollDispatchModule,
    MatIconModule,
    SatDatepickerModule,
    MatStepperModule,
    MatSliderModule,
    SatNativeDateModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    BrowserModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ImageCropperModule,
    AutocompleteLibModule,
    NgxMaterialTimepickerModule,
    NgMultiSelectDropDownModule,
    NgxPrintModule,
    CommonModule,
    ChartsModule,
    DatepickerModule,
    Ng2SearchPipeModule,
    AppRoutingModule,
    MatDialogModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ColorAlphaModule,
    ColorBlockModule,
    ColorChromeModule,
    ColorCircleModule,
    ColorCompactModule,
    MatSnackBarModule,
    ColorGithubModule,
    ColorHueModule,
    ColorMaterialModule,
    ColorPhotoshopModule,
    ColorSketchModule,
    ColorSliderModule,
    ColorSwatchesModule,
    ColorTwitterModule,
    ColorShadeModule,

    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatSliderModule,
    MatTabsModule,
    MatBadgeModule,

    FormsModule,
    NgbModule,
    NgSelectModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
    GooglePlaceModule,
    NgxIntlTelInputModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    MatButtonModule,
    AdminPanelModule,
    NgxPaginationModule
  ],
  entryComponents: [
    CreateJobCardComponent,
    CounterSaleComponent,
    PurchaseOrderComponent,
    AppoitmentBookingComponent,
    AppoitmentDayComponent,
    BookDeclineComponent,
    ReportsDayComponent,
    CounterDayComponent,
    ImageCropComponent,
    SelectPaymentComponent,
    SmsReportComponent,
    OrderSortComponent,
    StoreLoginComponent,
    RememAccdetailsComponent,
    TransactionDetailsComponent,
    UpdateAppComponent,
    PaymentInvoiceComponent,
    SelectOptionComponent,
    SelectOptionOpenComponent,
    CreateShortInvoiceComponent,
    CreateSetReminderComponent,
    ConfirmDialogComponent,
    VerifyNumberComponent,
    EndUserLoginComponent,
    EndUserMessageComponent,
    EndUserPaymentComponent,
    AddDescriptionComponent,
    EmailSendComponent,
    InvoiceEstimateComponent,
    ColorPickerComponent,
    GetLinkComponent,
    AddStaffComponent,
    LastJobcardHistoryComponent,
    CreatePurchaseOrderComponent,
    InvoiceEstimatePoComponent,
    AllowNotificationComponent,
    SupplierPurchaseOrder,
    AddExpenseComponent
  ],
  providers: [
    DatePipe,
    DecimalPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
    MessagingService,
    AsyncPipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
