import fireEvent from '../Events';

export default class ClockViewModel {
  constructor(clock) {
    this.clock = clock;
    this.onStartHandlers = [];
    this.onStopHandlers = [];
    this.onTickHandlers = [];
    this.onChangeStateHandlers = [];
    const clockModel = this;
    this.clock.subscribe(time => fireEvent(clockModel.onTickHandlers, time));
  }

  toggle() {
    this.clock.toggle();
    this.changeState();
  }

  changeState() {
    fireEvent(this.onChangeStateHandlers, this.clock.getTime());
    if (this.clock.isRunning()) {
      fireEvent(this.onStartHandlers, null);
    } else {
      fireEvent(this.onStopHandlers, null);
    }
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
