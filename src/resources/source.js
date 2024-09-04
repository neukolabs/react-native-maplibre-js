import { log, error } from './logger';
class Source {
  constructor(id, mapRef, specification) {
    this.id = id;
    this.map = mapRef;

    // draw
    this.map.addSource(this.id, specification);
  }

  remove() {
    try {
      if (!this.map) {
        throw new Error('Map is not initialized');
      }
      this.map.removeSource(this.id);
    } catch (err) {
      error('MarkerError', err.message);
    }
  }

  setData(specification = {}) {
    try {
      if (!this.map) {
        throw new Error('Map is not initialized');
      }
      this.map.getSource(this.id).setData(specification);
      return null;
    } catch (err) {
      error('MapError', err.message);
    }
  }
}

module.exports = Source;
