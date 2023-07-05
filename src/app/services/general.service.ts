import { Injectable } from "@angular/core";
import { AbstractService } from "./comman/abstract.service";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { User } from "../shared/model/user/user.module";
import { catchError, map, timeout } from "rxjs/operators";
import { Jobcard } from "../shared/model/jobcard/jobcard.module";
import { Customer } from "../shared/model/customer/customer.module";
import { SettingsJobcard } from "../shared/model/settings/settings-jobcard.module";
import { SpareLubeJob } from "../shared/model/lubejobsapre/sparelubejob.module";
import { Staff } from "../shared/model/workshop/staff.module";
import { UserserviceService } from "../services/userservice.service";
import { Reminder } from "../shared/model/workshop/reminders.module";
import { Dashboard } from "../shared/model/dashboard/dashboard.module";
import { Membership } from "../shared/model/workshop/membership.module";
import { Booking } from "../shared/model/booking/booking.module";
import { EndUser } from "../shared/model/jobcard/enduser.module";
import { Product } from "../shared/model/pilot/product.module";
import { Order } from "../shared/model/pilot/order.module";
import { Counter } from "../shared/model/counter/counter.module";
import { OrderPlace } from "../shared/model/pilot/orderplace.module";
import { Cart } from "../shared/model/pilot/cart.module";
import { Workshop } from "../shared/model/workshop/workshop.module";
import { Supplier } from "../shared/model/spplier/supplier.module";
import { Purchase } from "../shared/model/spplier/purchase.module";
import { expense } from "../shared/model/expense/expense.module";
@Injectable({
  providedIn: "root",
})
export class GeneralService extends AbstractService {
  /**
   * In this file all the APIS
   * are called of webapp,
   * endusr app, online store
   */
  constructor(
    protected http: HttpClient,
    private userService: UserserviceService
  ) {
    super(http);
  }
  //--------------------------------LOGIN AND REGISTER----------------------------------------
  //Update App Status
  updateApp(workshop_id: string) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("mode", "user");
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/update_app`, body, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  //get app status
  getAppStatus(workshop_id: string) {
    const httpParams = new HttpParams().set("workshop_id", workshop_id);
    return this.http
      .get<any>(`${this.apiUrl}/get_app_status`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  // API to Login User(Workshop)
  loginUser(mobile: string): Observable<User> {
    const httpParams = new HttpParams().set("mobile_number", mobile);
    const body = {};
    return this.http
      .post<User>(`${this.apiUrl}/auth/login`, body, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  addLinkedAccounts(wk_id, wk_to_link): Observable<User> {
    
    const httpParams = new HttpParams()
    .set("workshop_id", wk_id)
    .set("workshop_to_add", wk_to_link);
    const body = {};
    return this.http
      .post<User>(`${this.apiUrl}/workshop_linked_accounts`, body, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  getLinkedAccounts(wk_id): Observable<any> {
    const httpParams = new HttpParams()
    .set("workshop_id", wk_id)
    
    return this.http
      .get<any>(`${this.apiUrl}/workshop_linked_accounts`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  getFranchiseRevenue(
    workshopId: string,
   
    start_date: string,
    end_date: string
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("start_date", start_date)
      .set("end_date", end_date);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/franchise_wk_summary`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // While Register a new workshop First User need to Verify the New Mobile number
  getOtpForRegister(mobile: string) {
    const httpParams = new HttpParams().set("mobile_number", mobile);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/auth/getotp`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  getOtpForLogin(mobile: string) {
    const httpParams = new HttpParams().set("mobile_number", mobile);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/auth/sendotp`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  getEndUserNotifyParams(mode: string, number: string): Observable<any> {
    const workshop_id = localStorage.getItem("check");
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("mode", mode)
      .set("mobile_number", number);

    return this.http
      .get<any>(`${this.apiUrl}/end_user_notification_info`, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  updateEndUserNotifyParams(mode: string, number: string): Observable<any> {
    const workshop_id = localStorage.getItem("check");
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("mode", mode)
      .set("mobile_number", number);

    const body = { notify_token: localStorage.getItem("notifyToken") };
    return this.http
      .post<any>(`${this.apiUrl}/end_user_notification_info`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  updateNotifyParams(mode: string): Observable<User> {
    const workshop_id = localStorage.getItem("unique_id");
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("mode", mode);

    const body = { notify_token: localStorage.getItem("notifyToken") };
    return this.http
      .post<any>(`${this.apiUrl}/notification_info`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  // API to Register new workshop after user verift the mobile number
  registerUser(
    email: string,
    first_name: string,
    last_name: string,
    mobile_number_1: string,
    mobile_number_2: string,
    workshop_name: string,
    w2: string,
    w3: string,
    w4: string,
    w6: string,
    workshop_address: string,
    workshop_city: string,
    workshop_state: string,
    pincode: string,
    rtocode: string,
    terms_conditions: string,
    country_name: string,
    country_code: string,
    country_currency: string,
    latlong: any,
    primary_language: string,
    password: string,
    role: string
  ): Observable<User> {
    const httpParams = new HttpParams()
      .set("workshop_email", email)
      .set("workshop_first_name", first_name)
      .set("workshop_last_name", last_name)
      .set("workshop_mobile_number_1", mobile_number_1)
      .set("workshop_mobile_number_2", mobile_number_2)
      .set("workshop_name", workshop_name)
      .set("two_wheeler", w2)
      .set("three_wheeler", w3)
      .set("four_wheeler", w4)
      .set("six_wheeler", w6)
      .set("workshop_address", workshop_address)
      .set("workshop_city", workshop_city)
      .set("workshop_state", workshop_state)
      .set("workshop_pincode", pincode)
      .set("workshop_rtocode", rtocode)
      .set("terms_conditions", terms_conditions)
      .set("country_name", country_name)
      .set("country_code", country_code)
      .set("country_currency", country_currency)
      .set("latlong", JSON.stringify(latlong))
      .set("primary_language", primary_language)
      .set("password", password)
      .set("role", role);
    const body = {};
    return this.http
      .post<User>(`${this.apiUrl}/auth/register`, body, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  rewardOnRegister(workshop_id: string): Observable<any> {
    let header = new HttpHeaders({
      "Content-Type": "application/json",
      "x-apikey":
        "9269dce0f49bedf305ee4b69270de3b13274c9271aee8f232a007b1586968231",
      "x-source": "web",
    });

    const data = {
      action_id: "f1605709-f3e7-4153-a3ae-0ed1c834ee16",
      customer_id: "4317",
    };

    return this.http.post<any>(
      "https://platform.nector.io/api/v2/merchant/actionactivities",
      JSON.stringify(data),
      { headers: header }
    );
  }
  fetchCredit(): Observable<any> {
    let header = new HttpHeaders({
      "Content-Type": "application/json",
      "x-apikey":
        "9269dce0f49bedf305ee4b69270de3b13274c9271aee8f232a007b1586968231",
      "x-source": "web",
    });

    const data = {
      action_id: "f1605709-f3e7-4153-a3ae-0ed1c834ee16",
      customer_id: "4317",
    };

    return this.http.post<any>(
      "https://platform.nector.io/api/v2/merchant/actionactivities",
      JSON.stringify(data),
      { headers: header }
    );
  }
  // API to verify otp when user click on verify otp for login and register
  verifyOTP(mobile: string, otp: string) {
    const httpParams = new HttpParams()
      .set("mobile_number", mobile)
      .set("otp", otp);
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/auth/verifyotp`, body, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  // API to verify otp when user click on verify otp for login and register
  verifyPassword(mobile: string, password: string) {
    const httpParams = new HttpParams()
      .set("mobile_number", mobile)
      .set("password", password);
    // const body = {};
    const body = { notify_token: localStorage.getItem("notifyToken") };
    return this.http
      .post<any>(`${this.apiUrl}/auth/verify_password`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // API to resend OTP
  resendOTP(mobile: string) {
    const httpParams = new HttpParams().set("mobile_number", mobile);
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/auth/resendotp_web`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  //Uplaod Profile Picture
  uplaodProfile(workshop_id: string, profile_picture: any) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("workshop_id", workshop_id);
    const body = new FormData();
    body.append("profile_picture", profile_picture);
    return this.http
      .post<any>(`${this.apiUrl}/upload_profile_pic_web`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //update Profile Picture
  updateProfile(workshop_id: string, profile_picture: any) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("workshop_id", workshop_id);
    const body = new FormData();
    body.append("profile_picture", profile_picture);
    return this.http
      .post<any>(`${this.apiUrl}/update_profile_pic_web`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  //Update Workshop Profile
  updateWorkshopProfile(
    workshop_id: string,
    workshop_name: string,
    workshop_mobile_number_2: number,
    workshop_last_name: string,
    workshop_first_name: string,
    workshop_email: string,
    workshop_state: string,
    workshop_city: string,
    workshop_pincode: number,
    workshop_rtocode: string,
    workshop_type: string,
    workshop_address: string
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("workshop_id", workshop_id);
    const body = {
      workshop_name: workshop_name,
      workshop_mobile_number_2: workshop_mobile_number_2,
      workshop_last_name: workshop_last_name,
      workshop_first_name: workshop_first_name,
      workshop_email: workshop_email,
      workshop_state: workshop_state,
      workshop_city: workshop_city,
      workshop_pincode: workshop_pincode,
      workshop_rtocode: workshop_rtocode,
      workshop_type: workshop_type,
      workshop_address: workshop_address,
    };
    return this.http
      .post<any>(`${this.apiUrl}/update_workshop_details`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //Update Workshop Profile NUmber
  updateWorkshopNumber(workshop_id: string, number: any) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("mode", "number");
    const body = {
      workshop_mobile_number_1: number,
    };
    return this.http
      .post<any>(`${this.apiUrl}/update_all_settings`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //Uplaod and update Workshop logo
  uplaodUpdateWorkshopLogo(workshop_id: string, workshop_logo: any) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("workshop_id", workshop_id);
    const body = new FormData();
    body.append("workshop_logo", workshop_logo);
    return this.http
      .post<any>(`${this.apiUrl}/upload_workshop_logo`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //Delete Workshop logo
  DeleteWorkshopLogo(workshop_id: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("workshop_id", workshop_id);
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/delete_workshop_logo`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //Uplaod and update Workshop Signature
  uplaodUpdateWorkshopSignature(workshop_id: string, workshop_signature: any) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("workshop_id", workshop_id);
    const body = new FormData();
    body.append("workshop_signature", workshop_signature);
    return this.http
      .post<any>(`${this.apiUrl}/upload_workshop_signature`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //Delete Workshop Signature
  DeleteWorkshopSignature(workshop_id: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("workshop_id", workshop_id);
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/delete_workshop_signature`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //-------------------------------END LOGIN AND REGISTER--------------------------------

  //--------------------------------INVENTORY----------------------------------------
  // Get Jobs Spares lubes on bais of mode_type from the DB and search them by any partnumber or partname
  getJobSpareLube(workshopId: string, mode: string, searchkey: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("mode_type", mode)
      .set("search_keyword", searchkey);
    const body = {};
    return this.http
      .get<SpareLubeJob>(`${this.apiUrl}/lube_job_sapre`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
   getWorkshopJobSpareLube(workshopId: string, mode: string, searchkey: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("mode_type", mode)
      .set("search_keyword", searchkey);
    const body = {};
    return this.http
      .get<SpareLubeJob>(`${this.apiUrl}/workshop_lube_job_sapre`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // Get Jobs Spares lubes on bais of mode_type from the DB and search them by any partnumber
  getJobSpareLubeData(workshopId: string, mode: string, partnumber: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("mode_type", mode)
      .set("part_number", partnumber);
    const body = {};
    return this.http
      .get<SpareLubeJob>(`${this.apiUrl}/lube_job_sapre`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // Get All Jobs Spares lubes on bais of mode_type from the DB
  getJobSpareLubeAllData(workshopId: string, mode: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("mode_type", mode);
    const body = {};
    return this.http
      .get<SpareLubeJob>(`${this.apiUrl}/lube_job_sapre`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // Save New Any Job, Spare Lube
  saveJobSapreLubeProfile(
    mode_type: string,
    mode_type_create_update: string,
    part_number: string,
    part_name: string,
    part_company: string,
    unit: string,
    category: string,
    spare_subcategory: string,
    job_subcategory: string,
    lube_subcategory: string,
    vechile_details: string,
    current_quantity: number,
    lower_limit: number,
    rack_no: string,
    hsn_no: string,
    unit_purchase_price: number,
    purchase_qty: number,
    purchase_gst_rate: string,
    purchase_tax_type: string,
    purchase_total_amount: number,
    purchase_discount: string,
    purchase_cgst: number,
    purchase_sgst: number,
    purchase_igst: number,
    purchase_total_gst: number,
    unit_sale_price: number,
    sale_qty: number,
    sale_gst_rate: string,
    sale_tax_type: string,
    sale_total_amount: number,
    sale_discount: string,
    sale_cgst: number,
    sale_sgst: number,
    sale_igst: number,
    sale_total_gst: number,
    company_name: string,
    workshop_id: string
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("mode_type", mode_type)
      .set("workshop_id", workshop_id)
      .set("mode_type_create_update", mode_type_create_update);
    const body = {
      part_number: part_number,
      part_name: part_name,
      part_company: part_company,
      unit: unit,
      category: category,
      spare_subcategory: spare_subcategory,
      job_subcategory: job_subcategory,
      lube_subcategory: lube_subcategory,
      vechile_details: vechile_details,
      current_quantity: current_quantity,
      lower_limit: lower_limit,
      rack_no: rack_no,
      hsn_no: hsn_no,
      unit_purchase_price: unit_purchase_price,
      purchase_qty: purchase_qty,
      purchase_gst_rate: purchase_gst_rate,
      purchase_tax_type: purchase_tax_type,
      purchase_total_amount: purchase_total_amount,
      purchase_discount: purchase_discount,
      purchase_cgst: purchase_cgst,
      purchase_sgst: purchase_sgst,
      purchase_igst: purchase_igst,
      purchase_total_gst: purchase_total_gst,
      unit_sale_price: unit_sale_price,
      sale_qty: sale_qty,
      sale_gst_rate: sale_gst_rate,
      sale_tax_type: sale_tax_type,
      sale_total_amount: sale_total_amount,
      sale_discount: sale_discount,
      sale_cgst: sale_cgst,
      sale_sgst: sale_sgst,
      sale_igst: sale_igst,
      sale_total_gst: sale_total_gst,
      company_name: company_name,
    };
    return this.http
      .post<SpareLubeJob>(`${this.apiUrl}/create_lube_job_sapre`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  // Get Data for Inventory Dashboard
  inventoryDashboard(
    workshop_id: string,
    mode: string,
    search_keywords: string,
    type: string,
    filterQty: string  = ''

  ): Observable<Jobcard> {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    // .set("Access-Control-Allow-Origin", "*");

    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("mode", mode)
      .set("type", type)
      .set("search_keywords", search_keywords)
      .set("qty_filter", filterQty)
      ;

    return this.http
      .get<SpareLubeJob>(`${this.apiUrl}/inventory_dashboard`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  getInventoryCSV(
    workshop_id: string,
    mode: string,
    search_keywords: string,
    type: string,
    filterQty: string  = ''
  ): Observable<any> {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    // .set("Access-Control-Allow-Origin", "*");

    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("mode", mode)
      .set("type", type)
      .set("search_keywords", search_keywords)
      .set("qty_filter", filterQty);

    return this.http
      .get(`${this.apiUrl}/get_csv`, {
        headers: header,
        params: httpParams,
        responseType: 'blob' as 'json'
      })
      .pipe(catchError(this.handleError));
  }

  // Get Data for Inventory Dashboard pagination API
  inventorypageination(url: string): Observable<Jobcard> {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    return this.http
      .get<SpareLubeJob>(`${url}`, { headers: header })
      .pipe(catchError(this.handleError));
  }
  //Delete Spare Job Lube API
  deleteSpareJobLube(
    mode_type: string,
    workshop_id: string,
    part_number: string
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("mode_type", mode_type)
      .set("part_number", part_number);
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/delete_lube_job_sapre`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //Update Quantity of the Inventory
  updateLubeSpareQuantity(workshop_id: string, quatity) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("workshop_id", workshop_id);
    // .set("mode_type",mode_type)
    // .set("part_number",part_number)
    // .set("quantity",quantity)
    const body = {
      data: quatity,
    };
    return this.http
      .post<any>(`${this.apiUrl}/update_quantity_lube_sapre`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //getinventory pagination
  inventorylsjpageination(url: string): Observable<SpareLubeJob> {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    return this.http
      .get<SpareLubeJob>(`${url}`, { headers: header })
      .pipe(catchError(this.handleError));
  }

  //get Online service
  getOnlineService(workshopId: string, partnumber: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("part_number", partnumber);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/get_online_service`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  //get Online service
  onlineServiceDashboard(workshopId: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("workshop_id", workshopId);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/check_online_service`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  updateOnlineServive(
    workshop_id: string,
    partnumber: string,
    mode: string,
    text: string
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("partnumber", partnumber)
      .set("mode", mode)
      .set("text", text);
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/update_online_service`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  searchOnlineService(workshopId: string, search_keyword: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("search_keyword", search_keyword);
    const body = {};
    return this.http
      .get<SpareLubeJob>(`${this.apiUrl}/get_online_service`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //create or update online service
  // Save New Any Job, Spare Lube
  createUpdateOnlineService(
    mode_type_create_update: string,
    part_number: string,
    part_name: string,
    part_company: string,
    unit: string,
    category: string,
    spare_subcategory: string,
    job_subcategory: string,
    lube_subcategory: string,
    vechile_details: string,
    current_quantity: number,
    lower_limit: number,
    rack_no: string,
    hsn_no: string,
    unit_purchase_price: number,
    purchase_qty: number,
    purchase_gst_rate: string,
    purchase_tax_type: string,
    purchase_total_amount: number,
    purchase_discount: string,
    purchase_cgst: number,
    purchase_sgst: number,
    purchase_igst: number,
    purchase_total_gst: number,
    unit_sale_price: number,
    sale_qty: number,
    sale_gst_rate: string,
    sale_tax_type: string,
    sale_total_amount: number,
    sale_discount: string,
    sale_cgst: number,
    sale_sgst: number,
    sale_igst: number,
    sale_total_gst: number,
    company_name: string,
    workshop_id: string,
    online_service: string,
    description: string
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("mode_type_create_update", mode_type_create_update);
    const body = {
      part_number: part_number,
      part_name: part_name,
      part_company: part_company,
      unit: unit,
      category: category,
      spare_subcategory: spare_subcategory,
      job_subcategory: job_subcategory,
      lube_subcategory: lube_subcategory,
      vechile_details: vechile_details,
      current_quantity: current_quantity,
      lower_limit: lower_limit,
      rack_no: rack_no,
      hsn_no: hsn_no,
      unit_purchase_price: unit_purchase_price,
      purchase_qty: purchase_qty,
      purchase_gst_rate: purchase_gst_rate,
      purchase_tax_type: purchase_tax_type,
      purchase_total_amount: purchase_total_amount,
      purchase_discount: purchase_discount,
      purchase_cgst: purchase_cgst,
      purchase_sgst: purchase_sgst,
      purchase_igst: purchase_igst,
      purchase_total_gst: purchase_total_gst,
      unit_sale_price: unit_sale_price,
      sale_qty: sale_qty,
      sale_gst_rate: sale_gst_rate,
      sale_tax_type: sale_tax_type,
      sale_total_amount: sale_total_amount,
      sale_discount: sale_discount,
      sale_cgst: sale_cgst,
      sale_sgst: sale_sgst,
      sale_igst: sale_igst,
      sale_total_gst: sale_total_gst,
      company_name: company_name,
      online_service: online_service,
      description: description,
    };
    return this.http
      .post<any>(`${this.apiUrl}/create_online_service`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  //search company name
  searchCompanyName(search_keyword: string, category: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("search_keyword", search_keyword)
      .set("category", category);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/search_company_list`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  //serch vehicle list for compatible for
  searchInvenVhecileList(search_keyword, vehicle_type) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("search_keyword", search_keyword)
      .set("vehicle_type", vehicle_type);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/search_inven_vhicle_list`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // load more data
  vehlsjpageination(url: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    return this.http
      .get<any>(`${url}`, { headers: header })
      .pipe(catchError(this.handleError));
  }

  getGroupItems(workshop_id: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("workshop_id", workshop_id);

    return this.http
      .get<any>(`${this.apiUrl}/group_items`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  saveGroupItems(
    group_name: string,
    group_items: string,
    vechile_details: string,
    total_amount: number,
    workshop_id: string
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("group_name", group_name)
      .set("workshop_id", workshop_id);
    const body = {
      group_items: group_items,
      vechile_details: vechile_details,
      total_amount: total_amount,
    };
    return this.http
      .post<any>(`${this.apiUrl}/group_items`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  updateGroupItems(
    group_name: string,
    group_items: string,
    vechile_details: string,
    total_amount: number,
    workshop_id: string,
   
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("group_name", group_name)
      .set("workshop_id", workshop_id);
    const body = {
      group_items: group_items,
      vechile_details: vechile_details,
      total_amount: total_amount,
    
    };
    return this.http
      .put<any>(`${this.apiUrl}/group_items`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }


   deleteGroup(
    group_name: string,
    workshop_id: string
 
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("group_name", group_name)
      .set("workshop_id", workshop_id);
    // const body = {}
    return this.http
      .delete<any>(`${this.apiUrl}/group_items`,  {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //-------------------------------END INVENTORY--------------------------------

  //--------------------------------JOBCARD----------------------------------------
  //Get Jobcard Status
  jobCradstatus(workshop_id: string, jobcard_number: string) {
    let header = new HttpHeaders()
      .set("Access-Control-Allow-Origin", "*")
      .set("Authorization", this.userService.getData()["token"].toString());

    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("jobcard_number", jobcard_number);
    return this.http
      .get<any>(`${this.apiUrl}/jobcard_status`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // Get Data for Jobcrad Dashboard
  jobCradDashboard(
    workshop_id: string,
    jobcard_status: string,
    start_date: string,
    end_date: string,
    search_keywords: string,
    vehicle_number: string
  ): Observable<Jobcard> {
    let header = new HttpHeaders()
      .set("Access-Control-Allow-Origin", "*")
      .set("Authorization", this.userService.getData()["token"].toString());

    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("jobcard_status", jobcard_status)
      .set("start_date", start_date)
      .set("end_date", end_date)
      .set("search_keywords", search_keywords)
      .set("vehicle_number", vehicle_number);

    return this.http
      .get<Jobcard>(`${this.apiUrl}/jobcard_dashboard`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  jobcardpageination(url: string): Observable<Jobcard> {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    return this.http
      .get<Jobcard>(`${url}`, { headers: header })
      .pipe(catchError(this.handleError));
  }
  // Create new Short Invoice Form
  createShortInvoice(
    mode_type_create_update: string,
    workshop_id: string,
    jobcard_number: string,
    jobcard_spare_items: string,
    jobcard_job_items: string,
    jobcard_mechanic: string,
    jobcard_dent_photos: string,
    jobcard_dent_marks: string,
    jobcard_vehicle_inventory: string,
    jobcard_lubes_items: string,
    jobcard_customer_voice: string,
    vehicle_number: string,
    workshop_customer_id: number,
    vehicle_details: string,
    estimated_delivery_datetime: string,
    previous_estimated_delivery_datetime: string,
    count_for_est_changes: number,
    additional_notes: string,
    jobcard_status: number,
    total_amount: number,
    advance: number,
    discount: string,
    final_amount: number,
    balance_amount: number,
    paid_amount: number,
    sgst: number,
    cgst: number,
    igst: number,
    total_gst: number,
    exit_note: string,
    work_note: string,
    spare_total: number,
    lubes_total: number,
    jobs_total: number,
    after_km: string,
    reminder: string,
    payment_mode: string,
    cheque: string,
    spare_total_discount: string,
    lube_total_discount: string,
    job_total_discount: string,
    complete_time: string,
    exit_date_time: string,
    gst_number: string,
    cost_estimate: number,
    previous_cost_estimate: number,
    count_for_cost_estimate_change: string,
    cutsomer_name: string,
    customer_mobile: number,
    jobcard_form_type: string,
    sms_alert: string,
    reminder1: string,
    reminder2: string,
    reminder3: string,
    reminder1message: string,
    reminder2message: string,
    reminder3message: string,
    reminder_priority: string,
    settings_data_json: string,
    complete_date: string,
    closed_date: string,
    km: any,
    fuel: any,
    manual_or_book: string,
    section_discount: string,
    supervisor: string,
    
  ) {
    
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("mode_type_create_update", mode_type_create_update);
    const body = {
      jobcard_number: jobcard_number,
      jobcard_spare_items: jobcard_spare_items,
      jobcard_job_items: jobcard_job_items,
      jobcard_mechanic: jobcard_mechanic,
      jobcard_dent_photos: jobcard_dent_photos,
      jobcard_dent_marks: jobcard_dent_marks,
      jobcard_vehicle_inventory: jobcard_vehicle_inventory,
      jobcard_lubes_items: jobcard_lubes_items,
      jobcard_customer_voice: jobcard_customer_voice,
      vehicle_number: vehicle_number,
      workshop_customer_id: workshop_customer_id,
      vehicle_details: vehicle_details,
      estimated_delivery_datetime: estimated_delivery_datetime,
      previous_estimated_delivery_datetime:
        previous_estimated_delivery_datetime,
      count_for_est_changes: count_for_est_changes,
      additional_notes: additional_notes,
      jobcard_status: jobcard_status,
      total_amount: total_amount,
      advance: advance,
      discount: discount,
      final_amount: final_amount,
      balance_amount: balance_amount,
      paid_amount: paid_amount,
      sgst: sgst,
      cgst: cgst,
      igst: igst,
      total_gst: total_gst,
      exit_note: exit_note,
      work_note: work_note,
      spare_total: spare_total,
      lubes_total: lubes_total,
      jobs_total: jobs_total,
      after_km: after_km,
      reminder: reminder,
      payment_mode: payment_mode,
      cheque: cheque,
      spare_total_discount: spare_total_discount,
      lube_total_discount: lube_total_discount,
      job_total_discount: job_total_discount,
      complete_time: complete_time,
      exit_date_time: exit_date_time,
      gst_number: gst_number,
      cost_estimate: cost_estimate,
      previous_cost_estimate: previous_cost_estimate,
      count_for_cost_estimate_change: count_for_cost_estimate_change,
      cutsomer_name: cutsomer_name,
      customer_mobile: customer_mobile,
      jobcard_form_type: jobcard_form_type,
      sms_alert: sms_alert,
      reminder1: reminder1,
      reminder2: reminder2,
      reminder3: reminder3,
      reminder1message: reminder1message,
      reminder2message: reminder2message,
      reminder3message: reminder3message,
      reminder_priority: reminder_priority,
      settings_data_json: settings_data_json,
      complete_date: complete_date,
      closed_date: closed_date,
      km: km,
      fuel: fuel,
      manual_or_book: manual_or_book,
      section_discount: section_discount,
      supervisor: supervisor,
     
    };
    
    return this.http
      .post<Jobcard>(`${this.apiUrl}/create_short_invoice`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //Upload Dent Photos
  upload_dent_photos(worshop_id, jobcard_number, imagesarr) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", worshop_id)
      .set("jobcard_number", jobcard_number);
    const body = new FormData();
    for (var i = 0; i < imagesarr.length; i++) {
      body.append(i.toString(), imagesarr[i]);
    }
    return this.http
      .post<any>(`${this.apiUrl}/upload_dent_photo`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //delete dent photos
  delete_dent_photos(worshop_id, jobcard_number, image_url) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", worshop_id)
      .set("jobcard_number", jobcard_number)
      .set("image_url", image_url);
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/delete_dent_photo`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //get Jobcard Details
  jobCradDetails(
    workshop_id: string,
    jobcardnumber: string
  ): Observable<Jobcard> {
    let header = new HttpHeaders()
      .set("Access-Control-Allow-Origin", "*")
      .set("Authorization", this.userService.getData()["token"].toString());

    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("jobcardnumber", jobcardnumber);

    return this.http
      .get<any>(`${this.apiUrl}/jobcard_detail`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  generateInvoiceURL(
    jobcard_id: string
  ): Observable<any> {
    let header = new HttpHeaders()
      .set("Access-Control-Allow-Origin", "*")
      .set("Authorization", this.userService.getData()["token"].toString());

    const httpParams = new HttpParams()
      .set("jobcard_id", jobcard_id)

    return this.http
      .get<any>(`${this.apiUrl}/generate_url`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  getJobcardDetails(
    doc: string
  ): Observable<any> {
    let header = new HttpHeaders()
      .set("Access-Control-Allow-Origin", "*")
     ;

    const httpParams = new HttpParams()
      .set("doc", doc)

    return this.http
      .get<any>(`${this.apiUrl}/detail_jobcard`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //Delete Jobcard
  deleteJobcardPermanetly(workshop_id: string, jobcard_number: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("jobcard_number", jobcard_number);
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/delete_jobcard`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //get Last History Dates
  lastHistoryDates(
    workshop_id: string,
    vehicle_number: string
  ): Observable<Jobcard> {
    let header = new HttpHeaders()
      .set("Access-Control-Allow-Origin", "*")
      .set("Authorization", this.userService.getData()["token"].toString());

    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("vehicle_number", vehicle_number);

    return this.http
      .get<any>(`${this.apiUrl}/last_history_dates`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //get Last History Data
  lastHistoryData(
    workshop_id: string,
    vehicle_number: string,
    created_at: string
  ): Observable<Jobcard> {
    let header = new HttpHeaders()
      .set("Access-Control-Allow-Origin", "*")
      .set("Authorization", this.userService.getData()["token"].toString());

    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("vehicle_number", vehicle_number)
      .set("created_at", created_at);
    return this.http
      .get<Jobcard>(`${this.apiUrl}/last_history_data`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //check vehicle number
  checkVehicleNumber(workshop_id: string, vehicle_number: string) {
    let header = new HttpHeaders()
      .set("Access-Control-Allow-Origin", "*")
      .set("Authorization", this.userService.getData()["token"].toString());

    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("vehicle_number", vehicle_number);
    return this.http
      .get<any>(`${this.apiUrl}/check_vehicle`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  lastHistoryJobcard(workshop_id: string, vehicle_no: string) {
    let header = new HttpHeaders()
      .set("Access-Control-Allow-Origin", "*")
      .set("Authorization", this.userService.getData()["token"].toString());

    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("vehicle_number", vehicle_no);
    return this.http
      .get<any>(`${this.apiUrlPayment}/mobile_jobcard/last_history_jobcard`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //  -------------------- changes  by Aaliya  ------------------------------

  // to send customer feedback
  sendfeedback(
    workshop_id: string,
    jobcardnumber: string,
    service_quality: number,
    customer_support: number,
    timeliness: number,
    pricing: number,
    overall_rating: number,
    comment: string
  ) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("jobcard_number", jobcardnumber);
    const body = {
      service_quality: service_quality,
      customer_support: customer_support,
      timeliness: timeliness,
      pricing: pricing,
      overall_rating: overall_rating,
      comment: comment,
    };
    return this.http
      .post<any>(`${this.apiUrl}/feedback_list`, body, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  // to get the whole data of costomer feedback for the respective workshop
  getfeedback(
    workshop_id: string,
    jobcardnumber: string = "",
    search_keywords: string = ""
  ) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("jobcard_number", jobcardnumber)
      .set("search_keywords", search_keywords);
    return this.http
      .get<any>(`${this.apiUrl}/feedback_list`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  getallfeedback(
    workshop_id: string,
    jobcardnumber: string = "",
    search_keywords: string = ""
  ) {
    let header = new HttpHeaders()
      .set("Access-Control-Allow-Origin", "*")
      .set("Authorization", this.userService.getData()["token"].toString());

    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("jobcard_number", jobcardnumber)
      .set("search_keywords", search_keywords);
    return this.http
      .get<any>(`${this.apiUrl}/feedback_list`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  //  -------------------- changes  by Aaliya  ------------------------------
  // =-=-=-=-=-=-=-=-=- changes #2 by Aaliya -=-=-=-=-=-=-=-=-=-

  getRatingFeedback(workshop_id: string, rating: string) {
    let header = new HttpHeaders()
      .set("Access-Control-Allow-Origin", "*")
      .set("Authorization", this.userService.getData()["token"].toString());

    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("rating", rating);
    return this.http
      .get<any>(`${this.apiUrl}/get_rating_feedback`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  // =-=-=-=-=-=-=-=-=- changes #2 by Aaliya -=-=-=-=-=-=-=-=-=-

  //-------------------------------END JOBCARD--------------------------------

  //--------------------------------SETTINGS----------------------------------------
  // API to get all the Settings and from that filter Jobcard Settings in frontend
  getJobcardSettings(workshopId: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("workshop_id", workshopId);
    const body = {};
    return this.http
      .get<SettingsJobcard>(`${this.apiUrl}/jobcard_settings`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //Update Year when create Jobcard if current year is not same
  saveYear(workshopId: string, year: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("year", year);
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/update_settings`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }


  updateInvoiceSettings( invSettings:{}, wkid) {
    // let header = new HttpHeaders().set(
    //   "Authorization",
    //   this.userService.getData()["token"].toString()
    // );
    const httpParams = new HttpParams()
      .set("workshop_id", wkid)
    const body  = {
      invoice_settings: invSettings
    }
    return this.http
      .post<any>(`${this.apiUrl}/update_invoice_settings`, body, {
        // headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //update Jobcard Settings
  updateJobcardSettings(
    workshop_id: string,
    engine_chassis_number: number,
    vehicle_color: number,
    customer_mobile_number: number,
    customer_email: number,
    customer_birthday: number,
    customer_pickup_address: number,
    customer_delivery_address: number,
    driver_details: number,
    jobwise_mechanic: number,
    customer_signature: number,
    custom_jobcard_number: number,
    item_wise_discount: number,
    jobcard_no_series: number,
    jobcard_no_series_count: number,
    default_mechanic: string,
    jobcard_no_edited: boolean
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("mode", "jobcard");
    const body = {
      engine_chassis_number: engine_chassis_number,
      vehicle_color: vehicle_color,
      customer_mobile_number: customer_mobile_number,
      customer_email: customer_email,
      customer_birthday: customer_birthday,
      customer_pickup_address: customer_pickup_address,
      customer_delivery_address: customer_delivery_address,
      driver_details: driver_details,
      jobwise_mechanic: jobwise_mechanic,
      customer_signature: customer_signature,
      custom_jobcard_number: custom_jobcard_number,
      item_wise_discount: item_wise_discount,
      jobcard_no_series: jobcard_no_series,
      jobcard_no_series_count: jobcard_no_series_count,
      default_mechanic: default_mechanic,
      jobcard_no_edited: jobcard_no_edited,
    };
    return this.http
      .post<any>(`${this.apiUrl}/update_all_settings`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //Update Billing Settings
  updateBillingSettings(
    workshop_id: string,
    default_reminder_period: string,
    default_running_km: string,
    bill_format: string,
    partial_gst: number,
    complete_gst: number,
    gst_number: string,
    bill_header: any,
    tag_line: string,
    bill_footer: any,
    terms_and_conditions: string,
    duplaicategst: string,
    invoice_type_regular:any,
    invoice_type_thermal:any
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("mode", "billing");
    const body = {
      default_reminder_period: default_reminder_period,
      default_running_km: default_running_km,
      bill_format: bill_format,
      partial_gst: partial_gst,
      complete_gst: complete_gst,
      gst_number: gst_number,
      bill_header: bill_header,
      tag_line: tag_line,
      bill_footer: bill_footer,
      terms_and_conditions: terms_and_conditions,
      duplaicategst: duplaicategst,
      invoice_type_regular,
      invoice_type_thermal
    };
    return this.http
      .post<any>(`${this.apiUrl}/update_all_settings`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //Update Inventory Settings
  updateInventorySettings(
    workshop_id: string,
    bill_details: number,
    purchase_order_details: number,
    lower_limit: number,
    account: number,
    negative_inventory: number
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("mode", "inventory");
    const body = {
      bill_details: bill_details,
      purchase_order_details: purchase_order_details,
      lower_limit: lower_limit,
      account: account,
      negative_inventory: negative_inventory,
    };
    return this.http
      .post<any>(`${this.apiUrl}/update_all_settings`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  //Update or Add New user Settings
  updateOrAddNewUserSettings(workshop_id: string, user: any) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("mode", "user");
    const body = {
      user: user,
    };
    return this.http
      .post<any>(`${this.apiUrl}/update_all_settings`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  //-------------------------------END SETTINGS--------------------------------

  //--------------------------------WORKSHOP----------------------------------------
  // Search a End Customer by enter the Vechile Number
  getVechileCustomerDetail(
    workshop_id: string,
    detail_param: string,
    mode: string
  ): Observable<Customer> {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("detail_param", detail_param)
      .set("mode", mode);
    return this.http
      .get<Customer>(`${this.apiUrl}/customer_details`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  searchCustomers(workshop_id: string, search_keyword: string, mode: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("search_keywords", search_keyword)
      .set("mode", mode);
    return this.http
      .get<any>(`${this.apiUrl}/search_customer`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  customerPaginatedData(url: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    return this.http
      .get<any>(`${url}`, { headers: header })
      .pipe(catchError(this.handleError));
  }
  // Get Customer Voice
  getCustomerVoice(workshopId: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("workshop_id", workshopId);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/workshop_customer_voice`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // Save New Customer Voice
  AddCustomerVoice(workshopId: string, voice_name: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("voice_name", voice_name);
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/workshop_customer_voice_add`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // Get Vechile Inventory
  getVechileInventory(workshopId: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("workshop_id", workshopId);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/workshop_vehicle_acc`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // Save New Vechile Inventory
  AddVechileInventory(workshopId: string, acc_name: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("acc_name", acc_name);
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/workshop_vehicle_acc_add`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // Save New End Customer for the workshop
  saveCustomerProfile(
    mode: string,
    vehicle_number: string,
    chassis_number: string,
    vehicle_type: string,
    vehicle_make: string,
    vehicle_model: string,
    vehicle_variant: string,
    customer_name: string,
    customer_mobile: number,
    customer_mobile_2: number,
    customer_email: string,
    customer_dob: string,
    pick_up_address: string,
    drop_address: string,
    engine_number: string,
    vehicle_color: string,
    driver_name: string,
    driver_mobile: number,
    gst_number: string,
    km_read: string,
    workshop_id: string,
    ins_details = {},
    expDate=''

  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("mode", mode);
    const body = {
      vehicle_number: vehicle_number,
      chassis_number: chassis_number,
      vehicle_type: vehicle_type,
      vehicle_make: vehicle_make,
      vehicle_model: vehicle_model,
      vehicle_variant: vehicle_variant,
      customer_name: customer_name,
      customer_mobile: customer_mobile,
      customer_mobile_2: customer_mobile_2,
      customer_email: customer_email,
      customer_dob: customer_dob,
      pick_up_address: pick_up_address,
      drop_address: drop_address,
      engine_number: engine_number,
      vehicle_color: vehicle_color,
      driver_name: driver_name,
      driver_mobile: driver_mobile,
      gst_number: gst_number,
      km_read: km_read,
      workshop_id: workshop_id,
      insurance_details: ins_details,
      insurance_exp_date:expDate
      
    };
    
    return this.http
      .post<Customer>(`${this.apiUrl}/save_customer`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // Get Workshop SMS by jobcard
  getRemindersOfJobcard(workshop_id: string, jobcard_number: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("jobcard_number", jobcard_number);
    return this.http
      .get<Reminder>(`${this.apiUrl}/workshop_sms`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // Create New Customer from Update Jobcard
  CreateNewCustomerUpdateJobcard(
    jobcard_number: string,
    vehicle_number: string,
    chassis_number: string,
    vehicle_type: string,
    vehicle_make: string,
    vehicle_model: string,
    vehicle_variant: string,
    customer_name: string,
    customer_mobile: number,
    customer_mobile_2: number,
    customer_email: string,
    customer_dob: string,
    pick_up_address: string,
    drop_address: string,
    engine_number: string,
    vehicle_color: string,
    driver_name: string,
    driver_mobile: number,
    gst_number: string,
    km_read: string,
    workshop_id: string,
    ins_details = {},
    expDate=''
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("jobcard_number", jobcard_number);
    const body = {
      vehicle_number: vehicle_number,
      chassis_number: chassis_number,
      vehicle_type: vehicle_type,
      vehicle_make: vehicle_make,
      vehicle_model: vehicle_model,
      vehicle_variant: vehicle_variant,
      customer_name: customer_name,
      customer_mobile: customer_mobile,
      customer_mobile_2: customer_mobile_2,
      customer_email: customer_email,
      customer_dob: customer_dob,
      pick_up_address: pick_up_address,
      drop_address: drop_address,
      engine_number: engine_number,
      vehicle_color: vehicle_color,
      driver_name: driver_name,
      driver_mobile: driver_mobile,
      gst_number: gst_number,
      km_read: km_read,
      insurance_details: ins_details,
      insurance_exp_date:expDate
    };
    return this.http
      .post<any>(`${this.apiUrl}/jobcard_new_cutsomer`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // Create New Customer from Update Jobcard
  CreateNewStaff(
    workshop_id: string,
    mode: string,
    type: string,
    name: string,
    mobile_no_1: string,
    mobile_no_2: string,
    joining_date: string,
    email: string,
    address: string,
    salary: string,
    incentives: string
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("mode", mode);
    const body = {
      type: type,
      name: name,
      mobile_no_1: mobile_no_1,
      mobile_no_2: mobile_no_2,
      joining_date: joining_date,
      email: email,
      address: address,
      salary: salary,
      incentives: incentives,
    };
    return this.http
      .post<any>(`${this.apiUrl}/create_new_staff`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  // Update staff
  UpdateStaff(
    workshop_id: string,
    staff_id: string,
    type: string,
    name: string,
    mobile_no_1: string,
    mobile_no_2: string,
    joining_date: string,
    email: string,
    address: string,
    salary: string,
    incentives: string
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("staff_id", staff_id);
    const body = {
      type: type,
      name: name,
      mobile_no_1: mobile_no_1,
      mobile_no_2: mobile_no_2,
      joining_date: joining_date,
      email: email,
      address: address,
      salary: salary,
      incentives: incentives,
    };
    return this.http
      .post<any>(`${this.apiUrl}/update_staff`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  } //delete staff

  DeleteStaff(workshop_id: string, staff_id: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("staff_id", staff_id);
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/delete_staff`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  // Membership Expiry check
  expiryMembership(workshop_id: string) {
    const httpParams = new HttpParams().set("workshop_id", workshop_id);
    return this.http
      .get<Membership>(`${this.apiUrl}/expire_member`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  //Get Recurring Customers
  getRecurringCustomers(workshop_id: string, page_number: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("page_number", page_number);
    return this.http
      .get<any>(`${this.apiUrl}/customer_occur`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //Get all the Send SMS
  getSendSMS(workshop_id: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("workshop_id", workshop_id);
    return this.http
      .get<any>(`${this.apiUrl}/latest_sms_send`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // Save New Account Details
  AddAccountDetails(
    workshopId: string,
    name: string,
    phone: string,
    email: string,
    details: string,
    gst: string,
    address1: string,
    address2: string,
    city: string,
    state: string,
    zipcode: string,
    mode: string
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("name", name)
      .set("phone", phone)
      .set("email", email)
      .set("details", details)
      .set("gst", gst)
      .set("address1", address1)
      .set("address2", address2)
      .set("city", city)
      .set("state", state)
      .set("zipcode", zipcode)
      .set("mode", mode);
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/account_data`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //-------------------------------END SETTINGS--------------------------------

  //--------------------------------SHARED----------------------------------------
  // Get all the Vechile List it's make type model
  getMakeModel() {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams();
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/vhicle_list_all`, {})
      .pipe(catchError(this.handleError));
  }
  // Get all the Vechile List by search it's make type model
  searchMakeModel(search_keyword, vehicle_type) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("search_keyword", search_keyword)
      .set("vehicle_type", vehicle_type);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/search_vhicle_list`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // Get two wheeler type
  getType(make, model, variant) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("make", make)
      .set("model", model)
      .set("variant", variant);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/two_type`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // Get Staff List
  getStaffList(workshopId: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("workshop_id", workshopId);
    const body = {};
    return this.http
      .get<Staff>(`${this.apiUrl}/staff_list`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // Get Staff List
  getWalletAmount(workshopId: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("workshop_id", workshopId);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/workshop_wallet_amount`, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //-------------------------------END SHARED--------------------------------

  //--------------------------------SMSAPI----------------------------------------
  //Send SMS API
  sendsms(
    workshopId,
    jobcard_number,
    mobile_number,
    message,
    sms_category,
    date,
    flag
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("jobcard_number", jobcard_number)
      .set("mobile_number", mobile_number);
    const body = {
      message: message,
      sms_category: sms_category,
      date: date,
      flag: flag,
    };
    return this.http
      .post<any>(`${this.apiUrl}/send_workshop_sms`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  //Send Emial API
  sendEmail(
    workshop_id,
    bodymessage,
    message,
    sender,
    recipients,
    invoice_estimate: any,
    name
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("body", bodymessage)
      .set("message", message)
      .set("sender", sender)
      .set("recipients", recipients);
    const body = new FormData();
    body.append("invoice_estimate", invoice_estimate, name);
    return this.http
      .post<any>(`${this.apiUrl}/send_email`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //--------------------------------END SMSAPI----------------------------------------

  //--------------------------------DASHBOARD----------------------------------------
  // Get Dashboard Graph Data
  getGraphData(workshopId: string, mode: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("mode", mode);
    const body = {};
    return this.http
      .get<Dashboard>(`${this.apiUrl}/web_dashboard`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //--------------------------------END DASHBOARD----------------------------------------

  //--------------------------------Reports----------------------------------------
  // Get Reports Data on basis of selected reports
  getReports(
    workshopId: string,
    report_type: string,
    start_date: string,
    end_date: string
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("report_type", report_type)
      .set("start_date", start_date)
      .set("end_date", end_date);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/get_reports`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // Get Reports Data on basis of Customer Search
  getCustomerSearchReports(workshopId: string, search_keyword: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("search_keyword", search_keyword);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/customer_search_report`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // get currentquantity
  getRepoCurrentInvenQuantity(workshopId: string, part_data: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("part_data", part_data);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/inven_quantity_lube_sapre`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //A seperate api to fetch service data
  getService(workshopId: string, start_date: string, end_date: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("start_date", start_date)
      .set("end_date", end_date);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/service_due`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //--------------------------------END Reports----------------------------------------

  //--------------------------------Payment API----------------------------------------
  // 
  paymentOrderCreate(
    reqBody
  ) {
    const httpParams = new HttpParams()
     
    const body = reqBody;
    return this.http
      .post<any>(`${this.apiUrl}/initiate_recharge`,body, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  paymentOrderStatus(
    order_id, workshop_id
  ) {
    const httpParams = new HttpParams()
    .set("order_id", order_id)
    .set("workshop_id", workshop_id)
     

    return this.http
      .get<any>(`${this.apiUrl}/initiate_recharge`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  // Payment API get Signature
  paymentAPI(
    orderId: string,
    orderAmount: string,
    customerEmail: string,
    customerPhone: string,
    orderCurrency: string,
    orderNote: string,
    customerName: string,
    returnUrl: string
  ) {
    const httpParams = new HttpParams()
      .set("orderId", orderId)
      .set("orderAmount", orderAmount)
      .set("customerEmail", customerEmail)
      .set("customerPhone", customerPhone)
      .set("orderCurrency", orderCurrency)
      .set("orderNote", orderNote)
      .set("customerName", customerName)
      .set("returnUrl", returnUrl);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrlPayment}/payment_api`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  // Get all Recharges
  recharges() {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams();
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/recharge_type`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  allTransactions(workshopId: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("workshop_id", workshopId);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/all_transaction`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //Request Payment
  requestPayment(
    workshopId: string,
    jobcard_number: string,
    cus_name: string,
    cus_phone: string,
    req_amount: any,
    total_amount: any
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("jobcard_number", jobcard_number)
      .set("cus_name", cus_name)
      .set("cus_phone", cus_phone)
      .set("req_amount", req_amount)
      .set("total_amount", total_amount);
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/save_request_amount`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //Cancel Request Payment
  cancelEequestPayment(workshopId: string, jobcard_number: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("jobcard_number", jobcard_number);
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/cancel_request_amount`, body, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //get all received payments
  receviedPayment(workshopId: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("workshop_id", workshopId);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/get_recevied_amount`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //get received and requested amount
  requestedAndRecevied(workshopId: string, jobcard_number: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("jobcard_number", jobcard_number);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/get_request_amount`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // get Request Count
  getRequestCount(workshopId: string, jobcard_number: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("jobcard_number", jobcard_number);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/get_request_count`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //get Transaction Details
  getTransactionDetails(workshopId: string, order_id: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshopId)
      .set("order_id", order_id);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/get_order_id_details`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //--------------------------------End Payment API----------------------------------------
  //-------------------------------Short URL-----------------------------------------------
  // createShortURL(url:string,keyword:string){
  //   const httpParams = new HttpParams()
  //   .set('username','ttnunlock')
  //   .set('password','ttn@2019')
  //   .set('action','shorturl')
  //   .set('format','json')
  //   .set('url',url)
  //   .set('keyword',keyword)
  //   return this.http.get<any>(`${this.shorturl}`,{params:httpParams})
  //     .pipe(catchError(this.handleError));
  // }

  onlineGrageStatus(workshop_id: string, status: string) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("url_status", status);
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/update_url_param`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  getLInkStatus(workshopId: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("workshop_id", workshopId);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/get_url_param`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  createShortURL(url) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("link", url);
    return this.http
      .get<any>(`${this.apiUrl}/generate_link`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //-------------------------------End Short URL-----------------------------------------------

  //-------------------------------Booking API-----------------------------------------------
  //get allBookings
  getAllBookings(workshopId: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams().set("workshop_id", workshopId);
    const body = {};
    return this.http
      .get<Booking>(`${this.apiUrl}/list_booking_web`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //-------------------------------End Booking API-----------------------------------------------

  //============================================================================================
  //--------------------------------------------------------------------------------------------
  //End User APP API

  getWorkshopDetails(url) {
    const httpParams = new HttpParams().set("urlpram", url);
    return this.http
      .get<any>(`${this.endUserURL}/workshop_details`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  //-------------------Login API--------------------------------------------------------------------
  getEndUserOTP(mobile: string) {
    const httpParams = new HttpParams().set("mobile_number", mobile);
    const body = {};
    return this.http
      .get<any>(`${this.endUserURL}/auth/getotpend`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  resendEndUserOTP(mobile: string) {
    const httpParams = new HttpParams().set("mobile_number", mobile);
    const body = {};
    return this.http
      .post<any>(`${this.endUserURL}/auth/resendotoend`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  verifyEndUserOTP(mobile: string, otp: string, workshopid: string) {
    const httpParams = new HttpParams()
      .set("mobile_number", mobile)
      .set("otp", otp)
      .set("workshop_id", workshopid);
    const body = {};

    return this.http
      .post<any>(`${this.endUserURL}/auth/verify_otp_end`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //get Latest Jobcard
  getLatestJobcard(workshop_id: string, phone: string): Observable<EndUser> {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("mode", "one")
      .set("phone", phone);
    const body = {};
    return this.http
      .get<EndUser>(`${this.endUserURL}/jobcard_list`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  //get Latest Jobcard
  getAllJobcard(workshop_id: string, phone: string): Observable<EndUser> {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("mode", "all")
      .set("phone", phone);
    const body = {};
    return this.http
      .get<EndUser>(`${this.endUserURL}/jobcard_list`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  // Get Data for Inventory Dashboard pagination API
  jobcardenduserpageination(url: string) {
    let header = new HttpHeaders();
    return this.http
      .get<any>(`${url}`, { headers: header })
      .pipe(catchError(this.handleError));
  }
  //get All Booking list
  getAllBookList(workshop_id: string, user_id: string): Observable<Booking> {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("user_id", user_id);
    const body = {};
    return this.http
      .get<Booking>(`${this.endUserURL}/list_booking`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  //get All Booking list pagination
  getAllBookListPagination(url: string): Observable<Booking> {
    const httpParams = new HttpParams();
    const body = {};
    return this.http
      .get<Booking>(`${url}`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  //get All vehcile details
  getAllVehicleDetails(search_keyword: string) {
    const httpParams = new HttpParams().set("search_keyword", search_keyword);
    const body = {};
    return this.http
      .get<any>(`${this.endUserURL}/search_vhicle`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  //Save Customer Details
  saveCustomerDetails(
    workshop_id: string,
    customer_name: string,
    customer_phone: string,
    email: string,
    vehicle_details: any,
    vehicle_number: string
  ) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("customer_name", customer_name)
      .set("customer_phone", customer_phone)
      .set("email", email)
      .set("vehicle_number", vehicle_number)
      .set("vehicle_details", vehicle_details);
    const body = {};
    return this.http
      .post<Customer>(`${this.endUserURL}/save_customer_profile`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //Save Booking
  saveBooking(
    workshop_id: string,
    customer_name: string,
    customer_phone: string,
    total_amount: string,
    customer_email: string,
    location: string,
    customer_address_drop: string,
    customer_address_pick: string,
    vehicle_number: string,
    vehicle_details: string,
    date: string,
    time: string,
    services: string,
    customer_id: string,
    is_pick: string,
    is_drop: string,
    parent_id: string,
    workmobile: string,
    workname: string,
    booking_type: string
  ) {
    const httpParams = new HttpParams().set("workshop_id", workshop_id);
    const body = {
      customer_name: customer_name,
      customer_phone: customer_phone,
      total_amount: total_amount,
      customer_email: customer_email,
      location: location,
      customer_address_drop: customer_address_drop,
      customer_address_pick: customer_address_pick,
      vehicle_number: vehicle_number,
      vehicle_details: vehicle_details,
      date: date,
      time: time,
      services: services,
      customer_id: customer_id,
      is_pick: is_pick,
      is_drop: is_drop,
      parent_id: parent_id,
      workmobile: workmobile,
      workname: workname,
      booking_type: booking_type,
    };
    return this.http
      .post<Booking>(`${this.endUserURL}/save_booking`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //update Booking
  updateBookingStatusConfirm(
    workshop_id: string,
    bookingid: string,
    mode: string
  ) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("bookingid", bookingid)
      .set("mode", mode);
    const body = {};
    return this.http
      .post<Booking>(`${this.apiUrl}/update_booking_status`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  updateBookingStatusDecline(
    workshop_id: string,
    bookingid: string,
    mode: string,
    reason: string
  ) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("bookingid", bookingid)
      .set("mode", mode)
      .set("reason", reason);
    const body = {};
    return this.http
      .post<Booking>(`${this.apiUrl}/update_booking_status`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  updateBookingStatusComplete(
    workshop_id: string,
    booking_id: string,
    jobcard_number: string
  ) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("booking_id", booking_id)
      .set("jobcard_number", jobcard_number);
    const body = {};
    return this.http
      .post<Booking>(`${this.apiUrl}/complete_booking`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  updateBooking(
    workshop_id: string,
    booking_id: string,
    date: string,
    time: string
  ) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("booking_id", booking_id)
      .set("mode", "update");
    const body = {
      date: date,
      time: time,
    };
    return this.http
      .post<any>(`${this.endUserURL}/update_delete_booking`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //delete Booking
  deleteBooking(workshop_id: string, booking_id: string) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("booking_id", booking_id)
      .set("mode", "delete");
    const body = {};
    return this.http
      .post<any>(`${this.endUserURL}/update_delete_booking`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //get jobcard details
  getensjobcarddetails(
    workshop_id: string,
    jobcardnumber: string
  ): Observable<Jobcard> {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("jobcardnumber", jobcardnumber);
    const body = {};
    return this.http
      .get<any>(`${this.endUserURL}/detail_jobcard`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  //getEndUserSignature
  getEndUserSignature(
    orderId: string,
    orderAmount: string,
    orderCurrency: string,
    customerEmail: string,
    customerPhone: string,
    customerName: string,
    returnUrl: string,
    vendordid: string,
    orderNote: string
  ) {
    const httpParams = new HttpParams()
      .set("orderId", orderId)
      .set("orderAmount", orderAmount)
      .set("customerEmail", customerEmail)
      .set("customerPhone", customerPhone)
      .set("orderCurrency", orderCurrency)
      .set("orderNote", orderNote)
      .set("customerName", customerName)
      .set("returnUrl", returnUrl)
      .set("vendordid", vendordid);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrlPayment}/customer_payment_api`, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //Get Vehicles List
  getEndUserappVehicleList(
    workshop_id: string,
    mobile_number: string
  ): Observable<Jobcard> {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("mobile_number", mobile_number);
    const body = {};
    return this.http
      .get<any>(`${this.endUserURL}/vehicle_list_end`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  //Update User Profile
  updateEndCustomerProfile(
    mode: string,
    workshop_id: string,
    customer_name: string,
    customer_mobile: string,
    customer_email: string,
    pick_up_address: string,
    state: string,
    city: string,
    pincode: string,
    cusid: string
  ) {
    const httpParams = new HttpParams().set("mode", mode);
    const body = {
      customer_name: customer_name,
      customer_mobile: customer_mobile,
      customer_email: customer_email,
      pick_up_address: pick_up_address,
      state: state,
      city: city,
      pincode: pincode,
      workshop_id: workshop_id,
      cusid: cusid,
    };
    return this.http
      .post<any>(`${this.endUserURL}/save_update_profile`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //Save User Profile and add new vehicle
  saveEndCustomerProfile(
    mode: string,
    workshop_id: string,
    customer_name: string,
    customer_mobile: string,
    customer_email: string,
    pick_up_address: string,
    state: string,
    city: string,
    pincode: string,
    vehicle_number: string,
    vehicle_type: string,
    vehicle_make: string,
    vehicle_model: string,
    vehicle_variant: string
  ) {
    const httpParams = new HttpParams().set("mode", mode);
    const body = {
      customer_name: customer_name,
      customer_mobile: customer_mobile,
      customer_email: customer_email,
      pick_up_address: pick_up_address,
      state: state,
      city: city,
      pincode: pincode,
      workshop_id: workshop_id,
      vehicle_number: vehicle_number,
      vehicle_type: vehicle_type,
      vehicle_make: vehicle_make,
      vehicle_model: vehicle_model,
      vehicle_variant: vehicle_variant,
    };
    return this.http
      .post<any>(`${this.endUserURL}/save_update_profile`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //get Vehicle List for profle
  vehListProfile(workshop_id: string, mobile_number: string) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("mobile_number", mobile_number);
    const body = {};
    return this.http
      .get<any>(`${this.endUserURL}/vehicle_list_profile`, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //-------------------Ends Login API--------------------------------------------------------------------


  //-------------------Counter Sale App API--------------------------------------------------------------------

  //get counter sale number

  getCounterSaleNumber(workshop_id: string) {
    const httpParams = new HttpParams().set("workshop_id", workshop_id);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/counter_id`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  getCounterSaleCustomerSearch(workshop_id: string, search_keyword: string) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("search_keyword", search_keyword);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/search_counter_customer`, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  //Update Counter Customer
  UpdateCounterCustomer(
    workshop_id: string,
    name: string,
    phone: string,
    email: string,
    address: string,
    gst: string,
    idcus: string
  ) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("name", name)
      .set("phone", phone)
      .set("email", email)
      .set("address", address)
      .set("gst", gst)
      .set("idcus", idcus);
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/update_counter_customer`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  // get inevntiry search
  getCounterSaleInventorySearch(
    workshop_id: string,
    search_keyword: string,
    type: any
  ) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("search_keyword", search_keyword)
      .set("type", type);
    const body = {};
    return this.http
      .get<SpareLubeJob>(`${this.apiUrl}/search_inventory`, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  getCounterSalePartSearch(workshop_id: string, part_number: string) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("part_number", part_number);
    const body = {};
    return this.http
      .get<SpareLubeJob>(`${this.apiUrl}/search_inventory`, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  CreateCounterSale(
    mode: string,
    workshop_id: string,
    invoice_no: string,
    invoice_date: string,
    customer_name: string,
    customer_mobile: any,
    total_amount: any,
    discount: string,
    final_amount: any,
    paid: any,
    balance: any,
    sgst: any,
    cgst: any,
    igst: any,
    total_gst: any,
    settings: string,
    exit_note: string,
    counter_items: string,
    taxable: string,
    discount_amount: any,
    payment_method: string,
    recived_type: string,
    recevied_date: any,
    return_amount: string,
    return_date: any,
    invoice_no_customer: string,
    email: string,
    address: string,
    city: string,
    state: string,
    pincode: string,
    gstnunber: string,
    balcus: any,
    customer_id: any,
    refund_amount: any,
    is_return: any,
    vehicle_number: any
  ) {
    const httpParams = new HttpParams().set("mode", mode);
    const body = {
      workshop_id: workshop_id,
      invoice_no: invoice_no,
      invoice_date: invoice_date,
      customer_name: customer_name,
      customer_mobile: customer_mobile,
      total_amount: total_amount,
      discount: discount,
      final_amount: final_amount,
      paid: paid,
      balance: balance,
      sgst: sgst,
      cgst: cgst,
      igst: igst,
      total_gst: total_gst,
      settings: settings,
      exit_note: exit_note,
      counter_items: counter_items,
      taxable: taxable,
      discount_amount: discount_amount,
      payment_method: payment_method,
      recived_type: recived_type,
      recevied_date: recevied_date,
      return_amount: return_amount,
      return_date: return_date,
      invoice_no_customer: invoice_no_customer,
      email: email,
      address: address,
      city: city,
      state: state,
      pincode: pincode,
      gstnunber: gstnunber,
      balcus: balcus,
      customer_id: customer_id,
      refund_amount: refund_amount,
      is_return: is_return,
      vehicle_number: vehicle_number,
    };
    return this.http
      .post<Order>(`${this.apiUrl}/save_counter`, body, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  CounterDashboard(
    workshop_id: string,
    start_date: string,
    end_date: string,
    search_keywords: string
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("start_date", start_date)
      .set("end_date", end_date)
      .set("search_keywords", search_keywords);
    const body = {};
    return this.http
      .get<Counter>(`${this.apiUrl}/counter_dashboard`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  CounterDetail(workshop_id: string, counter_no: string) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("counter_no", counter_no);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/counter_detail`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  Counterpageination(url: string): Observable<Counter> {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    return this.http
      .get<Counter>(`${url}`, { headers: header })
      .pipe(catchError(this.handleError));
  }
  Feedbackpageination(url: string): Observable<any> {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    return this.http
      .get<any>(`${url}`, { headers: header })
      .pipe(catchError(this.handleError));
  }
  //-------------------End Counter Sale App API--------------------------------------------------------------------
 
  //-------------------Expense App API start --------------------------------------------------------------------

  //get counter sale number

  getAddExpenseBillNumber(workshop_id: string) {
    const httpParams = new HttpParams().set("workshop_id", workshop_id);
    const body = {};
    return this.http
      .get<any>(`${this.apiMblUrl}/bill_no`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  getAddExpenseCustomerSearch(workshop_id: string, search_keyword: string) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("search_keyword", search_keyword);
    const body = {};
    return this.http
      .get<any>(`${this.apiMblUrl}/search_expense_customer`, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  getExpenseCategory(workshop_id: string) {
    const httpParams = new HttpParams().set("workshop_id", workshop_id);
    const body = {};
    return this.http
      .get<any>(`${this.apiMblUrl}/expense_category`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

 

  //Update Expense Customer
  UpdateExpenseCustomer(
    workshop_id: string,
    supplier_name: string,
    bill_no: string,
    category_name: string,
    address: string,
    gst: string,
    idcus: string
  ) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("supplier_name", supplier_name)
      .set("bill_no", bill_no)
      .set("category_name", category_name)
      .set("address", address)
      .set("gst", gst)
      .set("idcus", idcus);
    const body = {};
    return this.http
      .post<any>(`${this.apiMblUrl}/update_expense_customer`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  // // get inevntiry search
  // getExpenseInventorySearch(
  //   workshop_id: string,
  //   search_keyword: string,
  //   type: any
  // ) {
  //   const httpParams = new HttpParams()
  //     .set("workshop_id", workshop_id)
  //     .set("search_keyword", search_keyword)
  //     .set("type", type);
  //   const body = {};
  //   return this.http
  //     .get<SpareLubeJob>(`${this.apiMblUrl}/search_inventory`, {
  //       params: httpParams,
  //     })
  //     .pipe(catchError(this.handleError));
  // }
  // getExpensePartSearch(workshop_id: string, part_number: string) {
  //   const httpParams = new HttpParams()
  //     .set("workshop_id", workshop_id)
  //     .set("part_number", part_number);
  //   const body = {};
  //   return this.http
  //     .get<SpareLubeJob>(`${this.apiMblUrl}/search_inventory`, {
  //       params: httpParams,
  //     })
  //     .pipe(catchError(this.handleError));
  // }
  CreateAddExpense(
    mode: string,
    workshop_id: string,
    invoice_no: string,
    invoice_date: string,
    customer_name: string,
    customer_mobile: any,
    total_amount: any,
    discount: string,
    final_amount: any,
    paid: any,
    balance: any,
    sgst: any,
    cgst: any,
    igst: any,
    total_gst: any,
    settings: string,
    exit_note: string,
    counter_items: string,
    taxable: string,
    discount_amount: any,
    payment_method: string,
    recived_type: string,
    recevied_date: any,
    return_amount: string,
    return_date: any,
    invoice_no_customer: string,
    email: string,
    address: string,
    city: string,
    state: string,
    pincode: string,
    gstnunber: string,
    balcus: any,
    customer_id: any,
    refund_amount: any,
    is_return: any,
    vehicle_number: any,
    balance_amount?:string,
    bill_no?:string,
    category_name?:string,
    created_at?:string,
    date?:string,
    id?:string,
    paid_amount?:string,
    supplier_name?:string,
    updated_at?:string,
    
  ) {
    const httpParams = new HttpParams().set("mode", mode);
    const body = {
      workshop_id: workshop_id,
      invoice_no: invoice_no,
      invoice_date: invoice_date,
      customer_name: customer_name,
      customer_mobile: customer_mobile,
      total_amount: total_amount,
      discount: discount,
      final_amount: final_amount,
      paid: paid,
      balance: balance,
      sgst: sgst,
      cgst: cgst,
      igst: igst,
      total_gst: total_gst,
      settings: settings,
      exit_note: exit_note,
      counter_items: counter_items,
      taxable: taxable,
      discount_amount: discount_amount,
      payment_method: payment_method,
      recived_type: recived_type,
      recevied_date: recevied_date,
      return_amount: return_amount,
      return_date: return_date,
      invoice_no_customer: invoice_no_customer,
      email: email,
      address: address,
      city: city,
      state: state,
      pincode: pincode,
      gstnunber: gstnunber,
      balcus: balcus,
      customer_id: customer_id,
      refund_amount: refund_amount,
      is_return: is_return,
      vehicle_number: vehicle_number,
      balance_amount:balance_amount,
      bill_no:bill_no,
      category_name:category_name,
      created_at:created_at,
      date:date,
      id:id,
      paid_amount:paid_amount,
      supplier_name:supplier_name,
      updated_at:updated_at,
    
    };
    return this.http
      .post<Order>(`${this.apiMblUrl}/add_expense`, body, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  ExpenseDashboard(
    workshop_id: string,
    start_date: string,
    end_date: string,
    search_keywords: string
  ) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("start_date", start_date)
      .set("end_date", end_date)
      .set("search_keywords", search_keywords);
    const body = {};
    return this.http
      .get<expense>(`${this.apiMblUrl}/expense_dashboard`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // ExpenseDetail(workshop_id: string, counter_no: string) {
  //   const httpParams = new HttpParams()
  //     .set("workshop_id", workshop_id)
  //     .set("counter_no", counter_no);
  //   const body = {};
  //   return this.http
  //     .get<any>(`${this.apiMblUrl}/expense_detail`, { params: httpParams })
  //     .pipe(catchError(this.handleError));
  // }
  Expensepageination(url: string): Observable<expense> {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    return this.http
      .get<expense>(`${url}`, { headers: header })
      .pipe(catchError(this.handleError));
  }
  FeedbackExpnesepageination(url: string): Observable<any> {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    return this.http
      .get<any>(`${url}`, { headers: header })
      .pipe(catchError(this.handleError));
  }
  //-------------------End Expense App API--------------------------------------------------------------------
 
 
 
 
 
 
 
 
  //-------------------Supplier API--------------------------------------------------------------------
  CreateUpdateSupplier(
    mode: string,
    workshop_id: string,
    supplier_name: string,
    business_name: string,
    supplier_mobile1: string,
    supplier_mobile2: string,
    supplier_email: string,
    supplier_address: string,
    supplier_gst_no: string,
    id: string,
    master_supplier_id: string
  ) {
    const httpParams = new HttpParams().set("mode", mode);
    const body = {
      workshop_id: workshop_id,
      supplier_name: supplier_name,
      business_name: business_name,
      supplier_mobile1: supplier_mobile1,
      supplier_mobile2: supplier_mobile2,
      supplier_email: supplier_email,
      supplier_address: supplier_address,
      supplier_gst_no: supplier_gst_no,
      id: id,
      master_supplier_id: master_supplier_id,
    };
    return this.http
      .post<any>(`${this.apiUrl}/save_create_supplier`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  DeleteSupplier(mode: string, workshop_id: string, id: string) {
    const httpParams = new HttpParams().set("mode", mode);
    const body = {
      workshop_id: workshop_id,
      id: id,
    };
    return this.http
      .post<any>(`${this.apiUrl}/save_create_supplier`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  SupplierDashboard(workshop_id: string, search_keywords: string) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("search_keywords", search_keywords);
    const body = {};
    return this.http
      .get<Supplier>(`${this.apiUrl}/supplier_dashboard`, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  SupplierDetail(workshop_id: string, id: string) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("id", id);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/supplier_details`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  Supplierpageination(url: string): Observable<Supplier> {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    return this.http
      .get<Supplier>(`${url}`, { headers: header })
      .pipe(catchError(this.handleError));
  }
  CreateUpdatePO(
    mode: string,
    workshop_id: string,
    bill_no: string,
    stock_items: string,
    supplier_id: string,
    po_no: string,
    total_amount: string,
    discount: string,
    balance_amount: string,
    paid_amount: string,
    gst_amount: string,
    cgst_amount: string,
    sgst_amount: string,
    igst_amount: string,
    payment_type: string,
    payble_amount: string,
    payment_mode: string,
    po_date: string,
    bill_date: string,
    supplier_name: string,
    supplier_mobile: string,
    exit_note: string,
    recevied_date: string,
    return_amount: string,
    return_date: string,
    refund_amount: string,
    is_return: string,
    vehicle_number: string,
    transport: string,
    deliverydate: string,
    person_name: string,
    balcus: string,
    ltno: string,
    po_status: number,
    master_supplier_id: number,
    dispatchdate: string
  ) {
    const httpParams = new HttpParams().set("mode", mode);
    const body = {
      workshop_id: workshop_id,
      bill_no: bill_no,
      stock_items: stock_items,
      supplier_id: supplier_id,
      po_no: po_no,
      total_amount: total_amount,
      discount: discount,
      balance_amount: balance_amount,
      paid_amount: paid_amount,
      gst_amount: gst_amount,
      cgst_amount: cgst_amount,
      sgst_amount: sgst_amount,
      igst_amount: igst_amount,
      payment_type: payment_type,
      payble_amount: payble_amount,
      payment_mode: payment_mode,
      po_date: po_date,
      bill_date: bill_date,
      supplier_name: supplier_name,
      supplier_mobile: supplier_mobile,
      exit_note: exit_note,
      recevied_date: recevied_date,
      return_amount: return_amount,
      return_date: return_date,
      refund_amount: refund_amount,
      is_return: is_return,
      vehicle_number: vehicle_number,
      transport: transport,
      deliverydate: deliverydate,
      person_name: person_name,
      balcus: balcus,
      ltno: ltno,
      po_status: po_status,
      master_supplier_id: master_supplier_id,
      dispatchdate: dispatchdate,
    };
    return this.http
      .post<any>(`${this.apiUrl}/save_stock`, body, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  PoDashboard(
    workshop_id: string,
    end_date: string,
    start_date: string,
    search_keywords: string,
    po_status: string
  ) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("search_keywords", search_keywords)
      .set("start_date", start_date)
      .set("end_date", end_date)
      .set("po_status", po_status);
    const body = {};
    return this.http
      .get<Purchase>(`${this.apiUrl}/po_dashboard`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  PoDashboardForSupplier(
    workshop_id: string,
    end_date: string,
    start_date: string,
    search_keywords: string,
    po_status: string
  ) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("search_keywords", search_keywords)
      .set("start_date", start_date)
      .set("end_date", end_date)
      .set("po_status", po_status);
    const body = {};
    return this.http
      .get<Purchase>(`${this.apiUrl}/po_dashboard_supplier`, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  PODetail(workshop_id: string, id: string) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("id", id);
    const body = {};
    return this.http
      .get<Purchase>(`${this.apiUrl}/po_details`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  SearchBillPONO(workshop_id: string, id: string, mode: string) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("id", id)
      .set("mode", mode);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/search_po_bill_no`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  POpageination(url: string): Observable<Purchase> {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    return this.http
      .get<Purchase>(`${url}`, { headers: header })
      .pipe(catchError(this.handleError));
  }
  UpdateStock(
    mode: string,
    workshop_id: string,
    partnumber: string,
    qty: string,
    unit: string,
    sell: string,
    gsttype: string,
    gstvalue: string
  ) {
    const httpParams = new HttpParams()
      .set("mode", mode)
      .set("partnumber", partnumber)
      .set("workshop_id", workshop_id);
    const body = {
      partnumber:{qty: qty,
      unit: unit,
      sell: sell,
      gsttype: gsttype,
      gstvalue: gstvalue,}
    };
    return this.http
      .post<any>(`${this.apiUrl}/update_inventory_stock`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  UpdatePOStock(
    mode: string,
    workshop_id: string,
    payload
  ) {
    const httpParams = new HttpParams()
      .set("mode", mode)
      .set("workshop_id", workshop_id);

      console.log('updtepo')
    // const body = {
    //   qty: qty,
    //   unit: unit,
    //   sell: sell,
    //   gsttype: gsttype,
    //   gstvalue: gstvalue,
    // };
    return this.http
      .post<any>(`${this.apiUrl}/update_inventory_stock`, payload, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  AllSupplierDetails(mobileno: string, workshop_id: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    const httpParams = new HttpParams()
      .set("supplier_mobile1", mobileno)
      .set("workshop_id", workshop_id);
    const body = {};
    return this.http
      .get<any>(`${this.apiUrl}/all_supplier_details`, {
        headers: header,
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  //-------------------End Supplier API--------------------------------------------------------------------
  //-------------------Pilot App API--------------------------------------------------------------------

  //Get Product Details
  getProductDetails(workshop_id): Observable<Product> {
    const httpParams = new HttpParams().set("workshop_id", workshop_id);
    const body = {};
    return this.http
      .get<Product>(`${this.pilotURL}/product_detail`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  getProductDetailspagi(url: string): Observable<Product> {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    return this.http
      .get<Product>(`${url}`, { headers: header })
      .pipe(catchError(this.handleError));
  }
  //Search Product
  SearchProductDetails(search_keyword): Observable<Product> {
    const httpParams = new HttpParams().set("search_keyword", search_keyword);
    const body = {};
    return this.http
      .get<Product>(`${this.pilotURL}/search_product`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  //Get All Products
  getAllPOrders(workshop_id): Observable<OrderPlace> {
    const httpParams = new HttpParams().set("workshop_id", workshop_id);
    const body = {};
    return this.http
      .get<OrderPlace>(`${this.pilotURL}/order_details`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  getAllPOrderspagi(url: string): Observable<OrderPlace> {
    let header = new HttpHeaders().set(
      "Authorization",
      this.userService.getData()["token"].toString()
    );
    return this.http
      .get<OrderPlace>(`${url}`, { headers: header })
      .pipe(catchError(this.handleError));
  }

  listStoreOrders(page = 1): Observable<OrderPlace> {
    const httpParams = new HttpParams()
    const body = {};
    return this.http
      .get<OrderPlace>(`${this.apiUrl}/orders_list?&page=${page}`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  listStoreOrdersByPage(url): Observable<OrderPlace> {
    const httpParams = new HttpParams()
    const body = {};
    return this.http
      .get<OrderPlace>(url, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  OrderStatusUpdate(data): Observable<any> {
    const httpParams = new HttpParams()
    .set("orderid", data.orderid)
    .set("status", data.status);
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/order_status`,body, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  //sort products
  SortProductDetails(sort_type): Observable<Product> {
    const httpParams = new HttpParams().set("sort_type", sort_type);
    const body = {};
    return this.http
      .get<Product>(`${this.pilotURL}/sort_product`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  //Save Order Details
  saveOrder(
    orderamount: string,
    orderquantity: string,
    customername: string,
    customerphone: string,
    customeremail: string,
    address: string,
    city: string,
    state: string,
    pincode: string,
    productid: string,
    productskuid: string,
    productname: string,
    workshop_id: string,
    cart_details: any,
    workshop_name: string
  ) {
    const httpParams = new HttpParams();
    const body = {
      orderamount: orderamount,
      orderquantity: orderquantity,
      customername: customername,
      customerphone: customerphone,
      customeremail: customeremail,
      address: address,
      city: city,
      state: state,
      pincode: pincode,
      productid: productid,
      productskuid: productskuid,
      productname: productname,
      workshop_id: workshop_id,
      cart_details: cart_details,
      workshop_name: workshop_name,
    };
    return this.http
      .post<Order>(`${this.pilotURL}/save_order`, body, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  //Send OTP
  getOTPForProducts(mobile_number) {
    const httpParams = new HttpParams()
      .set("mobile_number", mobile_number)
      .set("mode", "get");
    const body = {};
    return this.http
      .get<any>(`${this.pilotURL}/number_verify`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  //ResendOTP
  reSendOTPForProducts(mobile_number) {
    const httpParams = new HttpParams()
      .set("mobile_number", mobile_number)
      .set("mode", "reget");
    const body = {};
    return this.http
      .get<any>(`${this.pilotURL}/number_verify`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  //Verify OTP
  verifyOTPForProducts(mobile_number, otp) {
    const httpParams = new HttpParams()
      .set("mobile_number", mobile_number)
      .set("mode", "veri")
      .set("otp", otp);
    const body = {};
    return this.http
      .get<any>(`${this.pilotURL}/number_verify`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  //send email
  sendEmailProduct(
    bodyy: string,
    message: string,
    body1: string,
    message1: string,
    recipients: string
  ) {
    const httpParams = new HttpParams()
      .set("body", bodyy)
      .set("message", message)
      .set("body1", body1)
      .set("message1", message1)
      .set("recipients", recipients);
    const body = {};
    return this.http
      .post<any>(`${this.pilotURL}/send_email_pilot`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //get otp for online store
  getStoreOTP(mobile: string) {
    const httpParams = new HttpParams().set("mobile_number", mobile);
    const body = {};
    return this.http
      .get<any>(`${this.pilotURL}/getotpstore`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  //verify otp
  verifyStoreOTP(mobile: string, otp: string) {
    const httpParams = new HttpParams()
      .set("mobile_number", mobile)
      .set("otp", otp);
    const body = {};
    return this.http
      .post<any>(`${this.pilotURL}/login_register_store`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //get Cart Details
  getCartDetails(workshop_id): Observable<Cart> {
    const httpParams = new HttpParams().set("workshop_id", workshop_id);
    const body = {};
    return this.http
      .get<Cart>(`${this.pilotURL}/cart_details`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  //Add update or delete cart item
  addUpdateDeleteCrat(workshop_id, mode, idcart, qty, productid, product = {}) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("mode", mode)
      .set("idcart", idcart)
      .set("qty", qty)
      .set("productid", productid);
    const body = product;
    return this.http
      .post<any>(`${this.pilotURL}/add_update_delete_cart`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  //-------------------End Pilot App API--------------------------------------------------------------------

  // --------------------Viraj -----------------//

  //get Cart Details
  getWorkshopDetailsById(workshop_id): Observable<Workshop> {
    const httpParams = new HttpParams().set("workshop_id", workshop_id);
    const body = {};
    return this.http
      .get<Workshop>(`${this.apiUrl}/workshop_data`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  setUserPassword(
    mobileno: string,
    mode: string,
    new_password: string,
    old_password: string
  ) {
    const httpParams = new HttpParams()
      .set("mobile_number", mobileno)
      .set("mode", mode);

    const body = {
      old_password: old_password,
      new_password: new_password,
    };

    return this.http
      .post<any>(`${this.apiUrl}/auth/password_set_reset`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  CreateWorkshopUser(
    workshop_id: string,
    user_name: string,
    user_role: string,
    user_mobile_number: string,
    dashboard: any,
    setting: any,
    reports: any,
    collect_payment: any,
    appointment: any,
    online_garage: any,
    staff: any,
    feedback: any,
    counter_sale,
    inventory: any,
    purchase_order: any,
    jobcard: any,
    password: string
  ) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("user_name", user_name)
      .set("user_role", user_role)
      .set("user_mobile_number", user_mobile_number);

    const body = {
      dashboard: dashboard,
      settings: setting,
      reports: reports,
      collect: collect_payment,
      appointment: appointment,
      onlinegarage: online_garage,
      staff: staff,
      feedback: feedback,
      countersale: counter_sale,
      inventory: inventory,
      purchaseorder: purchase_order,
      jobcards: jobcard,
      password: password,
    };

    return this.http
      .post<any>(`${this.apiUrl}/create_user`, body, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  getWorkshopUsers(workshop_id: string) {
    const httpParams = new HttpParams().set("workshop_id", workshop_id);
    const body = {};
    return this.http
      .get<Workshop>(`${this.apiUrl}/update_user_access`, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  UpdateWorkshopUser(
    workshop_id: string,
    user_name: string,
    user_role: string,
    user_mobile_number: string,
    dashboard: any,
    setting: any,
    reports: any,
    collect_payment: any,
    appointment: any,
    online_garage: any,
    staff: any,
    feedback: any,
    counter_sale,
    inventory: any,
    purchase_order: any,
    jobcard: any,
    password: string,
    is_active: boolean,
    is_delete: boolean
  ) {
    console.log(
      "parms-body",
      workshop_id,
      user_name,
      user_role,
      user_mobile_number,
      dashboard,
      setting,
      collect_payment,
      appointment,
      online_garage,
      staff,
      feedback,
      counter_sale,
      inventory,
      purchase_order,
      jobcard,
      password
    );
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("user_name", user_name);

    const body = {
      user_role: user_role,
      user_mobile_number: user_mobile_number,
      is_active: is_active,
      is_delete: is_delete,
      dashboard: dashboard,
      settings: setting,
      reports: reports,
      collect: collect_payment,
      appointment: appointment,
      onlinegarage: online_garage,
      staff: staff,
      feedback: feedback,
      countersale: counter_sale,
      inventory: inventory,
      purchaseorder: purchase_order,
      jobcards: jobcard,
      password: password,
    };
    return this.http
      .post<any>(`${this.apiUrl}/update_user_access`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  verifyUserWorkshop(workshop_id, user_name, password) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("user_name", user_name)
      .set("password", password);
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/verify_user`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }
  // web_jobcard/get_user_access?workshop_id=4317&user_name=trail2&component_name=inventory
  getWorkshopUsersAccess(
    workshop_id: string,
    user_name: string,
    component_name: string
  ) {
    const httpParams = new HttpParams()
      .set("workshop_id", workshop_id)
      .set("user_name", user_name)
      .set("component_name", component_name);
    const body = {};
    return this.http
      .get<Workshop>(`${this.apiUrl}/get_user_access`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

findDuplicates(workshop_mobile_number_1){
  const httpParams = new HttpParams()
      .set("workshop_mobile_number_1", workshop_mobile_number_1);
    const body = {};
    return this.http
      .post<any>(`${this.apiUrl}/getDuplicate`, body, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
}
  public getJSON(): Observable<any> {
    return this.http.get('../assets/workshop_profile_202202021352.json');
  }
   getGarageFinderWorkshopData(workshop_pincode):Observable<any> {
    const httpParams = new HttpParams()
    .set("workshop_pincode", workshop_pincode)
    const body = {};
    return this.http.get(`${this.apiUrl}/getWorkshopByPincode`,{ params: httpParams })
    .pipe(catchError(this.handleError));
  }

  //map api
  // https://maps.googleapis.com/maps/api/geocode/json?latlng=44.4647452,7.3553838&key=YOUR_API_KEY
  getAddrByLatLan(latlang) {
    const httpParams = new HttpParams()
      .set("latlng", latlang)
      .set("key", "AIzaSyBkPJwfavYCe_C73JjF8SQN1O49KoQOxuo");
    const body = {};
    return this.http
      .get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  getAddrByLatLanSecond(lon, lat) {
    // const url = `https://api-adresse.data.gouv.fr/reverse/?lon=${Longitude}&lat=${Latitude}`
    const httpParams = new HttpParams().set("lon", lon).set("lat", lat);
    const body = {};
    return this.http
      .get(`https://api-adresse.data.gouv.fr/reverse`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }
  getPostalCodes(latlang) {
    // http://api.geonames.org/findNearbyPostalCodesJSON?username=demo&lat=" . $lat .  "&lng=" . $long;
    const httpParams = new HttpParams()
      .set("lat", latlang.lat)
      .set("lng", latlang.lng)
      .set("username", "demo");
    const body = {};
    return this.http.get(`http://api.geonames.org/findNearbyPostalCodesJSON`, {
      params: httpParams,
    });
  }

  getCountryInfoByName(): Observable<any> {
    return this.http.get("./assets/currency/currency_info.json");
  }
}
