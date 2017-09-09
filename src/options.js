import ChromeAdapter from './ChromeAdapter';
import './options.scss';

class Options {
  constructor(Chrome) {
    this.Chrome = Chrome;
    this.newPermissionBox = document.querySelector('#new-permission');
    this.newTokenBox = document.querySelector('#new-api-token');
    this.listContainer = document.querySelector('#enabled-instances-container');
  }

  async addGitlab(newHost, newToken) {
    const allGitlabs = await this.getAllGitlabs();

    allGitlabs[newHost] = newToken;

    await this.Chrome.set({ gitlabs: allGitlabs });
  }

  async removeGitlab(host) {

  }

  async displayGitlabs() {
    const gitlabs = await this.getAllGitlabs();

    this.listContainer.innerHTML = '';
    const htmlList = document.createElement('ul');
    this.listContainer.append(htmlList);

    Object.entries(gitlabs).forEach(([gitlab, token]) => {
      const listEntry = document.createElement('li');
      const gitlabSpan = document.createElement('span');
      const tokenSpan = document.createElement('span');
      const removeSpan = document.createElement('span');

      gitlabSpan.textContent = gitlab;
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
    element.addEventListener('click', async () => {
      console.log("Removing", url);
    });
  }

  async getAllGitlabs() {
    try {
      const { gitlabs } = await this.Chrome.get('gitlabs');
      if (undefined === gitlabs) {
        return {};
      }
      return gitlabs;
    } catch (e) {
      return {};
    }
  }

  addEventListeners() {
    const options = this;
    document.querySelector('#add-permission').addEventListener('click', async () => {
      this.newPermissionBox.classList.remove('error');
      this.newTokenBox.classList.remove('error');

      const newPermission = this.newPermissionBox.value;
      const newToken = this.newTokenBox.value;

      if (!newPermission) {
        this.newPermissionBox.classList.add('error');
        return;
      }

      if (!newToken || false) {
        this.newTokenBox.classList.add('error');
        return;
      }

      const url = `https://${newPermission}/`;

      try {
        await this.Chrome.addPermission(url);
      } catch (e) {
        console.error(e);
        return;
      }

      await options.addGitlab(url, newToken);
      await options.displayGitlabs();
    });
  }

  start() {
    this.addEventListeners();
    this.displayGitlabs();
  }
}

new Options(ChromeAdapter).start();

