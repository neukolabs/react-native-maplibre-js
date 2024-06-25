const params = JSON.parse(window.ReactNativeWebView.injectedObjectJson());

export const log = (...args) => {
  // sanity check
  if (!params.isDevelopment) return;

  // write
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: 'log',
      payload: {
        message: args.join(' '),
      },
    })
  );
};
