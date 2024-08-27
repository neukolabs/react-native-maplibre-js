# Marker API Documentation

For most of the methods, please refer the [documentation](https://maplibre.org/maplibre-gl-js/docs/API/classes/Marker/)

## Usage

Create Map and Marker in your component.

### Important
Marker must be a child of a Map component.

```js
import { useState, useRef } from 'react';
import { StyleSheet, Text } from 'react-native';
import { 
  MaplibreProvider,
  Map,
  Marker,
  useMaplibreContext,
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
  const markerRef = useRef();

  return (
    <View style={styles.container}>
      <MaplibreProvider>
        <Map
          containerStyle={styles.map}
          options={{
            style:
              'https://api.maptiler.com/maps/basic-v2/style.json?key=map_api_key',
            center: [101.63787, 3.14261],
            zoom: 12,
            preserveDrawingBuffer: true,
          }}
          mapEventListeners={['load']}
          onMapEvent={onMapEvent}
        >
          <Marker
            ref={markerRef}
            options={{
              color: '#ff0000',
              draggable: true,
            }}
            coords={[101.63787, 3.14261]}
            eventNames={['dragend']}
            onEvent={(e) => {
              console.log(e);

              // example to access marker methods
              const pos = markerRef.current.getLngLat();
              console.log(pos);
            }}
          />
        </Map>
      </MaplibreProvider>
    </View>
  );
}
```

For action methods such as setLngLat, it can be done as below.

```js
export default function MyComponent() {
  // hooks
  const markerRef = useRef();

  const myFunction = () => {
    markerRef.current.setLngLat([123, 58]);
  }

  // the rest of the component
}
```

For query methods such as getLngLat, use **async/await**. 

```js
export default function MyComponent() {
  // hooks
  const markerRef = useRef();

  const myFunction = async() => {
    const position = await markerRef.current.getLngLat();
  }

  // the rest of the component
}
```