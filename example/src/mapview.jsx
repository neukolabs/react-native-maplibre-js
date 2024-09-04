import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import {
  MaplibreMap,
  Marker,
  Source,
} from '@neukolabs/react-native-maplibre-js';

export default function MapView() {
  // hooks
  // const { map } = useMaplibreContext();
  const mapRef = useRef();
  const markerRef = useRef();
  const sourceRef = useRef();
  const routeSourceRef = useRef();

  // state
  const [showMarker, setShowMarker] = useState(true);
  const [counter, setCounter] = useState(0);

  const onMaploaded = async () => {
    try {
      console.debug('example.MapView@onMaploaded');
      await mapRef.current.addLayer({
        id: 'partner-point',
        type: 'circle',
        source: 'mysource',
        paint: {
          'circle-radius': 12,
          'circle-color': '#FF9900',
        },
        filter: ['==', '$type', 'Point'],
      });
      await mapRef.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#ff0000',
          'line-width': 7,
        },
      });
    } catch (err) {
      console.warn(err);
    }
  };

  const onMapEvent = async (name) => {
    console.debug('example.MapView@onMapEvent', name);
    const center = await mapRef.current.getCenter();
    console.debug('example.MapView@onMapEvent', 'center', center);
  };

  const changeLocation = async (index) => {
    const randomLoc = [
      [100.488165, 5.616881],
      [100.47049, 5.67243],
      [100.46419, 5.62321],
      [100.4945, 5.62738],
    ];
    console.debug('example.MapView@changeLocation', randomLoc[index]);
    await sourceRef.current.setData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: randomLoc[index],
      },
    });
    await mapRef.current.setCenter(randomLoc[index]);
  };

  // const run = async () => {
  //   console.log('example.MapView@run', 'invoked');
  //   // setCenter([-74, 38]);
  //   // markerRef.current.setLngLat([-74, 38]);
  //   const center = await getCenter();
  //   console.log('example.MapView@run', 'run', center);
  // };

  useEffect(() => {
    if (counter !== 0) changeLocation(counter);
  }, [counter]);

  return (
    <>
      <MaplibreMap
        ref={mapRef}
        containerStyle={styles.map}
        options={{
          style:
            'https://api.maptiler.com/maps/basic-v2/style.json?key=you-maptiler-key',
          center: [100.532497, 5.694381],
          zoom: 18,
          preserveDrawingBuffer: true,
        }}
        // mapEventListeners={['load', 'dragend']}
        onMapEvent={onMapEvent}
        onMapLoadedEvent={(e) => onMaploaded()}
      >
        {/* <Marker
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
        /> */}
        <Source
          ref={sourceRef}
          id="mysource"
          specification={{
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: [100.532497, 5.694381],
              },
            },
          }}
        />
      </MaplibreMap>
      <TouchableOpacity
        style={{ padding: 10, backgroundColor: 'green' }}
        onPress={() => {
          if (counter === 3) setCounter(0);
          else setCounter(counter + 1);
        }}
      >
        <Text style={{ color: 'white' }}>ChangeLocation</Text>
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
