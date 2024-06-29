import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useMaplibreContext } from '../components/maplibre-context.jsx';
import { MapMethods, eventManager } from './MapMethods.jsx';
import { webviewOnloadedJs } from './utilities.jsx';

export const Map = (props) => {
  // input
  const {
    containerStyle = defaultStyle.container,
    options = null,
    awsRegion = 'us-east-1',
    mapName,
    authType,
    credentials = null,
    mapEventListeners = [],
    onMapEvent = () => {},
  } = props;

  // hooks
  const { map } = useMaplibreContext();
  const { mapRef, setMapRef, setLoaded, setMapMethod } = map;

  const dispatchEvent = (name) => {
    switch (name) {
      case 'load':
        setLoaded(true);
        onMapEvent(name);
        break;
      default:
        break;
    }
  };

  const onMessage = (e) => {
    // console.log('MapProvider.onMessage', 'e', e);
    // sanity check
    if (!e.nativeEvent.data || e.nativeEvent.data === 'undefined') return;

    // process data
    let event = null;
    try {
      event = JSON.parse(e.nativeEvent.data);
    } catch (err) {
      return;
    }
    console.log('MapProvider.onMessage', 'event', event);
    try {
      switch (event.type) {
        case 'log':
          console.log(event.payload.message);
          break;
        case 'mapEvent':
          dispatchEvent(event.payload.name);
          break;
        case 'invokeResponse':
          eventManager.emit(event.requestId, event.payload);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('MapProvider.onMessage', err);
    }
  };

  const handleWebRef = (ref) => {
    // sanity check
    if (mapRef || !ref) return;
    setMapRef(ref);
  };

  useEffect(() => {
    // sanity check
    if (!mapRef) return;

    setMapMethod(MapMethods(mapRef));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef]);

  return (
    <View style={containerStyle}>
      <WebView
        ref={handleWebRef}
        originWhitelist={['*']}
        source={{ html: require('../dist/bundle.js').default }}
        domStorageEnabled={true}
        mixedContentMode="always"
        injectedJavaScript={webviewOnloadedJs({
          options: options,
          mapEventListeners: mapEventListeners,
        })}
        javaScriptEnabled={true}
        onMessage={(e) => onMessage(e)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
      />
    </View>
  );
};

const defaultStyle = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    margin: 20,
    backgroundColor: '#ecf0f1',
  },
});
