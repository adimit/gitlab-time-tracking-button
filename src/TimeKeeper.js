export default class TimeKeeper {
  constructor(chrome) {
    this.chrome = chrome;
  }

  async processMessage(message, sender, sendResponse) {
    console.log('got message', message, sender);
    sendResponse({ answer: 'got the message!' });
  }
}
