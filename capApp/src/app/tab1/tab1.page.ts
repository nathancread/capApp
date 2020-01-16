import { Component } from '@angular/core';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { ImageManagementService } from './image-management.service';
import {GeoManagementService} from './geo-management-service'
//import { RequestOptions } from '@angular/common/http';

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
  test :any
  //geoloc
  geoLatitude: number;
  geoLongitude: number;
  //compass vars
  magneticReading: any;
  btnText: any
  subsciptionCompass : any;
  //image vars
  actualImage: any;
  // classification vars
  classification: any;
    
  constructor(
    private deviceOrientation: DeviceOrientation,
    private alertController: AlertController,
    private imageManagementService: ImageManagementService,
    private geomanagementService: GeoManagementService,
    private http: HttpClient) 
    {
      this.btnText = "Read Compass";
      this.compassButton ="radio-button-off";
      this.pictureButton ="radio-button-off";
      this.classification="none";

    }

  //Camera code
  async takePicture() {
      this.actualImage = await this.imageManagementService.uploadFromCamera();
      this.pictureButton = "checkmark-circle-outline";
    }

  //compass code
  async clickCompass() {
    if (this.btnText == 'Read Compass') {
       this.startCompass();
       this.btnText = 'End Compass';
    } else if(this.btnText == 'End Compass') {
       this.endCompass();
       const loc = await this.geomanagementService.getGeolocation();
       this.geoLatitude = loc[0];
       this.geoLongitude = loc[1];
       this.compassButton = "checkmark-circle-outline";
       this.btnText = 'Read Compass';
    }
 }

 startCompass()
 {
   this.subsciptionCompass = this.deviceOrientation.watchHeading().subscribe(
     (data: DeviceOrientationCompassHeading) => this.magneticReading = data.magneticHeading
   );
 }
 endCompass()
 {
   this.subsciptionCompass.unsubscribe();
 }

//radio button alert
async presentAlertMultipleButtons(): Promise<string>  {

  
  const alert = await this.alertController.create({
    header: 'Manual Classification',
    message: 'Pick one',
    buttons: [
      {
        text: 'Flood Related Object',
        handler: (blah) => {
          this.classification = 'Flood Related Object';
          return this.classification;
        }
      }, {
        text: 'Blackout Related Object',
        handler: () => {
          this.classification = 'Blackout Related Object';
          return this.classification;
        }
      }
  });

  await alert.present();
  //return this.classification;

}






//////////////////
/// Sending SUTFF/////
/////////////////

async clickSend()
{
  this.dataSent = "awaiting input";
  await Promise.resolve(this.presentAlertMultipleButtons()).then((resp) => {
    this.dataSent = "trying";
    this.postData(resp);
}).catch((error) => {
  alert('Error with popup'+ JSON.stringify(error));
});


}


 async postData(alert:string){
  

  var headers = new HttpHeaders();
  headers.set('Content-Type', 'multipart/form-data');
  let  requestOptions = {
    headers: headers
  }

  let s = Date.now().toString();

  let formData = new FormData();
  formData.append('latitude', this.geoLatitude.toString());
  formData.append('longitude', this.geoLongitude.toString());
  formData.append('compass', this.magneticReading.toString());
  formData.append('classification', alert);
  formData.append('image', this.actualImage, s+".jpeg");



  this.http.post("http://18.236.117.181:8081/", formData,{observe: 'response', ...requestOptions})
    .subscribe(data => {
      //after we are done
      console.log(data);
      this.dataSent = "sent";
     }, error => {
       console.log(error);
      this.dataSent = "failed";

    });

}

}
