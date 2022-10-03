import * as BrowserFS from 'browserfs';

export default () => new Promise((resolve) => {
  BrowserFS.install(window);
  BrowserFS.configure({
    fs: 'IndexedDB',
    options: {},
  }, () => {
    resolve();
  });
});
