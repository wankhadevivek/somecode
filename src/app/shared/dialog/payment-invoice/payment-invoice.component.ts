import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl } from '@angular/forms';
import { UserserviceService } from '../../../services/userservice.service';
import { SpinnerService } from '../../../services/spinner.service';
import { GeneralService } from '../../../services/general.service';
import { NgForm } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PaymentInvoiceService } from '../../../services/paymentinvoice.service';
@Component({
  selector: 'payment-invoice-option',
  templateUrl: './payment-invoice.component.html',
  styleUrls: ['./payment-invoice.component.css']
})
/**
 * In this file get the invoices 
 * of the worksho rechanrge
*/
export class PaymentInvoiceComponent implements OnInit {
  OTPForm:FormGroup;
  submitted = false;
  array:any
  allStates=["Andra Pradesh","Arunachal Pradesh","Assam","Bihar",
  "Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand",
  "Karnataka","Kerala","Madya Pradesh","Maharashtra","Manipur","Meghalaya",
  "Mizoram","Nagaland","Orissa","Punjab","Rajasthan","Sikkim","Tamil Nadu",
  "Telagana","Tripura","Uttarakhand","Uttar Pradesh","West Bengal",
  "Andaman and Nicobar Islands","Jammu and Kashmir","Chandigarh",
  "Dadar and Nagar Haveli Daman and Diu","Delhi","Lakshadeep","Ladakh","Pondicherry"]
  constructor(
    private showspinner:SpinnerService,
    private snakBar:MatSnackBar,
    private formbuild: FormBuilder,
    private general:GeneralService,
    private userService:UserserviceService,
    public payment:PaymentInvoiceService,
    public dialogRef: MatDialogRef<PaymentInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.array=data.array
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      this.showOtpform();
  }

  ngOnInit() {
  }
  // close the popup
  closePopup(event){
    if(event==true){
      this.submitted = true;
      if (this.OTPForm.invalid) {
        return;
      }else{
        var name
        var documentDefinition
        name=this.array.orderid+" - invoice.pdf"
        documentDefinition = this.payment.generatePDFPayment(
          this.array,
          this.OTPForm.getRawValue().gst_number,
          this.OTPForm.getRawValue().statename
        )
        
        //pdfMake.createPdf(documentDefinition).open();
        
        pdfMake.createPdf(documentDefinition).download(name)

        //console.log(this.OTPForm.getRawValue().gst_number)
        //console.log(this.OTPForm.getRawValue().statename)
        this.dialogRef.close(true);
      }
    }else{
      this.dialogRef.close(event);
    }
  }
  // Show the form for GST and state selection
  showOtpform(){
    this.OTPForm=this.formbuild.group({
      gst_number: ['', Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)],
      statename:['Maharashtra',Validators.required]
    })
  }
}
