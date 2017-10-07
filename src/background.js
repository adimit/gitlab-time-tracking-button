import TabListener from './TabListener';
import InstanceManager from './InstanceManager';
import TimeKeeper from './TimeKeeper';
import Browser from './Browser';

const browser = new Browser(chrome);
const timeKeeper = new TimeKeeper(browser);

browser.runtime.onMessage.addListener(
  (message, sender) => timeKeeper.processMessage(message, sender),
);

InstanceManager.initialize(browser).then((instanceManager) => {
  const tabListener = new TabListener(browser, instanceManager);

  browser.storage.onChanged.addListener(changes => instanceManager.updateStorage(changes));
  browser.tabs.onUpdated.addListener((tabid, changeInfo, data) => tabListener.updateTabs(data));
});
