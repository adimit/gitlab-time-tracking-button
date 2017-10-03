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

  render(rawTime) {
    const timeString = rawTime === 0 ? '' : DateFormat.precise(rawTime);
    this.display.textContent = timeString;
  }
}
