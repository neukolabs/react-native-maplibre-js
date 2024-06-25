import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useMaplibreMapContext } from './components/map-context';

const content = require('./dist/bundle.js');

const defaultStyle = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    margin: 20,
  },
});

export default function MapProvider(props) {
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
  const webviewRef = useRef();
  const { ref, setRef, setLoaded } = useMaplibreMapContext();

  // states

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
    try {
      switch (event.type) {
        case 'log':
          console.log(event.payload.message);
          break;
        case 'mapEvent':
          dispatchEvent(event.payload.name);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('MapProvider.onMessage', err);
    }
  };

  useEffect(() => {
    // sanity check
    if (ref) return;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    setRef(webviewRef);
  }, [ref, setRef]);

  return (
    <View style={containerStyle}>
      <WebView
        ref={webviewRef}
        source={{ html: content.default }}
        userAgent="Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
        injectedJavaScriptObject={{
          options,
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
}
