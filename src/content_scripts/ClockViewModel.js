import fireEvent from '../Events';

const subscribeToClock = (clock, clockModel) => {
  clock.subscribe(time => fireEvent(clockModel.onTickHandlers, time));
};

export default class ClockViewModel {
  constructor(clock, clockView) {
    this.clock = clock;
    this.clockView = clockView;
    this.onStartHandlers = [];
    this.onStopHandlers = [];
    this.onTickHandlers = [
      rawTime => clockView.render(rawTime),
    ];
    subscribeToClock(clock, this);
    clockView.render(clock.getTime());
  }

  getState() {
    if (this.clock.isRunning()) {
      return 'running';
    }
    if (this.clock.getTime() > 0) {
      return 'stopped';
    }
    return 'fresh';
  }

  toggle() {
    this.clock.toggle();
  }

  stop() {
    this.clock.stop();
  }

  start() {
    this.clock.start();
  }

  resetClock(clock) {
    this.clock.destroy();
    this.clock = clock;
    subscribeToClock(clock, this);
    this.clockView.render(clock.getTime());
  }

  getTime() {
    return this.clock.getTime();
  }

  getClock() {
    return this.clock.serialize();
  }

  hasTime() {
    return this.clock.getTime() > 0;
  }

  onStart(f) {
    this.onStartHandlers.push(f);
  }

  onStop(f) {
    this.onStopHandlers.push(f);
  }

  onChangeState(f) {
    this.onChangeStateHandlers.push(f);
  }

  subscribe(f) {
    this.onTickHandlers.push(f);
  }
}
