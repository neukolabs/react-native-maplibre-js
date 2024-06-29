/* global maplibregl */

'use strict';

import { Signer } from '@aws-amplify/core';
import { log, error } from './logger';

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
  constructor(id = 'map') {
    this.id = id;
    this.map = null;
    this.navigationControl = null;
    this.awsCredentials = {
      region: 'us-east-1',
      mapName: null,
      authType: null,
      credentials: DEFAULT_CREDENTIALS,
    };
  }

  _resolveAuthOptions() {
    log(this.awsCredentials.authType);

    /* Sanity check */
    if (this.awsCredentials.authType === null) return {};

    /* AWS Credentials API Key */
    if (this.awsCredentials.authType === 'apiKey') {
      return {
        style: `https://maps.geo.${this.awsCredentials.region}.amazonaws.com/maps/v0/maps/${this.awsCredentials.mapName}/style-descriptor?key=${this.awsCredentials.credentials.apiKey}`,
      };
    }

    /* AWS Credentials API Credetials */
    if (this.awsCredentials.authType === 'awsCredentials') {
      return {
        style: `https://maps.geo.${this.awsCredentials.region}.amazonaws.com/maps/v0/maps/${this.awsCredentials.mapName}/style-descriptor`,
        transformRequest: (url, resourceType) => {
          if (url.includes('amazonaws.com')) {
            return {
              url: Signer.signUrl(
                url,
                {
                  access_key: this.awsCredentials.credentials.accessKeyId,
                  secret_key: this.awsCredentials.credentials.secretAccessKey,
                  session_token:
                    this.awsCredentials.credentials.sessionToken || null,
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
    }

    return {};
  }

  setAwsCredentials({ region, mapName, authType, credentials }) {
    try {
      /* sanity check */
      if (!region) throw Error('Missing AWS region');
      if (!mapName) throw Error('Missing AWS map name');
      if (!authType) throw Error('Missing AWS auth type');
      if (authType && authType !== 'apiKey' && authType !== 'awsCredentials')
        throw Error('Invalid AWS authentication type');
      if (authType === 'apiKey') {
        if (!credentials.apiKey) throw Error('Missing AWS API key');
      } else if (authType === 'awsCredentials') {
        if (!credentials.accessKeyId) throw Error('Missing AWS access key ID');
        if (!credentials.secretAccessKey)
          throw Error('Missing AWS secret access key');
      }

      /* set value */
      this.awsCredentials.region = region;
      this.awsCredentials.mapName = mapName;
      this.awsCredentials.authType = authType;
      this.awsCredentials.credentials = credentials;

      /* update map */
      if (!this.map) return;
      if (this.awsCredentials.authType === null) return;
      const authOptions = this._resolveAuthOptions();
      this.map.setStyle(authOptions.style);
      this.map.setTransformRequest(authOptions.transformRequest);
    } catch (err) {
      error('AWSCredentialsError', err.message);
    }
  }

  on(eventName, callback) {
    this.map.on(eventName, callback);
  }

  init(options = DEFAULT_OPTIONS) {
    try {
      const authOptions = this._resolveAuthOptions();
      this.map = new maplibregl.Map({
        ...options,
        container: this.id,
        ...authOptions,
      });
    } catch (err) {
      error('MapError', err.message);
    }
  }

  addControl(position = 'top-right') {
    try {
      if (!this.map) {
        throw new Error('Map not initialized');
      }

      if (!this.navigationControl)
        this.navigationControl = new maplibregl.NavigationControl();

      this.map.addControl(this.navigationControl, position);
    } catch (err) {
      error('MapError', err.message);
    }
  }

  hasControl() {
    try {
      if (!this.map) {
        throw new Error('Map not initialized');
      }

      if (!this.navigationControl) {
        return false;
      }

      return this.map.hasControl(this.navigationControl);
    } catch (err) {
      error('MapError', err.message);
    }
  }

  removeControl() {
    try {
      if (!this.map) {
        throw new Error('Map not initialized');
      }

      if (!this.navigationControl) {
        return null;
      }

      this.map.removeControl(this.navigationControl);
      return null;
    } catch (err) {
      error('MapError', err.message);
    }
  }

  async loadImages(url) {
    try {
      if (!this.map) {
        throw new Error('Map not initialized');
      }

      await this.map.loadImages(url);
      return null;
    } catch (err) {
      error('MapError', err.message);
    }
  }

  invokeMethod(methodName, methodArgs = []) {
    try {
      if (!this.map) {
        throw new Error('Map not initialized');
      }

      this.map[methodName].apply(this.map, methodArgs);
    } catch (err) {
      error('MapError', err.message);
    }
  }

  invokeGetResponseMethod(methodName, methodArgs = []) {
    try {
      if (!this.map) {
        throw new Error('Map not initialized');
      }

      return this.map[methodName].apply(this.map, methodArgs);
    } catch (err) {
      error('MapError', err.message);
    }
  }
}

module.exports = Map;
