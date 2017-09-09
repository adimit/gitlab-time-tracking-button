import ChromeAdapter from './ChromeAdapter';
import AddonOptions from './AddonOptions';

const myChrome = new ChromeAdapter(chrome);
new AddonOptions(myChrome).start();
