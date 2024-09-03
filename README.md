# React-Native Maplibre JS

A Maplibre JS wrapper for react-native. The package uses Javascript APIs to help developer interact with the map that being rendered by react-native-webview.

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Table of Content

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- Guides
- - [Map API Documentation](./docs/Map.md)
- - [Marker API Documentation](./docs/Marker.md)
- [Motivation](#motivation)
- [Contribution](#contributing)

## Installation

If you are npm-er
```sh
npm install @neukolabs/react-native-maplibre-js react-native-webview
```

For those yarn-er
```sh
yarn add @neukolabs/react-native-maplibre-js react-native-webview
```

## Link Native Dependencies

### iOS & macOS

If you are using Cocoapods, run below command:

```sh
npx pod-install
```

I have no idea for else cases other than Cocoapods.

### Android

There is no more extra step after installation.

### React-native webview

This library uses [react-native-webview](https://github.com/react-native-webview/react-native-webview). The linkage is basically to link **react-native-webview**.

For additional information for the package linkage, please refer to the package instruction.

## Minimal usage

### Step 1: Call MaplibreMap in your component

```js
import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { MaplibreMap } from '@neukolabs/react-native-maplibre-js';

export default function MapView() {
  // hooks
  const mapRef = useRef();

  const onMaploaded = async (e) => {
    console.log('map is loaded');
    
    // let's go to the ocean
      await mapRef.current.setCenter([-74, 38]);
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
      onMapLoadedEvent={(e) => onMaploaded()}
    />
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    maxHeight: '100%',
    width: '100%',
  },
});
```

## Examples

### 1. Get current map center coordinates after drag

Watch for props **mapEventListeners** to listen for event.

```js
import { useRef } from 'react';
import { MaplibreMap } from '@neukolabs/react-native-maplibre-js';

export default function MapView() {
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

### 2 (a). AWS Location Service using API Key

```js
import { MaplibreMap } from '@neukolabs/react-native-maplibre-js';

export default function MapView() {

  return (
    <MaplibreMap
      containerStyle={styles.map}
      options={{
        center: [101.63787, 3.14261],
        zoom: 12,
        preserveDrawingBuffer: true,
      }}
      awsLocationService={{
        // Your map's region
        region: 'us-east-1', 

        // create here https://console.aws.amazon.com/location/maps/home
        mapName: 'your-map-name', 
        authType: 'apiKey',
        credentials: {

          // create here https://console.aws.amazon.com/location/api-keys/home
          apiKey: 'your-api-key', 
        }
      }}
    />
  );
}
```

### 2 (b). AWS Location Service using AWS Tempory Credentials

```js
import { MaplibreMap } from '@neukolabs/react-native-maplibre-js';

export default function MapView() {

  return (
    <MaplibreMap
      containerStyle={styles.map}
      options={{
        center: [101.63787, 3.14261],
        zoom: 12,
        preserveDrawingBuffer: true,
      }}
      awsLocationService={{
        // Your map's region
        region: 'us-east-1', 

        // create here https://console.aws.amazon.com/location/maps/home
        mapName: 'your-map-name', 
        authType: 'awsCredentials',
        credentials: {
          accessKeyId: 'access key id',
          secretAccessKey: 'secret access key',

          // optional
          sessionToken: 'session token',
        }
      }}
    />
  );
}
```

### 3.Map with marker

Make sure the Marker is inside MaplibreMap component.

```js
import { useRef } from 'react';
import { MaplibreMap, Marker } from '@neukolabs/react-native-maplibre-js';

export default function MapView() {

  const markerRef = useRef();

  return (
    <MaplibreMap
      containerStyle={styles.map}
      options={{
        center: [101.63787, 3.14261],
        zoom: 12,
        preserveDrawingBuffer: true,
      }}
    >
      <Marker
          ref={markerRef}
          options={{
            color: '#ff0000',
            draggable: true,
          }}
          coords={[101.63787, 3.14261]}
          eventNames={['dragend']}
          onEvent={async (e) => {
            if (e === 'dragend') {
              
              // get current position adter drag the marker
              const pos = await markerRef.current.getLngLat();
              console.log(pos);
            }
          }}
        />
    </MaplibreMap>
  );
}
```

## Motivation

Maplibre is an awesome package for most of the platforms especially for web application. The platform has a comprehensive APIs ([Maplibre Map document](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#example)) that enables awesome application to be built.

The motivation to build this package:
- to be as closest as possible as the ([web version's API](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#example)).
- to support other map providers natively.
- integrating the Map with **AWS Location Service** in React-Native can be made as *natively in Javascript environment*.

The package is basically a bridge between React-Native component to the Webview loaded with Maplibre.

## Contributing

Contribution are most welcome. See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
