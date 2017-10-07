export default class TabRegistry {
  constructor(browser) {
    this.browser = browser;
    this.tabs = new Map();
    this.issues = new Map();
  }

  update(tabId, issueData, clockData) {
    // find all tabs for issue
    // send update clock data to those tabs
  }

  getTabsForIssue(issueData, originalTab) {
    // get all tabs containing this issueData
    // remove originalTab from the set
  }

  trash(tabId, issueData) {
    // find all tabs for issue
    // send trash message to those tabs
  }

  registerTab({ tabId, issueData }) {
    this.tabs.set(tabId, issueData);
  }

  deregisterTab(tabId) {
    this.tabs.delete(tabId);
  }
}
