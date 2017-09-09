export default class TabListener {
  constructor(myChrome) {
    this.chrome = myChrome;
  }

  updateTabs(tabId, changeInfo, tab) {
    console.log(tabId, changeInfo, tab);
  }
}
