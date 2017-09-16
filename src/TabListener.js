import UrlParser from './UrlParser';

export default class TabListener {
  constructor(chromeTabs, instanceManager) {
    this.chromeTabs = chromeTabs;
    this.instanceManager = instanceManager;
  }

  updateTabs(info) {
    if (info.status !== 'complete'
     || !this.instanceManager.isRegisteredInstance(info.url)
    ) {
      return;
    }

    const parser = new UrlParser(info.url);
    const { group, project, issue } = parser.getAllData();

    if (group && project && issue) {
      this.insertAssetsInto(info.id);
    }
  }

  async insertAssetsInto(tabId) {
    return [
      await this.chromeTabs.insertJsFile(tabId, 'content_scripts/ClockButton.js'),
      await this.chromeTabs.insertCssFile(tabId, 'content_scripts/ClockButton.css'),
    ];
  }
}
