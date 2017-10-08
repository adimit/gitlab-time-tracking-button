import DateFormat from './DateFormat';

export default class BackgroundMessageListener {
  constructor(browser, timeKeeper, tabRegistry, preferences) {
    this.browser = browser;
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
    const stoppedClocks = [];
    runningClocks.forEach(async ({ issueData, clock }) => {
      if (runningIssueData !== issueData) { // don't stop current issue
        clock.stop();
        const clockData = clock.serialize();
        stoppedClocks.push({ issueData, clock });

        await this.tabRegistry.update(tabId, issueData, clockData);
        await this.timeKeeper.updateClock(issueData, clockData);
      }
    });

    if (stoppedClocks.length > 0) {
      const notificationItems = stoppedClocks.map(({ issueData, clock }) => (
        ` → ${issueData.project}#${issueData.issue}: ${DateFormat.precise(clock.getTime())}`
      ));
      this.browser.notifications.create(
        'stoppedClocks',
        {
          type: 'basic',
          iconUrl: 'icons/logo-64.png',
          title: 'Stopped Other Running Clocks',
          message: `Stopped\n${notificationItems.join('\n')}`,
        },
      );
    }
  }
}
