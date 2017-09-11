/* eslint-disable func-names, prefer-arrow-callback */

import TabListener from './TabListener';
import InstanceManager from './InstanceManager';
import ChromeAdapter from './ChromeAdapter';

describe('TabListener', function () {
  describe('updateTabs', function () {
    let tabListener;
    let chrome;
    let instanceManager;

    beforeEach(function () {
      chrome = sinon.mock(ChromeAdapter.prototype);
      instanceManager = sinon.mock(InstanceManager.prototype);
      tabListener = new TabListener(chrome, instanceManager);
    });

    it('Reacts on complete events for registered instances, if we\'re on an issue page', function () {
      const tabMessage = {
        status: 'complete',
        url: 'https://gitlab.com/some/project/issues/1',
        id: 99,
      };
      const insertAssets = sinon.stub(TabListener, 'insertAssetsInto');

      // mock instance handler returns true on isRegisteredInstance
      instanceManager.expects('isRegisteredInstance').returns(true);

      // trigger a tab change
      tabListener.updateTabs(tabMessage);

      // calls insertion function for our assets into the right tab
      assert(insertAssets.calledOnce);
    });

    it('Doesn\'t react when it shouldn\'t', function () {
      // trigger a tab change with:
      // - correct instance, but not on issue page
      // - incorrect instance
      // mock instance handler returns accordingly

      // does not call insertion function at all.
    });
  });
});
