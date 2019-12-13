import { Component } from '@angular/core';
//import { HttpClient, HttpHeaders} from '@angular/common/http';

import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';


@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {
  magneticReading: any;
  trueReading: any;
  compassReading: DeviceOrientationCompassHeading;
  btnText: any
  subsciptionCompass : any;


  constructor(
    private deviceOrientation: DeviceOrientation,
    //private http: HttpClient,
    //private httpHeaders: HttpHeaders
  ) 
  {
    this.btnText = "Read Compass";
  }

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
       this.btnText = 'Read Compass';
    }
 }
/*
 sendPostRequest() {
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  }

  let postData = {
          "Image": "img.jpg",
          "Latitude": "11.12",
          "Longitude": "12.34",
          "Heading": this.compassReading.magneticHeading
  }

  this.http.post("http://dataserver-dev.us-west-2.elasticbeanstalk.com/data", postData, httpOptions)
      .subscribe(data => {
        console.log(data['_body']);
       }, error => {
        console.log(error);
      });
  }
  */

}
