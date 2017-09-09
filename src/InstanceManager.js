export default class InstanceManager {
  constructor(myChrome, tabListener) {
    this.chrome = myChrome;
    this.tabListener = tabListener;
  }

  updateStorage(changes, namespace) {
    console.log(changes, namespace);
  }
}
