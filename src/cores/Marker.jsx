import { makeid } from './utilities';
import { useMaplibreContext } from '../components/maplibre-context';
import { forwardRef, useState, useEffect, useImperativeHandle } from 'react';

export const Marker = forwardRef((props, ref) => {
  // input
  const {
    coords = [0, 0],
    options = {},
    eventNames = [],
    onEvent = () => {},
  } = props;

  // hooks
  const { map, eventManager } = useMaplibreContext();
  const { _internalMapRef: mapRef, loaded } = map;

  // state
  const [identifier, setIdentifier] = useState(null);

  /**
   * The function `invokeGetResponse` asynchronously sends a request with a function name and
   * arguments, listens for a response, and resolves with the received parameters.
   * @returns The `invokeGetResponse` function is returning a Promise.
   */
  const invokeGetResponse = async (markerId, name, ...args) => {
    // generate random id
    const id = makeid(24);
    // console.debug('Marker@invokeGetResponse', markerId, id, name, args);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject('MarkerTimeoutError');
      }, 2000);

      eventManager.addListener(id, (params) => {
        // console.debug('Marker.eventManager#addListener', id, params);
        clearTimeout(timeout);
        eventManager.removeAllListeners(id);
        resolve(params);
      });

      // send data
      mapRef.current.postMessage(
        JSON.stringify({
          type: 'getResponseMarkerFunction',
          markerId: markerId,
          functionName: name,
          arguments: [...args],
          requestId: id,
        })
      );
    });
  };

  const invokeFunction = async (markerId, name, ...args) => {
    // generate random id
    const id = makeid(24);
    // console.debug('MaplibreMap@invokeFunction', id, name, args);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject('MarkerTimeoutError');
      }, 3000);

      eventManager.addListener(id, (params) => {
        // console.debug('MaplibreMap.eventManager#addListener', id, params);
        clearTimeout(timeout);
        eventManager.removeAllListeners(id);
        resolve(params);
      });

      // send data
      mapRef.current.postMessage(
        JSON.stringify({
          type: 'invokeMarkerFunction',
          markerId: markerId,
          functionName: name,
          arguments: [...args],
          requestId: id,
        })
      );
    });
  };

  // methods for marker
  useImperativeHandle(ref, () => ({
    async addClassName(className) {
      return await invokeFunction(identifier, 'addControl', className);
    },
    async getElement() {
      return await invokeGetResponse(identifier, 'getElement');
    },
    async getLngLat() {
      return await invokeGetResponse(identifier, 'getLngLat');
    },
    async getOffset() {
      return await invokeGetResponse(identifier, 'getOffset');
    },
    async getPitchAlignment() {
      return await invokeGetResponse(identifier, 'getPitchAlignment');
    },
    async getPopup() {
      return await invokeGetResponse(identifier, 'getPopup');
    },
    async getRotation() {
      return await invokeGetResponse(identifier, 'getRotation');
    },
    async getRotationAlignment() {
      return await invokeGetResponse(identifier, 'getRotationAlignment');
    },
    async isDraggable() {
      return await invokeGetResponse(identifier, 'isDraggable');
    },
    async listens() {
      return await invokeGetResponse(identifier, 'listens');
    },
    async removeClassName(className) {
      return await invokeFunction(identifier, 'removeClassName', className);
    },
    async setDraggable(shouldBeDraggable) {
      return await invokeFunction(
        identifier,
        'setDraggable',
        shouldBeDraggable
      );
    },
    async setEventedParent(parent, data = {}) {
      return await invokeFunction(identifier, 'setEventedParent', parent, data);
    },
    async setLngLat(lnglat) {
      return await invokeFunction(identifier, 'setLngLat', lnglat);
    },
    async setOffset(offset) {
      return await invokeFunction(identifier, 'setOffset', offset);
    },
    async setOpacity(opacity, opacityWhenCovered) {
      return await invokeFunction(
        identifier,
        'setOpacity',
        opacity,
        opacityWhenCovered
      );
    },
    async setPitchAlignment(alignment) {
      return await invokeFunction(identifier, 'setPitchAlignment', alignment);
    },
    /* TODO - To support in next release with Popup class */
    // async setPopup(popup) {
    //   return await invokeGetResponse(identifier, 'setPopup', 'invokeMarkerFunction', popup);
    // },
    async setRotation(rotation) {
      return await invokeFunction(identifier, 'setRotation', rotation);
    },
    async setRotationAlignment(alignment) {
      return await invokeFunction(
        identifier,
        'setRotationAlignment',
        alignment
      );
    },
    async setSubpixelPositioning(value) {
      return await invokeFunction(identifier, 'setSubpixelPositioning', value);
    },
    async toggleClassName(className) {
      return await invokeGetResponse(identifier, 'toggleClassName', className);
    },
    async togglePopup() {
      return await invokeFunction(identifier, 'togglePopup');
    },
  }));

  /* eslint-disable */
  useEffect(() => {
    // console.debug('Marker@useEffect[identifier]', 'identifier', identifier);
    if (identifier === null) return;

    // create listener
    eventNames.forEach(item => {
      eventManager.addListener(`marker:${identifier}:${item}`, (e) => onEvent(e));
    });

    // init marker on map
    setTimeout(async () => {
      await invokeFunction(identifier, 'init', {
        coords: coords,
        options: options,
        eventNames: eventNames,
      });
    }, 500);

    return () => {
      // console.debug('Marker@useEffect[]', 'exiting', identifier);

       // remove listeners
      eventNames.forEach(item => {
        eventManager.removeAllListeners(`marker:${identifier}:${item}`);
      });

      // remove from map
      invokeFunction(identifier, 'remove', null);
    };
  }, [identifier]);
  /* eslint-enable */

  useEffect(() => {
    // console.debug('Marker@useEffect[loaded]', 'loaded', loaded);
    if (!loaded) return;
    setIdentifier(makeid(24));
  }, [loaded]);

  return null;
});
