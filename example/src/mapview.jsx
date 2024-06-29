import React from 'react';
import { StyleSheet } from 'react-native';
import { Map, useMaplibreContext } from 'react-native-maplibre-js';
// import { useMaplibreContext } from '../../src/components/maplibre-context';

export default function MapView() {
  // hooks
  const { map } = useMaplibreContext();
  const { getCenter, setCenter } = map;

  const onMapEvent = (name) => {
    console.log('example.MapView@onMapEvent', name);
    if (name === 'load') {
      run();
    }
  };

  const run = async () => {
    console.log('example.MapView@run', 'invoked');
    // setCenter([-74, 38])
    const center = await getCenter();
    console.log('example.MapView@run', 'run', center);
  };

  return (
    <Map
      containerStyle={styles.map}
      options={{
        style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=apikey',
        center: [101.63787, 3.14261],
        zoom: 12,
        preserveDrawingBuffer: true,
      }}
      mapEventListeners={['load']}
      onMapEvent={onMapEvent}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  map: {
    flex: 1,
    maxHeight: '40%',
    width: '100%',
    backgroundColor: '#ecf0f1',
  },
});
