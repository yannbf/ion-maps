import { Component, Input } from '@angular/core';

@Component({
  selector: 'ion-marker',
  template: `<template></template>`
})
export class IonMarkerComponent {
  @Input() address: string;
  @Input() color: string;
  @Input() icon: string;
  @Input() label: string;
  @Input() lat: number;
  @Input() lng: number;
}
