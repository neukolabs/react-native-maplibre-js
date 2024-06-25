import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import MaplibreProvider from 'react-native-maplibre-js';
import { useMaplibreContext } from '../../src/components/maplibre-context';

export default function MapView() {
  // hooks
  const { loaded, flyTo } = useMaplibreContext();

  const onMapEvent = (name) => {
    console.log('example.MapView@onMapEvent', name);
  };

  useEffect(() => {
    console.log('example.MapView@useEffect[mapLoaded]', loaded);

    if (loaded) {
      console.log('example.MapView@useEffect[mapLoaded]', 'Lets zoom');
      flyTo({
        center: [139.839478, 35.652832],
      });
    }
  }, [loaded, flyTo]);

  return (
    <MaplibreProvider.Map
      containerStyle={styles.map}
      options={{
        style:
          'https://api.maptiler.com/maps/basic-v2/style.json?key=get_your_own_key',
        center: [101.63787, 3.14261],
        zoom: 12,
        preserveDrawingBuffer: true,
      }}
      mapEventListeners={['load']}
      onMapEvent={onMapEvent}
    ></MaplibreProvider.Map>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    maxHeight: '40%',
    width: '100%',
  },
});
