import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter.js';
import { makeid } from './utilities';

// global
export const eventManager = new EventEmitter();

/* This code snippet is defining a constant object `CONTROL_POSITION` using `Object.freeze()`. The
object contains properties with specific string values representing different control positions:
`NULL`, `TOP_RIGHT`, `TOP_LEFT`, `BOTTOM_RIGHT`, and `BOTTOM_LEFT`. */
export const CONTROL_POSITION = Object.freeze({
  NULL: null,
  TOP_RIGHT: 'top-right',
  TOP_LEFT: 'top-left',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_LEFT: 'bottom-left',
});

export const MapMethods = (mapRef) => {
  /**
   * The function `invokeGetResponse` asynchronously sends a request with a function name and
   * arguments, listens for a response, and resolves with the received parameters.
   * @returns The `invokeGetResponse` function is returning a Promise.
   */
  const invokeGetResponse = async (name, ...args) => {
    // generate random id
    const id = makeid(24);
    console.log('MapMethods@invokeGetResponse', id, name, args);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject('MapMethodTimeoutError');
      }, 2000);

      eventManager.addListener(id, (params) => {
        clearTimeout(timeout);
        eventManager.removeAllListeners(id);
        resolve(params);
      });

      // send data
      mapRef.postMessage(
        JSON.stringify({
          type: 'getResponseMapFunction',
          functionName: name,
          arguments: [...args],
          requestId: id,
        })
      );
    });
  };

  return {
    addControl: async (position = CONTROL_POSITION.TOP_RIGHT) =>
      invokeGetResponse('addControl', position),
    addImage: async (name = '', image = null, options = {}) =>
      invokeGetResponse('addImage', name, image, options),
    addLayer: async (layer = {}, beforeId = null) =>
      invokeGetResponse('addLayer', layer, beforeId),
    addSource: async (id = '', source = {}) =>
      invokeGetResponse('addSource', id, source),
    addSprite: async (id, url, options = {}) =>
      invokeGetResponse('addSprite', id, url, options),
    areTilesLoaded: async () => invokeGetResponse('areTilesLoaded'),
    cameraForBounds: async (bounds, options = {}) =>
      invokeGetResponse('cameraForBounds', bounds, options),
    easeTo: async (options = {}, eventData = null) =>
      invokeGetResponse('easeTo', options, eventData),
    fitBounds: async (bounds, options = {}, eventData = null) =>
      invokeGetResponse('fitBounds', bounds, options, eventData),
    fitScreenCoordinates: async (
      p0,
      p1,
      bearing,
      options = {},
      eventData = null
    ) =>
      invokeGetResponse(
        'fitScreenCoordinates',
        p0,
        p1,
        bearing,
        options,
        eventData
      ),
    flyTo: async (coordinate = [0, 0], eventData = null) =>
      invokeGetResponse('flyTo', coordinate, eventData),
    getBearing: async () => invokeGetResponse('getBearing'),
    getBounds: async () => invokeGetResponse('getBounds'),
    getCameraTargetElevation: async () =>
      invokeGetResponse('getCameraTargetElevation'),
    getCanvas: async () => invokeGetResponse('getCanvas'),
    getCanvasContainer: async () => invokeGetResponse('getCanvasContainer'),
    getCenter: async () => invokeGetResponse('getCenter'),
    getContainer: async () => invokeGetResponse('getContainer'),
    getFeatureState: async (feature) =>
      invokeGetResponse('getFeatureState', feature),
    getFilter: async (layerId) => invokeGetResponse('getFilter', layerId),
    getGlyphs: async () => invokeGetResponse('getGlyphs'),
    getImage: async (id) => invokeGetResponse('getImage', id),
    getLayer: async (id) => invokeGetResponse('getLayer', id),
    getLayerOrder: async () => invokeGetResponse('getLayerOrder'),
    getLayersOrder: async () => invokeGetResponse('getLayersOrder'),
    getLayoutProperty: async (layerId, name) =>
      invokeGetResponse('getLayoutProperty', layerId, name),
    getLight: async () => invokeGetResponse('getLight'),
    getMaxBounds: async () => invokeGetResponse('getMaxBounds'),
    getMaxPitch: async () => invokeGetResponse('getMaxPitch'),
    getMaxZoom: async () => invokeGetResponse('getMaxZoom'),
    getMinPitch: async () => invokeGetResponse('getMinPitch'),
    getMinZoom: async () => invokeGetResponse('getMinZoom'),
    getPadding: async () => invokeGetResponse('getPadding'),
    getPaintProperty: async (layerId, name) =>
      invokeGetResponse('getPaintProperty', layerId, name),
    getPitch: async () => invokeGetResponse('getPitch'),
    getPixelRatio: async () => invokeGetResponse('getPixelRatio'),
    getRenderWorldCopies: async () => invokeGetResponse('getRenderWorldCopies'),
    getSource: async (id) => invokeGetResponse('getSource', id),
    getSprite: async () => invokeGetResponse('getSprite'),
    getStyle: async () => invokeGetResponse('getStyle'),
    getTerrain: async () => invokeGetResponse('getTerrain'),
    getZoom: async () => invokeGetResponse('getZoom'),
    hasControl: async () => invokeGetResponse('hasControl'),
    hasImage: async (id) => invokeGetResponse('hasImage', id),
    isMoving: async () => invokeGetResponse('isMoving'),
    isRotating: async () => invokeGetResponse('isRotating'),
    isSourceLoaded: async (id) => invokeGetResponse('isSourceLoaded', id),
    isStyleLoaded: async () => invokeGetResponse('isStyleLoaded'),
    isZooming: async () => invokeGetResponse('isZooming'),
    jumpTo: async (options = {}, eventData = null) =>
      invokeGetResponse('jumpTo', options, eventData),
    listImages: async () => invokeGetResponse('listImages'),
    listens: async (type) => invokeGetResponse('listens', type),
    loadImages: async (url) => invokeGetResponse('loadImages', url),
    loaded: async () => invokeGetResponse('loaded'),
    moveLayer: async (id, beforeId) =>
      invokeGetResponse('moveLayer', id, beforeId),
    panBy: async (offset, options = {}, eventData = null) =>
      invokeGetResponse('panBy', offset, options, eventData),
    panTo: async (lnglat, options = {}, eventData = null) =>
      invokeGetResponse('panTo', lnglat, options, eventData),
    project: async (lnglat) => invokeGetResponse('project', lnglat),
    queryRenderedFeatures: async (geometryOrOptions = {}, options = {}) =>
      invokeGetResponse('queryRenderedFeatures', geometryOrOptions, options),
    querySourceFeatures: async (sourceId, parameters = {}) =>
      invokeGetResponse('querySourceFeatures', sourceId, parameters),
    queryTerrainElevation: async (lngLatLike) =>
      invokeGetResponse('queryTerrainElevation', lngLatLike),
    redraw: async () => invokeGetResponse('redraw'),
    remove: async () => invokeGetResponse('remove'),
    removeControl: async () => invokeGetResponse('removeControl'),
    removeFeatureState: async (target, key = null) =>
      invokeGetResponse('removeFeatureState', target, key),
    removeImage: async (id) => invokeGetResponse('removeImage', id),
    removeLayer: async (id) => invokeGetResponse('removeLayer', id),
    removeSource: async (id) => invokeGetResponse('removeSource', id),
    removeSprite: async (id) => invokeGetResponse('removeSprite', id),
    resetNorth: async (options = {}, eventData = null) =>
      invokeGetResponse('resetNorth', options, eventData),
    resetNorthPitch: async (options = {}, eventData = null) =>
      invokeGetResponse('resetNorthPitch', options, eventData),
    resize: async (eventData = null) => invokeGetResponse('resize', eventData),
    rotateTo: async (bearing, options = {}, eventData = null) =>
      invokeGetResponse('rotateTo', bearing, options, eventData),
    setBearing: async (bearing, eventData = null) =>
      invokeGetResponse('setBearing', bearing, eventData),
    setCenter: async (center, eventData = null) =>
      invokeGetResponse('setCenter', center, eventData),
    setEventedParent: async (parent = null, data = null) =>
      invokeGetResponse('setEventedParent', parent, data),
    setFeatureState: async (feature, state) =>
      invokeGetResponse('setFeatureState', feature, state),
    setFilter: async (layerId, filter = {}, options = {}) =>
      invokeGetResponse('setFilter', layerId, filter, options),
    setGlyphs: async (glyphsUrl, options) =>
      invokeGetResponse('setGlyphs', glyphsUrl, options),
    setLayerZoomRange: async (layerId, minzoom, maxzoom) =>
      invokeGetResponse('setLayerZoomRange', layerId, minzoom, maxzoom),
    setLayoutProperty: async (layerId, name, value, options) =>
      invokeGetResponse('setLayoutProperty', layerId, name, value, options),
    setLight: async (light, options) =>
      invokeGetResponse('setLight', light, options),
    setMaxBounds: async (bounds) => invokeGetResponse('setMaxBounds', bounds),
    setMaxPitch: async (maxPitch) => invokeGetResponse('setMaxPitch', maxPitch),
    setMaxZoom: async (maxZoom) => invokeGetResponse('setMaxZoom', maxZoom),
    setMinPitch: async (minPitch) => invokeGetResponse('setMinPitch', minPitch),
    setMinZoom: async (minZoom) => invokeGetResponse('setMinZoom', minZoom),
    setPadding: async (padding, eventData = null) =>
      invokeGetResponse('setPadding', padding, eventData),
    setPaintProperty: async (layerId, name, value, options) =>
      invokeGetResponse('setPaintProperty', layerId, name, value, options),
    setPitch: async (pitch, eventData = null) =>
      invokeGetResponse('setPitch', pitch, eventData),
    setPixelRatio: async (pixelRatio) =>
      invokeGetResponse('setPixelRatio', pixelRatio),
    setRenderWorldCopies: async (renderWorldCopies) =>
      invokeGetResponse('setRenderWorldCopies', renderWorldCopies),
    setSprite: async (spriteUrl, options) =>
      invokeGetResponse('setSprite', spriteUrl, options),
    setStyle: async (style, options) =>
      invokeGetResponse('setStyle', style, options),
    setTerrain: async (options) => invokeGetResponse('setTerrain', options),
    setTransformRequest: async (transformRequest) =>
      invokeGetResponse('setTransformRequest', transformRequest),
    setZoom: async (zoom, eventData = null) =>
      invokeGetResponse('setZoom', zoom, eventData),
    snapToNorth: async (options = {}, eventData = null) =>
      invokeGetResponse('snapToNorth', options, eventData),
    stop: async () => invokeGetResponse('stop'),
    triggerRepaint: async () => invokeGetResponse('triggerRepaint'),

    unproject: async (point) => invokeGetResponse('unproject', point),

    updateImage: async (id, image) =>
      invokeGetResponse('updateImage', id, image),

    zoomIn: async (options = {}, eventData = null) =>
      invokeGetResponse('zoomIn', options, eventData),

    zoomOut: async (options = {}, eventData = null) =>
      invokeGetResponse('zoomOut', options, eventData),

    zoomTo: async (zoom = 12, options = {}, eventData = null) =>
      invokeGetResponse('zoomTo', zoom, options, eventData),
  };
};
