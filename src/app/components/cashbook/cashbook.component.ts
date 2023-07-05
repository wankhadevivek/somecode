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
import * as glob from "../../shared/usercountry/userCountryGlobal";
import { UserPermissionService } from "../../services/user-permissions.service";

@Component({
  selector: 'app-cashbook',
  templateUrl: './cashbook.component.html',
  styleUrls: ['./cashbook.component.css']
})
export class CashbookComponent implements OnInit {
  displayedColumns
  public tabelData=Array();
  public addedSuppliers=Array();
  dataSource = new MatTableDataSource();
  CreateSupplierForm: FormGroup;
  registerForm:FormGroup;
  userserviceworkshopid
  addOffset
  hasnext:boolean=false;
  nextUrl:string
  scrollheight='100'
  search_keywords=''
  states = [];
  selectedvaluefoprsearch
  offset:any=0
  showsearchcnacel:boolean=false
  showCreateButton:boolean=true
  isExistingSupplier:boolean=false
  isRunSpinner:boolean=false;
  currency_symbol: any;
  existingSupplierData :any;
  isSupplierNotFound:boolean=false
  // getLatlong 
  longitude: number; 
  latitude: number;  
  permitData;
  isPermitData: any = {};
  date = new Date()
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private formbuild: FormBuilder,
    private showspinner:SpinnerService,
    private snakBar:MatSnackBar,
    private userService: UserserviceService,
    private generalService:GeneralService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private dialogService:DilogOpenService,
    private permit:UserPermissionService,) { 
      // here
    this.displayedColumns=['srno','date','category','amount','transaction_id','ref','action']
    this.dataSource=new MatTableDataSource(this.tabelData);
    this.userserviceworkshopid=this.userService.getData()["workshop_id"]
    this.createSupplierForm();

    this.isPermitData = 0;
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
  // Get all Spares when user realod the page
  ngOnInit() {
    this.currency_symbol = glob.currency_symbol;
    this.getTabelData()
    this.getLocation();
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



  //cretae form of supplier
  createSupplierForm(){
    this.CreateSupplierForm=this.formbuild.group({
      id: ['' ],
      firstname: ['', Validators.required ],
      contact1:['', [Validators.required,Validators.pattern(/^[6-9]\d{9}$/)]],
      contact2:['',Validators.pattern(/^[6-9]\d{9}$/)],
      email:['', [Validators.required, Validators.email]],
      firm:['', Validators.required],
      address:['', Validators.required],
      gst:['',Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)],
      master_supplier_id:['' ],
    });
  }
  //Open Supplier popup
  opensupplier(event,datashow){
    this.isSupplierNotFound = false;
    if(event=='new'){
      this.showCreateButton=true
      this.CreateSupplierForm.controls["id"].setValue('')
      this.CreateSupplierForm.controls["firstname"].setValue('')
      this.CreateSupplierForm.controls["contact1"].setValue('')
      this.CreateSupplierForm.controls["contact2"].setValue('')
      this.CreateSupplierForm.controls["email"].setValue('')
      this.CreateSupplierForm.controls["firm"].setValue('')
      this.CreateSupplierForm.controls["address"].setValue('')
      this.CreateSupplierForm.controls["gst"].setValue('')
      this.CreateSupplierForm.controls["master_supplier_id"].setValue('')
      
    }else if(event=='edit'){
      this.showCreateButton=false
      this.CreateSupplierForm.controls["id"].setValue(datashow.id)
      this.CreateSupplierForm.controls["firstname"].setValue(datashow.name,{onlySelf:true})
      this.CreateSupplierForm.controls["contact1"].setValue(datashow.number,{onlySelf:true})
      this.CreateSupplierForm.controls["contact2"].setValue(datashow.supplier_mobile2,{onlySelf:true})
      this.CreateSupplierForm.controls["email"].setValue(datashow.email,{onlySelf:true})
      this.CreateSupplierForm.controls["firm"].setValue(datashow.business_name,{onlySelf:true})
      this.CreateSupplierForm.controls["address"].setValue(datashow.address,{onlySelf:true})
      this.CreateSupplierForm.controls["gst"].setValue(datashow.gst,{onlySelf:true})
      this.CreateSupplierForm.controls["master_supplier_id"].setValue(datashow.master_supplier_id)
    }else if(event=='delete'){
      var questionForDialog
      questionForDialog="Are You Sure Want to Delete the Supplier "+datashow.name
      this.dialogService.OpenConfirmDialog(questionForDialog,true,'Delete').subscribe(answer=>{
        if(answer==true){
          this.generalService.DeleteSupplier('delete',this.userserviceworkshopid,datashow.id).subscribe(delet=>{
            this.showspinner.setSpinner(true)
            if(delet["success"]==true){
              this.showspinner.setSpinner(false)
              this.snakBar.open("Message", datashow.name.toUpperCase()+" Deleted", {
                duration: 4000
              })
              this.getTabelData()
            }
          })
        }else{
          this.showspinner.setSpinner(false)
          this.snakBar.open("Message", datashow.name.toUpperCase()+" Not Deleted", {
            duration: 4000
          })
        }
      })
    }
  }
  //create update supplier
  createSpareByAPI(evnet){
    if(evnet=='update'){
      this.generalService.CreateUpdateSupplier('update',this.userserviceworkshopid,
      this.CreateSupplierForm.getRawValue().firstname,this.CreateSupplierForm.getRawValue().firm,this.CreateSupplierForm.getRawValue().contact1,
      this.CreateSupplierForm.getRawValue().contact2,this.CreateSupplierForm.getRawValue().email,this.CreateSupplierForm.getRawValue().address,
      this.CreateSupplierForm.getRawValue().gst,this.CreateSupplierForm.getRawValue().id, this.CreateSupplierForm.getRawValue().master_supplier_id).subscribe(dataupdate=>{
        this.showspinner.setSpinner(true)
        if(dataupdate.success==true){
          this.getTabelData()
          this.snakBar.open("Message", 'Supplier Updated', {
            duration: 4000
          })
        }else{
          this.snakBar.open("Message", 'Supplier Not Updated', {
            duration: 4000
          })
        }
        this.showspinner.setSpinner(false)
      },err=>{
        this.showspinner.setSpinner(false)
        this.snakBar.open("Error", ErrorMessgae[0][err], {
          duration: 4000
        })
      })
    }else{
      // this.submitFormForRegister('create',evnet);
     
      this.generalService.CreateUpdateSupplier('create',this.userserviceworkshopid,
      this.CreateSupplierForm.getRawValue().firstname,this.CreateSupplierForm.getRawValue().firm,this.CreateSupplierForm.getRawValue().contact1,
      this.CreateSupplierForm.getRawValue().contact2,this.CreateSupplierForm.getRawValue().email,this.CreateSupplierForm.getRawValue().address,
      this.CreateSupplierForm.getRawValue().gst,this.CreateSupplierForm.getRawValue().id, this.CreateSupplierForm.getRawValue().master_supplier_id).subscribe(dataupdate=>{
        this.showspinner.setSpinner(true)
        if(dataupdate.success==true){
          // this.submitFormForRegister('create');
          if(evnet=='createnew'){
            this.opensupplier('new','no')
          }
          this.getTabelData()
          this.snakBar.open("Message", 'Supplier Added', {
            duration: 4000
          })
        }else{
          this.snakBar.open("Message", 'Supplier Not Added', {
            duration: 4000
          })
        }
        this.showspinner.setSpinner(false)
      },err=>{
        this.showspinner.setSpinner(false)
        this.snakBar.open("Error", ErrorMessgae[0][err], {
          duration: 4000
        })
      })
    }
  }
  //get the all supplier data
  getTabelData(){
    this.generalService.SupplierDashboard(this.userserviceworkshopid,
    this.search_keywords).subscribe(dashResult=>{      
      if(dashResult.success==false){
        this.showspinner.setSpinner(false)
        this.tabelData=undefined
      }else if(dashResult.success==true){
        this.tabelData=[]
        var tabelDataForMap:any
        // tabelDataForMap = dashResult.supplier
        // tabelDataForMap.map(tabelinf=>{
        //   this.addedSuppliers.push(tabelinf.supplier_mobile1)
        //   this.tabelData.push({ 
        //   	'name': tabelinf.supplier_name, 
        //     'number': tabelinf.supplier_mobile1, 
        //     'email': tabelinf.supplier_email,
        //     'address': tabelinf.supplier_address, 
        //     'gst': tabelinf.supplier_gst_no,
        //     'id': tabelinf.id,
        //     'workshop_id': tabelinf.workshop_id,
        //     'business_name': tabelinf.business_name,
        //     'supplier_mobile2': tabelinf.supplier_mobile2,
        //     'master_supplier_id':tabelinf.master_supplier_id})
        // });
        tabelDataForMap = [   
          {
            "cashbook_id": "5",
            "date": "2023-01-19 00:00:00",
            "category": 1,
            "amount": 250.0,
            "transaction_id": "123cbks",
            "ref": [
                "D0111-251",
                "C1216-246"
            ]
        }
        ]
        this.showspinner.setSpinner(false)
        if(dashResult.has_next==true){
          this.hasnext=true
          this.nextUrl=dashResult.next_page
        }else{
          this.hasnext=false
          this.nextUrl=""
        }
        this.addOffset=this.tabelData.length
        var scrollheight=this.tabelData.length*100
        if(scrollheight>=750){
          this.scrollheight='600'
        }else if(scrollheight==0){
          this.scrollheight="150"
        }else{
          this.scrollheight=scrollheight.toString()
        }
        if(this.tabelData!=undefined){
          this.dataSource=new MatTableDataSource(this.tabelData);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
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
  // onscroll of the jobcard dashbaord
  onScroll(event) {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      if(this.hasnext==true){
        this.showspinner.setSpinner(true)
        this.getDataForPagination()
      }
    }
  }
  // gte the pagination data
  getDataForPagination(){
    this.generalService.Supplierpageination(this.nextUrl).subscribe(dashResult=>{      
      if(dashResult.success==false){
        this.showspinner.setSpinner(false)
        this.tabelData=undefined
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
          this.nextUrl=""
        }
        var tabelDataForMap:any
        tabelDataForMap = dashResult.supplier
        tabelDataForMap.map(tabelinf=>{
          this.addedSuppliers.push(tabelinf.supplier_mobile1)
          this.tabelData.push({ 
          	'name': tabelinf.supplier_name, 
            'number': tabelinf.supplier_mobile1, 
            'email': tabelinf.supplier_email,
            'address': tabelinf.supplier_address, 
            'gst': tabelinf.supplier_gst_no,
            'id': tabelinf.id,
            'workshop_id': tabelinf.workshop_id,
            'business_name': tabelinf.business_name,
            'supplier_mobile2': tabelinf.supplier_mobile2,
            'master_supplier_id':tabelinf.master_supplier_id})
        });

        tabelDataForMap = [   
          {
            "cashbook_id": "5",
            "date": "2023-01-19 00:00:00",
            "category": 1,
            "amount": 250.0,
            "transaction_id": "123cbks",
            "ref": [
                "D0111-251",
                "C1216-246"
            ]
        }
        ]
        this.dataSource=new MatTableDataSource(this.tabelData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
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
  // select the search result
  selectedResult(event){
    this.selectedvaluefoprsearch=event
    this.showsearchcnacel=true
    if(event.split(', ').length==2){
      this.search_keywords=event.split(', ')[1]
      this.offset=0
      this.addOffset=0
      this.showspinner.setSpinner(true)
      this.getTabelData()
    }if(event==""){
      this.search_keywords=""
      this.offset=0
      this.addOffset=0
      this.showspinner.setSpinner(true)
      this.getTabelData()
    } 
  }
  // Search the counter sale by name,number, counter number
  searchBar(
    event){
    this.offset=0
    this.addOffset=0
    this.search_keywords=event
    this.showspinner.setSpinner(true)
    this.getDataForSearch()
  }
  // get paginated data
  getDataForSearch(){
    this.generalService.SupplierDashboard(this.userserviceworkshopid,
    this.search_keywords).subscribe(dashResult=>{  
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
        var dataset=Object.values(dashResult.supplier)
        for(var i=0;i<dataset.length;i++){
          this.states.push(dashResult.supplier[i]["business_name"]+', '+dashResult.supplier[i]["supplier_mobile1"])
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
  // clar the search
  clearSearch(){
    this.selectedvaluefoprsearch=""
    this.showsearchcnacel=false
    this.search_keywords=""
    this.getTabelData()
  }


  getSupplierDetailsByPhone(number){
    console.log(this.addedSuppliers)
    console.log(number)
    console.log('check',this.addedSuppliers.includes(number))
    if(this.addedSuppliers.includes(number)){
      // index of 
      let presentSupplier = this.tabelData.filter(supp=>{
        if (supp["number"] == number){
          console.log('check',this.addedSuppliers.includes(number))
          return supp
        }
      })
      presentSupplier = presentSupplier[0]
      console.log(this.addedSuppliers)
      console.log('presentSupplier', presentSupplier)
      this.opensupplier('edit', presentSupplier)
      // this.CreateSupplierForm.controls["address"].setValue(presentSupplier["address"]);
      // this.CreateSupplierForm.controls["gst"].setValue(presentSupplier["gst"]);
      // this.CreateSupplierForm.controls["firstname"].setValue(presentSupplier["name"]);
      // this.CreateSupplierForm.controls["contact1"].setValue(presentSupplier["number"]);
      // this.CreateSupplierForm.controls["contact2"].setValue(presentSupplier["supplier_mobile2"]);
      // this.CreateSupplierForm.controls["email"].setValue(presentSupplier["email"]);
      // this.CreateSupplierForm.controls["firm"].setValue(presentSupplier["business_name"]);
      // this.CreateSupplierForm.controls["master_supplier_id"].setValue(presentSupplier["master_supplier_id"]);
      
      this.isExistingSupplier = true;
      // this.CreateSupplierForm.controls["contact1"].setValue("");
      this.snakBar.open("Message", 'Supplier already added', {
        duration: 4000
      })
      return 
    }
    var MobileNo = '';
    MobileNo = number;
    if(MobileNo.length > 8){
      if(MobileNo != this.userService.getData()["workshop_mobile_number_1"]){
      this.showspinner.setSpinner(true)
      this.isRunSpinner = true;
      this.generalService.AllSupplierDetails(MobileNo, this.userserviceworkshopid)
      .subscribe(dashResult=>{  
        this.showspinner.setSpinner(false) 
        this.isRunSpinner = false;
        console.log('dashResult', dashResult)
        
        if(dashResult[0].success){
          console.log('success', dashResult.success)
          this.existingSupplierData = dashResult[0].customer;
          if(dashResult[0].customer){
            console.log('customer', dashResult.customer)
            this.isExistingSupplier = true;
            // this.CreateSupplierForm.controls["address"].setValue(dashResult.customer.supplier_address);
            // this.CreateSupplierForm.controls["gst"].setValue(dashResult.customer.supplier_gst_no);
            // this.CreateSupplierForm.controls["firstname"].setValue(dashResult.customer.supplier_name);
            // this.CreateSupplierForm.controls["contact1"].setValue(dashResult.customer.supplier_mobile1);
            // this.CreateSupplierForm.controls["contact2"].setValue(dashResult.customer.supplier_mobile2);
            // this.CreateSupplierForm.controls["email"].setValue(dashResult.customer.supplier_email);
            // this.CreateSupplierForm.controls["firm"].setValue(dashResult.customer.business_name);
            // this.CreateSupplierForm.controls["master_supplier_id"].setValue(dashResult.customer.master_supplier_id);
            this.CreateSupplierForm.controls["address"].setValue(this.existingSupplierData.workshop_address);
            this.CreateSupplierForm.controls["gst"].setValue('');
            this.CreateSupplierForm.controls["firstname"].setValue(this.existingSupplierData.workshop_first_name+
              this.existingSupplierData.workshop_last_name);
            this.CreateSupplierForm.controls["contact1"].setValue(this.existingSupplierData.workshop_mobile_number_1);
            this.CreateSupplierForm.controls["contact2"].setValue(this.existingSupplierData.workshop_mobile_number_2);
            this.CreateSupplierForm.controls["email"].setValue(this.existingSupplierData.workshop_email);
            this.CreateSupplierForm.controls["firm"].setValue(this.existingSupplierData.workshop_name);
            this.CreateSupplierForm.controls["master_supplier_id"].setValue(this.existingSupplierData.workshop_id);
          console.log('found', this.existingSupplierData)
          
          }else{
            this.isExistingSupplier = false;
          }
        }else{
          if(dashResult[0] && dashResult[0].message !== 105){
            console.log('dashResult[0]', dashResult[0])
            if(dashResult[0].message == 105){
                console.log('dashResult[0]message == 105', dashResult[0].message == 105)
              this.isExistingSupplier = true;
              this.CreateSupplierForm.controls["contact1"].setValue("");
              this.snakBar.open("Message", 'Supplier already added', {
                duration: 4000
              })
            }
          }else{
            this.isSupplierNotFound = true;
            this.isExistingSupplier = false;
            this.CreateSupplierForm.controls["contact1"].setValue(MobileNo);
            this.snakBar.open("Message", 'Supplier not found', {
              duration: 4000
            })
          }
        }
      })
    }else{
      this.CreateSupplierForm.controls["contact1"].setValue("");
      this.snakBar.open("Message", 'You cant not add your own workshop Number', {
        duration: 4000
      })
    }
    }
    
  }

  // Submit form and verify OTP and login and register
  submitFormForRegister(e, newEv){
    if(this.CreateSupplierForm.value.contact1 != this.userService.getData()["workshop_mobile_number_1"]){
        var rD : any;
        rD = {};
        rD.email = this.CreateSupplierForm.value.email;
        rD.first_name = this.CreateSupplierForm.value.firstname;
        rD.last_name = '';
        rD.mobile_number_1 = this.CreateSupplierForm.value.contact1;
        rD.mobile_number_2 = this.CreateSupplierForm.value.contact2 || 0;
        rD.workshop_name = this.CreateSupplierForm.value.firm;
        rD.w2 = 0;
        rD.w3 = 0;
        rD.w4 = 0;
        rD.w6 = 0;
        rD.workshop_address = this.CreateSupplierForm.value.address;
        rD.workshop_city = '';
        rD.workshop_state = '';
        rD.pincode = 0;
        rD.rtocode = '';
        rD.terms_conditions = 0;
        rD.country_name = 'India';
        rD.country_code = +91;
        rD.country_currency = this.currency_symbol || '₹';
        rD.latlong = {"lat":this.latitude, "long":this.longitude};
        rD.primary_language = 'English';
        rD.password = '';
        rD.role = 'supplier';

        this.generalService.registerUser(rD.email, rD.first_name, rD.last_name, rD.mobile_number_1, 
          rD.mobile_number_2, rD.workshop_name, rD.w2, rD.w3, rD.w4, rD.w6, rD.workshop_address, rD.workshop_city, rD.workshop_state,
          rD.pincode, rD.rtocode, rD.terms_conditions, rD.country_name, rD.country_code, 
          rD.country_currency, rD.latlong, rD.primary_language,rD.password,rD.role).subscribe(registerData=>{
            if(registerData.success){
              var masterSupplierId = registerData.data[0].workshop_id || null;
              this.generalService.CreateUpdateSupplier('create', this.userserviceworkshopid,
              this.CreateSupplierForm.getRawValue().firstname,this.CreateSupplierForm.getRawValue().firm,this.CreateSupplierForm.getRawValue().contact1,
              this.CreateSupplierForm.getRawValue().contact2,this.CreateSupplierForm.getRawValue().email,this.CreateSupplierForm.getRawValue().address,
              this.CreateSupplierForm.getRawValue().gst,this.CreateSupplierForm.getRawValue().id,masterSupplierId).subscribe(dataupdate=>{
                    this.showspinner.setSpinner(true)
                    if(dataupdate.success==true){
                      this.getTabelData()
                      if(newEv=='createnew'){
                        this.opensupplier('new','no')
                      }
                      this.snakBar.open("Message", 'Supplier Added For login', {
                        duration: 4000
                      })
                    }
                  });
            }else{
              if(registerData.role){
                this.generalService.CreateUpdateSupplier('create',this.userserviceworkshopid,
                this.CreateSupplierForm.getRawValue().firstname,this.CreateSupplierForm.getRawValue().firm,this.CreateSupplierForm.getRawValue().contact1,
                this.CreateSupplierForm.getRawValue().contact2,this.CreateSupplierForm.getRawValue().email,this.CreateSupplierForm.getRawValue().address,
                this.CreateSupplierForm.getRawValue().gst,this.CreateSupplierForm.getRawValue().id,registerData.workshop_id).subscribe(dataupdate=>{
                    console.log("supplier added 2",dataupdate);
                    this.showspinner.setSpinner(true)
                    if(dataupdate.success==true){
                      this.getTabelData()
                      if(newEv=='createnew'){
                        this.opensupplier('new','no')
                      }
                      this.snakBar.open("Message", 'Supplier Added For login', {
                        duration: 4000})
                    }
                  });
              }else{
                this.snakBar.open("Message", 'Error', {
                  duration: 4000
                })
              }
           }
          },err=>{
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000
          })
        })
      }else{
        this.CreateSupplierForm.controls["contact1"].setValue("");
        this.snakBar.open("Message", 'You can not add your own workshop Number', {
          duration: 4000
        })
      }
      }


      getLocation(): void{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=>{
              this.longitude = position.coords.longitude;
              this.latitude = position.coords.latitude;
              // this.generalService.getAddrByLatLanSecond(this.longitude, this.latitude).subscribe(addr =>{
              //     console.log("address", addr);
              // })
            });
        } else {
           console.log("No support for geolocation")
        }
      }
}

