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
    const allGitlabs = await this.getAllGitlabs();
    delete allGitlabs[host];
    await this.Chrome.set({ gitlabs: allGitlabs });
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
    const options = this;
    element.addEventListener('click', async () => {
      await options.Chrome.removePermission(url);
      await options.removeGitlab(url);
      await options.displayGitlabs();
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

      if (!newToken) {
        this.newTokenBox.classList.add('error');
        return;
      }

      const url = `https://${newPermission}/`;

      try {
        await this.Chrome.addPermission(url);
        await options.addGitlab(url, newToken);
        await options.displayGitlabs();
      } catch (e) {
        console.error(e);
      }
    });
  }

  start() {
    this.addEventListeners();
    this.displayGitlabs();
  }
}

const isFirefox = navigator.userAgent.indexOf('Chrome') === -1;
const myChrome = new ChromeAdapter(chrome, isFirefox);
new Options(myChrome).start();

