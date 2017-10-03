const createButton = (text) => {
  const button = document.createElement('div');
  button.classList.add(`time-tracking-${text}-button`);
  button.textContent = text;
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
  constructor(container) {
    this.container = container;
    this.startButton = createButton('start');
    this.stopButton = createButton('stop');
    this.saveButton = createButton('save');
    this.trashButton = createButton('trash');
  }

  registerListeners(start, stop, save, trash) {
    this.startButton.onclick = () => start();
    this.stopButton.onclick = () => stop();
    this.saveButton.onclick = () => save();
    this.trashButton.onclick = () => trash();
  }

  render(state) {
    emptyContainer(this.container);
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
