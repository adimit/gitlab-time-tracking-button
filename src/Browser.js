import Tabs from './Browser/Tabs';
import Runtime from './Browser/Runtime';
import Permissions from './Browser/Permissions';
import Storage from './Browser/Storage';

export default class Browser {
  constructor(browser) {
    this.tabs = new Tabs(browser);
    this.permissions = new Permissions(browser);
    this.storage = new Storage(browser);
    this.runtime = new Runtime(browser);
  }
}
