export default class InstanceManager {
  constructor(myChrome) {
    this.chrome = myChrome;
  }

  updateStorage(changes, namespace) {
    console.log(changes, namespace);
  }
}
