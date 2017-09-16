import TabListener from './TabListener';
import InstanceManager from './InstanceManager';
import ChromeAdapter from './ChromeAdapter';
import ChromeTabs from './ChromeTabs';

const chromeAdapter = new ChromeAdapter(chrome);
const chromeTabs = new ChromeTabs(chrome);

InstanceManager.initialize(chromeAdapter).then((instanceManager) => {
  const tabListener = new TabListener(chromeTabs, instanceManager);

  chrome.storage.onChanged.addListener(changes => instanceManager.updateStorage(changes));
  chrome.tabs.onUpdated.addListener((tabid, changeInfo, data) => tabListener.updateTabs(data));
});
