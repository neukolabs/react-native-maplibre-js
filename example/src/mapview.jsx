import React, { useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaplibreMap, Marker } from '@neukolabs/react-native-maplibre-js';

export default function MapView() {
  // hooks
  // const { map } = useMaplibreContext();
  const mapRef = useRef();
  const markerRef = useRef();

  // state
  const [showMarker, setShowMarker] = useState(true);

  const onMaploaded = async () => {
    try {
      console.debug('example.MapView@onMaploaded');
    } catch (err) {
      console.warn(err);
    }
  };

  const onMapEvent = async (name) => {
    console.debug('example.MapView@onMapEvent', name);
    const center = await mapRef.current.getCenter();
    console.debug('example.MapView@onMapEvent', 'center', center);
  };

  // const run = async () => {
  //   console.log('example.MapView@run', 'invoked');
  //   // setCenter([-74, 38]);
  //   // markerRef.current.setLngLat([-74, 38]);
  //   const center = await getCenter();
  //   console.log('example.MapView@run', 'run', center);
  // };

  return (
    <>
      <MaplibreMap
        ref={mapRef}
        containerStyle={styles.map}
        options={{
          style:
            'https://api.maptiler.com/maps/basic-v2/style.json?key=you-maptiler-key',
          center: [100.532497, 5.694381],
          zoom: 12,
          preserveDrawingBuffer: true,
        }}
        // mapEventListeners={['load', 'dragend']}
        onMapEvent={onMapEvent}
        onMapLoadedEvent={(e) => onMaploaded()}
      >
        <Marker
          ref={markerRef}
          options={{
            color: '#ff0000',
            draggable: true,
          }}
          coords={[100.532497, 5.694381]}
          eventNames={['dragend']}
          onEvent={async (e) => {
            console.log('example.MapView@Marker#onEvent', e);
            const pos = await markerRef.current.getLngLat();
            console.log('example.MapView@Marker#onEvent', 'pos', pos);
            await mapRef.current.setCenter([pos.lng, pos.lat]);
          }}
        />
      </MaplibreMap>
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
