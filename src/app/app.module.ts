import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GoogleMapsProvider } from '../providers/google-maps/google-maps';
import { NativeGoogleMapsProvider } from '../providers/native-google-maps/native-google-maps';
import { JavascriptGoogleMapsProvider } from '../providers/javascript-google-maps/javascript-google-maps';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GoogleMapsProvider,
    NativeGoogleMapsProvider,
    JavascriptGoogleMapsProvider,
    Geolocation,
    GoogleMaps,
  ]
})
export class AppModule {}
