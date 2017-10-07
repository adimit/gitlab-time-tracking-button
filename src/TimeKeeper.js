const makeKey = ({ instance, group, project, issue }) => `${instance}&${group}&${project}&${issue}`;

export default class TimeKeeper {
  constructor(browser, clocks) {
    this.browser = browser;
    this.clocks = clocks;
  }

  async updateClock(issueData, clockData) {
    this.clocks[makeKey(issueData)] = clockData;
    await this.browser.storage.local.set({ clocks: this.clocks });
  }

  async trashClock(issueData) {
    delete this.clocks[makeKey(issueData)];
    await this.browser.storage.local.set({ clocks: this.clocks });
  }

  async giveClock(issueData) {
    const key = makeKey(issueData);
    const { clocks } = await this.browser.storage.local.getOrDefault('clocks', { clocks: {} });
    if (clocks !== undefined && clocks[key]) {
      return clocks[key];
    }
    return null;
  }
}
