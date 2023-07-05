import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { CreateJobCardComponent } from "../shared/dialog/create-job-card/create-job-card.component";

import { Observable, of as observableOf } from "rxjs";
import { ColorPickerComponent } from "../shared/dialog/color-picker/color-picker.component";
import { CreateShortInvoiceComponent } from "../shared/dialog/create-short-invoice/create-short-invoice.component";
import { CreateSetReminderComponent } from "../shared/dialog/create-set-reminder/create-set-reminder.component";
import { ConfirmDialogComponent } from "../shared/dialog/confirm-dialog/confirm-dialog.component";
import { VerifyNumberComponent } from "../shared/dialog/verify-number/verify-number.component";
import { InvoiceEstimateComponent } from "../shared/dialog/invoice-estimate/invoice-estimate.component";
import { EmailSendComponent } from "../shared/dialog/email-send/email-send.component";
import { SelectOptionComponent } from "../shared/dialog/select-option/select-option.component";
import { ReportsDayComponent } from "../shared/dialog/reports-day/reports-day.component";
import { ImageCropComponent } from "../shared/dialog/image-crop/image-crop.component";
import { SelectPaymentComponent } from "../shared/dialog/select-payment/select-payment.component";
import { SmsReportComponent } from "../shared/dialog/sms-report/sms-report.component";
import { PaymentInvoiceComponent } from "../shared/dialog/payment-invoice/payment-invoice.component";
import { RememAccdetailsComponent } from "../shared/dialog/remem-accdetails/remem-accdetails.component";
import { GetLinkComponent } from "../shared/dialog/get-link/get-link.component";
import { TransactionDetailsComponent } from "../shared/dialog/transaction-details/transaction-details.component";
import { AppoitmentBookingComponent } from "../shared/dialog/appoitment-booking/appoitment-booking.component";
import { AddDescriptionComponent } from "../shared/dialog/add-description/add-description.component";
import { EndUserLoginComponent } from "../shared/dialog/end-user-login/end-user-login.component";
import { EndUserPaymentComponent } from "../shared/dialog/end-user-payment/end-user-payment.component";
import { EndUserMessageComponent } from "../shared/dialog/end-user-message/end-user-message.component";
import { SelectOptionOpenComponent } from "../shared/dialog/select-option-open/select-option-open.component";
import { BookDeclineComponent } from "../shared/dialog/book-decline/book-decline.component";
import { CounterSaleComponent } from "../shared/dialog/counter-sale/counter-sale.component";
import { AppoitmentDayComponent } from "../shared/dialog/appoitment-day/appoitment-day.component";
import { CounterDayComponent } from "../shared/dialog/counter-day/counter-day.component";
import { UpdateAppComponent } from "../shared/dialog/update-app/update-app.component";
import { OrderSortComponent } from "../shared/dialog/order-sort/order-sort.component";
import { StoreLoginComponent } from "../shared/dialog/store-login/store-login.component";
import { PurchaseOrderComponent } from "../shared/dialog/purchase-order/purchase-order.component";
import { LastJobcardHistoryComponent } from "../shared/dialog/last-jobcard-history/last-jobcard-history.component";
import { CreatePurchaseOrderComponent } from "../shared/dialog/create-purchase-order/create-purchase-order.component"
import { InvoiceEstimatePoComponent } from "../shared/dialog/invoice-estimate-po/invoice-estimate-po.component";
import { AllowNotificationComponent } from "../shared/dialog/allow-notification/allow-notification.component";
import {SupplierPurchaseOrder} from "../shared/dialog/supplier-purchase-order/supplier-purchase-order.component";
import { AddExpenseComponent } from "../shared/dialog/add-expense/add-expense.component";
/**
 * In this file all the popup are called
 * to open with height and width and custom calss
 * to send the data nd return back the dtata
 */
