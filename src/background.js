import TabListener from './TabListener';
import InstanceManager from './InstanceManager';
import ChromeAdapter from './ChromeAdapter';
import ChromeTabs from './ChromeTabs';
import TimeKeeper from './TimeKeeper';

const chromeAdapter = new ChromeAdapter(chrome);
const chromeTabs = new ChromeTabs(chrome);
const timeKeeper = new TimeKeeper(chromeAdapter);

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => timeKeeper.processMessage(message, sender, sendResponse),
);

InstanceManager.initialize(chromeAdapter).then((instanceManager) => {
  const tabListener = new TabListener(chromeTabs, instanceManager);

  chrome.storage.onChanged.addListener(changes => instanceManager.updateStorage(changes));
  chrome.tabs.onUpdated.addListener((tabid, changeInfo, data) => tabListener.updateTabs(data));
});
