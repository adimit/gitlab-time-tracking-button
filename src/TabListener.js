export default class TabListener {
  constructor(myChrome, instanceManager) {
    this.chrome = myChrome;
    this.instanceManager = instanceManager;
  }

  updateTabs(info) {
    console.log(info);
  }
}
