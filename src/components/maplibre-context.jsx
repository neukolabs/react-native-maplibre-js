import { createContext, useContext } from 'react';

const MaplibreContext = createContext();

export const useMaplibreContext = () => {
  const context = useContext(MaplibreContext);
  if (context === undefined) {
    throw new Error(
      'useMaplibreContext must be used within a MaplibreProvider'
    );
  }
  return context;
};

export default MaplibreContext;
