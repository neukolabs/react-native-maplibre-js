'use strict';

import { log } from './logger';
import Map from './map';

// globals
let map = null;

/**
 * The function `mapEventListenerCallback` sends a message to a React Native WebView with information
 * about a map event.
 * @param name - The `name` parameter in the `mapEventListenerCallback` function is a string that
 * represents the name of the event that is being mapped.
 */
function mapEventListenerCallback(name) {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: 'mapEvent',
      payload: {
        name,
      },
    })
  );
}

function responseInvokedMethodCallback(id, paylod) {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: 'invokeResponse',
      requestId: id,
      payload: paylod,
    })
  );
}

/**
 * The function `addMapEventListeners` adds event listeners to a map based on the provided list of
 * listener types.
 * @param listeners - An array of event types that the map should listen for, such as 'click', 'zoom',
 * 'drag', etc.
 */
function addMapEventListeners(listeners) {
  listeners.forEach((listener) => {
    map.on(listener, () => mapEventListenerCallback(listener));
  });
}

window.onload = (event) => {
  try {
    if (window.ReactNativeWebView.injectedObjectJson()) {
      const params = JSON.parse(window.ReactNativeWebView.injectedObjectJson());
      map = new Map(
        'map',
        params.awsRegion,
        params.mapName,
        params.authType,
        params.credentials
      );
      map.init(params.options);

      // populate listeners
      addMapEventListeners(params.mapEventListeners);
    }
  } catch (err) {
    window.ReactNativeWebView.postMessage(err.message);
  }
};

window.addEventListener('message', async (e) => {
  const event = JSON.parse(e.data);
  log('window.addEventListener@message', 'event', JSON.stringify(event));
  switch (event.type) {
    case 'invokeMapFunction': {
      if (event.functionName.toUpperCase() === 'ADDCONTROL')
        map.addControl(event.arguments[0]);
      else map.invokeMethod(event.functionName, event.arguments);
      break;
    }
    case 'getResponseMapFunction': {
      // special handling
      if (event.functionName.toUpperCase() === 'ADDCONTROL') {
        map.addControl(event.arguments[0]);
        responseInvokedMethodCallback(event.requestId, null);
      } else if (event.functionName.toUpperCase() === 'HASCONTROL') {
        const res = map.hasControl();
        responseInvokedMethodCallback(event.requestId, res);
      } else if (event.functionName.toUpperCase() === 'REMOVECONTROL') {
        const res = map.removeControl();
        responseInvokedMethodCallback(event.requestId, res);
      } else if (event.functionName.toUpperCase() === 'LOADIMAGES') {
        await map.loadImages(event.arguments[0]);
        responseInvokedMethodCallback(event.requestId, null);
      } else {
        const res = map.invokeGetResponseMethod(
          event.functionName,
          event.arguments
        );
        responseInvokedMethodCallback(event.requestId, res);
      }
      break;
    }
    default: {
      break;
    }
  }
  log('window.addEventListener@message', 'completed');
});
