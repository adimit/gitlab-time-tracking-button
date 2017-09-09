import ChromeAdapter from './ChromeAdapter';
import Options from './Options';

const isFirefox = navigator.userAgent.indexOf('Chrome') === -1;
const myChrome = new ChromeAdapter(chrome, isFirefox);
new Options(myChrome).start();
