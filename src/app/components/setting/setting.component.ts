import { Component, OnInit, ViewChild } from "@angular/core";
import { UserserviceService } from "../../services/userservice.service";
import { SpinnerService } from "../../services/spinner.service";
import { GeneralService } from "../../services/general.service";
import { MatSnackBar } from "@angular/material";
import { ErrorMessgae } from "../../shared/error_message/error";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
  ValidatorFn,
} from "@angular/forms";
import { DilogOpenService } from "../../services/dilog-open.service";
import { PrintsharepdfService } from "../../services/printsharepdf.service";
import { DomSanitizer } from "@angular/platform-browser";
import { AbstractService } from "../../services/comman/abstract.service";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { tr } from "date-fns/locale";
/**
 * In this Compeoent
 * all the settigs are managed of the workshop
 * save edit update and get settings
 */
@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.css"],
})
export class SettingComponent implements OnInit {
 
  vechileType: Array<any> = [
    { name: "2W", value: "2W", checked: false },
    { name: "3W", value: "3W", checked: false },
    { name: "4W", value: "4W", checked: false },
    { name: "6W", value: "6W", checked: false },
  ];
  userserviceworkshopid;
  loadclass = "tab-pane fade active in";
  tabclass = "nav-item active";
  profiledata;
  ProfileForm: FormGroup;
  JobcardForm: FormGroup;
  BillingForm: FormGroup;
  InventoryForm: FormGroup;
  UserForm: FormGroup;
  setPassForm:FormGroup;
  invoiceTypeRegularForm:FormGroup;
  invoiceTypeThermalForm:FormGroup;
  regex = /^\d+(\.\d{1,2})?$/;
  submitted = false;
  submittedform = false;
  vechileTypetoshow = Array();
  profilePhoto;
  logophoto;
  signaturephoto;
  profilePhototoshow = this.abstract.imageUrl;
  logoPhototoshow = this.abstract.imageUrl1;
  signaturePhototoshow = this.abstract.imageUrl1;
  allSettings;
  staffListtabel = Array();
  dropdownSettings: any = {};
  allowSearchFilter: boolean = true;
  editnumber: boolean = true;
  showDeleteLogo: boolean = false;
  showDeletesignature: boolean = false;
  passwordSet: boolean = false;
  displayedColumns: string[] = [
    "user_type",
    "user_name",
    "user_mobile",
    "status",
    "action",
  ];
  dashboard: any;
  setting: any;
  reports: any;
  collect_payment: any;
  appointment: any;
  online_garage: any;
  staff: any;
  feedback: any;
  counter_sale: any;
  inventory: any;
  purhase_order: any;
  jobcard: any;
  showupdateuser: boolean = false;
  allUsers = Array();

