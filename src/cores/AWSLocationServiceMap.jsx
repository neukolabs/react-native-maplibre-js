export const AwsMapAuthenticationType = {
  NONE: null,
  APIKEY: 'apiKey',
  AWS_CREDENTIALS: 'awsCredentials',
};

export const AwsMapAuthentication = {
  type: AwsMapAuthenticationType.NONE,
  region: 'us-east-1',
  mapName: null,
  credentials: {
    apiKey: null,
    accessKeyId: null,
    secretAccessKey: null,
    sessionToken: null,
  },
};