@Injectable({
  providedIn: "root",
})
export class DilogOpenService {
  constructor(public dialog: MatDialog) {}
  CreateJobCard(
    jobcardarray: any,
    staus: string,
    esitorcreate: string,
    manualOrBook: string
  ): Observable<any> {
    const jobCard = this.dialog.open(CreateJobCardComponent, {
      width: "100%",
      height: "100%",
      data: {
        jobcardarray: jobcardarray,
        staus: staus,
        esitorcreate: esitorcreate,
        manualOrBook: manualOrBook,
      },
      panelClass: "custom-modalbox-jobcard",
    });
    return jobCard.afterClosed();
  }
  OpenCounterSale(openOrEdit: string, counternumber: string): Observable<any> {
    const jobCard = this.dialog.open(CounterSaleComponent, {
      width: "100%",
      height: "100%",
      data: { openOrEdit: openOrEdit, counternumber: counternumber },
      panelClass: "custom-modalbox",
    });
    return jobCard.afterClosed();
  }
  //vivek changes start
  OpenAddExpense(openOrEdit: string, counternumber: string): Observable<any> {
    const jobCard = this.dialog.open(AddExpenseComponent, {
      width: "100%",
      height: "100%",
      data: { openOrEdit: openOrEdit, counternumber: counternumber },
      panelClass: "custom-modalbox",
    });
    return jobCard.afterClosed();
  }
  //vivek changes end
  OpenPurchaseOrder(
    openOrEdit: string,
    counternumber: string,
    bal: string,
    status:string
  ): Observable<any> {
    const jobCard = this.dialog.open(PurchaseOrderComponent, {
      width: "100%",
      height: "100%",
      data: { openOrEdit: openOrEdit, counternumber: counternumber, bal: bal, status:status },
      panelClass: "custom-modalbox",
    });
    return jobCard.afterClosed();
  }
  OpenCreatePurchaseOrder(
    openOrEdit: string,
    counternumber: string,
    bal: string,
    status:string
  ): Observable<any> {
    const jobCard = this.dialog.open(CreatePurchaseOrderComponent, {
      width: "100%",
      height: "100%",
      data: { openOrEdit: openOrEdit, counternumber: counternumber, bal: bal, status:status },
      panelClass: "custom-modalbox",
    });
    return jobCard.afterClosed();
  }

  OpenSupplierPurchaseOrder(
    openOrEdit: string,
    counternumber: string,
    bal: string,
    status:string,
    workshop:string,
  ): Observable<any> {
    const jobCard = this.dialog.open(SupplierPurchaseOrder, {
      width: "100%",
      height: "100%",
      data: { openOrEdit: openOrEdit, counternumber: counternumber, bal: bal, status:status,workshop: workshop},
      panelClass: "custom-modalbox",
    });
    return jobCard.afterClosed();
  }

