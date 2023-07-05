import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from "@angular/material";
import * as glob from "../../../shared/usercountry/userCountryGlobal";

@Component({
  selector: "app-last-jobcard-history",
  templateUrl: "./last-jobcard-history.component.html",
  styleUrls: ["./last-jobcard-history.component.css"],
})
export class LastJobcardHistoryComponent implements OnInit {
  detail;
  type;
  currency_symbol: any;
  constructor(
    public dialogRef: MatDialogRef<LastJobcardHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    (this.detail = data.history), (this.type = data.jobcardtype);
  }

  ngOnInit() {
    this.currency_symbol = glob.currency_symbol;

    console.log("detials", this.detail);
    console.log(this.detail.next_service_date);
    console.log(this.detail["next_service_date"] == " ");
    console.log(this.detail["next_service_date"].lenght === 0);
    console.log(this.detail["last_service_km"]);
  }
  closejob(e) {
    this.dialogRef.close("popupclose");
  }
}
