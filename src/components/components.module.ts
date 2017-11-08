import { MyProvidersModule } from '../providers/providers.module';
import { NgModule } from '@angular/core';
import { IonMaps } from './ion-maps/ion-maps';
@NgModule({
	declarations: [IonMaps],
	imports: [
    MyProvidersModule.forRoot(),
  ],
	exports: [IonMaps]
})
export class ComponentsModule {}
