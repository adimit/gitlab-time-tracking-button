import DateFormat from '../DateFormat';

export default class ClockView {
  constructor(domElement) {
    this.display = domElement;
  }

  reset() {
    this.display.textContent = '';
  }

  render(rawTime) {
    const timeString = DateFormat.precise(rawTime);
    this.display.textContent = timeString;
  }
}
