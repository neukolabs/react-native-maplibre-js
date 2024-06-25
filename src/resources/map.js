/* global maplibregl */

'use strict';

import { Signer } from '@aws-amplify/core';
import { log } from './logger';

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
    this.navigationControl = null;
  }

  _resolveAuthOptions() {
    // log(`_resolveAuthOptions: ${this.authType}`)
    log(this.authType);
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
          log('_getMapAuthenticationOptions', 'url', url);
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
    // log({
    //   ...options,
    //   container: this.id,
    //   ...authOptions,
    // });

    this.map = new maplibregl.Map({
      ...options,
      container: this.id,
      ...authOptions,
    });
  }

  addControl(position = 'top-right') {
    try {
      // sanity check
      if (!this.map) {
        throw new Error('Map not initialized');
      }

      if (!this.navigationControl)
        this.navigationControl = new maplibregl.NavigationControl();

      // call method
      this.map.addControl(this.navigationControl, position);
    } catch (err) {
      log(err.message);
    }
  }

  hasControl() {
    try {
      // sanity check
      if (!this.map) {
        throw new Error('Map not initialized');
      }

      if (!this.navigationControl) {
        return false;
      }

      // call method
      return this.map.hasControl(this.navigationControl);
    } catch (err) {
      log(err.message);
    }
  }

  removeControl() {
    try {
      // sanity check
      if (!this.map) {
        throw new Error('Map not initialized');
      }

      if (!this.navigationControl) {
        return null;
      }

      // call method
      this.map.removeControl(this.navigationControl);
      return null;
    } catch (err) {
      log(err.message);
    }
  }

  async loadImages(url) {
    try {
      // sanity check
      if (!this.map) {
        throw new Error('Map not initialized');
      }

      // call method
      await this.map.loadImages(url);
      return null;
    } catch (err) {
      log(err.message);
    }
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
      log(err.message);
    }
  }

  invokeGetResponseMethod(methodName, methodArgs = []) {
    try {
      // sanity check
      if (!this.map) {
        throw new Error('Map not initialized');
      }

      // call method
      return this.map[methodName].apply(this.map, methodArgs);
    } catch (err) {
      log(err.message);
    }
  }
}

module.exports = Map;
