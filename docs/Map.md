# Map API Documentation

For most of the methods, please refer the [documentation](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#example)

## Usage

Set ref to the MaplibreMap and now the ref is exposed with the methods as in the API document.

```js
import { useRef } from 'react';
import { MaplibreMap } from '@neukolabs/react-native-maplibre-js';

export default function MyComponent() {
  // hooks
  const mapRef = useRef();

  const onMapEvent = async (eventName) => {
    if (eventName === 'dragend') {
      const center = await mapRef.current.getCenter();
      console.log(center);
      // output {"lat": some number, "lng": some number}
    }
  };

  return (
    <MaplibreMap
      containerStyle={styles.map}
      ref={mapRef}
      options={{
        style:
          'https://api.maptiler.com/maps/basic-v2/style.json?key=you-maptiler-key',
        center: [101.63787, 3.14261],
        zoom: 12,
      }}
      mapEventListeners={['dragend']}
      onMapEvent={onMapEvent}
    />
  );
}
```


## Exceptions

For below methods, the arguments are without the first argument.

|Method|How to invoke|Remarks|
|------|-------------|-------|
|addControl|addControl(position?)|position on the map to which the control will be added. Valid values are 'top-left', 'top-right', 'bottom-left', and 'bottom-right'. Defaults to 'top-right'.|
|hasControl|hasControl()||
|removeControl|removeControl()||
|addSource| Use `Source` component | Refer to [docs](./Source.md)|
|getSource| Use `Source` component | Refer to [docs](./Source.md)|
|removeSource| Use `Source` component | Refer to [docs](./Source.md)|
