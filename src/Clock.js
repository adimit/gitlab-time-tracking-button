import fireEvent from './Events';

export default class Clock {
  constructor(timeLog) {
    this.timeLog = timeLog || [];
    this.currentTime = null;
    this.subscribers = [];
    this.tick = null;
  }

  start() {
    if (this.currentTime === null) {
      this.currentTime = { start: Date.now() };
      this.startTicks();
    }
    return this;
  }

  stop() {
    if (this.currentTime !== null) {
      this.currentTime.duration = this.getCurrentRunningTime();
      this.timeLog.push(this.currentTime);
      this.currentTime = null;
      this.stopTicks();
    }
    return this;
  }

  startTicks() {
    const timeSoFar = this.getLoggedTime();
    const clock = this;
    this.tick = setInterval(
      () => fireEvent(clock.subscribers, timeSoFar + clock.getCurrentRunningTime()),
      1000,
    );
  }

  stopTicks() {
    clearInterval(this.tick);
  }

  isRunning() {
    return this.currentTime !== null;
  }

  toggle() {
    if (this.isRunning()) {
      this.stop();
    } else {
      this.start();
    }

    return this;
  }

  getTimeLog() {
    return this.timeLog;
  }

  getLoggedTime() {
    return this.timeLog.map(entry => entry.duration).reduce((x, y) => x + y, 0);
  }

  getCurrentRunningTime() {
    if (this.currentTime) {
      return (Date.now() - this.currentTime.start) / 1000;
    }

    return 0;
  }

  getTime() {
    return this.getLoggedTime() + this.getCurrentRunningTime();
  }

  subscribe(f) {
    this.subscribers.push(f);
  }
}
