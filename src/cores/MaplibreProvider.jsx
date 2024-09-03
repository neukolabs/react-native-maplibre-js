import React, { useState } from 'react';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter.js';
import MaplibreContext from '../components/maplibre-context';
import { AwsMapAuthentication } from './AWSLocationServiceMap';

const MaplibreProvider = (props) => {
  // input
  const { children } = props;
  const eventManager = new EventEmitter();

  // states
  const [mapRef, setMapRef] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [mapMethod, setMapMethod] = useState(null);
  const [awsAuthentication, setAwsAuthentication] =
    useState(AwsMapAuthentication);

  return (
    <MaplibreContext.Provider
      value={{
        awsAuthentication: awsAuthentication,
        setAwsAuthentication: setAwsAuthentication,
        map: {
          mapRef: mapRef,
          setMapRef: setMapRef,
          loaded: loaded,
          setLoaded: setLoaded,
          setMapMethod: setMapMethod,
          ...mapMethod,
        },
        eventManager: eventManager,
      }}
    >
      {children}
    </MaplibreContext.Provider>
  );
};

export default MaplibreProvider;
