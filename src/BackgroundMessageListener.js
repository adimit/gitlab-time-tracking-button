export default class BackgroundMessageListener {
  constructor(timeKeeper, tabRegistry) {
    this.timeKeeper = timeKeeper;
    this.tabRegistry = tabRegistry;
  }

  async processMessage({ action, issueData, clockData }, { tab }) {
    switch (action) {
      case 'update':
        this.tabRegistry.update(tab.id, issueData, clockData);
        return this.timeKeeper.updateClock(issueData, clockData);
      case 'trash':
        this.tabRegistry.trash(tab.id, issueData);
        return this.timeKeeper.trashClock(issueData);
      case 'get':
        return this.timeKeeper.giveClock(issueData);
      default:
        throw Error(`Unknown action ${action}`);
    }
  }
}