  CheckBoxOptions = [
    { name: "View", value: "view" },
    { name: "Edit", value: "edit" },
    { name: "Create", value: "create" },
    { name: "Create New", value: "create_new" },
  ];
  panelOpenState = false;
  tabClickOption: string = "Profile";
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private showspinner: SpinnerService,
    private userservice: UserserviceService,
    private generalservice: GeneralService,
    private snakBar: MatSnackBar,
    private formbuild: FormBuilder,
    private dialogService: DilogOpenService,
    public domSanitizer: DomSanitizer,
    public abstract: AbstractService,
    private head: PrintsharepdfService
  ) {
    this.userserviceworkshopid = this.userservice.getData()["workshop_id"];
    this.profileForm();
    this.jobcardForm();
    this.billingForm();
    this.inventoryForm();
    this.userForm();
    this.showOtpForm();
  }
  ngOnInit() {
    this.profiledata = JSON.parse(localStorage.getItem("user"));
    this.ProfileForm.controls["firstname"].setValue(
      this.profiledata.first_name,
      { onlySelf: true }
    );
    this.ProfileForm.controls["workshopname"].setValue(
      this.profiledata.workshop_name,
      { onlySelf: true }
    );
    this.ProfileForm.controls["rtono"].setValue(
      this.profiledata.workshop_rtocode,
      { onlySelf: true }
    );
    this.ProfileForm.controls["phonenumber"].setValue(
      this.profiledata.workshop_mobile_number_1,
      { onlySelf: true }
    );
    this.ProfileForm.controls["phonenumber"].disable();
    this.ProfileForm.controls["email"].setValue(this.profiledata.email, {
      onlySelf: true,
    });
    this.ProfileForm.controls["lastname"].setValue(this.profiledata.last_name, {
      onlySelf: true,
    });
    this.ProfileForm.controls["address"].setValue(this.profiledata.address, {
      onlySelf: true,
    });
    this.ProfileForm.controls["state"].setValue(this.profiledata.state, {
      onlySelf: true,
    });
    this.ProfileForm.controls["city"].setValue(this.profiledata.city, {
      onlySelf: true,
    });
    if (this.profiledata.workshop_mobile_number_2 != 0) {
      this.ProfileForm.controls["phonenumbertwo"].setValue(
        this.profiledata.workshop_mobile_number_2,
        { onlySelf: true }
      );
    } else {
      this.ProfileForm.controls["phonenumbertwo"].setValue("", {
        onlySelf: true,
      });
    }
    if (this.profiledata.pincode != 0) {
      this.ProfileForm.controls["zipcode"].setValue(this.profiledata.pincode, {
        onlySelf: true,
      });
    } else {
      this.ProfileForm.controls["zipcode"].setValue("", { onlySelf: true });
    }
    const checkArray: FormArray = this.ProfileForm.get(
      "vechiletypes"
    ) as FormArray;
    for (var i = 0; i < this.profiledata.workshop_type.split(",").length; i++) {
      if (this.profiledata.workshop_type.split(",")[i] === "1") {
        if (i == 0) {
          this.vechileType[0].checked = true;
          checkArray.push(new FormControl("2W"));
        } else if (i == 1) {
          this.vechileType[1].checked = true;
          checkArray.push(new FormControl("3W"));
        } else if (i == 2) {
          this.vechileType[2].checked = true;
          checkArray.push(new FormControl("4W"));
        } else if (i == 3) {
          this.vechileType[3].checked = true;
          checkArray.push(new FormControl("6W"));
        }
      }
    }
    if (this.profiledata.profile_image != "") {
      this.profilePhototoshow = this.profiledata.profile_image;
    }
    if (this.profiledata.logo != "false") {
      this.logoPhototoshow = this.profiledata.logo;
      this.showDeleteLogo = true;
    } else {
      this.showDeleteLogo = false;
    }
    if (this.profiledata.signature != "false") {
      this.signaturePhototoshow = this.profiledata.signature;
      this.showDeletesignature = true;
    } else {
      this.showDeletesignature = false;
    }
    this.generalservice
      .getJobcardSettings(this.userserviceworkshopid)
      .subscribe(
        (seetings) => {
          console.log("this.allSettings.settings_billing",seetings.jobcard_Settings);
          this.showspinner.setSpinner(true);
          if (seetings.success == true) {
            this.showspinner.setSpinner(false);
            this.allSettings = seetings.jobcard_Settings;
            if (
              JSON.parse(this.allSettings.settings_jobcard)[0][
                "jobcard_no_edited"
              ] == undefined
            ) {
              this.setJobcardData();
              this.updateJobcard(true);
            }
          } else {
            this.showspinner.setSpinner(false);
            this.snakBar.open("Message", "Issue in Settings", {
              duration: 4000,
            });
          }
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );

    this.generalservice.getStaffList(this.userserviceworkshopid).subscribe(
      (staff) => {
        console.log("staff",staff);
        this.showspinner.setSpinner(true);
        if (staff.success == true) {
          this.showspinner.setSpinner(false);
          this.staffListtabel = staff.staff;
        } else {
          this.showspinner.setSpinner(false);
        }
      },
      (err) => {
        this.showspinner.setSpinner(false);
        this.snakBar.open("Error", ErrorMessgae[0][err], {
          duration: 4000,
        });
      }
    );
    
    this.dropdownSettings = {
      singleSelection: true,
      idField: "id",
      textField: "name",
      itemsShowLimit: 6,
    };
    // this.dropdownSettings = {
    //   singleSelection: true,
    //   idField: "mobile_no_1",
    //   textField: "name",
    //   itemsShowLimit: 6,
    // };
  }
  //-----------------------------------------PROFILE OF THE USER-------------------------------------------------
  //Form Validators for Profile
  profileForm() {
    this.ProfileForm = this.formbuild.group({
      firstname: ["", Validators.required],
      workshopname: ["", Validators.required],
      rtono: [
        "",
        [Validators.required, Validators.pattern(/^[A-Za-z]{2}[0-9]{2}$/)],
      ],
      phonenumber: [
        0,
        [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],
      ],
      email: ["", [Validators.required, Validators.email]],
      zipcode: ["", Validators.pattern(/^[0-9]*$/)],
      vechiletypes: this.formbuild.array([], [Validators.required]),
      vechiletypesnotselected: [""],
      lastname: [""],
      address: [""],
      state: [""],
      city: [""],
      phonenumbertwo: [0, Validators.pattern(/^[6-9]\d{9}$/)],
    });
  }
  //Validation for the Vehicle Type Checkboxes
  onCheckboxChange(e) {
    const checkArray: FormArray = this.ProfileForm.get(
      "vechiletypes"
    ) as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  //SelectFileForlogo
  onSelectFileForLogo(event) {
    this.dialogService.OpenImageCrop(event).subscribe((cropedImage) => {
      if (cropedImage != "false") {
        var datafile = this.dataURLtoFile(cropedImage, "logo.png");
        if (datafile != undefined) {
          this.logophoto = datafile;
          if (this.profiledata.logo == " ") {
            this.UploadLogoPicture();
          } else {
            this.UploadLogoPicture();
          }
        }
      } else {
        event = undefined;
      }
    });
  }
  //Upload workshop logo
  UploadLogoPicture() {
    this.showspinner.setSpinner(true);
    this.generalservice
      .uplaodUpdateWorkshopLogo(this.userserviceworkshopid, this.logophoto)
      .subscribe(
        (uplaodPhoto) => {
          console.log("uplaodPhoto",uplaodPhoto);
          this.showspinner.setSpinner(true);
          this.snakBar.open("Message", "Uplaoding Workshop Logo", {
            duration: 4000,
          });
          if (uplaodPhoto["success"] == true) {
            this.snakBar.open(
              "Message",
              "Workshop Logo Uplaoded Successfully",
              {
                duration: 4000,
              }
            );
            this.toDataURL(uplaodPhoto["logo"], (dataUrl) => {
              this.profiledata.logo = dataUrl;
              this.showspinner.setSpinner(false);
              this.logoPhototoshow = uplaodPhoto["logo"];
              this.showDeleteLogo = true;
              console.log("this.profiledata.logo", this.profiledata.logo);
              localStorage.setItem("user", JSON.stringify(this.profiledata));
            });

            // (async function() {
            //   let profiledata=JSON.parse(localStorage.getItem('user'))
            //   let blob = await fetch(profiledata.logo).then(r => r.blob());
            //   let dataUrl = await new Promise(resolve => {
            //     let reader = new FileReader();
            //     reader.onload = () => resolve(reader.result);
            //     reader.readAsDataURL(blob);
            //   });
            //   // now do something with `dataUrl`
            //   profiledata.logo=dataUrl
            //   localStorage.setItem("user", JSON.stringify(profiledata));

            // })();
          } else {
            this.showspinner.setSpinner(false);
            this.snakBar.open(
              "Message",
              ErrorMessgae[0][uplaodPhoto["message"]],
              {
                duration: 4000,
              }
            );
          }
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  // Delete WOrkshop Logo
  deleteWorkhopLogo() {
    var question =
      "Are you Sure, Want to Remove the Workshop Logo? By Default TTN Logo Will be Updated.";
    this.dialogService
      .OpenConfirmDialog(question, true, "Delete")
      .subscribe((deleteOk) => {
        if (deleteOk == true) {
          this.generalservice
            .DeleteWorkshopLogo(this.userserviceworkshopid)
            .subscribe(
              (deletelogo) => {
                this.showspinner.setSpinner(true);
                this.snakBar.open("Message", "Deleteibg Workshop Logo", {
                  duration: 4000,
                });
                if (deletelogo["success"] == true) {
                  this.snakBar.open(
                    "Message",
                    "Workshop Logo Deleted Successfully",
                    {
                      duration: 4000,
                    }
                  );
                  this.logoPhototoshow = this.abstract.imageUrl1;
                  this.showDeleteLogo = false;
                  this.profiledata.logo = "false";
                  localStorage.setItem(
                    "user",
                    JSON.stringify(this.profiledata)
                  );
                }
                this.showspinner.setSpinner(false);
              },
              (err) => {
                this.showspinner.setSpinner(false);
                this.snakBar.open("Error", ErrorMessgae[0][err], {
                  duration: 4000,
                });
              }
            );
        }
      });
  }
  //SelectFileForSignature
  onSelectFileForSignature(event) {
    this.dialogService.OpenImageCrop(event).subscribe((cropedImage) => {
      if (cropedImage != "false") {
        var datafile = this.dataURLtoFile(cropedImage, "signature.png");
        if (datafile != undefined) {
          this.signaturephoto = datafile;
          if (this.profiledata.signature == " ") {
            this.UploadSignaturePicture();
          } else {
            this.UploadSignaturePicture();
          }
        }
      } else {
        event = undefined;
      }
    });
  }
  //Upload workshop Signature
  UploadSignaturePicture() {
    this.showspinner.setSpinner(true);
    this.generalservice
      .uplaodUpdateWorkshopSignature(
        this.userserviceworkshopid,
        this.signaturephoto
      )
      .subscribe(
        (uplaodPhoto) => {
          this.showspinner.setSpinner(true);
          this.snakBar.open("Message", "Uplaoding Workshop Signature", {
            duration: 4000,
          });
          if (uplaodPhoto["success"] == true) {
            this.snakBar.open(
              "Message",
              "Workshop Signature Uplaoded Successfully",
              {
                duration: 4000,
              }
            );
            this.toDataURL(uplaodPhoto["logo"], (dataUrl) => {
              this.profiledata.signature = dataUrl;
              this.showspinner.setSpinner(false);
              this.signaturePhototoshow = uplaodPhoto["logo"];
              this.showDeletesignature = true;
              localStorage.setItem("user", JSON.stringify(this.profiledata));
            });

            // (async function() {
            //   let profiledata=JSON.parse(localStorage.getItem('user'))
            //   let blob = await fetch(profiledata.signature).then(r => r.blob());
            //   let dataUrl = await new Promise(resolve => {
            //     let reader = new FileReader();
            //     reader.onload = () => resolve(reader.result);
            //     reader.readAsDataURL(blob);
            //   });
            //   // now do something with `dataUrl`
            //   profiledata.signature=dataUrl
            //   localStorage.setItem("user", JSON.stringify(profiledata));

            // })();
          } else {
            this.showspinner.setSpinner(false);
            this.snakBar.open(
              "Message",
              ErrorMessgae[0][uplaodPhoto["message"]],
              {
                duration: 4000,
              }
            );
          }
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  // Delete WOrkshop Signature
  deleteWorkhopSignature() {
    var question =
      "Are you Sure, Want to Remove the Workshop Signature? By Default TTN Logo Will be Updated.";
    this.dialogService
      .OpenConfirmDialog(question, true, "Delete")
      .subscribe((deleteOk) => {
        if (deleteOk == true) {
          this.generalservice
            .DeleteWorkshopSignature(this.userserviceworkshopid)
            .subscribe(
              (deletelogo) => {
                this.showspinner.setSpinner(true);
                this.snakBar.open("Message", "Deleteing Workshop Signature", {
                  duration: 4000,
                });
                if (deletelogo["success"] == true) {
                  this.snakBar.open(
                    "Message",
                    "Workshop Signature Deleted Successfully",
                    {
                      duration: 4000,
                    }
                  );
                  this.signaturePhototoshow = this.abstract.imageUrl1;
                  this.showDeletesignature = false;
                  this.profiledata.signature = "false";
                  localStorage.setItem(
                    "user",
                    JSON.stringify(this.profiledata)
                  );
                }
                this.showspinner.setSpinner(false);
              },
              (err) => {
                this.showspinner.setSpinner(false);
                this.snakBar.open("Error", ErrorMessgae[0][err], {
                  duration: 4000,
                });
              }
            );
        }
      });
  }
  //Select Profile Picture from the PC
  onSelectFile(event) {
    this.dialogService.OpenImageCrop(event).subscribe((cropedImage) => {
      if (cropedImage != "false") {
        var datafile = this.dataURLtoFile(cropedImage, "name.png");
        if (datafile != undefined) {
          this.profilePhoto = datafile;
          if (this.profiledata.profile_image == "") {
            this.UploadProfilePicture();
          } else {
            this.updateProfilePicture();
          }
        }
      } else {
        event = undefined;
      }
    });
  }
  //Upload Profile Picture
  UploadProfilePicture() {
    this.showspinner.setSpinner(true);
    this.generalservice
      .uplaodProfile(this.userserviceworkshopid, this.profilePhoto)
      .subscribe(
        (uplaodPhoto) => {
          this.showspinner.setSpinner(true);
          this.snakBar.open("Message", "Uplaoding Profile Picture", {
            duration: 4000,
          });
          if (uplaodPhoto["success"] == true) {
            this.snakBar.open(
              "Message",
              "Profile Picture Uplaoded Successfully",
              {
                duration: 4000,
              }
            );
            this.showspinner.setSpinner(false);
            this.profilePhototoshow = uplaodPhoto["profile_picture"];
            this.profiledata.profile_image = uplaodPhoto["profile_picture"];
            localStorage.setItem("user", JSON.stringify(this.profiledata));
            location.reload();
          } else {
            this.showspinner.setSpinner(false);
            this.snakBar.open(
              "Message",
              ErrorMessgae[0][uplaodPhoto["message"]],
              {
                duration: 4000,
              }
            );
          }
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  //Update Profile Picture
  updateProfilePicture() {
    this.showspinner.setSpinner(true);
    this.generalservice
      .updateProfile(this.userserviceworkshopid, this.profilePhoto)
      .subscribe(
        (uplaodPhoto) => {
          this.showspinner.setSpinner(true);
          this.snakBar.open("Message", "Uplaoding Profile Picture", {
            duration: 4000,
          });
          if (uplaodPhoto["success"] == true) {
            this.snakBar.open(
              "Message",
              "Profile Picture Updated Successfully",
              {
                duration: 4000,
              }
            );
            this.showspinner.setSpinner(false);
            this.profilePhototoshow = uplaodPhoto["profile_picture"];
            this.profiledata.profile_image = uplaodPhoto["profile_picture"];
            localStorage.setItem("user", JSON.stringify(this.profiledata));
            location.reload();
          } else {
            this.showspinner.setSpinner(false);
            this.snakBar.open(
              "Message",
              ErrorMessgae[0][uplaodPhoto["message"]],
              {
                duration: 4000,
              }
            );
          }
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  //Update Profile of the user
  updateProfile() {
    this.submitted = true;
    if (this.ProfileForm.invalid) {
      return;
    } else {
      var pincode;
      var phonetwo;
      var typesvehicle = ["0", "0", "0", "0"];
      if (this.ProfileForm.getRawValue().phonenumbertwo == "") {
        phonetwo = 0;
      } else {
        phonetwo = parseInt(this.ProfileForm.getRawValue().phonenumbertwo);
      }

      if (this.ProfileForm.getRawValue().zipcode == "") {
        pincode = 0;
      } else {
        pincode = parseInt(this.ProfileForm.getRawValue().zipcode);
      }

      this.ProfileForm.getRawValue().vechiletypes.map((type) => {
        if (typesvehicle[0] == "0") {
          if (type == "2W") {
            typesvehicle[0] = "1";
          } else {
            typesvehicle[0] = "0";
          }
        }
        if (typesvehicle[1] == "0") {
          if (type == "3W") {
            typesvehicle[1] = "1";
          } else {
            typesvehicle[1] = "0";
          }
        }
        if (typesvehicle[2] == "0") {
          if (type == "4W") {
            typesvehicle[2] = "1";
          } else {
            typesvehicle[2] = "0";
          }
        }
        if (typesvehicle[3] == "0") {
          if (type == "6W") {
            typesvehicle[3] = "1";
          } else {
            typesvehicle[3] = "0";
          }
        }
      });
      this.generalservice
        .updateWorkshopProfile(
          this.userserviceworkshopid,
          this.ProfileForm.getRawValue().workshopname,
          phonetwo,
          this.ProfileForm.getRawValue().lastname,
          this.ProfileForm.getRawValue().firstname,
          this.ProfileForm.getRawValue().email,
          this.ProfileForm.getRawValue().state,
          this.ProfileForm.getRawValue().city,
          pincode,
          this.ProfileForm.getRawValue().rtono,
          typesvehicle.toString(),
          this.ProfileForm.getRawValue().address
        )
        .subscribe(
          (updateddata) => {
            this.showspinner.setSpinner(true);
            if (updateddata["success"] == true) {
              this.showspinner.setSpinner(false);
              this.snakBar.open(
                "Message",
                ErrorMessgae[0][updateddata["message"]],
                {
                  duration: 4000,
                }
              );
              this.profiledata.email = this.ProfileForm.getRawValue().email;
              this.profiledata.name =
                this.ProfileForm.getRawValue().firstname +
                " " +
                this.ProfileForm.getRawValue().lastname;
              this.profiledata.first_name =
                this.ProfileForm.getRawValue().firstname;
              this.profiledata.last_name =
                this.ProfileForm.getRawValue().lastname;
              this.profiledata.address = this.ProfileForm.getRawValue().address;
              this.profiledata.city = this.ProfileForm.getRawValue().city;
              this.profiledata.state = this.ProfileForm.getRawValue().state;
              this.profiledata.pincode = pincode;
              this.profiledata.workshop_mobile_number_2 = phonetwo;
              this.profiledata.workshop_rtocode =
                this.ProfileForm.getRawValue().rtono;
              this.profiledata.workshop_type = typesvehicle.toString();
              this.profiledata.workshop_name =
                this.ProfileForm.getRawValue().workshopname;
              localStorage.setItem("user", JSON.stringify(this.profiledata));
            } else {
              this.showspinner.setSpinner(false);
              this.snakBar.open(
                "Message",
                ErrorMessgae[0][updateddata["message"]],
                {
                  duration: 4000,
                }
              );
            }
          },
          (err) => {
            this.showspinner.setSpinner(false);
            this.snakBar.open("Error", ErrorMessgae[0][err], {
              duration: 4000,
            });
          }
        );
    }
  }
  //Edit phone Number
  editPhonenumber() {
    this.editnumber = false;
    this.ProfileForm.controls["phonenumber"].enable();
  }
  //Verify Number
  verifynumber() {
    this.generalservice
      .getOtpForRegister(this.ProfileForm.getRawValue().phonenumber)
      .subscribe(
        (numbersend) => {
          this.showspinner.setSpinner(true);
          if (numbersend["success"] == true) {
            this.showspinner.setSpinner(true);
            this.dialogService
              .OpenVerifyNumber(
                this.ProfileForm.getRawValue().phonenumber,
                "update"
              )
              .subscribe((verify) => {
                if (verify == true) {
                  this.showspinner.setSpinner(false);
                  this.snakBar.open("Message", "Number Updated Successfully", {
                    duration: 4000,
                  });
                  this.editnumber = true;
                  this.ProfileForm.controls["phonenumber"].disable();
                  this.profiledata.workshop_mobile_number_1 =
                    this.ProfileForm.getRawValue().phonenumber;
                  localStorage.setItem(
                    "user",
                    JSON.stringify(this.profiledata)
                  );
                } else {
                  this.showspinner.setSpinner(false);
                  this.snakBar.open("Message", "Number Not Updated", {
                    duration: 4000,
                  });
                }
              });
          } else {
            this.showspinner.setSpinner(false);
            this.snakBar.open(
              "Message",
              ErrorMessgae[0][numbersend["message"]],
              {
                duration: 4000,
              }
            );
          }
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  //File Convert from dataurl
  dataURLtoFile(dataurl, filename) {
    console.log("dataurl", dataurl);
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    console.log("arr", arr);
    console.log("bstrbstr", bstr);
    console.log("mime", mime);
    console.log("u8arr", u8arr);
    return new File([u8arr], filename, { type: mime });
  }
  toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      console.log("reader.result", reader.result);
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }
  //-----------------------------------------END PROFILE------------------------------------------------------
  //-----------------------------------------JOBCARD SETTINGS-------------------------------------------------
  //Form Validators for Jobcard
  jobcardForm() {
    this.JobcardForm = this.formbuild.group({
      engine_chassis_number: [0],
      vehicle_color: [0],
      customer_mobile_number: [0],
      customer_email: [0],
      customer_birthday: [0],
      customer_pickup_address: [0],
      customer_delivery_address: [0],
      driver_details: [0],
      jobwise_mechanic: [1],
      customer_signature: [0],
      custom_jobcard_number: [1],
      item_wise_discount: [0],
      jobcard_no_series: [0],
      jobcard_no_series_count: [""],
      default_mechanic: [null],
    });
  }
  //Set Jobcard Data
  setvalueof_edited: boolean;
  storeVlaueOfJobcardNumber: any;
  setJobcardData() {
    
    var JobcardSetting;
    if (typeof this.allSettings.settings_jobcard == "string") {
      JobcardSetting = JSON.parse(this.allSettings.settings_jobcard)[0];
      console.log("this.allSettings.settings_jobcard",JobcardSetting);
      if (
        JSON.parse(this.allSettings.settings_jobcard)[0]["jobcard_no_edited"] !=
        undefined
      ) {
        console.log("this.setvalueof_edited",this.setvalueof_edited);
        this.setvalueof_edited = JSON.parse(
          this.allSettings.settings_jobcard
        )[0]["jobcard_no_edited"];
      }
    } else {
      JobcardSetting = this.allSettings.settings_jobcard;
      console.log("this.allSettings.settings_jobcard 1",JobcardSetting);
      if (this.allSettings.settings_jobcard["jobcard_no_edited"] != undefined) {
        this.setvalueof_edited =
          this.allSettings.settings_jobcard["jobcard_no_edited"];
      }else{
        this.setvalueof_edited = false
      }
    }
   
    this.JobcardForm.value.engine_chassis_number =
      JobcardSetting.engine_chassis_number;
    this.JobcardForm.controls["engine_chassis_number"].setValue(
      JobcardSetting.engine_chassis_number,
      { onlySelf: true }
    );
    this.JobcardForm.value.vehicle_color = JobcardSetting.vehicle_color;
    this.JobcardForm.controls["vehicle_color"].setValue(
      JobcardSetting.vehicle_color,
      { onlySelf: true }
    );
    this.JobcardForm.value.customer_mobile_number =
      JobcardSetting.customer_mobile_number;
    this.JobcardForm.controls["customer_mobile_number"].setValue(
      JobcardSetting.customer_mobile_number,
      { onlySelf: true }
    );
    this.JobcardForm.value.customer_email = JobcardSetting.customer_email;
    this.JobcardForm.controls["customer_email"].setValue(
      JobcardSetting.customer_email,
      { onlySelf: true }
    );
    this.JobcardForm.value.customer_birthday = JobcardSetting.customer_birthday;
    this.JobcardForm.controls["customer_birthday"].setValue(
      JobcardSetting.customer_birthday,
      { onlySelf: true }
    );
    this.JobcardForm.value.customer_pickup_address =
      JobcardSetting.customer_pickup_address;
    this.JobcardForm.controls["customer_pickup_address"].setValue(
      JobcardSetting.customer_pickup_address,
      { onlySelf: true }
    );
    this.JobcardForm.value.customer_delivery_address =
      JobcardSetting.customer_delivery_address;
    this.JobcardForm.controls["customer_delivery_address"].setValue(
      JobcardSetting.customer_delivery_address,
      { onlySelf: true }
    );
    this.JobcardForm.value.jobwise_mechanic = JobcardSetting.jobwise_mechanic;
    this.JobcardForm.controls["jobwise_mechanic"].setValue(
      JobcardSetting.jobwise_mechanic,
      { onlySelf: true }
    );
    this.JobcardForm.value.customer_signature =
      JobcardSetting.customer_signature;
    this.JobcardForm.controls["customer_signature"].setValue(
      JobcardSetting.customer_signature,
      { onlySelf: true }
    );
    this.JobcardForm.value.driver_details = JobcardSetting.driver_details;
    this.JobcardForm.controls["driver_details"].setValue(
      JobcardSetting.driver_details,
      { onlySelf: true }
    );
    this.JobcardForm.value.custom_jobcard_number =
      JobcardSetting.custom_jobcard_number;
    this.JobcardForm.controls["custom_jobcard_number"].setValue(
      JobcardSetting.custom_jobcard_number,
      { onlySelf: true }
    );
    this.JobcardForm.value.item_wise_discount =
      JobcardSetting.item_wise_discount;
    this.JobcardForm.controls["item_wise_discount"].setValue(
      JobcardSetting.item_wise_discount,
      { onlySelf: true }
    );
    this.JobcardForm.value.jobcard_no_series = JobcardSetting.jobcard_no_series;
    this.JobcardForm.controls["jobcard_no_series"].setValue(
      JobcardSetting.jobcard_no_series,
      { onlySelf: true }
    );
    this.storeVlaueOfJobcardNumber = JobcardSetting.jobcard_no_series_count;
    this.JobcardForm.controls["jobcard_no_series_count"].setValue(
      JobcardSetting.jobcard_no_series_count,
      { onlySelf: true }
    );
    var default_mechanic = []
    console.log("default_mechanic 1",JobcardSetting.default_mechanic[0]);
    if(JobcardSetting.default_mechanic[0] != undefined){
      this.JobcardForm.controls["default_mechanic"].setValue(
        JobcardSetting.default_mechanic,
        { onlySelf: true }
      );
    }else{
      var id = JobcardSetting.default_mechanic;
      var idData = this.staffListtabel.filter(function(item) {  
        return item.id == id 
      });
 
      default_mechanic.push({"id":idData[0].id, "name":idData[0].name});
      console.log("default_mechanic",default_mechanic);
      this.JobcardForm.controls["default_mechanic"].setValue(
        default_mechanic,
        { onlySelf: true }
      );
    }
    if (this.setvalueof_edited == true) {
      this.JobcardForm.controls["jobcard_no_series_count"].disable();
    } else {
      this.JobcardForm.controls["jobcard_no_series_count"].enable();
    }
  }
  // Update Jobacrd Settings
  updateJobcard(fromintit) {
    var number_edited: boolean;
    if (fromintit == true) {
      var number_edited = false;
    }
    var chassis;
    var color;
    var mobileno;
    var email;
    var birthday;
    var pickup;
    var delivery;
    var jobwisemec;
    var signature;
    var details;
    var jobcardno;
    var discount;
    var jobcardseries;
    var seriescount;
    var defaultmec;
    var default_mechanic;
    if (this.JobcardForm.getRawValue().engine_chassis_number == true) {
      chassis = 1;
    } else if (this.JobcardForm.getRawValue().engine_chassis_number == false) {
      chassis = 0;
    } else {
      chassis = this.JobcardForm.getRawValue().engine_chassis_number;
    }
    if (this.JobcardForm.getRawValue().vehicle_color == true) {
      color = 1;
    } else if (this.JobcardForm.getRawValue().vehicle_color == false) {
      color = 0;
    } else {
      color = this.JobcardForm.getRawValue().vehicle_color;
    }
    if (this.JobcardForm.getRawValue().customer_mobile_number == true) {
      mobileno = 1;
    } else if (this.JobcardForm.getRawValue().customer_mobile_number == false) {
      mobileno = 0;
    } else {
      mobileno = this.JobcardForm.getRawValue().customer_mobile_number;
    }
    if (this.JobcardForm.getRawValue().customer_email == true) {
      email = 1;
    } else if (this.JobcardForm.getRawValue().customer_email == false) {
      email = 0;
    } else {
      email = this.JobcardForm.getRawValue().customer_email;
    }
    if (this.JobcardForm.getRawValue().customer_birthday == true) {
      birthday = 1;
    } else if (this.JobcardForm.getRawValue().customer_birthday == false) {
      birthday = 0;
    } else {
      birthday = this.JobcardForm.getRawValue().customer_birthday;
    }
    if (this.JobcardForm.getRawValue().customer_pickup_address == true) {
      pickup = 1;
    } else if (
      this.JobcardForm.getRawValue().customer_pickup_address == false
    ) {
      pickup = 0;
    } else {
      pickup = this.JobcardForm.getRawValue().customer_pickup_address;
    }
    if (this.JobcardForm.getRawValue().customer_delivery_address == true) {
      delivery = 1;
    } else if (
      this.JobcardForm.getRawValue().customer_delivery_address == false
    ) {
      delivery = 0;
    } else {
      delivery = this.JobcardForm.getRawValue().customer_delivery_address;
    }
    if (this.JobcardForm.getRawValue().jobwise_mechanic == true) {
      jobwisemec = 1;
    } else if (this.JobcardForm.getRawValue().jobwise_mechanic == false) {
      jobwisemec = 0;
    } else {
      jobwisemec = this.JobcardForm.getRawValue().jobwise_mechanic;
    }
    if (this.JobcardForm.getRawValue().customer_signature == true) {
      signature = 1;
    } else if (this.JobcardForm.getRawValue().customer_signature == false) {
      signature = 0;
    } else {
      signature = this.JobcardForm.getRawValue().customer_signature;
    }
    if (this.JobcardForm.getRawValue().driver_details == true) {
      details = 1;
    } else if (this.JobcardForm.getRawValue().driver_details == false) {
      details = 0;
    } else {
      details = this.JobcardForm.getRawValue().driver_details;
    }
    if (this.JobcardForm.getRawValue().custom_jobcard_number == true) {
      jobcardno = 1;
    } else if (this.JobcardForm.getRawValue().custom_jobcard_number == false) {
      jobcardno = 0;
    } else {
      jobcardno = this.JobcardForm.getRawValue().custom_jobcard_number;
    }
    if (this.JobcardForm.getRawValue().item_wise_discount == true) {
      discount = 1;
    } else if (this.JobcardForm.getRawValue().item_wise_discount == false) {
      discount = 0;
    } else {
      discount = this.JobcardForm.getRawValue().item_wise_discount;
    }
    if (this.JobcardForm.getRawValue().jobcard_no_series == true) {
      jobcardseries = 1;
    } else if (this.JobcardForm.getRawValue().jobcard_no_series == false) {
      jobcardseries = 0;
    } else {
      jobcardseries = this.JobcardForm.getRawValue().jobcard_no_series;
    }
    if (fromintit == false) {
      if (
        this.JobcardForm.getRawValue().jobcard_no_series_count !=
        this.storeVlaueOfJobcardNumber
      ) {
        if (this.setvalueof_edited == false) {
          number_edited = true;
          this.setvalueof_edited = true;
        } else {
          number_edited = this.setvalueof_edited;
        }
      } else {
        number_edited = this.setvalueof_edited;
      }
    }
    if(this.JobcardForm.getRawValue().default_mechanic[0] != undefined){
      default_mechanic = this.JobcardForm.getRawValue().default_mechanic[0].id
    }else{
      default_mechanic = this.JobcardForm.getRawValue().default_mechanic
    }

    console.log("this.JobcardForm.getRawValue()",this.JobcardForm.getRawValue().default_mechanic[0].id);
    this.generalservice
      .updateJobcardSettings(
        this.userserviceworkshopid,
        chassis,
        color,
        mobileno,
        email,
        birthday,
        pickup,
        delivery,
        details,
        jobwisemec,
        signature,
        jobcardno,
        discount,
        jobcardseries,
        this.JobcardForm.getRawValue().jobcard_no_series_count,
        default_mechanic,
        number_edited
      )
      .subscribe(
        (updateJobcard) => {
          console.log(updateJobcard);
          this.showspinner.setSpinner(true);
          this.showspinner.setSpinner(false);
          this.snakBar.open(
            "Message",
            ErrorMessgae[0][updateJobcard["message"]],
            {
              duration: 4000,
            }
          );
          if (updateJobcard["success"] == true) {
            this.allSettings.settings_jobcard = this.JobcardForm.getRawValue();
            this.JobcardForm.controls["jobcard_no_series_count"].disable();
            if (fromintit == true) {
              this.allSettings.settings_jobcard["jobcard_no_edited"] = false;
            }
          }
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }
  //Check the Jobcard Number toggle
  checkCustomerJobcardNumber(event) {
    if (event == true && this.setvalueof_edited == false) {
      var questionForDialog = "Jobcard Series Count is only one time editabel";
      this.dialogService
        .OpenConfirmDialog(questionForDialog, false, "OK")
        .subscribe((data) => {
          console.log(data);
        });
    }
  }
  //-----------------------------------------END JOBCARD------------------------------------------------------
  //-----------------------------------------BILLING SETTINGS-------------------------------------------------
  //Change Password Field
  eye: boolean = false;
  changePasswordField() {
    if (this.eye == false) {
      this.eye = true;
    } else {
      this.eye = false;
    }
  }
  //Form Validators for Billing
  reportFontload=["default","Andale Mono","Arial","Arial Black","Bitstream Charter","Century Schoolbook L","Comic Sans MS","Courier 10 Pitch","Courier New","DejaVu Sans"];
  billingForm() {
    this.BillingForm = this.formbuild.group({
      default_running_km: [null],
      default_reminder_period: [null],
      bill_format: [null],
      partial_gst: [0],
      complete_gst: [0],
      gst_number: [
        "",
        Validators.pattern(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
        ),
      ],
      bill_header: [""],
      tag_line: [""],
      bill_footer: [""],
      terms_and_conditions: [""],
      invoice_type_regular:[],
      invoice_type_thermal:[]

    });
    this.invoiceTypeRegularForm = this.formbuild.group({
      invoice_pagesize:[],
      invoice_textcolor:[],
      invoice_textsize:[],
      invoice_textstyle:[],
      invoice_theme:['0', Validators.required],
      is_company_logo:[],
      is_customer_voice:[],
      is_qrcode:[],
      is_tagline:[],
      is_tax_details:[],
      is_terms_conditions:[],
      tag_line:[],
      company_name_textColor:[],
      company_name_textSize:[],
      company_name_textStyle:[]
    });
    this.invoiceTypeThermalForm = this.formbuild.group({
      invoice_pagesize:[],
      invoice_textsize:[],
      invoice_textstyle:[],
      invoice_theme:['0', Validators.required],
      is_customer_voice:[],
      is_qrcode:[],
      is_tagline:[],
      is_tax_details:[],
      is_terms_conditions:[],
      tag_line:[],
      company_name_textSize:[],
      company_name_textStyle:[]
    });
    
  }
  //Set Billing Data
  setBillingData() {
    console.log("this.allSettings",this.allSettings)
    var InventorySetting;
    if (typeof this.allSettings.settings_billing == "string") {
      InventorySetting = JSON.parse(this.allSettings.settings_billing)[0];
      console.log("InventorySetting",InventorySetting);
    } else {
      InventorySetting = this.allSettings.settings_billing;
    }
    this.BillingForm.value.partial_gst = InventorySetting.partial_gst;
    this.BillingForm.controls["partial_gst"].setValue(
      InventorySetting.partial_gst,
      { onlySelf: true }
    );
    this.BillingForm.value.complete_gst = InventorySetting.complete_gst;
    this.BillingForm.controls["complete_gst"].setValue(
      InventorySetting.complete_gst,
      { onlySelf: true }
    );

    this.BillingForm.value.default_reminder_period =
      InventorySetting.default_reminder_period;
    this.BillingForm.controls["default_reminder_period"].setValue(
      InventorySetting.default_reminder_period,
      { onlySelf: true }
    );
    this.BillingForm.value.default_running_km =
      InventorySetting.default_running_km;
    this.BillingForm.controls["default_running_km"].setValue(
      InventorySetting.default_running_km,
      { onlySelf: true }
    );

    this.BillingForm.value.bill_format = InventorySetting.bill_format;
    this.BillingForm.controls["bill_format"].setValue(
      InventorySetting.bill_format,
      { onlySelf: true }
    );
    if (InventorySetting.gst_number == "") {
      if (InventorySetting.duplaicategst) {
        this.BillingForm.value.gst_number = InventorySetting.duplaicategst;
        this.BillingForm.controls["gst_number"].setValue(
          InventorySetting.duplaicategst,
          { onlySelf: true }
        );
      } else {
        this.BillingForm.value.gst_number = InventorySetting.gst_number;
        this.BillingForm.controls["gst_number"].setValue(
          InventorySetting.gst_number,
          { onlySelf: true }
        );
      }
    } else {
      this.BillingForm.value.gst_number = InventorySetting.gst_number;
      this.BillingForm.controls["gst_number"].setValue(
        InventorySetting.gst_number,
        { onlySelf: true }
      );
    }
    this.BillingForm.value.bill_header = InventorySetting.bill_header[0];
    this.BillingForm.controls["bill_header"].setValue(
      InventorySetting.bill_header[0],
      { onlySelf: true }
    );
    this.BillingForm.value.tag_line = InventorySetting.tag_line;
    this.BillingForm.controls["tag_line"].setValue(InventorySetting.tag_line, {
      onlySelf: true,
    });

    this.BillingForm.value.bill_footer = InventorySetting.bill_footer[0];
    this.BillingForm.controls["bill_footer"].setValue(
      InventorySetting.bill_footer[0],
      { onlySelf: true }
    );
    this.BillingForm.value.terms_and_conditions =
      InventorySetting.terms_and_conditions;
    this.BillingForm.controls["terms_and_conditions"].setValue(
      InventorySetting.terms_and_conditions,
      { onlySelf: true }
    );
    if (
      this.BillingForm.getRawValue().gst_number == "" &&
      (this.BillingForm.getRawValue().complete_gst == 1 ||
        this.BillingForm.getRawValue().partial_gst == 1)
    ) {
      this.gstNumberRequired = true;
    } else {
      this.gstNumberRequired = false;
    }
  }
  // Update Billing Settings
  gstNumberRequired: boolean = false;
  updateBilling() {
    if (
      this.BillingForm.getRawValue().gst_number == "" &&
      (this.BillingForm.getRawValue().complete_gst == 1 ||
        this.BillingForm.getRawValue().partial_gst == 1)
    ) {
      this.gstNumberRequired = true;
    } else {
      this.gstNumberRequired = false;
      var pargst;
      var comgst;
      var gst_number;
      var duplaicategst;
      var header = Array();
      var fotter = Array();
      var invoice_type_regular;
      var invoice_type_thermal; 

      if (this.BillingForm.getRawValue().partial_gst == true) {
        pargst = 1;
      } else if (this.BillingForm.getRawValue().partial_gst == false) {
        pargst = 0;
      } else {
        pargst = this.BillingForm.getRawValue().partial_gst;
      }
      if (this.BillingForm.getRawValue().complete_gst == true) {
        comgst = 1;
      } else if (this.BillingForm.getRawValue().complete_gst == false) {
        comgst = 0;
      } else {
        comgst = this.BillingForm.getRawValue().complete_gst;
      }
      if (this.BillingForm.getRawValue().bill_header == undefined) {
        header = [];
      } else {
        header.push(this.BillingForm.getRawValue().bill_header);
      }
      if (this.BillingForm.getRawValue().bill_footer == undefined) {
        fotter = [];
      } else {
        fotter.push(this.BillingForm.getRawValue().bill_footer);
      }
      if (comgst == 1 || pargst == 1) {
        gst_number = this.BillingForm.getRawValue().gst_number;
      } else {
        gst_number = "";
      }
      duplaicategst = this.BillingForm.getRawValue().gst_number;

      invoice_type_regular = this.getInvoiceTypeRegularData();
      invoice_type_thermal = this.getInvoiceTypeThermalData();

      console.log("invoice_type_regular",invoice_type_regular);
      console.log("invoice_type_thermal",invoice_type_thermal);
      this.generalservice
        .updateBillingSettings(
          this.userserviceworkshopid,
          this.BillingForm.getRawValue().default_reminder_period,
          this.BillingForm.getRawValue().default_running_km,
          this.BillingForm.getRawValue().bill_format,
          pargst,
          comgst,
          gst_number,
          header,
          this.BillingForm.getRawValue().tag_line,
          fotter,
          this.BillingForm.getRawValue().terms_and_conditions,
          duplaicategst,
          invoice_type_regular,
          invoice_type_thermal
        ).subscribe(
          (updateJobcard) => {
            console.log("updateJobcard",updateJobcard);
            this.showspinner.setSpinner(true);
            this.showspinner.setSpinner(false);
            this.snakBar.open(
              "Message",
              ErrorMessgae[0][updateJobcard["message"]],
              {
                duration: 4000,
              });
            if (updateJobcard["success"] == true) {
              this.allSettings.settings_billing =
                this.BillingForm.getRawValue();
            }
          },
          (err) => {
            this.showspinner.setSpinner(false);
            this.snakBar.open("Error", ErrorMessgae[0][err], {
              duration: 4000,
            });
          }
        );
    }
  }
  //Chnage in partialGst
  partialGst(event) {
    if (event == true) {
      if (this.BillingForm.getRawValue().complete_gst == 1) {
        this.BillingForm.value.complete_gst = 0;
        this.BillingForm.controls["complete_gst"].setValue(0, {
          onlySelf: true,
        });
      }
      if (this.BillingForm.getRawValue().gst_number == "") {
        this.gstNumberRequired = true;
      } else {
        this.gstNumberRequired = false;
      }
    }
  }
  //Chnage in completeGst
  completeGst(event) {
    if (event == true) {
      if (this.BillingForm.getRawValue().partial_gst == 1) {
        this.BillingForm.value.partial_gst = 0;
        this.BillingForm.controls["partial_gst"].setValue(0, {
          onlySelf: true,
        });
      }
      if (this.BillingForm.getRawValue().gst_number == "") {
        this.gstNumberRequired = true;
      } else {
        this.gstNumberRequired = false;
      }
    }
  }
  //On input filed Chnage
  gstNoChange(event) {
    if (event == "") {
      this.gstNumberRequired = true;
    } else {
      this.gstNumberRequired = false;
    }
  }
  //-----------------------------------------END BILLING------------------------------------------------------
  //-----------------------------------------INVENTORY SETTING-------------------------------------------------
  //Form Validators for Inventory
  inventoryForm() {
    this.InventoryForm = this.formbuild.group({
      bill_details: [0],
      purchase_order_details: [0],
      lower_limit: [0],
      account: [0],
      negative_inventory: [0],
    });
  }
  //Set Inventory Data
  setInventoryData() {
    var InventorySetting;
    if (typeof this.allSettings.settings_inventory == "string") {
      InventorySetting = JSON.parse(this.allSettings.settings_inventory)[0];
    } else {
      InventorySetting = this.allSettings.settings_inventory;
    }
    this.InventoryForm.value.bill_details = InventorySetting.bill_details;
    this.InventoryForm.controls["bill_details"].setValue(
      InventorySetting.bill_details,
      { onlySelf: true }
    );
    this.InventoryForm.value.purchase_order_details =
      InventorySetting.purchase_order_details;
    this.InventoryForm.controls["purchase_order_details"].setValue(
      InventorySetting.purchase_order_details,
      { onlySelf: true }
    );
    this.InventoryForm.value.lower_limit = InventorySetting.lower_limit;
    this.InventoryForm.controls["lower_limit"].setValue(
      InventorySetting.lower_limit,
      { onlySelf: true }
    );
    this.InventoryForm.value.account = InventorySetting.account;
    this.InventoryForm.controls["account"].setValue(InventorySetting.account, {
      onlySelf: true,
    });
    this.InventoryForm.value.negative_inventory =
      InventorySetting.negative_inventory;
    this.InventoryForm.controls["negative_inventory"].setValue(
      InventorySetting.negative_inventory,
      { onlySelf: true }
    );
  }
  // Update Inventory Settings
  updateInventory() {
    var details;
    var order;
    var limit;
    var account;
    var negative;
    if (this.InventoryForm.getRawValue().bill_details == true) {
      details = 1;
    } else if (this.InventoryForm.getRawValue().bill_details == false) {
      details = 0;
    } else {
      details = this.InventoryForm.getRawValue().bill_details;
    }
    if (this.InventoryForm.getRawValue().purchase_order_details == true) {
      order = 1;
    } else if (
      this.InventoryForm.getRawValue().purchase_order_details == false
    ) {
      order = 0;
    } else {
      order = this.InventoryForm.getRawValue().purchase_order_details;
    }
    if (this.InventoryForm.getRawValue().lower_limit == true) {
      limit = 1;
    } else if (this.InventoryForm.getRawValue().lower_limit == false) {
      limit = 0;
    } else {
      limit = this.InventoryForm.getRawValue().lower_limit;
    }
    if (this.InventoryForm.getRawValue().account == true) {
      account = 1;
    } else if (this.InventoryForm.getRawValue().account == false) {
      account = 0;
    } else {
      account = this.InventoryForm.getRawValue().account;
    }
    if (this.InventoryForm.getRawValue().negative_inventory == true) {
      negative = 1;
    } else if (this.InventoryForm.getRawValue().negative_inventory == false) {
      negative = 0;
    } else {
      negative = this.InventoryForm.getRawValue().negative_inventory;
    }
    this.generalservice
      .updateInventorySettings(
        this.userserviceworkshopid,
        details,
        order,
        limit,
        account,
        negative
      )
      .subscribe(
        (updateJobcard) => {
          this.showspinner.setSpinner(true);
          this.showspinner.setSpinner(false);
          this.snakBar.open(
            "Message",
            ErrorMessgae[0][updateJobcard["message"]],
            {
              duration: 4000,
            }
          );
          if (updateJobcard["success"] == true) {
            this.allSettings.settings_inventory =
              this.InventoryForm.getRawValue();
          }
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }

  //-----------------------------------------END INVENTORY------------------------------------------------------
  //-----------------------------------------USER SETTINGS-------------------------------------------------
  //Form Validators for User
  userForm() {
    this.UserForm = this.formbuild.group({
      user_type: [null],
      user_name: ["", Validators.required],
      user_mobile_number: [
        "",
        [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],
      ],
      password: ["", [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      dashboard: [false],
      setting: [false],
      reports: [false],
      collect_payment: [false],
      appointment: [false],
      online_garage: [false],
      staff: [false],
      feedback: [false],
      counter_sale: [false],
      inventory: [false],
      purchase_order: [false],
      jobcard: [false],
      jobcardOptions: new FormArray([], this.minSelectedCheckboxes(1)),
      inventoryOptions: new FormArray([], this.minSelectedCheckboxes(1)),
      counter_saleOptions: new FormArray([], this.minSelectedCheckboxes(1)),
      purchase_orderOptions: new FormArray([], this.minSelectedCheckboxes(1)),
      is_active: [true],
      is_delete: [false],
    });
  }

  minSelectedCheckboxes(min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        // get a list of checkbox values (boolean)
        .map((control) => control.value)
        // total up the number of checked checkboxes
        .reduce((prev, next) => (next ? prev + next : prev), 0);

      // if the total is not greater than the minimum, return the error message
      return totalSelected >= min ? null : Validators.required;
    };

    return validator;
  }
  //Tabel Data of Users
  getAllUsers() {
    // this.allUsers = JSON.parse(this.allSettings.settings_user_add);
    this.showspinner.setSpinner(true);
    this.generalservice.getWorkshopUsers(this.userserviceworkshopid).subscribe(
      (res) => {
        console.log("res users", res);
        this.showspinner.setSpinner(false);
        if (res.success) {
          this.allUsers = res.data;
          this.dataSource = new MatTableDataSource(this.allUsers);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        } else {
          this.snakBar.open("user data not found", "", {
            duration: 4000,
          });
        }
      },
      (err) => {
        this.showspinner.setSpinner(false);
        this.snakBar.open("Error", ErrorMessgae[0][err], {
          duration: 4000,
        });
      }
    );
  }
  //Update USer Details
  updateUserDetails(userData, index) {
    console.log("userData", userData);
    this.showupdateuser = true;
    this.UserForm.value.user_type = userData.user_role;
    this.UserForm.controls["user_type"].setValue(userData.user_role, {
      onlySelf: true,
    });
    this.UserForm.value.user_name = userData.user_name;
    this.UserForm.controls["user_name"].setValue(userData.user_name, {
      onlySelf: true,
    });
    this.UserForm.value.user_mobile_number = userData.user_mobile_number;
    this.UserForm.controls["user_mobile_number"].setValue(
      userData.user_mobile_number,
      { onlySelf: true }
    );

    if (userData.inventory != "0" && userData.inventory != null) {
      this.UserForm.value.inventory = true;
      this.UserForm.controls["inventory"].setValue(true, {
        onlySelf: true,
      });
      const formArray: FormArray = this.UserForm.get(
        "inventoryOptions"
      ) as FormArray;
      // this.clareForm(formArray);
      formArray.clear();
      Object.keys(JSON.parse(userData.inventory)).forEach((element) => {
        formArray.push(new FormControl(element));
      });
    } else {
      this.UserForm.value.inventory = false;
      this.UserForm.controls["inventory"].setValue(false, {
        onlySelf: true,
      });
    }
    if (userData.jobcards != "0" && userData.jobcards != null) {
      this.UserForm.value.jobcard = true;
      this.UserForm.controls["jobcard"].setValue(true, {
        onlySelf: true,
      });
      const formArray: FormArray = this.UserForm.get(
        "jobcardOptions"
      ) as FormArray;
      // this.clareForm(formArray);
      formArray.clear();
      Object.keys(JSON.parse(userData.jobcards)).forEach((element) => {
        formArray.push(new FormControl(element));
      });
    } else {
      this.UserForm.value.jobcard = false;
      this.UserForm.controls["jobcard"].setValue(false, {
        onlySelf: true,
      });
    }
    if (userData.countersale != "0" && userData.countersale != null) {
      this.UserForm.value.counter_sale = true;
      this.UserForm.controls["counter_sale"].setValue(true, {
        onlySelf: true,
      });
      // this.UserForm.value.counter_saleOptions = [];
      const formArray: FormArray = this.UserForm.get(
        "counter_saleOptions"
      ) as FormArray;
      // this.clareForm(formArray);
      formArray.clear();
      Object.keys(JSON.parse(userData.countersale)).forEach((element) => {
        formArray.push(new FormControl(element));
      });
    } else {
      this.UserForm.value.counter_sale = false;
      this.UserForm.controls["counter_sale"].setValue(false, {
        onlySelf: true,
      });
    }
    if (userData.purchaseorder != "0" && userData.purchaseorder != null) {
      this.UserForm.value.purchase_order = true;
      this.UserForm.controls["purchase_order"].setValue(true, {
        onlySelf: true,
      });
      // this.UserForm.value.purchase_orderOptions = [];
      const formArray: FormArray = this.UserForm.get(
        "purchase_orderOptions"
      ) as FormArray;
      formArray.clear();
      Object.keys(JSON.parse(userData.purchaseorder)).forEach((element) => {
        formArray.push(new FormControl(element));
      });
    } else {
      this.UserForm.value.purchase_order = false;
      this.UserForm.controls["purchase_order"].setValue(false, {
        onlySelf: true,
      });
    }

    if (userData.dashboard != "0" && userData.dashboard != null) {
      this.UserForm.value.dashboard = true;
    } else {
      this.UserForm.value.dashboard = false;
    }
    if (userData.settings != "0" && userData.settings != null) {
      this.UserForm.value.setting = true;
    } else {
      this.UserForm.value.setting = false;
    }
    if (userData.reports != "0" && userData.reports != null) {
      this.UserForm.value.reports = true;
    } else {
      this.UserForm.value.reports = false;
    }
    if (userData.collect != "0" && userData.collect != null) {
      this.UserForm.value.collect_payment = true;
    } else {
      this.UserForm.value.collect_payment = false;
    }
    if (userData.appointment != "0" && userData.appointment != null) {
      this.UserForm.value.appointment = true;
    } else {
      this.UserForm.value.appointment = false;
    }
    if (userData.onlinegarage != "0" && userData.onlinegarage != null) {
      this.UserForm.value.online_garage = true;
    } else {
      this.UserForm.value.online_garage = false;
    }
    if (userData.staff != "0" && userData.staff != null) {
      this.UserForm.value.staff = true;
    } else {
      this.UserForm.value.staff = false;
    }
    if (userData.feedback != "0" && userData.feedback != null) {
      this.UserForm.value.feedback = true;
    } else {
      this.UserForm.value.feedback = false;
    }
    this.UserForm.value.password = userData.password;
    this.UserForm.controls["password"].setValue(userData.password, {
      onlySelf: true,
    });
  }
  clareForm(formArray) {
    formArray.controls = [];
    formArray.setValue([]);
  }
  checkedItem(value, name) {
    var x = -1;
    if (name == "purchase_orderOptions") {
      x = this.UserForm.value.purchase_orderOptions.indexOf(value);
    } else if (name == "counter_saleOptions") {
      x = this.UserForm.value.counter_saleOptions.indexOf(value);
    } else if (name == "jobcardOptions") {
      x = this.UserForm.value.jobcardOptions.indexOf(value);
    } else if (name == "inventoryOptions") {
      x = this.UserForm.value.inventoryOptions.indexOf(value);
    }
    if (x > -1) {
      return true;
    } else {
      return false;
    }
  }
  //Open Add New USer popup
  openPopup() {
    this.showupdateuser = false;
    this.UserForm.reset();
    this.UserForm.value.user_type = "Supervisor";
    this.UserForm.controls["user_type"].setValue("Supervisor", {
      onlySelf: true,
    });
    this.UserForm.value.user_name = "";
    this.UserForm.controls["user_name"].setValue("", { onlySelf: true });
    this.UserForm.value.user_mobile_number = "";
    this.UserForm.controls["user_mobile_number"].setValue("", {
      onlySelf: true,
    });
    this.UserForm.value.inventory = false;
    this.UserForm.controls["inventory"].setValue(0, { onlySelf: true });
    this.UserForm.value.jobcard = false;
    this.UserForm.controls["jobcard"].setValue(0, { onlySelf: true });
    this.UserForm.value.counter_sale = 0;
    this.UserForm.controls["counter_sale"].setValue(0, { onlySelf: true });
    this.UserForm.value.purchase_order = 0;
    this.UserForm.controls["purchase_order"].setValue(0, { onlySelf: true });
    this.UserForm.value.dashboard = 0;
    this.UserForm.controls["dashboard"].setValue(0, { onlySelf: true });
    this.UserForm.value.setting = 0;
    this.UserForm.controls["setting"].setValue(0, { onlySelf: true });
    this.UserForm.value.reports = 0;
    this.UserForm.controls["reports"].setValue(0, { onlySelf: true });
    this.UserForm.value.collect_payment = 0;
    this.UserForm.controls["collect_payment"].setValue(0, { onlySelf: true });
    this.UserForm.value.online_garage = 0;
    this.UserForm.controls["online_garage"].setValue(0, { onlySelf: true });
    this.UserForm.value.staff = 0;
    this.UserForm.controls["staff"].setValue(0, { onlySelf: true });
    this.UserForm.value.feedback = 0;
    this.UserForm.controls["feedback"].setValue(0, { onlySelf: true });
    this.UserForm.value.password = "";
    this.UserForm.controls["password"].setValue("", { onlySelf: true });
  }

  onCheckChange(event, name, cntrl) {
    const formArray: FormArray = this.UserForm.get(name) as FormArray;

    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    } else {
      /* unselected */
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          if (event.target.value == "view") {
            this.clareForm(formArray);
            this.closeOnView(cntrl);
          }
          return;
        }
        i++;
      });
    }
  }
  CheckView(event, name) {
    const formArray: FormArray = this.UserForm.get(name) as FormArray;
    this.clareForm(formArray);
    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      // formArray.push(new FormControl(event.target.value));
      formArray.push(new FormControl("view"));
    } else {
      /* unselected */
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  closeOnView(e) {
    if (e == "purchase_order") {
      this.UserForm.value.purchase_order = false;
    } else if (e == "counter_sale") {
      this.UserForm.value.counter_sale = false;
    } else if (e == "inventory") {
      this.UserForm.value.inventory = false;
    } else if (e == "jobcard") {
      this.UserForm.value.jobcard = false;
    }
  }
  CreateUser(mode) {
    if (
      this.UserForm.value.user_mobile_number !=
      this.userservice.getData()["workshop_mobile_number_1"]
    ) {
      var ud: any = {};
      ud.user_role = this.UserForm.value.user_type;
      ud.user_name = this.UserForm.value.user_name;
      ud.user_mobile_number = this.UserForm.value.user_mobile_number;
      ud.password = this.UserForm.value.password;
      if (this.UserForm.value.dashboard) {
        ud.dashboard = 1;
      } else {
        ud.dashboard = 0;
      }
      if (this.UserForm.value.setting) {
        ud.setting = 1;
      } else {
        ud.setting = 0;
      }
      if (this.UserForm.value.reports) {
        ud.reports = 1;
      } else {
        ud.reports = 0;
      }
      if (this.UserForm.value.collect_payment) {
        ud.collect_payment = 1;
      } else {
        ud.collect_payment = 0;
      }
      if (this.UserForm.value.appointment) {
        ud.appointment = 1;
      } else {
        ud.appointment = 0;
      }
      if (this.UserForm.value.online_garage) {
        ud.online_garage = 1;
      } else {
        ud.online_garage = 0;
      }
      if (this.UserForm.value.staff) {
        ud.staff = 1;
      } else {
        ud.staff = 0;
      }
      if (this.UserForm.value.feedback) {
        ud.feedback = 1;
      } else {
        ud.feedback = 0;
      }
      if (this.UserForm.value.counter_sale) {
        ud.counter_sale = this.getKeysArray(
          this.UserForm.value.counter_saleOptions
        );
      } else {
        ud.counter_sale = 0;
      }
      if (this.UserForm.value.inventory) {
        ud.inventory = this.getKeysArray(this.UserForm.value.inventoryOptions);
      } else {
        ud.inventory = 0;
      }
      if (this.UserForm.value.purchase_order) {
        ud.purchase_order = this.getKeysArray(
          this.UserForm.value.purchase_orderOptions
        );
      } else {
        ud.purchase_order = 0;
      }
      if (this.UserForm.value.jobcard) {
        ud.jobcard = this.getKeysArray(this.UserForm.value.jobcardOptions);
      } else {
        ud.jobcard = 0;
      }
      this.showspinner.setSpinner(true);
      if (mode == "create") {
        this.generalservice
          .CreateWorkshopUser(
            this.userserviceworkshopid,
            ud.user_name,
            ud.user_role,
            ud.user_mobile_number,
            ud.dashboard,
            ud.setting,
            ud.reports,
            ud.collect_payment,
            ud.appointment,
            ud.online_garage,
            ud.staff,
            ud.feedback,
            ud.counter_sale,
            ud.inventory,
            ud.purchase_order,
            ud.jobcard,
            ud.password
          )
          .subscribe(
            (res) => {
              this.showspinner.setSpinner(false);
              if (res.success) {
                this.getAllUsers();
                this.UserForm.reset();
                this.snakBar.open("Message", ErrorMessgae[0][107], {
                  duration: 4000,
                });
              }
            },
            (err) => {
              this.showspinner.setSpinner(false);
              this.snakBar.open("Error", ErrorMessgae[0][err], {
                duration: 4000,
              });
            }
          );
      } else {
        ud.is_active = this.UserForm.value.is_active || true;
        ud.is_delete = this.UserForm.value.is_delete || false;
        this.generalservice
          .UpdateWorkshopUser(
            this.userserviceworkshopid,
            ud.user_name,
            ud.user_role,
            ud.user_mobile_number,
            ud.dashboard,
            ud.setting,
            ud.reports,
            ud.collect_payment,
            ud.appointment,
            ud.online_garage,
            ud.staff,
            ud.feedback,
            ud.counter_sale,
            ud.inventory,
            ud.purchase_order,
            ud.jobcard,
            ud.password,
            ud.is_active,
            ud.is_delete
          )
          .subscribe(
            (res) => {
              this.showspinner.setSpinner(false);
              if (res.success) {
                this.getAllUsers();
                this.snakBar.open("Message", ErrorMessgae[0][106], {
                  duration: 4000,
                });
              }
            },
            (err) => {
              this.showspinner.setSpinner(false);
              this.snakBar.open("Error", ErrorMessgae[0][err], {
                duration: 4000,
              });
            }
          );
      }
    } else {
      this.UserForm.controls["user_mobile_number"].setValue("");
      this.snakBar.open("Message", "You can not add your own workshop Number", {
        duration: 4000,
      });
    }
  }

  getKeysArray(arr) {
    var newArr = [];
    const keys = arr.keys();
    for (let x of keys) {
      newArr[arr[x]] = 1;
    }
    return Object.assign({}, newArr);
  }

  //Update old not in use or Add new User
  addorupdateUser(mode) {
    var jobcard_list;
    var inventory;
    var settings;
    var report;
    var analytics;
    var bulk_sms;
    var expenses;
    var customer;
    var addons;
    var status;
    if (mode == "update") {
      this.allUsers.map((data) => {
        if (
          data.user_mobile_number ==
          this.UserForm.getRawValue().user_mobile_number
        ) {
          data.user_type = this.UserForm.value.user_type;
          data.user_name = this.UserForm.value.user_name;
          data.user_mobile_number = this.UserForm.value.user_mobile_number;
          data.password = this.UserForm.value.password;
          if (this.UserForm.value.jobcard_list == true) {
            data.jobcard_list = 1;
          } else if (this.UserForm.value.jobcard_list == false) {
            data.jobcard_list = 0;
          } else {
            data.jobcard_list = this.UserForm.value.jobcard_list;
          }
          if (this.UserForm.value.inventory == true) {
            data.inventory = 1;
          } else if (this.UserForm.value.inventory == false) {
            data.inventory = 0;
          } else {
            data.inventory = this.UserForm.value.inventory;
          }
          if (this.UserForm.value.settings == true) {
            data.settings = 1;
          } else if (this.UserForm.value.settings == false) {
            data.settings = 0;
          } else {
            data.settings = this.UserForm.value.settings;
          }
          if (this.UserForm.value.report == true) {
            data.report = 1;
          } else if (this.UserForm.value.report == false) {
            data.report = 0;
          } else {
            data.report = this.UserForm.value.report;
          }
          if (this.UserForm.value.analytics == true) {
            data.analytics = 1;
          } else if (this.UserForm.value.analytics == false) {
            data.analytics = 0;
          } else {
            data.analytics = this.UserForm.value.analytics;
          }
          if (this.UserForm.value.bulk_sms == true) {
            data.bulk_sms = 1;
          } else if (this.UserForm.value.bulk_sms == false) {
            data.bulk_sms = 0;
          } else {
            data.bulk_sms = this.UserForm.value.bulk_sms;
          }
          if (this.UserForm.value.expenses == true) {
            data.expenses = 1;
          } else if (this.UserForm.value.expenses == false) {
            data.expenses = 0;
          } else {
            data.expenses = this.UserForm.value.expenses;
          }
          if (this.UserForm.value.customer == true) {
            data.customer = 1;
          } else if (this.UserForm.value.customer == false) {
            data.customer = 0;
          } else {
            data.customer = this.UserForm.value.customer;
          }
          if (this.UserForm.value.addons == true) {
            data.addons = 1;
          } else if (this.UserForm.value.addons == false) {
            data.addons = 0;
          } else {
            data.addons = this.UserForm.value.addons;
          }
          if (this.UserForm.value.status == true) {
            data.status = 1;
          } else if (this.UserForm.value.status == false) {
            data.status = 0;
          } else {
            data.status = this.UserForm.value.status;
          }
        }
      });
      this.dataSource = new MatTableDataSource(this.allUsers);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } else {
      if (this.UserForm.value.jobcard_list == true) {
        jobcard_list = 1;
      } else if (this.UserForm.value.jobcard_list == false) {
        jobcard_list = 0;
      } else {
        jobcard_list = this.UserForm.value.jobcard_list;
      }
      if (this.UserForm.value.inventory == true) {
        inventory = 1;
      } else if (this.UserForm.value.inventory == false) {
        inventory = 0;
      } else {
        inventory = this.UserForm.value.inventory;
      }
      if (this.UserForm.value.settings == true) {
        settings = 1;
      } else if (this.UserForm.value.settings == false) {
        settings = 0;
      } else {
        settings = this.UserForm.value.settings;
      }
      if (this.UserForm.value.report == true) {
        report = 1;
      } else if (this.UserForm.value.report == false) {
        report = 0;
      } else {
        report = this.UserForm.value.report;
      }
      if (this.UserForm.value.analytics == true) {
        analytics = 1;
      } else if (this.UserForm.value.analytics == false) {
        analytics = 0;
      } else {
        analytics = this.UserForm.value.analytics;
      }
      if (this.UserForm.value.bulk_sms == true) {
        bulk_sms = 1;
      } else if (this.UserForm.value.bulk_sms == false) {
        bulk_sms = 0;
      } else {
        bulk_sms = this.UserForm.value.bulk_sms;
      }
      if (this.UserForm.value.expenses == true) {
        expenses = 1;
      } else if (this.UserForm.value.expenses == false) {
        expenses = 0;
      } else {
        expenses = this.UserForm.value.expenses;
      }
      if (this.UserForm.value.customer == true) {
        customer = 1;
      } else if (this.UserForm.value.customer == false) {
        customer = 0;
      } else {
        customer = this.UserForm.value.customer;
      }
      if (this.UserForm.value.addons == true) {
        addons = 1;
      } else if (this.UserForm.value.addons == false) {
        addons = 0;
      } else {
        addons = this.UserForm.value.addons;
      }
      if (this.UserForm.value.status == true) {
        status = 1;
      } else if (this.UserForm.value.status == false) {
        status = 0;
      } else {
        status = this.UserForm.value.status;
      }
      var newUser = {
        user_type: this.UserForm.getRawValue().user_type,
        user_name: this.UserForm.getRawValue().user_name,
        user_mobile_number: this.UserForm.getRawValue().user_mobile_number,
        password: this.UserForm.getRawValue().password,
        jobcard_list: jobcard_list,
        inventory: inventory,
        settings: settings,
        report: report,
        analytics: analytics,
        bulk_sms: bulk_sms,
        expenses: expenses,
        customer: customer,
        addons: addons,
        status: status,
      };
      this.allUsers.splice(0, 0, newUser);
      this.dataSource = new MatTableDataSource(this.allUsers);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
    this.generalservice
      .updateOrAddNewUserSettings(this.userserviceworkshopid, this.allUsers)
      .subscribe(
        (updateJobcard) => {
          this.showspinner.setSpinner(true);
          this.showspinner.setSpinner(false);
          this.snakBar.open(
            "Message",
            ErrorMessgae[0][updateJobcard["message"]],
            {
              duration: 4000,
            }
          );
          if (updateJobcard["success"] == true) {
            this.allSettings.settings_user_add = JSON.stringify(this.allUsers);
          }
        },
        (err) => {
          this.showspinner.setSpinner(false);
          this.snakBar.open("Error", ErrorMessgae[0][err], {
            duration: 4000,
          });
        }
      );
  }

  //-----------------------------------------END USER------------------------------------------------------
  //-----------------------------------------SHARED-------------------------------------------------
  //Remove Classes from the tabd and data
  removeclass(compenet) {
    this.loadclass = "tab-pane fade";
    this.tabclass = "nav-item";
    if (compenet == "jobcard") {
      this.setJobcardData();
    }
    if (compenet == "inventory") {
      this.setInventoryData();
    }
    if (compenet == "billing") {
      this.setBillingData();
    }
    if (compenet == "users") {
      this.getAllUsers();
    }
  }
  // Show profile Data on click
  showprofile() {
    this.ngOnInit();
  }
  //-----------------------------------------END SHARED------------------------------------------------------

  showOtpForm() {
    this.setPassForm = this.formbuild.group(
      {
        old_password: [
          "",
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6,16}$/)],
        ],
        new_password: [
          "",
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6,16}$/)],
        ],
        confirm_password: [
          "",
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6,16}$/)],
        ],
      },
      { validator: this.passwordConfirming }
    );
  }
  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get("new_password").value !== c.get("confirm_password").value) {
      return { invalid: true };
    }
  }
  setPassword(mode) {
    this.generalservice
      .setUserPassword(
        this.ProfileForm.getRawValue().phonenumber,
        mode,
        this.setPassForm.value.new_password,
        this.setPassForm.value.old_password)
        .subscribe((res) => {
        console.log("setUserPassword", res);
        if (res.success) {
          this.passwordSet = true;
          this.snakBar.open("password successfully set", "", {
            duration: 4000,
          });
        }
      });
  }

  tabClick(tabName) { 
    console.log("onclick>>",tabName)
    this.tabClickOption = tabName;
    switch(this.tabClickOption) { 
      case "Profile": { 
        this.showprofile(); 
         break; 
      } 
      case "Jobcard": { 
        this.setJobcardData();
         break; 
      } 
      case "Inventory": { 
        this.setInventoryData();
        break; 
      } 
      case "Billing": { 
        this.setBillingData();
        this.setRegularInvoiceForm();
        this.setThermalInvoiceForm();
        break; 
      } 
      case "User": { 
        this.getAllUsers();
        break; 
      } 
      case "Invoice": { 
        this.setBillingData();
        this.setRegularInvoiceForm();
        this.setThermalInvoiceForm();
        break; 
      } 
      default: { 
         //statements; 
         break; 
      } 
    } 

    // if (tabName == "Profile") {
    //   this.showprofile();
    // }
    // if (tabName == "Jobcard") {
    //   this.setJobcardData();
    // }
    // if (tabName == "Inventory") {
    //   this.setInventoryData();
    // }
    // if (tabName == "Billing") {
    //   this.setBillingData();
    //   this.setRegularInvoiceForm();
    //   this.setThermalInvoiceForm();
    // }
    // if (tabName == "User") {
    //   this.getAllUsers();
    // }
    // if(tabName == "Invoice"){
    //   this.setBillingData();
    //   this.setRegularInvoiceForm();
    //   this.setThermalInvoiceForm();
    // }
  }

  //Set Billing Data
  setRegularInvoiceForm() {
    console.log("this.allSettings",this.allSettings.settings_billing.invoice_type_regular)
    var settings_billing;
    if (typeof this.allSettings.settings_billing == "string") {
      settings_billing = JSON.parse(this.allSettings.settings_billing)[0].invoice_type_regular;
      console.log("settings_billing",settings_billing);
    } else {
      settings_billing = this.allSettings.settings_billing.invoice_type_regular;
    }
    
    this.invoiceTypeRegularForm.value.invoice_theme = settings_billing.invoice_theme;
    this.invoiceTypeRegularForm.controls["invoice_theme"].setValue(
      settings_billing.invoice_theme,
      { onlySelf: true }
    );
    this.invoiceTypeRegularForm.value.invoice_pagesize = settings_billing.invoice_pagesize;
    this.invoiceTypeRegularForm.controls["invoice_pagesize"].setValue(
      settings_billing.invoice_pagesize,
      { onlySelf: true }
    );
    if(settings_billing.invoice_textcolor == 'default'){
      this.invoiceTypeRegularForm.value.invoice_textcolor = "#000000";
      this.invoiceTypeRegularForm.controls["invoice_textcolor"].setValue(
        "#000000",
        { onlySelf: true }
      );
    }else{
      this.invoiceTypeRegularForm.value.invoice_textcolor = settings_billing.invoice_textcolor;
      this.invoiceTypeRegularForm.controls["invoice_textcolor"].setValue(
        settings_billing.invoice_textcolor,
        { onlySelf: true }
      );
    }
   
    this.invoiceTypeRegularForm.value.invoice_textsize = settings_billing.invoice_textsize;
    this.invoiceTypeRegularForm.controls["invoice_textsize"].setValue(
      settings_billing.invoice_textsize,
      { onlySelf: true }
    );
    this.invoiceTypeRegularForm.value.invoice_textstyle = settings_billing.invoice_textstyle;
    this.invoiceTypeRegularForm.controls["invoice_textstyle"].setValue(
      settings_billing.invoice_textstyle,
      { onlySelf: true }
    );
    this.invoiceTypeRegularForm.value.is_company_logo = settings_billing.is_company_logo;
    this.invoiceTypeRegularForm.controls["is_company_logo"].setValue(
      settings_billing.is_company_logo,
      { onlySelf: true }
    );

    if(settings_billing.company_name.textColor == 'default'){
      this.invoiceTypeRegularForm.value.company_name_textColor = "#000000";
      this.invoiceTypeRegularForm.controls["company_name_textColor"].setValue(
        "#000000",
        { onlySelf: true }
      );
    }else{
      this.invoiceTypeRegularForm.value.company_name_textColor = settings_billing.company_name.textColor;
      this.invoiceTypeRegularForm.controls["company_name_textColor"].setValue(
        settings_billing.company_name.textColor,
        { onlySelf: true }
      );
    }
    
    this.invoiceTypeRegularForm.value.company_name_textSize = settings_billing.company_name.textSize;
    this.invoiceTypeRegularForm.controls["company_name_textSize"].setValue(
      settings_billing.company_name.textSize,
      { onlySelf: true }
    );
    this.invoiceTypeRegularForm.value.company_name_textStyle = settings_billing.company_name.textStyle;
    this.invoiceTypeRegularForm.controls["company_name_textStyle"].setValue(
      settings_billing.company_name.textStyle,
      { onlySelf: true }
    );
    this.invoiceTypeRegularForm.value.is_customer_voice = settings_billing.is_customer_voice;
    this.invoiceTypeRegularForm.controls["is_customer_voice"].setValue(
      settings_billing.is_customer_voice,
      { onlySelf: true }
    );
    this.invoiceTypeRegularForm.value.is_qrcode = settings_billing.is_qrcode;
    this.invoiceTypeRegularForm.controls["is_qrcode"].setValue(
      settings_billing.is_qrcode,
      { onlySelf: true }
    );
    this.invoiceTypeRegularForm.value.is_tax_details = settings_billing.is_tax_details;
    this.invoiceTypeRegularForm.controls["is_tax_details"].setValue(
      settings_billing.is_tax_details,
      { onlySelf: true }
    );
    this.invoiceTypeRegularForm.value.is_terms_conditions = settings_billing.is_terms_conditions;
    this.invoiceTypeRegularForm.controls["is_terms_conditions"].setValue(
      settings_billing.is_terms_conditions,
      { onlySelf: true }
    );
    this.invoiceTypeRegularForm.value.is_tagline = settings_billing.is_tagline;
    this.invoiceTypeRegularForm.controls["is_tagline"].setValue(
      settings_billing.is_tagline,
      { onlySelf: true }
    );
    this.invoiceTypeRegularForm.value.tag_line = settings_billing.tag_line;
    this.invoiceTypeRegularForm.controls["tag_line"].setValue(
      settings_billing.tag_line,
      { onlySelf: true }
    );
    
  }  
  setThermalInvoiceForm(){
    var settings_billing;
    if (typeof this.allSettings.settings_billing == "string") {
      settings_billing = JSON.parse(this.allSettings.settings_billing)[0].invoice_type_thermal;
    } else {
      settings_billing = this.allSettings.settings_billing.invoice_type_thermal;
    }
    
    this.invoiceTypeThermalForm.value.invoice_theme = settings_billing.invoice_theme;
    this.invoiceTypeThermalForm.controls["invoice_theme"].setValue(
      settings_billing.invoice_theme,
      { onlySelf: true }
    );
    this.invoiceTypeThermalForm.value.invoice_pagesize = settings_billing.invoice_pagesize;
    this.invoiceTypeThermalForm.controls["invoice_pagesize"].setValue(
      settings_billing.invoice_pagesize,
      { onlySelf: true }
    );
    this.invoiceTypeThermalForm.value.invoice_textsize = settings_billing.invoice_textsize;
    this.invoiceTypeThermalForm.controls["invoice_textsize"].setValue(
      settings_billing.invoice_textsize,
      { onlySelf: true }
    );
    this.invoiceTypeThermalForm.value.invoice_textstyle = settings_billing.invoice_textstyle;
    this.invoiceTypeThermalForm.controls["invoice_textstyle"].setValue(
      settings_billing.invoice_textstyle,
      { onlySelf: true }
    );
    this.invoiceTypeThermalForm.value.company_name_textSize = settings_billing.company_name.textSize;
    this.invoiceTypeThermalForm.controls["company_name_textSize"].setValue(
      settings_billing.company_name.textSize,
      { onlySelf: true }
    );
    this.invoiceTypeThermalForm.value.company_name_textStyle = settings_billing.company_name.textStyle;
    this.invoiceTypeThermalForm.controls["company_name_textStyle"].setValue(
      settings_billing.company_name.textStyle,
      { onlySelf: true }
    );
    this.invoiceTypeThermalForm.value.is_customer_voice = settings_billing.is_customer_voice;
    this.invoiceTypeThermalForm.controls["is_customer_voice"].setValue(
      settings_billing.is_customer_voice,
      { onlySelf: true }
    );
    this.invoiceTypeThermalForm.value.is_qrcode = settings_billing.is_qrcode;
    this.invoiceTypeThermalForm.controls["is_qrcode"].setValue(
      settings_billing.is_qrcode,
      { onlySelf: true }
    );
    this.invoiceTypeThermalForm.value.is_tax_details = settings_billing.is_tax_details;
    this.invoiceTypeThermalForm.controls["is_tax_details"].setValue(
      settings_billing.is_tax_details,
      { onlySelf: true }
    );
    this.invoiceTypeThermalForm.value.is_terms_conditions = settings_billing.is_terms_conditions;
    this.invoiceTypeThermalForm.controls["is_terms_conditions"].setValue(
      settings_billing.is_terms_conditions,
      { onlySelf: true }
    );
    this.invoiceTypeThermalForm.value.is_tagline = settings_billing.is_tagline;
    this.invoiceTypeThermalForm.controls["is_tagline"].setValue(
      settings_billing.is_tagline,
      { onlySelf: true }
    );
    this.invoiceTypeThermalForm.value.tag_line = settings_billing.tag_line;
    this.invoiceTypeThermalForm.controls["tag_line"].setValue(
      settings_billing.tag_line,
      { onlySelf: true }
    );
  }

 getInvoiceTypeRegularData(){
   var InvoiceTypeRegularData: any = {};
   var company_name: any = {};
   
   InvoiceTypeRegularData.invoice_theme = this.invoiceTypeRegularForm.getRawValue().invoice_theme;
   InvoiceTypeRegularData.invoice_pagesize = this.invoiceTypeRegularForm.getRawValue().invoice_pagesize;
   InvoiceTypeRegularData.invoice_textcolor = this.invoiceTypeRegularForm.getRawValue().invoice_textcolor
   InvoiceTypeRegularData.invoice_textsize = this.invoiceTypeRegularForm.getRawValue().invoice_textsize;
   InvoiceTypeRegularData.invoice_textstyle = this.invoiceTypeRegularForm.getRawValue().invoice_textstyle;
   InvoiceTypeRegularData.is_company_logo = this.invoiceTypeRegularForm.getRawValue().is_company_logo;
   company_name.textColor = this.invoiceTypeRegularForm.getRawValue().company_name_textColor;
   company_name.textSize = this.invoiceTypeRegularForm.getRawValue().company_name_textSize;
   company_name.textStyle = this.invoiceTypeRegularForm.getRawValue().company_name_textStyle;
   InvoiceTypeRegularData.company_name = company_name;
   InvoiceTypeRegularData.is_customer_voice = this.invoiceTypeRegularForm.getRawValue().is_customer_voice;
   InvoiceTypeRegularData.is_qrcode = this.invoiceTypeRegularForm.getRawValue().is_qrcode;
   InvoiceTypeRegularData.is_tax_details = this.invoiceTypeRegularForm.getRawValue().is_tax_details;
   InvoiceTypeRegularData.is_terms_conditions = this.invoiceTypeRegularForm.getRawValue().is_terms_conditions;
   InvoiceTypeRegularData.is_tagline = this.invoiceTypeRegularForm.getRawValue().is_tagline;
   InvoiceTypeRegularData.tag_line = this.invoiceTypeRegularForm.getRawValue().tag_line;
   return InvoiceTypeRegularData;
 }
 getInvoiceTypeThermalData(){
  var InvoiceTypeThermalData: any = {};
  var company_name: any = {};
  
  InvoiceTypeThermalData.invoice_theme = this.invoiceTypeThermalForm.getRawValue().invoice_theme;
  InvoiceTypeThermalData.invoice_pagesize = this.invoiceTypeThermalForm.getRawValue().invoice_pagesize;
  InvoiceTypeThermalData.invoice_textsize = this.invoiceTypeThermalForm.getRawValue().invoice_textsize;
  InvoiceTypeThermalData.invoice_textstyle = this.invoiceTypeThermalForm.getRawValue().invoice_textstyle;
  company_name.textSize = this.invoiceTypeThermalForm.getRawValue().company_name_textSize;
  company_name.textStyle = this.invoiceTypeThermalForm.getRawValue().company_name_textStyle;
  InvoiceTypeThermalData.company_name = company_name;
  InvoiceTypeThermalData.is_customer_voice = this.invoiceTypeThermalForm.getRawValue().is_customer_voice;
  InvoiceTypeThermalData.is_qrcode = this.invoiceTypeThermalForm.getRawValue().is_qrcode;
  InvoiceTypeThermalData.is_tax_details = this.invoiceTypeThermalForm.getRawValue().is_tax_details;
  InvoiceTypeThermalData.is_terms_conditions = this.invoiceTypeThermalForm.getRawValue().is_terms_conditions;
  InvoiceTypeThermalData.is_tagline = this.invoiceTypeThermalForm.getRawValue().is_tagline;
  InvoiceTypeThermalData.tag_line = this.invoiceTypeThermalForm.getRawValue().tag_line;
  return InvoiceTypeThermalData;
 }

}
