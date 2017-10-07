import TabListener from './TabListener';
import InstanceManager from './InstanceManager';
import TimeKeeper from './TimeKeeper';
import Browser from './Browser';

const browser = new Browser(chrome);
const timeKeeper = new TimeKeeper(browser);

browser.runtime.onMessage.addListener(
  message => timeKeeper.processMessage(message),
);

InstanceManager.initialize(browser).then((instanceManager) => {
  const tabListener = new TabListener(browser, instanceManager);

  chrome.storage.onChanged.addListener(changes => instanceManager.updateStorage(changes));
  chrome.tabs.onUpdated.addListener((tabid, changeInfo, data) => tabListener.updateTabs(data));
});
