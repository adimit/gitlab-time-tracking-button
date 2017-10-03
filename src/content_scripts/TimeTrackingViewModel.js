import Clock from '../Clock';

const updateButtonView = (buttonViewModel, clockViewModel) => {
  buttonViewModel.setClockState(clockViewModel.getState());
};

export default class TimeTrackingViewModel {
  constructor(postOffice, server, clockViewModel, buttonViewModel, issueData) {
    this.postOffice = postOffice;
    this.server = server;
    this.clockViewModel = clockViewModel;
    this.buttonViewModel = buttonViewModel;
    this.issueData = issueData;

    buttonViewModel.onSave(() => this.save());
    buttonViewModel.onTrash(() => this.trash());
    buttonViewModel.onStart(() => this.start());
    buttonViewModel.onStop(() => this.stop());

    updateButtonView(buttonViewModel, clockViewModel);
  }

  async save() {
    this.stop();
    const time = this.clockViewModel.getTime();
    const response = await this.server.record(time, this.issueData);
    if (response.status === 'ok') {
      this.trash();
    } else {
      console.error(response); // eslint-disable-line no-console
    }
    updateButtonView(this.buttonViewModel, this.clockViewModel);
  }

  start() {
    this.clockViewModel.start();
    this.postOffice.updateClock(this.clockViewModel.getClock());
    updateButtonView(this.buttonViewModel, this.clockViewModel);
  }

  trash() {
    this.clockViewModel.resetClock(new Clock());
    this.postOffice.trashClock();
    updateButtonView(this.buttonViewModel, this.clockViewModel);
  }

  stop() {
    this.clockViewModel.stop();
    this.postOffice.updateClock(this.clockViewModel.getClock());
    updateButtonView(this.buttonViewModel, this.clockViewModel);
  }
}
