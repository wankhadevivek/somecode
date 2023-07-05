import { Component, OnInit ,ViewChild ,ElementRef, AfterContentInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router'
// import jspdf from "jspdf";
// import { jsPDF } from "jspdf";


// import jsPDF from 'jspdf';
import { DomSanitizer } from "@angular/platform-browser";
import { UserserviceService } from "src/app/services/userservice.service";
import { GeneralService } from "../../services/general.service";


import { AbstractService } from "../../services/comman/abstract.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatSliderChange } from "@angular/material";
import { ViewEncapsulation } from '@angular/compiler/src/core';
// import { html2pdf } from "html2pdf.js";
import { SpinnerService } from "../../services/spinner.service";
import { MatSnackBar } from "@angular/material";
import { DatePipe } from "@angular/common";
import * as html2pdf from 'html2pdf.js'
// declare var require: any;

// import * as pdfMake from "pdfmake/build/pdfmake";
// import * as pdfFonts from "pdfmake/build/vfs_fonts";
// const htmlToPdfmake = require("html-to-pdfmake");
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
@Component({

  selector: 'app-jobcard-detail',
  templateUrl: './jobcard-detail.component.html',
  styleUrls: ['./jobcard-detail.component.css']
})
export class JobcardDetailComponent implements OnInit, AfterContentInit {
  @ViewChild('htmlData', {static: false}) 
  ele:ElementRef;
  @ViewChild('pdfTable', {static: false})
  pdfTable!: ElementRef;
  allViews
  @ViewChild('docHeader', {static: false})
  docHeader!: ElementRef;
  @ViewChild('invoiceDetails', {static: false})
  invoiceDetails!: ElementRef;
  @ViewChild('billInfo', {static: false})
  billInfo!: ElementRef;
  // @ViewChild('spareContent', {static: false})
  // spareContent!: ElementRef;
  // @ViewChild('labourContent', {static: false})
  // labourContent!: ElementRef;
  @ViewChild('allItemsContent', {static: false})
  allItemsContent!: ElementRef;
  @ViewChild('taxSummary', {static: false})
  taxSummary!: ElementRef;
  @ViewChild('nextServiceInfo', {static: false})
  nextServiceInfo!: ElementRef;
  @ViewChild('termsAndCondi', {static: false})
  termsAndCondi!: ElementRef;
  @ViewChild('signatureContent', {static: false})
  signatureContent!: ElementRef;
  selectedSize="a4"
  selectedLay:string="p"
  selectedColor:string="red"
  pageSize = ["a4","a5"]
  pageLayout =["p", "l"]
  pageColor= ["red", "blue"]
  profiledata
  current_url:any
  // spareLabourTable
  spareLabourTable= Array()
  sparestock= Array()
  // labourItems
  labourItems = Array()
  workData
  end_user_url
  // logoimage = this.abstract.imageUrl1;
  logo ;
  signature:any = false
  tableColumn
  printMode:boolean = false
  settingLogoSize = 9
  settingSigSize = 9
  extraColumns
  loadForEndUser = false
  fontOptions = [
    {value: 'Open Sans', viewValue: 'Open Sans'},
    {value: 'Helvetica', viewValue: 'Helvetica'},
    {value: 'Roboto', viewValue: 'Roboto'},
    {value: 'Poppins', viewValue: 'Poppins'},
    {value: 'Times New', viewValue: 'Times New'},
    {value: 'calibri', viewValue: 'calibri'},
    {value: 'monospaced sans serif', viewValue: 'monospaced sans serif'}
  ]
  // thFonts= {
    
  
  //   "background-color":"blue",
    
  // }
  wkNameFont= {
    
    // "font-family":"Open sans",
    "font-family":"Roboto",
    "font-size":"13px",
    "color":"#1a3e81 !important",   


  }
  dynamicTableColumnInfo =[]
  invoiceFont= {
    
    "font-family":"Roboto",
    "font-size":"12px"
  }
  logoSizeClass= {
    
    "max-width":"10rem"
  }
  
  // wkFontFamily ="Open sans"
  wkFontFamily ="Roboto"
  wkFontSize = 13
  wkColor = "pink"
  invoiceFontFamily = "Roboto"
  invoiceFontSize = 12
  showPartNumber = false
  showUnit = false
  showSeparate = true
  spareLabourSeparate = true
  mapFooterDetails= {
    
    showCustomerVoice:false,
    showWorkNote:false,
    showExitNote:false,
    showTerms:false,
    showCustomerSig:false,
    showSubTotal:false
    
  }
  displayFooterInvoiceDetails= {
    
    showCustomerVoice:false,
    showWorkNote:false,
    showExitNote:false,
    showTerms:false,
    showCustomerSig:false,
    showSubTotal:false
    
  }

  dataSource = new 

  
  MatTableDataSource();
  spareItem
  lubeItem
  labourItem
  jobcard
  customer
  workshop
  billSetting
  payable
  reminderKM
  reminderdate
  amountInWords
  customerVoice
  workNotes
  exitNotes
  termsList =[]

  storedInvSettings


  id:string
  whatsappWebLink
  whatsappLink


  subtotals={
  spareTotal:0,
  lubeTotal:0,
  labourTotal:0
  }
  gstApplied = false
  objectKeys = Object.keys;
  gstSlabDetails = {}

  applyClass={
    signatures: true
  }

  elementHeights = {
       docHeader:{
          display: true,
          height: 0,
          appBreak:false
        },
        invoiceDetails:{
          display: true,
          height: 0,
          appBreak:false
        },
        billInfo:{
          display: true,
          height: 0,
          appBreak:false
        },
    // spareContent:{
    //   display: true,
    //   height: 0,
    //   appBreak:false
    // },
    // labourContent:{
    //   display: true,
    //   height: 0,
    //   appBreak:false
    // },
    allItemsContent:{
      display: true,
      height: 0,
      appBreak:false
    },
    taxSummary:{
      display: true,
      height: 0,
      appBreak:false
    },
    nextServiceInfo:{
      display: true,
      height: 0,
      appBreak:false
    },
    termsAndCondi:{
      display: true,
      height: 0,
      appBreak:false
    },
    signatureContent:{
      display: true,
      height: 0,
      appBreak:false
    },
    
 
  }
  constructor(
    public sanitizer: DomSanitizer,
    public abstract: AbstractService,
    private userservice: UserserviceService,
    public generalservice: GeneralService,
    private showspinner: SpinnerService,
    private route: ActivatedRoute,
    private snakBar: MatSnackBar,
    public datepipe: DatePipe,
  ) { 
    // pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit() {
    
    
    // this.id = this.route.snapshot.paramMap.get('id')
    this.id = this.route.snapshot.queryParams["doc"];
// this.previewPdf2()

this.tableColumn = [
  "Spare Items",
   "Qty",
  "Rate","Discount",
  "Tax",
  "TOTAL"
]

// this.workData = [
//   {
//     column: "Spare Items",
//     field : "part_name"
//   },
//   {
//     column: "Qty",
//     field : "quantity",
//     style: {
//       width: "100px",
//      //  "background-color": "red",
//      //  color: "white"
//     }
//   }, 
  
//   {
//    column: "Rate",
//    field : "unit_sale_price",
//    style: {
//      width: "100px",
//      // "background-color": "red",
//      // color: "white"
//    }
//  }, 
//   {
//    column: "Discount",
//    field : "discounttype",
//    style: {
//      width: "100px",
//      // "background-color": "red",
//      // color: "white"
//    }
//  }, 
//   {
//    column: "Tax",
//    field : "sale_gst_rate",
//    style: {
//      width: "100px",
//      // "background-color": "red",
//      // color: "white"
//    }
//  }, 
//   {
//    column: "TOTAL",
//    field : "amount",
//    style: {
//      width: "100px",
//      // "background-color": "red",
//      // color: "white"
//    }
//  }, 
// ]
this.dataSource = new MatTableDataSource(this.sparestock)

this.extraColumns= {
 PartNumber:{
   field: "Part Number",

   param_name : "part_number",
   style: {
    width: "30%"
    //   "min-width": "15%",
   
    //  "max-width": "20%",
    //  "background-color": "red",
    //  color: "white"
   },
   added: false,
   concat: false
 },
 Unit:{
  field: "Unit",

  param_name : "unit",
  style: {
     "min-width": "5%",
  
    "max-width": "10%",
   //  "background-color": "red",
   //  color: "white"
  },
  added: false,
  concat: false
},
Discount:{
  field: "Discount",

  param_name : "discountvalue",
  style: {
     "min-width": "2%",
   //  "background-color": "red",
   //  color: "white"
  },
  added: false
}
}
this.workData = {
  columns: [
  {
   field: "Spare:Labour:Service",

   param_name : "part_name",
   style: {
      "min-width": "25%",
   
     "max-width": "30%",
    //  "background-color": "red",
    //  color: "white"
   }
 }, 
  {
   field: "Qty",
   param_name : "quantity",
   style: {
    //  width: "100px",
     "max-width": "10%",
    //  "background-color": "red",
    //  color: "white"
   }
 }, 
 
 {
  field: "Rate",
  param_name : "unit_sale_price",
  style: {
    // width: "100px",
    "max-width": "10%",
    // "background-color": "red",
    // color: "white"
  },
  
}, 

//  {
//   field: "Discount",
//   param_name : "discounttype",
//   style: {
//     // width: "100px",
//     "max-width": "10%",
//     // "background-color": "red",
//     // color: "white"
//   }
// }, 
 {
  field: "Taxable",
  param_name : "taxable",
  style: {
    // width: "100px",
    "max-width": "10%",
    // "background-color": "red",
    // color: "white"
  }
}, 
 {
  field: "Tax",
  param_name : "sale_gst_rate",
  style: {
    // width: "100px",
    "max-width": "10%",
    // "background-color": "red",
    // color: "white"
  }
}, 
 {
  field: "TOTAL",
  param_name : "amount",
  style: {
    // width: "100px",
    "max-width": "10%",
    // "background-color": "red",
    // color: "white"
  }
}, 
]
}
this.getJobcardDetails()
// this.setStyle()
// this.setTableColumns()
// this.spareLabourTable = [...this.sparestock, ...this.labourItems]

}
ngAfterContentInit(){
//  let contentHeight = this.spareContent.nativeElement.offsetHeight;
// this.allViews= {
//   docHeader: this.docHeader,
//   invoiceDetails: this.invoiceDetails,
//   billInfo: this.billInfo,

// }
//  let pdfHeight = this.pdfTable.nativeElement.offsetHeight;
// // console.log('hegiht', contentHeight)
// console.log('hegiht', pdfHeight)

}
getJobcardDetails(){
  // let wkid = this.id.split('-')[0]
  // let jcno = this.id.split('-')[1]
  // console.log('wkid, jcno', wkid, jcno)
  this.generalservice
      // .getJobcardDetails(this.userservice.getData()["workshop_id"]
      // + '-725811')
      // .getJobcardDetails(4317
      // + '-849098')
      .getJobcardDetails(this.id)
      .subscribe(
        (data) => {
         
          // this.showspinner.setSpinner(true);
          if (data.success == true) {
            // console.log('user_end_url',data.user_end_url)
            this.end_user_url =data.user_end_url
            this.id.length >= 15 ? this.loadForEndUser = true : this.loadForEndUser = false
            this.jobcard = data.jobcards
            // HANDLINGT THE DISCOUNT VALUE 'Rs' GETTING STORED FROM MOBILE APP 
            this.jobcard.jobcard_spare_items = this.jobcard.jobcard_spare_items.replace('"discounttype": "Rs"', '"discounttype": "₹"')
            this.jobcard.jobcard_lubes_items = this.jobcard.jobcard_lubes_items.replace('"discounttype": "Rs"', '"discounttype": "₹"')
            this.jobcard.jobcard_job_items = this.jobcard.jobcard_job_items.replace('"discounttype": "Rs"', '"discounttype": "₹"')
            //
            
            this.jobcard["final_amount"] = parseInt(this.jobcard.final_amount)
            this.jobcard["balance_amount"] = parseInt(this.jobcard.balance_amount)
            this.jobcard["invoice_date"] = this.jobcard.created_at
            if(this.jobcard.jobcard_status == 1){
              this.jobcard["invoice_date"] = this.jobcard.complete_date
            }
            else if(this.jobcard.jobcard_status == 2){
              this.jobcard["invoice_date"] = this.jobcard.closed_date
            }
            this.customer = data.customer
            this.workshop = data.workshop
            this.storedInvSettings = data.settings.settings_invoice
            var bill= JSON.parse(data.settings.settings_billing)
            // console.log('bill', bill)
            this.termsList =  []

            if (bill[0].terms_and_conditions != ''){
              
              this.termsList = bill[0].terms_and_conditions.split(';')
            }
           
 
            if (this.workshop.logo == false){
              this.logo = false
            }
            else{
              this.logo = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' +this.workshop.logo)
            }
            if (this.workshop.signature == false){
              this.signature = false
            }
            else{
              this.signature = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' +this.workshop.signature)
            }
            // this.logo = false ? this.workshop.logo == false : this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' +this.workshop.logo)
            
            this.billSetting = bill[0]
            JSON.parse(this.jobcard.settings_data_json).gst_number == "" ? this.gstApplied = false : this.gstApplied = true
            // this.jobcard.gst_number == "" ? this.gstApplied = false : this.gstApplied = true
            this.payable = parseInt(this.jobcard.total_amount) - parseInt(this.jobcard.advance)  -parseInt(this.jobcard.discount.split(' ')[0])
            const numWords = require('num-words')
 
            this.amountInWords = this.titleCase(numWords(parseInt(this.jobcard.final_amount)) + ' rupees only')
            
           //  retive stored  invoice settings 

            this.retriveSettings()
           
            this.setJobcardItems()
            this.setTableColumns()
            this.setStyle()
            this.setJobcardNotes()
            this.getReminderInfo()
            setTimeout(() => {
              
              this.setWhatappMsg()
            }, 2000);
            // this.sharewhatsApp()
          }
          // this.showspinner // console.log('billlllll',
            //   this.billSetting[0].gst_number
            // ).setSpinner(false);
        },
        (err) => {
          // this.showspinner.setSpinner(false);
          // this.snakBar.open("Error", ErrorMessgae[0][err], {
          //   duration: 4000,
          // });
        }
      );
 }

 setWhatappMsg(){
 let message = this.sharewhatsApp()
  
  // let link =  `https://garage.tightthenut.com/jobcard-detail?doc=${this.id}`
  let link =  `http://development.tightthenut.com/jobcard-detail?doc=${this.end_user_url}`
  let whatsappMsg =`Dear Customer, 
  follow this link to access your invoice
  ${link}
  `

  // whatsappMsg = encodeURIComponent(whatsappMsg);
  this.whatsappWebLink = "https://web.whatsapp.com/send?phone=91"+
  this.customer.customer_mobile+"&text=" + message;
  this.whatsappLink = "https://wa.me/"+ "91" +
  this.customer.customer_mobile+"?text=" + message;


// https://wa.me/91{}?text=


 }
 getReminderInfo(){
  let km = 0
  if (this.jobcard.km && this.jobcard.km != ''){
    km = parseInt(this.jobcard.km)
  }
  if (this.jobcard.after_km != "No KM Reminder") {
    this.reminderKM =
      parseInt(this.jobcard.after_km.trim().split(" ")[0]) +
      km;
  } else {
    this.reminderKM = 2500 + km
  }

  var currentdate = new Date(this.jobcard.estimated_delivery_datetime);
  var reminderperioddate = new Date(
    currentdate.setMonth(
      currentdate.getMonth() + parseInt(this.jobcard.reminder.trim().split(" ")[0])
    )
  );
  this.reminderdate =
    reminderperioddate.getFullYear().toString() +
    "-" +
    ("0" + (reminderperioddate.getMonth() + 1)).slice(-2).toString() +
    "-" +
    ("0" + reminderperioddate.getDate()).slice(-2).toString() +
    " 08:00:00";

 }
 titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  // Directly return the joined string
  return splitStr.join(' '); 
}

 setJobcardNotes(){
  this.customerVoice = []
  let cusVoice = JSON.parse(this.jobcard.jobcard_customer_voice)
  
  let table1 =[]
  let table2 = []
  if(cusVoice.length <= 5){
  
     table1 =cusVoice
  
  }
  else{
    let sliceInd:number =  Math.floor(cusVoice.length /2)
   
    table1 = cusVoice.slice(0, sliceInd)
    table2 = cusVoice.slice(sliceInd)
  }
  this.customerVoice.push(table1)
  this.customerVoice.push(table2)

 
  
  let wknotes = JSON.parse(this.jobcard.work_note)
  this.workNotes = wknotes.map(note=>{
    return note.notes
  })


  // this.termsList = JSON.parse(this.jobcard.work_note)
 }
setJobcardItems( ){
  // console.log('this.jobccar', this.jobcard)
  // console.log('this.jobccar', this.customer)
  this.spareItem = this.calculateTaxable(JSON.parse(this.jobcard.jobcard_spare_items))
  this.lubeItem = this.calculateTaxable(JSON.parse(this.jobcard.jobcard_lubes_items), 'lubeTotal')
  this.labourItem = this.calculateTaxable(JSON.parse(this.jobcard.jobcard_job_items),'labourTotal')
  // console.log('works', this.spareItem )
  this.sparestock = [...this.lubeItem, ...this.spareItem]
  
  let temp = this.labourItem.slice(1, 2);
  this.labourItems = [...this.labourItem]
  this.spareLabourTable = [...this.lubeItem, ...this.spareItem, ...this.labourItem]
  // console.log('gst', this.gstSlabDetails )
  // console.log('subtot', this.subtotals )
   
}
calculateTaxable(itemObject,type='spareTotal'){
  var tempArray = []
    itemObject.map(item =>{

      if (this.gstApplied) {
        
        // console.log('this.jobcard.gst_number', 
        //           this.jobcard.gst_number != "" ||
        //           this.jobcard.gst_number == ""
        //             )

        var totalcal = this.CalculateWithTax(
          parseFloat(item["unit_sale_price"]),
          item["sale_gst_rate"],
          item["sale_tax_type"],
          item["discountvalue"],
          parseFloat(item["quantity"]),
          item["discounttype"]
        );

        item["gstcalculateofjob"] =
          totalcal[0]["GSTAmount"];
        item["cgstcalculateofjob"] = totalcal[0]["CGST"];
        item["sgstcalculateofjob"] = totalcal[0]["SGST"];
        item["gstcalculateoflube"] =
          totalcal[0]["GSTAmount"];
        item["cgstcalculateoflube"] =
          totalcal[0]["CGST"];
        item["sgstcalculateoflube"] =
          totalcal[0]["SGST"];
        item["showcalcluationinfo"] = true;
        item["amount"] = totalcal[0]["totalamount"];
        item["taxable"] = totalcal[0]["taxableamount"];
            // not 0% and 
          if(!(item["sale_gst_rate"] in this.gstSlabDetails)){
            this.gstSlabDetails[item["sale_gst_rate"]] = parseFloat(item["gstcalculateofjob"] )
          }
          else{
            this.gstSlabDetails[item["sale_gst_rate"]] += parseFloat(item["gstcalculateofjob"])
          }
      } else {
        var totalcal = this.CalculateWithTax(
          parseFloat(item["unit_sale_price"]),
          "0",
          "Inclusive",
          item["discountvalue"],
          parseFloat(item["quantity"]),
          item["discounttype"]
        );
        item["amount"] = totalcal[0]["totalamount"];
    }
    tempArray.push(item)
    // calculate or use jobcard spare_total... data
    this.subtotals[type] +=  parseFloat(item["amount"]) 

  })
  return tempArray
}
getNativeEleHeights(){
  return new Promise(resolve=>{
    setTimeout(() => {
     
      this.elementHeights.docHeader.height = this.docHeader.nativeElement.offsetHeight
          
      this.elementHeights.invoiceDetails.height = this.invoiceDetails.nativeElement.offsetHeight
      
      this.elementHeights.billInfo.height = this.billInfo.nativeElement.offsetHeight
      
      // this.elementHeights.spareContent.height = this.spareContent.nativeElement.offsetHeight
      
      // this.elementHeights.labourContent.height = this.labourContent.nativeElement.offsetHeight
      
      this.elementHeights.allItemsContent.height = this.allItemsContent.nativeElement.offsetHeight
      
      this.elementHeights.taxSummary.height = this.taxSummary.nativeElement.offsetHeight
      
      this.elementHeights.nextServiceInfo.height = this.nextServiceInfo.nativeElement.offsetHeight
      this.elementHeights.signatureContent.height = 130
      
      if (this.elementHeights.termsAndCondi.display ){
        this.elementHeights.termsAndCondi.height = this.termsAndCondi.nativeElement.offsetHeight 
      }
      // this.elementHeights.termsAndCondi.display ? this.elementHeights.termsAndCondi.height = this.termsAndCondi.nativeElement.offsetHeight : this.elementHeights.termsAndCondi.height = 0
      // console.log('this.termsAndCondi.nativeElement.offsetHeight ', this.termsAndCondi.nativeElement.offsetHeight )
      // console.log(' after get this.elementHeights',  this.elementHeights)
      }, 2000);

       resolve(2000)

  })
 
 
  
}
applyPageBreakClass(){
  return new Promise(resolve=>{
    setTimeout(() => {
      // a4 p -880
      // let pageHeight = 700
      let pageHeight = 1000
      var currHeight = 0
      var previousEle = 'docHeader'
      for(let key in this.elementHeights){
        
        
        // console.log('key',key, this.elementHeights[key]) 
        if (this.elementHeights[key].display){
          // console.log('currHeight',currHeight) 
          // console.log('pageHeight', pageHeight) 
         
          let currPageH = currHeight % pageHeight
          // in cases of tables if available height is ? 30% of required dont add page breaks 
          if (currPageH + this.elementHeights[key].height +40 > pageHeight){
            // console.log(currPageH ,'+' ,this.elementHeights[key].height , currPageH + this.elementHeights[key].height) 
            // console.log(currPageH + this.elementHeights[key].height > pageHeight) 
            // this.elementHeights[key].appBreak = true
              this.elementHeights[previousEle].appBreak = true
              // this.elementHeights[previousEle].appBreak = true
              // console.log('add page break',previousEle,  this.elementHeights[previousEle])
          }
          else{
            this.elementHeights[previousEle].appBreak = false
          }
          previousEle = key
          currHeight += this.elementHeights[key].height
          // console.log(' sfter currHeight', currHeight)
      }
    }
      console.log('elementHright', this.elementHeights) 
      
      resolve(4000)
      
    }, 4000);
  })

}
async downloadInvoice(){
  this.showspinner.setSpinnerForLogin(true);
  // this.showspinner.setSpinner(true);
  
  var resp1 = await this.getNativeEleHeights()
 
  var resp2 = await this.applyPageBreakClass()
  
  this.downloadAsPDF()
  this.showspinner.setSpinnerForLogin(false);

}

 downloadAsPDF() {
  // const pdfTable = this.pdfTable.nativeElement;
  // var html = htmlToPdfmake(pdfTable.innerHTML);
  // const documentDefinition = { content: html};
  
//   var pdfMake = require('./pdfmake');
// var pdfFonts = require('./vfs_fonts');

// pdfMake.addVirtualFileSystem(pdfFonts);

  // pdfMake.createPdf(documentDefinition).download(); 
   
  // console.log('from ssssssss', this.termsAndCondi.nativeElement.offsetHeight )
    const element = document.getElementById("pdfTable");
    let filename  = `${this.customer.vehicle_number}- ${this.jobcard.jobcard_number} Invoice`
    const opt = {
      margin: 0,
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 1 },
      // jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      jsPDF :{
        orientation: "portrait" ,
        unit: "in",
        format: "a4"
        
        // putOnlyUsedFonts:true,
        // floatPrecision: 16 // or "smart", default is 16
       },
      // pagebreak: { mode: 'css', before: '#page2el' }
      pagebreak: {mode: 'css',avoid: 'tr'}
      
    };
  //   .set({
  //     pagebreak: {avoid: 'tr'}
  // });

    
    // console.log('opyyyy', o pt)
    
      

