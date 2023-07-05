import { Component, OnInit, ViewChild } from "@angular/core";
import { DilogOpenService } from "../../services/dilog-open.service";
import {
  NgbCalendar,
  NgbDateParserFormatter,
} from "@ng-bootstrap/ng-bootstrap";
import { GeneralService } from "../../services/general.service";
import { UserserviceService } from "../../services/userservice.service";
import { MatSnackBar } from "@angular/material";
import { SpinnerService } from "../../services/spinner.service";
import { ErrorMessgae } from "../../shared/error_message/error";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { PrintsharepdfService } from "../../services/printsharepdf.service";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { ReportpdfService } from "../../services/reportpdf.service";
import { Color } from "ng2-charts";
import * as moment from "moment";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import * as Highcharts from "highcharts";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  SatDatepickerModule,
} from "saturn-datepicker";
import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from "../../shared/model/date/date.adapter";
import { parse } from "querystring";
import { toInteger } from "@ng-bootstrap/ng-bootstrap/util/util";
import { isNumber, lt } from "lodash";
import * as glob from "../../shared/usercountry/userCountryGlobal";
import { th } from "date-fns/locale";
@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS,
    },
  ],
})
/**
 * In this Compoenet is used for the
 *  reports section to get
 * revenue,coustomers,spare,lube,jobs,service,counter
 * reports
 */
export class ReportsComponent implements OnInit {
  userserviceworkshopid;
  public doughnutChartLabels;
  public doughnutChartData;
  public doughnutChartColors: Color[] = Array();
  public doughnutChartType = "doughnut";
  public options: any = {
    legend: { position: "right" },
  };
  FronDateField;
  ToDateField;
  startDate;
  maxDate;
  minDate;
  TostartDate;
  TomaxDate;
  TominDate;
  dateType;
  reportType;
  showGSTData: boolean = true;
  showInsExpData: boolean = true;
  showRevenueData: boolean = true;
  showCounterData: boolean = true;
  recustomerData: boolean = false;
  showCustomerData: boolean = false;
  showLubeSpareData: boolean = false;
  showJobData: boolean = false;
  showServiceData: boolean = false;
  showMechanicData: boolean = false;
  showVehicleData: boolean = false;
  showPendingData: boolean = false;
  ReportHeader = "";
  ReportRows = Array();
  GSTReportRows = ["Invoice Value", "CGST", "SGST"];

  gst_invoice_value = 0;
  gst_cgst = 0.0;
  gst_sgst = 0.0;
  ReportRowsData = Array();
  makeSelected;
  modelSelected;
  getAllVehicle = Array();
  getAllVehicleModel = Array();
  getAllVehicleMake = Array();
  allReportData = Array();
  allServices = Array();
  searchData;
  customerfalg: boolean = false;
  showrecusfilter: boolean = false;
  public data: any;
  displayedColumns: string[];
  showLubeinvenData: boolean = false;
  revenueTabelData = Array();
  //
  gstTableData = Array();
  ReveueCSVData = Array();
  totalRevenueData = Array();
  counterTabelData = Array();
  counterCSVData = Array();
  counterCSVDatadup = Array();
  totalCounterData = Array();
  customerTabelData = Array();
  pendingCustomerTabelData = Array();
  pendingCustomerCSVData = Array();
  cutsomerGroupedData;
  totalCustomerData = Array();
  arraytoDownlaodCutsomerDetails = Array();
  getindexarr = Array();
  vehicleTabelData = Array();
  // totalVehicleData = Array();
  InventoryTabelData = Array();

  footerPurchasePrice = 0;
  contactlink: String="";

