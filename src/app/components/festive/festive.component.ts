import {Component, QueryList, ViewChildren, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Observable, merge, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, filter} from 'rxjs/operators';
import { DilogOpenService } from '../../services/dilog-open.service';
import {NgbDate, NgbCalendar, NgbDateParserFormatter, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import { GeneralService } from '../../services/general.service';
import { UserserviceService } from '../../services/userservice.service';
import { MatSnackBar } from '@angular/material';
import { SpinnerService } from '../../services/spinner.service';
import  {ErrorMessgae}  from  '../../shared/error_message/error';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import {Howl, Howler} from 'howler';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-festive',
  templateUrl: './festive.component.html',
  styleUrls: ['./festive.component.css']
})
/**
 * This compaonent i sused for the festival page 
*/
export class FestiveComponent implements OnInit {
  name=''
  shownmamefalg:boolean=true
  pointup
  flag1
  flag2
  firstflowe
  bird
  sunflower
  nameall
  urlsend
  contactlink
  showbut:boolean=false
  sound
  constructor(private formbuild: FormBuilder,private title: Title,
    private meta: Meta,private showspinner:SpinnerService,private snakBar:MatSnackBar,private userService: UserserviceService ,private generalService:GeneralService,private calendar: NgbCalendar, public formatter: NgbDateParserFormatter,private dialogService:DilogOpenService) { 
      this.title.setTitle("Happy Holi!");
      this.sound = new Howl({
      src: ['https://www.tightthenut.com/music/Holimusic.mp3'],
      //autoplay: true,
      loop:true,
      html5:true,
      buffer:true,
    });
    if(localStorage.getItem('run')){
      localStorage.removeItem('run')
    }
  }
  // load the festive data nd sound
  ngOnInit() {
    this.pointup=String.fromCodePoint(parseInt('1f446', 16))
    // this.flag1=String.fromCodePoint(parseInt('1f1ee', 16))
    // this.flag2=String.fromCodePoint(parseInt('1f1f3', 16))
    this.firstflowe=String.fromCodePoint(parseInt('1f3f5', 16))
    this.bird=String.fromCodePoint(parseInt('1f99a', 16))
    this.sunflower=String.fromCodePoint(parseInt('1f33b', 16))
    //this.sound.play();
    //Change global volume.
    //Howler.volume(0.5);
    var url=window.location.href
    var urlget = new URL(url);
    var c = urlget.searchParams.get("name");
    if(c!=null)
    {
      this.name=c
      this.shownmamefalg=false
      this.urlsend=urlget.toString()
    }else{
      this.showbut=true
    }
  }
  //play sound onn click
  play(){
    if(!localStorage.getItem('run')){
      localStorage.setItem('run','true')
      this.sound.play();
      Howler.volume(0.5);
    }
  }
  // name on the screen
  nameeneter(event){
    this.nameall=event
    if(event==''){
      this.showbut=true
    }else{
      this.showbut=false
    }

  }
  // show name on screen
  showname(){
    window.scrollTo(0, 0);
    this.name=this.nameall
    this.shownmamefalg=false
    var href = new URL(window.location.href);
    href.searchParams.set('name', this.name);
    this.urlsend=href.toString()
  }
  // sho name again
  shownameagaiin(){
    this.shownmamefalg=true
  }
  //share the link
  shareonwhats(){
    var mesahe
    mesahe=this.firstflowe+" "+this.firstflowe+" "+this.firstflowe+" "+this.firstflowe+"\r\nमथुरा की खुशबू, गोकुल का हार, वृन्दाबन की सुगंध ,बरसाने की फुहार ! राधा की उम्मीद, कान्हा का प्यार, मुबारक हो आपको होली का त्यौहार !!\r\n"+this.bird+" "+this.sunflower+this.bird+" "+this.sunflower+this.bird+" "+this.sunflower+this.bird+" "+this.sunflower+"\r\nHappy Holi!!.\r\n\n-"+ this.name +" \r\n\nClick link \r\n\n"+this.urlsend+"\r\n\n"+this.pointup+" "+this.pointup+" "+this.pointup+" "+this.pointup+" "+this.pointup+" "+this.pointup
    var  whatsappMessage
    whatsappMessage = encodeURIComponent(mesahe)
    this.contactlink="https://web.whatsapp.com/send?phone=91&text="+whatsappMessage
  }

}
