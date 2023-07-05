import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { catchError} from "rxjs/operators";
@Injectable()
export class AuthService{

    // url: string = 'http://ttndevelopment-env.eba-a7byvfhj.ap-south-1.elasticbeanstalk.com' 
    url: string = 'https://app.tightthenut.com' 
    // url: string = 'http://127.0.0.1:5000' 
    constructor(public http: HttpClient,
      private router : Router){
    
        
    }
    

    AdminVeriy(){
      // if no session storage redirect to admin
      const user  = sessionStorage.getItem("admin")
     
      if( user === undefined || user == null ){

        this.router.navigate(['admin'])
      } 

        // let header = new HttpHeaders()
        //  .set("Access-Control-Allow-Origin", "*")
        
        // const httpParams = new HttpParams()
        // .set('admin', localStorage.getItem('admin'))
        // .set('password', localStorage.getItem('pwd'))
        const httpParams = new HttpParams()
        .set('admin', sessionStorage.getItem('admin'))
        .set('password', sessionStorage.getItem('pwd'))
    
        const body ={}
        return this.http
      .post<any>(`${this.url}/api/v1/web_jobcard/verify_admin`,body, {
       
        params: httpParams,
      })

      
    //   .pipe(catchError(this.handleError));

    } 
    
    WorkshopRecharge(rechargeObj){

        // let header = new HttpHeaders()
        //  .set("Access-Control-Allow-Origin", "*")
        
        const httpParams = new HttpParams()
        .set('workshop_id', rechargeObj["workshop_id"])
   
    
        // const body ={
        //   transaction_id:rechargeObj["transaction_id"],
        //   transaction_date:rechargeObj["transaction_date"],
        //   recharge_type:rechargeObj["recharge_type"],
      
        //   payment_mode:rechargeObj["payment_mode"],
        //   recharge_amount:rechargeObj["recharge_amount"],
          
        //   validity_date:rechargeObj["validity_date"]
        // }
        const body = rechargeObj
        return this.http
      .post<any>(`${this.url}/api/v1/web_jobcard/workshop_recharge`,body, {
       
        params: httpParams,
      })

      
    //   .pipe(catchError(this.handleError));

    } 
    
    sendFCMs(msgObj){

   
        const httpParams = new HttpParams()
    
        const body = msgObj
        return this.http
      .post<any>(`${this.url}/api/v1/web_jobcard/marketing_notifications`,body, {
       
        params: httpParams,
      })

      
    //   .pipe(catchError(this.handleError));

    } 
    
    
    getWorkshopDetails(mob) {
      const httpParams = new HttpParams()
      .set('mobile_number', mob)
      return this.http
        .get<any>(`${this.url}/api/v1/web_jobcard/wk_details`, { params: httpParams })
        // .pipe(catchError(this.handleError));
    }
    getCountJC(wk_id) {
      const httpParams = new HttpParams()
      .set('workshop_id', wk_id)
      return this.http
        .get<any>(`${this.url}/api/v1/web_jobcard/get_jc_count`, { params: httpParams })
        // .pipe(catchError(this.handleError));
    }

    getJobcardsExcel(
      from_wk,
      to_wk,
      url = 'segregate_jobcards'
    ): Observable<any> {
      let header = new HttpHeaders()
      // .set("Access-Control-Allow-Origin", "*");
  
      const httpParams = new HttpParams()
        .set("start_workshop_id", from_wk)
        .set("end_workshop_id", to_wk)
  
      return this.http
        .get(`${this.url}/api/v1/web_jobcard/${url}`, {
        // .get(`${this.url}/api/v1/web_jobcard/admin_po_summary`, {
          headers: header,
          params: httpParams,
          responseType: 'blob' as 'json'
        })
        // .pipe(catchError(this.handleError));
    }
  
}