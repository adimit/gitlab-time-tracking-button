import fireEvent from './Events';

export default class Clock {
  constructor(clockData) {
    this.timeLog = [];
    this.currentTime = null;
    if (clockData !== undefined && clockData !== null) {
      const { timeLog, currentTime } = clockData;
      this.timeLog = timeLog;
      this.currentTime = currentTime;
    }
    this.subscribers = [];
    this.tick = null;

    // in case we restored from a running clock
    if (this.isRunning()) {
      this.startTicks();
    }
  }

  start() {
    if (!this.isRunning()) {
      this.currentTime = { start: Date.now() };
      this.startTicks();
    }
    return this;
  }

  stop() {
    if (this.isRunning()) {
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

  destroy() {
    this.stopTicks();
    this.timeLog = [];
    this.currentTime = null;
    this.subscribers = [];
    this.tick = null;
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

  serialize() {
    return {
      currentTime: this.currentTime,
      timeLog: this.timeLog,
    };
  }
}
