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
import * as defaultImage from "../../../shared/static.images.json"
@Component({
  selector: "invoice-estimate",
  templateUrl: "./invoice-estimate.component.html",
  styleUrls: ["./invoice-estimate.component.css"],
})
/**
 * In this file is used
 * to genarte the invoices
 * estimate of jocard
 * user can send, share, downlaod
 * and print invoice or jobacrd
 */
export class InvoiceEstimateComponent implements OnInit {
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
  DefaultLogo;
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
    public dialogRef: MatDialogRef<InvoiceEstimateComponent>
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
    this.general
      .getJobcardSettings(this.userService.getData()["workshop_id"])
      .subscribe(
        (settingsData) => {
          this.showspinner.setSpinner(true);
          this.jocardSettings = JSON.parse(
            settingsData.jobcard_Settings.settings_jobcard
          )[0];
          this.billingSettings = JSON.parse(
            settingsData.jobcard_Settings.settings_billing
          )[0];
          this.billheader = this.billingSettings.bill_header[0];
          this.billfooter = this.billingSettings.bill_footer[0];
          if (this.billingSettings.gst_number == "") {
            this.showgst = false;
          } else {
            this.showgst = true;
          }
          if (
            JSON.parse(this.allData.settings_data_json).length != 0 &&
            JSON.parse(this.allData.settings_data_json).length != undefined
          ) {
            if (
              !JSON.parse(this.allData.settings_data_json).item_wise_discount
            ) {
              var settingdata = JSON.parse(this.allData.settings_data_json);
              settingdata.item_wise_discount = "0";
              this.allData.settings_data_json = JSON.stringify(settingdata);
            }

            if (
              JSON.parse(this.allData.settings_data_json)[0].gst_number != ""
            ) {
              this.showgst = true;
              this.gstno = JSON.parse(
                this.allData.settings_data_json
              )[0].gst_number;
              if (this.mainTitle != "Estimate") {
                this.mainTitle = this.mainTitle;
                this.WordsTabelName = "Invoice Amount In Words";
              }
            } else {
              this.showgst = false;
              this.gstno = "";
            }
          } else {
            if (
              !JSON.parse(this.allData.settings_data_json).item_wise_discount
            ) {
              var settingdata = JSON.parse(this.allData.settings_data_json);
              settingdata.item_wise_discount = "0";
              this.allData.settings_data_json = JSON.stringify(settingdata);
            }
            if (JSON.parse(this.allData.settings_data_json).gst_number != "") {
              this.showgst = true;
              this.gstno = JSON.parse(
                this.allData.settings_data_json
              ).gst_number;
              if (this.mainTitle != "Estimate") {
                this.mainTitle = this.mainTitle;
                this.WordsTabelName = "Invoice Amount In Words";
              }
            } else {
              this.showgst = false;
              this.gstno = "";
            }
          }

          this.billformat = this.billingSettings.bill_format;

          if (this.billingSettings.terms_and_conditions != 0) {
            if (this.billingSettings.terms_and_conditions != "0") {
              if (this.billingSettings.terms_and_conditions != "") {
                this.allTermsAndConditions =
                  this.billingSettings.terms_and_conditions.split(";");
              }
            }
          }

          if (this.billformat == "Parts") {
            JSON.parse(this.allData.jobcard_lubes_items).map((lubedata) => {
              if (!lubedata.discounttype) {
                lubedata.discounttype = "₹";
                lubedata.discountvalue = "0";
              }

              var gstrate;

              if (lubedata.sale_gst_rate != "") {
                if (
                  !this.gstTypes.includes(
                    lubedata.sale_gst_rate.substring(
                      0,
                      lubedata.sale_gst_rate.length - 1
                    )
                  )
                ) {
                  this.gstTypes.push(
                    lubedata.sale_gst_rate.substring(
                      0,
                      lubedata.sale_gst_rate.length - 1
                    )
                  );
                }
                if (lubedata.sale_gst_rate != "0%") {
                  gstrate =
                    parseInt(
                      lubedata.sale_gst_rate.substring(
                        0,
                        lubedata.sale_gst_rate.length - 1
                      )
                    ) /
                      2 +
                    "%";
                } else {
                  gstrate = lubedata.sale_gst_rate;
                }
              } else {
                if (
                  !this.gstTypes.includes(
                    lubedata.purchase_gst_rate.substring(
                      0,
                      lubedata.purchase_gst_rate.length - 1
                    )
                  )
                ) {
                  this.gstTypes.push(
                    lubedata.purchase_gst_rate.substring(
                      0,
                      lubedata.purchase_gst_rate.length - 1
                    )
                  );
                }
                if (lubedata.purchase_gst_rate != "0%") {
                  gstrate =
                    parseInt(
                      lubedata.purchase_gst_rate.substring(
                        0,
                        lubedata.purchase_gst_rate.length - 1
                      )
                    ) /
                      2 +
                    "%";
                } else {
                  gstrate = lubedata.purchase_gst_rate;
                }
              }
              var gsttype;
              var ratefortax;
              var gstcgst;
              var gstratecgst;
              if (lubedata.cgstcalculateoflube == undefined) {
                if (lubedata.sale_tax_type != "") {
                  gsttype = lubedata.sale_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
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
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
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
                  }
                } else {
                  gsttype = lubedata.purchase_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                }
              } else {
                gstcgst =
                  parseInt(lubedata.cgstcalculateoflube) +
                  parseInt(lubedata.cgstcalculateoflube);
                gstratecgst =
                  lubedata.cgstcalculateoflube + " (" + gstrate + " )";
                if (lubedata.sale_tax_type != "") {
                  gsttype = lubedata.sale_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                } else {
                  gsttype = lubedata.purchase_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                }
              }
              var quant;
              if (lubedata.unit != null) {
                quant = lubedata.quantity + " " + lubedata.unit;
              } else {
                quant = lubedata.quantity;
              }
              var discountvalueall;
              if (lubedata.discounttype == "₹") {
                discountvalueall =
                  lubedata.discounttype + " " + lubedata.discountvalue;
              } else {
                discountvalueall =
                  lubedata.discountvalue + " " + lubedata.discounttype;
              }
              var pricewithst;
              if (
                JSON.parse(this.allData.settings_data_json).gst_number == ""
              ) {
                pricewithst = parseFloat(lubedata.unit_sale_price);
              } else {
                pricewithst =
                  parseFloat(lubedata.unit_sale_price) + " (" + gsttype + ")";
              }
              this.partsArraySpareLube.push({
                type: "lube",
                name: lubedata.part_name,
                sale_tax_type: gsttype,
                hsn: lubedata.hsn_no,
                quantity: quant,
                price: pricewithst,
                gst: gstcgst,
                cgst: gstratecgst,
                ratefortax: ratefortax.toFixed(2),
                discountvalue: discountvalueall,
                tottal: lubedata.amount,
                gstrate: parseInt(gstrate) + parseInt(gstrate),
                totalamount: this.getTotalAmount(lubedata, "1", "job"),
              });
            });
            JSON.parse(this.allData.jobcard_spare_items).map((lubedata) => {
              if (!lubedata.discounttype) {
                lubedata.discounttype = "₹";
                lubedata.discountvalue = "0";
              }
              var gstrate;
              if (lubedata.sale_gst_rate != "") {
                if (
                  !this.gstTypes.includes(
                    lubedata.sale_gst_rate.substring(
                      0,
                      lubedata.sale_gst_rate.length - 1
                    )
                  )
                ) {
                  this.gstTypes.push(
                    lubedata.sale_gst_rate.substring(
                      0,
                      lubedata.sale_gst_rate.length - 1
                    )
                  );
                }
                if (lubedata.sale_gst_rate != "0%") {
                  gstrate =
                    parseInt(
                      lubedata.sale_gst_rate.substring(
                        0,
                        lubedata.sale_gst_rate.length - 1
                      )
                    ) /
                      2 +
                    "%";
                } else {
                  gstrate = lubedata.sale_gst_rate;
                }
              } else {
                if (
                  !this.gstTypes.includes(
                    lubedata.purchase_gst_rate.substring(
                      0,
                      lubedata.purchase_gst_rate.length - 1
                    )
                  )
                ) {
                  this.gstTypes.push(
                    lubedata.purchase_gst_rate.substring(
                      0,
                      lubedata.purchase_gst_rate.length - 1
                    )
                  );
                }
                if (lubedata.purchase_gst_rate != "0%") {
                  gstrate =
                    parseInt(
                      lubedata.purchase_gst_rate.substring(
                        0,
                        lubedata.purchase_gst_rate.length - 1
                      )
                    ) /
                      2 +
                    "%";
                } else {
                  gstrate = lubedata.purchase_gst_rate;
                }
              }
              var gsttype;
              var ratefortax;
              var gstcgst;
              var gstratecgst;
              if (lubedata.cgstcalculateoflube == undefined) {
                if (lubedata.sale_tax_type != "") {
                  gsttype = lubedata.sale_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
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
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
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
                  }
                } else {
                  gsttype = lubedata.purchase_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                }
              } else {
                gstcgst =
                  parseInt(lubedata.cgstcalculateoflube) +
                  parseInt(lubedata.cgstcalculateoflube);
                gstratecgst =
                  lubedata.cgstcalculateoflube + " (" + gstrate + " )";
                if (lubedata.sale_tax_type != "") {
                  gsttype = lubedata.sale_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                } else {
                  gsttype = lubedata.purchase_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                }
              }
              var quant;
              if (lubedata.unit != null) {
                quant = lubedata.quantity + " " + lubedata.unit;
              } else {
                quant = lubedata.quantity;
              }
              var discountvalueall;
              if (lubedata.discounttype == "₹") {
                discountvalueall =
                  lubedata.discounttype + " " + lubedata.discountvalue;
              } else {
                discountvalueall =
                  lubedata.discountvalue + " " + lubedata.discounttype;
              }
              var pricewithst;
              if (
                JSON.parse(this.allData.settings_data_json).gst_number == ""
              ) {
                pricewithst = parseFloat(lubedata.unit_sale_price);
              } else {
                pricewithst =
                  parseFloat(lubedata.unit_sale_price) + " (" + gsttype + ")";
              }
              this.partsArraySpareLube.push({
                type: "spare",
                name: lubedata.part_name,
                sale_tax_type: gsttype,
                hsn: lubedata.hsn_no,
                quantity: quant,
                price: pricewithst,
                gst: gstcgst,
                cgst: gstratecgst,
                ratefortax: ratefortax.toFixed(2),
                discountvalue: discountvalueall,
                tottal: lubedata.amount,
                gstrate: parseInt(gstrate) + parseInt(gstrate),
                totalamount: this.getTotalAmount(lubedata, "1", "job"),
              });
            });
            JSON.parse(this.allData.jobcard_job_items).map((lubedata) => {
              if (!lubedata.discounttype) {
                lubedata.discounttype = "₹";
                lubedata.discountvalue = "0";
              }
              var gstrate;
              if (lubedata.sale_gst_rate != "") {
                if (
                  !this.gstTypes.includes(
                    lubedata.sale_gst_rate.substring(
                      0,
                      lubedata.sale_gst_rate.length - 1
                    )
                  )
                ) {
                  this.gstTypes.push(
                    lubedata.sale_gst_rate.substring(
                      0,
                      lubedata.sale_gst_rate.length - 1
                    )
                  );
                }
                if (lubedata.sale_gst_rate != "0%") {
                  gstrate =
                    parseInt(
                      lubedata.sale_gst_rate.substring(
                        0,
                        lubedata.sale_gst_rate.length - 1
                      )
                    ) /
                      2 +
                    "%";
                } else {
                  gstrate = lubedata.sale_gst_rate;
                }
              } else {
                if (
                  !this.gstTypes.includes(
                    lubedata.purchase_gst_rate.substring(
                      0,
                      lubedata.purchase_gst_rate.length - 1
                    )
                  )
                ) {
                  this.gstTypes.push(
                    lubedata.purchase_gst_rate.substring(
                      0,
                      lubedata.purchase_gst_rate.length - 1
                    )
                  );
                }
                if (lubedata.purchase_gst_rate != "0%") {
                  gstrate =
                    parseInt(
                      lubedata.purchase_gst_rate.substring(
                        0,
                        lubedata.purchase_gst_rate.length - 1
                      )
                    ) /
                      2 +
                    "%";
                } else {
                  gstrate = lubedata.purchase_gst_rate;
                }
              }
              var gsttype;
              var ratefortax;
              var gstcgst;
              var gstratecgst;
              if (lubedata.cgstcalculateoflube == undefined) {
                if (lubedata.sale_tax_type != "") {
                  gsttype = lubedata.sale_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
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
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
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
                  }
                } else {
                  gsttype = lubedata.purchase_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                }
              } else {
                gstcgst =
                  parseInt(lubedata.cgstcalculateoflube) +
                  parseInt(lubedata.cgstcalculateoflube);
                gstratecgst =
                  lubedata.cgstcalculateoflube + " (" + gstrate + " )";
                if (lubedata.sale_tax_type != "") {
                  gsttype = lubedata.sale_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                } else {
                  gsttype = lubedata.purchase_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                }
              }
              var quant;
              if (lubedata.unit != null) {
                quant = lubedata.quantity + " " + lubedata.unit;
              } else {
                quant = lubedata.quantity;
              }
              var discountvalueall;
              if (lubedata.discounttype == "₹") {
                discountvalueall =
                  lubedata.discounttype + " " + lubedata.discountvalue;
              } else {
                discountvalueall =
                  lubedata.discountvalue + " " + lubedata.discounttype;
              }
              var pricewithst;
              if (
                JSON.parse(this.allData.settings_data_json).gst_number == ""
              ) {
                pricewithst = parseFloat(lubedata.unit_sale_price);
              } else {
                pricewithst =
                  parseFloat(lubedata.unit_sale_price) + " (" + gsttype + ")";
              }
              this.partsArrayJobs.push({
                type: "job",
                name: lubedata.part_name,
                sale_tax_type: gsttype,
                hsn: lubedata.hsn_no,
                quantity: quant,
                price: pricewithst,
                gst: gstcgst,
                cgst: gstratecgst,
                ratefortax: ratefortax.toFixed(2),
                discountvalue: discountvalueall,
                tottal: lubedata.amount,
                gstrate: parseInt(gstrate) + parseInt(gstrate),
                totalamount: this.getTotalAmount(lubedata, "1", "job"),
              });
            });
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
                  else if (getGST.gstrate.toString() == "4") {
                    getGST.gstrate = 5;
                    totalGST =
                      totalGST + parseFloat(getGST.cgst) + parseFloat(getGST.cgst);
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
          } else if (this.billformat == "PartsandPartnumber") {
            JSON.parse(this.allData.jobcard_lubes_items).map((lubedata) => {
              if (!lubedata.discounttype) {
                lubedata.discounttype = "₹";
                lubedata.discountvalue = "0";
              }

              var gstrate;

              if (lubedata.sale_gst_rate != "") {
                if (
                  !this.gstTypes.includes(
                    lubedata.sale_gst_rate.substring(
                      0,
                      lubedata.sale_gst_rate.length - 1
                    )
                  )
                ) {
                  this.gstTypes.push(
                    lubedata.sale_gst_rate.substring(
                      0,
                      lubedata.sale_gst_rate.length - 1
                    )
                  );
                }
                if (lubedata.sale_gst_rate != "0%") {
                  gstrate =
                    parseInt(
                      lubedata.sale_gst_rate.substring(
                        0,
                        lubedata.sale_gst_rate.length - 1
                      )
                    ) /
                      2 +
                    "%";
                } else {
                  gstrate = lubedata.sale_gst_rate;
                }
              } else {
                if (
                  !this.gstTypes.includes(
                    lubedata.purchase_gst_rate.substring(
                      0,
                      lubedata.purchase_gst_rate.length - 1
                    )
                  )
                ) {
                  this.gstTypes.push(
                    lubedata.purchase_gst_rate.substring(
                      0,
                      lubedata.purchase_gst_rate.length - 1
                    )
                  );
                }
                if (lubedata.purchase_gst_rate != "0%") {
                  gstrate =
                    parseInt(
                      lubedata.purchase_gst_rate.substring(
                        0,
                        lubedata.purchase_gst_rate.length - 1
                      )
                    ) /
                      2 +
                    "%";
                } else {
                  gstrate = lubedata.purchase_gst_rate;
                }
              }
              var gsttype;
              var ratefortax;
              var gstcgst;
              var gstratecgst;
              if (lubedata.cgstcalculateoflube == undefined) {
                if (lubedata.sale_tax_type != "") {
                  gsttype = lubedata.sale_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
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
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
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
                  }
                } else {
                  gsttype = lubedata.purchase_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                }
              } else {
                gstcgst =
                  parseInt(lubedata.cgstcalculateoflube) +
                  parseInt(lubedata.cgstcalculateoflube);
                gstratecgst =
                  lubedata.cgstcalculateoflube + " (" + gstrate + " )";
                if (lubedata.sale_tax_type != "") {
                  gsttype = lubedata.sale_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                } else {
                  gsttype = lubedata.purchase_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                }
              }
              var quant;
              if (lubedata.unit != null) {
                quant = lubedata.quantity + " " + lubedata.unit;
              } else {
                quant = lubedata.quantity;
              }
              var discountvalueall;
              if (lubedata.discounttype == "₹") {
                discountvalueall =
                  lubedata.discounttype + " " + lubedata.discountvalue;
              } else {
                discountvalueall =
                  lubedata.discountvalue + " " + lubedata.discounttype;
              }
              var pricewithst;
              if (
                JSON.parse(this.allData.settings_data_json).gst_number == ""
              ) {
                pricewithst = parseFloat(lubedata.unit_sale_price);
              } else {
                pricewithst =
                  parseFloat(lubedata.unit_sale_price) + " (" + gsttype + ")";
              }
              this.partsArraySpareLube.push({
                type: "lube",
                name: lubedata.part_name + "-" + lubedata.part_number,
                sale_tax_type: gsttype,
                hsn: lubedata.hsn_no,
                quantity: quant,
                price: pricewithst,
                gst: gstcgst,
                cgst: gstratecgst,
                ratefortax: ratefortax.toFixed(2),
                discountvalue: discountvalueall,
                tottal: lubedata.amount,
                gstrate: parseInt(gstrate) + parseInt(gstrate),
                totalamount: this.getTotalAmount(lubedata, "1", "job"),
              });
            });
            JSON.parse(this.allData.jobcard_spare_items).map((lubedata) => {
              if (!lubedata.discounttype) {
                lubedata.discounttype = "₹";
                lubedata.discountvalue = "0";
              }
              var gstrate;
              if (lubedata.sale_gst_rate != "") {
                if (
                  !this.gstTypes.includes(
                    lubedata.sale_gst_rate.substring(
                      0,
                      lubedata.sale_gst_rate.length - 1
                    )
                  )
                ) {
                  this.gstTypes.push(
                    lubedata.sale_gst_rate.substring(
                      0,
                      lubedata.sale_gst_rate.length - 1
                    )
                  );
                }
                if (lubedata.sale_gst_rate != "0%") {
                  gstrate =
                    parseInt(
                      lubedata.sale_gst_rate.substring(
                        0,
                        lubedata.sale_gst_rate.length - 1
                      )
                    ) /
                      2 +
                    "%";
                } else {
                  gstrate = lubedata.sale_gst_rate;
                }
              } else {
                if (
                  !this.gstTypes.includes(
                    lubedata.purchase_gst_rate.substring(
                      0,
                      lubedata.purchase_gst_rate.length - 1
                    )
                  )
                ) {
                  this.gstTypes.push(
                    lubedata.purchase_gst_rate.substring(
                      0,
                      lubedata.purchase_gst_rate.length - 1
                    )
                  );
                }
                if (lubedata.purchase_gst_rate != "0%") {
                  gstrate =
                    parseInt(
                      lubedata.purchase_gst_rate.substring(
                        0,
                        lubedata.purchase_gst_rate.length - 1
                      )
                    ) /
                      2 +
                    "%";
                } else {
                  gstrate = lubedata.purchase_gst_rate;
                }
              }
              var gsttype;
              var ratefortax;
              var gstcgst;
              var gstratecgst;
              if (lubedata.cgstcalculateoflube == undefined) {
                if (lubedata.sale_tax_type != "") {
                  gsttype = lubedata.sale_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
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
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
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
                  }
                } else {
                  gsttype = lubedata.purchase_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                }
              } else {
                gstcgst =
                  parseInt(lubedata.cgstcalculateoflube) +
                  parseInt(lubedata.cgstcalculateoflube);
                gstratecgst =
                  lubedata.cgstcalculateoflube + " (" + gstrate + " )";
                if (lubedata.sale_tax_type != "") {
                  gsttype = lubedata.sale_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                } else {
                  gsttype = lubedata.purchase_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                }
              }
              var quant;
              if (lubedata.unit != null) {
                quant = lubedata.quantity + " " + lubedata.unit;
              } else {
                quant = lubedata.quantity;
              }
              var discountvalueall;
              if (lubedata.discounttype == "₹") {
                discountvalueall =
                  lubedata.discounttype + " " + lubedata.discountvalue;
              } else {
                discountvalueall =
                  lubedata.discountvalue + " " + lubedata.discounttype;
              }
              var pricewithst;
              if (
                JSON.parse(this.allData.settings_data_json).gst_number == ""
              ) {
                pricewithst = parseFloat(lubedata.unit_sale_price);
              } else {
                pricewithst =
                  parseFloat(lubedata.unit_sale_price) + " (" + gsttype + ")";
              }
              this.partsArraySpareLube.push({
                type: "spare",
                name: lubedata.part_name + "-" + lubedata.part_number,
                sale_tax_type: gsttype,
                hsn: lubedata.hsn_no,
                quantity: quant,
                price: pricewithst,
                gst: gstcgst,
                cgst: gstratecgst,
                ratefortax: ratefortax.toFixed(2),
                discountvalue: discountvalueall,
                tottal: lubedata.amount,
                gstrate: parseInt(gstrate) + parseInt(gstrate),
                totalamount: this.getTotalAmount(lubedata, "1", "job"),
              });
            });
            JSON.parse(this.allData.jobcard_job_items).map((lubedata) => {
              if (!lubedata.discounttype) {
                lubedata.discounttype = "₹";
                lubedata.discountvalue = "0";
              }
              var gstrate;
              if (lubedata.sale_gst_rate != "") {
                if (
                  !this.gstTypes.includes(
                    lubedata.sale_gst_rate.substring(
                      0,
                      lubedata.sale_gst_rate.length - 1
                    )
                  )
                ) {
                  this.gstTypes.push(
                    lubedata.sale_gst_rate.substring(
                      0,
                      lubedata.sale_gst_rate.length - 1
                    )
                  );
                }
                if (lubedata.sale_gst_rate != "0%") {
                  gstrate =
                    parseInt(
                      lubedata.sale_gst_rate.substring(
                        0,
                        lubedata.sale_gst_rate.length - 1
                      )
                    ) /
                      2 +
                    "%";
                } else {
                  gstrate = lubedata.sale_gst_rate;
                }
              } else {
                if (
                  !this.gstTypes.includes(
                    lubedata.purchase_gst_rate.substring(
                      0,
                      lubedata.purchase_gst_rate.length - 1
                    )
                  )
                ) {
                  this.gstTypes.push(
                    lubedata.purchase_gst_rate.substring(
                      0,
                      lubedata.purchase_gst_rate.length - 1
                    )
                  );
                }
                if (lubedata.purchase_gst_rate != "0%") {
                  gstrate =
                    parseInt(
                      lubedata.purchase_gst_rate.substring(
                        0,
                        lubedata.purchase_gst_rate.length - 1
                      )
                    ) /
                      2 +
                    "%";
                } else {
                  gstrate = lubedata.purchase_gst_rate;
                }
              }
              var gsttype;
              var ratefortax;
              var gstcgst;
              var gstratecgst;
              if (lubedata.cgstcalculateoflube == undefined) {
                if (lubedata.sale_tax_type != "") {
                  gsttype = lubedata.sale_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
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
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
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
                  }
                } else {
                  gsttype = lubedata.purchase_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                }
              } else {
                gstcgst =
                  parseInt(lubedata.cgstcalculateoflube) +
                  parseInt(lubedata.cgstcalculateoflube);
                gstratecgst =
                  lubedata.cgstcalculateoflube + " (" + gstrate + " )";
                if (lubedata.sale_tax_type != "") {
                  gsttype = lubedata.sale_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                } else {
                  gsttype = lubedata.purchase_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                }
              }
              var quant;
              if (lubedata.unit != null) {
                quant = lubedata.quantity + " " + lubedata.unit;
              } else {
                quant = lubedata.quantity;
              }
              var discountvalueall;
              if (lubedata.discounttype == "₹") {
                discountvalueall =
                  lubedata.discounttype + " " + lubedata.discountvalue;
              } else {
                discountvalueall =
                  lubedata.discountvalue + " " + lubedata.discounttype;
              }
              var pricewithst;
              if (
                JSON.parse(this.allData.settings_data_json).gst_number == ""
              ) {
                pricewithst = parseFloat(lubedata.unit_sale_price);
              } else {
                pricewithst =
                  parseFloat(lubedata.unit_sale_price) + " (" + gsttype + ")";
              }
              this.partsArrayJobs.push({
                type: "job",
                name: lubedata.part_name,
                sale_tax_type: gsttype,
                hsn: lubedata.hsn_no,
                quantity: quant,
                price: pricewithst,
                gst: gstcgst,
                cgst: gstratecgst,
                ratefortax: ratefortax.toFixed(2),
                discountvalue: discountvalueall,
                tottal: lubedata.amount,
                gstrate: parseInt(gstrate) + parseInt(gstrate),
                totalamount: this.getTotalAmount(lubedata, "1", "job"),
              });
            });
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
                  else if (getGST.gstrate.toString() == "4") {
                    getGST.gstrate = 5;
                    totalGST =
                      totalGST + parseFloat(getGST.cgst) + parseFloat(getGST.cgst);
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
          } else {
            JSON.parse(this.allData.jobcard_lubes_items).map((lubedata) => {
              if (!lubedata.discounttype) {
                lubedata.discounttype = "₹";
                lubedata.discountvalue = "0";
              }
              var gstrate;
              if (lubedata.sale_gst_rate != "") {
                if (
                  !this.gstTypes.includes(
                    lubedata.sale_gst_rate.substring(
                      0,
                      lubedata.sale_gst_rate.length - 1
                    )
                  )
                ) {
                  this.gstTypes.push(
                    lubedata.sale_gst_rate.substring(
                      0,
                      lubedata.sale_gst_rate.length - 1
                    )
                  );
                }
                if (lubedata.sale_gst_rate != "0%") {
                  gstrate =
                    parseInt(
                      lubedata.sale_gst_rate.substring(
                        0,
                        lubedata.sale_gst_rate.length - 1
                      )
                    ) /
                      2 +
                    "%";
                } else {
                  gstrate = lubedata.sale_gst_rate;
                }
              } else {
                if (
                  !this.gstTypes.includes(
                    lubedata.purchase_gst_rate.substring(
                      0,
                      lubedata.purchase_gst_rate.length - 1
                    )
                  )
                ) {
                  this.gstTypes.push(
                    lubedata.purchase_gst_rate.substring(
                      0,
                      lubedata.purchase_gst_rate.length - 1
                    )
                  );
                }
                if (lubedata.purchase_gst_rate != "0%") {
                  gstrate =
                    parseInt(
                      lubedata.purchase_gst_rate.substring(
                        0,
                        lubedata.purchase_gst_rate.length - 1
                      )
                    ) /
                      2 +
                    "%";
                } else {
                  gstrate = lubedata.purchase_gst_rate;
                }
              }
              var gsttype;
              var ratefortax;
              var gstcgst;
              var gstratecgst;
              if (lubedata.cgstcalculateoflube == undefined) {
                if (lubedata.sale_tax_type != "") {
                  gsttype = lubedata.sale_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
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
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
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
                  }
                } else {
                  gsttype = lubedata.purchase_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                }
              } else {
                gstcgst =
                  parseInt(lubedata.cgstcalculateoflube) +
                  parseInt(lubedata.cgstcalculateoflube);
                gstratecgst =
                  lubedata.cgstcalculateoflube + " (" + gstrate + " )";
                if (lubedata.sale_tax_type != "") {
                  gsttype = lubedata.sale_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                } else {
                  gsttype = lubedata.purchase_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                }
              }

              var quant;
              if (lubedata.unit != null) {
                quant = lubedata.quantity + " " + lubedata.unit;
              } else {
                quant = lubedata.quantity;
              }
              var discountvalueall;
              if (lubedata.discounttype == "₹") {
                discountvalueall =
                  lubedata.discounttype + " " + lubedata.discountvalue;
              } else {
                discountvalueall =
                  lubedata.discountvalue + " " + lubedata.discounttype;
              }
              var pricewithst;
              if (
                JSON.parse(this.allData.settings_data_json).gst_number == ""
              ) {
                pricewithst = parseFloat(lubedata.unit_sale_price);
              } else {
                pricewithst =
                  parseFloat(lubedata.unit_sale_price) + " (" + gsttype + ")";
              }
              this.completeArray.push({
                type: "lube",
                name: lubedata.part_name,
                sale_tax_type: gsttype,
                hsn: lubedata.hsn_no,
                quantity: quant,
                price: pricewithst,
                gst: gstcgst,
                cgst: gstratecgst,
                ratefortax: ratefortax.toFixed(2),
                discountvalue: discountvalueall,
                tottal: lubedata.amount,
                gstrate: parseInt(gstrate) + parseInt(gstrate),
                totalamount: this.getTotalAmount(lubedata, "1", "job"),
              });
            });
            JSON.parse(this.allData.jobcard_spare_items).map((lubedata) => {
              if (!lubedata.discounttype) {
                lubedata.discounttype = "₹";
                lubedata.discountvalue = "0";
              }
              var gstrate;
              if (lubedata.sale_gst_rate != "") {
                if (
                  !this.gstTypes.includes(
                    lubedata.sale_gst_rate.substring(
                      0,
                      lubedata.sale_gst_rate.length - 1
                    )
                  )
                ) {
                  this.gstTypes.push(
                    lubedata.sale_gst_rate.substring(
                      0,
                      lubedata.sale_gst_rate.length - 1
                    )
                  );
                }
                if (lubedata.sale_gst_rate != "0%") {
                  gstrate =
                    parseInt(
                      lubedata.sale_gst_rate.substring(
                        0,
                        lubedata.sale_gst_rate.length - 1
                      )
                    ) /
                      2 +
                    "%";
                } else {
                  gstrate = lubedata.sale_gst_rate;
                }
              } else {
                if (
                  !this.gstTypes.includes(
                    lubedata.purchase_gst_rate.substring(
                      0,
                      lubedata.purchase_gst_rate.length - 1
                    )
                  )
                ) {
                  this.gstTypes.push(
                    lubedata.purchase_gst_rate.substring(
                      0,
                      lubedata.purchase_gst_rate.length - 1
                    )
                  );
                }
                if (lubedata.purchase_gst_rate != "0%") {
                  gstrate =
                    parseInt(
                      lubedata.purchase_gst_rate.substring(
                        0,
                        lubedata.purchase_gst_rate.length - 1
                      )
                    ) /
                      2 +
                    "%";
                } else {
                  gstrate = lubedata.purchase_gst_rate;
                }
              }
              var gsttype;
              var ratefortax;
              var gstcgst;
              var gstratecgst;
              if (lubedata.cgstcalculateoflube == undefined) {
                if (lubedata.sale_tax_type != "") {
                  gsttype = lubedata.sale_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
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
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
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
                  }
                } else {
                  gsttype = lubedata.purchase_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                }
              } else {
                gstcgst =
                  parseInt(lubedata.cgstcalculateoflube) +
                  parseInt(lubedata.cgstcalculateoflube);
                gstratecgst =
                  lubedata.cgstcalculateoflube + " (" + gstrate + " )";
                if (lubedata.sale_tax_type != "") {
                  gsttype = lubedata.sale_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                } else {
                  gsttype = lubedata.purchase_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                }
              }
              var quant;
              if (lubedata.unit != null) {
                quant = lubedata.quantity + " " + lubedata.unit;
              } else {
                quant = lubedata.quantity;
              }
              var discountvalueall;
              if (lubedata.discounttype == "₹") {
                discountvalueall =
                  lubedata.discounttype + " " + lubedata.discountvalue;
              } else {
                discountvalueall =
                  lubedata.discountvalue + " " + lubedata.discounttype;
              }
              var pricewithst;
              if (
                JSON.parse(this.allData.settings_data_json).gst_number == ""
              ) {
                pricewithst = parseFloat(lubedata.unit_sale_price);
              } else {
                pricewithst =
                  parseFloat(lubedata.unit_sale_price) + " (" + gsttype + ")";
              }
              this.completeArray.push({
                type: "spare",
                name: lubedata.part_name,
                sale_tax_type: gsttype,
                hsn: lubedata.hsn_no,
                quantity: quant,
                price: pricewithst,
                gst: gstcgst,
                cgst: gstratecgst,
                ratefortax: ratefortax.toFixed(2),
                discountvalue: discountvalueall,
                tottal: lubedata.amount,
                gstrate: parseInt(gstrate) + parseInt(gstrate),
                totalamount: this.getTotalAmount(lubedata, "1", "job"),
              });
            });
            JSON.parse(this.allData.jobcard_job_items).map((lubedata) => {
              if (!lubedata.discounttype) {
                lubedata.discounttype = "₹";
                lubedata.discountvalue = "0";
              }
              var gstrate;
              if (lubedata.sale_gst_rate != "") {
                if (
                  !this.gstTypes.includes(
                    lubedata.sale_gst_rate.substring(
                      0,
                      lubedata.sale_gst_rate.length - 1
                    )
                  )
                ) {
                  this.gstTypes.push(
                    lubedata.sale_gst_rate.substring(
                      0,
                      lubedata.sale_gst_rate.length - 1
                    )
                  );
                }
                if (lubedata.sale_gst_rate != "0%") {
                  gstrate =
                    parseInt(
                      lubedata.sale_gst_rate.substring(
                        0,
                        lubedata.sale_gst_rate.length - 1
                      )
                    ) /
                      2 +
                    "%";
                } else {
                  gstrate = lubedata.sale_gst_rate;
                }
              } else {
                if (
                  !this.gstTypes.includes(
                    lubedata.purchase_gst_rate.substring(
                      0,
                      lubedata.purchase_gst_rate.length - 1
                    )
                  )
                ) {
                  this.gstTypes.push(
                    lubedata.purchase_gst_rate.substring(
                      0,
                      lubedata.purchase_gst_rate.length - 1
                    )
                  );
                }
                if (lubedata.purchase_gst_rate != "0%") {
                  gstrate =
                    parseInt(
                      lubedata.purchase_gst_rate.substring(
                        0,
                        lubedata.purchase_gst_rate.length - 1
                      )
                    ) /
                      2 +
                    "%";
                } else {
                  gstrate = lubedata.purchase_gst_rate;
                }
              }
              var gsttype;
              var ratefortax;
              var gstcgst;
              var gstratecgst;
              if (lubedata.cgstcalculateoflube == undefined) {
                if (lubedata.sale_tax_type != "") {
                  gsttype = lubedata.sale_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
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
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
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
                  }
                } else {
                  gsttype = lubedata.purchase_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                }
              } else {
                gstcgst =
                  parseInt(lubedata.cgstcalculateoflube) +
                  parseInt(lubedata.cgstcalculateoflube);
                gstratecgst =
                  lubedata.cgstcalculateoflube + " (" + gstrate + " )";
                if (lubedata.sale_tax_type != "") {
                  gsttype = lubedata.sale_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                } else {
                  gsttype = lubedata.purchase_tax_type;
                  if (lubedata.discounttype == "₹") {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        parseFloat(lubedata.discountvalue);
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        parseFloat(lubedata.discountvalue);
                    }
                  } else {
                    if (lubedata.sale_tax_type == "Inclusive") {
                      var discountvalueinrpe =
                        ((parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100)) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        (parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity)) /
                          (1 + (parseInt(gstrate.slice(0, -1)) * 2) / 100) -
                        discountvalueinrpe;
                      //ratefortax= (parseInt(lubedata.unit_sale_price)*parseFloat(lubedata.quantity))-lubedata.gstcalculateoflube
                    } else {
                      var discountvalueinrpe =
                        parseFloat(lubedata.unit_sale_price) *
                        parseFloat(lubedata.quantity) *
                        (parseFloat(lubedata.discountvalue) / 100);
                      ratefortax =
                        parseFloat(lubedata.unit_sale_price) *
                          parseFloat(lubedata.quantity) -
                        discountvalueinrpe;
                    }
                  }
                }
              }
              var quant;
              if (lubedata.unit != null) {
                quant = lubedata.quantity + " " + lubedata.unit;
              } else {
                quant = lubedata.quantity;
              }
              var discountvalueall;
              if (lubedata.discounttype == "₹") {
                discountvalueall =
                  lubedata.discounttype + " " + lubedata.discountvalue;
              } else {
                discountvalueall =
                  lubedata.discountvalue + " " + lubedata.discounttype;
              }
              var pricewithst;
              if (
                JSON.parse(this.allData.settings_data_json).gst_number == ""
              ) {
                pricewithst = parseFloat(lubedata.unit_sale_price);
              } else {
                pricewithst =
                  parseFloat(lubedata.unit_sale_price) + " (" + gsttype + ")";
              }
              this.completeArray.push({
                type: "job",
                name: lubedata.part_name,
                sale_tax_type: gsttype,
                hsn: lubedata.hsn_no,
                quantity: quant,
                price: pricewithst,
                gst: gstcgst,
                cgst: gstratecgst,
                ratefortax: ratefortax.toFixed(2),
                discountvalue: discountvalueall,
                tottal: lubedata.amount,
                gstrate: parseInt(gstrate) + parseInt(gstrate),
                totalamount: this.getTotalAmount(lubedata, "1", "job"),
              });
            });
            this.UnitPriceSum = this.calculateresult(this.completeArray);
            this.taxrate = this.calculatetaxresult(this.completeArray);
            this.gstTypes.forEach((element) => {
              var totalGST = 0;
              if (element != "0") {
                this.completeArray.map((getGST) => {
                  if (getGST.gstrate.toString() == element) {
                    totalGST =
                      totalGST +
                      parseFloat(getGST.cgst) +
                      parseFloat(getGST.cgst);
                  }
                  else if (getGST.gstrate.toString() == "4") {
                    getGST.gstrate = 5;
                    totalGST =
                      totalGST + parseFloat(getGST.cgst) + parseFloat(getGST.cgst);
                  }
                });
                this.MaingstTypes.push({
                  rate: element,
                  sgst: (totalGST / 2).toFixed(1),
                  cgst: (totalGST / 2).toFixed(1),
                  gst: totalGST.toFixed(2),
                });
              }
            });
          }
          var WorkshopData = JSON.parse(localStorage.getItem("user"));
          this.workshopName = WorkshopData.workshop_name;
          if (WorkshopData.address != "") {
            this.address = WorkshopData.address;
          } else {
            this.address = "none";
          }
          if (WorkshopData.pincode != 0) {
            this.addresspin =
              WorkshopData.city +
              " " +
              WorkshopData.state +
              " " +
              WorkshopData.pincode;
          } else {
            this.addresspin = WorkshopData.city + " " + WorkshopData.state;
          }
          this.phoneNumber = WorkshopData.workshop_mobile_number_1;
          if (WorkshopData.workshop_mobile_number_2 != 0) {
            this.phoneNumber =
              WorkshopData.workshop_mobile_number_1 +
              " / " +
              WorkshopData.workshop_mobile_number_2;
          }
          if (WorkshopData.email != "") {
            this.email = WorkshopData.email;
          } else {
            this.email = "none";
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

    this.general
      .getVechileCustomerDetail(
        this.userService.getData()["workshop_id"],
        this.allData.workshop_customer_id,
        "by_id"
      )
      .subscribe(
        (cusDetails) => {
          this.showspinner.setSpinner(true);
          if (cusDetails.success == true) {
            this.allCustomerDetails = cusDetails.customer;
          } else {
            this.allCustomerDetails = [];
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
      this.getBase64ImageFromURL('../../../assets/images/Logoicon.png').then(res=>{
     
        this.DefaultLogo = res;
        this.allData.DefaultLogo = this.DefaultLogo;
      })
    var currentdate = new Date(this.allData.estimated_delivery_datetime);
    var reminderperioddate = new Date(
      currentdate.setMonth(
        currentdate.getMonth() + parseInt(this.allData.reminder.split(" ")[0])
      )
    );
    this.reminderdate =
      reminderperioddate.getFullYear().toString() +
      "-" +
      ("0" + (reminderperioddate.getMonth() + 1)).slice(-2).toString() +
      "-" +
      ("0" + reminderperioddate.getDate()).slice(-2).toString() +
      " 08:00:00";

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

    if (this.allData.jobcard_customer_voice != "[]") {
      this.cutsomerVoice = JSON.parse(this.allData.jobcard_customer_voice);
    }

    if (this.allData.work_note != "[]" && this.allData.work_note != "") {
      this.worknotes = JSON.parse(this.allData.work_note);
    }

    if (this.allData.discount.split(" ")[1] == "%") {
      this.totalPayable = Number(
        Math.round(
          this.allData.total_amount *
            ((100 - this.allData.discount.split(" ")[0]) / 100)
        ).toFixed(2)
      );
    } else {
      this.totalPayable =
        this.allData.total_amount - this.allData.discount.split(" ")[0];
    }
    if (this.allData.discount.split(" ")[1] == "%") {
      this.totalPayabledis = Number(
        Math.round(
          this.allData.total_amount *
            ((100 - this.allData.discount.split(" ")[0]) / 100) -
            this.allData.advance
        ).toFixed(2)
      );
    } else {
      this.totalPayabledis =
        this.allData.total_amount -
        this.allData.advance -
        this.allData.discount.split(" ")[0];
    }
    if (this.allData.discount.split(" ")[1] == "%") {
      this.Discountname = "Discount(%)";
    } else {
      this.Discountname = "Discount(₹)";
    }
    if (this.allData.discount != "0 %") {
      this.amountinwords = this.convertNumberToWords(this.totalPayable);
    } else {
      this.amountinwords = this.convertNumberToWords(this.allData.total_amount);
    }

    this.profiledata = JSON.parse(localStorage.getItem("user"));

    this.allData.pimage = defaultImage.image;
    if (this.profiledata.logo != "false") {
      this.logoimage = this.profiledata.logo;
      if(this.profiledata.profile_ibase64 != null && this.profiledata.profile_ibase64.startsWith("data")){
        this.blobToBase64(this.b64toBlob(this.profiledata.profile_ibase64,'image/png')).then(res => {
          this.logoimage = res.toString();
          
        });
       }
    }else{
      this.logoimage = this.DefaultLogo;
    }
    if (this.profiledata.signature != "false") {
      this.signaturephoto = this.profiledata.signature;
      this.showSigImage = true;
    } else {
      this.showSigImage = false;
    }
    
    if (this.allData.after_km != "No KM Reminder") {
      this.reminderKM =
        parseInt(this.allData.after_km.split(" ")[0]) +
        parseInt(this.allData.km);
    } else {
      this.reminderKM = 2500 + parseInt(this.allData.km);
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
    if (this.allData.vehicle_number != "") {
      name =
        this.allData.jobcard_number +
        " - " +
        this.allData.vehicle_number +
        ".pdf";
    } else {
      name = this.allData.jobcard_number + ".pdf";
    }
  
    documentDefinition = this.pdfService.generatePDF(
      "invoice",
      this.showgst,
      this.mainTitle,
      this.billformat,
      this.allData,
      this.billingSettings,
      this.allCustomerDetails
    );


    //pdfMake.createPdf(documentDefinition).open();

     pdfMake.createPdf(documentDefinition).download(name);
  }
  // Print the invoice or estimate
  print() {

    try{
    var documentDefinition;
    documentDefinition = this.pdfService.generatePDF(
      "invoice",
      this.showgst,
      this.mainTitle,
      this.billformat,
      this.allData,
      this.billingSettings,
      this.allCustomerDetails
    );
    pdfMake.createPdf(documentDefinition).print();
    }catch(e) {
      console.log("pdfMake",e); 
    }
  }
  // Shre the invoice or estimate via email
  share() {
    var documentDefinition;
    var name;
    if (this.allData.vehicle_number != "") {
      name =
        this.allData.jobcard_number +
        " - " +
        this.allData.vehicle_number +
        ".pdf";
    } else {
      name = this.allData.jobcard_number + ".pdf";
    }
    var useremail;
    if (
      this.allCustomerDetails.customer_email != "" &&
      this.allCustomerDetails.customer_email != null
    ) {
      useremail = this.allCustomerDetails.customer_email;
    } else {
      useremail = "noemail";
    }
    this.dialogservice.OpenEmailSend(useremail).subscribe((email) => {
      if (email != "noemail") {
        documentDefinition = this.pdfService.generatePDF(
          "invoice",
          this.showgst,
          this.mainTitle,
          this.billformat,
          this.allData,
          this.billingSettings,
          this.allCustomerDetails
        );
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
          if (this.allCustomerDetails.customer_mobile_2 == 0) {
            mobile = this.allData.customer_mobile;
          } else {
            mobile =
              this.allData.customer_mobile +
              " / " +
              this.allCustomerDetails.customer_mobile_2;
          }
          if (typeof this.allData.vehicle_details == "string") {
            var vehicle =
              JSON.parse(this.allData.vehicle_details).make +
              " " +
              JSON.parse(this.allData.vehicle_details).model +
              " " +
              JSON.parse(this.allData.vehicle_details).variant;
          } else {
            var vehicle =
              this.allData.vehicle_details.make +
              " " +
              this.allData.vehicle_details.model +
              " " +
              this.allData.vehicle_details.variant;
          }
          var amPM = new Date(this.allData.estimated_delivery_datetime)
            .toLocaleString("en-US")
            .toString()
            .split(" ");
          var fullDate = new Date(this.allData.estimated_delivery_datetime)
            .toString()
            .split(" ");
          var shoedate =
            fullDate[1] +
            " " +
            fullDate[2] +
            ", " +
            fullDate[3] +
            ", " +
            fullDate[4].split(":")[0] +
            ":" +
            fullDate[4].split(":")[1] +
            " " +
            amPM[2];

          if (this.allData.jobcard_status == "0") {
            subject = "Estimation Details and Delivery Deatails";
            bodyMessage =
              "<p> Dear Customer, </p>\n\n <p>Welcome to " +
              workshopname +
              " !</p>\n<p>Mobile Number: " +
              mobile +
              "</p>\n\n\n<p> Jobcard <b>" +
              this.allData.jobcard_number +
              "</b> created for</p>\n\n\n<p> " +
              vehicle +
              " <b>" +
              this.allData.vehicle_number +
              "</b> .</p>\n\n <p><b>Estimation: Rs." +
              this.allData.cost_estimate +
              "/-</b></p><p>  Expected Ready by <b>" +
              shoedate +
              "</b></p>\n\n\n\n<p> Thanks.</p>";
          } else if (this.allData.jobcard_status == "1") {
            subject = "Jobcard Completed";
            bodyMessage =
              "<p> Dear Customer, </p>\n\n <p>Your " +
              vehicle +
              " <b>" +
              this.allData.vehicle_number +
              "</b> is ready.</p>\n\n <p><b>Apprx. Bill Amount: Rs." +
              this.allData.final_amount +
              "/-</b></p><p>  Pickup your Vehicle</p>\n\n\n\n<p> Thanks.</p>\n\n<p>" +
              workshopname +
              "</p>\n\n<p>" +
              mobile +
              "</p>";
          } else if (this.allData.jobcard_status == "2") {
            subject = "Next Servicing due on Date";
            var fullDatenew = new Date(this.reminderdate).toString().split(" ");
            bodyMessage =
              "<p> Dear Customer, </p>\n\n <p>Jobcard for your vehicle " +
              vehicle +
              " has been closed.</p>\n\n <p><b>Your Final Bill Amount is Rs." +
              this.allData.final_amount +
              "/-</b></p>\n\n<p>Next serving for your vehicle is scheduled on <b>" +
              fullDatenew[1] +
              " " +
              fullDatenew[2] +
              " " +
              fullDatenew[3] +
              "</b></p>\n\n<p> Thank you for choosing our Service!</p>\n\n<p>" +
              workshopname +
              "</p>\n\n<p>" +
              mobile +
              "</p>";
          }

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
    if (this.billformat == "Parts") {
      if (this.partsArraySpareLube.length != 0) {
        this.partsArraySpareLube.map((data, index) => {
          var newdata = "";
          count = index + 1;
          newdata = "\r\n" + count + " " + data.name + " ₹" + data.tottal;
          if (newdata != undefined) {
            inventorydata += newdata;
          }
          if (data.type == "spare") {
            sparecount = sparecount + parseInt(data.tottal);
          }
          if (data.type == "lube") {
            lubecount = lubecount + parseInt(data.tottal);
          }
        });
      }
      if (this.partsArrayJobs.length != 0) {
        this.partsArrayJobs.map((data, index) => {
          var newdata = "";
          if (index == 0) {
            count = count + index + 1;
          } else {
            count = count + 1;
          }
          newdata = "\r\n" + count + " " + data.name + " ₹" + data.tottal;
          if (newdata != undefined) {
            inventorydata += newdata;
          }
          if (data.type == "job") {
            jobcount = jobcount + parseInt(data.tottal);
          }
        });
      }
    } else if (this.billformat == "PartsandPartnumber") {
      if (this.partsArraySpareLube.length != 0) {
        this.partsArraySpareLube.map((data, index) => {
          var newdata = "";
          count = index + 1;
          newdata = "\r\n" + count + " " + data.name + " ₹" + data.tottal;
          if (newdata != undefined) {
            inventorydata += newdata;
          }
          if (data.type == "spare") {
            sparecount = sparecount + parseInt(data.tottal);
          }
          if (data.type == "lube") {
            lubecount = lubecount + parseInt(data.tottal);
          }
        });
      }
      if (this.partsArrayJobs.length != 0) {
        this.partsArrayJobs.map((data, index) => {
          var newdata = "";
          if (index == 0) {
            count = count + index + 1;
          } else {
            count = count + 1;
          }
          newdata = "\r\n" + count + " " + data.name + " ₹" + data.tottal;
          if (newdata != undefined) {
            inventorydata += newdata;
          }
          if (data.type == "job") {
            jobcount = jobcount + parseInt(data.tottal);
          }
        });
      }
    } else {
      this.completeArray.map((data, index) => {
        var newdata = "";
        newdata = "\r\n" + (index + 1) + " " + data.name + " ₹" + data.tottal;
        if (newdata != undefined) {
          inventorydata += newdata;
        }
        if (data.type == "job") {
          jobcount = jobcount + parseInt(data.tottal);
        }
        if (data.type == "spare") {
          sparecount = sparecount + parseInt(data.tottal);
        }
        if (data.type == "lube") {
          lubecount = lubecount + parseInt(data.tottal);
        }
      });
    }
    if (this.allData.jobcard_status == "0") {
      whatsappMessage =
        "Welcome to " +
        this.workshopName +
        " " +
        this.phoneNumber +
        "\r\n\n" +
        "Jobcard " +
        this.allData.jobcard_number +
        " created for " +
        this.allData.vehicle_details.make +
        " " +
        this.allData.vehicle_details.model +
        " " +
        this.allData.vehicle_details.variant +
        " " +
        this.allData.vehicle_number +
        "." +
        "\r\n\n" +
        "Estimation: ₹ " +
        this.allData.cost_estimate +
        " /-" +
        "\r\n" +
        inventorydata +
        "\r\n\r\n" +
        "Expect Ready By : " +
        this.datepipe.transform(
          this.allData.estimated_delivery_datetime,
          "d MMM, y, h:mm a"
        ) +
        this.urlgetforonline;
    } else if (this.allData.jobcard_status == "1") {
      whatsappMessage =
        "Dear Customer," +
        "\r\n" +
        "Message from " +
        this.workshopName +
        " " +
        this.phoneNumber +
        "\r\n\n" +
        "Your vehicle " +
        this.allData.vehicle_number +
        " " +
        this.allData.vehicle_details.make +
        " " +
        this.allData.vehicle_details.model +
        " " +
        this.allData.vehicle_details.variant +
        " is ready for pickup." +
        "\r\n" +
        inventorydata +
        "\r\n\r\n" +
        "Bill Amount is  : ₹  " +
        this.totalPayable +
        "/-" +
        this.urlgetforonline;
    } else if (this.allData.jobcard_status == "2") {
      whatsappMessage =
        "Dear Customer," +
        "\r\n" +
        "Message from " +
        this.workshopName +
        " " +
        this.phoneNumber +
        "\r\n" +
        "Your invoice details for " +
        this.allData.vehicle_details.make +
        " " +
        this.allData.vehicle_details.model +
        " " +
        this.allData.vehicle_details.variant +
        " " +
        this.allData.vehicle_number +
        "\r\n" +
        inventorydata +
        "\r\n" +
        "Bill Amount  : ₹  " +
        this.totalPayable +
        "/-" +
        "\r\n" +
        "Labour Charges  : ₹  " +
        jobcount +
        "/-" +
        "\r\n" +
        "Sparepart amount  : ₹  " +
        sparecount +
        "/-" +
        "\r\n" +
        "Lubes Amount  : ₹  " +
        lubecount +
        "/-" +
        "\r\n" +
        "Discount  : " +
        this.allData.discount +
        "/-" +
        "\r\n" +
        "Balance  : ₹  " +
        this.allData.balance_amount +
        "/-" +
        "\r\n" +
        "Visit Again." +
        "\r\n" +
        this.urlgetforonlineclose;
    }
    console.log('whatsappMessage', whatsappMessage)
    // var whatsappMessage= "Hello!"+"\r\n\r\n"+"I found your garage online and I have a few questions regarding online services. Are you free to chat now?"
    whatsappMessage = encodeURIComponent(whatsappMessage);
    // this.contactlink =
    //   "https://wa.me/+91" +
    //   this.allCustomerDetails.customer_mobile +
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
  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
  
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
  
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
  
        var dataURL = canvas.toDataURL("image/png");
  
        resolve(dataURL);
      };
  
      img.onerror = error => {
        reject(error);
      };
  
      img.src = url;
    });
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
