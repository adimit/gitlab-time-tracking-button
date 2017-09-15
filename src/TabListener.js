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

  insertAssetsInto(tabId, data) {
    console.log('inserting', tabId, data);
  }
}
