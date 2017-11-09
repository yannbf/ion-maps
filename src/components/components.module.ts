import { MyProvidersModule } from '../providers/providers.module';
import { NgModule } from '@angular/core';
import { IonMaps } from './ion-maps/ion-maps';
import { IonStaticMapsComponent } from './ion-static-maps/ion-static-maps';
@NgModule({
	declarations: [
    IonMaps,
    IonStaticMapsComponent,
  ],
	imports: [
    MyProvidersModule.forRoot(),
  ],
	exports: [
    IonMaps,
    IonStaticMapsComponent,
  ]
})
export class ComponentsModule {}
