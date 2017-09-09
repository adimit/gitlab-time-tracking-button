import ChromeAdapter from './ChromeAdapter';
import './options.scss';

class Options {
  constructor(Chrome) {
    this.Chrome = Chrome;
    this.newPermissionBox = document.querySelector('#new-permission');
    this.newTokenBox = document.querySelector('#new-api-token');
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

      options.addGitlab(url, newToken);
      options.displayGitlabs();
    });
  }

  start() {
    this.addEventListeners();
    this.displayGitlabs();
  }
}

new Options(ChromeAdapter).start();

