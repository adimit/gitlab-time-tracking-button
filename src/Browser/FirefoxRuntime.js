export default class Runtime {
  constructor(browser) {
    this.browser = browser;
  }

  sendMessage(data) {
    return this.browser.runtime.sendMessage(data);
  }
}
