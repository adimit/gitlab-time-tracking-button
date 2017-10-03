import isFirefox from '../UserAgent';

const firefoxSendMessage = browser => data => browser.runtime.sendMessage(data);

const chromeSendMessage = browser => data => new Promise((resolve, reject) => {
  browser.runtime.sendMessage(undefined, data, undefined, (response) => {
    if (!response && browser.runtime.lastError) {
      reject(browser.runtime.lastError);
    } else {
      resolve(response);
    }
  });
});

export default class Runtime {
  constructor(browser) {
    this.browser = browser;
    if (isFirefox()) {
      this.sendMessage = firefoxSendMessage(browser);
    } else {
      this.sendMessage = chromeSendMessage(browser);
    }
  }
}