// start loader at the start of the funtion and set buttons display to none
// stop the loader and revert the button dusplay in the .then of html2pdf method
setTimeout(() => {
  
  html2pdf()
  .from(element)
  .set(opt)
  .save();
}, 2000);
 
 
  
}

setTableColumns() {
  this.dynamicTableColumnInfo = 
  [
    {
     field: "Spare:Labour ",
  
     param_name : "part_name",
     style: {
        "width": "30%",
        "font-weight":600
      //   "min-width": "25%",
     
      //  "max-width": "30%",
      //  "background-color": "red",
      //  color: "white"
     }
   }, 
    {
     field: "Qty",
     param_name : "quantity",
     style: {
      //  width: "100px",
       "max-width": "10%",
      //  "background-color": "red",
      //  color: "white"
     }
   }, 
   
   {
    field: "Rate",
    param_name : "unit_sale_price",
    style: {
      // width: "100px",
      "max-width": "10%",
      // "background-color": "red",
      // color: "white"
    }
  }, 
  //  {
  //   field: "Discount",
  //   param_name : "discounttype",
  //   style: {
  //     // width: "100px",
  //     "max-width": "10%",
  //     // "background-color": "red",
  //     // color: "white"
  //   }
  // }, 
  //  {
  //   field: "Taxable",
  //   param_name : "amount",
  //   style: {
  //     // width: "100px",
  //     "max-width": "10%",
  //     // "background-color": "red",
  //     // color: "white"
  //   }
  // }, 
  //  {
  //   field: "Tax",
  //   param_name : "sale_gst_rate",
  //   style: {
  //     // width: "100px",
  //     "max-width": "10%",
  //     // "background-color": "red",
  //     // color: "white"
  //   }
  // }, 
   {
    field: "Amount",
    param_name : "amount",
    style: {
      // width: "100px",
      "max-width": "10%",
      "font-weight":600
      // "background-color": "red",
      // color: "white"
    }
  }, 
  ]
  // if jc gst applied then add the taxable column 
  // console.log('this.gstApplied', this.gstApplied)
  if (this.gstApplied){
    this.dynamicTableColumnInfo.splice(3, 0, 
      {
        field: "Tax",
        param_name : "gstcalculateofjob",
        style: {
          // width: "100px",
          "max-width": "10%",
          // "background-color": "red",
          // color: "white"
        }
      
      })
      this.dynamicTableColumnInfo.splice(3, 0, 
        {
          field: "Taxable",
          param_name : "taxable",
          style: {
            // width: "100px",
            "max-width": "10%",
            // "background-color": "red",
            // color: "white"
          }
        })
  }
  for (var key in this.extraColumns){
     
    if(this.extraColumns[key].added ){
      this.dynamicTableColumnInfo.splice(2 , 0 ,this.extraColumns[key])
    } 
  }
  this.showPartNumber =this.extraColumns['PartNumber']['concat']
  
  this.showUnit =this.extraColumns['Unit']['concat']
  


}
retriveSettings(){
  // add logo size
  let resJson = this.storedInvSettings

  console.log('resjon', resJson)
  this.wkFontFamily = resJson["wkNameFont"]["font-family"]
  this.wkFontSize = resJson["wkNameFont"]["font-size"].split("px")[0]

  this.invoiceFontFamily= resJson["invoiceFont"]["font-family"]
  
  this.invoiceFontSize= resJson["invoiceFont"]["font-size"].split("px")[0]

  
  this.mapFooterDetails = {...resJson["footerInvoiceDetails"]}

  this.spareLabourSeparate = resJson["billInvoiceDetails"]["showSeparate"]
  this.extraColumns['PartNumber']['concat'] = resJson["billInvoiceDetails"]["showPartNumber"]
  this.extraColumns['Unit']['concat'] = resJson["billInvoiceDetails"]["showUnit"]
  this.extraColumns.Discount.added = resJson["billInvoiceDetails"]["showDiscount"]

  this.settingLogoSize = resJson["settingLogoSize"] 
   this.settingSigSize=  resJson["settingSigSize"] 
  this.logoSizeClass['max-width']= resJson["settingLogoSize"] + "rem"
  
  // terms
  // {wkNameFont: this.wkNameFont,
  //   invoiceFont: this.invoiceFont,

  //   billInvoiceDetails:{
  //   showDiscount: this.extraColumns.Discount.added,
  //   showPartNumber: this.showPartNumber,
  //   showUnit : this.showUnit,
  //   showSeparate: this.spareLabourSeparate},
  
  //   footerInvoiceDetails: this.displayFooterInvoiceDetails
  
  
  
  // }

}
manualSpinner(){
  this.showspinner.setSpinnerForLogin(true);
  setTimeout(() => {
    this.showspinner.setSpinnerForLogin(false);
  }, 2000);
}
storeSettings(){
  // this.manualSpinner()
  // set style on the invoice html before, when user has requested to save settings 
  this.setStyle() 
  this.showspinner.setSpinnerForLogin(true);
  let reqJson = {wkNameFont: this.wkNameFont,
    invoiceFont: {
    
      "font-family":this.invoiceFontFamily,
      "font-size": this.invoiceFontSize + 'px'
    },

    billInvoiceDetails:{
    showDiscount: this.extraColumns.Discount.added,
    showPartNumber: this.showPartNumber,
    showUnit : this.showUnit,
    showSeparate: this.spareLabourSeparate},
  
    footerInvoiceDetails: this.displayFooterInvoiceDetails,
    settingLogoSize : this.settingLogoSize,
    settingSigSize : this.settingSigSize
  
  
  }
  // console.log('reqJson', reqJson)
  this.generalservice.updateInvoiceSettings(reqJson, this.workshop["workshop_id"]).subscribe(resp=>{
    this.showspinner.setSpinnerForLogin(false);
    // console.log('resp', resp)
    if(resp.success){
      this.snakBar.open("Message","Stored Setting Preferences", {
        duration: 2000,
      });
    }


  },
  (err) => {
    this.showspinner.setSpinnerForLogin(false);
  })
  

}



