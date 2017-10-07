import Browser from '../Browser';
import Clock from '../Clock';
import ClockView from './ClockView';
import ClockViewModel from './ClockViewModel';
import Server from './../Server';
import UrlParser from '../UrlParser';
import InstanceManager from '../InstanceManager';
import PostOffice from './PostOffice';
import ButtonView from './ButtonView';
import ButtonViewModel from './ButtonViewModel';
import TimeTrackingViewModel from './TimeTrackingViewModel';

const clockContainerId = 'time-tracking-clock-container';

if (document.getElementById(clockContainerId) === null) {
  const browser = new Browser(chrome);
  const urlParser = new UrlParser(window.location.href);
  const issueData = urlParser.getAllData();
  const postOffice = new PostOffice(browser, issueData);

  const ourContainer = document.createElement('div');
  ourContainer.setAttribute('id', clockContainerId);
  ourContainer.classList.add('block');
  ourContainer.classList.add('clock_container'); // gitlab does it this way…

  const timeDisplayContainer = document.createElement('div');
  timeDisplayContainer.setAttribute('id', 'time-tracking-time-display-container');
  const buttonContainer = document.createElement('div');
  buttonContainer.setAttribute('id', 'time-tracking-button-container');

  ourContainer.append(timeDisplayContainer);
  ourContainer.append(buttonContainer);

  const dueDateContainer = document.querySelector('.block.due_date');
  dueDateContainer.before(ourContainer);

  postOffice.getClock().then((savedClock) => {
    const clockView = new ClockView(timeDisplayContainer);
    const clockViewModel = new ClockViewModel(new Clock(savedClock), clockView);

    InstanceManager.initialize(browser).then((instanceManager) => {
      const server = new Server(instanceManager);
      const buttonView = new ButtonView(buttonContainer);
      const buttonViewModel = new ButtonViewModel(buttonView, clockViewModel.getState());
      const timeTracker = new TimeTrackingViewModel(
        postOffice,
        server,
        clockViewModel,
        buttonViewModel,
        issueData,
      );
      postOffice.onStart(() => timeTracker.start());
      postOffice.onStop(() => timeTracker.stop());
      postOffice.onTrash(() => timeTracker.trash());
    });
  });
}
