import DateFormat from '../DateFormat';

const constructTimeDispaly = (container) => {
  const timeDisplay = document.createElement('span');
  timeDisplay.classList.add('time-display');
  container.append(timeDisplay);
  return timeDisplay;
};

export default class ClockView {
  constructor(container) {
    this.display = constructTimeDispaly(container);
  }

  reset() {
    this.display.textContent = '';
  }

  render(rawTime) {
    const timeString = DateFormat.precise(rawTime);
    this.display.textContent = timeString;
  }
}
