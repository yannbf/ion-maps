## IonMaps
It's a simple component that renders the best possible google map on the device, depending on what platforms it's running on. If on web, it will use javascript google maps, if on a native device, it will use native google maps.

### Usage
html:
```html
<ion-content>
    <ion-maps><ion-maps>
</ion-content>
```

typescript:
```js
export class HomePage {
  // You can access methods from this object
  @ViewChild(IonMaps) ionMaps: IonMaps;

  // Example of usage:
  addMarker() {
    this.ionMaps.addMarker();
  }

  centerToGeolocation() {
    this.ionMaps.centerToGeolocation();
  }
}
```

### Dependencies
In order to run this project properly, you have to install the native maps plugin as such:

```bash
$ ionic cordova plugin add cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID="YourKeyHere" --variable API_KEY_FOR_IOS="YourKeyHere" --variable LOCATION_WHEN_IN_USE_DESCRIPTION="Show your location on the map" --variable LOCATION_ALWAYS_USAGE_DESCRIPTION="Trace your location on the map"
$ npm install --save @ionic-native/google-maps
```

If you run into any issues such as not finding `google` definition, run:

```bash
npm install --save @types/googlemaps
```