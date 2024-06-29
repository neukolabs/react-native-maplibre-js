import { log } from './logger';
import Map from './map';

let map = null;

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

function addMapEventListeners(listeners) {
  listeners.forEach((listener) => {
    map.on(listener, () => mapEventListenerCallback(listener));
  });
}

window.initMap = function (options) {
  try {
    const params = JSON.parse(options);
    map = new Map('map');
    if (params.awsAuthentication) {
      map.setAwsCredentials(params.awsAuthentication);
    }
    map.init(params.options);
    addMapEventListeners(params.mapEventListeners);
  } catch (err) {
    window.ReactNativeWebView.postMessage(err.message);
  }
};

window.messageCallback = async function (e) {
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
};
