export default class Tabs {
  constructor(browser) {
    this.browser = browser;
  }

  executeScript(tabId, js) {
    return new Promise((resolve) => {
      this.browser.tabs.executeScript(
        tabId,
        js,
        result => resolve(result),
      );
    });
  }

  insertJsCode(tabId, js) {
    return this.executeScript(tabId, { code: js });
  }

  insertJsFile(tabId, jsFile) {
    return this.executeScript(tabId, { file: jsFile });
  }

  insertCSS(tabId, css) {
    return new Promise((resolve) => {
      this.browser.tabs.insertCSS(
        tabId,
        css,
        () => resolve(),
      );
    });
  }

  insertCssFile(tabId, cssFile) {
    return this.insertCSS(tabId, { file: cssFile });
  }
}
