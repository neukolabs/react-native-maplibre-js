import React, { useEffect, useState } from 'react';
import MaplibreMapContext from './components/maplibre-context';
import MapProvider from './map';

// exports dot notation
export const Map = MapProvider;

// relationship
MaplibreMapProvider.Map = Map;

export default function MaplibreMapProvider(props) {
  // input
  const { children } = props;

  // states
  const [ref, setRef] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const invokeMapFunction = (name, ...args) => {
    console.log('MaplibreMapProvider@invokeMapFunction', name, args);
    ref.current.postMessage(
      JSON.stringify({
        type: 'invokeMapFunction',
        functionName: name,
        arguments: [...args],
      })
    );
  };

  useEffect(() => {
    console.log('MaplibreMapProvider@useEffect[loaded]', loaded);
  }, [loaded]);

  useEffect(() => {
    // sanity check
    console.log('MaplibreMapProvider@useEffect[ref]', ref);
  }, [ref]);

  return (
    <MaplibreMapContext.Provider
      value={{
        ref: ref,
        setRef: setRef,
        loaded: loaded,
        setLoaded: setLoaded,
        zoomTo: (zoom = 12) => invokeMapFunction('zoomTo', zoom),
        flyTo: (coordinate = [0, 0]) => invokeMapFunction('flyTo', coordinate),
      }}
    >
      {children}
    </MaplibreMapContext.Provider>
  );
}
