const fireEvent = (handlers, data) => {
  handlers.forEach(f => f(data));
};

export default class InstanceManager {
  constructor(myChrome) {
    this.chrome = myChrome;
    this.instances = {};
    this.removalHandlers = [];
  }

  async updateStorage(changes, namespace) {
    this.instances = changes.gitlabs.newValue;
    // updates instances
    // TODO triggers removed instance event if any instance(s) got removed (need
    // to add registering function for event handler first)
    return this;
  }

  onInstanceRemoval(listener) {
    this.removalHandlers.push(listener);
    return this;
  }

  isRegisteredInstance(url) {
    const parser = document.createElement('a');
    parser.href = url;
    const key = `${parser.protocol}//${parser.host}`;
    return Object.keys(this.instances).includes(key);
  }
}
