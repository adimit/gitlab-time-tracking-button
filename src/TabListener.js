export default class TabListener {
  constructor(myChrome, instanceManager) {
    this.chrome = myChrome;
    this.instanceManager = instanceManager;
  }

  updateTabs(tabId, changeInfo, tab) {
    console.log(tabId, changeInfo, tab);
  }
}