setStyle(flag='init'){

 
  this.wkNameFont['font-family'] = this.wkFontFamily
  this.wkNameFont['font-size'] = this.wkFontSize +"px"

  this.invoiceFont['font-family'] = this.invoiceFontFamily
  this.invoiceFont['font-size'] = this.invoiceFontSize +"px"


  this.logoSizeClass['max-width']= this.settingLogoSize + "rem"
  this.setTableColumns()
  
  this.displayFooterInvoiceDetails = {...this.mapFooterDetails}
  // console.log("this.displayFooterInvoiceDetails", this.displayFooterInvoiceDetails)

  const { ['showTerms']: termsFlag } = this.displayFooterInvoiceDetails;

  // console.log('termsFlag', termsFlag)
  this.elementHeights.termsAndCondi.display = termsFlag
  // console.log('after save this.elementHeights', this.elementHeights)

  // this.getNativeEleHeights()
  // this.applyPageBreakClass()
  // set display property in elementsHeights obj
  // set heights property in elementsHeights obj
  // set app/applyClass property 

  
  this.spareLabourSeparate ? this.showSeparate=true : this.showSeparate= false
  // if(flag !== 'init'){
  //   this.manualSpinner()
  // }
  this.snakBar.open("Message","Preview Ready", {
    duration: 2000,
  });
}
  previewPdf2(){
    document.title= `${this.customer.vehicle_number}- ${this.jobcard.jobcard_number} Invoice`
    window.print()
    // let innerContents = document.getElementById('print_template').innerHTML;
    // // console.log('innerContents : ',innerContents);

    // let popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');

    // popupWinindow.document.open();
    // popupWinindow.document.write('<html><head><style>.preview-pdf thead {page-break-before: auto;display: table-row-group;background-color: gainsboro !important;}</style> QR Code </head><body  onload="window.print()">' + innerContents + '</html>');
    // popupWinindow.document.close();
    

 
  }
