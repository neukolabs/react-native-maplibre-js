# Map API Documentation

For most of the methods, please refer the [documentation](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#example)

## Usage

Import hook **useMaplibreContext** and spread from map

```js
import { useMaplibreContext } from '@neukolabs/react-native-maplibre-js';

export default function MyComponent() {
  // hooks
  const { map } = useMaplibreContext();
  const { setCenter, getCenter } = map;

  // the rest of the component
}
```

For action methods such as setCenter, flyTo and etc, you can call as in JS API.

```js
import { useMaplibreContext } from '@neukolabs/react-native-maplibre-js';

export default function MyComponent() {
  // hooks
  const { map } = useMaplibreContext();
  const { setCenter } = map;

  const myFunction = () => {
    setCenter([0, 0]);
  }

  // the rest of the component
}
```

For query methods such as getCenter, hasControl and etc, use **async/await**. This is also applicable for **loadImages** methods

```js
import { useMaplibreContext } from '@neukolabs/react-native-maplibre-js';

export default function MyComponent() {
  // hooks
  const { map } = useMaplibreContext();
  const { getCenter, loadImages } = map;

  const myFunction = async () => {
    await loadImages('https://domain.com/image.png');
    // then do other things

    // other example
    const center = await getCenter();
  }

  // the rest of the component
}
```

## Important

[!IMPORTANT]
All methods must be used after map has been loaded.

```js
import { useMaplibreContext } from '@neukolabs/react-native-maplibre-js';

export default function MyComponent() {
  // hooks
  const { map } = useMaplibreContext();
  const { setCenter } = map;

  // states
  const [mapLoaded, setMapLoaded] = useState(false);

  const myFunction = () => {
    setCenter([0, 0]);
  }

  const onMapEvent = (eventName) => {
    console.log(eventName);
    if (eventName === 'load') {
      setMapLoaded(true)
    }
  };

  useEffect(() => {
    // sanity check
    if (!mapLoaded) return;

    myFunction();
    
  }, [mapLoaded])

  return (
    <Map
      containerStyle={styles.map}
      options={{
        style:
          'https://api.maptiler.com/maps/basic-v2/style.json?key=you-maptiler-key',
        center: [101.63787, 3.14261],
        zoom: 12,
      }}
      mapEventListeners={['load']}
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
