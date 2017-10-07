const makeKey = ({ instance, group, project, issue }) => `${instance}&${group}&${project}&${issue}`;

export default class BackgroundMessageListener {
  constructor(timeKeeper, tabRegistry) {
    this.timeKeeper = timeKeeper;
    this.tabRegistry = tabRegistry;
  }

  async processMessage({ action, issueData, clockData }, { tab }) {
    const key = makeKey(issueData);
    switch (action) {
      case 'update':
        this.tabRegistry.update(tab.id, issueData, clockData);
        return this.timeKeeper.updateClock(key, clockData);
      case 'trash':
        this.tabRegistry.trash(tab.id, issueData);
        return this.timeKeeper.trashClock(key);
      case 'get':
        return this.timeKeeper.giveClock(key);
      default:
        throw Error(`Unknown action ${action}`);
    }
  }
}
