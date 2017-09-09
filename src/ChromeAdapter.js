export default class ChromeAdapter {
  constructor(myChrome, isFirefox) {
    this.isFirefox = isFirefox;
    this.chrome = myChrome;
  }

  getAllPermissions() {
    return new Promise((resolve) => {
      this.chrome.permissions.getAll(results => resolve(results));
    });
  }

  async addPermission(url) {
    if (this.isFirefox) {
      await this.uncheckedAddPermission(url);
      return;
    }

    const isPermissionEnabled = await this.isPermissionEnabled(url);
    if (!isPermissionEnabled) {
      await this.uncheckedAddPermission(url);
    }
  }

  removePermission(url) {
    return new Promise((resolve, reject) => {
      this.chrome.permissions.remove(
        { origins: [url] },
        (removed) => {
          if (removed) {
            resolve();
          } else {
            reject(`Permission to ${url} could not be removed (${removed})`);
          }
        },
      );
    });
  }

  uncheckedAddPermission(url) {
    return new Promise((resolve, reject) => {
      this.chrome.permissions.request({
        origins: [url],
      }, (granted) => {
        if (granted) {
          resolve(granted);
        } else {
          reject(Error(`Permission for ${url} not granted`));
        }
      });
    });
  }

  isPermissionEnabled(url) {
    return new Promise((resolve) => {
      this.chrome.permissions.contains(
        { origins: [url] },
        result => resolve(Boolean(result)),
      );
    });
  }

  /**
   * Wrapper around chrome.storage.local.get, returns a Promise.
   * On failure (keys not present), promise is rejected
   *
   * @param {mixed} items A single key to get, or a list of keys to get.
   *
   * @return {Promise} A promise with the result fetched from storage local
   */
  get(items) {
    return new Promise((resolve, reject) => {
      this.chrome.storage.local.get(items, (result) => {
        const error = this.chrome.runtime.lastError;
        if (error) {
          reject(Error(`Local storage failure: ${error.message}`));
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Wrapper around chrome.storage.local.set, returns a Promise.
   *
   * @param {mixed} items An object with assignments to be stored
   *
   * @return {Promise} A promise with an empty value
   */
  set(items) {
    return new Promise((resolve, reject) => {
      this.chrome.storage.local.set(items, () => {
        const error = this.chrome.runtime.lastError;
        if (error) {
          reject(Error(`Local storage failure: ${error.message}`));
        } else {
          resolve();
        }
      });
    });
  }
}
