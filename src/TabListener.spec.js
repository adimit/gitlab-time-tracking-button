/* eslint-disable func-names, prefer-arrow-callback */

import './TabListener';

describe('TabListener', function () {
  describe('updateTabs', function () {
    it('Only reacts on complete events for registered instances', function () {
      const tabMessage = {
        status: 'complete',
        url: 'https://gitlab.com/some/project/issues/1',
        id: 99,
      };
    });
  });
});
