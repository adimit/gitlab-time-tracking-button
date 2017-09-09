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
          newValue: { 'https://example.com': 'foo' },
          oldValue: undefined,
        },
      };

      instanceManager.updateStorage(changes, 'local');

      // check with isRegisteredInstance if the new instance is recognised

      expect(instanceManager.isRegisteredInstance('https://example.com/foo/bar')).to.be.true;
    });

    it('fires deletion events for registered handlers when an instance vanishes', function () {
      // register two spies for deletion events
      // fire listener function, add two new instances
      // fire listener function, remove one instance
      // check that both spies got called

    });
  });
});
