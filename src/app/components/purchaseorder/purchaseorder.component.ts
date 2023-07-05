import {Component, QueryList, ViewChildren, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Observable, merge, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, filter} from 'rxjs/operators';
import { DilogOpenService } from '../../services/dilog-open.service';
import {NgbDate, NgbCalendar, NgbDateParserFormatter, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import { GeneralService } from '../../services/general.service';
import { UserserviceService } from '../../services/userservice.service';
import { MatSnackBar } from '@angular/material';
import { SpinnerService } from '../../services/spinner.service';
import  {ErrorMessgae}  from  '../../shared/error_message/error';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { padNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { PdfcounterService } from '../../services/pdfcounter.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as glob from "../../shared/usercountry/userCountryGlobal"
import { UserPermissionService } from "../../services/user-permissions.service";

@Component({
  selector: 'app-purchaseorder',
  templateUrl: './purchaseorder.component.html',
  styleUrls: ['./purchaseorder.component.css']
})
export class PurchaseorderComponent implements OnInit {
  userserviceworkshopid
  tabelData=Array()
  displayedColumns: string[] = ['order_date','order_no','supplier_name','conatct_details','rece_date','total_amount','pending_amount','action'];
  dataSource = new MatTableDataSource();
  settingbilling
  start_date:string=""
  end_date:string=""
  offset:any=0
  search_keywords:string=""
  startlDate = '';
  endDate='';
  addOffset
  hasnext:boolean=false;
  nextUrl:string
  states = [];
  showsearchcnacel:boolean=false
  selectedvaluefoprsearch
  model
  scrollheight='100'
  numberofinvoice='0'
  receviedamount='0'
  pendingamout='0'
  currency_symbol: any;

  pendingMainClass = "totalandname";
  completeMainClass = "totalandname";
  closedMainClass = "totalandname";
  totalMainClass = "totalandname";
  stockWithPo = "totalandname totaldivv";
  showDatePicker: boolean = false;
  selectedOption: string = "0";
  po_status = "total";
  isPreviousPage: boolean = false;
  previousPageUrl: string;
  permitData;
  isPermitData;
  @ViewChildren('panel',{read: ElementRef}) public panel: ElementRef<any>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
    private counterpdf:PdfcounterService,
    private formbuild: FormBuilder,
    private showspinner:SpinnerService,
    private snakBar:MatSnackBar,
    private userService: UserserviceService ,
    private generalService:GeneralService,
    private calendar: NgbCalendar, 
    public formatter: NgbDateParserFormatter,
    private permit:UserPermissionService,
    private dialogService:DilogOpenService,
    ) { 
    this.userserviceworkshopid=this.userService.getData()["workshop_id"]
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    
    /*check permission of view, create, edit, create new*/
    var isUserLogin = localStorage.getItem('isUserLogin');
    if(isUserLogin == 'true'){
      try {
        this.permitData = {};
        permit.getPermissionForComponent('purchaseorder').subscribe(
          (res) => { 
            this.permitData = JSON.parse(res.data['purchaseorder']);
              if(this.permitData){
              this.isPermitData = this.permitData;
              }else{
                this.isPermitData = 0;
              }
          });
      } catch (e) {
        this.permitData = {"view":1};
      }      
    }
  }
  // Load the counter sale data
  ngOnInit() {
    this.currency_symbol = glob.currency_symbol;
    this.getTabelData()
  }


  /*check permission func of view, create, edit, create new ..... start*/
  event_handler_view(){
    if(this.permitData){
      if(this.permitData.view != 1){ 
        this.snakBar.open("Access denied, Please call admin.",'', {
          duration: 4000,
        });
        return false;
      }else{
        return true;
      }
    }else{
      return true;
    }
  }
  event_handler_edit(){
    if(this.permitData){
      if(this.permitData.edit != 1){ 
        this.snakBar.open("Access denied, Please call admin.",'', {
          duration: 4000,
        });
        return false;
      }else{
        return true;
      }
    }else{
      return true;
    }
  }
  event_handler_create(){
    if(this.permitData){
      if(this.permitData.create != 1){ 
        this.snakBar.open("Access denied, Please call admin.",'', {
          duration: 4000,
        });
        return false;
      }else{
        return true;
      }
    }else{
      return true;
    }
  }
  event_handler_create_new(){
    if(this.permitData){
      if(this.permitData.create_new != 1){ 
        this.snakBar.open("Access denied, Please call admin.",'', {
          duration: 4000,
        });
        return false;
      }else{
        return true;
      }
    }else{
      return true;
    }
  }
  event_handler_delete(){
    if(this.permitData){
      this.snakBar.open("Access denied, Please call admin.",'', {
        duration: 4000,
      });
      return false;
    }else{
      return true;
    }
  }
  /*check permission func of view, create, edit, create new ..... end*/




  // Search the counter sale by name,number, counter number
  searchBar(event){
    this.offset=0
    this.addOffset=0
    this.start_date=""
    this.endDate=""
    this.search_keywords=event
    this.showspinner.setSpinner(true)
    this.getDataForSearch()
  }
  // select the search result
  selectedResult(event){
    this.selectedvaluefoprsearch=event
    this.showsearchcnacel=true
    // console.log(event.split(', ').length);
    if(event.split(', ').length==2){
      this.search_keywords=event.split(', ')[1]
      this.offset=0
      this.addOffset=0
      this.start_date=""
      this.end_date=""
      this.showspinner.setSpinner(true)
      this.getTabelData()
    }if(event==""){
      this.search_keywords=""
      this.offset=0
      this.addOffset=0
      this.start_date=""
      this.end_date=""
      this.showspinner.setSpinner(true)
      this.getTabelData()
    } 
  }
  // get paginated data
  getDataForSearch(){
    this.generalService.PoDashboard(this.userserviceworkshopid,
    this.start_date,
    this.end_date,
    this.search_keywords,
    this.po_status).subscribe(dashResult=>{  
      if(dashResult.success==false){
        this.states=[]
        this.states.push("No data Found")
        this.showspinner.setSpinner(false)
      }else if(dashResult.success==true){
        this.states=[]
        if(dashResult.has_next==true){
          this.hasnext=true
          this.nextUrl=dashResult.next_page
        }else{
          this.hasnext=false
          this.nextUrl=""
        }
        var dataset=Object.values(dashResult.order)
        for(var i=0;i<dataset.length;i++){
          this.states.push(dashResult.order[i]["supplier_name"]+', '+dashResult.order[i]["bill_no"])
        }
        
        this.numberofinvoice=Math.round(parseInt(dashResult["total_count"])).toLocaleString()
        this.receviedamount=Math.round(parseInt(dashResult["total_amount"])).toLocaleString()
        this.pendingamout=Math.round(parseInt(dashResult["total_pending"])).toLocaleString()
        var tabelDataForMap:any
        
        tabelDataForMap = dashResult.order
        this.tabelData = tabelDataForMap.map(function(tabelinfo){
          return tabelinfo;
        });
        this.addOffset=this.tabelData.length
        var scrollheight=this.tabelData.length*100
        if(scrollheight>=750){
          this.scrollheight='600'
        }else if(scrollheight==0){
          this.scrollheight="150"
        }else{
          this.scrollheight=scrollheight.toString()
        }
        //this.data = this.tabelData
        if(this.tabelData!=undefined){
          this.dataSource=new MatTableDataSource(this.tabelData);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.showspinner.setSpinner(false)
        }else{
          this.tabelData=[]
          this.dataSource=new MatTableDataSource(this.tabelData);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.showspinner.setSpinner(false)
        }


        this.showspinner.setSpinner(false)
      }else{
        this.states=[]
        this.states.push("No data Found")
        this.showspinner.setSpinner(false)
      }
    },err=>{
      this.showspinner.setSpinner(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
  }
  // gte the counter data
  getTabelData(){
    this.generalService.PoDashboard(this.userserviceworkshopid,
    this.start_date,
    this.end_date,
    this.search_keywords,this.po_status).subscribe(dashResult=>{
      this.model=''
      if(dashResult.success==false){
        this.showspinner.setSpinner(false)
        this.tabelData=undefined
        this.numberofinvoice=Math.round(parseInt(dashResult["total_count"])).toLocaleString()
        this.receviedamount=Math.round(parseInt(dashResult["total_amount"])).toLocaleString()
        this.pendingamout=Math.round(parseInt(dashResult["total_pending"])).toLocaleString()
        this.scrollheight="150"
        // this.snakBar.open("No Record Found","", {
        //   duration: 4000
        // }) 
      }else if(dashResult.success==true){
        
        //console.log(dashResult.has_next)
        if(dashResult.has_next==true){
          //console.log(dashResult.has_next)
          this.hasnext=true
          this.nextUrl=dashResult.next_page
        }else{
          this.hasnext=false
          this.nextUrl=""
        }
        this.numberofinvoice=Math.round(parseInt(dashResult["total_count"])).toLocaleString()
        this.receviedamount=Math.round(parseInt(dashResult["total_amount"])).toLocaleString()
        this.pendingamout=Math.round(parseInt(dashResult["total_pending"])).toLocaleString()
        var tabelDataForMap:any
        
        tabelDataForMap = dashResult.order
        this.tabelData = tabelDataForMap.map(function(tabelinfo){
          return tabelinfo;
        });
        this.addOffset=this.tabelData.length
        var scrollheight=this.tabelData.length*100
        if(scrollheight>=750){
          this.scrollheight='600'
        }else if(scrollheight==0){
          this.scrollheight="150"
        }else{
          this.scrollheight=scrollheight.toString()
        }
        //this.data = this.tabelData
        if(this.tabelData!=undefined){
          this.dataSource=new MatTableDataSource(this.tabelData);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.showspinner.setSpinner(false)
        }else{
          this.tabelData=[]
          this.dataSource=new MatTableDataSource(this.tabelData);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.showspinner.setSpinner(false)
        }
        
      }else{
        this.showspinner.setSpinner(false)
        this.snakBar.open("Error","", {
          duration: 4000
        })
      }
    },err=>{
      this.showspinner.setSpinner(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
    
  }
  // clear the search
  clearSearch(){
    this.selectedvaluefoprsearch=""
    this.start_date=""
    this.end_date=""
    this.search_keywords=""
    this.showsearchcnacel=false
    this.getTabelData()
  }
  // onscroll
  onScroll(event) {
    // console.log('event', event)
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      
      
      if(this.hasnext==true){
        
        this.showspinner.setSpinner(true)
        this.getDataForPagination()
      }
    }
  }
  // gte the paginated data
  getDataForPagination(){
    this.generalService.POpageination(this.nextUrl).subscribe(dashResult=>{      
      if(dashResult.success==false){
        this.showspinner.setSpinner(false)
        // this.tabelData=undefined
        this.snakBar.open("No Record Found","", {
          duration: 4000
        })
      }else if(dashResult.success==true){
        if(dashResult.has_next==true){
          //console.log(dashResult.has_next)
          this.hasnext=true
          this.nextUrl=dashResult.next_page
        }else{
          this.hasnext=false
          this.nextUrl='';
        }
       
        var tabelDataForMap:any
        for(var i=0;i< Object.values(dashResult.order).length;i++){
          this.tabelData.push(dashResult.order[i])
        }
        // to avoid duplicates (sania)
        
        this.tabelData = this.tabelData.reduce(
          
          (acc, cur) =>
          
          acc.some((x) => x.id === cur.id)
          ? acc
          : acc.concat(cur)
          ,
          
          []
          );
          
          // this.tabelData=this.tabelData.reduce((acc, cur) => acc.some(x=> (x.jobcard_number === cur.jobcard_number )) ? acc : acc.concat(cur), [])
        // this.dataSource=new MatTableDataSource(this.tabelData);
        // this.dataSource.sort = this.sort;
        // this.dataSource.paginator = this.paginator;

       
        this.addOffset=this.tabelData.length
        var scrollheight=this.tabelData.length*100
        if(scrollheight>=750){
          this.scrollheight='600'
        }else if(scrollheight==0){
          // this.scrollheight="550"
          this.scrollheight = "150";
        }else{
          this.scrollheight=scrollheight.toString()
        }


        //this.data = this.tabelData
        if(this.tabelData!=undefined){
          this.dataSource=new MatTableDataSource(this.tabelData);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.showspinner.setSpinner(false)
        }else{
          this.tabelData=[]
          this.dataSource=new MatTableDataSource(this.tabelData);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.showspinner.setSpinner(false)
        }
        this.showspinner.setSpinner(false)
      }else{
        this.showspinner.setSpinner(false)
        this.snakBar.open("Error","", {
          duration: 4000
        })
      }
    },err=>{
      this.showspinner.setSpinner(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
    //this.data = this.tabelData
   
  }
  // select the date for filter
  onDateSelection(date) {
    var startDate=new Date(date.end)
    var endDate=new Date(date.begin)
    this.start_date=startDate.getFullYear()+"-"+("0" + (startDate.getMonth()+1)).slice(-2)+"-"+("0" + startDate.getDate()).slice(-2);
    this.end_date=endDate.getFullYear()+"-"+("0" + (endDate.getMonth()+1)).slice(-2)+"-"+("0" + endDate.getDate()).slice(-2);
    this.addOffset=0
    this.offset=0
    this.showspinner.setSpinner(true)
    this.getTabelData()
    
  }
  // edit the counter sale
  editCounter(e){
    console.log(e);
    this.generalService.SupplierDetail(this.userserviceworkshopid,e.supplier_id).subscribe(cusinfo=>{
      if(cusinfo.success==true){
        if(e.po_status =='' || e.po_status == 8 || e.po_status == null){
         
          this.dialogService.OpenPurchaseOrder('edit',e.id,cusinfo['customer']['balance'],e.po_status).subscribe(datacounter=>{
            if(datacounter.status=="true"){
              this.ngOnInit()
            }else if(datacounter.status=="truep"){
              this.ngOnInit()
            }else{
              this.ngOnInit()
            }
          })
        }else{
          this.dialogService.OpenCreatePurchaseOrder('edit',e.id,cusinfo['customer']['balance'],e.po_status).subscribe(datacounter=>{
            // console.log("datacounter",datacounter);
            if(datacounter.status=="true"){
              this.ngOnInit()
            }else if(datacounter.status=="truep"){
              this.ngOnInit()
            }else{
              this.ngOnInit()
            }
          })
        }
        
      }
      this.showspinner.setSpinner(false)
    },err=>{
      this.showspinner.setSpinner(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
  }
  // opem the new counter sale
  opencounter(status,id,mdl){
    if(mdl == 'addstockpo'){
      this.dialogService.OpenPurchaseOrder(status,id,'0','').subscribe(datacounter=>{
        if(datacounter.status=="true"){
          this.ngOnInit()
        }else if(datacounter.status=="truep"){
          this.ngOnInit()
        }else{
          this.ngOnInit()
        }
      })
    }
    if(mdl == 'createpo'){
      this.dialogService.OpenCreatePurchaseOrder(status,id,'0','0').subscribe(datacounter=>{
        if(datacounter.status=="true"){
          this.ngOnInit()
        }else if(datacounter.status=="truep"){
          this.ngOnInit()
        }else{
          this.ngOnInit()
        }
      })
    }
  }

  sortPoStatus(status){
    // console.log("status>>",status)
    this.generalService.PoDashboard(this.userserviceworkshopid,
      this.start_date,
      this.end_date,
      this.search_keywords,status).subscribe(dashResult=>{
        // console.log("dashResult",dashResult); 
        this.model=''
        if(dashResult.success==false){
          this.showspinner.setSpinner(false)
          this.tabelData=undefined
          this.numberofinvoice=Math.round(parseInt(dashResult["total_count"])).toLocaleString()
          this.receviedamount=Math.round(parseInt(dashResult["total_amount"])).toLocaleString()
          this.pendingamout=Math.round(parseInt(dashResult["total_pending"])).toLocaleString()
          this.scrollheight="150"
          // this.snakBar.open("No Record Found","", {
          //   duration: 4000
          // }) 
        }else if(dashResult.success==true){
          
          //console.log(dashResult.has_next)
          if(dashResult.has_next==true){
            //console.log(dashResult.has_next)
            this.hasnext=true
            this.nextUrl=dashResult.next_page
          }else{
            this.hasnext=false
            this.nextUrl=""
          }
          this.numberofinvoice=Math.round(parseInt(dashResult["total_count"])).toLocaleString()
          this.receviedamount=Math.round(parseInt(dashResult["total_amount"])).toLocaleString()
          this.pendingamout=Math.round(parseInt(dashResult["total_pending"])).toLocaleString()
          var tabelDataForMap:any
          
          tabelDataForMap = dashResult.order
          this.tabelData = tabelDataForMap.map(function(tabelinfo){
            return tabelinfo;
          });
          this.addOffset=this.tabelData.length
          var scrollheight=this.tabelData.length*100
          if(scrollheight>=750){
            this.scrollheight='600'
          }else if(scrollheight==0){
            this.scrollheight="150"
          }else{
            this.scrollheight=scrollheight.toString()
          }
          //this.data = this.tabelData
          if(this.tabelData!=undefined){
            this.dataSource=new MatTableDataSource(this.tabelData);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.showspinner.setSpinner(false)
          }else{
            this.tabelData=[]
            this.dataSource=new MatTableDataSource(this.tabelData);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.showspinner.setSpinner(false)
          }
          
        }else{
          this.showspinner.setSpinner(false)
          this.snakBar.open("Error","", {
            duration: 4000
          })
        }
      },err=>{
        this.showspinner.setSpinner(false)
        this.snakBar.open("Error", ErrorMessgae[0][err], {
          duration: 4000
        })
      })
    }
  
}
