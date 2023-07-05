import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ImageCroppedEvent, ImageTransform, Dimensions } from 'ngx-image-cropper';
@Component({
  selector: 'app-image-crop',
  templateUrl: './image-crop.component.html',
  styleUrls: ['./image-crop.component.css']
})
/**
 * In this file image is being croped
 * in settings section for logo
 * signature and profile photo
*/
export class ImageCropComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  constructor(public dialogRef: MatDialogRef<ImageCropComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { 
    this.imageChangedEvent=data.string
  }
  ngOnInit() {
  }
  // c;oase the popup
  closePopup(evnet){
    this.dialogRef.close(evnet);
  }
  // croped image
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  // image loaded
  imageLoaded() {
    this.showCropper = true;
  }
  // crop the image
  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }
  // if image laod failed
  loadImageFailed() {
      console.log('Load failed');
  }
  // rotate left
  rotateLeft() {
      this.canvasRotation--;
      this.flipAfterRotate();
  }
  // rorate right
  rotateRight() {
      this.canvasRotation++;
      this.flipAfterRotate();
  }
  // Rotate the image
  private flipAfterRotate() {
      const flippedH = this.transform.flipH;
      const flippedV = this.transform.flipV;
      this.transform = {
          ...this.transform,
          flipH: flippedV,
          flipV: flippedH
      };
  }
  // flip the image horizontal 
  flipHorizontal() {
      this.transform = {
          ...this.transform,
          flipH: !this.transform.flipH
      };
  }
  // filp the image vertical
  flipVertical() {
      this.transform = {
          ...this.transform,
          flipV: !this.transform.flipV
      };
  }
  // reset the image
  resetImage() {
      this.scale = 1;
      this.rotation = 0;
      this.canvasRotation = 0;
      this.transform = {};
      this.imageChangedEvent=this.data.string
  }
  // zoom out the image
  zoomOut() {
      this.scale -= .1;
      this.transform = {
          ...this.transform,
          scale: this.scale
      };
  }
  // zoom in the image
  zoomIn() {
      this.scale += .1;
      this.transform = {
          ...this.transform,
          scale: this.scale
      };
  }
  // add the aspect rion
  toggleContainWithinAspectRatio() {
      this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }
  // Update the radio button
  updateRotation(){
        this.transform = {
            ...this.transform,
            rotate: this.rotation
        };
    }
}
