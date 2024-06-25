import React, { useState } from 'react';
import MaplibreContext from './components/maplibre-context';
import { MapProvider } from './MapProvider';

// relationship
MaplibreProvider.Map = MapProvider;

export default function MaplibreProvider(props) {
  // input
  const { children } = props;

  // states
  const [mapRef, setMapRef] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [mapMethod, setMapMethod] = useState(null);

  return (
    <MaplibreContext.Provider
      value={{
        map: {
          mapRef: mapRef,
          setMapRef: setMapRef,
          loaded: loaded,
          setLoaded: setLoaded,
          setMapMethod: setMapMethod,
          ...mapMethod,
        },
      }}
    >
      {children}
    </MaplibreContext.Provider>
  );
}
