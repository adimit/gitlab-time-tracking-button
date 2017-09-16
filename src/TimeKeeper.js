import isFirefox from './UserAgent';

const makeKey = ({ instance, group, project, issue }) => `${instance}&${group}&${project}&${issue}`;

export default class TimeKeeper {
  constructor(chrome) {
    this.chrome = chrome;
    this.clocks = {};
    this.messageProc = isFirefox() ? this.processMessageFF : this.processMessageChrome;
  }

  async processMessage(message, sender, sendResponse) {
    return this.messageProc(message, sender, sendResponse);
  }

  async processMessageChrome(message, sender, sendResponse) {
    console.log('process message chrome');
    const { action, issueData, clockData } = message;
    const key = makeKey(issueData);
    let answer = null;
    switch (action) {
      case 'update': answer = await this.updateClock(key, clockData); break;
      case 'trash': answer = await this.trashClock(key); break;
      case 'get': answer = await this.giveClock(key); break;
      default: throw Error(`Unknown action ${action}`);
    }

    console.log('and the answer is', answer);

    sendResponse(answer);
  }

  async processMessageFF(message) {
    console.log('process message firefox');
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
    await this.chrome.set({ clocks: this.clocks });
  }

  async trashClock(key) {
    delete this.clocks[key];
    await this.chrome.set({ clocks: this.clocks });
  }

  async giveClock(key) {
    const { clocks } = await this.chrome.getOrDefault('clocks', { clocks: {} });
    if (clocks !== undefined && clocks[key]) {
      return clocks[key];
    }
    return null;
  }
}
