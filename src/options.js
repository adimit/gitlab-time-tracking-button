import AddonOptions from './AddonOptions';
import Browser from './Browser';

const browser = new Browser(chrome);
new AddonOptions(browser).start();
