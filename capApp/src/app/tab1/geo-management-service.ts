import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Injectable()
export class GeoManagementService {

    //holds geoloc output

    geoAccuracy:number;
    geoAddress: string;
    watchLocationUpdates:any; 
    loading:any;
    isWatching:boolean;
    subsciptionCompass : any;


  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private deviceOrientation: DeviceOrientation

    ) {}


        //Geocoder configuration
        geoencoderOptions: NativeGeocoderOptions = {
          useLocale: true,
          maxResults: 5
        };
  //Get current coordinates of device
  async getGeolocation():Promise<any>{
    this.geolocation.getCurrentPosition().then((resp) => {
      const latLon = [resp.coords.latitude,resp.coords.longitude]
      return latLon
     }).catch((error) => {
       alert('Error getting location'+ JSON.stringify(error));
     });
     return "failed";

  }


}

