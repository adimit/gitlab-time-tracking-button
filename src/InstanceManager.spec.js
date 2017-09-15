/* eslint-disable func-names, prefer-arrow-callback */
import { assert, expect, describe, it } from 'mocha';
import sinon from 'sinon';
import sinonTestFactory from 'sinon-test';

import InstanceManager from './InstanceManager';

const sinonTest = sinonTestFactory(sinon);

describe('InstanceManager', function () {
  describe('storage listener', function () {
    const createInstanceManager = () => new InstanceManager({});

    it('recognizes new instance after insertion', function () {
      // given
      const instanceManager = createInstanceManager();
      const theHostUrl = 'https://example.com:3201';

      // when
      // fire listener function
      instanceManager.updateStorage({
        gitlabs: {
          newValue: { [theHostUrl]: 'any API key' },
          oldValue: undefined,
        },
      }, 'the scope should not matter');

      // then
      // check with isRegisteredInstance if the new instance is recognised
      expect(instanceManager.isRegisteredInstance(`${theHostUrl}/and/any/path`)).to.be.true;
    });

    it('does not fire deletion events when an instance is added', sinonTest(function () {
      // given
      const instanceManager = createInstanceManager();
      // register two spies for deletion events
      const f1 = this.spy();
      const f2 = this.spy();

      // when
      instanceManager.onInstanceRemoval(f1);
      instanceManager.onInstanceRemoval(f2);

      // fire listener function, add two new instances
      instanceManager.updateStorage({
        gitlabs: {
          newValue: { 'https://example.com': 'foo' },
          oldValue: undefined,
        },
      }, 'irrelephant');

      // then
      assert(f1.notCalled);
      assert(f2.notCalled);
    }));

    it('fires a deletion event when an instance is added and doesn\'t recognise that instance', sinonTest(function () {
      // given
      const instanceManager = createInstanceManager();
      // register two spies for deletion events
      const f1 = this.spy();
      const f2 = this.spy();

      // when
      instanceManager.onInstanceRemoval(f1);
      instanceManager.onInstanceRemoval(f2);

      // First, add two instances
      instanceManager.updateStorage({
        gitlabs: {
          newValue: {
            'https://example.com': 'foo',
            'https://aoeuaoeu.com': 'aeua',
          },
          oldValue: undefined,
        },
      }, 'local');

      // fire listener function, remove one instance
      instanceManager.updateStorage(
        {
          gitlabs: {
            newValue: {
              'https://example.com': 'foo',
            },
            oldValue: {
              'https://example.com': 'foo',
              'https://foobar.com': 'example',
            },
          },
        },
        'local',
      );

      // then
      // both spies got called with the deleted instance
      assert(f1.calledWith('https://foobar.com'));
      assert(f2.calledWith('https://foobar.com'));

      // the deleted instance is not recognised
      expect(instanceManager.isRegisteredInstance('https://foobar.com')).to.be.false;
    }));
  });
});
