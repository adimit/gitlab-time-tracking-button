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
    this.onChangeStateHandlers = [];
    subscribeToClock(clock, this);
  }

  toggle() {
    this.clock.toggle();
    this.changeState();
  }

  stop() {
    this.clock.stop();
    this.changeState();
  }

  resetClock(clock) {
    this.clock.destroy();
    this.clock = clock;
    subscribeToClock(clock, this);
    this.clockView.reset();
    this.changeState();
  }

  getTime() {
    return this.clock.getTime();
  }

  changeState() {
    fireEvent(this.onChangeStateHandlers, this.clock.getTime());
    if (this.clock.isRunning()) {
      fireEvent(this.onStartHandlers, null);
    } else {
      fireEvent(this.onStopHandlers, null);
    }
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
