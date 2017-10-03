import Clock from '../Clock';

export default class TimeTrackingViewModel {
  constructor(postOffice, server, clockViewModel, buttonViewModel, issueData) {
    this.postOffice = postOffice;
    this.server = server;
    this.clockViewModel = clockViewModel;
    this.buttonViewModel = buttonViewModel;
    this.issueData = issueData;

    buttonViewModel.onStart(() => this.start());
    buttonViewModel.onStop(() => this.stop());
    buttonViewModel.onSave(callbacks => this.save(callbacks));
    buttonViewModel.onTrash(() => this.trash());
  }

  async save({ onSuccess, onFailure }) {
    await this.stop();
    const time = this.clockViewModel.getTime();
    const response = await this.server.record(time, this.issueData);
    if (response.status === 'ok') {
      await this.trash();
      onSuccess();
    } else {
      onFailure(response);
    }
  }

  async start() {
    this.clockViewModel.start();
    await this.postOffice.updateClock(this.clockViewModel.getClock());
  }

  async trash() {
    this.clockViewModel.resetClock(new Clock());
    await this.postOffice.trashClock();
  }

  async stop() {
    this.clockViewModel.stop();
    await this.postOffice.updateClock(this.clockViewModel.getClock());
  }
}
