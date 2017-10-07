import Instances from './Options/Instances';
import Preferences from './Options/Preferences';
import PreferencesView from './Options/PreferencesView';
import Browser from './Browser';
import defaultPreferences from './Options/Defaults';

const browser = new Browser(chrome);
new Instances(browser).start();

(async () => {
  const preferences = await Preferences.initialize(browser, defaultPreferences);
  console.log('initializing view', preferences);
  new PreferencesView(preferences).start();
})();
