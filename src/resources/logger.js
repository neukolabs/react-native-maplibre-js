export const log = (...args) => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: 'log',
      payload: {
        message: args.join(' '),
      },
    })
  );
};

export const error = (errorType = 'Error', ...args) => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: 'error',
      payload: {
        type: errorType,
        message: args.join(' '),
      },
    })
  );
};
