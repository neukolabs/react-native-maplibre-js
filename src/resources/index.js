'use strict';
import { log, error } from './logger';
import Map from './map';
import Marker from './marker';
import Source from './source';

let map = null;
let _mapInstance = null;
let MARKERS = [];
let SOURCES = [];

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

function markerEventListenerCallback(markerId, name) {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: 'markerEvent',
      markerId: markerId,
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

function responseMarkerInvokedMethodCallback(id, paylod) {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: 'invokeMarkerResponse',
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

function addMarkerEventListeners(markerId, marker, listeners) {
  listeners.forEach((listener) => {
    log(`marker ${markerId} is listening to ${listener}`);
    marker.on(listener, () => markerEventListenerCallback(markerId, listener));
  });
}

async function mapHandler(event) {
  try {
    if (event.functionName.toUpperCase() === 'ADDCONTROL') {
      map.addControl(event.arguments[0]);
    } else {
      map.invokeMethod(event.functionName, event.arguments);
    }
    responseInvokedMethodCallback(event.requestId, null);
  } catch (err) {
    error(err);
  }
}

async function responsiveMapHandler(event) {
  try {
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
  } catch (err) {
    error(err);
  }
}

async function markerHandler(event) {
  try {
    const markerId = event.markerId;
    const _marker = MARKERS.find((marker) => marker.id === markerId);
    if (_marker === undefined) {
      const marker = new Marker(markerId, _mapInstance);
      marker.init(event.arguments[0].options, event.arguments[0].coords);
      addMarkerEventListeners(markerId, marker, event.arguments[0].eventNames);
      MARKERS.push({
        id: markerId,
        marker: marker,
      });
    } else {
      if (event.functionName.toUpperCase() === 'REMOVE') {
        log('enter remove');
        _marker.marker.remove();
        MARKERS = MARKERS.filter((item) => item.id !== markerId);
      } else {
        _marker.marker.invokeMethod(event.functionName, event.arguments);
      }
    }
    responseMarkerInvokedMethodCallback(event.requestId, null);
  } catch (err) {
    error(err);
  }
}

async function responsiveMarkerHandler(event) {
  try {
    const markerId = event.markerId;
    const _marker = MARKERS.find((marker) => marker.id === markerId);
    let res = null;
    if (_marker === undefined) {
      throw Error('MarkerNotFoundExeption');
    } else {
      res = _marker.marker.invokeGetResponseMethod(
        event.functionName,
        event.arguments
      );
    }
    responseMarkerInvokedMethodCallback(event.requestId, res);
  } catch (err) {
    error(err);
  }
}

async function sourceHandler(event) {
  try {
    const sourceId = event.sourceId;
    const _source = SOURCES.find((item) => item.id === sourceId);
    if (_source === undefined) {
      const source = new Source(sourceId, _mapInstance, event.arguments[0]);
      SOURCES.push({
        id: sourceId,
        source: source,
      });
    } else {
      if (event.functionName.toUpperCase() === 'SETDATA') {
        _source.source.setData(event.arguments[0]);
      } else if (event.functionName.toUpperCase() === 'REMOVE') {
        _source.source.remove();
        SOURCES = SOURCES.filter((item) => item.id !== sourceId);
      } else {
        throw Error('Unsupported function');
      }
    }
    responseInvokedMethodCallback(event.requestId, null);
  } catch (err) {
    error(err);
  }
}

window.initMap = function (options) {
  try {
    const params = JSON.parse(options);
    map = new Map('map');
    if (params.awsAuthentication && params.awsAuthentication.type !== null) {
      map.setAwsCredentials(params.awsAuthentication);
    }
    map.init(params.options);
    addMapEventListeners(params.mapEventListeners);
    _mapInstance = map._getMapInstance();
  } catch (err) {
    window.ReactNativeWebView.postMessage(err.message);
  }
};

window.messageCallback = async function (e) {
  const event = JSON.parse(e.data);
  log('window.addEventListener@message', 'event', JSON.stringify(event));
  switch (event.type) {
    case 'invokeMapFunction': {
      await mapHandler(event);
      break;
    }
    case 'getResponseMapFunction': {
      await responsiveMapHandler(event);
      break;
    }
    case 'invokeMarkerFunction': {
      await markerHandler(event);
      break;
    }
    case 'getResponseMarkerFunction': {
      await responsiveMarkerHandler(event);
      break;
    }
    case 'invokeSourceFunction': {
      await sourceHandler(event);
      break;
    }
    default: {
      break;
    }
  }
};
