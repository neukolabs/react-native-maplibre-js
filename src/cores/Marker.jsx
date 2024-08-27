import { makeid } from './utilities';
import { useMaplibreContext } from '../components/maplibre-context';
import { useState, useEffect } from 'react';

export const Marker = (props) => {
  // input
  const { coords = [0, 0], options = {} } = props;

  // hooks
  const { map, eventManager } = useMaplibreContext();
  const { mapRef, loaded } = map;

  // state
  const [identifier, setIdentifier] = useState(null);

  /**
   * The function `invokeGetResponse` asynchronously sends a request with a function name and
   * arguments, listens for a response, and resolves with the received parameters.
   * @returns The `invokeGetResponse` function is returning a Promise.
   */
  const invokeGetResponse = async (
    markerId,
    name,
    type = 'invokeMarkerFunction',
    ...args
  ) => {
    // generate random id
    const id = makeid(24);
    console.log('Marker@invokeGetResponse', markerId, id, name, args);
    console.log('Marker@invokeGetResponse', 'eventManager', eventManager);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject('MarkerTimeoutError');
      }, 2000);

      eventManager.addListener(id, (params) => {
        console.log('Marker.eventManager#addListener', id, params);
        clearTimeout(timeout);
        eventManager.removeAllListeners(id);
        resolve(params);
      });

      // send data
      mapRef.postMessage(
        JSON.stringify({
          type: type,
          markerId: markerId,
          functionName: name,
          arguments: [...args],
          requestId: id,
        })
      );
    });
  };

  /* eslint-disable */
  useEffect(() => {
    console.log('Marker@useEffect[identifier]', 'identifier', identifier);
    if (identifier === null) return;
    invokeGetResponse(identifier, 'init', 'invokeMarkerFunction', {
      coords: coords,
      options: options,
    });

    return () => {
      console.log('Marker@useEffect[]', 'exiting', identifier);
      invokeGetResponse(identifier, 'remove', 'invokeMarkerFunction', null);
    };
  }, [identifier]);
  /* eslint-enable */

  useEffect(() => {
    console.log('Marker@useEffect[loaded]', 'loaded', loaded);
    if (!loaded) return;
    setIdentifier(makeid(24));
  }, [loaded]);

  return null;
};
