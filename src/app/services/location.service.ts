import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AbstractService } from './comman/abstract.service';
import { UserserviceService } from './userservice.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService extends AbstractService{

  constructor(
    protected http: HttpClient,
    private userService: UserserviceService) { 
      super(http);
    }


  //map api
  // https://maps.googleapis.com/maps/api/geocode/json?latlng=44.4647452,7.3553838&key=YOUR_API_KEY
  getAddrByLatLan(latlang) {
    const httpParams = new HttpParams()
      .set("latlng", latlang)
      .set("key", "AIzaSyBkPJwfavYCe_C73JjF8SQN1O49KoQOxuo");
    const body = {};
    return this.http
      .get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  getAddrByLatLanSecond(latitude, longitude) {
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(latitude, longitude);
    const myPromise = new Promise((resolve, reject) => {
      geocoder.geocode({location: latlng}, function(results, status) {
        if(status == google.maps.GeocoderStatus.OK) {
          resolve(results);
        }else{
          reject(status);
        }
      });
    });

    return myPromise;
       
  }
  

  getLocation() {
    if (navigator.geolocation) {
      return navigator.geolocation;
    }
  }

  

}
