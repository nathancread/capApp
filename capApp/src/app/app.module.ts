import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Camera } from '@ionic-native/camera/ngx';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { HttpClientModule } from '@angular/common/http';

import { HttpClient} from '@angular/common/http';
import { AlertController } from '@ionic/angular';

import { File as IonicFileService,IFile,FileEntry} from '@ionic-native/file/ngx';
import { ImageManagementService } from './tab1/image-management.service';
import { RealFileLoaderService } from './tab1/real-file-loader.service';
import {GeoManagementService} from './tab1/geo-management-service';


//import { RequestOptions } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    ImageManagementService,
    RealFileLoaderService,
    IonicFileService,
    AlertController,
    Geolocation,
    DeviceOrientation,
    NativeGeocoder,
    GeoManagementService,
    HttpClient,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
