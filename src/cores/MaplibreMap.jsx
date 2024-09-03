import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter.js';
import MaplibreContext from '../components/maplibre-context';
import { webviewOnloadedJs, makeid } from './utilities';
import { AwsMapAuthentication } from './AWSLocationServiceMap';

export const CONTROL_POSITION = Object.freeze({
  NULL: null,
  TOP_RIGHT: 'top-right',
  TOP_LEFT: 'top-left',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_LEFT: 'bottom-left',
});

export const MaplibreMap = forwardRef((props, ref) => {
  // input
  const {
    containerStyle = defaultStyle.container,
    options = null,
    mapEventListeners = [],
    onMapEvent = () => {},
    onMapLoadedEvent = () => {},
    awsLocationService = AwsMapAuthentication,
    children,
  } = props;
  const eventManager = new EventEmitter();

  // hooks
  const mapRef = useRef();

  // states
  const [loaded, setLoaded] = useState(false);

  /**
   * The function `normalizedEventListeners` ensures that the event name 'load' is included in the
   * array of event names provided as input.
   * @returns The function `normalizedEventListeners` returns an array of event names with the event
   * name 'load' added if it is not already included in the input array.
   */
  const normalizedEventListeners = (eventNames = []) => {
    let _newEvents = eventNames;
    if (eventNames.indexOf('load') === -1) {
      _newEvents = eventNames.concat(['load']);
    }
    return _newEvents;
  };

  /**
   * The `dispatchEvent` function handles different event names by either setting a boolean value to
   * true or calling another function.
   */
  const dispatchEvent = (name) => {
    switch (name) {
      case 'load':
        setLoaded(true);
        break;
      default:
        onMapEvent(name);
        break;
    }
  };

  /**
   * The function `onMessage` processes incoming events in a React component, parsing JSON data and
   * handling different event types accordingly.
   * @returns In the `onMessage` function, if the condition `(!e.nativeEvent.data || e.nativeEvent.data
   * === 'undefined')` is true, then the function will return early without processing the data.
   */
  const onMessage = (e) => {
    // sanity check
    if (!e.nativeEvent.data || e.nativeEvent.data === 'undefined') return;

    // process data
    let event = null;
    try {
      event = JSON.parse(e.nativeEvent.data);
    } catch (err) {
      return;
    }
    // console.debug('MaplibreMap.onMessage', 'event', event);
    try {
      switch (event.type) {
        case 'log':
          // console.log(event.payload.message);
          break;
        case 'mapEvent':
          dispatchEvent(event.payload.name);
          break;
        case 'markerEvent':
          eventManager.emit(
            `marker:${event.markerId}:${event.payload.name}`,
            event.payload
          );
          break;
        case 'invokeResponse':
          eventManager.emit(event.requestId, event.payload);
          break;
        case 'invokeMarkerResponse':
          eventManager.emit(event.requestId, event.payload);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('MaplibreMap.onMessage', err);
    }
  };

  /**
   * The function `invokeGetResponse` asynchronously sends a request to a map component with a
   * specified function name and arguments, and resolves with the response received within a timeout
   * period.
   * @returns The `invokeGetResponse` function is returning a Promise.
   */
  const invokeGetResponse = async (name, ...args) => {
    // generate random id
    const id = makeid(24);
    console.debug('MaplibreMap@invokeGetResponse', id, name, args);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject('MapMethodTimeoutError');
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
          type: 'getResponseMapFunction',
          functionName: name,
          arguments: [...args],
          requestId: id,
        })
      );
    });
  };

  /**
   * The `invokeFunction` function asynchronously invokes a specified function with arguments and
   * returns a promise that resolves with the result.
   * @returns The `invokeFunction` function is returning a Promise.
   */
  const invokeFunction = async (name, ...args) => {
    // generate random id
    const id = makeid(24);
    // console.debug('MaplibreMap@invokeFunction', id, name, args);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject('MapMethodTimeoutError');
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
          type: 'invokeMapFunction',
          functionName: name,
          arguments: [...args],
          requestId: id,
        })
      );
    });
  };

  useImperativeHandle(ref, () => ({
    async addControl(position = CONTROL_POSITION.TOP_RIGHT) {
      return await invokeFunction('addControl', position);
    },
    async addImage(name = '', image = null, _options = {}) {
      return await invokeFunction('addImage', name, image, _options);
    },
    async addLayer(layer = {}, beforeId = null) {
      return await invokeFunction('addLayer', layer, beforeId);
    },
    async addSource(id = '', source = {}) {
      return await invokeFunction('addSource', id, source);
    },
    async addSprite(id, url, _options = {}) {
      return await invokeFunction('addSprite', id, url, _options);
    },
    async areTilesLoaded() {
      return await invokeGetResponse('areTilesLoaded');
    },
    async cameraForBounds(bounds, _options = {}) {
      return await invokeGetResponse('cameraForBounds', bounds, _options);
    },
    async easeTo(_options = {}, eventData = null) {
      return await invokeFunction('easeTo', _options, eventData);
    },
    async fitBounds(bounds, _options = {}, eventData = null) {
      return await invokeFunction('fitBounds', bounds, _options, eventData);
    },
    async fitScreenCoordinates(
      p0,
      p1,
      bearing,
      _options = {},
      eventData = null
    ) {
      return await invokeFunction(
        'fitScreenCoordinates',
        p0,
        p1,
        bearing,
        _options,
        eventData
      );
    },
    async flyTo(coordinate = [0, 0], eventData = null) {
      return await invokeFunction('flyTo', coordinate, eventData);
    },
    async getBearing() {
      return await invokeGetResponse('getBearing');
    },
    async getBounds() {
      return await invokeGetResponse('getBounds');
    },
    async getCameraTargetElevation() {
      return await invokeGetResponse('getCameraTargetElevation');
    },
    async getCanvas() {
      return await invokeGetResponse('getCanvas');
    },
    async getCanvasContainer() {
      return await invokeGetResponse('getCanvasContainer');
    },
    async getCenter() {
      // console.debug('someone asking for center');
      return await invokeGetResponse('getCenter');
    },
    async getContainer() {
      return await invokeGetResponse('getContainer');
    },
    async getFeatureState(feature) {
      return await invokeGetResponse('getFeatureState', feature);
    },
    async getFilter(layerId) {
      return await invokeGetResponse('getFilter', layerId);
    },
    async getGlyphs() {
      return await invokeGetResponse('getGlyphs');
    },
    async getImage(id) {
      return await invokeGetResponse('getImage', id);
    },
    async getLayer(id) {
      return await invokeGetResponse('getLayer', id);
    },
    async getLayerOrder() {
      return await invokeGetResponse('getLayerOrder');
    },
    async getLayersOrder() {
      return await invokeGetResponse('getLayersOrder');
    },
    async getLayoutProperty(layerId, name) {
      return await invokeGetResponse('getLayoutProperty', layerId, name);
    },
    async getLight() {
      return await invokeGetResponse('getLight');
    },
    async getMaxBounds() {
      return await invokeGetResponse('getMaxBounds');
    },
    async getMaxPitch() {
      return await invokeGetResponse('getMaxPitch');
    },
    async getMaxZoom() {
      return await invokeGetResponse('getMaxZoom');
    },
    async getMinPitch() {
      return await invokeGetResponse('getMinPitch');
    },
    async getMinZoom() {
      return await invokeGetResponse('getMinZoom');
    },
    async getPadding() {
      return await invokeGetResponse('getPadding');
    },
    async getPaintProperty(layerId, name) {
      return await invokeGetResponse('getPaintProperty', layerId, name);
    },
    async getPitch() {
      return await invokeGetResponse('getPitch');
    },
    async getPixelRatio() {
      return await invokeGetResponse('getPixelRatio');
    },
    async getRenderWorldCopies() {
      return await invokeGetResponse('getRenderWorldCopies');
    },
    async getSource(id) {
      return await invokeGetResponse('getSource', id);
    },
    async getSprite() {
      return await invokeGetResponse('getSprite');
    },
    async getStyle() {
      return await invokeGetResponse('getStyle');
    },
    async getTerrain() {
      return await invokeGetResponse('getTerrain');
    },
    async getZoom() {
      return await invokeGetResponse('getZoom');
    },
    async hasControl() {
      return await invokeGetResponse('hasControl');
    },
    async hasImage(id) {
      return await invokeGetResponse('hasImage', id);
    },
    async isMoving() {
      return await invokeGetResponse('isMoving');
    },
    async isRotating() {
      return await invokeGetResponse('isRotating');
    },
    async isSourceLoaded(id) {
      return await invokeGetResponse('isSourceLoaded', id);
    },
    async isStyleLoaded() {
      return await invokeGetResponse('isStyleLoaded');
    },
    async isZooming() {
      return await invokeGetResponse('isZooming');
    },
    async jumpTo(_options = {}, eventData = null) {
      return await invokeFunction('jumpTo', _options, eventData);
    },
    async listImages() {
      return await invokeGetResponse('listImages');
    },
    async listens(type) {
      return await invokeGetResponse('listens', type);
    },
    async loadImages(url) {
      return await invokeGetResponse('loadImages', url);
    },
    async loaded() {
      return await invokeGetResponse('loaded');
    },
    async moveLayer(id, beforeId) {
      return await invokeFunction('moveLayer', id, beforeId);
    },
    async panBy(offset, _options = {}, eventData = null) {
      return await invokeFunction('panBy', offset, _options, eventData);
    },
    async panTo(lnglat, _options = {}, eventData = null) {
      return await invokeFunction('panTo', lnglat, _options, eventData);
    },
    async project(lnglat) {
      return await invokeGetResponse('project', lnglat);
    },
    async queryRenderedFeatures(geometryOr_options = {}, _options = {}) {
      return await invokeGetResponse(
        'queryRenderedFeatures',
        geometryOr_options,
        _options
      );
    },
    async querySourceFeatures(sourceId, parameters = {}) {
      return await invokeGetResponse(
        'querySourceFeatures',
        sourceId,
        parameters
      );
    },
    async queryTerrainElevation(lngLatLike) {
      return await invokeGetResponse('queryTerrainElevation', lngLatLike);
    },
    async redraw() {
      return await invokeFunction('redraw');
    },
    async remove() {
      return await invokeFunction('remove');
    },
    async removeControl() {
      return await invokeFunction('removeControl');
    },
    async removeFeatureState(target, key = null) {
      return await invokeFunction('removeFeatureState', target, key);
    },
    async removeImage(id) {
      return await invokeFunction('removeImage', id);
    },
    async removeLayer(id) {
      return await invokeFunction('removeLayer', id);
    },
    async removeSource(id) {
      return await invokeFunction('removeSource', id);
    },
    async removeSprite(id) {
      return await invokeFunction('removeSprite', id);
    },
    async resetNorth(_options = {}, eventData = null) {
      return await invokeFunction('resetNorth', _options, eventData);
    },
    async resetNorthPitch(_options = {}, eventData = null) {
      return await invokeFunction('resetNorthPitch', _options, eventData);
    },
    async resize(eventData = null) {
      return await invokeFunction('resize', eventData);
    },
    async rotateTo(bearing, _options = {}, eventData = null) {
      return await invokeFunction('rotateTo', bearing, _options, eventData);
    },
    async setBearing(bearing, eventData = null) {
      return await invokeFunction('setBearing', bearing, eventData);
    },
    async setCenter(center, eventData = null) {
      return await invokeFunction('setCenter', center, eventData);
    },
    // async setEventedParent(parent = null, data = null) {
    //   return await invokeGetResponse('setEventedParent', parent, data);
    // },
    async setFeatureState(feature, state) {
      return await invokeFunction('setFeatureState', feature, state);
    },
    async setFilter(layerId, filter = {}, _options = {}) {
      return await invokeFunction('setFilter', layerId, filter, _options);
    },
    async setGlyphs(glyphsUrl, _options) {
      return await invokeFunction('setGlyphs', glyphsUrl, _options);
    },
    async setLayerZoomRange(layerId, minzoom, maxzoom) {
      return await invokeFunction(
        'setLayerZoomRange',
        layerId,
        minzoom,
        maxzoom
      );
    },
    async setLayoutProperty(layerId, name, value, _options) {
      return await invokeFunction(
        'setLayoutProperty',
        layerId,
        name,
        value,
        _options
      );
    },
    async setLight(light, _options) {
      return await invokeFunction('setLight', light, _options);
    },
    async setMaxBounds(bounds) {
      return await invokeFunction('setMaxBounds', bounds);
    },
    async setMaxPitch(maxPitch) {
      return await invokeFunction('setMaxPitch', maxPitch);
    },
    async setMaxZoom(maxZoom) {
      return await invokeFunction('setMaxZoom', maxZoom);
    },
    async setMinPitch(minPitch) {
      return await invokeFunction('setMinPitch', minPitch);
    },
    async setMinZoom(minZoom) {
      return await invokeFunction('setMinZoom', minZoom);
    },
    async setPadding(padding, eventData = null) {
      return await invokeFunction('setPadding', padding, eventData);
    },
    async setPaintProperty(layerId, name, value, _options) {
      return await invokeFunction(
        'setPaintProperty',
        layerId,
        name,
        value,
        _options
      );
    },
    async setPitch(pitch, eventData = null) {
      return await invokeFunction('setPitch', pitch, eventData);
    },
    async setPixelRatio(pixelRatio) {
      return await invokeFunction('setPixelRatio', pixelRatio);
    },
    async setRenderWorldCopies(renderWorldCopies) {
      return await invokeFunction('setRenderWorldCopies', renderWorldCopies);
    },
    async setSprite(spriteUrl, _options) {
      return await invokeFunction('setSprite', spriteUrl, _options);
    },
    async setStyle(style, _options) {
      return await invokeFunction('setStyle', style, _options);
    },
    async setTerrain(_options) {
      return await invokeFunction('setTerrain', _options);
    },
    async setTransformRequest(transformRequest) {
      return await invokeFunction('setTransformRequest', transformRequest);
    },
    async setZoom(zoom, eventData = null) {
      return await invokeFunction('setZoom', zoom, eventData);
    },
    async snapToNorth(_options = {}, eventData = null) {
      return await invokeFunction('snapToNorth', _options, eventData);
    },
    async stop() {
      return await invokeFunction('stop');
    },
    async triggerRepaint() {
      return await invokeFunction('triggerRepaint');
    },

    async unproject(point) {
      return await invokeGetResponse('unproject', point);
    },

    async updateImage(id, image) {
      return await invokeFunction('updateImage', id, image);
    },

    async zoomIn(_options = {}, eventData = null) {
      return await invokeFunction('zoomIn', _options, eventData);
    },

    async zoomOut(_options = {}, eventData = null) {
      return await invokeFunction('zoomOut', _options, eventData);
    },

    async zoomTo(zoom = 12, _options = {}, eventData = null) {
      return await invokeFunction('zoomTo', zoom, _options, eventData);
    },
  }));

  /* eslint-disable */
  useEffect(() => {
    if (loaded) onMapLoadedEvent(true);
  }, [loaded]);
  /* eslint-enable */

  return (
    <MaplibreContext.Provider
      value={{
        map: {
          _internalMapRef: mapRef,
          loaded: loaded,
        },
        eventManager: eventManager,
      }}
    >
      <View style={containerStyle}>
        <WebView
          ref={mapRef}
          originWhitelist={['*']}
          source={{ html: require('../dist/bundle.js').default }}
          domStorageEnabled={true}
          mixedContentMode="always"
          injectedJavaScript={webviewOnloadedJs({
            options: options,
            mapEventListeners: normalizedEventListeners(mapEventListeners),
            awsAuthentication: awsLocationService,
          })}
          javaScriptEnabled={true}
          onMessage={(e) => onMessage(e)}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            // console.warn('WebView error: ', nativeEvent);
          }}
        >
          {children}
        </WebView>
      </View>
    </MaplibreContext.Provider>
  );
});

/* The above code is defining a default style object using the `StyleSheet.create` method in React
Native. The `defaultStyle` object contains a `container` property with styling rules for a container
element. The container has a flex value of 1, height and width set to '100%', a margin of 20 units,
and a background color of '#ecf0f1'. This style object can be used to apply consistent styling to
container elements in a React Native application. */
const defaultStyle = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    margin: 20,
    backgroundColor: '#ecf0f1',
  },
});