// we only need this calculations to get the taxable amount
// all the others can be skipped 
  CalculateWithTax(
    price,
    rate,
    type,
    discount = '0',
    quantity,
    discounttype="₹"
  ) {
    var taxableAmt = 0;
    if (discounttype == "₹" ) {
      if (type == "Inclusive") {
        
        var taxalbeamount =
          (parseFloat(price) * parseFloat(quantity)) /
            (1 + parseInt(rate) / 100) -
            parseFloat(discount);
        var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
        var CGST = GSTAmount / 2;
        var SGST = CGST;
        taxableAmt = taxalbeamount;
        var totalamount = taxalbeamount + GSTAmount;
      } else {
        var taxalbeamount =
          parseFloat(price) * parseFloat(quantity) - parseFloat(discount);
        var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
        var CGST = GSTAmount / 2;
        var SGST = CGST;
        taxableAmt = taxalbeamount;
        var totalamount = taxalbeamount + GSTAmount;
      }
    } else {
      if (type == "Inclusive") {
        var discountamount =
          ((parseFloat(price) * parseFloat(quantity)) /
            (1 + parseInt(rate) / 100)) *
          (parseFloat(discount) / 100);
        var taxalbeamount =
          (parseFloat(price) * parseFloat(quantity)) /
            (1 + parseInt(rate) / 100) -
          discountamount;
        var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
        var CGST = GSTAmount / 2;
        var SGST = CGST;
        taxableAmt = taxalbeamount;
        var totalamount = taxalbeamount + GSTAmount;
      } else {
        var discountamount =
          parseFloat(price) * parseFloat(quantity) * (parseFloat(discount) / 100);
        var taxalbeamount =
          parseFloat(price) * parseFloat(quantity) - discountamount;
        var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
        var CGST = GSTAmount / 2;
        var SGST = CGST;
        taxableAmt = taxalbeamount;
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
      taxableamount: taxalbeamount.toFixed(2),
    });
    return amountarr;
  }
  
