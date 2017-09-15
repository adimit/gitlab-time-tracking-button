export default class Clock {
  constructor(timeLog) {
    this.timeLog = timeLog || [];
    this.currentTime = null;
  }

  start() {
    if (this.currentTime === null) {
      this.currentTime = { start: Date.now() };
    }
    return this;
  }

  stop() {
    if (this.currentTime !== null) {
      this.currentTime.duration = this.getCurrentRunningTime();
      this.timeLog.push(this.currentTime);
      this.currentTime = null;
    }
    return this;
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
}
