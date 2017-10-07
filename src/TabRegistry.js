export default class TabRegistry {
  constructor(browser) {
    this.browser = browser;
  }

  update(tabId, issueData, clockData) {
    console.log('update', tabId, issueData, clockData);
  }

  trash(tabId, issueData) {
    console.log('trash', tabId, issueData);
  }
}