// Share the invoice or estimate details on whatsapp
  sharewhatsApp() {
    // console.log('wk', this.workshop)
   let urlgetforonline =
    "\r\n\n" +
    "Check Jobcard Live Status on : " +
    this.abstract.mainurl +
    "cus/" +
    this.workshop.url_param;
  let urlgetforonlineclose =
    "\r\n" +
    "You can book appointment on " +
    this.abstract.mainurl +
    "cus/" +
    this.workshop.url_param;
    var whatsappMessage;
    var inventorydata = "";
    var count = 0;
    var sparecount = 0;
    var lubecount = 0;
    var jobcount = 0;
    console.log(' this.spareLabourTable',  this.spareLabourTable)
    let temp = [...this.labourItems, ...this.sparestock]
    temp.map((data, index) => {
      var newdata = "";
      newdata = "\r\n" + (index + 1) + " " + data.part_name + " ₹" + data.amount;
      if (newdata != undefined) {
        inventorydata += newdata;
      }
      if (data.type == "job") {
        jobcount = jobcount + parseInt(data.amount);
      }
      if (data.type == "spare") {
        sparecount = sparecount + parseInt(data.amount);
      }
      if (data.type == "lube") {
        lubecount = lubecount + parseInt(data.amount);
      }
    });
    if (this.jobcard.jobcard_status == "0") {
      whatsappMessage =
        "Welcome to " +
        this.workshop.workshop_name +
        " " +
        this.workshop.workshop_mobile_number_1 +
        "\r\n\n" +
        "Jobcard " +
        this.jobcard.jobcard_number +
        " created for " +
        this.customer.vehicle_make +
        " " +
        this.customer.vehicle_model +
        " " +
        this.customer.vehicle_variant +
        " " +
        this.customer.vehicle_number +
        "." +
        "\r\n\n" +
        "Estimation: ₹ " +
        this.jobcard.cost_estimate +
        " /-" +
        "\r\n" +
        inventorydata +
        "\r\n\r\n" +
        "Expect Ready By : " +
        this.datepipe.transform(
          this.jobcard.estimated_delivery_datetime,
          "d MMM, y, h:mm a"
        ) +
        urlgetforonline;
    } else if (this.jobcard.jobcard_status == "1") {
      whatsappMessage =
        "Dear Customer," +
        "\r\n" +
        "Message from " +
        this.workshop.workshop_name +
        " " +
        this.workshop.workshop_mobile_number_1 +
        "\r\n\n" +
        "Your vehicle " +
        this.customer.vehicle_number +
        " " +
        this.customer.vehicle_make +
        " " +
        this.customer.vehicle_model +
        " " +
        this.customer.vehicle_variant +
        " is ready for pickup." +
        "\r\n" +
        inventorydata +
        "\r\n\r\n" +
        "Bill Amount is  : ₹  " +
        this.jobcard.final_amount +
        "/-" +
         urlgetforonline;
    } else if (this.jobcard.jobcard_status == "2") {
      whatsappMessage =
        "Dear Customer," +
        "\r\n" +
        "Message from " +
        this.workshop.workshop_name +
        " " +
        this.workshop.workshop_mobile_number_1 +
        "\r\n" +
        "Your invoice details for " +
        this.customer.vehicle_make +
        " " +
        this.customer.vehicle_model +
        " " +
        this.customer.vehicle_variant +
        " " +
        this.customer.vehicle_number +
        "\r\n" +
        inventorydata +
        "\r\n" +
        "Bill Amount  : ₹  " +
        this.jobcard.final_amount +
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
        this.jobcard.discount +
        "/-" +
        "\r\n" +
        "Balance  : ₹  " +
        this.jobcard.balance_amount +
        "/-" +
        "\r\n" +
        "Visit Again." +
        "\r\n" +
       urlgetforonlineclose;
    }
    // console.log('whatsappMessage', whatsappMessage)
    // var whatsappMessage= "Hello!"+"\r\n\r\n"+"I found your garage online and I have a few questions regarding online services. Are you free to chat now?"
    whatsappMessage = encodeURIComponent(whatsappMessage);
    // this.contactlink =
    //   "https://wa.me/+91" +
    //   this.allCustomerDetails.customer_mobile +
    //   "?text=" +
    //   whatsappMessage;

    // this.contactlink = "https://web.whatsapp.com/send?phone=91"+
    // this.allCustomerDetails.customer_mobile+"&text=" + whatsappMessage;

    return whatsappMessage
  }
}
