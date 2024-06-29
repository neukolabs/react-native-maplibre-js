import { Platform } from 'react-native'

/**
 * The function `makeid` generates a random alphanumeric string of a specified length.
 * @returns A randomly generated string of the specified length containing a mix of uppercase letters,
 * lowercase letters, and numbers.
 */
export const makeid = (length) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const webviewOnloadedJs = (parameters) => {
  if (Platform.OS === 'android') {
    return `
      document.addEventListener('message', window.messageCallback);
      $(document).ready(function() {
        try {
          window.initMap(JSON.stringify({
            options: ${JSON.stringify(parameters.options)},
            mapEventListeners: ${JSON.stringify(parameters.mapEventListeners)},
          }), null);
        } catch (err) {
          window.ReactNativeWebView.postMessage(err.message);
        }
      });
    `
  } else {
    return `
      window.addEventListener('message', window.messageCallback);
      $(document).ready(function() {
        try {
          window.initMap(JSON.stringify({
            options: ${JSON.stringify(parameters.options)},
            mapEventListeners: ${JSON.stringify(parameters.mapEventListeners)},
          }), null);
        } catch (err) {
          window.ReactNativeWebView.postMessage(err.message);
        }
      });
    `
  };
};
