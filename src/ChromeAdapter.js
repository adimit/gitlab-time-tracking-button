export default class ChromeAdapter {
  static getAllPermissions() {
    return new Promise((resolve) => {
      chrome.permissions.getAll(results => resolve(results));
    });
  }

  static addPermission(url) {
    return new Promise((resolve, reject) => {
      chrome.permissions.request({
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

  static isPermissionEnabled(url) {
    return new Promise((resolve) => {
      chrome.permissions.contains(
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
  static get(items) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(items, (result) => {
        const error = chrome.runtime.lastError;
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
  static set(items) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(items, () => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(Error(`Local storage failure: ${error.message}`));
        } else {
          resolve();
        }
      });
    });
  }
}
