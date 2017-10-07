export default class Runtime {
  constructor(browser) {
    this.browser = browser;
  }

  sendMessage(data) {
    const runtime = this.browser.runtime;
    return new Promise((resolve, reject) => {
      runtime.sendMessage(undefined, data, undefined, (response) => {
        if (!response && runtime.lastError) {
          reject(runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
  }
}
