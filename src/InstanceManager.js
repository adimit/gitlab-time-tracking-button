const fireEvent = (handlers, data) => {
  handlers.forEach(f => f(data));
};

export default class InstanceManager {
  constructor(instances) {
    this.instances = instances;
    this.removalHandlers = [];
  }

  updateStorage(changes) {
    this.instances = changes.gitlabs.newValue;

    if (changes.gitlabs.newValue !== undefined
     && changes.gitlabs.oldValue !== undefined) {
      const newHosts = new Set(Object.keys(changes.gitlabs.newValue));
      const oldHosts = new Set(Object.keys(changes.gitlabs.oldValue));

      const vanishedHosts = new Set([...oldHosts].filter(x => !newHosts.has(x)));

      const removalHandlers = this.removalHandlers;
      vanishedHosts.forEach(host => fireEvent(removalHandlers, host));
    }

    return this;
  }

  onInstanceRemoval(listener) {
    this.removalHandlers.push(listener);
    return this;
  }

  isRegisteredInstance(url) {
    if (this.instances === undefined) {
      return false;
    }

    const parser = document.createElement('a');
    parser.href = url;
    const key = `${parser.protocol}//${parser.host}/`;
    return Object.keys(this.instances).includes(key);
  }
}
