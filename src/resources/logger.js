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
