/**
 * Use a regular expression to extract the host name from something that may or
 * may not be a URI.
 *
 * @param {string} pseudoUrl A string that may start with 'https?://' and may
 * end with '/'.
 *
 * @return {string} The part between the 'https?://' and '/' or the same string,
 * if neither is present.
 */
const getHostName = (pseudoUrl) => {
  const re = /^(https?:\/\/)?([^/]+)(\/)?$/;
  return pseudoUrl.replace(re, '$2');
};

export default class Instances {
  constructor(browser) {
    this.browser = browser;
    this.newPermissionBox = document.querySelector('#new-permission');
    this.newTokenBox = document.querySelector('#new-api-token');
    this.listContainer = document.querySelector('#enabled-instances-container');
    this.errorContainer = document.querySelector('#error-container');
  }

  async addGitlab(newHost, newToken) {
    const allGitlabs = await this.getAllGitlabs();

    allGitlabs[newHost] = newToken;

    await this.browser.storage.local.set({ gitlabs: allGitlabs });
  }

  async removeGitlab(host) {
    const allGitlabs = await this.getAllGitlabs();
    delete allGitlabs[host];
    await this.browser.storage.local.set({ gitlabs: allGitlabs });
  }

  async displayGitlabs() {
    const gitlabs = await this.getAllGitlabs();

    this.listContainer.innerHTML = '';
    const htmlList = document.createElement('ul');
    this.listContainer.append(htmlList);

    Object.entries(gitlabs).forEach(([gitlab, token]) => {
      const listEntry = document.createElement('li');

      const gitlabSpan = document.createElement('div');
      gitlabSpan.classList.add('instance-name');

      const tokenSpan = document.createElement('div');
      tokenSpan.classList.add('token-value');

      const removeSpan = document.createElement('div');
      removeSpan.classList.add('remove-instance');

      gitlabSpan.textContent = getHostName(gitlab);
      tokenSpan.textContent = token;

      removeSpan.textContent = '×';
      this.addRemoveEventListener(removeSpan, gitlab);

      listEntry.append(gitlabSpan);
      listEntry.append(tokenSpan);
      listEntry.append(removeSpan);

      htmlList.append(listEntry);
    });
  }

  addRemoveEventListener(element, url) {
    const options = this;
    element.addEventListener('click', async () => {
      await options.browser.permissions.removeOrigin(url);
      await options.removeGitlab(url);
      await options.displayGitlabs();
    });
  }

  async getAllGitlabs() {
    try {
      const { gitlabs } = await this.browser.storage.local.get('gitlabs');
      if (undefined === gitlabs) {
        return {};
      }
      return gitlabs;
    } catch (e) {
      return {};
    }
  }

  showError(message, element) {
    this.errorContainer.innerHTML = message;
    this.errorContainer.classList.remove('invisible');
    if (element) {
      element.classList.add('error');
    }
  }

  resetErrors() {
    this.newPermissionBox.classList.remove('error');
    this.newTokenBox.classList.remove('error');
    this.errorContainer.classList.add('invisible');
  }

  addEventListeners() {
    const options = this;
    const eventFunction = async () => {
      options.resetErrors();
      const newPermission = getHostName(options.newPermissionBox.value);
      const newToken = options.newTokenBox.value;

      if (!newPermission) {
        options.showError('Please specify a host', options.newPermissionBox);
        return;
      }

      if (!newToken) {
        options.showError('Please specify a key', options.newTokenBox);
        return;
      }

      const url = `https://${newPermission}/`;

      try {
        await options.browser.permissions.requestOrigin(url);
        await options.addGitlab(url, newToken);
        await options.displayGitlabs();
      } catch (e) {
        options.showError(`Error adding permission: ${e.message}. If you are
        running Firefox, and you weren't asked for the permission, please try
        using <a target="_blank" href="/options.html">this link</a>. See <a
        href="https://bugzilla.mozilla.org/show_bug.cgi?id=1382953">FF bug
        1382953</a> for information.`);
      }
    };

    document.querySelector('#add-permission').addEventListener('click', eventFunction);
    document.querySelector('#new-api-token').addEventListener('keypress', async (event) => {
      if (event.key === 'Enter') {
        await eventFunction();
      }
    });
  }

  start() {
    this.addEventListeners();
    this.displayGitlabs();
  }
}
