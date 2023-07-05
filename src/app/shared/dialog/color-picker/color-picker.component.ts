import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css']
})
/**
 * In this file color is asked
 * from the user in jobcard
 *  creation customer section
*/
export class ColorPickerComponent implements OnInit {
  selectcolor;
  colors=['White','Yellow','Blue','Red','Green','Black','Brown','Teal','Silver','Purple','Gray','Orange','Maroon','Aquamarine','Coral','Fuchsia','Wheat','Lime','Crimson','Khaki', 'Magenta','Plum','Olive','Cyan']
  constructor(public dialogRef: MatDialogRef<ColorPickerComponent>) { }

  ngOnInit() {
  }
  // seledted colour
  handleChangeComplete(values){
    console.log(values)
    this.selectcolor=values.color.hex
  }
  // close the popup
  closePopup(){
    this.dialogRef.close(this.selectcolor);
  }
}