  showFooter: boolean = false;
  footerProfit;
  getAllStaffDetails = Array();
  mechanicInventoryData = Array();
  // totalMechanicData = Array();
  performerMec;
  performerMecserved;
  performerMeclabour;
  getALLReminders = Array();
  serviceTabelData = Array();
  scrollheight = "100";
  hasnext;
  page_number: any = 1;
  dataSource = new MatTableDataSource();
  Highcharts = Highcharts;
  donutscharts = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      height: 205,
      width: 250,
      plotShadow: false,
    },
    title: {
      text: "",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          distance: 5,
          style: {
            fontWeight: "bold",
            color: "#444449",
          },
        },
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        type: "pie",
        name: "% Share",
        innerSize: "50%",
        data: [["No Data", 100]],
      },
    ],
  };
  currency_symbol: any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    public sendPDF: PrintsharepdfService,
    public pdfService: ReportpdfService,
    private showspinner: SpinnerService,
    private snakBar: MatSnackBar,
    private userService: UserserviceService,
    private generalService: GeneralService,
    public formatter: NgbDateParserFormatter,
    private dialogService: DilogOpenService
  ) {
    this.userserviceworkshopid = this.userService.getData()["workshop_id"];
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.resetReports();
  }
  ngOnInit() {
    this.currency_symbol = glob.currency_symbol;
    this.generalService.getMakeModel().subscribe(
      (allVehcicles) => {
        this.showspinner.setSpinner(true);
        if (allVehcicles["success"] == true) {
          this.getAllVehicle = allVehcicles["vhicledetails"];
          this.getVehcileLsit();
        }
        this.showspinner.setSpinner(false);
      },
      (err) => {
        this.showspinner.setSpinner(false);
        this.snakBar.open("err", ErrorMessgae[0][err], {
          duration: 4000,
        });
      }
    );
  }
  //---------------------------------Reports Section To select Reports Applya or reset and date------------------------------
  //Aplly Filerts
  applyFilters() {
    this.data = [];
    this.dataSource = new MatTableDataSource();
    this.displayedColumns = [];
    this.resetReportsOptions()
    if (this.reportType == "revenue") {
      this.displayedColumns = [
        "date",
        "spare_total",
        "lube_total",
        "in_house_labour",
        "outsourced_labour",
        "total",
        "discount",
        "final_amount",
        "received_amount",
        "balance",
      ];
      this.showGSTData = false;
      this.showRevenueData = true;
      this.showCustomerData = false;
      this.showLubeSpareData = false;
      this.showJobData = false;
      this.showServiceData = false;
      this.showMechanicData = false;
      this.showVehicleData = false;
      this.recustomerData = false;
      this.showCounterData = false;
      this.showPendingData = false;
      this.doughnutChartLabels = ["Discount", "Received Amount", "Balance"];
      this.doughnutChartData = [0, 0, 0];
      this.getSelectedReportData("rev");
    } else if (this.reportType == "mechanic") {
      this.displayedColumns = [
        "mechanic_details",
        "total_vehicle",
        "spare_total",
        "lube_total",
        "in_house_labour",
        "discount",
        "outsourced_labour",
        "total",
        "incentives",
        "salary",
      ];
      this.showGSTData = false;
      this.showRevenueData = false;
      this.showCustomerData = false;
      this.showCounterData = false;
      this.showLubeSpareData = false;
      this.showJobData = false;
      this.showServiceData = false;
      this.showMechanicData = true;
      this.showVehicleData = false;
      this.recustomerData = false;
      this.showPendingData = false;
      //this.doughnutChartLabels = ['Mechanic 1', 'Mechanic 2', 'Mechanic 3', 'Mechanic 4','Mechanic 5'];
      //this.doughnutChartData = [0, 0, 0, 0, 0];
      this.getSelectedReportData("mec");
    } else if (this.reportType == "service") {
      this.displayedColumns = [
        "customer_details",
        "vehicle_details",
        "due_date",
        "status",
        "whatsapp_link",
      ];
      this.showGSTData = false;
      this.showRevenueData = false;
      this.showCustomerData = false;
      this.showLubeSpareData = false;
      this.showCounterData = false;
      this.showJobData = false;
      this.showServiceData = true;
      this.showMechanicData = false;
      this.showVehicleData = false;
      this.recustomerData = false;
      this.showPendingData = false;
      this.ReportHeader = "Today's Service Due";
      //this.ReportRows=['Customer Details','Vehicle Details','Last Service Due']
      //this.ReportRowsData=[{name:'nav',vehicle:'Splendor',date:'2020-05-20 08:00:00'},{name:'nav',vehicle:'Splendor',date:'2020-05-20 08:00:00'}]
      // this.getSelectedReportData("service");

      // Replaced all the functions for service data with  edited code
      //all the functions have a trailing E to differentiate

      this.getSelectedReportDataE("service");
    } else if (this.reportType == "vehicle") {
      this.displayedColumns = ["make_and_model", "counts", "invoice_amount"];
      this.showGSTData = false;
      this.showRevenueData = false;
      this.showCustomerData = false;
      this.showLubeSpareData = false;
      this.showJobData = false;
      this.showServiceData = false;
      this.showMechanicData = false;
      this.showVehicleData = true;
      this.recustomerData = false;
      this.showCounterData = false;
      this.showPendingData = false;
      this.ReportHeader = "Top 5 Vehicle Served";
      //this.ReportRows=['Vehicle Name','Count','Total Amount']
      //this.ReportRowsData=[{name:'Splaendor',vehicle:'500',date:'500'},{name:'Splaendor',vehicle:'500',date:'500'}]
      this.getSelectedReportData("vehicle");
    } else if (this.reportType == "spare") {
      this.displayedColumns = [
        "part_number",
        "name",
        "company",
        "total_sold",
        "current_quant",
        "average_selling_price",
        "total_sold_in",
        "profit",
      ];
      this.showGSTData = false;
      this.showRevenueData = false;
      this.showCustomerData = false;
      this.showLubeSpareData = true;
      this.showJobData = false;
      this.showServiceData = false;
      this.showMechanicData = false;
      this.showVehicleData = false;
      this.recustomerData = false;
      this.showCounterData = false;
      this.showPendingData = false;
      this.ReportHeader = "Top 5 Spare Served";
      this.getSelectedReportData("inventory");
    } else if (this.reportType == "lube") {
      this.displayedColumns = [
        "part_number",
        "name",
        "company",
        "total_sold",
        "current_quant",
        "average_selling_price",
        "total_sold_in",
        "profit",
      ];
      this.showGSTData = false;
      this.showRevenueData = false;
      this.showCustomerData = false;
      this.showLubeSpareData = true;
      this.showJobData = false;
      this.showServiceData = false;
      this.showMechanicData = false;
      this.showVehicleData = false;
      this.recustomerData = false;
      this.showCounterData = false;
      this.showPendingData = false;
      this.ReportHeader = "Top 5 Lube Served";
      this.getSelectedReportData("inventory");
    } else if (this.reportType == "job") {
      this.displayedColumns = [
        "job_code",
        "name",
        "total_sold",
        "current_quant",
        "average_selling_price",
        "total_sold_in",
      ];
      this.showGSTData = false;
      this.showRevenueData = false;
      this.showCustomerData = false;
      this.showLubeSpareData = false;
      this.showJobData = true;
      this.showServiceData = false;
      this.showMechanicData = false;
      this.showVehicleData = false;
      this.recustomerData = false;
      this.showCounterData = false;
      this.showPendingData = false;
      this.ReportHeader = "Top 5 Job Served";
      this.getSelectedReportData("inventory");
    } else if (this.reportType == "customer") {
      // if(this.customerfalg==true){
      //   this.displayedColumns=['select','customer_details','vehicle_details','total','discount','final_amount','received_amount','balance','days','action']
      // }else{
      //   this.displayedColumns=['customer_details','vehicle_details','total','discount','final_amount','received_amount','balance','days','action']
      // }
      this.showGSTData = false;
      this.showRevenueData = false;
      this.showCustomerData = true;
      this.showLubeSpareData = false;
      this.showJobData = false;
      this.showServiceData = false;
      this.showMechanicData = false;
      this.showCounterData = false;
      this.showVehicleData = false;
      this.recustomerData = false;
      this.showPendingData = false;
      this.ReportHeader = "Top 5 Customer's Pending Balance";
      //this.ReportRows=['Customer Name','Invoice Amount','Balance Amount']
      //this.ReportRowsData=[{name:'nav',vehicle:'500',date:'100'},{name:'nav',vehicle:'500',date:'100'}]
      this.searchData = "";
      this.getSelectedReportData("cus");
    } else if (this.reportType == "recustomer") {
      this.displayedColumns = [
        "name",
        "mobile_number",
        "vehicle_details",
        "vehicle_number",
        "last_visit",
        "total_visit",
      ];
      this.showGSTData = false;
      this.showRevenueData = false;
      this.showCustomerData = false;
      this.showLubeSpareData = false;
      this.showJobData = false;
      this.showServiceData = false;
      this.showMechanicData = false;
      this.showVehicleData = false;
      this.recustomerData = true;
      this.showCounterData = false;
      this.showPendingData = false;
      this.page_number = 1;
      this.getRecusringCustomerData();
    } else if (this.reportType == "counter") {
      this.displayedColumns = ["date", "total", "received_amount", "balance"];
      this.showGSTData = false;
      this.showRevenueData = false;
      this.showCounterData = true;
      this.showCustomerData = false;
      this.showLubeSpareData = false;
      this.showJobData = false;
      this.showServiceData = false;
      this.showMechanicData = false;
      this.showVehicleData = false;
      this.recustomerData = false;
      this.showPendingData = false;
      this.doughnutChartLabels = ["Total", "Received Amount", "Balance"];
      this.doughnutChartData = [0, 0, 0];
      this.getSelectedReportData("counter");
    } else if (this.reportType == "gst") {
      this.displayedColumns = [
        "date",
        "invoice_no",
        "jc_no",
        "invoice_value",
        "gst_rate",
        "amount",
        "taxable_value",
        "cgst",
        "sgst",
    
      ];
      this.showGSTData = true;
      this.showRevenueData = false;
      this.showCounterData = false;
      this.showCustomerData = false;
      this.showLubeSpareData = false;
      this.showJobData = false;
      this.showServiceData = false;
      this.showMechanicData = false;
      this.showVehicleData = false;
      this.recustomerData = false;
      this.showPendingData = false;
      this.doughnutChartLabels = ["Total", "Received Amount", "Balance"];
      this.doughnutChartData = [0, 0, 0];
      this.searchData = "gst";
      this.getSelectedReportData("gst");
    }
    else if (this.reportType == "insexp"
    || this.reportType == "cusbday") {
      this.displayedColumns=['cus_name','cus_mob','vehicle_no','vehicle_details','ins_name','exp_date','whatsapp_link']
      this.resetReportsOptions()
      this.showInsExpData = true
      this.getSelectedReportData(this.reportType)
    }
    else if (this.reportType == "pogst"
    || this.reportType == "csgst") {
      this.ReportHeader = "GST Report";
      this.gstTableData = [];
      this.gst_invoice_value = 0;
      this.gst_cgst = 0.0;
      
      this.displayedColumns = [
        "date",
        "invoice_no",
      
        "invoice_value",
        "gst_rate",
        "amount",
        "taxable_value",
        "cgst",
        "sgst",
    
      ];
      this.resetReportsOptions()
      this.showGSTData = true

      this.getSelectedReportData(this.reportType)
    }
    else if (this.reportType == "pending") {
      // if(this.customerfalg==true){
      //   this.displayedColumns=['select','customer_details','vehicle_details','total','discount','final_amount','received_amount','balance','days','action']
      // }else{
      //   this.displayedColumns=['customer_details','vehicle_details','total','discount','final_amount','received_amount','balance','days','action']
      // }
      // this.displayedColumns=['cus_name','cus_mob','jcno','vehicle_details','total','discount','final_amount','received_amount','balance','whatsapp_link']
      this.displayedColumns=['cus_name','cus_mob','jcno','vehicle_details','total','balance','whatsapp_link']
      this.showGSTData = false;
      this.showRevenueData = false;
      this.showCustomerData = false;
      this.showLubeSpareData = false;
      this.showJobData = false;
      this.showServiceData = false;
      this.showMechanicData = false;
      this.showCounterData = false;
      this.showVehicleData = false;
      this.recustomerData = false;
      this.showPendingData = true;
      this.ReportHeader = "Top 5 Customer's Pending Balance";
      //this.ReportRows=['Customer Name','Invoice Amount','Balance Amount']
      //this.ReportRowsData=[{name:'nav',vehicle:'500',date:'100'},{name:'nav',vehicle:'500',date:'100'}]
      this.searchData = "";
      this.getSelectedReportData("pending");
    }
  }
  // resetOptions
  resetReportsOptions(){

    
    this.showInsExpData = false
    this.showGSTData = false;
      this.showRevenueData = false;
      this.showCustomerData = false;
      this.showLubeSpareData = false;
      this.showJobData = false;
      this.showServiceData = false;
      this.showMechanicData = false;
      this.showCounterData = false;
      this.showVehicleData = false;
      this.recustomerData = false;
      this.showPendingData = false;

  }
  //Select Reports type or Aplly Filerts
  selectReport(e) {
    this.reportType = e;
    if (e == "service") {
      this.selectDate("current");
      this.getAllWorkshopSMS();
      this.showServiceData = true;
      this.showLubeinvenData = false;
      this.showrecusfilter = false;
    } else {
      if (e == "recustomer") {
        this.showrecusfilter = true;
      } else {
        this.showrecusfilter = false;
        this.selectDate("one");
        if (e == "mechanic") {
          this.getAllStaff();
        }
        if (e == "job") {
          this.showLubeinvenData = true;
        } else if (e == "lube") {
          this.showLubeinvenData = true;
        } else if (e == "spare") {
          this.showLubeinvenData = true;
        } else {
          this.showLubeinvenData = false;
        }
      }

      this.showServiceData = false;
    }
  }
  //FromDate
  FromDate(e) {
    this.FronDateField = e;
    this.TominDate = e;
  }
  //ToDate
  ToDate(e) {
    this.ToDateField = e;
  }
  //Select Date
  selectDate(e) {
    this.dateType = e;
    if (e == "today") {
      this.ToDateField = new Date();
      this.FronDateField = new Date();
    } else if (e == "one") {
      this.oneMonthDate();
    } else if (e == "three") {
      this.threeMonthDate();
    } else if (e == "six") {
      this.sixMonthDate();
    } else if (e == "year") {
      this.oneYearMonthDate();
    } else if (e == "current") {
      this.currentMonthDate();
    } else if (e == "last") {
      this.lastMonthDate();
    } else if (e == "seven") {
      this.lastSevenDaysDate();
    } else if (e == "fifth") {
      this.lastfifthDaysDate();
    } else if (e == "nextseven") {
      this.nextSevenDaysDate();
    } else if (e == "nextfifth") {
      this.nextfifthDaysDate();
    }
  }
  //LAst Month Date Change
  oneMonthDate() {
    const current = new Date();
    const oneMonth = new Date();
    var dateOneMonth = oneMonth.setMonth(oneMonth.getMonth() - 1);
    //this.maxDate={ year: current.getFullYear(), month: current.getMonth()+1, day: current.getDate()};
    this.ToDateField = current;
    this.FronDateField = new Date(dateOneMonth);
    //this.TomaxDate={ year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate()};
    //this.TominDate=this.FronDateField;
  }
  //Last 3 Month Date Change
  threeMonthDate() {
    const current = new Date();
    const oneMonth = new Date();
    var dateOneMonth = oneMonth.setMonth(oneMonth.getMonth() - 3);
    this.FronDateField = new Date(dateOneMonth);

    this.ToDateField = current;
  }
  //Lsst 6 Month Date Change
  sixMonthDate() {
    const current = new Date();
    const oneMonth = new Date();
    var dateOneMonth = oneMonth.setMonth(oneMonth.getMonth() - 6);
    this.FronDateField = new Date(dateOneMonth);

    this.ToDateField = current;
  }
  //Lsst 1 year Date Change
  oneYearMonthDate() {
    const current = new Date();
    const oneMonth = new Date();
    var dateOneMonth = oneMonth.setFullYear(oneMonth.getFullYear() - 1);
    this.FronDateField = new Date(dateOneMonth);

    this.ToDateField = current;
  }
  //current Moth or current month Date Change
  currentMonthDate() {
    const current = new Date();
    const oneMonth = new Date();
    var firstDay = new Date(oneMonth.getFullYear(), oneMonth.getMonth(), 1);
    this.FronDateField = firstDay;
    this.TominDate = current;
  }
  // format month
  fotmatMonth(month) {
    month++;
    return month < 10 ? "0" + month : month;
  }
  //Last Moth month Date Change
  lastMonthDate() {
    const current = new Date();
    var firstDay = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    var lastDay = new Date(current.getFullYear(), current.getMonth(), 0);
    this.FronDateField = firstDay;
    this.ToDateField = lastDay;
  }
  //Last 7 Days Date Change
  lastSevenDaysDate() {
    const current = new Date();
    const oneMonth = new Date();
    var dateOneMonth = oneMonth.setDate(oneMonth.getDate() - 7);
    this.FronDateField = new Date(dateOneMonth);

    this.ToDateField = current;
  }
  //Last 15 Days Date Change
  lastfifthDaysDate() {
    const current = new Date();
    const oneMonth = new Date();
    var dateOneMonth = oneMonth.setDate(oneMonth.getDate() - 15);
    this.FronDateField = new Date(dateOneMonth);

    this.ToDateField = current;
  }
  //Next 7 Days Date Change
  nextSevenDaysDate() {
    const current = new Date();
    const oneMonth = new Date();
    var dateOneMonth = oneMonth.setDate(oneMonth.getDate() + 7);
    this.FronDateField = current;

    this.ToDateField = new Date(dateOneMonth);
  }
  //Next 15 Days Date Change
  nextfifthDaysDate() {
    const current = new Date();
    const oneMonth = new Date();
    var dateOneMonth = oneMonth.setDate(oneMonth.getDate() + 15);
    this.FronDateField = current;

    this.ToDateField = new Date(dateOneMonth);
  }
  //Reset all the fields
  resetReports() {
    this.selectReport("revenue");
    this.applyFilters();
    this.modelSelected = "All";
    this.makeSelected = "All";
  }
  s;
  //Get all Vehicle Dteials
  getVehcileLsit() {
    this.getAllVehicle.map((data) => {
      if (data.make == "All") {
        console.log("okay");
      }
      if (!this.getAllVehicleMake.includes(data.make)) {
        this.getAllVehicleMake.push(data.make);
      }
      if (!this.getAllVehicleModel.includes(data.model)) {
        this.getAllVehicleModel.push(data.model);
      }
    });
  }
  //Select Make for the reports
  selectMake(e) {
    this.makeSelected = e;
    this.getAllVehicleModel = [];
    this.getAllVehicle.map((data) => {
      if (data.make == e) {
        if (!this.getAllVehicleModel.includes(data.model)) {
          this.getAllVehicleModel.push(data.model);
          if (!this.getAllVehicleModel.includes("All")) {
            this.getAllVehicleModel.push("All");
          }
        }
      }
    });
    if (this.makeSelected == "All") {
      this.modelSelected = this.getAllVehicleModel[0];
    } else {
      this.modelSelected = this.getAllVehicleModel[1];
    }
  }
  //Select Model for the reports
  selectModel(e) {
    this.modelSelected = e;
  }
  //----------------------------End Reports Section To select Reports Applya or reset and date------------------------------
  //---------------------------Reports Section------------------------------------------------------------------------------
  //open the Dialog box for the Day wise reports
  openReports(data) {
    this.dialogService.OpenReports(data).subscribe((result) => {
      // console.log("result");
    });
  }
  //opne Counter Reports
  opencounterReports(data) {
    this.dialogService.OpenCounterReports(data).subscribe((result) => {
      console.log("result");
    });
  }
  //Downlaod Excel FIle(CSV)
  downlaodCSV() {
    // console.log("servicee");
    // console.log("this.reportType", this.reportType);
    // console.log("this.serviceDueTabelData", this.serviceDueTabelData);
    let allaislename = Array();
    if (this.reportType == "revenue") {
      if (this.revenueTabelData.length != 0) {
        this.snakBar.open(
          "Message",
          "Downloading the Excel Please Wait for a min",
          {
            duration: 4000,
          }
        );
        allaislename = this.ReveueCSVData;
      } else {
        this.snakBar.open("Message", "No Data to Download", {
          duration: 4000,
        });
      }
    } else if (this.reportType == "customer") {
      if (this.customerTabelData.length != 0) {
        this.snakBar.open(
          "Message",
          "Downloading the Excel Please Wait for a min",
          {
            duration: 4000,
          }
        );
        allaislename = this.customerTabelData;
      } else {
        this.snakBar.open("Message", "No Data to Download", {
          duration: 4000,
        });
      }
    } else if (this.reportType == "vehicle") {
      if (this.vehicleTabelData.length != 0) {
        this.snakBar.open(
          "Message",
          "Downloading the Excel Please Wait for a min",
          {
            duration: 4000,
          }
        );
        allaislename = this.vehicleTabelData;
      } else {
        this.snakBar.open("Message", "No Data to Downlands", {
          duration: 4000,
        });
      }
    } else if (this.reportType == "spare") {
      if (this.InventoryTabelData.length != 0) {
        this.snakBar.open(
          "Message",
          "Downloading the Excel Please Wait for a min",
          {
            duration: 4000,
          }
        );
        allaislename = this.InventoryTabelData;
      } else {
        this.snakBar.open("Message", "No Data to Download", {
          duration: 4000,
        });
      }
    } else if (this.reportType == "lube") {
      if (this.InventoryTabelData.length != 0) {
        this.snakBar.open(
          "Message",
          "downloading the Excel Please Wait for a min",
          {
            duration: 4000,
          }
        );
        allaislename = this.InventoryTabelData;
      } else {
        this.snakBar.open("Message", "No Data to Download", {
          duration: 4000,
        });
      }
    } else if (this.reportType == "job") {
      if (this.InventoryTabelData.length != 0) {
        this.snakBar.open(
          "Message",
          "Downloading the Excel Please Wait for a min",
          {
            duration: 4000,
          }
        );
        allaislename = this.InventoryTabelData;
      } else {
        this.snakBar.open("Message", "No Data to Download", {
          duration: 4000,
        });
      }
    } else if (this.reportType == "mechanic") {
      if (this.mechanicInventoryData.length != 0) {
        this.snakBar.open(
          "Message",
          "Downloading the Excel Please Wait for a min",
          {
            duration: 4000,
          }
        );
        allaislename = this.mechanicInventoryData;
      } else {
        this.snakBar.open("Message", "No Data to Downlaod", {
          duration: 4000,
        });
      }
    } else if (this.reportType == "service") {
      if (this.serviceDueTabelData.length != 0) {
        this.snakBar.open(
          "Message",
          "Downloading the Excel Please Wait for a min",
          {
            duration: 4000,
          }
        );
        allaislename = this.serviceDueTabelData;
      } else {
        this.snakBar.open("Message", "No Data to Download", {
          duration: 4000,
        });
      }
    } else if (this.reportType == "gst" || this.showGSTData == true) {
      if (this.gstTableData.length != 0) {
        this.snakBar.open(
          "Message",
          "Downloading the Excel Please Wait for a min",
          {
            duration: 4000,
          }
        );
        allaislename = this.gstTableData;
      } else {
        this.snakBar.open("Message", "No Data to Download", {
          duration: 4000,
        });
      }
    }
    else if (this.reportType == "pending") {
      if (this.pendingCustomerCSVData.length != 0) {
        this.snakBar.open(
          "Message",
          "Downloading the Excel Please Wait for a min",
          {
            duration: 4000,
          }
        );
        allaislename = this.pendingCustomerCSVData;
      } else {
        this.snakBar.open("Message", "No Data to Download", {
          duration: 4000,
        });
      }
    }
    //come back
    else if (this.reportType == "counter") {
      if (this.counterCSVData.length != 0) {
        this.snakBar.open(
          "Message",
          "Downloading the Excel Please Wait for a min",
          {
            duration: 4000,
          }
        );
        this.counterCSVData.map((data) => {
          data.TotalBalance = this.counterCSVDatadup[data.cusid];
          delete data["cusid"];
        });
        allaislename = this.counterCSVData;
      } else {
        this.snakBar.open("Message", "No Data to Download", {
          duration: 4000,
        });
      }
    }

    let results = allaislename.length && allaislename;
    var startDateor = new Date(this.FronDateField);
    var endDate = new Date(this.ToDateField);
    var startDate =
      startDateor.getFullYear() +
      "-" +
      ("0" + (startDateor.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + startDateor.getDate()).slice(-2);
    var endtDate =
      endDate.getFullYear() +
      "-" +
      ("0" + (endDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + endDate.getDate()).slice(-2);

    let filename =
      this.reportType +
      "-report-" +
      this.userserviceworkshopid +
      "-(" +
      startDate +
      "---" +
      endtDate +
      ")";
    (".csv");
    filename = filename.trim();
    filename = filename.replace(/ /g, "_");
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(results);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelData: Blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    FileSaver.saveAs(excelData, filename);
  }
  //Selected Report Data on basis of date range

  getSelectedReportData(reportType) {
    this.allReportData = [];
    var startDateor = new Date(this.FronDateField);
    var endDateor = new Date(this.ToDateField);
    var enddateaddd = endDateor.setDate(endDateor.getDate() + 1);
    var convertenddatee = new Date(enddateaddd);
    var startDate =
      startDateor.getFullYear() +
      "-" +
      ("0" + (startDateor.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + startDateor.getDate()).slice(-2);
    var endtDate =
      convertenddatee.getFullYear() +
      "-" +
      ("0" + (convertenddatee.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + convertenddatee.getDate()).slice(-2);

    this.generalService
      .getReports(this.userserviceworkshopid, reportType, startDate, endtDate)
      .subscribe(
        (reports) => {
          this.showspinner.setSpinner(true);
          if (reports["success"] == true) {
            this.showFooter = true;
            this.allReportData = reports["data"];

            // this.snakBar.open("Message", "Reports Found", {
            //   duration: 4000
            // })
            if (reportType === "insexp"
            || this.reportType == "cusbday") {

              let vehicleAdded = []
              let uniqueCustomer = []
              for (var i = 0; i < this.allReportData.length; i++) {
                
                if (
                  !vehicleAdded.includes(
                    this.allReportData[i]["vehicle_number"]
                  )
                ) {
                  uniqueCustomer.push(this.allReportData[i])
                  vehicleAdded.push(
                    this.allReportData[i]["vehicle_number"]
                  )
                  
                  
                }
               
          
              }
              this.dataSource = new MatTableDataSource(uniqueCustomer);
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
            }
            else if (reportType == "pogst") {
              // here
              // this.getGstReport(reportType);
            
              this.allReportData.forEach((po)=>{
                this.gst_invoice_value += parseInt(po.total_amount)
                let stock = JSON.parse(po.stock_items)
              
              this.getGstReport( stock, po)
            })
            
            } 
            else if (reportType == "csgst") {
              // here
              // this.getGstReport(reportType);
              this.allReportData.forEach((counter)=>{
                let gstActive = JSON.parse(counter.settings)["gst_number"]
                if(gstActive !== '' ){
                  this.gst_invoice_value += parseInt(counter.final_amount)
                  let stock = JSON.parse(counter.counter_items)
  
             
              this.getGstReport( stock, counter)
                }
                
            })
            
            } 
            else if (reportType != "service") {
              this.groupByNonServiceReports(reportType);
            } 
            else {
              this.groupByServiceReports(reportType);
            }
          } else {
            this.showFooter = false;
            this.snakBar.open("Message", "No Reports Found", {
              duration: 4000,
            });
          }
          this.showspinner.setSpinner(false);
        },
        (err) => {
          this.showFooter = false;
          this.showspinner.setSpinner(false);
          this.snakBar.open("err", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  //-----------------------------------
  getSelectedReportDataE(reportType) {
    this.allServices = [];
    var startDateor = new Date(this.FronDateField);
    var endDateor = new Date(this.ToDateField);
    var enddateaddd = endDateor.setDate(endDateor.getDate() + 1);
    var convertenddatee = new Date(enddateaddd);
    var startDate =
      startDateor.getFullYear() +
      "-" +
      ("0" + (startDateor.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + startDateor.getDate()).slice(-2);
    var endtDate =
      convertenddatee.getFullYear() +
      "-" +
      ("0" + (convertenddatee.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + convertenddatee.getDate()).slice(-2);

    this.generalService
      .getService(this.userserviceworkshopid, startDate, endtDate)
      .subscribe(
        (reports) => {
          this.showspinner.setSpinner(true);
          if (reports["success"] == true) {
            this.allServices = reports["reminders"];
            // this.snakBar.open("Message", "Reports Found", {
            //   duration: 4000
            // })
            // if (reportType != "service") {
            //   this.groupByNonServiceReports(reportType);
            // } else {
            //   // my checks
            //   console.log("report data/jobcard", this.allReportData);
            //   this.groupByServiceReports(reportType);
            // }
 
            this.groupByServiceReportsE(reportType);
          } else {
            // this.snakBar.open("Message", "No Reports Found", {
            //   duration: 4000,
            // });
            // console.log("1111111111111111111");
          }
          this.showspinner.setSpinner(false);
        },
        (err) => {
          // this.showspinner.setSpinner(false);
          // this.snakBar.open("err", ErrorMessgae[0][err], {
          //   duration: 4000,
          // });
          // console.log("2222222222222222222222");
        }
      );
  }
  //----------------------------------
  //sort or group by reports except service reports
  groupByNonServiceReports(typeReport) {
    this.showspinner.setSpinner(true);
    var groupBy = (array, key) => {
      return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
          currentValue
        );
        return result;
      }, {});
    };
    if (typeReport == "rev") {
      this.allReportData.map((data) => {
        data.created_at = data.created_at.split(" ")[0];
        data.closed_date = data.closed_date.split(" ")[0];
      });
      const reportsGroupByCreatedAt = groupBy(
        this.allReportData,
        "closed_date"
      );
      
      this.getRevenueData(reportsGroupByCreatedAt);
    } else if (typeReport == "pending") {
      this.pendingCustomerCSVData = []
      this.pendingCustomerTabelData = [...this.allReportData];
    for (let entry of this.pendingCustomerTabelData){
      this.pendingCustomerCSVData.push({
        'Customer Name': entry.cutsomer_name,
        'Customer Mobile': entry.customer_mobile,
        'Jobcard Number': entry.jobcard_number,
        'Vehicle Data': entry.vehicle_number,
        'Total Amount': entry.total_amount,
        'Pending Amount': entry.balance_amount,

      })
    }
    
      this.dataSource = new MatTableDataSource(this.allReportData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.calculateTopPendingBalance()
  
    } else if (typeReport == "cus") {
      this.allReportData.map((data) => {
        data.vehicle_number =
          data.vehicle_number +
          " " +
          data.cutsomer_name +
          " " +
          data.customer_mobile;
        data.closed_date = new Date(data.closed_date);
      });
      const reportsGroupByvehicleNumber = groupBy(
        this.allReportData,
        "vehicle_number"
      );
      this.getCutsomerData(reportsGroupByvehicleNumber, false);
    } else if (typeReport == "vehicle") {
      this.allReportData.map((data) => {
        data.vehicle_details =
          JSON.parse(data.vehicle_details).make +
          " " +
          JSON.parse(data.vehicle_details).model +
          " " +
          JSON.parse(data.vehicle_details).variant;
      });
      const reportsGroupByvehicle = groupBy(
        this.allReportData,
        "vehicle_details"
      );
      this.getVehicleData(reportsGroupByvehicle, false);
    } else if (typeReport == "inventory") {
      var selectedVehicle = this.makeSelected + " " + this.modelSelected;
      if (this.reportType == "spare") {
        var ArrSparePartNUmber = Array();
        this.allReportData.map((data) => {
          var vehiclefilter;
          if (this.makeSelected != "All" && this.modelSelected == "All") {
            vehiclefilter = JSON.parse(data.vehicle_details).make + " All";
          } else {
            vehiclefilter =
              JSON.parse(data.vehicle_details).make +
              " " +
              JSON.parse(data.vehicle_details).model;
          }
          if (selectedVehicle == "All All") {
            if (JSON.parse(data.jobcard_spare_items).length != 0) {
              JSON.parse(data.jobcard_spare_items).map((data) => {
                ArrSparePartNUmber.push(data);
              });
            }
          } else {
            if (selectedVehicle == vehiclefilter) {
              if (JSON.parse(data.jobcard_spare_items).length != 0) {
                JSON.parse(data.jobcard_spare_items).map((data) => {
                  ArrSparePartNUmber.push(data);
                });
              }
            }
          }
        });
        const reportsGroupBySparePartNUmber = groupBy(
          ArrSparePartNUmber,
          "part_number"
        );

        this.getInventoryData(reportsGroupBySparePartNUmber, "spare");
      } else if (this.reportType == "lube") {
        var ArrLubePartNUmber = Array();
        this.allReportData.map((data) => {
          let jc_id= data.id
          var vehiclefilter;
          if (this.makeSelected != "All" && this.modelSelected == "All") {
            vehiclefilter = JSON.parse(data.vehicle_details).make + " All";
          } else {
            vehiclefilter =
              JSON.parse(data.vehicle_details).make +
              " " +
              JSON.parse(data.vehicle_details).model;
          }
          if (selectedVehicle == "All All") {
            if (JSON.parse(data.jobcard_lubes_items).length != 0) {
              JSON.parse(data.jobcard_lubes_items).map((data) => {
                data["jc_id"] = jc_id
                ArrLubePartNUmber.push(data);
              });
            }
          } else {
            if (selectedVehicle == vehiclefilter) {
              if (JSON.parse(data.jobcard_lubes_items).length != 0) {
                JSON.parse(data.jobcard_lubes_items).map((data) => {
                  data["jc_id"] = jc_id
                  ArrLubePartNUmber.push(data);
                });
              }
            }
          }
        });
        const reportsGroupByLubePartNUmber = groupBy(
          ArrLubePartNUmber,
          "part_number"
        );
        this.getInventoryData(reportsGroupByLubePartNUmber, "lube");
      } else if (this.reportType == "job") {
        var ArrJobPartNUmber = Array();
        this.allReportData.map((data) => {
          var vehiclefilter;
          if (this.makeSelected != "All" && this.modelSelected == "All") {
            vehiclefilter = JSON.parse(data.vehicle_details).make + " All";
          } else {
            vehiclefilter =
              JSON.parse(data.vehicle_details).make +
              " " +
              JSON.parse(data.vehicle_details).model;
          }
          if (selectedVehicle == "All All") {
            if (JSON.parse(data.jobcard_job_items).length != 0) {
              JSON.parse(data.jobcard_job_items).map((data) => {
                ArrJobPartNUmber.push(data);
              });
            }
          } else {
            if (selectedVehicle == vehiclefilter) {
              if (JSON.parse(data.jobcard_job_items).length != 0) {
                JSON.parse(data.jobcard_job_items).map((data) => {
                  ArrJobPartNUmber.push(data);
                });
              }
            }
          }
        });
        const reportsGroupByJobPartNUmber = groupBy(
          ArrJobPartNUmber,
          "part_number"
        );
        this.getInventoryData(reportsGroupByJobPartNUmber, "job");
      }
    } else if (typeReport == "mec") {
      var mechanicname = Array();
      var mechanicData = Array();
      try {
        this.allReportData.map((countdata) => {
          JSON.parse(countdata.jobcard_mechanic).map((oneMec) => {
            var oneMeccnamed;
            oneMeccnamed = oneMec;

            if (typeof oneMec == "number") {
              if (!mechanicname.includes(oneMeccnamed)) {
                mechanicname.push(oneMeccnamed);
                mechanicData.push({
                  phone: "",
                  total: 0,
                  count: 1,
                  id: oneMeccnamed,
                  // add name later
                  // name: oneMeccnamed,
                  name: "",
                  lube: 0,
                  spare: 0,
                  job: 0,
                  //sania
                  discount: 0,
                  outjob: 0,
                  salary: "",
                  incen: "",
                });
                // parseInt(lubeData.unit_sale_price)
              } else {
                // mechanicData.map((mecdata) => {
                //   if (mecdata.name == oneMeccnamed) {
                //     mecdata.count = mecdata.count + 1;
                //   }
                // });
                mechanicData.map((mecdata) => {
                  if (mecdata.id == oneMeccnamed) {
                    mecdata.count = mecdata.count + 1;
                  }
                });
              }
            }
            // if (typeof oneMec == "string") {
            //   oneMeccnamed = oneMec;
            // } else {
            //   oneMeccnamed = oneMec.name;
            // }
          });
        });
        this.allReportData.map((data) => {
          // console.log("data", data)
          if (JSON.parse(data.settings_data_json).length == 1) {
            var settingsData = JSON.parse(data.settings_data_json)[0]
              .jobwise_mechanic;
          } else {
            var settingsData = JSON.parse(
              data.settings_data_json
            ).jobwise_mechanic;
          }
          if (settingsData == 1) {
            if (JSON.parse(data.jobcard_lubes_items).length != 0) {
              //console.log(JSON.parse(data.jobcard_lubes_items))
              JSON.parse(data.jobcard_lubes_items).map((lubes) => {
                // console.log("lubes", lubes)
                // if (lubes.lubeassignedmechanic != undefined && typeof lubes.lubeassignedmechanic != "string" ) {
                if (
                  lubes.lubeassignedmechanic != undefined &&
                  typeof lubes.lubeassignedmechanic != "string"
                ) {
                  if (lubes.lubeassignedmechanic.length != 0) {
                    lubes.lubeassignedmechanic.map((lubemec) => {
                      var lubename;
                      lubename = lubemec;
                      // if (typeof lubemec == "string") {
                      //   lubename = lubemec;
                      // } else {
                      //   lubename = lubemec.name;
                      // }
                      mechanicData.map((mecdata) => {
                        if (mecdata.id == lubename) {
                          //   mecdata.lube =
                          //     parseInt(mecdata.lube) +
                          //     parseInt(lubes.unit_sale_price);
                          //   mecdata.count = mecdata.count + 1;
                          // }
                          mecdata.lube =
                            parseInt(mecdata.lube) + parseInt(lubes.amount);
                        }
                      });
                    });
                  }
                }
              });
            }
            if (JSON.parse(data.jobcard_spare_items).length != 0) {
              //console.log(JSON.parse(data.jobcard_spare_items))
              JSON.parse(data.jobcard_spare_items).map((spares) => {
                // if (spares.spareassignedmechanic != undefined && typeof spares.spareassignedmechanic != "string") {
                if (
                  spares.spareassignedmechanic != undefined &&
                  typeof spares.spareassignedmechanic != "string"
                ) {
                  if (spares.spareassignedmechanic.length != 0) {
                    spares.spareassignedmechanic.map((sparemec) => {
                      var sparename;
                      sparename = sparemec;
                      // if (typeof sparemec == "string") {
                      //   sparename = sparemec;
                      // } else {
                      //   sparename = sparemec.name;
                      // }
                      mechanicData.map((mecdata) => {
                        if (mecdata.id == sparename) {
                          //   mecdata.spare =
                          //     parseInt(mecdata.spare) +
                          //     parseInt(spares.unit_sale_price);
                          // }
                          mecdata.spare =
                            parseInt(mecdata.spare) + parseInt(spares.amount);
                        }
                      });
                    });
                  }
                }
              });
            }
            if (JSON.parse(data.jobcard_job_items).length != 0) {
              //console.log(JSON.parse(data.jobcard_job_items))
              JSON.parse(data.jobcard_job_items).map((jobs) => {
                // if (jobs.jobassignedmechanic != undefined && typeof jobs.jobassignedmechanic != "string") {
                if (
                  jobs.jobassignedmechanic != undefined &&
                  typeof jobs.jobassignedmechanic != "string"
                ) {
                  if (jobs.jobassignedmechanic.length != 0) {
                    jobs.jobassignedmechanic.map((jobmec) => {
                      var jobname;
                      jobname = jobmec;
                      // if (typeof jobmec == "string") {
                      //   jobname = jobmec;
                      // } else {
                      //   jobname = jobmec.name;
                      // }

                      mechanicData.map((mecdata) => {
                        if (mecdata.id == jobname) {
                          if (jobs.job_subcategory == "in_house") {
                            // {
                            //   mecdata.job =
                            //     parseInt(mecdata.job) +
                            //     parseInt(jobs.unit_sale_price);
                            // } else {
                            //   mecdata.outjob =
                            //     parseInt(mecdata.outjob) +
                            //     parseInt(jobs.unit_sale_price);
                            // }
                            mecdata.job =
                              parseInt(mecdata.job) + parseInt(jobs.amount);
                          } else {
                            mecdata.outjob =
                              parseInt(mecdata.outjob) + parseInt(jobs.amount);
                          }

                          mecdata.discount = data.job_total_discount;
                        }
                      });
                    });
                  }
                }
              });
            }
          } else {
            JSON.parse(data.jobcard_mechanic).map((oneMec) => {
              var oneMeccname;
              oneMeccname = oneMec;
              // if (typeof oneMec == "string") {
              //   oneMeccname = oneMec;
              // } else {
              //   oneMeccname = oneMec.name;
              // }
              if (JSON.parse(data.jobcard_lubes_items).length != 0) {
                JSON.parse(data.jobcard_lubes_items).map((lubeData) => {
                  mechanicData.map((mecdata) => {
                    if (mecdata.id == oneMeccname) {
                      mecdata.lube =
                        parseInt(mecdata.lube) +
                        parseInt(lubeData.unit_sale_price);
                    }
                  });
                });
              }
              if (JSON.parse(data.jobcard_spare_items).length != 0) {
                JSON.parse(data.jobcard_spare_items).map((spareData) => {
                  mechanicData.map((mecdata) => {
                    if (mecdata.id == oneMeccname) {
                      mecdata.spare =
                        parseInt(mecdata.spare) +
                        parseInt(spareData.unit_sale_price);
                    }
                  });
                });
              }
              if (JSON.parse(data.jobcard_job_items).length != 0) {
                JSON.parse(data.jobcard_job_items).map((jobData) => {
                  mechanicData.map((mecdata) => {
                    if (mecdata.id == oneMeccname) {
                      if (jobData.job_subcategory == "in_house") {
                        mecdata.job =
                          parseInt(mecdata.job) +
                          parseInt(jobData.unit_sale_price);
                      } else {
                        mecdata.outjob =
                          parseInt(mecdata.outjob) +
                          parseInt(jobData.unit_sale_price);
                      }
                    }
                  });
                });
              }
            });
          }
        });
      } catch (e) {
        console.log("e", e);
      }

      this.getMechanicDataReport(mechanicData);
    } else if (typeReport == "counter") {
      this.allReportData.map((data) => {
        //console.log(data)
        data.created_at = data.created_at.split(" ")[0];
      });
      const reportsGroupByCreatedAt = groupBy(this.allReportData, "created_at");
      this.getCounterData(reportsGroupByCreatedAt);
    } else if (typeReport == "gst") {
      var onlygst = this.allReportData.filter(
        (data) => JSON.parse(data.settings_data_json).gst_number !== ""
      );
      // console.log("all report data", this.allReportData);
      // console.log(" data", onlygst.length);
      this.ReportHeader = "GST Report";
      this.gstTableData = [];
      this.gst_invoice_value = 0;
      this.gst_cgst = 0.0;

      onlygst.forEach((jobcard) => {
        this.gst_invoice_value += parseInt(jobcard.final_amount);
        // this.gst_cgst += parseInt(jobcard.sgst);
        // this.gst_sgst += parseInt(jobcard.cgst);
        var allItems = [
          ...JSON.parse(jobcard.jobcard_job_items),
          ...JSON.parse(jobcard.jobcard_lubes_items),
          ...JSON.parse(jobcard.jobcard_spare_items),
        ];
        // console.log("allItems", allItems);

        this.getGstReport(allItems, jobcard);
      });
    }
  }
  ///
  getGstReport(items, jobcard) {
    // console.log('items, jobcard', JSON.parse(items), jobcard)
   
    // console.log('type', typeof JSON.parse(items))
    let group = items.reduce((r, a) => {
      // console.log("a", a);
      // console.log("r", r);
      r[a.sale_gst_rate] = [...(r[a.sale_gst_rate] || []), a];
      return r;
    }, {});

    
    var sortedData = Object.entries(group);
    sortedData.map((dateGrouped) => {
      this.calculateGST(dateGrouped[0], dateGrouped[1], jobcard);
    });
    // console.log("this.table", this.gstTableData);
  }

  ///
  calculateGST(category, data, jobcard) {
    // jobcard can be jobcard, po, or counter sale
    
    let total_cgst = 0;
    let total_sgst = 0;
    let taxableAmount = 0;

    let amount_per_slab = 0.0;
    // console.log("look");
    // console.log("data", data);
    data.forEach((item) => {
      // console.log(
      //   "-----",
      //   parseFloat(item["unit_sale_price"]),
      //   item["sale_gst_rate"],
      //   item["sale_tax_type"],
      //   item["discountvalue"],
      //   parseFloat(item["quantity"]),
      //   item["discounttype"]
      // );
      let taxable = this.CalculateInclusiveGSTRateDiscounted(
        parseFloat(item["unit_sale_price"]),
        item["sale_gst_rate"],
        item["sale_tax_type"],
        item["discountvalue"],
        parseFloat(item["quantity"]),
        item["discounttype"]
      );
      // console.log("tacabel", taxable);
      // this.gst_cgst = parseInt(taxable[0]["CGST"]);
      taxableAmount += taxable[0]["taxableAmt"];
  

      total_cgst += taxable[0]["CGST"];
      total_sgst += taxable[0]["SGST"];

      this.gst_cgst += taxable[0]["SGST"];
      // amount_per_slab += taxableAmount + total_cgst + total_sgst;
    });
    amount_per_slab = taxableAmount + total_cgst + total_sgst;
    // here
    if (this.reportType == 'pogst'){
      this.gstTableData.push({
        date: jobcard.bill_date,
        created_at: jobcard.created_at,
        invoice_no: jobcard.po_no,
        invoice_value: jobcard.total_amount,
        gst_rate: category,
        amount: amount_per_slab,
        taxable_amt: taxableAmount.toFixed(2),
        cgst: total_cgst,
        sgst: total_sgst,
        gst_no: jobcard.supplier_id,
        jc_no: jobcard.bill_no,
      });

    }
    else if (this.reportType == 'csgst'){
      this.gstTableData.push({
        date: jobcard.invoice_date,
        created_at: jobcard.created_at,
        invoice_no: jobcard.invoice_no,
        invoice_value: jobcard.total_amount,
        gst_rate: category,
        amount: amount_per_slab,
        taxable_amt: taxableAmount.toFixed(2),
        cgst: total_cgst,
        sgst: total_sgst,
        gst_no: jobcard.gstActive,
        jc_no: jobcard.invoice_no,
      });

    }
    else{
    this.gstTableData.push({
      date: jobcard.closed_date,
      created_at: jobcard.created_at,
      invoice_no: jobcard.invoice_number,
      invoice_value: jobcard.final_amount,
      gst_rate: category,
      amount: amount_per_slab,
      taxable_amt: taxableAmount.toFixed(2),
      cgst: total_cgst,
      sgst: total_sgst,
      gst_no: jobcard.gst_number,
      jc_no: jobcard.jobcard_number,
    });
  }
  
    // this.gst_cgst += total_cgst;
    ////
    // const letters = new Set();
    // this.gstTableData.forEach(jc => letters.add(jc.invoice_no))
    // console.log(letters)
    this.dataSource = new MatTableDataSource(this.gstTableData);
  }

  ///
  CalculateInclusiveGSTRateDiscounted(
    price,
    rate,
    type,
    discount,
    quantity,
    discounttype
  ) {
    //my checks
    if (discount === undefined) {
      discount = 0;
      discounttype = "₹";
    }
    var taxableAmt = 0;
    if (discounttype == "₹") {
      if (type == "Inclusive") {
        var taxalbeamount =
          (parseFloat(price) * parseFloat(quantity)) /
            (1 + parseInt(rate) / 100) -
          parseInt(discount);
        var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
        var CGST = GSTAmount / 2;
        var SGST = CGST;
        taxableAmt = taxalbeamount;
        var totalamount = taxalbeamount + GSTAmount;
      } else {
        var taxalbeamount =
          parseFloat(price) * parseFloat(quantity) - parseInt(discount);
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
          (parseInt(discount) / 100);
        var taxalbeamount =
          (parseFloat(price) * parseFloat(quantity)) /
            (1 + parseInt(rate) / 100) -
          discountamount;
        //
        taxableAmt = taxalbeamount;
        var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
        var CGST = GSTAmount / 2;
        var SGST = CGST;
        var totalamount = taxalbeamount + GSTAmount;
      } else {
        var discountamount =
          parseFloat(price) * parseFloat(quantity) * (parseInt(discount) / 100);
        var taxalbeamount =
          parseFloat(price) * parseFloat(quantity) - discountamount;

        //
        // console.log("checkkkkk tax amt a& dis", taxableAmt, discountamount);
        var GSTAmount = taxalbeamount * (parseInt(rate) / 100);
        var CGST = GSTAmount / 2;
        var SGST = CGST;
        //
        taxableAmt = taxalbeamount;
        var totalamount = taxalbeamount + GSTAmount;
      }
    }
    var amountarr = [];
    // amountarr.push({
    //   GSTAmount: GSTAmount.toFixed(2),
    //   CGST: CGST.toFixed(2),
    //   SGST: SGST.toFixed(2),
    //   totalamount: totalamount.toFixed(2),
    //   type: type,
    //   taxableAmt: taxableAmt,
    // });
    amountarr.push({
      GSTAmount: GSTAmount,
      CGST: CGST,
      SGST: SGST,
      totalamount: totalamount,
      type: type,
      taxableAmt: taxableAmt,
    });
    //my checks
    // console.log("taxable amount", taxableAmt);
    // console.log("amtattr", amountarr);
    return amountarr;
    // return taxableAmt;
  }

  //sort or group by reports for cutsomer search
  groupByCutsomerSearchReport(typeReport) {
    this.showspinner.setSpinner(true);
    var groupBy = (array, key) => {
      return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
          currentValue
        );
        return result;
      }, {});
    };

    this.allReportData.map((data) => {
      data.cutsomer_name = data.cutsomer_name + " " + data.customer_mobile;
      data.closed_date = new Date(data.closed_date);
    });
    const reportsGroupByvehicleNumber = groupBy(
      this.allReportData,
      "cutsomer_name"
    );
    this.getCutsomerData(reportsGroupByvehicleNumber, true);
  }
  //sort or group by service reports
  groupByServiceReports(typeReport) {
    this.showspinner.setSpinner(true);
    var groupBy = (array, key) => {
      return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
          currentValue
        );
        return result;
      }, {});
    };
    this.allReportData.map((data) => {
      data.cutsomer_name = data.cutsomer_name + " " + data.customer_mobile;
      data.created_at = new Date(data.created_at);
    });
    const reportsGroupSericesDue = groupBy(this.allReportData, "cutsomer_name");
    console.log('groupByServiceReports', this.allReportData)
    this.getServiceData(reportsGroupSericesDue);
  }

  groupByServiceReportsE(typeReport) {
    this.showspinner.setSpinner(true);
    var groupBy = (array, key) => {
      return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
          currentValue
        );
        return result;
      }, {});
    };

    this.allServices.map((data) => {
      data.cutsomer_name = data.cutsomer_name + " " + data.customer_mobile;
      data.created_at = new Date(data.estimated_delivery_datetime);
    });

    const groupSericesDue = groupBy(this.allServices, "cutsomer_name");
    console.log('groupSericesDue', groupSericesDue)
    console.log('this.allServices', this.allServices)
    this.getServiceDataE(groupSericesDue);
  }
  //---------------------------End Reports Section------------------------------------------------------------------------------
  //-----------------------------Revenue Data--------------------------------------------------------------------------
  // get Tabel Data for revenue
  public footerRevenueData = {};
  getRevenueData(groupedData) {
    this.revenueTabelData = [];
    this.footerRevenueData = {
      discount: 0,
      balance: 0,
      received: 0,
      total: 0,
      final: 0,
      spareTotal: 0,
      lubeTotal: 0,
      joboutTotal: 0,
      jobTotal: 0,
    };

    this.ReveueCSVData = [];
    if (groupedData != undefined) {
      if (groupedData.length != 0) {
        var sortedData = Object.entries(groupedData);
        sortedData.map((dateGrouped) => {
          this.sortData(dateGrouped[1], dateGrouped[0]);
        });
        this.calculteAllTotalRevenue();
      }
    }
  }

  //Sort the revenue data
  sortData(arrayData, dategroup) {
    console.log('arrayData',arrayData)
    console.log('dategroup',dategroup)
    var total = 0;

    var discount = 0;
    var final = 0;
    var advance = 0;
    var received = 0;
    var balance = 0;
    var spareTotal = 0;
    var lubeTotal = 0;
    var joboutTotal = 0;
    var jobTotal = 0;
    arrayData.map((data) => {
      total = total + parseInt(data.total_amount);
      final = final + parseInt(data.final_amount);
      advance = advance + parseInt(data.advance);
      received = received + parseInt(data.paid_amount);
      balance = balance + parseInt(data.balance_amount);

      this.footerRevenueData["total"] += parseInt(data.total_amount);
      this.footerRevenueData["final"] += parseInt(data.final_amount);
      this.footerRevenueData["received"] +=
        parseInt(data.paid_amount) + parseInt(data.advance);
      this.footerRevenueData["balance"] += parseInt(data.balance_amount);

      var jobtotalForCSV = 0;
      var sparetotalForCSV = 0;
      var lubetotalForCSV = 0;
      var jobtotalForCSVout = 0;
      if (data.discount.split(" ")[1] == "%") {
        var numVal1 = parseInt(data.total_amount);
        var numVal2 = parseInt(data.discount.split(" ")[0]) / 100;
        var totalValue = numVal1 - numVal1 * numVal2;
        var finalvalue = parseInt(data.total_amount) - totalValue;
        discount = discount + finalvalue;
        this.footerRevenueData["discount"] += discount;
      } else {
        discount = discount + parseInt(data.discount.split(" ")[0]);
        this.footerRevenueData["discount"] += discount;
      }
      // console.log("data", data);
      var sparedata = JSON.parse(data.jobcard_spare_items);
      var lubedata = JSON.parse(data.jobcard_lubes_items);
      var jobdata = JSON.parse(data.jobcard_job_items);
      if (sparedata.length != 0) {
        sparedata.map((dataspare) => {
          spareTotal = spareTotal + parseInt(dataspare.amount);
          sparetotalForCSV = sparetotalForCSV + parseInt(dataspare.amount);
          this.footerRevenueData["spareTotal"] += parseInt(dataspare.amount);
        });
      }
      if (lubedata.length != 0) {
        lubedata.map((datalube) => {
          lubeTotal = lubeTotal + parseInt(datalube.amount);
          lubetotalForCSV = lubetotalForCSV + parseInt(datalube.amount);
          this.footerRevenueData["lubeTotal"] += parseInt(datalube.amount);
        });
      }
      if (jobdata.length != 0) {
        jobdata.map((datajob) => {
          if (datajob.job_subcategory == "in_house") {
            jobTotal = jobTotal + parseInt(datajob.amount);
            jobtotalForCSV = jobtotalForCSV + parseInt(datajob.amount);
            this.footerRevenueData["jobTotal"] += parseInt(datajob.amount);
          } else {
            joboutTotal = joboutTotal + parseInt(datajob.amount);
            jobtotalForCSVout = jobtotalForCSVout + parseInt(datajob.amount);
            this.footerRevenueData["joboutTotal"] += parseInt(datajob.amount);
          }
        });
      }
      
      this.ReveueCSVData.push({
        date: data.closed_date,
        "Jobcard Number": data.jobcard_number,
        "Customer Name": data.cutsomer_name,
        "Mobile Number": data.customer_mobile,
        "Vehicle Number": data.vehicle_number,
        "Vehicle Make Model varient ":
          JSON.parse(data.vehicle_details).make +
          " " +
          JSON.parse(data.vehicle_details).model +
          " " +
          JSON.parse(data.vehicle_details).variant,
          KM: data.km,
        discount: data.discount,
        balance: data.balance_amount,
        received: parseInt(data.paid_amount) + parseInt(data.advance),
        total: data.total_amount ? data.total_amount : data.amount,
        final: data.final_amount,
        spareTotal: sparetotalForCSV,
        lubeTotal: lubetotalForCSV,
        joboutTotal: jobtotalForCSVout,
        jobTotal: jobtotalForCSV,
        // "Assign Mechanic": JSON.parse(data.jobcard_mechanic).toString(),
        "Payment Method": data.payment_mode,
        "gst(Rs.)": data.total_gst,
        "cgst(Rs.)": data.cgst,
        "sgst(Rs.)": data.sgst,
      });
    });
    this.revenueTabelData.push({
      date: new Date(dategroup),
      discount: Math.round(discount),
      balance: balance,
      received: received + advance,
      total: total,
      final: final,
      spareTotal: spareTotal,
      lubeTotal: lubeTotal,
      joboutTotal: joboutTotal,
      jobTotal: jobTotal,
    });
    this.revenueTabelData.sort(function (a, b) {
      return b.date - a.date;
    });
    this.data = this.revenueTabelData;
    this.dataSource = new MatTableDataSource(this.revenueTabelData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  calculteAllTotalRevenue() {
    this.totalRevenueData = [];
    var total = 0;
    var discount = 0;
    var final = 0;
    var received = 0;
    var balance = 0;
    var spareTotal = 0;
    var lubeTotal = 0;
    var joboutTotal = 0;
    var jobTotal = 0;
    this.revenueTabelData.map((amounts) => {
      this.doughnutChartLabels = [];
      this.doughnutChartData = [];
      total = total + parseInt(amounts.total);
      discount = discount + parseInt(amounts.discount);
      received = received + parseInt(amounts.received);
      final = final + parseInt(amounts.final);
      balance = balance + parseInt(amounts.balance);
      spareTotal = spareTotal + parseInt(amounts.spareTotal);
      lubeTotal = lubeTotal + parseInt(amounts.lubeTotal);
      joboutTotal = joboutTotal + parseInt(amounts.joboutTotal);
      jobTotal = jobTotal + parseInt(amounts.jobTotal);
    });
    this.totalRevenueData.push(
      {
        name: "Total Labour:",
        amount: jobTotal + joboutTotal,
        css: { "font-weight": "600", color: "#7d7d7b" },
      },
      {
        name: "Total Spare:",
        amount: spareTotal,
        css: { "font-weight": "600", color: "#7d7d7b" },
      },
      {
        name: "Total Lubes:",
        amount: lubeTotal,
        css: { "font-weight": "600", color: "#7d7d7b" },
      },
      { name: "Total:", amount: total, css: { color: "#42413D" } },
      {
        name: "Total Discount:",
        amount: discount,
        css: { "font-weight": "600", color: "#7d7d7b" },
      },
      {
        name: "Total Received:",
        amount: received,
        css: { "font-weight": "600", color: "#7d7d7b" },
      },
      { name: "Pending Bal:", amount: balance, css: { color: "#c30707" } }
    );
    this.doughnutChartLabels = ["Discount", "Received Amount", "Balance"];
    this.doughnutChartData = [discount, received, balance];
    this.donutscharts = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        height: 205,
        width: 250,
        plotShadow: false,
      },
      title: {
        text: "",
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: 5,
            style: {
              fontWeight: "bold",
              color: "#444449",
            },
          },
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          type: "pie",
          name: "% Share",
          innerSize: "50%",
          data: [
            ["Discount", discount],
            ["Received Amount", received],
            ["Balance", balance],
          ],
        },
      ],
    };
    this.doughnutChartColors.push({
      borderColor: "none",
      backgroundColor: ["#7db5ec", "#e4d355", "#90ed7e"],
    });
    this.showspinner.setSpinner(false);
  }
  //-----------------------------End Revenue Data--------------------------------------------------------------------------
  //----------------------------Counter Report-----------------------------------------------------------------------------
  getCounterData(groupedData) {
    this.counterTabelData = [];
    this.footerCounterData = {
      balance: 0,
      received: 0,
      total: 0,
    };
    if (groupedData != undefined) {
      if (groupedData.length != 0) {
        var sortedData = Object.entries(groupedData);
        sortedData.map((dateGrouped) => {
          this.sortCounterData(dateGrouped[1], dateGrouped[0]);
        });
        this.calculteAllTotalCounter();
      }
    }
  }
  public footerCounterData = {};
  //Sort the revenue data
  sortCounterData(arrayData, dategroup) {
    var total = 0;
    var received = 0;
    var balance = 0;
    arrayData.map((data) => {
      total = total + parseInt(data.total_amount);
      received = received + parseInt(data.paid);
      balance = balance + parseInt(data.balance);

      this.footerCounterData["total"] += parseInt(data.total_amount);
      this.footerCounterData["received"] += parseInt(data.paid);
      this.footerCounterData["balance"] += parseInt(data.balance);
      var newvalue;
      newvalue = this.calTotalBalanceInCounter(
        arrayData,
        data.counter_cus_id,
        data.workshop_id
      );
      //console.log(newvalue)
      this.counterCSVData.push({
        cusid: data.counter_cus_id,
        date: data.created_at,
        "Invoice Number": data.invoice_no,
        "Customer Name": data.customer_name,
        "Mobile Number": data.customer_mobile,
        "Vehicle Number": "",
        discount: data.discount,
        balance: data.balance,
        received: data.paid,
        total: data.total_amount,
        final: data.final_amount,
        TotalBalance: newvalue,
      });
    });
    this.counterTabelData.push({
      date: new Date(dategroup),
      balance: balance,
      received: received,
      total: total,
    });
    this.counterTabelData.sort(function (a, b) {
      return b.date - a.date;
    });
    this.counterCSVDatadup = this.counterCSVData.reduce(
      (a, { cusid, TotalBalance }) => (
        (a[cusid] = (a[cusid] || 0) + +TotalBalance), a
      ),
      {}
    );

    this.data = this.counterTabelData;
    this.dataSource = new MatTableDataSource(this.counterTabelData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  // Counter sale balance count
  calTotalBalanceInCounter(object, id, work) {
    return object.reduce(function (sum, record) {
      if (record.counter_cus_id === id && record.workshop_id === work)
        return sum + parseFloat(record.balance);
      else return sum;
    }, 0);
  }
  // total count of counter slae
  calculteAllTotalCounter() {
    this.totalCounterData = [];
    var total = 0;
    var received = 0;
    var balance = 0;
    this.counterTabelData.map((amounts) => {
      this.doughnutChartLabels = [];
      this.doughnutChartData = [];
      total = total + parseInt(amounts.total);
      received = received + parseInt(amounts.received);
      balance = balance + parseInt(amounts.balance);
    });
    this.totalCounterData.push(
      { name: "Total:", amount: total, css: { color: "#42413D" } },
      {
        name: "Total Received:",
        amount: received,
        css: { "font-weight": "600", color: "#7d7d7b" },
      },
      { name: "Pending Bal:", amount: balance, css: { color: "#c30707" } }
    );
    this.doughnutChartLabels = ["Total", "Received Amount", "Balance"];
    this.doughnutChartData = [total, received, balance];
    this.donutscharts = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        height: 205,
        width: 250,
        plotShadow: false,
      },
      title: {
        text: "",
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: 5,
            style: {
              fontWeight: "bold",
              color: "#444449",
            },
          },
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          type: "pie",
          name: "% Share",
          innerSize: "50%",
          data: [
            ["Total", total],
            ["Received Amount", received],
            ["Balance", balance],
          ],
        },
      ],
    };
    this.doughnutChartColors.push({
      borderColor: "none",
      backgroundColor: ["#7db5ec", "#e4d355", "#90ed7e"],
    });
    this.showspinner.setSpinner(false);
  }
  //------------------------------END Counter Report------------------------------------------------------------------------
  //-----------------------------Customer Data--------------------------------------------------------------------------
  //get Tabel Data for customer
  getCutsomerData(groupedData, falg) {
    this.customerTabelData = [];
    this.cutsomerGroupedData = [];
    if (falg == true) {
      this.cutsomerGroupedData = groupedData;
    }
    if (groupedData != undefined) {
      if (groupedData.length != 0) {
        var sortedData = Object.entries(groupedData);
        sortedData.map((dateGrouped) => {
          this.sortDataCustomer(dateGrouped[1], dateGrouped[0], falg);
        });
        this.customerSummation();
        if (falg == false) {
          this.calculteAllTotalCustomer();
        }
      }
    }
  }
  //Sort the revenue data
  sortDataCustomer(arrayData, customergroup, falg) {
    var total = 0;
    var discount = 0;
    var final = 0;
    var advance = 0;
    var received = 0;
    var balance = 0;
    var vehicleDetails;
    var customerdetails;
    var Difference_In_Days;
    var diffrencedate;
    var customernameforexel;
    var customerphoneforexel;
    var createdateforexel;
    var closedateforexel;
    var sortedarraydata = arrayData.sort(function (a, b) {
      return a.closed_date - b.closed_date;
    });
    sortedarraydata.map((data) => {
      var getBalance = false;

      total = total + parseInt(data.total_amount);
      final = final + parseInt(data.final_amount);
      advance = advance + parseInt(data.advance);
      received = received + parseInt(data.paid_amount);
      balance = balance + parseInt(data.balance_amount);
      if (getBalance == false) {
        if (parseInt(data.balance_amount) != 0) {
          getBalance = true;
          diffrencedate = data.closed_date;
          var date1 = data.closed_date;
          var date2 = new Date();
          Difference_In_Days = Math.floor(
            (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)
          );
        }
      }

      if (data.discount.split(" ")[1] == "%") {
        var numVal1 = parseInt(data.total_amount);
        var numVal2 = parseInt(data.discount.split(" ")[0]) / 100;
        var totalValue = numVal1 - numVal1 * numVal2;
        var finalvalue = parseInt(data.total_amount) - totalValue;
        discount = discount + finalvalue;
      } else {
        discount = discount + parseInt(data.discount.split(" ")[0]);
      }
      if (falg == false) {
        this.customerfalg = falg;
        this.displayedColumns = [
          "customer_details",
          "vehicle_details",
          "total",
          "discount",
          "final_amount",
          "received_amount",
          "balance",
          "days",
          "action",
        ];

        vehicleDetails =
          data.vehicle_number.split(" ")[0] +
          " (" +
          JSON.parse(data.vehicle_details).make +
          " " +
          JSON.parse(data.vehicle_details).model +
          " " +
          JSON.parse(data.vehicle_details).variant +
          " )";
        customerdetails = data.cutsomer_name + " " + data.customer_mobile;
      } else {
        this.customerfalg = falg;
        this.displayedColumns = [
          "select",
          "customer_details",
          "vehicle_details",
          "total",
          "discount",
          "final_amount",
          "received_amount",
          "balance",
          "days",
          "action",
        ];
        vehicleDetails =
          data.vehicle_number.split(" ")[0] +
          " (" +
          JSON.parse(data.vehicle_details).make +
          " " +
          JSON.parse(data.vehicle_details).model +
          " " +
          JSON.parse(data.vehicle_details).variant +
          " )";
        customerdetails = customergroup;
      }
      customernameforexel = data.cutsomer_name;
      customerphoneforexel = data.customer_mobile;
      createdateforexel = data.created_at;
      closedateforexel = data.closed_date;
    });
    if (Difference_In_Days == undefined) {
      Difference_In_Days = "-";
    }
    if (diffrencedate == undefined) {
      diffrencedate = "none";
    }
    this.customerTabelData.push({
      customer: customerdetails,
      Difference_In_Days: Difference_In_Days,
      discount: Math.round(discount),
      balance: balance,
      received: received + advance,
      total: total,
      final: final ,
      vehicledetails: vehicleDetails,
      diffrencedate: diffrencedate,
      falg: falg,
      customer_name: customernameforexel,
      customer_phone: customerphoneforexel,
      create_date: createdateforexel,
      close_date: closedateforexel,
    });
    this.customerTabelData.sort(function (a, b) {
      return parseFloat(b.balance) - parseFloat(a.balance);
    });

    this.data = this.customerTabelData;
    this.dataSource = new MatTableDataSource(this.customerTabelData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  // Top 5 Pending Balnce Customers
  customerSummation() {
    var total = 0;
    var discount = 0;
    var finalAmount = 0;
    var receivedAmount = 0;
    var pendingBalance = 0;

    this.customerTabelData.map((data) => {
      total += data.total;
      discount += data.discount;
      finalAmount += data.final;
      receivedAmount += data.received;
      pendingBalance += data.balance;
    });
    this.totalCustomerData = [];
    this.totalCustomerData.push({
      total: total,
      discount: discount,
      finalAmount: finalAmount,
      receivedAmount: receivedAmount,
      pendingBalance: pendingBalance,
    });
  }

  calculateTopPendingBalance(){
    // let tempTable = this.pendingCustomerTabelData
    this.ReportRowsData =[]
    let sortedPendingData = this.pendingCustomerTabelData.sort(function(a, b){
      return b.balance_amount - a.balance_amount 
    })
    // let sortedPendingData = this.pendingCustomerTabelData

    let topFive=null
    sortedPendingData.length <= 5 ? topFive = sortedPendingData 
     : topFive = sortedPendingData.slice(0, 5)
    

     topFive.forEach(customer =>{
      this.ReportRowsData.push(
        {
          name: customer.cutsomer_name,
          vehicle: customer.total_amount,
          date: customer.balance_amount,
        }
      )
    })
    this.ReportRows = ["Customer Name", "Invoice Amount", "Balance Amount"];
  }
  calculteAllTotalCustomer() {
    this.ReportRows = [];
    this.ReportRowsData = [];
    this.customerTabelData.map((data) => {
      if (this.ReportRowsData.length != 5) {
        if (data.balance != 0) {
          this.ReportRowsData.push({
            name: data.customer,
            vehicle: data.total,
            date: data.balance,
          });
        }
      }
    });
    this.ReportRows = ["Customer Details", "Invoice Amount", "Balance Amount"];
    // var total = 0;
    // var discount = 0;
    // var finalAmount = 0;
    // var receivedAmount = 0;
    // var pendingBalance = 0;

    // this.customerTabelData.map((data) => {
    //   total += data.total;
    //   discount += data.discount;
    //   finalAmount += data.final;
    //   receivedAmount += data.received;
    //   pendingBalance += data.balance;
    // });
    // this.totalCustomerData = [];
    // this.totalCustomerData.push({
    //   total: total,
    //   discount: discount,
    //   finalAmount: finalAmount,
    //   receivedAmount: receivedAmount,
    //   pendingBalance: pendingBalance,
    // });
  }
  //Search Cutsomer API
  searchCustomerData() {
    if (this.searchData != "") {
      this.allReportData = [];
      this.arraytoDownlaodCutsomerDetails = [];
      this.getindexarr = [];
      this.generalService
        .getCustomerSearchReports(this.userserviceworkshopid, this.searchData)
        .subscribe(
          (reports) => {
            this.showspinner.setSpinner(true);
            if (reports["success"] == true) {
              this.allReportData = reports["data"];
              this.searchData = "";
              this.groupByCutsomerSearchReport("cus");
            } else {
              this.snakBar.open("Message", "No Reports Found", {
                duration: 4000,
              });
            }
            this.showspinner.setSpinner(false);
          },
          (err) => {
            this.showspinner.setSpinner(false);
            this.snakBar.open("err", ErrorMessgae[0][err], {
              duration: 4000,
            });
          }
        );
    } else {
      this.snakBar.open("Message", "Please Enter Customer Mobile No OR Name", {
        duration: 2000,
      });
    }
  }
  //Checkbox To Downlaod PDF
  downlaodPDFCheck(event, SelectedData, index) {
    var pusharr = [];
    var cutsomerdetails = SelectedData.customer;
    if (event.target.checked == true) {
      pusharr = this.cutsomerGroupedData[cutsomerdetails];
      this.arraytoDownlaodCutsomerDetails.push({ [cutsomerdetails]: pusharr });
      this.getindexarr.push({ name: cutsomerdetails });
    } else {
      var indexremove;
      indexremove = this.getindexarr.findIndex(
        (x) => x.name === cutsomerdetails
      );
      this.getindexarr.splice(indexremove, 1);
      this.arraytoDownlaodCutsomerDetails.splice(indexremove, 1);
    }
  }
  // pdf downlaod
  dowloadpdf() {
    if (this.arraytoDownlaodCutsomerDetails.length == 0) {
      this.snakBar.open(
        "Message",
        "Please Select the Cutsomer to Downlaod the Report",
        {
          duration: 4000,
        }
      );
    } else {
      var allCustomerDetails;
      var billingSettings;
      var allData;
      var name;
      var startDateor = new Date(this.FronDateField);
      var endDateor = new Date(this.ToDateField);
      var startDate =
        startDateor.getFullYear() +
        "-" +
        ("0" + (startDateor.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + startDateor.getDate()).slice(-2);
      var endtDate =
        endDateor.getFullYear() +
        "-" +
        ("0" + (endDateor.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + endDateor.getDate()).slice(-2);
      this.generalService
        .getJobcardSettings(this.userserviceworkshopid)
        .subscribe(
          (SettingDtaa) => {
            this.showspinner.setSpinner(false);
            if (SettingDtaa.success == true) {
              billingSettings = JSON.parse(
                SettingDtaa.jobcard_Settings.settings_billing.replace(/\\/g, "")
              )[0];
              this.arraytoDownlaodCutsomerDetails.map((data) => {
                this.generalService
                  .getVechileCustomerDetail(
                    this.userserviceworkshopid,
                    Object.values(data)[0][0]["workshop_customer_id"],
                    "by_id"
                  )
                  .subscribe(
                    (cutsomerData) => {
                      if (cutsomerData.success == true) {
                        allCustomerDetails = cutsomerData.customer;
                        name =
                          Object.keys(data) +
                          "-report-" +
                          this.userserviceworkshopid +
                          "-(" +
                          startDate +
                          "---" +
                          endtDate +
                          ")";
                        (".csv");
                        allData = Object.values(data)[0];
                        this.pdfdownlaod(
                          allData,
                          billingSettings,
                          allCustomerDetails,
                          name
                        );
                      } else {
                        this.snakBar.open("Message", "No Cutsomrer Data", {
                          duration: 4000,
                        });
                      }
                      this.showspinner.setSpinner(false);
                    },
                    (err) => {
                      this.showspinner.setSpinner(false);
                      this.snakBar.open("err", ErrorMessgae[0][err], {
                        duration: 4000,
                      });
                    }
                  );
              });
            } else {
              this.snakBar.open("Message", "No Billing Settings", {
                duration: 4000,
              });
            }
            this.showspinner.setSpinner(false);
          },
          (err) => {
            this.showspinner.setSpinner(false);
            this.snakBar.open("err", ErrorMessgae[0][err], {
              duration: 4000,
            });
          }
        );
    }
  }
  //pdf
  pdfdownlaod(allData, billingSettings, allCustomerDetails, name) {
    var documentDefinition;
    documentDefinition = this.pdfService.generatePDF(
      allData,
      billingSettings,
      allCustomerDetails
    );

    //pdfMake.createPdf(documentDefinition).open();
    pdfMake.createPdf(documentDefinition).download(name);
  }
  //send reminder
  sendReminderMessage(data) {
    var vehicle = data.vehicledetails.split("(")[1].split(")")[0];
    var datetomessage = data.diffrencedate.toString().split(" ");
    var Message =
      "Dear Customer, Payment of Rs. " +
      data.balance +
      "/- is pending against " +
      vehicle +
      " on " +
      datetomessage[2] +
      " " +
      datetomessage[1] +
      " Make the payment as soon as possible. -" +
      this.userService.getData()["workshop_name"] +
      " " +
      this.userService.getData()["workshop_mobile_number_1"];
    var date = new Date();
    var month = date.getMonth() + 1;
    var parseddate = date.getFullYear() + "-" + month + "-" + date.getDate();
    var phonenumber =
      data.customer.split(" ")[data.customer.split(" ").length - 1];
    this.generalService
      .sendsms(
        this.userserviceworkshopid,
        "pedning",
        phonenumber,
        Message,
        "reminder_pending",
        parseddate,
        "no"
      )
      .subscribe(
        (sendsms) => {
          this.showspinner.setSpinner(true);
          this.snakBar.open("Message", "Sending SMS", {
            duration: 4000,
          });
          if (sendsms.success == true) {
            this.snakBar.open("Message", "Message Sent Successfully", {
              duration: 4000,
            });
          }
          this.showspinner.setSpinner(false);
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("err", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  //-----------------------------End Customer Data--------------------------------------------------------------------------
  //-----------------------------Vehicle Data--------------------------------------------------------------------------
  //get Tabel Data for vehicle

  public footerVehicleData = {};
  getVehicleData(groupedData, falg) {
    this.vehicleTabelData = [];
    this.footerVehicleData = { total: 0, count: 0 };
    if (groupedData != undefined) {
      if (groupedData.length != 0) {
        var sortedData = Object.entries(groupedData);
        sortedData.map((dateGrouped) => {
          this.sortDataVehicle(dateGrouped[1], dateGrouped[0], falg);
        });

        if (falg == false) {
          this.calculteAllTotalVehicle();
        }
      }
    }
  }

  //Sort the Vehicle data
  sortDataVehicle(arrayData, customergroup, falg) {
    var total = 0;
    var count = 0;
    count = arrayData.length;
    arrayData.map((data) => {
      total = total + parseInt(data.total_amount);
    });
    this.vehicleTabelData.push({
      total: total,
      vehicledetails: customergroup,
      count: count,
    });
    //------------footer cal---------------
    this.footerVehicleData["total"] += total;
    this.footerVehicleData["count"] += count;
    //--------------end--------------------
    this.vehicleTabelData.sort(function (a, b) {
      return parseFloat(b.count) - parseFloat(a.count);
    });
    this.data = this.vehicleTabelData;
    this.dataSource = new MatTableDataSource(this.vehicleTabelData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  // Top 5 Vehicle Served
  calculteAllTotalVehicle() {
    this.ReportRows = [];
    this.ReportRowsData = [];
    this.vehicleTabelData.map((data) => {
      if (this.ReportRowsData.length != 5) {
        if (data.count != 0) {
          if (data.total != 0) {
            this.ReportRowsData.push({
              name: data.vehicledetails,
              vehicle: data.count,
              date: data.total,
            });
          }
        }
      }
    });
    this.ReportRows = ["Vehicle Name", "Count", "Total Amount"];
  }
  //-----------------------------End Vehicle Data--------------------------------------------------------------------------
  //-----------------------------Inventory Data--------------------------------------------------------------------------
  public footerInventoryData = {};
  //get Tabel Data for Inventory

  getInventoryData(groupedData, falg) {
    this.InventoryTabelData = [];
    // my checks
    // console.log("groupedData", groupedData);

    this.footerInventoryData = {
      totalSoldQty: 0,
      totalQty: 0,
      sellingprice: 0,
      totalSold: 0,
      profit: 0,

      totalCostPrice: 0,
    };
    // this.footerProfit = 0;
    this.footerPurchasePrice = 0;
    if (groupedData != undefined) {
      if (groupedData.length != 0) {
        var sortedData = Object.entries(groupedData);
        sortedData.map((dateGrouped) => {
          this.sortDataInventory(dateGrouped[1], dateGrouped[0], falg);
        });

        // this.footerProfit = (
        //   (this.footerInventoryData["profit"] /
        //     this.footerInventoryData["totalCostPrice"]) *
        //   100
        // ).toFixed(2);

        // this.footerProfit =
        //   this.footerInventoryData["profit"] /
        //   this.footerInventoryData["totalCostPrice"];

        // console.log("this.footerInventoryData", this.footerInventoryData);
        // console.log(
        //   ((-2830 / 21260) * 100).toFixed(2),
        //   this.footerInventoryData["profit"],
        //   this.footerInventoryData["totalCostPrice"],

        //   this.footerProfit,
        //   typeof this.footerProfit,
        //   typeof this.footerInventoryData["profit"],
        //   typeof this.footerInventoryData["totalCostPrice"]
        // );
        setTimeout(() => this.calculteAllTotalInventory(), 1000);
      }
    }
  }
  //Sort the Inventory data
  sortDataInventory(arrayData, customergroup, falg) {
    // console.log(arrayData)
    // console.log(customergroup)
    // console.log(falg)

    var total = 0;
    var count = 0;
    var profit = 0;
    var profitpercent = 0;
    var totalUnitpurchasePrice = 0;
    var partname;
    var partcompany;
    var sellingprice;
    var finalamounr;
    var partcurrent;
    var totalfinalamount = 0;
    count = 0;
    console.log('arrayData', arrayData)
    console.log('customergroup', customergroup)
    this.generalService
      .getRepoCurrentInvenQuantity(this.userserviceworkshopid, customergroup)
      .subscribe((Data) => {
        if (Data.success == true) {
          arrayData.map((data) => {
            var unitpricecal = 0;
            unitpricecal =
              parseInt(data.unit_purchase_price) * parseInt(data.quantity);
            total = total + parseInt(data.total_amount);
            totalfinalamount += parseInt(data.amount);
            count = count + parseInt(data.quantity);
            // count = count + parseFloat(data.quantity);
            console.log('count', count)
            if (isNaN(count)){
              console.log('data', data)

            }
            partname = data.part_name;
            partcompany = data.company_name;
            partcurrent = Data.senddata[0]["quant"];
            sellingprice = parseInt(data.unit_sale_price);
            finalamounr = parseInt(data.amount);
            if (falg != "job") {
              if (parseInt(data.unit_purchase_price) != 0) {
                totalUnitpurchasePrice +=
                  parseInt(data.unit_purchase_price) * parseInt(data.quantity);
                profit += finalamounr - unitpricecal;
              } else {
                profit = profit + 0;
                totalUnitpurchasePrice = totalUnitpurchasePrice + 0;
              }
            }
          });

          profitpercent += profit / totalUnitpurchasePrice;
          //my edition
          this.footerPurchasePrice += totalUnitpurchasePrice;
          this.footerProfit += profit;

          this.footerInventoryData["totalSoldQty"] += count;
          this.footerInventoryData["totalQty"] += partcurrent;
          this.footerInventoryData["sellingprice"] += parseFloat(
            (totalfinalamount / count).toFixed(2)
          );
          this.footerInventoryData["totalSold"] += totalfinalamount;
          this.footerInventoryData["profit"] += Math.round(profit);
          // this.footerInventoryData["profitpercent"] += profitpercent * 100;
          this.footerInventoryData["totalCostPrice"] += totalUnitpurchasePrice;

          if (falg != "job") {
            this.InventoryTabelData.push({
              partnumber: customergroup,
              partname: partname,
              partcompany: partcompany,
              count: count,
              avaliableqty: partcurrent,
              sellingprice: (totalfinalamount / count).toFixed(2),
              totalsoldprice: totalfinalamount,
              profit: Math.round(profit),
              profitpercent: profitpercent * 100,
            });
          } else {
            this.InventoryTabelData.push({
              partnumber: customergroup,
              partname: partname,
              count: count,
              sellingprice: sellingprice,
              totalsoldprice: sellingprice * count,
            });
          }
          this.InventoryTabelData.sort(function (a, b) {
            return parseFloat(b.count) - parseFloat(a.count);
          });
          this.data = this.InventoryTabelData;
          this.dataSource = new MatTableDataSource(this.InventoryTabelData);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }
      });
  }

  // Top 5 Inventory Served
  calculteAllTotalInventory() {
    this.ReportRows = [];
    this.ReportRowsData = [];
    this.InventoryTabelData.map((data) => {
      if (this.ReportRowsData.length != 5) {
        if (data.count != 0) {
          if (this.reportType != "job") {
            this.ReportRowsData.push({
              name: data.partname,
              vehicle: data.partcompany,
              date: data.count,
            });
          } else {
            this.ReportRowsData.push({
              name: data.partname,
              vehicle: "",
              date: data.count,
            });
          }
        }
      }
    });
    if (this.reportType != "job") {
      this.ReportRows = ["Name", "Company", "Sold Units"];
    } else {
      this.ReportRows = ["Name", "", "Sold Units"];
    }
    // this.footerProfit = (
    //   (this.footerInventoryData["profit"] /
    //     this.footerInventoryData["totalCostPrice"]) *
    //   100
    // ).toFixed(2);
    this.footerProfit = (
      (this.footerInventoryData["profit"] /
        this.footerInventoryData["totalCostPrice"]) *
      100
    ).toFixed(2);

    if (isNaN(this.footerProfit)) {
      this.footerProfit = 0;
    }
  }
  //-----------------------------End Inventory Data--------------------------------------------------------------------------
  //-----------------------------Mechanic Data--------------------------------------------------------------------------
  //get Workshop All Staff
  public footerMechanicData = {};
  getAllStaff() {
    this.generalService.getStaffList(this.userserviceworkshopid).subscribe(
      (staff) => {
        if (staff.success == true) {
          this.footerMechanicData = {
            total: 0,
            spare: 0,
            lube: 0,
            job: 0,
            outjob: 0,
            incen: 0,
            salary: 0,
            count: 0,
          };
          this.getAllStaffDetails = staff.staff;
        } else {
          this.getAllStaffDetails = [];
        }
      },
      (err) => {
        this.showspinner.setSpinner(false);
        this.snakBar.open("err", ErrorMessgae[0][err], {
          duration: 4000,
        });
      }
    );
  }

  // Arrange ALL mecahic Data
  getMechanicDataReport(data) {
    this.mechanicInventoryData = [];
    this.footerMechanicData = {
      total: 0,
      spare: 0,
      lube: 0,
      job: 0,
      outjob: 0,
      incen: 0,
      salary: 0,
      count: 0,
    };
    data.map((arange) => {
      // var lucky = this.getAllStaffDetails.filter(function (name) {
      //   return name.name.toLowerCase() == arange.name.toLowerCase();
      // });

      var lucky = this.getAllStaffDetails.filter(function (name) {
        if (name.id == arange.id) {
          // console.log("match");
          arange.name = name.name;
        }

        return name.id == arange.id;
      });

      this.footerMechanicData["count"] += parseInt(arange.count);
      // console.log("footerProfit", this.footerProfit["count"]);
      // console.log(arange, lucky);
      if (lucky.length != 0) {
        arange.salary = parseInt(lucky[0].salary);
        arange.incen = parseInt(lucky[0].incentives);
        arange.total =
          parseInt(arange.job) +
          parseInt(arange.lube) +
          parseInt(arange.outjob) +
          parseInt(arange.spare);
        arange.phone = lucky[0].mobile_no_1;

        this.footerMechanicData["total"] +=
          parseInt(arange.job) +
          parseInt(arange.lube) +
          parseInt(arange.outjob) +
          parseInt(arange.spare);
        this.footerMechanicData["salary"] += parseInt(lucky[0].salary);
        this.footerMechanicData["incen"] += parseInt(lucky[0].incentives);
        this.footerMechanicData["job"] += parseInt(arange.job);
        this.footerMechanicData["lube"] += parseInt(arange.lube);
        this.footerMechanicData["spare"] += parseInt(arange.spare);
        this.footerMechanicData["outjob"] += parseInt(arange.outjob);
      } else {
        arange.salary = "-";
        arange.incen = "-";
        arange.total =
          parseInt(arange.job) +
          parseInt(arange.lube) +
          parseInt(arange.outjob) +
          parseInt(arange.spare);

        this.footerMechanicData["total"] +=
          parseInt(arange.job) +
          parseInt(arange.lube) +
          parseInt(arange.outjob) +
          parseInt(arange.spare);
        this.footerMechanicData["job"] += parseInt(arange.job);
        this.footerMechanicData["lube"] += parseInt(arange.lube);
        this.footerMechanicData["spare"] += parseInt(arange.spare);
        this.footerMechanicData["outjob"] += parseInt(arange.outjob);
      }
    });
    this.mechanicInventoryData = data;
    this.mechanicInventoryData.sort(function (a, b) {
      return parseFloat(b.total) - parseFloat(a.total);
    });
    this.data = this.mechanicInventoryData;
    this.dataSource = new MatTableDataSource(this.mechanicInventoryData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.calculateMechaicDetails();
  }
  //calculate for top performer
  calculateMechaicDetails() {
    this.doughnutChartLabels = [];
    this.doughnutChartData = [];
    this.doughnutChartColors = [];
    this.performerMeclabour = "";
    this.performerMec = "";
    this.performerMecserved = "";
    var dounughtmecdata = Array();
    this.performerMec = this.mechanicInventoryData[0].name;
    this.performerMecserved = this.mechanicInventoryData[0].count;
    this.performerMeclabour = this.mechanicInventoryData[0].total;
    this.mechanicInventoryData.map((chatdata) => {
      dounughtmecdata.push([chatdata.name, chatdata.total]);
      // this.doughnutChartLabels.push(chatdata.name)
      // this.doughnutChartData.push(chatdata.total)
    });
    this.donutscharts = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        height: 205,
        width: 250,
        plotShadow: false,
      },
      title: {
        text: "",
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: 5,
            style: {
              fontWeight: "bold",
              color: "#444449",
            },
          },
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          type: "pie",
          name: "% Share",
          innerSize: "50%",
          data: dounughtmecdata,
        },
      ],
    };
    this.doughnutChartColors.push({
      borderColor: "none",
      backgroundColor: [
        "#52d726",
        "#ffec00",
        "#ff7300",
        "#ff0000",
        "#007ed6",
        "#7cdddd",
        "#d84315",
        "#ff8f00",
        "#311b92",
        "#b3c100",
        "#000000",
        "#202020",
        "#ac3e31",
        "#7e909a",
        "#1c4e80",
        "#dbae58",
        "#ea6a47",
        "#6ab187",
        "#488a99",
        "#ff7f0e",
      ],
    });
    // this.doughnutChartLabels = ['Mechanic 1', 'Mechanic 2', 'Mechanic 3', 'Mechanic 4','Mechanic 5'];
    // this.doughnutChartData = [0, 0, 0, 0, 0];
    var total = 0;
    var stotal = 0;
    var lTotal = 0;
    var inHouse = 0;
    var outsourced = 0;
    var incentives = 0;
    var salary = 0;
    var vcount = 0;
    this.mechanicInventoryData.map((data) => {
      total += data.total;
      stotal += data.spare;
      lTotal += data.lube;
      inHouse += data.job;
      vcount += data.count;
      outsourced += data.outjob;
      if (data.salary !== "-") {
        incentives += parseFloat(data.incen);
      }
      if (data.salary !== "-") {
        salary += parseFloat(data.salary);
      }
    });
    // this.totalMechanicData = [];
    // this.totalMechanicData.push({
    //   total: total,
    //   stotal: stotal,
    //   lTotal: lTotal,
    //   inHouse: inHouse,
    //   outsourced: outsourced,
    //   incentives: incentives,
    //   salary: salary,
    //   vcount: vcount,
    // });
  }
  //-----------------------------End Mechanic Data--------------------------------------------------------------------------
  //-----------------------------Service Data--------------------------------------------------------------------------
  //get All Workshop SMS
  getAllWorkshopSMS() {
    this.generalService
      .getRemindersOfJobcard(this.userserviceworkshopid, "none")
      .subscribe(
        (sms) => {
          if (sms.success == true) {
            this.getALLReminders = sms.reminders;
          }
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("err", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  //get Tabel Data for customer
  getServiceData(groupedData) {
   
    this.serviceTabelData = [];
    console.log('getServiceData', this.allReportData)
    if (groupedData != undefined) {
      if (groupedData.length != 0) {
        var sortedData = Object.entries(groupedData);
        sortedData.map((dateGrouped) => {
          this.sortDataServices(dateGrouped[1], dateGrouped[0]);
        });
        this.calculteAllSerices();
      }
    }
  }

  serviceDueTabelData = Array();
  jcid = Array();
  getServiceDataE(groupedData) {
    this.serviceDueTabelData = [];
    console.log('getServiceDataE')
    if (groupedData != undefined) {
      if (groupedData.length != 0) {
        var sortedDueData = Object.entries(groupedData);

        sortedDueData.map((dataGrouped) => {
          this.sortDataServicesE(dataGrouped[1], dataGrouped[0]);
        });
        this.calculteAllSericesE();
      }
    }
  }
  //Sort the revenue data
  sortDataServices(arrayData, customergroup) {
    var sortedarraydata = arrayData.sort(function (a, b) {
      return b.created_at - a.created_at;
    });
    //console.log(sortedarraydata)
    sortedarraydata.map((allJobcards) => {
  
      var currentdate = new Date(allJobcards.estimated_delivery_datetime);
      var reminderperioddate = new Date(
        currentdate.setMonth(
          currentdate.getMonth() + parseInt(allJobcards.reminder.split(" ")[0])
        )
      );
      var remiderforsameday =
        reminderperioddate.getFullYear().toString() +
        "-" +
        ("0" + (reminderperioddate.getMonth() + 1)).slice(-2).toString() +
        "-" +
        ("0" + reminderperioddate.getDate()).slice(-2).toString() +
        " 08:00:00";
      var lucky = this.getALLReminders.filter(function (sms) {
        return (
          sms.sms_id == allJobcards.jobcard_number &&
          sms.date == remiderforsameday
        );
      });
      if (lucky.length != 0) {
        var month = allJobcards.created_at.getMonth() + 1;
        this.serviceTabelData.push({
          customer: customergroup,
          vehicle:
            allJobcards.vehicle_number.split(" ")[0] +
            " (" +
            JSON.parse(allJobcards.vehicle_details).make +
            " " +
            JSON.parse(allJobcards.vehicle_details).model +
            " " +
            JSON.parse(allJobcards.vehicle_details).variant +
            " )",
          duedate: remiderforsameday,
          status: lucky[0].status,
          create_at:
            allJobcards.created_at.getFullYear() +
            "-" +
            month +
            "-" +
            allJobcards.created_at.getDate(),
            mob: allJobcards.customer_mobile,
        });
     
        this.data = this.serviceTabelData;
        this.dataSource = new MatTableDataSource(this.serviceTabelData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  sortDataServicesE(arrayData, customergroup) {
    var sortedarraydataE = arrayData.sort(function (a, b) {
      return b.created_at - a.created_at;
    });
    // let jcid = []
    sortedarraydataE.map((allJobcards) => {
      let currentdate = new Date(allJobcards.closed_date);
      let reminderperiod = new Date(
        currentdate.setMonth(
          currentdate.getMonth() + parseInt(allJobcards.reminder.split(" ")[0])
        )
      );
      
      var remiderforsameday =
        reminderperiod.getFullYear().toString() +
        "-" +
        ("0" + (reminderperiod.getMonth() + 1)).slice(-2).toString() +
        "-" +
        ("0" + reminderperiod.getDate()).slice(-2).toString() +
        " 08:00:00";
      let lucky;
      console.log('allJobcards', allJobcards)
      if(allJobcards.message.includes('Today') 
      || allJobcards.message.includes('today')){
        lucky = allJobcards;
      } 
    
      // if (allJobcards.date == remiderforsameday) {
      //   lucky = allJobcards;
      // }

 
      if (lucky) {
        this.jcid.push(lucky.jobcard_number)
        var month = lucky.created_at.getMonth() + 1;
        this.serviceDueTabelData.push({
          customer: customergroup,
          vehicle:
            lucky.vehicle_number.split(" ")[0] +
            " (" +
            JSON.parse(lucky.vehicle_details).make +
            " " +
            JSON.parse(lucky.vehicle_details).model +
            " " +
            JSON.parse(lucky.vehicle_details).variant +
            " )",
          duedate: remiderforsameday,
          status: lucky.status,
          create_at:
            lucky.created_at.getFullYear() +
            "-" +
            month +
            "-" +
            lucky.created_at.getDate(),
            mob : lucky.customer_mobile
            
        });
        // console.log('this.serviceTabelData tot', this.serviceDueTabelData.length)
     
        this.data = this.serviceDueTabelData;
        this.dataSource = new MatTableDataSource(this.serviceDueTabelData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      }
    });
    console.log('jcid', this.jcid)
  }

  // Top 5 Pending Balnce Customers
  calculteAllSerices() {
    this.ReportRows = [];
    this.ReportRowsData = [];

    if (this.serviceTabelData.length != 0) {
      this.serviceTabelData.map((data) => {
        if (this.ReportRowsData.length != 5) {
          if (moment(data.duedate).isSame(Date.now(), "day") == true) {
            this.ReportRowsData.push({
              name: data.customer,
              vehicle: data.vehicle,
              date: data.create_at,
            });
          }
        }
      });
    }

    this.ReportRows = [
      "Customer Details",
      "Vehicle Details",
      "Last Service Due",
    ];
  }
  calculteAllSericesE() {
    this.ReportRows = [];
    this.ReportRowsData = [];

    if (this.serviceDueTabelData.length != 0) {
      this.serviceDueTabelData.map((data) => {
        if (this.ReportRowsData.length != 5) {
          if (moment(data.duedate).isSame(Date.now(), "day") == true) {
            this.ReportRowsData.push({
              name: data.customer,
              vehicle: data.vehicle,
              date: data.create_at,
           
            });
          }
        }
      });

    }

    this.ReportRows = [
      "Customer Details",
      "Vehicle Details",
      "Last Service Due",
    ];
  }
  //-----------------------------End Service Data--------------------------------------------------------------------------
  //-----------------------------Recuring Customer--------------------------------------------------------------------------
  //Pagination data of recuring customer
  getRecusringCustomerData() {
    this.ReportRows = [];
    this.ReportRowsData = [];
    this.generalService
      .getRecurringCustomers(this.userserviceworkshopid, this.page_number)
      .subscribe(
        (cusData) => {
          //this.showspinner.setSpinner(true)
          if (cusData.success == true) {
            this.hasnext = cusData.has_next;

            cusData.customer.map((data) => {
              var updated_data;
              var vehcile_detail = JSON.parse(data["vehicle_details"]);
              updated_data = {
                name: data["cutsomer_name"],
                mobile: data["customer_mobile"],
                details:
                  vehcile_detail.make +
                  " " +
                  vehcile_detail.model +
                  " " +
                  vehcile_detail.variant,
                vehicle: data["vehicle_number"],
                date: data["created_at"],
                count: data["count"],
              };
              this.data.push(updated_data);
            });
            this.dataSource = new MatTableDataSource(this.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            if (this.data.length != 0) {
              this.calculateReCustoomerDetails();
            }
          }
          this.showspinner.setSpinner(false);
        },
        (error) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("err", ErrorMessgae[0][error], {
            duration: 4000,
          });
        }
      );
  }
  //Calculate Data of customer
  calculateReCustoomerDetails() {
    this.performerMeclabour = "";
    this.performerMec = "";
    this.performerMecserved = "";
    this.performerMec = this.data[0].name;
    this.performerMecserved = this.data[0].count;
    this.performerMeclabour = this.data[0].mobile;
  }
  //on scroll event
  onScroll(event) {
    if (
      event.target.offsetHeight + event.target.scrollTop >=
      event.target.scrollHeight
    ) {
      //console.log(this.hasnext)
      if (this.hasnext == true) {
        this.showspinner.setSpinner(true);
        this.page_number = parseInt(this.page_number) + 1;
        this.getRecusringCustomerData();
      }
    }
  }
  //-----------------------------End Recuring Customer--------------------------------------------------------------------------
  contactWhatsapp(data){

    let wkname = this.userService.getData()["workshop_name"] 
    let wkadd = this.userService.getData()["address"] 
    let mob1 = this.userService.getData()["workshop_mobile_number_1"];
    let mob2 = this.userService.getData()["workshop_mobile_number_2"];
    
    
    if(this.reportType == 'insexp'){

      let whatsappMessage = `Dear Customer,
      Your vehicle ${data.vehicle_make + ' '+data.vehicle_model + ' '+data.vehicle_variant}
      ${data.vehicle_number} insurance expires on ${data.insurance_exp_date}
      For further details please contact
      ${wkname}
      ${mob1}/${mob2}`
  
          this.contactlink = "https://web.whatsapp.com/send?phone=91"+
          data.customer_mobile+"&text=" + whatsappMessage
    }
    
    if(this.reportType == 'cusbday'){

      let whatsappMessage = `Dear Customer,
      Birthday Wishes From
      ${wkname}
      ${mob1}/${mob2}`
  
          this.contactlink = "https://web.whatsapp.com/send?phone=91"+
          data.customer_mobile+"&text=" + whatsappMessage
    }
    
    if(this.reportType == 'pending'){
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      let closed_date = new Date(data.closed_date)
      let strClosedDate = closed_date.getDate()  + "-" + (closed_date.getMonth()+1) + "-" + closed_date.getFullYear()
      let whatsappMessage = `Dear Customer,
Balance of Rs. ${data.balance_amount} is pending.
Invoice Details
Invoice No.: ${data.invoice_number}
Date: ${strClosedDate}
Bill Amount:  ${data.final_amount}
Balance:${data.balance_amount}

Request you to pay as early as possible.
Thanks.
${wkname}
${mob1}/${mob2}`
     
    this.contactlink = "https://web.whatsapp.com/send?phone=91"+
    data.mob+"&text=" + whatsappMessage

    }
    else{
   
    



    let whatsappMessage = "Dear Customer, "+
    "\n" +
    "Your Vehicle "
     + data.vehicle + "due for Servicing. Due Date "
     + data.duedate.split(' ')[0] + 
     "\n" +
     "Service Regularly and Drive Safely" +
     "\n" +
     "Thanks. " + wkname +
     "\n" +
     "Contact Us"+
     "\n" +
     "Mobile No 1: " + mob1 +
     "\n" 

     if(mob2 !== undefined && mob2 != '0'){
      whatsappMessage +=
     "Mobile No 2: " + mob2 
     }
     whatsappMessage +=
     "\n" +
     "Address" +
     "\n" + wkadd

     
    this.contactlink = "https://web.whatsapp.com/send?phone=91"+
    data.customer_mobile+"&text=" + whatsappMessage;
    }
  }

}
