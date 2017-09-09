import TabListener from './TabListener';
import InstanceManager from './InstanceManager';
import ChromeAdapter from './ChromeAdapter';

const Chrome = new ChromeAdapter(chrome);
const tabListener = new TabListener(Chrome);
const instanceManager = new InstanceManager(Chrome, tabListener);

chrome.storage.onChanged.addListener(instanceManager.updateStorage);
chrome.tabs.onUpdated.addListener(tabListener.updateTabs);
