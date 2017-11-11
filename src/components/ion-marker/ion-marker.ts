import { Component, Input } from '@angular/core';

@Component({
  selector: 'ion-marker',
  template: `<template></template>`
})
export class IonMarker {
  /**
   * Only works with static maps.
   * The address of the marker.
   * Ignores lat lng if passed.
   */
  @Input() address: string;

  /**
   * The latitude position of the marker.
   */
  @Input() lat: number;

  /**
   * The longitude position of the marker.
   */
  @Input() lng: number;

  /**
   * The title of the marker.
   */
  @Input() title: string;

  /**
   * Only works on javascript maps.
   * The label (a single uppercase character) for the marker.
   */
  @Input() label: string;

  /**
   * Only works on static maps.
   * The color of the marker.
   * Accepted format: 0xRRGGBB or one of these: ['yellow', 'red', 'green', 'blue', 'purple', 'orange', 'green']
   */
  @Input() color: string;

  /**
   * If true, the marker can be dragged. Default value is false.
   */
  @Input() draggable: boolean = false;

  /**
   * If true, the marker will have a DROP animation on the screen. Default value is false.
   */
  @Input() animated: boolean = false;

  /**
   * Icon (the URL of the image) for the foreground.
   */
  @Input() iconUrl: string;

  /**
   * If true, the marker is visible
   */
  @Input() visible: boolean = true;

  /**
   * Whether to automatically open the child info window when the marker is clicked.
   */
  @Input() openInfoWindow: boolean = true;

  /**
   * Only works on javascript maps.
   * The marker's opacity between 0.0 and 1.0.
   */
  @Input() opacity: number = 1;

  /**
   * All markers are displayed on the map in order of their zIndex, with higher values displaying in
   * front of markers with lower values. By default, markers are displayed according to their
   * vertical position on screen, with lower markers appearing in front of markers further up the
   * screen.
   */
  @Input() zIndex: number = 1;
}
