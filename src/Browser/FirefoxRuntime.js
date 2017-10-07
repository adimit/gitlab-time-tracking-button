export default class Runtime {
  constructor(browser) {
    this.browser = browser;
    this.onMessage = {
      addListener: (f) => {
        browser.runtime.onMessage.addListener(f);
      },
    };
  }

  sendMessage(data) {
    return this.browser.runtime.sendMessage(data);
  }
}
