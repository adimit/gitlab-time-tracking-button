export default class Server {
  constructor(instanceManager) {
    this.instanceManager = instanceManager;
  }

  async record(time, location) {
    const key = this.instanceManager.getApiKey(location.instance);
    console.log('Recording time', time, location, key);

    return { status: 'ok' };
  }
}
