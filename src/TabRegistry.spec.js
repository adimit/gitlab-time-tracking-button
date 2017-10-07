/* eslint-disable func-names, prefer-arrow-callback */

import sinon from 'sinon';
import { expect, describe, it } from 'mocha';

import TabRegistry from './TabRegistry';

describe('TabRegistry', function () {
  it('Sends messages to registered tabs with correct issue info', function () {
    // register tab
    // send update from other tab & correct issue
    // fires message to registered tab
    // doesn't fire message to sending tab
  });

  it('Does not send messages to registered tabs with the wrong issue info', function () {
    // register tab
    // send update from other tab & incorrect issue
    // doesn't fire message
  });

  it('Deregisters tabs when asked to do so and doesn\'t send them data anymore', function () {
    // register tab1
    // register tab2
    // send update from tab3 & correct issue
    // fires 2 messages
    // deregister tab1
    // send update from tab3 & correct issue
    // fires 1 message, to tab1
  });
});
