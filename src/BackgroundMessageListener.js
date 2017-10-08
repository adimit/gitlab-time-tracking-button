export default class BackgroundMessageListener {
  constructor(timeKeeper, tabRegistry, preferences) {
    this.timeKeeper = timeKeeper;
    this.tabRegistry = tabRegistry;
    this.preferences = preferences;
  }

  async processMessage({ action, issueData, clockData }, { tab }) {
    switch (action) {
      case 'start':
        if (!this.preferences.getAllowConcurrentTimers()) {
          await this.stopOtherRunningClocks(tab.id, issueData);
        }
        this.tabRegistry.update(tab.id, issueData, clockData);
        return this.timeKeeper.updateClock(issueData, clockData);
      case 'stop':
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

  async stopOtherRunningClocks(tabId, runningIssueData) {
    const runningClocks = await this.timeKeeper.getRunningClocks();
    runningClocks.forEach(async ({ issueData, clock }) => {
      if (runningIssueData !== issueData) { // don't stop current issue
        clock.stop();
        const clockData = clock.serialize();

        await this.tabRegistry.update(tabId, issueData, clockData);
        await this.timeKeeper.updateClock(issueData, clockData);
      }
    });
  }
}
