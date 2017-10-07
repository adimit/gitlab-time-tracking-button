export default class TimeKeeper {
  constructor(browser, clocks) {
    this.browser = browser;
    this.clocks = clocks;
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
