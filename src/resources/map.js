/* global maplibregl */

'use strict';

var console = {};
console.log = function (message) {
  if (window.hasOwnProperty('ReactNativeWebView')) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'log',
        payload: {
          message: message,
        },
      })
    );
  }
};

import { Signer } from '@aws-amplify/core';

// const
const DEFAULT_CREDENTIALS = {
  apiKey: null,
  accessKeyId: null,
  secretAccessKey: null,
  sessionToken: null,
};

const DEFAULT_OPTIONS = {
  center: [-122.65, 45.52],
  zoom: 9,
};

class Map {
  constructor(
    id = 'map',
    awsRegion = 'us-east-1',
    mapName,
    authType,
    credentials = DEFAULT_CREDENTIALS
  ) {
    this.id = id;
    this.awsRegion = awsRegion;
    this.mapName = mapName;
    this.authType = authType;
    this.credentials = credentials;
    this.map = null;
  }

  _resolveAuthOptions() {
    // console.log(`_resolveAuthOptions: ${this.authType}`)
    window.ReactNativeWebView.postMessage(this.authType);
    if (this.authType === 'apiKey') {
      return {
        style: `https://maps.geo.${this.awsRegion}.amazonaws.com/maps/v0/maps/${this.mapName}/style-descriptor?key=${this.credentials.apiKey}`,
      };
    } else if (this.authType === 'awsCredentials') {
      return {
        style: `https://maps.geo.${this.awsRegion}.amazonaws.com/maps/v0/maps/${this.mapName}/style-descriptor`,
        transformRequest: (url, resourceType) => {
          if (url.includes('amazonaws.com')) {
            return {
              url: Signer.signUrl(
                url,
                {
                  access_key: this.credentials.accessKeyId,
                  secret_key: this.credentials.secretAccessKey,
                  session_token: this.credentials.sessionToken,
                },
                {
                  service: 'geo',
                }
              ),
            };
          }
          console.log('_getMapAuthenticationOptions', 'url', url);
          return { url };
        },
      };
    } else {
      return {};
    }
  }

  on(eventName, callback) {
    this.map.on(eventName, callback);
  }

  init(options = DEFAULT_OPTIONS) {
    // resolve auth options
    const authOptions = this._resolveAuthOptions();
    console.log({
      ...options,
      container: this.id,
      ...authOptions,
    });

    this.map = new maplibregl.Map({
      ...options,
      container: this.id,
      ...authOptions,
    });
  }

  invokeMethod(methodName, methodArgs = []) {
    try {
      // sanity check
      if (!this.map) {
        throw new Error('Map not initialized');
      }

      // call method
      this.map[methodName].apply(this.map, methodArgs);
    } catch (err) {
      console.log(err.message);
    }
  }
}

module.exports = Map;
