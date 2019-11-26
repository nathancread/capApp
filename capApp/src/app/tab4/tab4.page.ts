import { Component } from '@angular/core';

import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { Subscription } from 'rxjs';
import { Events } from '@ionic/angular';
import { Variable } from '@angular/compiler/src/render3/r3_ast';

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
    private deviceOrientation: DeviceOrientation
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

}
