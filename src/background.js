import TabListener from './TabListener';
import InstanceManager from './InstanceManager';
import ChromeAdapter from './ChromeAdapter';

const Chrome = new ChromeAdapter(chrome);
const instanceManager = new InstanceManager(Chrome);
const tabListener = new TabListener(Chrome, instanceManager);

chrome.storage.onChanged.addListener(changes => instanceManager.updateStorage(changes));
chrome.tabs.onUpdated.addListener((tabid, changeInfo, data) => tabListener.updateTabs(data));
