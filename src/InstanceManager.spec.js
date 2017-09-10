/* eslint-disable func-names, prefer-arrow-callback */

import InstanceManager from './InstanceManager';

describe('InstanceManager', function () {
  describe('storage listener', function () {
    let instanceManager;

    beforeEach(function () {
      instanceManager = new InstanceManager(undefined);
    });

    it('updates instances and recognises new ones', function () {
      // fire listener function
      const changes = {
        gitlabs: {
          newValue: { 'https://example.com:3201': 'foo' },
          oldValue: undefined,
        },
      };

      instanceManager.updateStorage(changes, 'local');

      // check with isRegisteredInstance if the new instance is recognised
      expect(instanceManager.isRegisteredInstance('https://example.com:3201/foo/bar')).to.be.true;
    });

    it('fires deletion events for registered handlers when an instance vanishes', function () {
      // register two spies for deletion events
      const f1 = sinon.spy();
      const f2 = sinon.spy();

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
    });
  });
});