  OpenColorPicker(title: string): Observable<string> {
    const colorDialog = this.dialog.open(ColorPickerComponent, {
      width: "285px",
      height: "251px",
      data: { title: title },
    });
    return colorDialog.afterClosed();
  }
  OpenConfirmDialog(
    question: string,
    showDelete: boolean,
    button: string
  ): Observable<boolean> {
    const colorDialog = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      height: "230px",
      data: { question: question, showDelete: showDelete, button: button },
    });
    return colorDialog.afterClosed();
  }

  OpenNotificationDialog(
    messsage: string,

    top_param: number
  ): Observable<boolean> {
    const left = 30;
    const top = 0;

    const notifyDialog = this.dialog.open(AllowNotificationComponent, {
      width: "400px",
      height: "240px",
      data: { messsage: messsage },
      position: { top: top_param + "rem" },
    });
    return notifyDialog.afterClosed();
  }
  OpenGetLink(
    question: string,
    jobcardtype: string,
    getlink: string,
    amount: any,
    issues: string,
    cus_name: string,
    cus_phone: string,
    jm_number: string
  ): Observable<any> {
    const colorDialog = this.dialog.open(GetLinkComponent, {
      width: "500px",
      height: "300px",
      data: {
        question: question,
        jobcardtype: jobcardtype,
        getlink: getlink,
        amount: amount,
        issues: issues,
        cus_name: cus_name,
        cus_phone: cus_phone,
        jm_number: jm_number,
      },
    });
    return colorDialog.afterClosed();
  }
  OpenLastHistory(history: any, jobcardtype: any): Observable<any> {
    const colorDialog = this.dialog.open(LastJobcardHistoryComponent, {
      width: "500px",
      height: "300px",
      data: { history: history, jobcardtype: jobcardtype },
    });
    return colorDialog.afterClosed();
  }
  OpenVerifyNumber(phonenumber: any, flag: string): Observable<boolean> {
    const colorDialog = this.dialog.open(VerifyNumberComponent, {
      width: "400px",
      height: "240px",
      data: { phonenumber: phonenumber, flag: flag },
    });
    return colorDialog.afterClosed();
  }
  openEndUserLogin(flag: string): Observable<any> {
    const colorDialog = this.dialog.open(EndUserLoginComponent, {
      width: "400px",
      height: "280px",
      data: { flag: flag },
    });
    return colorDialog.afterClosed();
  }
  openStoteLogin(flag: string, number: string): Observable<any> {
    const colorDialog = this.dialog.open(StoreLoginComponent, {
      width: "400px",
      height: "280px",
      data: { flag: flag, number: number },
    });
    return colorDialog.afterClosed();
  }
  openEndUserPayment(amount: any): Observable<boolean> {
    const colorDialog = this.dialog.open(EndUserPaymentComponent, {
      width: "800px",
      height: "500px",
      data: { amount: amount },
    });
    return colorDialog.afterClosed();
  }
  OpenCreateShortInvoice(
    jobcardarray: any,
    staus: string,
    esitorcreate: string
  ): Observable<any> {
    const colorDialog = this.dialog.open(CreateShortInvoiceComponent, {
      width: "100%",
      height: "100%",
      data: {
        jobcardarray: jobcardarray,
        staus: staus,
        esitorcreate: esitorcreate,
      },
      panelClass: "custom-modalbox-jobcard",
    });
    return colorDialog.afterClosed();
  }
  OpenCreateSetReminder(
    jobcardarray: any,
    staus: string,
    esitorcreate: string
  ): Observable<any> {
    const colorDialog = this.dialog.open(CreateSetReminderComponent, {
      width: "100%",
      height: "100%",
      data: {
        jobcardarray: jobcardarray,
        staus: staus,
        esitorcreate: esitorcreate,
      },
      panelClass: "custom-modalbox-jobcard",
    });
    return colorDialog.afterClosed();
  }
  OpenInvoiceEstimate(
    title: string,
    width: string,
    height: string,
    alldata: any
  ): Observable<boolean> {
    const colorDialog = this.dialog.open(InvoiceEstimateComponent, {
      width: width,
      height: height,
      data: { title: title, alldata: alldata },
    });
    return colorDialog.afterClosed();
  }
  OpenEmailSend(string: any): Observable<string> {
    const colorDialog = this.dialog.open(EmailSendComponent, {
      width: "400px",
      height: "230px",
      data: { string: string },
    });
    return colorDialog.afterClosed();
  }
  OpenSelectOption(string: any): Observable<string> {
    const colorDialog = this.dialog.open(SelectOptionComponent, {
      width: "400px",
      height: "230px",
      data: { string: string },
    });
    return colorDialog.afterClosed();
  }
  openMecSelectOption(string: any): Observable<string> {
    const colorDialog = this.dialog.open(SelectOptionOpenComponent, {
      width: "410px",
      height: "240px",
      data: { string: string },
    });
    return colorDialog.afterClosed();
  }
  OpenReports(string: Date): Observable<string> {
    const colorDialog = this.dialog.open(ReportsDayComponent, {
      width: "1300px",
      height: "auto",
      data: { string: string },
    });
    return colorDialog.afterClosed();
  }
  OpenCounterReports(string: Date): Observable<string> {
    const colorDialog = this.dialog.open(CounterDayComponent, {
      width: "1300px",
      height: "auto",
      data: { string: string },
    });
    return colorDialog.afterClosed();
  }
  OpenImageCrop(string: any): Observable<any> {
    const colorDialog = this.dialog.open(ImageCropComponent, {
      width: "800px",
      height: "auto",
      data: { string: string },
    });
    return colorDialog.afterClosed();
  }
  OpenSelectPayment(
    array: any,
    previousType: string,
    days: any
  ): Observable<any> {
    const colorDialog = this.dialog.open(SelectPaymentComponent, {
      width: "auto",
      height: "auto",
      data: { array: array, previousType: previousType, days: days },
    });
    return colorDialog.afterClosed();
  }
  OpenSmsReport(array: any): Observable<any> {
    const colorDialog = this.dialog.open(SmsReportComponent, {
      width: "600px",
      height: "400px",
      data: { array: array },
    });
    return colorDialog.afterClosed();
  }
  OpenProductSort(): Observable<any> {
    const colorDialog = this.dialog.open(OrderSortComponent, {
      width: "300px",
      height: "200px",
      panelClass: "custom-modalbox-order",
      data: {},
    });
    return colorDialog.afterClosed();
  }
  OpenPaymentType(array: any): Observable<any> {
    const colorDialog = this.dialog.open(PaymentInvoiceComponent, {
      width: "600px",
      height: "400px",
      data: { array: array },
    });
    return colorDialog.afterClosed();
  }
  OpenAccRemember(line: string): Observable<any> {
    const colorDialog = this.dialog.open(RememAccdetailsComponent, {
      width: "377px",
      height: "205px",
      data: { line: line },
    });
    return colorDialog.afterClosed();
  }
  OpenTransDetails(line: string): Observable<any> {
    const colorDialog = this.dialog.open(TransactionDetailsComponent, {
      width: "800px",
      height: "500px",
      data: { line: line },
    });
    return colorDialog.afterClosed();
  }
  UpdateAppInfo(): Observable<any> {
    const colorDialog = this.dialog.open(UpdateAppComponent, {
      width: "auto",
      height: "auto",
      data: {},
    });
    return colorDialog.afterClosed();
  }
  OpenBookingForm(line: string): Observable<any> {
    const colorDialog = this.dialog.open(AppoitmentBookingComponent, {
      width: "80%",
      height: "85%",
      data: { line: line },
    });
    return colorDialog.afterClosed();
  }
  OpenAppoitmentDay(line: any): Observable<any> {
    const colorDialog = this.dialog.open(AppoitmentDayComponent, {
      width: "80%",
      height: "85%",
      data: { line: line },
    });
    return colorDialog.afterClosed();
  }
  OpenBookingFormDeclineOrUpdate(
    bookingid: string,
    mode: string
  ): Observable<any> {
    const colorDialog = this.dialog.open(BookDeclineComponent, {
      width: "450px",
      height: "288",
      data: { bookingid: bookingid, mode: mode },
    });
    return colorDialog.afterClosed();
  }
  OpenDescriptionPopup(
    name: any,
    price: string,
    part_number: string
  ): Observable<any> {
    const colorDialog = this.dialog.open(AddDescriptionComponent, {
      width: "600px",
      height: "300px",
      data: { name: name, price: price, part_number: part_number },
    });
    return colorDialog.afterClosed();
  }
  openEndUserMessageDialog(line: string): Observable<any> {
    const colorDialog = this.dialog.open(EndUserMessageComponent, {
      width: "377px",
      height: "75px",
      data: { line: line },
    });
    return colorDialog.afterClosed();
  }
  // Viraj
  OpenInvoiceEstimateForPO(
    title: string,
    width: string,
    height: string,
    alldata: any
  ): Observable<boolean> {
    const colorDialog = this.dialog.open(InvoiceEstimatePoComponent, {
      width: width,
      height: height,
      data: { title: title, alldata: alldata },
    });
    return colorDialog.afterClosed();
  }
}
