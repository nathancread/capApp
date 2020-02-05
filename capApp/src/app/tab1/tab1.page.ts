import { Component } from '@angular/core';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { ImageManagementService } from './image-management.service';
import { GeoManagementService } from './geo-management-service'

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  //check marks
  compassButton: string;
  pictureButton: string;
  classificationButton: string;
  message: any
  //geoloc
  geoLatitude: number;
  geoLongitude: number;
  //compass vars
  magneticReading: any;
  CompassButtonText: any
  subsciptionCompass: any;
  //image vars
  actualImage: any;
  // classification vars
  classification: any;

  constructor(
    private deviceOrientation: DeviceOrientation,
    private alertController: AlertController,
    private imageManagementService: ImageManagementService,
    private geomanagementService: GeoManagementService,
    private http: HttpClient) {
    this.CompassButtonText = "Read Compass";
    this.compassButton = "radio-button-off";
    this.pictureButton = "radio-button-off";
    this.classificationButton = "radio-button-off";
    this.classification = "none";
  }

  //Camera code
  async takePicture() {
    this.actualImage = await this.imageManagementService.uploadFromCamera();
    this.pictureButton = "checkmark-circle-outline";
  }

  //compass code
  async clickCompass() {
    if (this.CompassButtonText == 'Read Compass') {
      //start compass
      this.subsciptionCompass = this.deviceOrientation.watchHeading().subscribe(
        (data: DeviceOrientationCompassHeading) => this.magneticReading = data.magneticHeading
      );
      this.CompassButtonText = 'End Compass';
    } 
    else if (this.CompassButtonText == 'End Compass') {
      this.subsciptionCompass.unsubscribe();
      await Promise.resolve(this.geomanagementService.getGeolocation()).then((resp) => {
        this.geoLatitude = resp[0]
        this.geoLongitude = resp[1]
      }).catch((error) => {
        alert('Error with geo' + JSON.stringify(error));
      });
      this.compassButton = "checkmark-circle-outline";
      this.CompassButtonText = 'Read Compass';
    }
  }


  async presentAlert(): Promise<string> {
    return new Promise(async (resolve, reject) => {

      let alert = await this.alertController.create({
        header: 'Manual Classification',
        message: 'Pick one',
        buttons: [
          {
            text: 'Flood Related Object',
            handler: (blah) => {
              //this.classification = 'Flood Related Object';
              alert.dismiss().then(() => { resolve("Flood Related Object"); });
              return false;
            }
          }, {
            text: 'Blackout Related Object',
            handler: () => {
              //this.classification = 'Blackout Related Object';
              alert.dismiss().then(() => { resolve("Blackout Related Object"); });
              return false;
            }
          }
        ]
      });
      alert.present();
    });
  }

  //classification stuff
  async clickClassification() {
    await Promise.resolve(this.presentAlert()).then((resp) => {
      this.classification = resp;
      this.classificationButton = "checkmark-circle-outline";

    }).catch((error) => {
      alert('Error with popup' + JSON.stringify(error));
    });


  }

  async reset() {
   this.magneticReading = null;
   this.geoLatitude = null;
   this.geoLongitude = null;
   this.classification = null;
   this.actualImage = null;

   this.CompassButtonText = "Read Compass";
   this.compassButton = "radio-button-off";
   this.pictureButton = "radio-button-off";
   this.classificationButton = "radio-button-off";

  }

  //sending stuff
  async clickSend() {
    this.message = "trying";
    var headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    let requestOptions = {
      headers: headers
    }

    let s = Date.now().toString();
    let formData = new FormData();
//test
    formData.append('latitude', this.geoLatitude.toString());
    formData.append('longitude', this.geoLongitude.toString());
    formData.append('compass', this.magneticReading.toString());
    formData.append('classification', this.classification.toString());
    formData.append('image', this.actualImage, s + ".jpeg");

    this.http.post("http://backend.digitaltwincities.info/ ", formData, { observe: 'response', ...requestOptions })
      .subscribe(data => {
        //after we are done
        console.log(data);
        this.message = "sent";
        this.reset();
      }, error => {
        console.log(error);
        this.message = "failed";
      });
  }
}
