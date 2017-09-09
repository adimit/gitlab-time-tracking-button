import TabListener from './TabListener';
import InstanceManager from './InstanceManager';
import ChromeAdapter from './ChromeAdapter';

const Chrome = new ChromeAdapter(chrome);
const instanceManager = new InstanceManager(Chrome);
const tabListener = new TabListener(Chrome, instanceManager);

chrome.storage.onChanged.addListener(instanceManager.updateStorage);
chrome.tabs.onUpdated.addListener(tabListener.updateTabs);
