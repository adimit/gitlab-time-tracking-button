const createButton = (text, f) => {
  const button = document.createElement('div');
  button.classList.add(`time-tracking-${text}-button`);
  button.textContent = text;
  button.onClick(() => f());
  return button;
};

const emptyContainer = (container) => {
  while (container.lastChild) {
    container.removeChild(container.lastChild);
  }
};

const renderRunning = (container, stopButton, saveButton, trashButton) => {
  container.append(stopButton);
  container.append(saveButton);
  container.append(trashButton);
};

const renderStopped = (container, startButton, saveButton, trashButton) => {
  container.append(startButton);
  container.append(saveButton);
  container.append(trashButton);
};

const renderFresh = (container, startButton) => {
  container.append(startButton);
};

export default class ButtonView {
  constructor(container, save, start, stop, trash) {
    this.startButton = createButton('start', start);
    this.trashButton = createButton('trash', trash);
    this.stopButton = createButton('stop', stop);
    this.saveButton = createButton('save', save);
    this.container = container;
  }

  render(state) {
    emptyContainer();
    switch (state) {
      case 'running':
        renderRunning(this.container, this.stopButton, this.saveButton, this.trashButton);
        break;
      case 'stopped':
        renderStopped(this.container, this.startButton, this.saveButton, this.trashButton);
        break;
      default:
        renderFresh(this.container, this.startButton);
        break;
    }
  }
}
