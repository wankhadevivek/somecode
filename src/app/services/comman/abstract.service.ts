import { Injectable } from "@angular/core";

import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs/internal/observable/throwError";
@Injectable({
  providedIn: "root",
})
export class AbstractService {
  // Python API
  //---------------------------------------Live URLS-----------------------------------------------------------------
  // public mainurl: string = "garage.tightthenut.com/"
  // public newmainurl: string = "https://garage.tightthenut.com/"
  // public apiUrl: string = "https://app.tightthenut.com/api/v1/web_jobcard";
  // public endUserURL: string = "https://app.tightthenut.com/api/v1/web_end_user";
  // public pilotURL: string = "https://app.tightthenut.com/api/v1/pilot_app";
  // public apiUrlPayment: string = "https://app.tightthenut.com/api/v1";
  // public returnurl: string='https://app.tightthenut.com/api/v1/payment_redirect'
  // public returnurlcus: string='https://app.tightthenut.com/api/v1/customer_payment_redirect'
  // public moder: string='Prod'
  // public appId: string='1533853e939f5a77ea86744da83351'
  // public imageUrl: string='https://live-ttn-app.s3.ap-south-1.amazonaws.com/assests/images/profile_small.jpg'
  // public imageUrl1: string='https://live-ttn-app.s3.ap-south-1.amazonaws.com/assests/images/print_logo.png'
  // public imageUrl2: string='https://live-ttn-app.s3.ap-south-1.amazonaws.com/signature.jpg'
  // public payUrl: string='https://www.cashfree.com/checkout/post/submit'
  // public imageUrl3: string='https://live-ttn-app.s3.ap-south-1.amazonaws.com/assests/images/logo.png'

  //---------------------------------------Testing URLS-----------------------------------------------------------------
  public mainurl: string = "ttnangularapp-env.eba-3c7pgmvt.ap-south-1.elasticbeanstalk.com/"
  public newmainurl: string = "http://ttnangularapp-env.eba-3c7pgmvt.ap-south-1.elasticbeanstalk.com/"
  public apiUrl: string = "http://ttndevelopment-env.eba-a7byvfhj.ap-south-1.elasticbeanstalk.com/api/v1/web_jobcard";
  public apiMblUrl: string = "http://ttndevelopment-env.eba-a7byvfhj.ap-south-1.elasticbeanstalk.com/api/v1/mobile_jobcard";
  public endUserURL: string = "http://ttndevelopment-env.eba-a7byvfhj.ap-south-1.elasticbeanstalk.com/api/v1/web_end_user";
  public pilotURL: string = "http://ttndevelopment-env.eba-a7byvfhj.ap-south-1.elasticbeanstalk.com/api/v1/pilot_app";
  public apiUrlPayment: string = "http://ttndevelopment-env.eba-a7byvfhj.ap-south-1.elasticbeanstalk.com/api/v1";
  public returnurl: string='http://ttndevelopment-env.eba-a7byvfhj.ap-south-1.elasticbeanstalk.com/api/v1/payment_redirect'
  public returnurlcus: string='http://ttndevelopment-env.eba-a7byvfhj.ap-south-1.elasticbeanstalk.com/api/v1/customer_payment_redirect'
  public moder: string='Prod'
  public appId: string='1416023a0717fccf53cf6754206141'
  public imageUrl: string='https://workshopandcustomers.s3.ap-south-1.amazonaws.com/assests/images/profile_small.jpg'
  public imageUrl1: string='https://workshopandcustomers.s3.ap-south-1.amazonaws.com/assests/images/print_logo.png'
  public imageUrl2: string='https://workshopandcustomers.s3.ap-south-1.amazonaws.com/assests/images/signature.jpg'
  public payUrl: string='https://test.cashfree.com/billpay/checkout/post/submit'
  public imageUrl3: string='https://workshopandcustomers.s3.ap-south-1.amazonaws.com/assests/images/logo.png'

  //---------------------------------------Development URLS-----------------------------------------------------------------
  // public mainurl: string = "127.0.0.1:4200/";
  // public newmainurl: string = "http://127.0.0.1:4200/";
  // public apiUrl: string = "http://127.0.0.1:5000/api/v1/web_jobcard";
  // public endUserURL: string = "http://127.0.0.1:5000/api/v1/web_end_user";
  // public pilotURL: string = "http://127.0.0.1:5000/api/v1/pilot_app";
  // public apiUrlPayment: string = "http://127.0.0.1:5000/api/v1";
  // public returnurl: string = "http://127.0.0.1:5000/api/v1/payment_redirect";
  // public returnurlcus: string =
  //   "http://127.0.0.1:5000/api/v1/customer_payment_redirect";
  // public moder: string = "test";
  // public appId: string = "1416023a0717fccf53cf6754206141";
  // public imageUrl: string =
  //   "https://workshopandcustomers.s3.ap-south-1.amazonaws.com/assests/images/profile_small.jpg";
  // public imageUrl1: string =
  //   "https://workshopandcustomers.s3.ap-south-1.amazonaws.com/assests/images/print_logo.png";
  // public imageUrl2: string =
  //   "https://workshopandcustomers.s3.ap-south-1.amazonaws.com/assests/images/signature.jpg";
  // public payUrl: string =
  //   "https://test.cashfree.com/billpay/checkout/post/submit";
  // public imageUrl3: string =
  //   "https://workshopandcustomers.s3.ap-south-1.amazonaws.com/assests/images/logo.png";
  //  //---------------------------------------Comman URLS-----------------------------------------------------------------
  public customerUrl = "http://livejobcard.tightthenut.com/jobcard.html?data=";
  public shorturl = "http://livejobcard.tightthenut.com/yourls-api.php";
  public shorturlmain = "http://livejobcard.tightthenut.com/";
  constructor(protected http: HttpClient) {}
  protected handleError = (error: HttpErrorResponse) => {
    if (error == undefined || error.error == undefined)
      return throwError("Cannot Get Data");
    return throwError(error.error.message);
  };
}
