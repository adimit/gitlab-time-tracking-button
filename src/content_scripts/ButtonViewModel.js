import fireEvent from '../Events';

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
  }

  stop() {
    fireEvent(this.handlers.stop, undefined);
  }

  save() {
    const buttonView = this.buttonView;
    fireEvent(this.handlers.save, {
      onSuccess: () => buttonView.render('fresh'),
      onFailure: (error) => { console.error(error); buttonView.render('stopped'); }, // eslint-disable-line no-console
    });
  }

  trash() {
    fireEvent(this.handlers.trash, undefined);
  }

  render(state) {
    this.buttonView.render(state);
  }
}
