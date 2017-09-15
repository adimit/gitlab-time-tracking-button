/* eslint-disable func-names, prefer-arrow-callback */

import sinon from 'sinon';
import sinonTestFactory from 'sinon-test';
import { describe, it } from 'mocha';

import TabListener from './TabListener';

const sinonTest = sinonTestFactory(sinon);

describe('TabListener', function () {
  describe('updateTabs', function () {
    const createMocks = mySinon => [
      {},
      { isRegisteredInstance: () => true },
      mySinon.stub(TabListener.prototype, 'insertAssetsInto'),
    ];

    it('Reacts on complete events for registered instances, if we\'re on an issue page', sinonTest(function () {
      // given
      const [chromeMock, instanceManagerMock, insertAssetsInto] = createMocks(this);
      const sut = new TabListener(chromeMock.object, instanceManagerMock);

      // when
      sut.updateTabs({
        status: 'complete',
        url: 'https://gitlab.com/some/project/issues/7',
        id: 99,
      });

      // then
      sinon.assert.calledWith(
        insertAssetsInto,
        99,
        { group: 'some', project: 'project', issue: '7' },
      );
    }));

    it('Doesn\'t react with correct instance but not on issue page', sinonTest(function () {
      // given
      const [chromeMock, instanceManagerMock, insertAssetsInto] = createMocks(this);
      const sut = new TabListener(chromeMock.object, instanceManagerMock);

      // when
      sut.updateTabs({
        status: 'complete',
        url: 'https://gitlab.com/foo/bar', // not on issue page
      });

      // then
      sinon.assert.notCalled(insertAssetsInto);
    }));

    it('Does\'t react with incorrcet instance', sinonTest(function () {
      // given
      const [chromeMock, instanceManagerMock, insertAssetsInto] = createMocks(this);
      const sut = new TabListener(chromeMock.object, instanceManagerMock);

      // when
      instanceManagerMock.isRegisteredInstance = () => false; // we're using the wrong instance
      sut.updateTabs({
        status: 'complete',
        url: 'https://gitlab.com/some/project/issues/1',
      });

      // then
      sinon.assert.notCalled(insertAssetsInto);
    }));
  });
});
