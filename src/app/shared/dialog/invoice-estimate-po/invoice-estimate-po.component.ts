import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from "@angular/material";
import { NgbDatepickerConfig } from "@ng-bootstrap/ng-bootstrap";
import { SpinnerService } from "../../../services/spinner.service";
import { GeneralService } from "../../../services/general.service";
import { UserserviceService } from "../../../services/userservice.service";
import { FormBuilder } from "@angular/forms";
import { DilogOpenService } from "../../../services/dilog-open.service";
import { ErrorMessgae } from "../../../shared/error_message/error";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { PdfgenerateService } from "../../../services/pdfgenerate.service";
import { DomSanitizer } from "@angular/platform-browser";
import { AbstractService } from "../../../services/comman/abstract.service";
import { DatePipe } from "@angular/common";
import * as glob from "../../../shared/usercountry/userCountryGlobal"
import { stringify } from "querystring";

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import htmlToPdfmake from "html-to-pdfmake";
@Component({
  selector: 'app-invoice-estimate-po',
  templateUrl: './invoice-estimate-po.component.html',
  styleUrls: ['./invoice-estimate-po.component.css']
})
export class InvoiceEstimatePoComponent implements OnInit {
  mainTitle;
  jocardSettings;
  billingSettings;
  showgst: boolean = false;
  billformat;
  allData;
  workshopName;
  address;
  addresspin;
  phoneNumber;
  email;
  allCustomerDetails;
  amountinwords = "";
  reminderdate;
  allTermsAndConditions = Array();
  partsArraySpareLube = Array();
  partsArrayJobs = Array();
  completeArray = Array();
  UnitPriceSum = 0;
  taxrate = 0;
  totalPayable = 0;
  totalPayabledis = 0;
  gstTypes = Array();
  MaingstTypes = Array();
  Discountname;
  gstno;
  image = "";
  WordsTabelName = "Estimate Amount In Words";
  cutsomerVoice = Array();
  worknotes = Array();
  logoimage = this.abstract.imageUrl1;
  signaturephoto = this.abstract.imageUrl1;
  onlineenable;
  urlgetforonline;
  urlgetforonlineclose;
  mainurl = this.abstract.mainurl;
  contactlink = "";
  showSigImage: boolean = false;
  billheader;
  billfooter;
  profiledata;
  reminderKM = 0;
  currency_symbol: any;
  signatureImage: any;
  shoSigImage: boolean = false;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private config: NgbDatepickerConfig,
    private snakBar: MatSnackBar,
    private showspinner: SpinnerService,
    private general: GeneralService,
    private userService: UserserviceService,
    private formbuild: FormBuilder,
    private dialogservice: DilogOpenService,
    public pdfService: PdfgenerateService,
    public abstract: AbstractService,
    public datepipe: DatePipe,
    public domSanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<InvoiceEstimatePoComponent>
  ) {
    this.mainTitle = data.title;
    this.allData = data.alldata;
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.general
      .getLInkStatus(this.userService.getData()["workshop_id"])
      .subscribe((linkget) => {
        if (linkget.success == true) {
          this.onlineenable = linkget.online_garage;
          this.urlgetforonline =
            "\r\n\n" +
            "Check Jobcard Live Status on : " +
            this.mainurl +
            "cus/" +
            linkget.url_param;
          this.urlgetforonlineclose =
            "\r\n" +
            "You can book appointment on " +
            this.mainurl +
            "cus/" +
            linkget.url_param;
        } else {
          this.onlineenable = "false";
          this.urlgetforonline = "";
        }
      });
  }
  // Jocard and user settings are called to generate the jobcard with lastest settings
  ngOnInit() {
    this.currency_symbol = glob.currency_symbol;
    this.allData.WorkshopDetails = [];
    var WorkshopData = JSON.parse(localStorage.getItem("user"));
    this.workshopName = WorkshopData.workshop_name;
    this.allData.workshopName = WorkshopData.workshop_name;
    this.allData.WorkshopDetails.push("Name: "+WorkshopData.workshop_name);
    this.allCustomerDetails = WorkshopData;

    this.general
      .getJobcardSettings(this.userService.getData()["workshop_id"])
      .subscribe(
        (settingsData) => {
          this.showspinner.setSpinner(true);
          this.jocardSettings = JSON.parse(
            settingsData.jobcard_Settings.settings_jobcard
          )[0];
          this.jocardSettings.settings_billing = JSON.parse(
            settingsData.jobcard_Settings.settings_billing
          )[0];
          this.billingSettings = JSON.parse(
            settingsData.jobcard_Settings.settings_billing
          )[0];
          if(this.billingSettings.gst_number == '' || this.billingSettings.gst_number == undefined){
            this.billingSettings.gst_number = '0';
            this.allData.gst_number = '0';
            this.allData.WorkshopDetails.push("GSTN: 0");
            
          }else{
            this.allData.gst_number = this.billingSettings.gst_number;
            this.allData.WorkshopDetails.push("GSTN: "+ this.billingSettings.gst_number);
          }
          this.allData.tag_line = this.billingSettings.tag_line;
          
          
          this.billheader = this.billingSettings.bill_header[0];
          this.billfooter = this.billingSettings.bill_footer[0];
          this.allData.billheader = this.billheader;
          this.allData.billfooter =this.billfooter;

          if (this.billingSettings.gst_number == '0') {
            this.showgst = false;
          } else {
            this.showgst = true;
          }

          this.billformat = this.billingSettings.bill_format;
          this.allData.billformat = this.billformat;
          if (this.billingSettings.terms_and_conditions != 0) {
            if (this.billingSettings.terms_and_conditions != "0") {
              if (this.billingSettings.terms_and_conditions != "") {
                this.allTermsAndConditions =
                  this.billingSettings.terms_and_conditions.split(";");
              }
            }
          }
            this.allData.jobdatatabel.map((bf) => {
              if (!bf.discounttype) {
                bf.discounttype = "₹";
                bf.discountvalue = "0";
              }
              var gstrate;
              if (bf.sale_gst_rate != "") {
                if (
                  !this.gstTypes.includes(
                    bf.sale_gst_rate.substring(
                      0,
                      bf.sale_gst_rate.length - 1
                    )
                  )
                ) {
                  this.gstTypes.push(
                    bf.sale_gst_rate.substring(
                      0,
                      bf.sale_gst_rate.length - 1
                    )
                  );
                }
                if (bf.sale_gst_rate != "0%") {
                  gstrate =
                    parseInt(
                      bf.sale_gst_rate.substring(
                        0,
                        bf.sale_gst_rate.length - 1
                      )
                    ) /
                      2 +
                    "%";
                } else {
                  gstrate = bf.sale_gst_rate;
                }
                
              } else {
                if (
                  !this.gstTypes.includes(
                    bf.purchase_gst_rate.substring(
                      0,
                      bf.purchase_gst_rate.length - 1
                    )
                  )
                ) {
                  this.gstTypes.push(
                    bf.purchase_gst_rate.substring(
                      0,
                      bf.purchase_gst_rate.length - 1
                    )
                  );
                }
                if (bf.purchase_gst_rate != "0%") {
                  gstrate =
                    parseInt(
                      bf.purchase_gst_rate.substring(
                        0,
                        bf.purchase_gst_rate.length - 1
                      )
                    ) /
                      2 +
                    "%";
                } else {
                  gstrate = bf.purchase_gst_rate;
                }
              }
              var gsttype;
              var ratefortax;
              var gstcgst;
              var gstratecgst;
              var gstsgst;
              var gstratesgst;
              if (bf.cgstcalculateofjob == undefined) {
                if (bf.sale_tax_type != "") {
                  gsttype = bf.sale_tax_type;
                  if (bf.discounttype == "₹") {
                    if (bf.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(bf.unit_sale_price) *
                          parseFloat(bf.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(bf.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(bf.unit_sale_price) *
                          parseFloat(bf.quantity) -
                        parseFloat(bf.discountvalue);
                    }

                    gstcgst = (
                      parseFloat(ratefortax) *
                      ((parseInt(gstrate.slice(0, -1)) * 2) / 100)
                    ).toFixed(2);
                    gstratecgst =
                      (parseFloat(gstcgst) / 2).toFixed(2) +
                      " (" +
                      gstrate +
                      " )";
                
                    gstsgst = (
                      parseFloat(ratefortax) *
                      ((parseInt(gstrate.slice(0, -1)) * 2) / 100)
                    ).toFixed(2);
                    gstratesgst =
                      (parseFloat(gstcgst) / 2).toFixed(2) +
                      " (" +
                      gstrate +
                      " )";

                  } else {
                    if (bf.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(bf.unit_sale_price) *
                          parseFloat(bf.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(bf.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(bf.unit_sale_price) *
                          parseFloat(bf.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(bf.unit_sale_price) *
                        parseFloat(bf.quantity) *
                        (parseFloat(bf.discountvalue) / 100);
                      ratefortax =
                        parseFloat(bf.unit_sale_price) *
                          parseFloat(bf.quantity) -
                        discountvalueinrpe;
                    }

                    gstcgst = (
                      parseFloat(ratefortax) *
                      ((parseInt(gstrate.slice(0, -1)) * 2) / 100)
                    ).toFixed(2);
                    gstratecgst =
                      (parseFloat(gstcgst) / 2).toFixed(2) +
                      " (" +
                      gstrate +
                      " )";

                    gstsgst = (
                        parseFloat(ratefortax) *
                        ((parseInt(gstrate.slice(0, -1)) * 2) / 100)
                      ).toFixed(2);
                    gstratesgst =
                      (parseFloat(gstcgst) / 2).toFixed(2) +
                      " (" +
                      gstrate +
                      " )";
                  }
                } else {
                  gsttype = bf.purchase_tax_type;
                  if (bf.discounttype == "₹") {
                    if (bf.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(bf.unit_sale_price) *
                          parseFloat(bf.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(bf.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(bf.unit_sale_price) *
                          parseFloat(bf.quantity) -
                        parseFloat(bf.discountvalue);
                    }
                  } else {
                    if (bf.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(bf.unit_sale_price) *
                          parseFloat(bf.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(bf.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(bf.unit_sale_price) *
                          parseFloat(bf.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(bf.unit_sale_price) *
                        parseFloat(bf.quantity) *
                        (parseFloat(bf.discountvalue) / 100);
                      ratefortax =
                        parseFloat(bf.unit_sale_price) *
                          parseFloat(bf.quantity) -
                        discountvalueinrpe;
                    }
                  }
                }
              } else {
                gstcgst =
                  parseInt(bf.cgstcalculateofjob) +
                  parseInt(bf.cgstcalculateofjob);
                gstratecgst =
                bf.cgstcalculateofjob + " (" + gstrate + " )";
                gstsgst =
                  parseInt(bf.sgstcalculateofjob) +
                  parseInt(bf.sgstcalculateofjob);
                gstratesgst =
                bf.sgstcalculateofjob + " (" + gstrate + " )";
                if (bf.sale_tax_type != "") {
                  gsttype = bf.sale_tax_type;
                  if (bf.discounttype == "₹") {
                    if (bf.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(bf.unit_sale_price) *
                          parseFloat(bf.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(bf.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(bf.unit_sale_price) *
                          parseFloat(bf.quantity) -
                        parseFloat(bf.discountvalue);
                    }
                  } else {
                    if (bf.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(bf.unit_sale_price) *
                          parseFloat(bf.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(bf.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(bf.unit_sale_price) *
                          parseFloat(bf.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(bf.unit_sale_price) *
                        parseFloat(bf.quantity) *
                        (parseFloat(bf.discountvalue) / 100);
                      ratefortax =
                        parseFloat(bf.unit_sale_price) *
                          parseFloat(bf.quantity) -
                        discountvalueinrpe;
                    }
                  }
                } else {
                  gsttype = bf.purchase_tax_type;
                  if (bf.discounttype == "₹") {
                    if (bf.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(bf.unit_sale_price) *
                          parseFloat(bf.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(bf.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(bf.unit_sale_price) *
                          parseFloat(bf.quantity) -
                        parseFloat(bf.discountvalue);
                    }
                  } else {
                    if (bf.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(bf.unit_sale_price) *
                          parseFloat(bf.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(bf.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(bf.unit_sale_price) *
                          parseFloat(bf.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(bf.unit_sale_price) *
                        parseFloat(bf.quantity) *
                        (parseFloat(bf.discountvalue) / 100);
                      ratefortax =
                        parseFloat(bf.unit_sale_price) *
                          parseFloat(bf.quantity) -
                        discountvalueinrpe;
                    }
                  }
                }
              }
              var quant;
              if (bf.unit != null) {
                quant = bf.quantity + " " + bf.unit;
              } else {
                quant = bf.quantity;
              }
              var discountvalueall;
              if (bf.discounttype == "₹") {
                discountvalueall =
                bf.discounttype + " " + bf.discountvalue;
              } else {
                discountvalueall =
                bf.discountvalue + " " + bf.discounttype;
              }
              var pricewithst;
              if (
                this.allData.gst_number == "" || this.allData.gst_number == "0"
              ) {
                pricewithst = parseFloat(bf.unit_sale_price);
              } else {
                pricewithst =
                  parseFloat(bf.unit_sale_price) + " (" + gsttype + ")";
              }
              this.partsArraySpareLube.push({
                type: bf.sale_tax_type,
                name: bf.part_name + "-" + bf.part_number,
                sale_tax_type: gsttype,
                hsn: bf.hsn_no,
                quantity: quant,
                price: pricewithst,
                gst: gstcgst,
                cgst: gstratecgst,
                sgst: gstratesgst,
                ratefortax: ratefortax.toFixed(2),
                discountvalue: discountvalueall,
                tottal: bf.amount,
                gstrate: parseInt(gstrate) + parseInt(gstrate),
                totalamount: this.getTotalAmount(bf, "1", "job"),
              });
              
            });
            this.allData.partsArraySpareLube = this.partsArraySpareLube;

            var calculateData = this.partsArraySpareLube.concat(
              this.partsArrayJobs
            );
      
            this.gstTypes.forEach((element) => {
              
              var totalGST = 0;
              if (element != "0") {
                calculateData.map((getGST) => {
                  if (getGST.gstrate.toString() == element) {
                    totalGST =
                      totalGST +
                      parseFloat(getGST.cgst) +
                      parseFloat(getGST.cgst);
                  }
                });
                this.MaingstTypes.push({
                  rate: element,
                  sgst: (totalGST / 2).toFixed(1),
                  cgst: (totalGST / 2).toFixed(1),
                  gst: totalGST,
                });
              }
            });
            this.UnitPriceSum = this.calculateresult(calculateData);
            this.taxrate = this.calculatetaxresult(calculateData);
            this.allData.MaingstTypes = [];
            this.allData.jobdatatabel.map((getGST) => { 
              this.allData.MaingstTypes.push(this.CalculateInclusiveGSTRateDiscounted(
                getGST.unit_sale_price,
                getGST.sale_gst_rate,
                getGST.sale_tax_type,
                getGST.discountvalue,
                getGST.quantity,
                getGST.discounttype
              )[0]);
            })

          
          if (WorkshopData.address != "") {
            this.address = WorkshopData.address;
            this.allData.workshop_address = this.address;
            this.allData.WorkshopDetails.push("Label: "+WorkshopData.address);
          } else {
            this.address = "none";
            this.allData.workshop_address = "none";
            this.allData.WorkshopDetails.push("none");
          }
          if (WorkshopData.pincode != 0) {
            
            this.addresspin =
              WorkshopData.city +
              " " +
              WorkshopData.state +
              " " +
              WorkshopData.pincode;
              this.allData.workshop_addresspin = this.addresspin;
              this.allData.WorkshopDetails.push("Label: "+this.addresspin);
          } else {
            
            this.allData.workshop_addresspin = this.addresspin;
            this.addresspin = WorkshopData.city + " " + WorkshopData.state;
            this.allData.WorkshopDetails.push("Label: "+this.addresspin);
          }
          this.phoneNumber = WorkshopData.workshop_mobile_number_1;
          this.allData.workshop_mobile_number_1 = WorkshopData.workshop_mobile_number_1
          this.allData.workshop_phoneNumber = this.phoneNumber;
          this.allData.WorkshopDetails.push(
            "Phone: " + WorkshopData.workshop_mobile_number_1
          );
          if (WorkshopData.workshop_mobile_number_2 != 0) {
            
            this.phoneNumber =
              WorkshopData.workshop_mobile_number_1 +
              " / " +
              WorkshopData.workshop_mobile_number_2;
              this.allData.workshop_phoneNumber = this.phoneNumber;
              this.allData.WorkshopDetails.push(
                "Phone: " +
                  WorkshopData.workshop_mobile_number_1 +
                  " / " +
                  WorkshopData.workshop_mobile_number_2
              );
          }
          if (WorkshopData.email != "") {
            this.email = WorkshopData.email;
            this.allData.workshop_email = this.email;
            this.allData.WorkshopDetails.push("Email: " + WorkshopData.email);
          } else {
            this.email = "none";
            this.allData.WorkshopDetails.push("Email: " + this.email);
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
  
    

    

    if (this.mainTitle != "Estimate") {
      if (this.allData.paid_amount + this.allData.advance == 0.0) {
        this.image = "../../../../assets/images/Unpiad.png";
      } else if (this.allData.balance_amount != 0.0) {
        if (this.allData.balance_amount == this.allData.final_amount) {
          this.image = "../../../../assets/images/Unpiad.png";
        } else {
          this.image = "../../../../assets/images/Partial Paid.png";
        }
      } else {
        this.image = "../../../../assets/images/Paid Stamp.png";
      }
    }

  
    // if (this.allData.work_note != "[]" && this.allData.work_note != "") {
    //   this.worknotes = JSON.parse(this.allData.work_note);
    // }
    if (this.allData.exitdata != "[]" && this.allData.exitdata != "") {
      this.worknotes = this.allData.exitdata;
    }
    

    if (this.allData.discounttpe == "%") {
      this.totalPayable = Number(
        Math.round(
          this.allData.JobTotal *
            ((100 - this.allData.discountamount) / 100)
        ).toFixed(2)
      );
    } else {
      this.totalPayable =
        this.allData.JobTotal - this.allData.discountamount;
    }
    if (this.allData.JobTotal) {
      this.totalPayabledis = Number(
        Math.round(
          this.allData.JobTotal *
            ((100 - this.allData.discountamount) / 100) -
            this.allData.advance
        ).toFixed(2)
      );
    } else {
      this.totalPayabledis =
        this.allData.JobTotal -
        this.allData.advance -
        this.allData.discountamount;
    }
    if (this.allData.discounttpe == "%") {
      this.Discountname = "Discount(%)";
    } else {
      this.Discountname = "Discount(₹)";
    }
    if (this.allData.discountamount != "0 %") {
      this.amountinwords = this.convertNumberToWords(this.totalPayable);
    } else {
      this.amountinwords = this.convertNumberToWords(this.allData.total_amount);
    }
    this.profiledata = JSON.parse(localStorage.getItem("user"));
    if (this.profiledata.logo != "false") {
      this.logoimage = this.profiledata.logo;
    }
    if (this.profiledata.signature != "false") {
      this.signaturephoto = this.profiledata.signature;
      this.showSigImage = true;
    } else {
      this.showSigImage = false;
    }
    
    if (this.profiledata.logo != "false") {
      this.image = this.profiledata.logo;
    } else {
      this.image = this.pdfService.imagedara;
    }
    if (this.profiledata.signature != "false") {
      this.signatureImage = this.profiledata.signature;
      this.shoSigImage = true;
    } else {
      //this.signatureImage=this.signature
      this.shoSigImage = false;
    }
  }
  // get total amount of the jobcard
  getTotalAmount(alldata, index, category) {
    if (this.billingSettings.gst_number != "") {
      if (alldata["sale_gst_rate"] != "") {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseFloat(alldata["unit_sale_price"]),
          alldata["sale_gst_rate"],
          alldata["sale_tax_type"],
          0,
          parseFloat(alldata["quantity"]),
          "%"
        );
        return totalcal[0]["totalamount"];
      } else if (alldata["purchase_gst_rate"] != "") {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseInt(alldata["unit_purchase_price"]),
          alldata["purchase_gst_rate"],
          alldata["purchase_tax_type"],
          0,
          parseFloat(alldata["quantity"]),
          "%"
        );
        return totalcal[0]["totalamount"];
      } else {
        var totalcal = this.CalculateInclusiveGSTRateDiscounted(
          parseFloat(alldata["unit_sale_price"]),
          "0",
          "Inclusive",
          0,
          parseFloat(alldata["quantity"]),
          "%"
        );
        return totalcal[0]["totalamount"];
      }
    } else {
      var totalcal = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(alldata["unit_sale_price"]),
        "0",
        "Inclusive",
        0,
        parseFloat(alldata["quantity"]),
        "%"
      );
      return totalcal[0]["totalamount"];
    }
  }
  // Calcalue the discounta dn GST and total for per inventory in jobcard
  CalculateInclusiveGSTRateDiscounted(
    price,
    rate,
    type,
    discount,
    quantity,
    discounttype
  ) {
    if (discounttype == "₹") {
      if (type == "Inclusive") {
        var taxalbeamount =
          (parseFloat(price) * parseFloat(quantity)) /
            (1 + parseInt(rate) / 100) -
          parseInt(discount);
        var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
        var CGST = GSTAmount / 2;
        var SGST = CGST;
        var totalamount = taxalbeamount + GSTAmount;
      } else {
        var taxalbeamount =
          parseFloat(price) * parseFloat(quantity) - parseInt(discount);
        var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
        var CGST = GSTAmount / 2;
        var SGST = CGST;
        var totalamount = taxalbeamount + GSTAmount;
      }
    } else {
      if (type == "Inclusive") {
        var discountamount =
          ((parseFloat(price) * parseFloat(quantity)) /
            (1 + parseInt(rate) / 100)) *
          (parseInt(discount) / 100);
        var taxalbeamount =
          (parseFloat(price) * parseFloat(quantity)) /
            (1 + parseInt(rate) / 100) -
          discountamount;
        var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
        var CGST = GSTAmount / 2;
        var SGST = CGST;
        var totalamount = taxalbeamount + GSTAmount;
      } else {
        var discountamount =
          parseFloat(price) * parseFloat(quantity) * (parseInt(discount) / 100);
        var taxalbeamount =
          parseFloat(price) * parseFloat(quantity) - discountamount;
        var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
        var CGST = GSTAmount / 2;
        var SGST = CGST;
        var totalamount = taxalbeamount + GSTAmount;
      }
    }

    var amountarr = [];
    amountarr.push({
      GSTAmount: GSTAmount.toFixed(2),
      CGST: CGST.toFixed(2),
      SGST: SGST.toFixed(2),
      totalamount: totalamount.toFixed(2),
      type: type,
      Rate: parseInt(rate) 
    });
    return amountarr;
  }
  // Calclauet the result
  calculateresult(object) {
    const sum = object.reduce((a, { price }) => a + parseInt(price), 0);
    return sum;
  }
  // Calculate the tax amount
  calculatetaxresult(object) {
    const sum = object.reduce(
      (a, { ratefortax }) => a + parseFloat(ratefortax),
      0
    );
    return sum.toFixed(2);
  }
  // cloase the popup
  closePopup() {
    this.dialogRef.close(true);
  }
  // Get the pDF
  pdf() {
    var name;
    var documentDefinition;
    name = this.allData.poNumberdata + ".pdf";
    documentDefinition = this.makepdf();

    //pdfMake.createPdf(documentDefinition).open();

    pdfMake.createPdf(documentDefinition).download(name);
  }
  // Print the invoice or estimate
  print() {
    var documentDefinition;
    documentDefinition = this.makepdf();
    pdfMake.createPdf(documentDefinition).print();
  }
  // Shre the invoice or estimate via email
  share() {
    var documentDefinition;
    var name;
    name = this.allData.poNumberdata + ".pdf";
    
    var useremail;
    if (
      this.allData.supplierDetails.email != "" &&
      this.allData.supplierDetails.email != null
    ) {
      useremail = this.allData.supplierDetails.email;
    } else {
      useremail = "noemail";
    }
    this.dialogservice.OpenEmailSend(useremail).subscribe((email) => {
      if (email != "noemail") {
        documentDefinition = this.makepdf();
        pdfMake.createPdf(documentDefinition).getBase64((dataUrl) => {
          var pdfFile = dataUrl;
          var binary = atob(pdfFile.replace(/\s/g, ""));
          var len = pdfFile.length;
          var buffer = new ArrayBuffer(len);
          var view = new Uint8Array(buffer);
          for (var i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
          }
          var fileBlob = new Blob([view], { type: "application/pdf" });

          var workshopname = this.userService.getData()["workshop_name"];
          var bodyMessage;
          var subject;
          var mobile;
          subject = "New Order Received from "+this.allData.workshopName;
            bodyMessage =
              "<p> Dear Customer, </p>\n\n <p>New Order Received from" +
              " <b>" + this.allData.workshopName +".\n"+
              "Mobile Number:"+ this.allData.workshop_phoneNumber +".\n"+
              "Purchase Order Number: "+this.allData.poNumberdata +
              "<p>Check the attached file for Order Details</p>" +
              "\r\n" + "or check order here " + "\r\n" +
              window.location.protocol+"//"+window.location.host+"/orders?id="+this.allData.counternumber+"&workshop_id="+this.userService.getData()["workshop_id"]+"&po_status="+this.allData.po_status +
              "\r\n\r\n" +
              "<p>Click to chat with the Workshop:\n\n\n\n https://wa.me/91"+ this.allData.workshop_mobile_number_1+"</p>\n\n" +
              "</p>\n\n<p>" +
              this.allData.workshopName +
              "</p>";

          this.general
            .sendEmail(
              this.userService.getData()["workshop_id"],
              bodyMessage,
              subject,
              workshopname,
              email,
              fileBlob,
              name
            )
            .subscribe(
              (sent) => {
                this.showspinner.setSpinner(true);
                this.snakBar.open("Message", ErrorMessgae[0][sent["message"]], {
                  duration: 4000,
                });
                this.showspinner.setSpinner(false);
                this.snakBar.open("Message", ErrorMessgae[0][sent["message"]], {
                  duration: 4000,
                });
              },
              (err) => {
                console.log(err);
                this.showspinner.setSpinner(false);
                this.snakBar.open("Error", err, {
                  duration: 4000,
                });
              }
            );
        });
      }
    });
  }
  // Share the invoice or estimate details on whatsapp
  sharewhatsApp() {
    var whatsappMessage;
    var inventorydata = "";
    var count = 0;
    var sparecount = 0;
    var lubecount = 0;
    var jobcount = 0;
    if (this.partsArraySpareLube.length != 0) {
      this.partsArraySpareLube.map((data, index) => {
        var newdata = "";
        count = index + 1;
        newdata = "\r\n" + count + ". " + data.name + " Qt." + data.quantity;
          inventorydata += newdata;
      });
    }
      whatsappMessage =
        "*New Order Placed from* " +
        this.workshopName +
        "\r\n\n*Mobile Number: " +
        this.allData.workshop_phoneNumber+"*" +
        "\r\n" +
        "Purchase Order Number: " +
        "*"+this.allData.poNumberdata+"*" +
        "\r\n\n" +
        "*Order Details:*" +
        inventorydata +
        "\r\n" + "check order here " + "\r\n" +
        window.location.protocol+"//"+window.location.host+"/orders?id="+this.allData.counternumber+"&workshop_id="+this.userService.getData()["workshop_id"]+"&po_status="+this.allData.po_status +
        "\r\n\r\n" +
        "Waiting for the confirmation.";

    // var whatsappMessage= "Hello!"+"\r\n\r\n"+"I found your garage online and I have a few questions regarding online services. Are you free to chat now?"
    whatsappMessage = encodeURIComponent(whatsappMessage);
    // this.contactlink =
    //   "https://wa.me/+91" +
    //   this.allData.supplierDetails.mobileOneNo+
    //   "?text=" +
    //   whatsappMessage;
    this.contactlink = "https://web.whatsapp.com/send?phone=91"+
    this.allCustomerDetails.customer_mobile+"&text=" + whatsappMessage;
  }
  // Convert the amount in number of words
  convertNumberToWords(value) {
    var fraction = Math.round(this.frac(value) * 100);
    var f_text = "";

    if (fraction > 0) {
      f_text = "and " + this.convert_number(fraction) + " Paise";
    }
    return this.convert_number(value) + f_text + " Rupees Only";
  }
  frac(f) {
    return f % 1;
  }
  convert_number(number) {
    if (number < 0 || number > 999999999) {
      return "NUMBER OUT OF RANGE!";
    }
    var Gn = Math.floor(number / 10000000); /* Crore */
    number -= Gn * 10000000;
    var kn = Math.floor(number / 100000); /* lakhs */
    number -= kn * 100000;
    var Hn = Math.floor(number / 1000); /* thousand */
    number -= Hn * 1000;
    var Dn = Math.floor(number / 100); /* Tens (deca) */
    number = number % 100; /* Ones */
    var tn = Math.floor(number / 10);
    var one = Math.floor(number % 10);
    var res = "";

    if (Gn > 0) {
      res += this.convert_number(Gn) + " Crore";
    }
    if (kn > 0) {
      res += (res == "" ? "" : " ") + this.convert_number(kn) + " Lakh";
    }
    if (Hn > 0) {
      res += (res == "" ? "" : " ") + this.convert_number(Hn) + " Thousand";
    }
    if (Dn) {
      res += (res == "" ? "" : " ") + this.convert_number(Dn) + " Hundred";
    }
    var ones = Array(
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen"
    );
    var tens = Array(
      "",
      "",
      "Twenty",
      "Thirty",
      "Fourty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety"
    );

    if (tn > 0 || one > 0) {
      if (!(res == "")) {
        res += " and ";
      }
      if (tn < 2) {
        res += ones[tn * 10 + one];
      } else {
        res += tens[tn];
        if (one > 0) {
          res += "-" + ones[one];
        }
      }
    }
    if (res == "") {
      res = "zero";
    }
    return res;
  }




  // PDF-Make Part added here for PO

  makepdf(){
    return {
      watermark: {
        text: "",
        color: "#E3E3E3",
        opacity: 0.3,
        bold: true,
        italics: false,
      },
      content: [
        { text: this.mainTitle, style: "titlehead", alignment: "center" },
        {
          columns: [
            {
              image: "building",
              width: 80,
            },
            this.getWorkshopDetails(),
          ],
        },
        { text: "", style: "header", alignment: "center" },
        {
          style: "tableExample",
          table: {
            widths: [250, 250],
            headerRows: 1,
            // dontBreakRows: true,
            // keepWithHeaderRows: 1,
            body: [
              [
                { text: "Order To", style: "tableHeader"},
                { text: "Purchase Order", style: "tableHeader", alignment: "right"},
              ],
              [
                this.getOrderDetails(),
                this.getPurchaseDetails(),
              ],
            ],
          },
        },
         this.getInventoryDataforNongst(),
         this.getTaxDetails(),
         this.getSignature(),
      ],
      styles: {
        header: {
          fontSize: 13,
          fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
          bold: true,
          margin: [0, 0, 0, 10],
        },
        titlehead: {
          fontSize: 12,
          fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
          bold: true,
          margin: [0, 0, 0, 0],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
        tableHeader: {
          fillColor: "#b6cdef",
          fontSize: 8,
          fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
          bold: true,
        },
        jobTitle: {
          fontSize: 8,
          fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
          bold: true,
          italics: true,
        },
        tabelData: {
          fontSize: 8,
          fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
        },
        imagesstyle: {
          marginLeft: 318,
          width: 87,
          marginTop: -86,
        },
        imagesstyletwo: {
          marginRight: 306,
          width: 87,
          marginBottom: 0,
        },
      },
      defaultStyle: {
        // alignment: 'justify'
      },
      images: {
        building: this.image,
      },
      pageSize: "A4",
    };
  }



  // Get Workshop detals
  getWorkshopDetails() {
    const workDetails = [];
    var deatislArray = [];
    this.allData.WorkshopDetails.forEach((data) => {
      var detailData;
      if (data.includes("Name:")) {
        detailData = {
          text: data.split(":")[1],
          style: "header",
          color: "#663399",
          alignment: "right",
        };
      } else if (data.includes("Label:")) {
        detailData = {
          text: data.split(":")[1],
          style: "tabelData",
          color: "#1ab394",
          alignment: "right",
        };
      } else if (data.includes("GSTN: ")) {
        detailData = {
          text: data,
          fontFamily: "Poppins-Regular",
          fontSize: 8,
          alignment: "right",
        };
      } else if (data.includes("Email: ")) {
        detailData = {
          text: data,
          style: "tabelData",
          alignment: "right",
        };
      } else {
        detailData = {
          text: data,
          style: "tabelData",
          alignment: "right",
        };
      }
      workDetails.push(detailData);
    });
    return {
      columns: [workDetails],
    };
  }
  getOrderDetails(){
    const workDetails = [];
    var deatislArray = [];
    this.allData.WorkshopDetails.forEach((data) => {
      var detailData;
      if (data.includes("Name:")) {
        detailData = {
          text: data.split(":")[1],
          style: "tabelData",
          alignment: "left",
        };
      } else if (data.includes("Label:")) {
        detailData = {
          text: data.split(":")[1],
          style: "tabelData",
          alignment: "left",
        };
      } else if (data.includes("GSTN: ")) {
        detailData = {
          text: data,
          style: "tabelData",
          alignment: "left",
        };
      } else if (data.includes("Email: ")) {
        detailData = {
          text: data,
          style: "tabelData",
          alignment: "left",
        };
      } else {
        detailData = {
          text: data,
          style: "tabelData",
          alignment: "left",
        };
      }
      workDetails.push(detailData);
    });
    return {
      columns: [workDetails],
    };
  }
  
  getInventoryDataforNongst(){
    var secondRow = [];
    var partslubessparesarr = Array();
    var partnames;
    partnames = "Parts Name";
  
    var coloum = [
      { text: "#", style: "tableHeader" },
      { text: partnames, style: "tableHeader" },
      { text: "HSN/SAC", style: "tableHeader" },
      { text: "Qty", style: "tableHeader" },
      { text: "Unit Price(Rs.)", style: "tableHeader" },
      { text: "Discount", style: "tableHeader" },
      { text: "Toxable Amount(Rs.)", style: "tableHeader" },
      { text: "CGST", style: "tableHeader" },
      { text: "SGST", style: "tableHeader" },
      { text: "Amount(Rs.)", style: "tableHeader" },
    ];
    partslubessparesarr.push(coloum);
      this.allData.partsArraySpareLube.map((data, index) => {
       
          secondRow.push(
            {
              text: index + 1,
              style: "tabelData",
              alignment: "left",
            },
            {
              text: data.name,
              style: "tabelData",
              alignment: "left",
            },
            {
              text: data.hsn || 'none',
              style: "tabelData",
              alignment: "left",
            },
            {
              text: data.quantity,
              style: "tabelData",
              alignment: "left",
            },
            {
              text: data.price,
              style: "tabelData",
              alignment: "left",
            },
            {
              text: data.discountvalue,
              style: "tabelData",
              alignment: "left",
            },
            {
              text: data.ratefortax,
              style: "tabelData",
              alignment: "left",
            },
            {
              text: data.cgst,
              style: "tabelData",
              alignment: "left",
            },
            {
              text: data.sgst,
              style: "tabelData",
              alignment: "left",
            },
            {
              text: data.tottal,
              style: "tabelData",
              alignment: "left",
            }
          );
        partslubessparesarr.push(secondRow);
        secondRow = [];
        
      });
      var finalamount = [
      { text: "", alignment: "left", bold: true },
      { text: "Total(Rs.)", style: "tabelData", alignment: "left", bold: true },
      { text: "", alignment: "left", bold: true },
      { text: "", alignment: "left", bold: true },
      { text: "", alignment: "left", bold: true },
      { text: "", alignment: "left", bold: true },
      { text: this.taxrate, style: "tabelData", alignment: "left", bold: true },
      { text: "", style: "tabelData", alignment: "left", bold: true },
      { text: "", alignment: "left", bold: true },
      {
        text: this.allData.JobTotal,
        style: "tabelData",
        alignment: "left",
        bold: true,
      },
      ];
      partslubessparesarr.push(finalamount);
    
      return {
        style: "tableExample",
        table: {
          widths: [15, 140, 30, 30, 36, 35, 48, 30, 30,35],
          headerRows: 1,
          body: partslubessparesarr,
        },
      };
  }
  getPurchaseDetails(){
    const workDetails = [];
    
    workDetails.push({
      text: "PO Number:" +this.allData.poNumberdata,
      style: "tabelData",
      alignment: "right",
    });
    workDetails.push({
      text: "Date:" +this.allData.poDateValue,
      style: "tabelData",
      alignment: "right",
    });
    workDetails.push({
      text: "Status:" +this.allData.poStatus,
      style: "tabelData",
      alignment: "right",
    });
    return {
      columns: [workDetails],
    };
  }
  // Get Terms  and conditios of NON GST BILL
  getTaxDetails() {
      
      return {
        style: "tableExample",
        table: {
          widths: [354, 150],
          body: [
            [
              {
                border: [true, true, true, true],
                text: "Tax Details:",
                style: "tableHeader",
              },
              {
                border: [true, true, true, true],
                text: "Amount Details",
                style: "tableHeader",
              },
            ],
            [
              this.getGSTDetails(),
              {
                border: [true, true, true, true],
                table: {
                      widths: [65, 65],
                      body: [
                        [
                          {
                            border: [false, false, false, false],
                            text: "Total:",
                            style: "tabelData",
                          },
                          {
                            border: [true, false, false, false],
                            text: this.allData.JobTotal,
                            style: "tabelData",
                          },
                        ],
                        [
                          {
                            border: [false, true, false, false],
                            text: "   ",
                            style: "tabelData",
                          },
                          {
                            border: [true, true, false, false],
                            text: "    ",
                            style: "tabelData",
                          },
                        ],
                        [
                          {
                            border: [false, true, false, false],
                            text: "Balance:",
                            style: "tabelData",
                          },
                          {
                            border: [true, true, false, false],
                            text: this.allData.JobTotal,
                            style: "tabelData",
                          },
                        ]
                      ]
                    }
              },
            ],
          ],
        },
        layout: {
          defaultBorder: false,
        },
      };

  } 
  
  getGSTDetails(){
    const columnOne = [];
    const columnTwo = [];
    const columnThree = [];

    this.allData.MaingstTypes.forEach((data) => { 
      columnOne.push({
        text: "CGST@"+ data.Rate / 2 +"%:"+ this.currency_symbol + data.CGST,
        style: "tabelData",
      });
    })
    this.allData.MaingstTypes.forEach((data) => { 
      columnTwo.push({
        text: "SGST@"+ data.Rate / 2 +"%:"+ this.currency_symbol + data.SGST,
        style: "tabelData",
      });
    })
    this.allData.MaingstTypes.forEach((data) => { 
      columnThree.push({
        text: "GST@"+ data.Rate / 2 +"%:"+ this.currency_symbol + data.GSTAmount,
        style: "tabelData",
      });
    })
    
    return {
      border: [true, true, true, true],
      columns: [columnOne,columnTwo,columnThree],
    };
  }
  getSignature() {
      
    return {
      style: "tableExample",
      table: {
        widths: [354, 150],
        body: [
          [
            {
              border: [true, true, true, true],
              text: "Amount In Words:",
              style: "tableHeader",
            },
            {
              border: [true, true, true, true],
              text: "Authorized Signature",
              style: "tableHeader",
            },
          ],
          [
            {
              border: [true, true, true, true],
              style: "tabelData",
              text: this.amountinwords,
              alignment: "left",
              bold: true,
            },
            {
              border: [true, true, true, true],
              text: this.workshopName,
              style: "tabelData",
              alignment: "left",
            }
          ],
        ],
      },
      layout: {
        defaultBorder: false,
      },
    };

  }
  
  b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const parts = b64Data.split(';base64,');
    const byteCharacters = atob(decodeURIComponent(parts[1]));
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
    
  }
  
   blobToBase64 = blob => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise(resolve => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  };

  }
