export default class TabListener {
  constructor(chromeTabs, instanceManager) {
    this.chromeTabs = chromeTabs;
    this.instanceManager = instanceManager;
    this.matchUrl = /\/([^/]+)\/([^/]+)\/issues\/(\d+)/;
  }

  updateTabs(info) {
    if (info.status !== 'complete'
     || !this.instanceManager.isRegisteredInstance(info.url)
    ) {
      return;
    }

    const [match, group, project, issue] = info.url.match(this.matchUrl) || [];

    if (match && group && project && issue) {
      this.insertAssetsInto(info.id, { group, project, issue });
    }
  }

  async insertAssetsInto(tabId, data) {
    const js = `const injectedIssueData = ${JSON.stringify(data)};`;
    await this.chromeTabs.insertJs(tabId, js);
    await this.chromeTabs.insertJsFile(tabId, 'content_scripts/ClockButton.js');
  }
}
