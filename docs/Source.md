# Source API Documentation

Source API is made as a component rather than an API as in the documentation.

## Usage

Create Map and Source component with initial specification

### Important
Source must be a child of a Map component.

The props **specification** is an inital source's specification to be passed into `addSource(id, specification)` method.

In below example, take note on the `id` given to the source. The same `id` is used when associating with `addLayer`'s source.

```js
import { useState, useRef } from 'react';
import { StyleSheet, Text } from 'react-native';
import { 
  MaplibreMap,
  Source,
} from '@neukolabs/react-native-maplibre-js';
  
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

export default function MyComponent() {

  // hooks
  const mapRef = useRef();
  const sourceRef = useRef();

  const onMaploaded = async () => {
    try {
      // once the map is loaded, add layer associated to the source
      await mapRef.current.addLayer({
        'id': 'partner-point',
        'type': 'circle',
        'source': 'mysource',
        'paint': {
            'circle-radius': 12,
            'circle-color': '#FF9900'
        },
        'filter': ['==', '$type', 'Point']
      });
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={styles.container}>
      <MaplibreMap
        ref={mapRef}
        containerStyle={styles.map}
        options={{
          style:
            'https://api.maptiler.com/maps/basic-v2/style.json?key=map_api_key',
          center: [103.63787, 3.14261],
          zoom: 12,
          preserveDrawingBuffer: true,
        }}
        onMapLoadedEvent={(e) => onMaploaded()}
      >
        <Source
          ref={sourceRef}
          id='mysource'
          specification={{
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: [103.532497, 4.694381],
              }
            }
          }}
        />
      </MaplibreMap>
    </View>
  );
}
```

## Methods

### setData
The function used to update the created source with new specification data.

Code below is an example to update the *point* as above code to new location.

```js
export default function MyComponent() {
  // hooks
  const sourceRef = useRef();

  const myFunction = async () => {
    // set to new location
    await sourceRef.current.setData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [103.2323212, 4.23122],
      }
    });

    // usually move the map camera to the same are
    await mapRef.current.setCenter[103.2323212, 4.23122])
  }

  // the rest of the component
}
```
### remove
The function **remove** the source from the map.

```js
export default function MyComponent() {
  // hooks
  const sourceRef = useRef();

  const myFunction = async () => {
    await sourceRef.current.remove();
  }

  // the rest of the component
}
```