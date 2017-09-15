import TabListener from './TabListener';
import InstanceManager from './InstanceManager';
import ChromeAdapter from './ChromeAdapter';
import ChromeTabs from './ChromeTabs';

const chromeAdapter = new ChromeAdapter(chrome);
const chromeTabs = new ChromeTabs(chrome);

chromeAdapter.getOrDefault('gitlabs', { gitlabs: {} }).then(({ gitlabs }) => {
  const instanceManager = new InstanceManager(gitlabs);
  const tabListener = new TabListener(chromeTabs, instanceManager);

  chrome.storage.onChanged.addListener(changes => instanceManager.updateStorage(changes));
  chrome.tabs.onUpdated.addListener((tabid, changeInfo, data) => tabListener.updateTabs(data));
});
