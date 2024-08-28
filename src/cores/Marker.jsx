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
  const { mapRef, loaded } = map;

  // state
  const [identifier, setIdentifier] = useState(null);

  /**
   * The function `invokeGetResponse` asynchronously sends a request with a function name and
   * arguments, listens for a response, and resolves with the received parameters.
   * @returns The `invokeGetResponse` function is returning a Promise.
   */
  const invokeGetResponse = async (
    markerId,
    name,
    type = 'invokeMarkerFunction',
    ...args
  ) => {
    // generate random id
    const id = makeid(24);
    console.log('Marker@invokeGetResponse', markerId, id, name, args);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject('MarkerTimeoutError');
      }, 2000);

      eventManager.addListener(id, (params) => {
        console.log('Marker.eventManager#addListener', id, params);
        clearTimeout(timeout);
        eventManager.removeAllListeners(id);
        resolve(params);
      });

      // send data
      mapRef.postMessage(
        JSON.stringify({
          type: type,
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
      return await invokeGetResponse(
        identifier,
        'addControl',
        'invokeMarkerFunction',
        className
      );
    },
    async getElement() {
      return await invokeGetResponse(
        identifier,
        'getElement',
        'invokeMarkerFunction'
      );
    },
    async getLngLat() {
      return await invokeGetResponse(
        identifier,
        'getLngLat',
        'invokeMarkerFunction'
      );
    },
    async getOffset() {
      return await invokeGetResponse(
        identifier,
        'getOffset',
        'invokeMarkerFunction'
      );
    },
    async getPitchAlignment() {
      return await invokeGetResponse(
        identifier,
        'getPitchAlignment',
        'invokeMarkerFunction'
      );
    },
    async getPopup() {
      return await invokeGetResponse(
        identifier,
        'getPopup',
        'invokeMarkerFunction'
      );
    },
    async getRotation() {
      return await invokeGetResponse(
        identifier,
        'getRotation',
        'invokeMarkerFunction'
      );
    },
    async getRotationAlignment() {
      return await invokeGetResponse(
        identifier,
        'getRotationAlignment',
        'invokeMarkerFunction'
      );
    },
    async isDraggable() {
      return await invokeGetResponse(
        identifier,
        'isDraggable',
        'invokeMarkerFunction'
      );
    },
    async listens() {
      return await invokeGetResponse(
        identifier,
        'listens',
        'invokeMarkerFunction'
      );
    },
    async removeClassName(className) {
      return await invokeGetResponse(
        identifier,
        'removeClassName',
        'invokeMarkerFunction',
        className
      );
    },
    async setDraggable(shouldBeDraggable) {
      return await invokeGetResponse(
        identifier,
        'setDraggable',
        'invokeMarkerFunction',
        shouldBeDraggable
      );
    },
    async setEventedParent(parent, data = {}) {
      return await invokeGetResponse(
        identifier,
        'setEventedParent',
        'invokeMarkerFunction',
        parent,
        data
      );
    },
    async setLngLat(lnglat) {
      return await invokeGetResponse(
        identifier,
        'setLngLat',
        'invokeMarkerFunction',
        lnglat
      );
    },
    async setOffset(offset) {
      return await invokeGetResponse(
        identifier,
        'setOffset',
        'invokeMarkerFunction',
        offset
      );
    },
    async setOpacity(opacity, opacityWhenCovered) {
      return await invokeGetResponse(
        identifier,
        'setOpacity',
        'invokeMarkerFunction',
        opacity,
        opacityWhenCovered
      );
    },
    async setPitchAlignment(alignment) {
      return await invokeGetResponse(
        identifier,
        'setPitchAlignment',
        'invokeMarkerFunction',
        alignment
      );
    },
    /* TODO - To support in next release with Popup class */
    // async setPopup(popup) {
    //   return await invokeGetResponse(identifier, 'setPopup', 'invokeMarkerFunction', popup);
    // },
    async setRotation(rotation) {
      return await invokeGetResponse(
        identifier,
        'setRotation',
        'invokeMarkerFunction',
        rotation
      );
    },
    async setRotationAlignment(alignment) {
      return await invokeGetResponse(
        identifier,
        'setRotationAlignment',
        'invokeMarkerFunction',
        alignment
      );
    },
    async setSubpixelPositioning(value) {
      return await invokeGetResponse(
        identifier,
        'setSubpixelPositioning',
        'invokeMarkerFunction',
        value
      );
    },
    async toggleClassName(className) {
      return await invokeGetResponse(
        identifier,
        'toggleClassName',
        'invokeMarkerFunction',
        className
      );
    },
    async togglePopup() {
      return await invokeGetResponse(
        identifier,
        'togglePopup',
        'invokeMarkerFunction'
      );
    },
  }));

  /* eslint-disable */
  useEffect(() => {
    console.log('Marker@useEffect[identifier]', 'identifier', identifier);
    if (identifier === null) return;

    // create listener
    eventNames.forEach(item => {
      eventManager.addListener(`marker:${identifier}:${item}`, (e) => onEvent(e));
    });

    // init marker on map
    setTimeout(() => {
      invokeGetResponse(identifier, 'init', 'invokeMarkerFunction', {
        coords: coords,
        options: options,
        eventNames: eventNames,
      });
    }, 500);

    return () => {
      console.log('Marker@useEffect[]', 'exiting', identifier);

       // remove listeners
      eventNames.forEach(item => {
        eventManager.removeAllListeners(`marker:${identifier}:${item}`);
      });

      // remove from map
      invokeGetResponse(identifier, 'remove', 'invokeMarkerFunction', null);
    };
  }, [identifier]);
  /* eslint-enable */

  useEffect(() => {
    console.log('Marker@useEffect[loaded]', 'loaded', loaded);
    if (!loaded) return;
    setIdentifier(makeid(24));
  }, [loaded]);

  return null;
});
