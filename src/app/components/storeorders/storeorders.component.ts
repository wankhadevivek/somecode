import { Component, OnInit } from '@angular/core';
import { update } from 'lodash';
import { StringifyOptions } from 'querystring';
import { GeneralService } from '../../services/general.service';
import * as glob from "../../shared/usercountry/userCountryGlobal";
interface orderStatus{
  value: string; 
  viewValue: string
}
@Component({
  selector: 'app-storeorders',
  templateUrl: './storeorders.component.html',
  styleUrls: ['./storeorders.component.css']
})
export class StoreordersComponent implements OnInit {
  ordersPlaced = Array()
  totalLength:any;
  page:number=1;
  nextUrl:string = ''
  contactlink: string
  colorArray = ['#dddd0e','#dddd0e', '#e98620','#5764c1',
 '#3e9719', '#98e577', , '#f1501f', 
'#f1501f', '#f1501f', '#f1501f']

  orderStatuses:orderStatus[] = 
  [
    {viewValue: 'Accepted', value: '1'},
    {viewValue: 'Packed', value: '2'},
    {viewValue: 'Out For Delivery', value: '3'},
    {viewValue: 'Delivered', value: '4'},
    {viewValue: 'Payment Received', value: '5'},
    {viewValue: 'Delivery Failed (Address Issue)', value: '6'},
    {viewValue: 'Cancelled', value: '7'},
    {viewValue: 'Pending', value: '8'},
    {viewValue: 'Delayed due to Out of Stock', value: '9'}]

    smsArray = ['', `Hey %customername%! Your Tight The Nut Store order %orderid% has been Accepted successfully, is getting ready and will be dispatched soon.`,
     `Hey %customername%! Your Tight The Nut Store order %orderid% is Packed and will be dispatched soon.`,
     `Hey %customername%! Your Tight The Nut Store order %orderid% is out for delivery. Please pay Rs. %price% for the order.`,
     `Hey %customername%! Your Tight The Nut Store order %orderid% has been successfully delivered.`,
     `Hey %customername%! Payment successfully completed for Your Tight The Nut Store order %orderid%.`,
     `Hey %customername%! The Tight The Nut Store order %orderid% you placed could not be delivered due to address issues`,
     `Hey %customername%! Due to some unavoidable reasons we had to cancel The Tight The Nut Store order %orderid% you placed`,
     `Hey %customername%! You have a pending order %orderid% at Tight The Nut Store, you will soon be informed about the updated order status`,
     `Hey %customername%!  Your Tight The Nut Store order %orderid% is delayed because of the ongoing high demand. You will soon be informed about the updated order status, sorry for any inconvenience caused.`,]
    currency_symbol:any
  
    constructor(
    private general: GeneralService
  ) { }

  ngOnInit() {
    // this.totalLength = 15
    this.currency_symbol = glob.currency_symbol;
    this.general.listStoreOrders().subscribe(product=>{
      if(product.success==true && product.order.length!=0){
        this.totalLength = product["page_count"]
        if(product["has_next"]== true){

          this.nextUrl=product["next_page"]
        }
        product.order.map(data=>{
          if(data.cart_details!=""&&data.cart_details!=null){
            this.ordersPlaced.push({
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
      }
    })
  
  }
  onPageChange(pageno){


    if (this.nextUrl.length > 0){
      this.general.listStoreOrders(pageno).subscribe(product=>{
        this.ordersPlaced = Array()
        if(product.success==true && product.order.length!=0){
          if(product["has_next"]== true){
            this.nextUrl=product["next_page"]
          }
          product.order.map(data=>{
            if(data.cart_details!="" && data.cart_details !=null){
              this.ordersPlaced.push({
                "id":data.id,
                "cartdetails":JSON.parse(data.cart_details),
                'status':parseInt(data.status),
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

          this.page = pageno
         
        }
      })

    }
   
    

  }

  statusChange(event, data){

    this.general.OrderStatusUpdate(data).subscribe(resp=>{
      if(resp.success==true){
        
      }
  })
}

onShareWhatsApp(order){

let str
str = this.smsArray[order["status"]].replace(/%\w+%/g, function(all) {
 

  return order[all.replace(/[%]/g, "")] || '';
});

this.contactlink = "https://web.whatsapp.com/send?phone=91"+
order["customerphone"]+"&text=" + str;

}

}
