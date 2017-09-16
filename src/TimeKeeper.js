const makeKey = ({ instance, group, project, issue }) => `${instance}&${group}&${project}&${issue}`;

export default class TimeKeeper {
  constructor(chrome) {
    this.chrome = chrome;
    this.clocks = {};
  }

  async processMessage(message, sender) {
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
    console.log('clocks', this.clocks);
  }

  async trashClock(key) {
    this.clocks[key] = null;
    await this.chrome.set({ clocks: this.clocks });
    console.log('clocks', this.clocks);
  }

  async giveClock(key) {
    const { clocks } = await this.chrome.getOrDefault('clocks', { clocks: {} });
    return clocks[key] || null;
  }
}
