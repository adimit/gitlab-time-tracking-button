/* eslint-disable func-names, prefer-arrow-callback */
import { assert, expect, describe, it } from 'mocha';
import sinon from 'sinon';
import sinonTestFactory from 'sinon-test';

import InstanceManager from './InstanceManager';

const sinonTest = sinonTestFactory(sinon);

describe('InstanceManager', function () {
  describe('storage listener', function () {
    const createInstanceManager = () => new InstanceManager({});
    it('reconginzes new instance after insertion', function () {
      // given
      const instanceManager = createInstanceManager();
      const theHostUrl = 'https://example.com:3201';

      // when
      // fire listener function
      instanceManager.updateStorage({
        gitlabs: {
          newValue: { [theHostUrl]: 'anyApiKey' },
          oldValue: undefined,
        },
      }, 'theScopeShouldNotMatter');

      // then
      // check with isRegisteredInstance if the new instance is recognised
      expect(instanceManager.isRegisteredInstance(`${theHostUrl}/and/any/path`)).to.be.true;
    });

    it('fires deletion events for registered handlers when an instance vanishes', sinonTest(function () {
      const instanceManager = createInstanceManager();
      // register two spies for deletion events
      const f1 = this.spy();
      const f2 = this.spy();

      instanceManager.onInstanceRemoval(f1);
      instanceManager.onInstanceRemoval(f2);

      // fire listener function, add two new instances
      instanceManager.updateStorage(
        {
          gitlabs: {
            newValue: {
              'https://example.com': 'foo',
              'https://foobar.com': 'example',
            },
            oldValue: undefined,
          },
        },
        'local',
      );

      assert(f1.notCalled);
      assert(f2.notCalled);

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

      // check that both spies got called
      assert(f1.calledWith('https://foobar.com'));
      assert(f2.calledWith('https://foobar.com'));

      expect(instanceManager.isRegisteredInstance('https://foobar.com')).to.be.false;
    }));
  });
});
