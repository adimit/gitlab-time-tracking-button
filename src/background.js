import TabListener from './TabListener';
import InstanceManager from './InstanceManager';
import TimeKeeper from './TimeKeeper';
import Browser from './Browser';
import TabRegistry from './TabRegistry';
import BackgroundMessageListener from './BackgroundMessageListener';
import Preferences from './Options/Preferences';
import defaultPreferences from './Options/Defaults';

const browser = new Browser(chrome);
const tabRegistry = new TabRegistry(browser);


// TODO a storage listener

browser.storage.local.getOrDefault('clocks', { clocks: {} }).then(({ clocks }) => {
  const timeKeeper = new TimeKeeper(browser, clocks);
  const listener = new BackgroundMessageListener(timeKeeper, tabRegistry);

  browser.runtime.onMessage.addListener(
    (message, sender) => listener.processMessage(message, sender),
  );
});

(async () => {
  const instanceManager = await InstanceManager.initialize(browser);
  const preferences = await Preferences.initialize(browser, defaultPreferences);

  const tabListener = new TabListener(browser, instanceManager);
  tabListener.onInstanceTabLoaded(tab => tabRegistry.registerTab(tab));
  tabListener.onNonInstanceTabLoaded(tab => tabRegistry.deregisterTab(tab));

  browser.storage.onChanged.addListener(changes => instanceManager.updateStorage(changes));
  browser.storage.onChanged.addListener(changes => preferences.updateStorage(changes));
  browser.tabs.onUpdated.addListener((tabid, changeInfo, data) => tabListener.updateTabs(data));
})();
