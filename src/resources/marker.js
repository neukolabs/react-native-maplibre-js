/* global maplibregl */
import { log, error } from './logger';
class Marker {
  constructor(id, mapRef) {
    this.id = id;
    this.map = mapRef;
    this.marker = null;
  }

  init(options = {}, coords = [0, 0]) {
    try {
      log('Marker.init', options, coords);
      this.marker = new maplibregl.Marker(options)
        .setLngLat(coords)
        .addTo(this.map);
    } catch (err) {
      error('MarkerError', err.message);
    }
  }

  remove() {
    try {
      if (!this.marker) {
        throw new Error('Marker not initialized');
      }
      log('Marker.remove');
      this.marker.remove();
    } catch (err) {
      error('MarkerError', err.message);
    }
  }

  invokeGetResponseMethod(methodName, methodArgs = []) {
    try {
      if (!this.marker) {
        throw new Error('Marker not initialized');
      }
      log('Marker.invokeGetResponseMethod', methodName, methodArgs);
      return this.marker[methodName].apply(this.marker, methodArgs);
    } catch (err) {
      error('MarkerError', err.message);
    }
  }
}

module.exports = Marker;
