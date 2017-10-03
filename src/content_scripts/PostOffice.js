// import fireEvent from '../Events';

export default class PostOffice {
  constructor(browser, issueData) {
    this.browser = browser;
    this.issueData = issueData;
    this.handlers = { start: [], stop: [], trash: [] };
  }

  async updateClock(clockData) {
    return this.browser.runtime.sendMessage(
      {
        action: 'update',
        clockData,
        issueData: this.issueData,
      },
    );
  }

  async trashClock() {
    return this.browser.runtime.sendMessage(
      {
        action: 'trash',
        issueData: this.issueData,
      },
    );
  }

  async getClock() {
    return this.browser.runtime.sendMessage(
      {
        action: 'get',
        issueData: this.issueData,
      },
    );
  }

  onStart(f) {
    this.handlers.start.push(f);
  }

  onStop(f) {
    this.handlers.stop.push(f);
  }

  onTrash(f) {
    this.handlers.trash.push(f);
  }
}
