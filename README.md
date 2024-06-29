# React-Native Maplibre JS

A Maplibre JS wrapper for react-native. The package uses Javascript APIs to help developer interact with the map that being rendered by react-native-webview.

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Table of Content

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Guides](./docs/Map.md)
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

## Usage

### Step 1: Wrap Maplibre Provider

Usually in App.js
```js
import { MaplibreProvider } from '@neukolabs/react-native-maplibre-js';

export default function App() {
  return (
    ...
      <MaplibreProvider>
        // .. more providers and childrens
      </MaplibreProvider>
    ...
  );
}
```

### Step 2: Call Map in your component

```js
import React from 'react';
import { StyleSheet } from 'react-native';
import { Map, useMaplibreContext } from '@neukolabs/react-native-maplibre-js';

export default function MapView() {
  // hooks
  const { map } = useMaplibreContext();
  const { setCenter } = map;

  const onMapEvent = (eventName) => {
    console.log(eventName);
    if (eventName === 'load') {
      // let's go to other place
      setCenter([-74, 38]);
    }
  };

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

const styles = StyleSheet.create({
  map: {
    flex: 1,
    maxHeight: '100%',
    width: '100%',
  },
});
```

## Examples

### 1. Get current map center coordinates

```js
import { Map, useMaplibreContext } from '@neukolabs/react-native-maplibre-js';

export default function MapView() {
  // hooks
  const { map } = useMaplibreContext();
  const { getCenter } = map;

  const onMapEvent = async (eventName) => {
    console.log(eventName);
    if (eventName === 'load') {

      const center = await getCenter();

      console.log(center);
      // output {"lat": 3.14261, "lng": 101.63787}
    }
  };

  return (
    <Map
      ...props
    />
  );
}
```

### 2 (a). AWS Location Service using API Key

```js
import { Map, useMaplibreContext } from '@neukolabs/react-native-maplibre-js';

export default function MapView() {

  const onMapEvent = async (eventName) => {
    // 
  };

  return (
    <Map
      containerStyle={styles.map}
      options={{
        center: [101.63787, 3.14261],
        zoom: 12,
        preserveDrawingBuffer: true,
      }}
      mapEventListeners={['load']}
      onMapEvent={onMapEvent}
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
import { Map, useMaplibreContext } from '@neukolabs/react-native-maplibre-js';

export default function MapView() {

  const onMapEvent = async (eventName) => {
    // 
  };

  return (
    <Map
      containerStyle={styles.map}
      options={{
        center: [101.63787, 3.14261],
        zoom: 12,
        preserveDrawingBuffer: true,
      }}
      mapEventListeners={['load']}
      onMapEvent={onMapEvent}
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
