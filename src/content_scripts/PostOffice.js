const sendMessage = (chrome, data) => chrome.runtime.sendMessage(data);

export default class PostOffice {
  constructor(chrome, issueData) {
    this.chrome = chrome;
    this.issueData = issueData;
  }

  updateClock(clockData) {
    return sendMessage(
      this.chrome,
      {
        action: 'update',
        clockData,
        issueData: this.issueData,
      },
    );
  }

  trashClock() {
    return sendMessage(
      this.chrome,
      {
        action: 'trash',
        issueData: this.issueData,
      },
    );
  }

  getClock() {
    return sendMessage(
      this.chrome,
      {
        action: 'get',
        issueData: this.issueData,
      },
    );
  }
}
