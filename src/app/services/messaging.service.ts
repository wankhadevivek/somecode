import { Injectable } from "@angular/core";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { BehaviorSubject } from "rxjs";
@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  constructor(private angularFireMessaging: AngularFireMessaging) {
    this.angularFireMessaging.messaging.subscribe((_messaging) => {
      console.log(_messaging)
      _messaging.onMessage = _messaging.onMessage.bind(_messaging);
      _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      
    });
    // this.dialogService
    //   .OpenConfirmDialog("allow notificcations", true, "Delete")
    //   .subscribe((answer) => {
    //     if (answer == true){
    //         this.angularFireMessaging.messaging.subscribe((_messaging) => {

    //           console.log("_messaging", _messaging)
    //         _messaging.onMessage = _messaging.onMessage.bind(_messaging);
    //         console.log("_messaging.onMessage", _messaging.onMessage)
    //         _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);


    //         this.requestPermission()
    //         this.receiveMessage()
            
    //       });
    //     }
       
    //   })
  

    
    
  }
  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        // console.log(token);

        localStorage.setItem("notifyToken", token);
      },
      (err) => {
        console.error("Unable to get permission to notify.", err);
      }
    );
  }
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe((payload) => {
      console.log("new message received. ", payload);
      this.currentMessage.next(payload);
      this.showCustomNotification(payload);
    });
  }


  showCustomNotification(payload: any) {
    let notify_data = payload["notification"];
    let title = notify_data["title"];
    // let options = {
    //   body: notify_data["body"],
    //   icon: notify_data["icon"],
    //   badge: "../../../../assets/images/ttn.png",
    //   image: "../../../assets/images/ttn.png",
    // };
     let options = {
      body: notify_data["body"],
      icon: notify_data["icon"],
      badge: notify_data["image"],
      image: notify_data["image"],
      
    };

    console.log("new msg", notify_data);
    let notify: Notification = new Notification(title, options);

    notify.onclick = (event) => {
      event.preventDefault();
      window.location.href = "https://www.google.com";
    };
  }
}
