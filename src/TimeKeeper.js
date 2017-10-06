import isFirefox from './UserAgent';

const makeKey = ({ instance, group, project, issue }) => `${instance}&${group}&${project}&${issue}`;

export default class TimeKeeper {
  constructor(browser) {
    this.browser = browser;
    this.clocks = {};
    this.messageProc = isFirefox() ? this.processMessageFF : this.processMessageChrome;
  }

  async processMessage(message, sender, sendResponse) {
    return this.messageProc(message, sender, sendResponse);
  }

  async processMessageChrome(message, sender, sendResponse) {
    const { action, issueData, clockData } = message;
    const key = makeKey(issueData);
    let answer = null;
    switch (action) {
      case 'update': answer = await this.updateClock(key, clockData); break;
      case 'trash': answer = await this.trashClock(key); break;
      case 'get': answer = await this.giveClock(key); break;
      default: throw Error(`Unknown action ${action}`);
    }

    sendResponse(answer);
  }

  async processMessageFF(message) {
    const { action, issueData, clockData } = message;
    const key = makeKey(issueData);
    switch (action) {
      case 'update': return this.updateClock(key, clockData);
      case 'trash': return this.trashClock(key);
      case 'get': return this.giveClock(key);
      default: throw Error(`Unknown action ${action}`);
    }
  }

  async updateClock(key, clockData) {
    this.clocks[key] = clockData;
    await this.browser.storage.local.set({ clocks: this.clocks });
  }

  async trashClock(key) {
    delete this.clocks[key];
    await this.browser.storage.local.set({ clocks: this.clocks });
  }

  async giveClock(key) {
    const { clocks } = await this.browser.storage.local.getOrDefault('clocks', { clocks: {} });
    if (clocks !== undefined && clocks[key]) {
      return clocks[key];
    }
    return null;
  }
}
