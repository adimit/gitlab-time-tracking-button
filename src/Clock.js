const isOdd = number => number % 2 === 1;

export default class Clock {
  constructor(timeLog) {
    this.timeLog = [];
    this.timeLog = timeLog || [];
  }

  start() {
    if (!this.isRunning()) {
      this.toggle();
    }
  }

  stop() {
    if (this.isRunning()) {
      this.toggle();
    }
  }

  isRunning() {
    isOdd(this.timeLog.length);
  }

  toggle() {
    
  }

  getTimeLog() {
    return this.timeLog;
  }

  getTotalTime() {
    
  }

  getCurrentRunningClock() {
    if (!this.isRunning()) {
      return 0;
    }
  }
}
