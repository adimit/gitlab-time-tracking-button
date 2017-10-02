import Clock from '../Clock';
import DateFormat from '../DateFormat';
import ClockViewModel from './ClockViewModel';
import Server from './../Server';
import UrlParser from '../UrlParser';
import ChromeAdapter from '../ChromeAdapter';
import InstanceManager from '../InstanceManager';
import PostOffice from './PostOffice';

const clockContainerId = 'time-tracking-clock-container';

if (document.getElementById(clockContainerId) === null) {
  const urlParser = new UrlParser(window.location.href);
  const issueData = urlParser.getAllData();
  const postOffice = new PostOffice(chrome, issueData);

  const startStopButton = document.createElement('div');
  startStopButton.classList.add('start-stop-button');
  startStopButton.textContent = 'start';

  const saveButton = document.createElement('div');
  saveButton.classList.add('save-time-button');
  saveButton.classList.add('green');
  saveButton.textContent = 'save';

  const timeDisplay = document.createElement('span');
  timeDisplay.classList.add('time-display');

  const trashButton = document.createElement('div');
  trashButton.classList.add('trash-time-button');
  trashButton.classList.add('red');
  trashButton.textContent = 'trash';

  const ourContainer = document.createElement('div');
  ourContainer.setAttribute('id', clockContainerId);
  ourContainer.classList.add('block');
  ourContainer.classList.add('clock_container'); // gitlab does it this way…

  ourContainer.append(timeDisplay);
  ourContainer.append(startStopButton);
  ourContainer.append(saveButton);
  ourContainer.append(trashButton);

  const dueDateContainer = document.querySelector('.block.due_date');
  dueDateContainer.before(ourContainer);

  postOffice.getClock().then((savedClock) => {
    const clockView = new ClockViewModel(new Clock(savedClock));

    clockView.subscribe((rawTime) => {
      timeDisplay.textContent = DateFormat.precise(rawTime);
    });

    clockView.onStart(() => {
      startStopButton.textContent = 'stop';
      startStopButton.classList.remove('stopped');
      startStopButton.classList.add('started');
      saveButton.classList.remove('invisible');
      trashButton.classList.remove('invisible');
    });

    clockView.onStop(() => {
      startStopButton.textContent = 'start';
      startStopButton.classList.remove('started');
      startStopButton.classList.add('stopped');
    });

    clockView.onChangeState(async (rawTime) => {
      timeDisplay.textContent = DateFormat.precise(rawTime);
      if (rawTime > 0) {
        saveButton.classList.remove('invisible');
        trashButton.classList.remove('invisible');
      } else {
        saveButton.classList.add('invisible');
        trashButton.classList.add('invisible');
      }
    });

    InstanceManager.initialize(new ChromeAdapter(chrome)).then((instanceManager) => {
      const server = new Server(instanceManager);

      startStopButton.onclick = () => {
        clockView.toggle();
        postOffice.updateClock(clockView.getClock());
      };

      trashButton.onclick = () => {
        clockView.resetClock(new Clock());
        postOffice.trashClock();
      };

      saveButton.onclick = async () => {
        const time = clockView.getTime();
        clockView.stop();
        const response = await server.record(time, issueData);
        if (response.status === 'ok') {
          clockView.resetClock(new Clock());
          postOffice.trashClock();
        } else {
          console.error(response); // eslint-disable-line no-console
        }
      };
    });

    clockView.changeState();
  });
}
