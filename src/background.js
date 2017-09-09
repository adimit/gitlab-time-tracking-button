import TabListener from './TabListener';
import InstanceManager from './InstanceManager';
import ChromeAdapter from './ChromeAdapter';

const isFirefox = navigator.userAgent.indexOf('Chrome') === -1;

const Chrome = new ChromeAdapter(chrome, isFirefox);
const tabListener = new TabListener(chrome);
const instanceManager = new InstanceManager(Chrome, tabListener);

chrome.storage.onChanged.addListener(instanceManager.updateStorage);
