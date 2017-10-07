const defaultPreferences = {
  allowConcurrentTimers: true,
};

export default class Preferences {
  constructor(browser) {
    this.browser = browser;
    this.allowConcurrentTimersCheckBox = document.getElementById('allow-concurrent-timers');
  }

  addListeners() {
    this.allowConcurrentTimersCheckBox.onchange = async () => {
      const preferences = await this.getPreferences();
      preferences.allowConcurrentTimers = this.allowConcurrentTimersCheckBox.checked;
      await this.setPreferences(preferences);
    };
  }

  async getPreferences() {
    const result = await this.browser.storage.local.getOrDefault(
      'preferences',
      { preferences: defaultPreferences },
    );
    return result.preferences;
  }

  async setPreferences(preferences) {
    await this.browser.storage.local.set({ preferences });
  }

  async restorePreferences() {
    const preferences = await this.getPreferences();
    this.allowConcurrentTimersCheckBox.checked = preferences.allowConcurrentTimers;
  }

  async start() {
    await this.restorePreferences();
    this.addListeners();
  }
}
