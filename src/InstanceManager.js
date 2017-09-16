import fireEvent from './Events';
import UrlParser from './UrlParser';

export default class InstanceManager {
  constructor(instances) {
    this.instances = instances;
    this.removalHandlers = [];
  }

  updateStorage({ gitlabs }) {
    if (gitlabs === undefined) {
      return this;
    }

    this.instances = gitlabs.newValue;

    if (gitlabs.newValue !== undefined
     && gitlabs.oldValue !== undefined) {
      const newHosts = new Set(Object.keys(gitlabs.newValue));
      const oldHosts = new Set(Object.keys(gitlabs.oldValue));

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

    const parser = new UrlParser(url);
    const key = parser.getInstanceKey();
    return Object.keys(this.instances).includes(key);
  }

  getApiKey(instance) {
    return this.instances[instance] || null;
  }

  static async initialize(chrome) {
    const { gitlabs } = await chrome.getOrDefault('gitlabs', { gitlabs: {} });
    return new this(gitlabs);
  }
}
