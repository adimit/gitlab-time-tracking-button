export default class ChromeTabs {
  constructor(myChrome) {
    this.chrome = myChrome;
  }

  insertJs(tabId, js) {
    return new Promise((resolve) => {
      this.chrome.tabs.executeScript(
        tabId,
        { code: js },
        result => resolve(result),
      );
    });
  }

  insertCss(tabId, css) {
    return new Promise((resolve) => {
      this.chrome.tabs.insertCSS(
        tabId,
        { code: css },
        () => resolve(),
      );
    });
  }
}
