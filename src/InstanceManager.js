export default class InstanceManager {
  constructor(myChrome) {
    this.chrome = myChrome;
    this.instances = {};
  }

  async updateStorage(changes, namespace) {
    console.log(changes, namespace);
    // updates instances
    // TODO triggers removed instance event if any instance(s) got removed (need
    // to add registering function for event handler first)
  }

  isRegisteredInstance(url) {
    return false;
  }
}
