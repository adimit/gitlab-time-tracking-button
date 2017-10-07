import Instances from './Options/Instances';
import Preferences from './Options/Preferences';
import Browser from './Browser';

const browser = new Browser(chrome);
new Instances(browser).start();
new Preferences(browser).start();
