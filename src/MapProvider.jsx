import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useMaplibreContext } from './components/maplibre-context.jsx';
import { MapMethods, eventManager } from './MapMethods.jsx';

export const MapProvider = (props) => {
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
    // sanity check
    if (!e.nativeEvent.data || e.nativeEvent.data === 'undefined') return;

    // process data
    const event = JSON.parse(e.nativeEvent.data);
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
        source={{ html: require('./dist/bundle.js').default }}
        userAgent="Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
        injectedJavaScriptObject={{
          options,
          isDevelopment: false,
          awsRegion,
          mapName,
          authType,
          credentials,
          mapEventListeners,
        }}
        onMessage={(e) => onMessage(e)}
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
  },
});
