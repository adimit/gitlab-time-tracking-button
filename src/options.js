import ChromeAdapter from './ChromeAdapter';
import Options from './Options';

const myChrome = new ChromeAdapter(chrome);
new Options(myChrome).start();
