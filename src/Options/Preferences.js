const update = async (preferences, browser) => {
  await browser.storage.local.set({ preferences });
};

export default class Preferences {
  constructor(browser, preferences) {
    this.browser = browser;
    this.preferences = preferences;
  }

  async setAllowConcurrentTimers(value) {
    this.preferences.allowConcurrentTimers = value;
    await update(this.preferences, this.browser);
  }

  getAllowConcurrentTimers() {
    return this.preferences.allowConcurrentTimers;
  }

  static async initialize(browser, defaults) {
    const { preferences } = await browser.storage.local.getOrDefault('preferences', { preferences: defaults });
    return new this(browser, preferences);
  }
}
