## IonMaps
It's a simple component that renders the best possible google map on the device, depending on what platforms it's running on. If on web, it will use javascript google maps, if on a native device, it will use native google maps.


### Ion Maps

| Property     | Type     | Definition             |
|-----------------|------------------|---------------------------------------|
| lat | string | Latitude position of the map. *Required*|
| lng | string | Longitude position of the map. *Required* |
| height | string | Height of the element. Can be used in %, px, em, rem. Defaults to '100%' |
| width | string | Width of the element. Can be used in %, px, em, rem. Defaults to '100%' |
| zoom | number | Initial zoom of the map. Defaults to 15 |
| tilt | number | Initial tilt of the map. |
| mapStyle | string or json | Theme of the map. Possible values: `standard`, `silver`, `light`, `dark`, `night`, `midnight`, `aubergine`, `military`, `paleDawn`, `red`, `purple`, `green`, `yellow`. You can also pass a custom style json object with your own custom properties.  Defaults to `standard`. |

***Usage***
```html
<ion-content>
  <ion-maps mapStyle="military" lat="40.714728" lng="-73.998672">
    <ion-marker lat="40.718217" lng="-73.998284" label="Y"></ion-marker>
    <ion-marker lat="40.718217" lng="-73.993434" title="New York Pizza" iconUrl="http://icons.iconarchive.com/icons/paomedia/small-n-flat/48/map-marker-icon.png"></ion-marker>
  </ion-maps>

  <!-- Or without markers -->
  <ion-maps lat="40.714728" lng="-73.998672" zoom="17"></ion-maps>
  
<ion-content>
```

ps: This component can be used alone with no markers.


### Ion Static Maps

| Property     | Type     | Definition             |
|-----------------|------------------|---------------------------------------|
| lat | string |Latitude position of the map. Required if not using address. |
| lng | string | Longitude position of the map. Required if not using address.  |
| address | string | Address position of the map. Can be a search string such as `New York Street, 129.` Ignored if lat lng is also passed. |
| height | number | Height of the element in px. Defaults to 400px |
| width | number | Width of the element. Defaults to 400px |
| zoom | number | Initial zoom of the map. Defaults to 15 |
| format | string | Image format of the generated map. Possible values: `png`, `jpeg`, `gif`. Defaults to `png`.|
| language | string | Language of the map labels. Only works in certain countries. |
| mapType | string | Type of the map. Possible values: HYBRID, ROADMAP, SATELLITE and TERRAIN. |
| mapStyle | string or json | Theme of the map. Possible values: `standard`, `silver`, `light`, `dark`, `night`, `midnight`, `aubergine`, `military`, `paleDawn`, `red`, `purple`, `green`, `yellow`. You can also pass a custom style json object with your own custom properties. Defaults to `standard`. |

***Usage***
```html
<ion-content>
  <ion-static-maps mapStyle="silver" lat="40.714728" lng="-73.998672">
    <ion-marker lat="40.718217" lng="-73.998284" color="yellow" label="Y"></ion-marker>
    <ion-marker lat="40.718217" lng="-73.993434" iconUrl="http://icons.iconarchive.com/icons/paomedia/small-n-flat/48/map-marker-icon.png"></ion-marker>
  </ion-static-maps>

  <!-- Or without markers -->
  <ion-static-maps lat="40.714728" lng="-73.998672" zoom="17"></ion-static-maps>
</ion-content>
```

### Ion Marker
Note that this component can be used with both `<ion-maps>` and `<ion-static-maps>`.

| Property     | Type     | Definition             |
|-----------------|------------------|---------------------------------------|
| lat | string | Latitude position of the marker. Required if not using address. |
| lng | string | Longitude position of the marker. Required if not using address.  |
| address | string | Address position of the marker. Can be a search string such as `New York Street, 129.` Ignored if lat lng is also passed. |
| title | string | Title of the marker. *Only works on ion-maps* |
| label | string | Label of the marker. Single letter that appears on the pin. Ignored if using iconUrl. |
| iconUrl | string | Url for an icon that will be displayed as a pin. Works with small sized png and ico files. |
| color | string | Color of the pin. *Only works on ion-static-maps*. Possible values: `yellow`, `red`, `green`, `blue`, `purple`, `orange`, `green` or any hex color in 0xRRGGBB format. |
| draggable | boolean | If true, the marker will have a DROP animation on the screen. Default value is false. |
| animated | boolean | If true, the marker dropped with an animation to the map. Default value is false. |
| visible | boolean | If true, the marker visible in the map. Default value is false. |
| opacity | number | Marker's opacity between 0.0 and 1.0. *Only works with javascript maps*. Defaults to 1. |
| zIndex | number | zIndex of the marker. Defaults to 1. |


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