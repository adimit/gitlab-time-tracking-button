import TabListener from './TabListener';
import InstanceManager from './InstanceManager';
import ChromeTabs from './ChromeTabs';
import TimeKeeper from './TimeKeeper';
import isFirefox from './UserAgent';
import Browser from './Browser';

const chromeTabs = new ChromeTabs(chrome);
const browser = new Browser(chrome);
const timeKeeper = new TimeKeeper(browser);

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

InstanceManager.initialize(browser).then((instanceManager) => {
  const tabListener = new TabListener(chromeTabs, instanceManager);

  chrome.storage.onChanged.addListener(changes => instanceManager.updateStorage(changes));
  chrome.tabs.onUpdated.addListener((tabid, changeInfo, data) => tabListener.updateTabs(data));
});
