import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { TokenStorageService } from "./token.service";

const TOKEN_HEADER_KEY = "Authorization";
/** Inject With Credentials into the request */
@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private token:TokenStorageService, private router: Router,private snakBar:MatSnackBar,) { }
  intercept(req: HttpRequest<any>, next: HttpHandler):
  
    Observable<HttpEvent<any>> {
      if (this.token.getToken() != null) {
      req = req.clone({ withCredentials: true });  
      req = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, this.token.getToken()) });
      }

    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          //  console.log('event--->>>', event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.error.text == "Signature expired. Please log in again.") {
          this.snakBar.open("Token expired, Please log in again.", "", {
            duration: 4000,
          });
          this.token.signOut();
          
          if(localStorage.getItem('role') == 'supplier'){
            this.router.navigate(["supplier/login"]);
          }else{
            this.router.navigate(["login"]);
          }
        }
        let data = {};
        data = {
          reason:
            error && error.error && error.error.reason
              ? error.error.reason
              : "",
          status: error.error.text,
        };
        console.log("error", error, data);
        return throwError(error);
      })
    );
  }
}
