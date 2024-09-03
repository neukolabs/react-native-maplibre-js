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

  invokeMethod(methodName, methodArgs = []) {
    try {
      if (!this.marker) {
        throw new Error('Marker not initialized');
      }
      log('Marker.invokeMethod', methodName, methodArgs);
      this.marker[methodName].apply(this.marker, methodArgs);
      return null;
    } catch (err) {
      error('MapError', err.message);
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

  on(eventName, callback) {
    this.marker.on(eventName, callback);
  }
}

module.exports = Marker;
