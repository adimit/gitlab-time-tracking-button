import UrlParser from './UrlParser';
import fireEvent from './Events';

export default class TabListener {
  constructor(browser, instanceManager) {
    this.browser = browser;
    this.instanceManager = instanceManager;
    this.handlers = {
      onLoaded: [],
      onDestroyed: [],
    };
  }

  updateTabs(info) {
    if (info.status !== 'complete') {
      return;
    }
    if (!this.instanceManager.isRegisteredInstance(info.url)) {
      fireEvent(this.handlers.onDestroyed, info.id);
      return;
    }

    const parser = new UrlParser(info.url);
    const { group, project, issue } = parser.getAllData();

    if (group && project && issue) {
      this.insertAssetsInto(info.id);
      fireEvent(this.handlers.onLoaded, info.id);
    } else {
      fireEvent(this.handlers.onDestroyed, info.id);
    }
  }

  async insertAssetsInto(tabId) {
    return [
      await this.browser.tabs.insertJsFile(tabId, 'content_scripts/ClockButton.js'),
      await this.browser.tabs.insertCssFile(tabId, 'content_scripts/ClockButton.css'),
    ];
  }

  onInstanceTabLoaded(f) {
    this.handlers.onLoaded.push(f);
  }

  onNonInstanceTabLoaded(f) {
    this.handlers.onDestroyed.push(f);
  }
}
