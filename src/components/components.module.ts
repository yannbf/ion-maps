import { MyProvidersModule } from '../providers/providers.module';
import { NgModule } from '@angular/core';
import { IonMapsComponent } from './ion-maps/ion-maps';
@NgModule({
	declarations: [IonMapsComponent],
	imports: [
    MyProvidersModule.forRoot(),
  ],
	exports: [IonMapsComponent]
})
export class ComponentsModule {}
