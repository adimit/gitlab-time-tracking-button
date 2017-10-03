import feather from 'feather-icons';

const createButton = (text, icon) => {
  const button = document.createElement('div');
  button.classList.add(`time-tracking-${text}-button`);
  button.innerHTML = feather.toSvg(icon, { width: 16, height: 16 });
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
    this.startButton = createButton('start', 'play');
    this.stopButton = createButton('stop', 'square');
    this.saveButton = createButton('save', 'upload');
    this.trashButton = createButton('trash', 'trash');
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
