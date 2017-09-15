// The injectedIssueData comes from where this script will be injected
const issueData = injectedIssueData; // eslint-disable-line no-undef

const ourContainer = document.createElement('div');
ourContainer.classList.add('block');
ourContainer.classList.add('clock_container');

const startStopButton = document.createElement('button');
startStopButton.classList.add('start-stop-button');
startStopButton.textContent = 'start';

const saveButton = document.createElement('button');
saveButton.classList.add('save-time-button');
saveButton.textContent = 'save';

const timeDisplay = document.createElement('span');
timeDisplay.classList.add('time-display');
timeDisplay.textContent = '0:00';

ourContainer.append(startStopButton);
ourContainer.append(timeDisplay);
ourContainer.append(saveButton);

const dueDateContainer = document.querySelector('.block.due_date');
dueDateContainer.before(ourContainer);
