import React, { useState } from 'react';
import MaplibreContext from '../components/maplibre-context';
import { AwsMapAuthentication } from './AWSLocationServiceMap';

const MaplibreProvider = (props) => {
  // input
  const { children } = props;

  // states
  const [mapRef, setMapRef] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [mapMethod, setMapMethod] = useState(null);
  const [awsAuthentication, setAwsAuthentication] = useState(AwsMapAuthentication)

  return (
    <MaplibreContext.Provider
      value={{
        awsAuthentication:  awsAuthentication,
        setAwsAuthentication: setAwsAuthentication,
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
};

export default MaplibreProvider;
