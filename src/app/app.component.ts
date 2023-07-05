import { Injector, Component } from "@angular/core";
import { MessagingService } from "./services/messaging.service";
import { DilogOpenService } from "src/app/services/dilog-open.service";
import { GeneralService } from "src/app/services/general.service";
import { map } from 'rxjs/operators';
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "Tight The Nut";
  message;
  conditon = false;

  // constructor(private messagingService: MessagingService) {}
  constructor(
    private injector: Injector,
    private dialogService: DilogOpenService,
    private general: GeneralService,
    private snakBar:MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
  ) {}
 ngOnInit() {

    this.createOnline$().subscribe(isOnline =>{ if(!isOnline){
      this.snakBar.open("You Are Offline","", {
        duration: 4000
      })} console.log(isOnline) });
      this.openPoByUrl();
  }
  createOnline$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
      sub.next(navigator.onLine);
      sub.complete();
      }));
    }
    openPoByUrl(){
      console.log("iamhere poURL");
      this.route.queryParams.subscribe(params => {
        console.log("params>>",JSON.stringify(params));
        if(params.id){
            localStorage.setItem("params",JSON.stringify(params));
            this.router.navigate(['login/supplier']);
          }
      });
    }
}
