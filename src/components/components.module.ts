import { NgModule } from '@angular/core';

import { MyProvidersModule } from '../providers/providers.module';
import { IonMaps } from './ion-maps/ion-maps';
import { IonStaticMapsComponent } from './ion-static-maps/ion-static-maps';
import { IonMarker } from './ion-marker/ion-marker';

@NgModule({
	declarations: [
    IonMaps,
    IonStaticMapsComponent,
    IonMarker,
  ],
	imports: [
    MyProvidersModule.forRoot(),
  ],
	exports: [
    IonMaps,
    IonStaticMapsComponent,
    IonMarker,
  ]
})
export class ComponentsModule {}
