import { makeid } from './utilities';
import { useMaplibreContext } from '../components/maplibre-context';
import { forwardRef, useState, useEffect, useImperativeHandle } from 'react';

export const Source = forwardRef((props, ref) => {
  // input
  const { id, specification = {} } = props;

  // sanity check
  if (!id) throw Error('Missing id in Source');

  // hooks
  const { map, eventManager } = useMaplibreContext();
  const { _internalMapRef: mapRef, loaded } = map;

  // state
  const [sourceLoaded, setSourceLoaded] = useState(false);

  const invokeFunction = async (sourceId, name, ...args) => {
    // generate random id
    const _id = makeid(24);
    // console.debug('Source@invokeFunction', id, name, args);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject('SourceTimeoutError');
      }, 3000);

      eventManager.addListener(id, (params) => {
        // console.debug('Source.eventManager#addListener', id, params);
        clearTimeout(timeout);
        eventManager.removeAllListeners(_id);
        resolve(params);
      });

      // send data
      mapRef.current.postMessage(
        JSON.stringify({
          type: 'invokeSourceFunction',
          sourceId: sourceId,
          functionName: name,
          arguments: [...args],
          requestId: _id,
        })
      );
    });
  };

  const initSource = async () => {
    await invokeFunction(id, 'addSource', specification);
    setSourceLoaded(true);
  };

  // methods for marker
  useImperativeHandle(ref, () => ({
    async setData(_specification = {}) {
      if (!sourceLoaded) throw Error('Source is not loaded');
      return await invokeFunction(id, 'setData', _specification);
    },
    async remove() {
      if (!sourceLoaded) return null;
      return await invokeFunction(id, 'removeSource');
    },
  }));

  /* eslint-disable */
  useEffect(() => {
    // console.debug('Marker@useEffect[loaded]', 'loaded', loaded);
    if (!loaded) return;
    initSource();
  }, [loaded]);
  /* eslint-enable */

  return null;
});
