import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import {
  Map,
  Marker,
  useMaplibreContext,
} from '@neukolabs/react-native-maplibre-js';

export default function MapView() {
  // hooks
  const { map } = useMaplibreContext();
  const { getCenter, setCenter } = map;

  // state
  const [showMarker, setShowMarker] = useState(true);

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
    <>
      <Map
        containerStyle={styles.map}
        options={{
          style:
            'https://api.maptiler.com/maps/basic-v2/style.json?key=Lq7r4ksjBkpu8Q8g2ERj',
          center: [101.63787, 3.14261],
          zoom: 12,
          preserveDrawingBuffer: true,
        }}
        mapEventListeners={['load']}
        onMapEvent={onMapEvent}
      >
        {showMarker && (
          <Marker
            options={{
              color: '#ff0000',
              draggable: true,
            }}
            coords={[101.63787, 3.14261]}
          />
        )}
      </Map>
      <TouchableOpacity
        style={{ padding: 10, backgroundColor: 'green' }}
        onPress={() => setShowMarker(!showMarker)}
      >
        <Text style={{ color: 'white' }}>Remove Marker</Text>
      </TouchableOpacity>
    </>
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
