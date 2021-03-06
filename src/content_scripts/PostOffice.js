// import fireEvent from '../Events';

export default class PostOffice {
  constructor(browser, issueData) {
    this.browser = browser;
    this.issueData = issueData;
    this.handlers = { start: [], stop: [], trash: [] };
  }

  async start(clockData) {
    return this.browser.runtime.sendMessage(
      null,
      {
        action: 'start',
        clockData,
        issueData: this.issueData,
      },
    );
  }

  async stop(clockData) {
    return this.browser.runtime.sendMessage(
      null,
      {
        action: 'stop',
        clockData,
        issueData: this.issueData,
      },
    );
  }

  async trashClock() {
    return this.browser.runtime.sendMessage(
      null,
      {
        action: 'trash',
        issueData: this.issueData,
      },
    );
  }

  async getClock() {
    return this.browser.runtime.sendMessage(
      null,
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
