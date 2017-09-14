/* eslint-disable func-names, prefer-arrow-callback */

import sinon from 'sinon';
import sinonTestFactory from 'sinon-test';
import { describe, it } from 'mocha';

import TabListener from './TabListener';
import InstanceManager from './InstanceManager';
import ChromeAdapter from './ChromeAdapter';

const sinonTest = sinonTestFactory(sinon);

describe('TabListener', function () {
  describe('updateTabs', function () {
    it('Reacts on complete events for registered instances, if we\'re on an issue page', sinonTest(function () {
      const tabMessage = {
        status: 'complete',
        url: 'https://gitlab.com/some/project/issues/7',
        id: 99,
      };

      const chromeMock = this.mock(ChromeAdapter.prototype);
      const instanceManagerMock = this.mock(InstanceManager.prototype);
      const insertAssetsInto = this.stub(TabListener.prototype, 'insertAssetsInto');

      // mock instance handler returns true on isRegisteredInstance
      instanceManagerMock.expects('isRegisteredInstance').returns(true);

      const sut = new TabListener(chromeMock.object, instanceManagerMock.object);
      // trigger a tab change
      sut.updateTabs(tabMessage);

      // calls insertion function for our assets into the right tab
      instanceManagerMock.verify();
      sinon.assert.calledWith(
        insertAssetsInto,
        99,
        { group: 'some', project: 'project', issue: '7' },
      );
    }));

    it('Doesn\'t react when it shouldn\'t', sinonTest(function () {
      // trigger a tab change with:
      const chromeMock = this.mock(ChromeAdapter.prototype);
      const instanceManagerMock = this.mock(InstanceManager.prototype);
      const insertAssetsInto = this.stub(TabListener.prototype, 'insertAssetsInto');

      instanceManagerMock.expects('isRegisteredInstance').returns(true);

      const sut = new TabListener(chromeMock.object, instanceManagerMock.object);

      // - correct instance, but not on issue page
      sut.updateTabs({
        status: 'complete',
        url: 'https://gitlab.com/foo/bar',
      });
      instanceManagerMock.verify();
      instanceManagerMock.restore();
      sinon.assert.notCalled(insertAssetsInto);
    }));

    it('Doesn\'t react when it shouldn\'t', sinonTest(function () {
      // trigger a tab change with:
      const chromeMock = this.mock(ChromeAdapter.prototype);
      const instanceManagerMock = this.mock(InstanceManager.prototype);
      const insertAssetsInto = this.stub(TabListener.prototype, 'insertAssetsInto');

      instanceManagerMock.expects('isRegisteredInstance').returns(false);

      const sut = new TabListener(chromeMock.object, instanceManagerMock.object);
      // - incorrect instance
      sut.updateTabs({
        status: 'complete',
        url: 'https://gitlab.com/some/project/issues/1',
      });
      instanceManagerMock.verify();


      // does not call insertion function at all.
      sinon.assert.notCalled(insertAssetsInto);
    }));
  });
});
