export const MapAuthenticationType = {
  NONE: null,
  APIKEY: 'apiKey',
  AWS_CREDENTIALS: 'awsCredentials',
};

export const MapAuthentication = {
  type: MapAuthenticationType.NONE,
  region: 'us-east-1',
  mapName: null,
  credentials: {
    apiKey: null,
    accessKeyId: null,
    secretAccessKey: null,
    sessionToken: null,
  },
};
