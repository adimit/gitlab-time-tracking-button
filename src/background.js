import TabListener from './TabListener';
import InstanceManager from './InstanceManager';
import ChromeAdapter from './ChromeAdapter';
import ChromeTabs from './ChromeTabs';
import TimeKeeper from './TimeKeeper';
import isFirefox from './UserAgent';

const chromeAdapter = new ChromeAdapter(chrome);
const chromeTabs = new ChromeTabs(chrome);
const timeKeeper = new TimeKeeper(chromeAdapter);

if (isFirefox()) {
  chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) =>
      timeKeeper.processMessage(message, sender, sendResponse));
} else {
  chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
      timeKeeper.processMessage(message, sender, sendResponse);
      return true;
    });
}

InstanceManager.initialize(chromeAdapter).then((instanceManager) => {
  const tabListener = new TabListener(chromeTabs, instanceManager);

  chrome.storage.onChanged.addListener(changes => instanceManager.updateStorage(changes));
  chrome.tabs.onUpdated.addListener((tabid, changeInfo, data) => tabListener.updateTabs(data));
});
