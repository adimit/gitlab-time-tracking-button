export default class PreferencesView {
  constructor(preferences) {
    this.allowConcurrentTimersCheckBox = document.getElementById('allow-concurrent-timers');
    this.preferences = preferences;
  }

  async restorePreferences() {
    console.log('restoring view', this.preferences);
    this.allowConcurrentTimersCheckBox.checked = this.preferences.getAllowConcurrentTimers();
  }

  addListeners() {
    const preferences = this.preferences;
    this.allowConcurrentTimersCheckBox.onchange = async () => {
      await preferences.setAllowConcurrentTimers(this.allowConcurrentTimersCheckBox.checked);
    };
  }

  start() {
    this.restorePreferences();
    this.addListeners();
    return this;
  }
}
