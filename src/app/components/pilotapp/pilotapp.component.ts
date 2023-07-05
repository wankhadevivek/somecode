import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router"
import { FormGroup,  FormBuilder,  Validators, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { GeneralService } from '../../services/general.service';
import { User } from '../../shared/model/user/user.module';
import { UserserviceService } from '../../services/userservice.service';
import { SpinnerService } from '../../services/spinner.service';
import  {ErrorMessgae}  from  '../../shared/error_message/error';
import { AbstractService } from '../../services/comman/abstract.service';
import { DilogOpenService } from '../../services/dilog-open.service';
import { PdfOrderService } from '../../services/pdforder.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as glob from "../../shared/usercountry/userCountryGlobal"
@Component({
  selector: 'app-pilotapp',
  templateUrl: './pilotapp.component.html',
  styleUrls: ['./pilotapp.component.css']
})
/**
 * In this Compoenet
 * Online Stiore is worksing
 * all cort, order and profile section 
*/
export class PilotappComponent implements OnInit {
  showproduct:boolean=true
  firstFormGroup: FormGroup;
  showproductavalibale:boolean=true
  showproductarr=Array()
  description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi ducimus repudiandae est, alias maxime, dolorem minima repellat, temporibus doloribus eligendi fugiat! Quibusdam quia eligendi aliquam error ad aliquid eaque debitis."
  secondFormGroup: FormGroup;
  customerform: FormGroup;
  orderdata
  confirmok:boolean=false
  formname
  formprice
  formorignal
  formqty
  formaddqty
  formtotalamount
  formtotalamountorignal
  showStepor:boolean=false
  shownext:boolean=true
  suppliername
  supplierphone
  supplieremail 
  supplieraddress
  userdata
  productorderid=''
  orderamount
  fulladdress
  isLinear = true;
  showStep=true
  submitted = false;
  submittedsecond = false;
  otpvalue=''
  hasnext:boolean=false;
  nextUrl:string
  showscroll:boolean=true
  bookscrollshow:boolean=true
  contactlink
  scrollDistance = 0;
  showcancel:boolean=false
  searchitem=''
  showLogin:boolean=false
  showorders:boolean=false
  showcart:boolean=false
  showbook:boolean=false
  isData:boolean=true
  homeClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
  serviceClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
  bookingClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
  profileclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
  cusname
  cusnumber
  workshopname
  showordersdata:boolean=true
  jobcardclass="listbook active col-lg-6 col-sm-6 col-md-6 col-xs-6 text-center"
  bookingclass="listbook col-lg-6 col-sm-6 col-md-6 col-xs-6 text-center"
  showJobs:boolean=true
  showbookings:boolean=false
  jobcardListed:boolean=true
  bookListed:boolean=false
  CompletedProducts=Array()
  pendingProdcuts=Array()
  hasnextbook
  nextUrlbook
  showprosec:boolean=true
  proclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro active"
  vehclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
  payclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
  aboutclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
  showprofile:boolean=true
  showvehicle:boolean=false
  showpayment:boolean=false
  showabout:boolean=false
  savebitton:boolean=false
  editbitton:boolean=false
  updatebutton:boolean=false
  editbittonaddress:boolean=false
  updatebuttonaddress:boolean=false
  cartLength:boolean=true
  cartlencount=0
  cratAllData=Array()
  orignalCartAmount=0
  finalCartAmount=0
  showplaces:boolean=false
  workshop_id
  allSupierDeatils=Array()
  currency_symbol: any;
  totalLength:any;
  page:number=1;
  orderStatuses=
    {
      '1': ['Accepted', '#dddd0e'],
      '2': ['Packed', '#e98620'],
      '3': ['Out For Delivery', '#5764c1'],
      '4': ['Delivered', '#3e9719'],
      '5': ['Payment Received', '#98e577'],
      '6': ['Delivery Failed (Address Issue)', '#f1501f'],
      '7': ['Canceled', '#f1501f'],
      '8': ['Pending', '#f1501f'],
      '9': ['Delayed due to Out of Stock', '#f1501f'],
     }

  constructor(public abstract:AbstractService,
    private showSpinnerLogin:SpinnerService,
    private counterpdf:PdfOrderService,
    private router: Router,
    private snakBar:MatSnackBar,
    private formbuild: FormBuilder,
    private general:GeneralService,
    private dialog:DilogOpenService,
    private userService:UserserviceService) { 
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
    var myDynamicManifest
    myDynamicManifest = {
      "name": 'TTN Retail Store',
      "short_name": 'TTN Retail Store',
      "start_url": window.location.href,
      "description":"TTN Retail Store",
      "theme_color": "#1976d2",
      "background_color": "#fafafa",
      "display": "fullscreen",
      "orientation":"portrait",
      "icons": [{
        "src": this.abstract.imageUrl3,
        "sizes": "256x256",
        "type": "image/png"
      }]
    }
    
    const stringManifest = JSON.stringify(myDynamicManifest);
    const blob = new Blob([stringManifest], {type: 'application/json'});
    const manifestURL = URL.createObjectURL(blob);
    document.querySelector('#my-manifest-placeholder').setAttribute('href', manifestURL);
    if(!localStorage.getItem('user')){
      this.workshop_id='not'
    }else{
      this.workshop_id=JSON.parse(localStorage.getItem('user')).workshop_id
    }
  }
  // get all the products details
  ngOnInit() {
    this.currency_symbol = glob.currency_symbol;
    if(!localStorage.getItem('user')){
      this.dialog.openStoteLogin('false','').subscribe(data=>{
        if(data=='registerlogin'){
          this.editbitton=true
          this.showprosec=true
          this.profileclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon active text-center"
          this.homeClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
          this.serviceClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
          this.bookingClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
          this.showLogin=true
          this.showorders=false
          this.showcart=false
          this.showbook=false
          this.showproduct=false
          this.proclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro active"
          this.vehclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
          this.payclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
          this.aboutclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
          this.showprofile=true
          this.showvehicle=false
          this.showpayment=false
          this.showabout=false
          this.cusname=this.userService.getData()["workshop_name"]
          this.cusnumber=this.userService.getData()["workshop_mobile_number_1"]
          this.userdata=JSON.parse(localStorage.getItem('user'))
          this.customerform.controls["name"].setValue(this.userdata.workshop_name,{onlySelf:true})
          this.customerform.controls["mobilenumber"].setValue(this.userdata.workshop_mobile_number_1,{onlySelf:true})
          this.customerform.controls["email"].setValue(this.userdata.email,{onlySelf:true})
          this.customerform.controls["address"].setValue(this.userdata.address)
          this.customerform.controls["state"].setValue(this.userdata.state)
          this.customerform.controls["city"].setValue(this.userdata.city)
          this.customerform.controls["pin"].setValue(this.userdata.pincode)
          this.customerform.controls["name"].disable()
          this.customerform.controls["mobilenumber"].disable()
          this.customerform.controls["address"].disable()
          this.customerform.controls["pin"].disable()
          this.customerform.controls["city"].disable()
          this.customerform.controls["state"].disable()
          this.customerform.controls["email"].disable()
        }else if(data=='login'){
          this.userdata=JSON.parse(localStorage.getItem('user'))
          this.showSpinnerLogin.setSpinnerForLogin(true)
          setTimeout(() =>this.ngOnInit(), 3000);
        }else{
          this.showSpinnerLogin.setSpinnerForLogin(false)
        }
      })
    }else{
      this.userdata=JSON.parse(localStorage.getItem('user'))
    }
    this.customerform = this.formbuild.group({
      firstname: ['', Validators.required],
      lastname: [''],
      workshopname: ['', Validators.required],
      mobilenumber: ['', [Validators.required,Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', Validators.email ],
      address: [''],
      state: [''],
      city: [''],
      pin: ['']
    });
    this.showproductarr=[]
    this.homeClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon active text-center"
    this.serviceClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
    this.bookingClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
    this.profileclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
    this.showLogin=false
    this.showorders=false
    this.showcart=false
    this.showbook=false
    this.showproduct=true
    this.firstFormGroup = this.formbuild.group({
      workname: ['', Validators.required],
      name: ['', Validators.required],
      mobilenumber: ['', [Validators.required,Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', Validators.email ],
      address: ['', Validators.required],
      city: ['Pune', Validators.required],
      zipcode:['', Validators.required],
    });
    this.secondFormGroup = this.formbuild.group({
      address: ['', Validators.required],
      city: ['Pune', Validators.required],
      state: ['Maharashtra', Validators.required],
      zipcode:['', Validators.required],
    });
    var workshop_id
    if(!localStorage.getItem('user')){
      workshop_id='not'
    }else{
      workshop_id=JSON.parse(localStorage.getItem('user')).workshop_id
    }
    this.general.getProductDetails(workshop_id).subscribe(product=>{
      this.showSpinnerLogin.setSpinnerForLogin(true)
      if(product.success==true){
        var allcartId=[]
        this.allSupierDeatils=product.supplier
        if(workshop_id!='not'){
          this.general.getCartDetails(workshop_id).subscribe(crat=>{      
            this.showSpinnerLogin.setSpinnerForLogin(true)
            if(crat.success==true){
              crat.cart.map(datacart=>{
                allcartId.push(datacart.product_id)
              })
            }
            this.showSpinnerLogin.setSpinnerForLogin(false)
          },err=>{
            this.showSpinnerLogin.setSpinner(false)
            this.snakBar.open("Error", ErrorMessgae[0][err], {
              duration: 4000
            })
          })
        }
        this.showproductavalibale=true
        var imagelog
        this.suppliername=product.supplier[0].business_name
        if(product.supplier[0].supplier_mobile2==null){
          this.supplierphone=product.supplier[0].supplier_mobile1
        }else
        {
          this.supplierphone=product.supplier[0].supplier_mobile1+"/"+product.supplier[0].supplier_mobile2
        }
        
        if(product.supplier[0].supplier_email==null&&product.supplier[0].supplier_email==''){
          this.supplieremail=''
        }else
        {
          this.supplieremail=product.supplier[0].supplier_email
        }
        this.supplieraddress=product.supplier[0].supplier_address
        this.showscroll=true
        if(product["has_next"]==true){
          this.hasnext=true
          this.nextUrl=product["next_page"]
        }else{
          this.hasnext=false
          this.nextUrl=""
        }
        this.cartlencount=product.cartlen
        if(this.cartlencount!=0){
          this.cartLength=true
        }else{
          this.cartLength=false
        }
        this.showSpinnerLogin.setSpinnerForLogin(true)
        setTimeout(
          () => product.products.map(data=>{
            if(data.image!=""){
              imagelog=data.image
            }else{
              imagelog="../../../assets/images/ttn.png"
            }
            var percentcal
            if(data.orignal_price!=''){
              percentcal=(100-(parseFloat(data.price)*100)/parseFloat(data.orignal_price))
            }else{
              percentcal=0
            }
            var castadded="Add"
            if(allcartId.includes(data.id)){
              castadded="Added"
            }
            this.showproductarr.push({
              "id":data.id,
              "name":data.product_name,
              "desc":data.description,
              "price":data.price,
              "company":data.company,
              "orprice":data.orignal_price,
              "percent":Math.round(percentcal),
              "skuid":data.skuid,
              "image":imagelog,
              "qunatuty":1,
              "supplier":data.supplier,
              "addtocartbut":castadded,
              "units":data.units
            })
          }), 1000);
          
           
          this.totalLength = this.showproductarr.length
        this.showSpinnerLogin.setSpinnerForLogin(false)
      }else{
        this.showSpinnerLogin.setSpinnerForLogin(false)
        this.showproductavalibale=false
      }
    },err=>{
      this.showSpinnerLogin.setSpinnerForLogin(false)
      this.snakBar.open(err, ErrorMessgae[0][err], {
        duration: 4000
      })
    })
  }
//-----------------------------------------------------------About-----------------------------------------------------------------------
  // Get support for onlne storee
  sharewhatsApp(){
    this.contactlink="https://web.whatsapp.com/send?phone=919420534415&text=Enquiry%20for%20Online%20Store"
  }
//-----------------------------------------------------------Homepage data---------------------------------------------------------
  //On home page scroll
  onScrollDown(){
    if(this.showscroll==true){
      if(this.hasnext==true){
          
        this.showSpinnerLogin.setSpinner(true)
        this.getDataForPagination()
      }
    }
  }
  //Get paginated data
  getDataForPagination(){
    this.general.getProductDetailspagi(this.nextUrl).subscribe(product=>{      
      this.showSpinnerLogin.setSpinnerForLogin(true)
      if(product.success==true){
        this.showSpinnerLogin.setSpinnerForLogin(false)
        this.allSupierDeatils=product.supplier
        this.showproductavalibale=true
        var imagelog

        this.suppliername=product.supplier[0].business_name
        if(product.supplier[0].supplier_mobile2==null){
          this.supplierphone=product.supplier[0].supplier_mobile1
        }else
        {
          this.supplierphone=product.supplier[0].supplier_mobile1+"/"+product.supplier[0].supplier_mobile2
        }
        
        if(product.supplier[0].supplier_email==null&&product.supplier[0].supplier_email==''){
          this.supplieremail=''
        }else
        {
          this.supplieremail=product.supplier[0].supplier_email
        }
        this.supplieraddress=product.supplier[0].supplier_address
        this.showscroll=true
        if(product["has_next"]==true){
          this.hasnext=true
          this.nextUrl=product["next_page"]
        }else{
          this.hasnext=false
          this.nextUrl=""
        }
        this.cartlencount=product.cartlen
        if(this.cartlencount!=0){
          this.cartLength=true
        }else{
          this.cartLength=false
        }
        var allcartId=[]
        if(this.workshop_id!='not'){
          this.general.getCartDetails(this.workshop_id).subscribe(crat=>{      
            this.showSpinnerLogin.setSpinnerForLogin(true)
            if(crat.success==true){
              crat.cart.map(datacart=>{
                allcartId.push(datacart.product_id)
              })
            }
            this.showSpinnerLogin.setSpinnerForLogin(false)
          },err=>{
            this.showSpinnerLogin.setSpinner(false)
            this.snakBar.open("Error", ErrorMessgae[0][err], {
              duration: 4000
            })
          })
        }
        this.showSpinnerLogin.setSpinnerForLogin(true)
        setTimeout(
          () => product.products.map(data=>{
            if(data.image!=""){
              imagelog=data.image
            }else{
              imagelog="../../../assets/images/ttn.png"
            }
            var percentcal
            if(data.orignal_price!=''){
              percentcal=(100-(parseFloat(data.price)*100)/parseFloat(data.orignal_price))
            }else{
              percentcal=0
            }
            var castadded="Add"
            if(allcartId.includes(data.id)){
              castadded="Added"
            }
            this.showproductarr.push({
              "id":data.id,
              "name":data.product_name,
              "desc":data.description,
              "price":data.price,
              "company":data.company,
              "orprice":data.orignal_price,
              "percent":Math.round(percentcal),
              "skuid":data.skuid,
              "image":imagelog,
              "qunatuty":1,
              "supplier":data.supplier,
              "addtocartbut":castadded,
              "units":data.units
            })
          }), 1000);
        this.showSpinnerLogin.setSpinnerForLogin(false)
      }else{
        this.showSpinnerLogin.setSpinnerForLogin(false)
        this.showproductavalibale=false
      }
    },err=>{
      this.showSpinnerLogin.setSpinner(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
    //this.data = this.tabelData
   
  }
  //Saerch product
  searchProduct(event){
    this.showcancel=true
    this.general.SearchProductDetails(event).subscribe(product=>{      
      this.showSpinnerLogin.setSpinnerForLogin(true)
      if(product.success==true){
        this.isData=true
        this.showSpinnerLogin.setSpinnerForLogin(false)
        this.showproductarr=[]
        this.showproductavalibale=true
        var imagelog

        this.suppliername=product.supplier[0].business_name
        if(product.supplier[0].supplier_mobile2==null){
          this.supplierphone=product.supplier[0].supplier_mobile1
        }else
        {
          this.supplierphone=product.supplier[0].supplier_mobile1+"/"+product.supplier[0].supplier_mobile2
        }
        
        if(product.supplier[0].supplier_email==null&&product.supplier[0].supplier_email==''){
          this.supplieremail=''
        }else
        {
          this.supplieremail=product.supplier[0].supplier_email
        }
        this.supplieraddress=product.supplier[0].supplier_address
        this.showscroll=true
        if(product["has_next"]==true){
          this.hasnext=true
          this.nextUrl=product["next_page"]
        }else{
          this.hasnext=false
          this.nextUrl=""
        }
        var allcartId=[]
        if(this.workshop_id!='not'){
          this.general.getCartDetails(this.workshop_id).subscribe(crat=>{      
            this.showSpinnerLogin.setSpinnerForLogin(true)
            if(crat.success==true){
              crat.cart.map(datacart=>{
                allcartId.push(datacart.product_id)
              })
            }
            this.showSpinnerLogin.setSpinnerForLogin(false)
          },err=>{
            this.showSpinnerLogin.setSpinner(false)
            this.snakBar.open("Error", ErrorMessgae[0][err], {
              duration: 4000
            })
          })
        }
        this.showSpinnerLogin.setSpinnerForLogin(true)
        this.showproductarr=[]
        // console.log('search data', product.products)
        setTimeout(
          
          () => {
            this.showproductarr=[]
            product.products.map(data=>{
            if(data.image!=""){
              imagelog=data.image
            }else{
              imagelog="../../../assets/images/ttn.png"
            }
            var percentcal
            if(data.orignal_price!=''){
              percentcal=(100-(parseFloat(data.price)*100)/parseFloat(data.orignal_price))
            }else{
              percentcal=0
            }
            var castadded="Add"
            if(allcartId.includes(data.id)){
              castadded="Added"
            }
            this.showproductarr.push({
              "id":data.id,
              "name":data.product_name,
              "desc":data.description,
              "price":data.price,
              "company":data.company,
              "orprice":data.orignal_price,
              "percent":Math.round(percentcal),
              "skuid":data.skuid,
              "image":imagelog,
              "qunatuty":1,
              "supplier":data.supplier,
              "addtocartbut":castadded,
              "units":data.units
            })
          })}, 1000);
        this.showSpinnerLogin.setSpinnerForLogin(false)
      }else{
        this.isData=false
        this.showSpinnerLogin.setSpinnerForLogin(false)
        this.showproductavalibale=false
      }
    },err=>{
      this.showSpinnerLogin.setSpinner(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
    this.searchitem=event
  }
  //Cancel search
  cancelSearch(){
    this.general.getProductDetails(this.workshop_id).subscribe(product=>{
      this.showSpinnerLogin.setSpinnerForLogin(true)
      if(product.success==true){
        this.isData=true
        var allcartId=[]
        this.allSupierDeatils=product.supplier
        if(this.workshop_id!='not'){
          this.general.getCartDetails(this.workshop_id).subscribe(crat=>{      
            this.showSpinnerLogin.setSpinnerForLogin(true)
            if(crat.success==true){
              crat.cart.map(datacart=>{
                allcartId.push(datacart.product_id)
              })
            }
            this.showSpinnerLogin.setSpinnerForLogin(false)
          },err=>{
            this.showSpinnerLogin.setSpinner(false)
            this.snakBar.open("Error", ErrorMessgae[0][err], {
              duration: 4000
            })
          })
        }
        this.showproductavalibale=true
        var imagelog
        this.suppliername=product.supplier[0].business_name
        if(product.supplier[0].supplier_mobile2==null){
          this.supplierphone=product.supplier[0].supplier_mobile1
        }else
        {
          this.supplierphone=product.supplier[0].supplier_mobile1+"/"+product.supplier[0].supplier_mobile2
        }
        
        if(product.supplier[0].supplier_email==null&&product.supplier[0].supplier_email==''){
          this.supplieremail=''
        }else
        {
          this.supplieremail=product.supplier[0].supplier_email
        }
        this.supplieraddress=product.supplier[0].supplier_address
        this.showscroll=true
        if(product["has_next"]==true){
          this.hasnext=true
          this.nextUrl=product["next_page"]
        }else{
          this.hasnext=false
          this.nextUrl=""
        }
        this.cartlencount=product.cartlen
        if(this.cartlencount!=0){
          this.cartLength=true
        }else{
          this.cartLength=false
        }
        this.showSpinnerLogin.setSpinnerForLogin(true)
        this.showproductarr=[]
        setTimeout(
          () => product.products.map(data=>{
            if(data.image!=""){
              imagelog=data.image
            }else{
              imagelog="../../../assets/images/ttn.png"
            }
            var percentcal
            if(data.orignal_price!=''){
              percentcal=(100-(parseFloat(data.price)*100)/parseFloat(data.orignal_price))
            }else{
              percentcal=0
            }
            var castadded="Add"
            if(allcartId.includes(data.id)){
              castadded="Added"
            }
            this.showproductarr.push({
              "id":data.id,
              "name":data.product_name,
              "desc":data.description,
              "price":data.price,
              "company":data.company,
              "orprice":data.orignal_price,
              "percent":Math.round(percentcal),
              "skuid":data.skuid,
              "image":imagelog,
              "qunatuty":1,
              "supplier":data.supplier,
              "addtocartbut":castadded,
              "units":data.units
            })
          }), 1000);
        this.showSpinnerLogin.setSpinnerForLogin(false)
      }else{
        this.isData=false
        this.showSpinnerLogin.setSpinnerForLogin(false)
        this.showproductavalibale=false
      }
    },err=>{
      this.showSpinnerLogin.setSpinnerForLogin(false)
      this.snakBar.open(err, ErrorMessgae[0][err], {
        duration: 4000
      })
    })
    this.showcancel=false
    this.searchitem=''
  }
  //Sort products
  openSortPopup(){
    //OpenProductSort
    this.dialog.OpenProductSort().subscribe(sortdata=>{
      // console.log(sortdata)
      if(sortdata!=undefined){
        this.sortAllData(sortdata)
      }
      
    })
  }
  //Filter Products
  filterdata(data){
    this.sortAllData(data)
  }
  //Sort the filter data
  sortAllData(data){
    this.general.SortProductDetails(data).subscribe(product=>{      
      this.showSpinnerLogin.setSpinnerForLogin(true)
      if(product.success==true){
        this.isData=true
        this.showSpinnerLogin.setSpinnerForLogin(false)
        this.showproductarr=[]
        this.showproductavalibale=true
        var imagelog

        this.suppliername=product.supplier[0].business_name
        if(product.supplier[0].supplier_mobile2==null){
          this.supplierphone=product.supplier[0].supplier_mobile1
        }else
        {
          this.supplierphone=product.supplier[0].supplier_mobile1+"/"+product.supplier[0].supplier_mobile2
        }
        
        if(product.supplier[0].supplier_email==null&&product.supplier[0].supplier_email==''){
          this.supplieremail=''
        }else
        {
          this.supplieremail=product.supplier[0].supplier_email
        }
        this.supplieraddress=product.supplier[0].supplier_address
        this.showscroll=true
        if(product["has_next"]==true){
          this.hasnext=true
          this.nextUrl=product["next_page"]
        }else{
          this.hasnext=false
          this.nextUrl=""
        }
        var allcartId=[]
        if(this.workshop_id!='not'){
          this.general.getCartDetails(this.workshop_id).subscribe(crat=>{      
            this.showSpinnerLogin.setSpinnerForLogin(true)
            if(crat.success==true){
              crat.cart.map(datacart=>{
                allcartId.push(datacart.product_id)
              })
            }
            this.showSpinnerLogin.setSpinnerForLogin(false)
          },err=>{
            this.showSpinnerLogin.setSpinner(false)
            this.snakBar.open("Error", ErrorMessgae[0][err], {
              duration: 4000
            })
          })
        }
        this.showSpinnerLogin.setSpinnerForLogin(true)
        setTimeout(
          () => product.products.map(data=>{
            if(data.image!=""){
              imagelog=data.image
            }else{
              imagelog="../../../assets/images/ttn.png"
            }
            var percentcal
            if(data.orignal_price!=''){
              percentcal=(100-(parseFloat(data.price)*100)/parseFloat(data.orignal_price))
            }else{
              percentcal=0
            }
            var castadded="Add"
            if(allcartId.includes(data.id)){
              castadded="Added"
            }
            this.showproductarr.push({
              "id":data.id,
              "name":data.product_name,
              "desc":data.description,
              "price":data.price,
              "company":data.company,
              "orprice":data.orignal_price,
              "percent":Math.round(percentcal),
              "skuid":data.skuid,
              "image":imagelog,
              "qunatuty":1,
              "supplier":data.supplier,
              "addtocartbut":castadded,
              "units":data.units
            })
          }), 1000);
        this.showSpinnerLogin.setSpinnerForLogin(false)
      }else{
        this.isData=false
        this.showSpinnerLogin.setSpinnerForLogin(false)
        this.showproductavalibale=false
      }
    },err=>{
      this.showSpinnerLogin.setSpinner(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
  }
//-----------------------------------------------------------Fotter Data---------------------------------------------------------
  //Home icon click
  homeIcon(){
    this.homeClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon active text-center"
    this.serviceClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
    this.bookingClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
    this.profileclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
    this.showLogin=false
    this.showorders=false
    this.showcart=false
    this.showbook=false
    this.showproduct=true
    this.ngOnInit()
  }
  //Crat Icon click
  bookingIcon(){
    this.homeClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
    this.serviceClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
    this.bookingClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon active text-center"
    this.profileclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
    this.showLogin=false
    this.showorders=true
    this.showcart=false
    this.showbook=false
    this.showproduct=false
    if(!localStorage.getItem('user')){
      this.workshopname=''
      this.showordersdata=false
    }else{
      this.workshopname=this.userdata.workshop_name
      this.showordersdata=true
      this.jobclass()
    }
  }
  //Orders icon click
  serviceIcon(){
    if(!localStorage.getItem('user')){
      this.dialog.openStoteLogin('false','').subscribe(data=>{
        if(data=='registerlogin'){
          this.homeClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
          this.serviceClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon active text-center"
          this.bookingClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
          this.profileclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
          this.showLogin=false
          this.showorders=false
          this.showcart=true
          this.showbook=false
          this.showproduct=false
          this.userdata=JSON.parse(localStorage.getItem('user'))
          this.cartlencount=0
          this.cartLength=false
        }else if(data=='login'){
          this.homeClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
          this.serviceClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon active text-center"
          this.bookingClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
          this.profileclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
          this.showLogin=false
          this.showorders=false
          this.showcart=true
          this.showbook=false
          this.showproduct=false
          setTimeout(
            () => this.userdata=JSON.parse(localStorage.getItem('user')), 1000);
            setTimeout(
              () => this.getCratDetails(this.userdata.workshop_id), 1000);
        }
      })
    }else{
      this.homeClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
      this.serviceClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon active text-center"
      this.bookingClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
      this.profileclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
      this.showLogin=false
      this.showorders=false
      this.showcart=true
      this.showbook=false
      this.showproduct=false
      this.userdata=JSON.parse(localStorage.getItem('user'))
      this.getCratDetails(JSON.parse(localStorage.getItem('user')).workshop_id)
    }
  }
  //Profile icon click
  profileIcon(){
    if(!localStorage.getItem('user')){
      this.dialog.openStoteLogin('false','').subscribe(data=>{
        if(data=='registerlogin'){
          this.editbitton=true
          this.showprosec=true
          this.profileclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon active text-center"
          this.homeClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
          this.serviceClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
          this.bookingClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
          this.showLogin=true
          this.showorders=false
          this.showcart=false
          this.showbook=false
          this.showproduct=false
          this.proclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
          this.vehclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro active"
          this.payclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
          this.aboutclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
          this.showprofile=true
          this.showvehicle=false
          this.showpayment=false
          this.showabout=false
          this.cusname=this.userService.getData()["workshop_name"]
          this.cusnumber=this.userService.getData()["workshop_mobile_number_1"]
          this.userdata=JSON.parse(localStorage.getItem('user'))
          this.customerform.controls["firstname"].setValue(this.userdata.first_name,{onlySelf:true})
          this.customerform.controls["lastname"].setValue(this.userdata.last_name,{onlySelf:true})
          this.customerform.controls["workshopname"].setValue(this.userdata.workshop_name,{onlySelf:true})
          this.customerform.controls["mobilenumber"].setValue(this.userdata.workshop_mobile_number_1,{onlySelf:true})
          this.customerform.controls["email"].setValue(this.userdata.email,{onlySelf:true})
          this.customerform.controls["address"].setValue(this.userdata.address)
          this.customerform.controls["state"].setValue(this.userdata.state)
          this.customerform.controls["city"].setValue(this.userdata.city)
          this.customerform.controls["pin"].setValue(this.userdata.pincode)
          this.customerform.controls["firstname"].disable()
          this.customerform.controls["lastname"].disable()
          this.customerform.controls["workshopname"].disable()
          this.customerform.controls["mobilenumber"].disable()
          this.customerform.controls["address"].disable()
          this.customerform.controls["pin"].disable()
          this.customerform.controls["city"].disable()
          this.customerform.controls["state"].disable()
          this.customerform.controls["email"].disable()
        }else{
          this.userdata=JSON.parse(localStorage.getItem('user'))
        }
      })
    }else{
      this.editbitton=true
      this.showprosec=true
      this.profileclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon active text-center"
      this.homeClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
      this.serviceClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
      this.bookingClass="col-lg-3 col-sm-3 col-md-3 col-xs-3 homeicon text-center"
      this.showLogin=true
      this.showorders=false
      this.showcart=false
      this.showbook=false
      this.showproduct=false
      this.proclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro active"
      this.vehclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.payclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.aboutclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.showprofile=true
      this.showvehicle=false
      this.showpayment=false
      this.showabout=false
      this.cusname=this.userService.getData()["workshop_name"]
      this.cusnumber=this.userService.getData()["workshop_mobile_number_1"]
      this.userdata=JSON.parse(localStorage.getItem('user'))
      this.customerform.controls["firstname"].setValue(this.userdata.first_name,{onlySelf:true})
      this.customerform.controls["lastname"].setValue(this.userdata.last_name,{onlySelf:true})
      this.customerform.controls["workshopname"].setValue(this.userdata.workshop_name,{onlySelf:true})
      this.customerform.controls["mobilenumber"].setValue(this.userdata.workshop_mobile_number_1,{onlySelf:true})
      this.customerform.controls["email"].setValue(this.userdata.email,{onlySelf:true})
      this.customerform.controls["address"].setValue(this.userdata.address)
      this.customerform.controls["state"].setValue(this.userdata.state)
      this.customerform.controls["city"].setValue(this.userdata.city)
      this.customerform.controls["pin"].setValue(this.userdata.pincode)
      this.customerform.controls["firstname"].disable()
      this.customerform.controls["lastname"].disable()
      this.customerform.controls["workshopname"].disable()
      this.customerform.controls["mobilenumber"].disable()
      this.customerform.controls["address"].disable()
      this.customerform.controls["pin"].disable()
      this.customerform.controls["city"].disable()
      this.customerform.controls["state"].disable()
      this.customerform.controls["email"].disable()
    }
  }
//-----------------------------------------------------------Show Order List---------------------------------------------------------
  //Show orders
  jobclass(){
    this.jobcardclass="listbook active col-lg-6 col-sm-6 col-md-6 col-xs-6 text-center"
    this.bookingclass="listbook col-lg-6 col-sm-6 col-md-6 col-xs-6 text-center"
    this.showJobs=true
    this.showbookings=false
    this.hasnextbook=false
    this.nextUrlbook=''
    this.getOrderList('inprocess')
  }
  //show all orders
  bookclass(){
    this.jobcardclass="listbook col-lg-6 col-sm-6 col-md-6 col-xs-6 text-center"
    this.bookingclass="listbook active col-lg-6 col-sm-6 col-md-6 col-xs-6 text-center"
    this.showJobs=false
    this.showbookings=true
    this.hasnextbook=false
    this.nextUrlbook=''
    this.getOrderList('completed')
  }
  //Verify or login the user if not
  openVerifyData(){
    this.dialog.openStoteLogin('false','').subscribe(data=>{
      if(data=='registerlogin'){
        this.editbitton=true
        this.showprosec=true
        this.bookingIcon()
        this.userdata=JSON.parse(localStorage.getItem('user'))
      }else if(data=='login'){
        this.userdata=JSON.parse(localStorage.getItem('user'))
        this.bookingIcon()
      }
    })
  }
  //get all orderd details
  getOrderList(event){
    this.general.getAllPOrders(this.userdata.workshop_id).subscribe(product=>{
      this.showSpinnerLogin.setSpinnerForLogin(true)
      if(product.success==true){
        this.showordersdata=true
        this.pendingProdcuts=[]
        this.CompletedProducts=[]
        this.showSpinnerLogin.setSpinnerForLogin(false)
        this.bookscrollshow=true
        if(product["has_next"]==true){
          this.hasnextbook=true
          this.nextUrlbook=product["next_page"]
        }else{
          this.hasnextbook=false
          this.nextUrlbook=""
        }
        if(product.order.length!=0){
          this.jobcardListed=true
          product.order.map(data=>{
            if(data.cart_details!=""&&data.cart_details!=null){
              
              
              this.pendingProdcuts.push({
                "id":data.id,
                "cartdetails":JSON.parse(data.cart_details),
                'status':data.status,
                'orderid':data.orderid,
                "price":data.orderamount,
                "created_at":data.created_at,
                "customername": data.customername,
                "customerphone": data.customerphone,
                "customeremail": data.customeremail,
                "address": data.address,
                "city": data.city,
                "pincode": data.pincode,

              })


              // console.log('orderStatuses[data.status][1]',data.status)
            }
          })
        }else{
          this.jobcardListed=false
        }
      }else{
        this.showSpinnerLogin.setSpinnerForLogin(false)
        this.showproductavalibale=false
        this.showordersdata=false
      }
    },err=>{
      this.showSpinnerLogin.setSpinnerForLogin(false)
      this.snakBar.open(err, ErrorMessgae[0][err], {
        duration: 4000
      })
    })
  }
  //order pagination
  onScrollDownorders(){
    if(this.bookscrollshow==true){
      if(this.hasnextbook==true){
          
        this.showSpinnerLogin.setSpinner(true)
        this.getOrderListpagi()
      }
    }
  }
  //order pagination
  getOrderListpagi(){
    this.general.getAllPOrderspagi(this.nextUrlbook).subscribe(product=>{
      this.showSpinnerLogin.setSpinnerForLogin(true)
      if(product.success==true){
        this.showSpinnerLogin.setSpinnerForLogin(false)
        this.bookscrollshow=true
        if(product["has_next"]==true){
          this.hasnextbook=true
          this.nextUrlbook=product["next_page"]
        }else{
          this.hasnextbook=false
          this.nextUrlbook=""
        }
        if(product.order.length!=0){
          this.jobcardListed=true
          product.order.map(data=>{
            if(data.cart_details!=""&&data.cart_details!=null){
              this.pendingProdcuts.push({
                "id":data.id,
                "cartdetails":JSON.parse(data.cart_details),
                'status':data.status,
                'orderid':data.orderid,
                "price":data.orderamount,
                "created_at":data.created_at,
                "customername": data.customername,
                "customerphone": data.customerphone,
                "customeremail": data.customeremail,
                "address": data.address,
                "city": data.city,
                "pincode": data.pincode,
              })
            }
          })
        }else{
          this.jobcardListed=false
        }
      }else{
        this.showSpinnerLogin.setSpinnerForLogin(false)
        this.showproductavalibale=false
      }
    },err=>{
      this.showSpinnerLogin.setSpinnerForLogin(false)
      this.snakBar.open(err, ErrorMessgae[0][err], {
        duration: 4000
      })
    })
  }
//-----------------------------------------------------------Profile Section---------------------------------------------------------
  //Profile section
  checkacticeclass(checkclas){
    if(checkclas=='profile'){
      this.proclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro active"
      this.vehclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.payclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.aboutclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.showprofile=true
      this.showvehicle=false
      this.showpayment=false
      this.showabout=false
      this.editbitton=true
      this.updatebutton=false
      this.userdata=JSON.parse(localStorage.getItem('user'))
      this.customerform.controls["firstname"].setValue(this.userdata.first_name,{onlySelf:true})
      this.customerform.controls["lastname"].setValue(this.userdata.last_name,{onlySelf:true})
      this.customerform.controls["workshopname"].setValue(this.userdata.workshop_name,{onlySelf:true})
      this.customerform.controls["mobilenumber"].setValue(this.userdata.workshop_mobile_number_1,{onlySelf:true})
      this.customerform.controls["email"].setValue(this.userdata.email,{onlySelf:true})
      this.customerform.controls["address"].setValue(this.userdata.address)
      this.customerform.controls["state"].setValue(this.userdata.state)
      this.customerform.controls["city"].setValue(this.userdata.city)
      this.customerform.controls["pin"].setValue(this.userdata.pincode)
      this.customerform.controls["firstname"].disable()
      this.customerform.controls["lastname"].disable()
      this.customerform.controls["workshopname"].disable()
      this.customerform.controls["mobilenumber"].disable()
      this.customerform.controls["address"].disable()
      this.customerform.controls["pin"].disable()
      this.customerform.controls["city"].disable()
      this.customerform.controls["state"].disable()
      this.customerform.controls["email"].disable()
    }else if(checkclas=='vehicle'){
      this.proclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.vehclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro active"
      this.payclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.aboutclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.showprofile=false
      this.showvehicle=true
      this.showpayment=false
      this.showabout=false
      this.editbittonaddress=true
      this.updatebuttonaddress=false
      this.userdata=JSON.parse(localStorage.getItem('user'))
      this.customerform.controls["firstname"].setValue(this.userdata.first_name,{onlySelf:true})
      this.customerform.controls["lastname"].setValue(this.userdata.last_name,{onlySelf:true})
      this.customerform.controls["workshopname"].setValue(this.userdata.workshop_name,{onlySelf:true})
      this.customerform.controls["mobilenumber"].setValue(this.userdata.workshop_mobile_number_1,{onlySelf:true})
      this.customerform.controls["email"].setValue(this.userdata.email,{onlySelf:true})
      this.customerform.controls["address"].setValue(this.userdata.address)
      this.customerform.controls["state"].setValue(this.userdata.state)
      this.customerform.controls["city"].setValue(this.userdata.city)
      this.customerform.controls["pin"].setValue(this.userdata.pincode)
      this.customerform.controls["firstname"].disable()
      this.customerform.controls["lastname"].disable()
      this.customerform.controls["workshopname"].disable()
      this.customerform.controls["mobilenumber"].disable()
      this.customerform.controls["address"].disable()
      this.customerform.controls["pin"].disable()
      this.customerform.controls["city"].disable()
      this.customerform.controls["state"].disable()
      this.customerform.controls["email"].disable()
    }else if(checkclas=='payment'){
      this.proclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.vehclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.payclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro active"
      this.aboutclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.showprofile=false
      this.showvehicle=false
      this.showpayment=true
      this.showabout=false
    }else if(checkclas=='about'){
      this.proclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.vehclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.payclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro"
      this.aboutclass="col-lg-3 col-sm-3 col-md-3 col-xs-3 text-center navpro active"
      this.showprofile=false
      this.showvehicle=false
      this.showpayment=false
      this.showabout=true
    }
  }
  //Edit details
  editdetails(){
    this.editbitton=false
    this.savebitton=false
    this.updatebutton=true
    this.editbittonaddress=false
    this.updatebuttonaddress=true
    this.customerform.controls["firstname"].enable()
    this.customerform.controls["lastname"].enable()
    this.customerform.controls["workshopname"].enable()
    this.customerform.controls["address"].enable()
    this.customerform.controls["pin"].enable()
    this.customerform.controls["city"].enable()
    this.customerform.controls["state"].enable()
    this.customerform.controls["email"].enable()
  }
  //Update workshop details
  updatedetails(){
    this.submitted = true;
    if (this.customerform.invalid) {
      return;
    }else{
      this.general.updateWorkshopProfile(
        this.userdata.workshop_id,
        this.customerform.getRawValue().workshopname,
        parseInt(this.userdata.workshop_mobile_number_2),
        this.customerform.getRawValue().firstname,
        this.customerform.getRawValue().lastname,
        this.customerform.getRawValue().email,
        this.customerform.getRawValue().state,
        this.customerform.getRawValue().city,
        this.customerform.getRawValue().pin,
        this.userdata.workshop_rtocode,
        this.userdata.workshop_type,
        this.customerform.getRawValue().address,
        ).subscribe(updateddata=>{
        this.showSpinnerLogin.setSpinner(true)
        if(updateddata['success']==true){
          this.showSpinnerLogin.setSpinner(false)
          this.editbitton=true
          this.savebitton=false
          this.updatebutton=false
          this.editbittonaddress=true
          this.updatebuttonaddress=false
          this.userdata.email=this.customerform.getRawValue().email
          this.userdata.address=this.customerform.getRawValue().address
          this.userdata.city=this.customerform.getRawValue().city
          this.userdata.state=this.customerform.getRawValue().state
          this.userdata.pincode=this.customerform.getRawValue().pin
          this.userdata.workshop_name=this.customerform.getRawValue().workshopname
          this.userdata.first_name=this.customerform.getRawValue().firstname
          this.userdata.last_name=this.customerform.getRawValue().lastname
          localStorage.setItem("user", JSON.stringify(this.userdata));
          this.customerform.controls["firstname"].disable()
          this.customerform.controls["lastname"].disable()
          this.customerform.controls["workshopname"].disable()
          this.customerform.controls["address"].disable()
          this.customerform.controls["pin"].disable()
          this.customerform.controls["city"].disable()
          this.customerform.controls["state"].disable()
          this.customerform.controls["email"].disable()
        }else{
          this.showSpinnerLogin.setSpinner(false)
          this.snakBar.open("Message", ErrorMessgae[0][updateddata['message']], {
            duration: 4000
          })
        }
      },err=>{
        this.showSpinnerLogin.setSpinner(false)
        this.snakBar.open("Error", ErrorMessgae[0][err], {
          duration: 4000
        })
      })
    }
  }
  //Logout from the online store
  logout(){
    localStorage.removeItem('showpopup');
    localStorage.removeItem('falg');
    localStorage.removeItem('user');
    localStorage.removeItem('dl');
    this.homeIcon()
  }
  //Save the workshop details
  savedetails(){
    this.submitted = true;
    if (this.customerform.invalid) {
      return;
    }else{
      this.customerform.controls["name"].disable()
      this.customerform.controls["mobilenumber"].disable()
      this.customerform.controls["address"].disable()
      this.customerform.controls["pin"].disable()
      this.customerform.controls["city"].disable()
      this.customerform.controls["state"].disable()
      this.customerform.controls["email"].disable()
    }
  }
//-----------------------------------------------------------Crat Section---------------------------------------------------------
  //Add to cart
  addToCrat(data,index){
    if(!localStorage.getItem('user')){
      this.dialog.openStoteLogin('false','').subscribe(data=>{
        if(data=='registerlogin'){
          setTimeout(
            () => this.userdata=JSON.parse(localStorage.getItem('user')), 1000);
            setTimeout(
              () =>  this.addtocartfinal(data,index), 1000);
         
        }else if(data=='login'){
          setTimeout(
            () => this.userdata=JSON.parse(localStorage.getItem('user')), 1000);
            setTimeout(
              () =>  this.addtocartfinal(data,index), 1000);
        }
      })
    }else{
      this.addtocartfinal(data,index)
    }
  }
  //Opne list back to products
  openList(){
    this.ngOnInit()
    this.showStepor=false
    this.showproduct=true
  }
  //Cart final amout
  addtocartfinal(data,index){
    var workshop
    workshop=JSON.parse(localStorage.getItem('user')).workshop_id
    this.general.addUpdateDeleteCrat(workshop,'add','','',data.id, data).subscribe(cratadded=>{      
      this.showSpinnerLogin.setSpinnerForLogin(true)
      if(cratadded.success==true){
        this.cartlencount=cratadded.cartcount
        this.showproductarr[index].addtocartbut='Added'
      }
      this.showSpinnerLogin.setSpinnerForLogin(false)
    },err=>{
      this.showSpinnerLogin.setSpinner(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
  }
  //Get the cart details when user back to online store
  getCratDetails(id){
    this.cratAllData=[]
    this.general.getCartDetails(id).subscribe(crat=>{      
      this.showSpinnerLogin.setSpinnerForLogin(true)
      if(crat.success==true){
        this.cartlencount=crat.cart.length
        this.cartLength=true
        var imagelog
        crat.cart.map(data=>{
          if(data.image!=""){
            imagelog=data.image
          }else{
            imagelog="../../../assets/images/ttn.png"
          }
          var percentcal
          if(data.orignal_price!=''){
            percentcal=(100-(parseFloat(data.price)*100)/parseFloat(data.orignal_price))
          }else{
            percentcal=0
          }
          this.cratAllData.push({
            "id":data.id,
            "productid":data.product_id,
            "name":data.product_name,
            "desc":data.description,
            "price":data.price,
            
            "orprice":data.orignal_price,
            "percent":Math.round(percentcal),
            "skuid":data.skuid,
            "image":imagelog,
            "qunatuty":parseInt(data.quantity),
            "supplier":data.supplier,
            "units":data.units,
          })
        })
        this.orignalCartAmount=this.calculateOrignalDataOfCart()
        this.finalCartAmount=this.calculateFinalDataOfCart()
      }else{
        this.cartlencount=0
        this.cartLength=false
      }
      this.showSpinnerLogin.setSpinnerForLogin(false)
    },err=>{
      this.showSpinnerLogin.setSpinner(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
  }
  //Upadte qty in car
  updateCratQty(data,index,status){
    var workshop
    workshop=JSON.parse(localStorage.getItem('user')).workshop_id
    this.showSpinnerLogin.setSpinnerForLogin(true)
    if(status=='add'){
      data.qunatuty += 1
    }else{
      data.qunatuty -= 1
    }
    this.general.addUpdateDeleteCrat(workshop,'update',data.id,data.qunatuty,'').subscribe(cratadded=>{      
      this.showSpinnerLogin.setSpinnerForLogin(true)
      if(cratadded.success==true){
        this.cratAllData[index].qunatuty=data.qunatuty
        this.orignalCartAmount=this.calculateOrignalDataOfCart()
        this.finalCartAmount=this.calculateFinalDataOfCart()
      }
      this.showSpinnerLogin.setSpinnerForLogin(false)
    },err=>{
      this.showSpinnerLogin.setSpinner(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
  }
  //Delete cart item
  deleteCratItem(data,index){
    var workshop
    workshop=JSON.parse(localStorage.getItem('user')).workshop_id
    this.general.addUpdateDeleteCrat(workshop,'delete',data.id,'','').subscribe(cratadded=>{      
      this.showSpinnerLogin.setSpinnerForLogin(true)
      if(cratadded.success==true){
        this.showSpinnerLogin.setSpinnerForLogin(true)
        this.cratAllData.splice(0,index)
        this.getCratDetails(workshop)
      }
      this.showSpinnerLogin.setSpinnerForLogin(false)
    },err=>{
      this.showSpinnerLogin.setSpinner(false)
      this.snakBar.open("Error", ErrorMessgae[0][err], {
        duration: 4000
      })
    })
  }
  //valcluate orignal amount in cart
  calculateOrignalDataOfCart(){
    if(this.cratAllData.length!=0){
      var calres=0
      this.cratAllData.map(datacal=>{
        calres += (parseInt(datacal.orprice)*parseInt(datacal.qunatuty)*parseInt(datacal.units))
      })
      return calres
    }else{
      return 0
    }
  }
  //calculate final amount in cart
  calculateFinalDataOfCart(){
    if(this.cratAllData.length!=0){
      var calres=0
      this.cratAllData.map(datacal=>{
        calres += (parseInt(datacal.price)*parseInt(datacal.qunatuty)*parseInt(datacal.units))
      })
      return calres
    }else{
      return 0
    }
  }
//-----------------------------------------------------------Order Place Section---------------------------------------------------------
  //Place the rder
  opnePlaceOrder(){
    this.showbook=true
    this.showLogin=false
    this.showorders=false
    this.showcart=false
    this.showplaces=false
    this.firstFormGroup.controls["workname"].setValue(this.userdata.workshop_name,{onlySelf:true})
    this.firstFormGroup.controls["name"].setValue(this.userdata.first_name+" "+this.userdata.last_name,{onlySelf:true})
    this.firstFormGroup.controls["mobilenumber"].setValue(this.userdata.workshop_mobile_number_1,{onlySelf:true})
    this.firstFormGroup.controls["mobilenumber"].disable()
    this.firstFormGroup.controls["email"].setValue(this.userdata.email,{onlySelf:true})
    this.firstFormGroup.controls["address"].setValue(this.userdata.address,{onlySelf:true})
    this.firstFormGroup.controls["city"].setValue('Pune',{onlySelf:true})
    this.firstFormGroup.controls["city"].disable()
    this.firstFormGroup.controls["zipcode"].setValue(this.userdata.pincode,{onlySelf:true})
    
  } 
  //Complete the order by filling address
  completeOrder(){
    this.fulladdress=this.firstFormGroup.getRawValue().address+" "+this.firstFormGroup.getRawValue().city
        +" "+this.firstFormGroup.getRawValue().state+" "+this.firstFormGroup.getRawValue().zipcode
       
        this.general.saveOrder(this.finalCartAmount.toString(),'1',
        this.firstFormGroup.getRawValue().name,this.firstFormGroup.getRawValue().mobilenumber,
        this.firstFormGroup.getRawValue().email,this.firstFormGroup.getRawValue().address,this.firstFormGroup.getRawValue().city
        ,'',this.firstFormGroup.getRawValue().zipcode,
        '','','',this.userdata.workshop_id,JSON.stringify(this.cratAllData)
        ,this.firstFormGroup.getRawValue().workname).subscribe(saveneworder=>{
          this.showSpinnerLogin.setSpinnerForLogin(true)
          if(saveneworder.success==true){
            this.snakBar.open("Message", "Order Placed Successfully", {
              duration: 4000
            })
            this.productorderid=saveneworder.order.orderid
            this.showplaces=true
            var emailbody
            this.cartlencount=0

            
            var orderDetailsForEmail=''
            this.cratAllData.map((dataForEmail,index)=>{
              orderDetailsForEmail+="<p><b>("+(index+1)+")</b> Name: "+dataForEmail.name+"</p>\n<p>Quantity: "+dataForEmail.qunatuty+"</p>\n<p>Price: Rs."+dataForEmail.price+"</p>\n"
            })

            var subject="New Order Received"
            this.showSpinnerLogin.setSpinnerForLogin(false)
            emailbody="<p> <b>New order Received</b>, </p>\n<p>Order ID: "+ saveneworder.order.orderid +
            "</p>\n<p>Order Date: "+ saveneworder.order.created_at +"</p>\n\n\n<p> <b>Order Details</b> </p>\n"+orderDetailsForEmail+"\n<p>Payment Type: COD</p>\n\n\n<p><b> Delivery Details</b> </p>\n\n<p>Name: "+this.firstFormGroup.getRawValue().name
            +"</p>\n<p>Mobile Number: "+this.firstFormGroup.getRawValue().mobilenumber+"</p>\n<p>Email: "+this.firstFormGroup.getRawValue().email+"</p>\n<p>Delivery Address: "+this.fulladdress+"</p>"
            
            var emailbodyone
            var subjectone="Order Placed Successfully"
            emailbodyone="<p> <b>Order Placed</b> </p>\n\n <p>Price: Rs."+ this.finalCartAmount +"</p>\n<p>Order Date: "+ saveneworder.order.created_at +"</p>\n\n\n<p> <b>Order Details</b> </p>\n"+orderDetailsForEmail+"\n<p>Payment Type: COD</p>\n\n\n<p> <b>Delivery Details</b> </p>\n\n<p>Name: "+this.firstFormGroup.getRawValue().name
            +"</p>\n<p>Mobile Number: "+this.firstFormGroup.getRawValue().mobilenumber+"</p>\n<p>Email: "+this.firstFormGroup.getRawValue().email+"</p>\n<p>Delivery Address: "+this.fulladdress+"</p>"
            
            this.general.sendEmailProduct(emailbody,subject,emailbodyone,subjectone,this.firstFormGroup.getRawValue().email).subscribe(emaildata=>{
              if(emaildata.success==true){
                this.showSpinnerLogin.setSpinnerForLogin(false)
              }else{
                this.showSpinnerLogin.setSpinnerForLogin(false)
              }
            },err=>{
              this.showSpinnerLogin.setSpinnerForLogin(false)
              this.snakBar.open(err, ErrorMessgae[0][err], {
                duration: 4000
              })
            })
          }else{
            this.showSpinnerLogin.setSpinnerForLogin(false)
          }
        },err=>{
          this.showSpinnerLogin.setSpinnerForLogin(false)
          this.snakBar.open(err, ErrorMessgae[0][err], {
            duration: 4000
          })
        })
  }
  // Print the Order data as pDF
  downlaodCounter(allorderdata){
    var name
    var documentDefinition
    name="Order_id_"+allorderdata.orderid
    documentDefinition = this.counterpdf.generatePDF(allorderdata,this.allSupierDeatils[0])
    pdfMake.createPdf(documentDefinition).download(name)
    //pdfMake.createPdf(documentDefinition).print()
  } 
}
