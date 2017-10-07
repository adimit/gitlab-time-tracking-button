/* eslint-disable func-names, prefer-arrow-callback */

import sinon from 'sinon';
import { describe, it } from 'mocha';

import TabRegistry from './TabRegistry';

describe('TabRegistry', function () {
  const instance = 'test-instance';
  const group = 'test-group';
  const project = 'test-project';
  const issue = 'test-issue';

  it('Sends messages to registered tabs with correct issue info', function () {
    const spy = sinon.spy();
    const browser = { tabs: { sendMessage: spy } };
    const tabRegistry = new TabRegistry(browser);
    // register tab
    const issueData = { instance, group, project, issue };
    tabRegistry.registerTab({ tabId: 1, issueData });
    // send update from other tab & correct issue
    tabRegistry.update(2, issueData, 'clockData');
    // fires message to registered tab
    // doesn't fire message to sending tab
    sinon.assert.callCount(spy, 1);
    sinon.assert.calledWith(spy, 1, 'update', 'clockData');
  });

  it('Does not send messages to registered tabs with the wrong issue info', function () {
    const spy = sinon.spy();
    const browser = { tabs: { sendMessage: spy } };
    const tabRegistry = new TabRegistry(browser);
    // register tab
    tabRegistry.registerTab({ tabId: 1, issueData: { instance, group, project, issue } });
    // send update from other tab & incorrect issue
    tabRegistry.update(2, { instance, group, project, issue: 'foo' }, 'clockData');
    sinon.assert.callCount(spy, 0);
  });

  it('Deregisters tabs when asked to do so and doesn\'t send them data anymore', function () {
    const spy = sinon.spy();
    const browser = { tabs: { sendMessage: spy } };
    const tabRegistry = new TabRegistry(browser);

    // register tab1
    const issueData = { instance, group, project, issue };
    tabRegistry.registerTab({ tabId: 1, issueData });
    // register tab2
    tabRegistry.registerTab({ tabId: 2, issueData });
    // send update from tab3 & correct issue
    tabRegistry.update(3, issueData, 'clockData');
    // fires 2 messages

    // deregister tab1
    tabRegistry.deregisterTab(1);
    // send update from tab3 & correct issue
    tabRegistry.update(3, issueData, 'clockData');
    // First got fired twice, then another time
    sinon.assert.callCount(spy, 3);
  });
});
