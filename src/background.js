import TabListener from './TabListener';
import InstanceManager from './InstanceManager';
import TimeKeeper from './TimeKeeper';
import Browser from './Browser';
import TabRegistry from './TabRegistry';
import BackgroundMessageListener from './BackgroundMessageListener';

const browser = new Browser(chrome);
const tabRegistry = new TabRegistry(browser);

browser.storage.local.getOrDefault('clocks', { clocks: {} }).then(({ clocks }) => {
  const timeKeeper = new TimeKeeper(browser, clocks);
  const listener = new BackgroundMessageListener(timeKeeper, tabRegistry);

  browser.runtime.onMessage.addListener(
    (message, sender) => listener.processMessage(message, sender),
  );
});

InstanceManager.initialize(browser).then((instanceManager) => {
  const tabListener = new TabListener(browser, instanceManager);
  tabListener.onInstanceTabLoaded(tabRegistry.registerTab);
  tabListener.onNonInstanceTabLoaded(tabRegistry.deregisterTab);

  browser.storage.onChanged.addListener(changes => instanceManager.updateStorage(changes));
  browser.tabs.onUpdated.addListener((tabid, changeInfo, data) => tabListener.updateTabs(data));
});
