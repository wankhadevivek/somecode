import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
@Component({
  selector: "app-allow-notification",
  templateUrl: "./allow-notification.component.html",
  styleUrls: ["./allow-notification.component.css"],
})
export class AllowNotificationComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AllowNotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    console.log("data", this.data);
  }

  closePopup(event) {
    this.dialogRef.close(event);
  }
}
