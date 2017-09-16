/* eslint-disable no-mixed-operators */

export default class DateFormat {
  static precise(time) {
    if (time === 0) {
      return '';
    }

    if (time < 60) {
      return `${Math.floor(time)}s`;
    }

    const days = Math.floor(time / (3600 * 8));
    const hours = Math.floor(time % (3600 * 8) / 3600);
    const minutes = Math.floor(time % 3600 / 60);

    const dayString = days > 0 ? `${days}d ` : '';

    return `${dayString}${hours}:${this.leftPad(minutes)}`;
  }

  static leftPad(number) {
    const pad = number < 10 ? '0' : '';
    return `${pad}${number}`;
  }
}
