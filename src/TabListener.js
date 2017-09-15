// We import the raw js and css from Button.{js,scss}, which is a nasty thing to do.
// ESlint is going to complain about many things, but we know what we're doing! I think…
import buttonJs from 'raw-loader!./Button'; // eslint-disable-line
import buttonCss from 'raw-loader!sass-loader!./Button.scss'; // eslint-disable-line

export default class TabListener {
  constructor(chromeTabs, instanceManager) {
    this.chromeTabs = chromeTabs;
    this.instanceManager = instanceManager;
    this.matchUrl = /\/([^/]+)\/([^/]+)\/issues\/(\d+)/;
  }

  updateTabs(info) {
    if (info.status !== 'complete'
     || !this.instanceManager.isRegisteredInstance(info.url)
    ) {
      return;
    }

    const [match, group, project, issue] = info.url.match(this.matchUrl) || [];

    if (match && group && project && issue) {
      this.insertAssetsInto(info.id, { group, project, issue });
    }
  }

  async insertAssetsInto(tabId, data) {
    const js = `const injectedIssueData = ${JSON.stringify(data)};\n${buttonJs}`;
    await this.chromeTabs.insertJs(tabId, js);
    await this.chromeTabs.insertCss(tabId, buttonCss);
  }
}
