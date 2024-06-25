import { createContext, useContext } from 'react';

const MaplibreMapContext = createContext();

export const useMaplibreMapContext = () => {
  const context = useContext(MaplibreMapContext);
  if (context === undefined) {
    throw new Error(
      'useMaplibreMapContext must be used within a MaplibreMapProvider'
    );
  }
  return context;
};

export default MaplibreMapContext;
