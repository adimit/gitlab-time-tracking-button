export default class TimeKeeper {
  constructor(chrome) {
    this.chrome = chrome;
  }

  async processMessage(message, sender) {
    console.log('got message', message, sender);
    return { answer: 'got the message!' };
  }
}
