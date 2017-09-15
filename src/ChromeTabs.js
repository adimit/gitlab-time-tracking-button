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

  insertJsFile(tabId, jsFile) {
    return new Promise((resolve) => {
      this.chrome.tabs.executeScript(
        tabId,
        { file: jsFile },
        result => resolve(result),
      );
    });
  }
}
