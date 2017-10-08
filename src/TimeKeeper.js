import Clock from './Clock';

const makeKey = ({ instance, group, project, issue }) => `${instance}&${group}&${project}&${issue}`;
const readKey = (string) => {
  const [instance, group, project, issue] = string.split('&');
  return { instance, group, project, issue };
};

// TODO Add a UniqueClockGuard Object

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
    const clocks = await this.getClocks();
    if (clocks[key]) {
      return clocks[key];
    }
    return null;
  }

  async getClocks() {
    const { clocks } = await this.browser.storage.local.getOrDefault('clocks', { clocks: {} });
    return clocks;
  }

  async getRunningClocks() {
    const clocks = await this.getClocks();
    const runningClocks = [];
    Object.keys(clocks).forEach((key) => {
      const clock = new Clock(clocks[key]);
      if (clock.isRunning()) {
        runningClocks.push({ issueData: readKey(key), clock });
      }
    });

    return runningClocks;
  }
}
