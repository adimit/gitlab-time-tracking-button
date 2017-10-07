const makeKey = ({ instance, group, project, issue }) => `${instance}&${group}&${project}&${issue}`;
const sendMessage = (browser, tabIds, message, content) => {
  tabIds.forEach(tab => browser.tabs.sendMessage(tab, message, content));
};

export default class TabRegistry {
  constructor(browser) {
    this.browser = browser;
    this.tabs = new Map();
    this.issues = new Map();
  }

  update(tabId, issueData, clockData) {
    sendMessage(this.browser, this.getTabsForIssue(issueData, tabId), 'update', clockData);
  }

  trash(tabId, issueData) {
    sendMessage(this.browser, this.getTabsForIssue(issueData, tabId), 'trash');
  }

  getTabsForIssue(issueData, originalTab) {
    const key = makeKey(issueData);
    const tabs = this.issues.get(key) || new Set();
    const copy = new Set(tabs);
    copy.delete(originalTab);
    return copy;
  }

  registerTab({ tabId, issueData }) {
    const key = makeKey(issueData);
    this.tabs.set(tabId, key);
    const tabs = this.issues.get(key);

    if (!tabs || tabs.size === 0) {
      this.issues.set(key, new Set([tabId]));
    } else {
      tabs.add(tabId);
    }
  }

  deregisterTab(tabId) {
    const issueData = this.tabs.get(tabId);
    if (issueData) {
      this.issues.get(issueData).delete(tabId);
    }
  }
}
