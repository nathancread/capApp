import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { HttpClient } from '@angular/common/http';
import { observable } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  
  //check marks
  compassButton: string;
  pictureButton: string;
  dataSent: any


  //holds camera output
  currentImage: any;

  //holds geoloc output
  geoLatitude: number;
  geoLongitude: number;
  geoAccuracy:number;
  geoAddress: string;
  watchLocationUpdates:any; 
  loading:any;
  isWatching:boolean;

    //Geocoder configuration
    geoencoderOptions: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    //compass vars
    magneticReading: any;
    trueReading: any;
    compassReading: DeviceOrientationCompassHeading;
    btnText: any
    subsciptionCompass : any;
    blobImage: Blob;
    fileImage: File;

  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private deviceOrientation: DeviceOrientation,
    private camera: Camera,
    private http: HttpClient) 
    {
      this.btnText = "Read Compass";
      this.compassButton ="radio-button-off";
      this.pictureButton ="radio-button-off";

    }



  ////////////
  //Camera code
  /////////////



  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.NATIVE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE 
    };

    this.camera.getPicture(options).then((imageData) => {
      //removed :'data:image/jpeg;base64,' +
      this.currentImage =  imageData;
      this.pictureButton = "checkmark-circle-outline";
    }, (err) => {
      // Handle error
      console.log("Camera issue:" + err);
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      this.blobImage = new Blob([reader.result],{type:"image/jpeg"});
    }
    reader.readAsArrayBuffer(this.currentImage);
    
    


  }


  ////garbage


  ///end garbage 


  /////////////
  ///geolocator code
  ////////////


  //Get current coordinates of device
  getGeolocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude; 
      this.geoAccuracy = resp.coords.accuracy; 
      this.getGeoencoder(this.geoLatitude,this.geoLongitude);
     }).catch((error) => {
       alert('Error getting location'+ JSON.stringify(error));
     });
  }

  //geocoder method to fetch address from coordinates passed as arguments
  getGeoencoder(latitude,longitude){
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
    .then((result: NativeGeocoderResult[]) => {
      this.geoAddress = this.generateAddress(result[0]);
    })
    .catch((error: any) => {
      alert('Error getting location'+ JSON.stringify(error));
    });
  }

  //Return Comma saperated address
  generateAddress(addressObj){
      let obj = [];
      let address = "";
      for (let key in addressObj) {
        obj.push(addressObj[key]);
      }
      obj.reverse();
      for (let val in obj) {
        if(obj[val].length)
        address += obj[val]+', ';
      }
    return address.slice(0, -2);
  }



//////////////////
/// COMPASS SUTFF/////
/////////////////



  getCompass()
  {
  // Get the device current compass heading
  this.deviceOrientation.getCurrentHeading().then(
    (data: DeviceOrientationCompassHeading) => this.compassReading = data,
    (error: any) => console.log(error)
  );
  this.magneticReading = this.compassReading.magneticHeading;
  this.trueReading = this.compassReading.trueHeading;

  }
    
  startCompass()
  {
    this.subsciptionCompass = this.deviceOrientation.watchHeading().subscribe(
      (data: DeviceOrientationCompassHeading) => this.magneticReading = data.magneticHeading
    );

    //this.magneticReading = this.compassReading.magneticHeading;
    //this.trueReading = this.compassReading.trueHeading;
  }
  endCompass()
  {
    this.subsciptionCompass.unsubscribe();
  }

  check() {
    if (this.btnText == 'Read Compass') {
       this.startCompass();
       this.btnText = 'End Compass';
    } else if(this.btnText == 'End Compass') {
       this.endCompass();
       this.getGeolocation();
       this.compassButton = "checkmark-circle-outline";
       this.btnText = 'Read Compass';
    }
 }

//////////////////
/// Sending SUTFF/////
/////////////////



 postData(){
  //this.getGeolocation();
  
  var headers = new Headers();
  headers.append("Accept", 'application/json');
  headers.append('Content-Type', 'application/json' );

  let formData = new FormData();
  formData.append('text', this.geoLatitude.toString());
  formData.append('text', this.geoLongitude.toString());
  formData.append('text', this.magneticReading.toString());
  formData.append('file', this.blobImage);

/*
  let postData =  {
    latitude: this.geoLatitude,
    longitude: this.geoLongitude,
    compass: this.magneticReading,
    image: this.currentImage

}
*/
this.dataSent = "trying";

  this.http.post("http://18.236.117.181:8081/", formData,{observe: 'response'})
    .subscribe(data => {
      //after we are done
      console.log(data);
      this.dataSent = "sent";
     }, error => {
      this.dataSent = "failed";
    });

}

}
