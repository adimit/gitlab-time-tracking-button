import isFirefox from '../UserAgent';
// import fireEvent from '../Events';

const firefoxSendMessage = (chrome, data) => chrome.runtime.sendMessage(data);

const chromeSendMessage = (chrome, data) => new Promise((resolve, reject) => {
  chrome.runtime.sendMessage(undefined, data, undefined, (response) => {
    if (!response && chrome.runtime.lastError) {
      reject(chrome.runtime.lastError);
    } else {
      resolve(response);
    }
  });
});

export default class PostOffice {
  constructor(chrome, issueData) {
    this.chrome = chrome;
    this.issueData = issueData;
    if (isFirefox()) {
      this.sendMessage = firefoxSendMessage;
    } else {
      this.sendMessage = chromeSendMessage;
    }

    this.handlers = { start: [], stop: [], trash: [] };
  }

  async updateClock(clockData) {
    return this.sendMessage(
      this.chrome,
      {
        action: 'update',
        clockData,
        issueData: this.issueData,
      },
    );
  }

  async trashClock() {
    return this.sendMessage(
      this.chrome,
      {
        action: 'trash',
        issueData: this.issueData,
      },
    );
  }

  async getClock() {
    return this.sendMessage(
      this.chrome,
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
