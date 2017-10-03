import fireEvent from '../Events.js';

export default class ButtonViewModel {
  constructor(buttonView, initialState) {
    buttonView.render(initialState);
    this.state = initialState;
    this.buttonView = buttonView;

    buttonView.registerListeners(
      () => this.start(),
      () => this.stop(),
      () => this.save(),
      () => this.trash(),
    );

    this.handlers = { start: [], stop: [], save: [], trash: [] };
  }

  onStart(f) {
    this.handlers.start.push(f);
  }

  onStop(f) {
    this.handlers.stop.push(f);
  }

  onSave(f) {
    this.handlers.save.push(f);
  }

  onTrash(f) {
    this.handlers.trash.push(f);
  }

  start() {
    fireEvent(this.handlers.start, undefined);
    this.buttonView.render('running');
  }

  stop() {
    fireEvent(this.handlers.stop, undefined);
    this.buttonView.render('stopped');
  }

  save() {
    const buttonView = this.buttonView;
    fireEvent(this.handlers.save, {
      onSuccess: () => buttonView.render('fresh'),
      onFailure: error => { console.error(error); buttonView.render('stopped'); },
    });
    this.buttonView.render('saving');
  }

  trash() {
    fireEvent(this.handlers.trash, undefined);
    this.buttonView.render('fresh');
  }
}
