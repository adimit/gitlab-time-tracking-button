/* eslint-disable func-names, prefer-arrow-callback */

import './TabListener';

describe('TabListener', function () {
  describe('updateTabs', function () {
    beforeEach(function() {
      // build a tab handler, injecting a mock instance handler
    });

    it('Reacts on complete events for registered instances, if we\'re on an issue page', function () {
      const tabMessage = {
        status: 'complete',
        url: 'https://gitlab.com/some/project/issues/1',
        id: 99,
      };

      // trigger a tab change
      // mock instance handler returns true on isRegisteredInstance
      // calls insertion function for our assets into the right tab
    });

    it('Doesn\'t react when it shouldn\'t', function() {
      // trigger a tab change with:
      // - correct instance, but not on issue page
      // - incorrect instance
      // mock instance handler returns accordingly

      // does not call insertion function at all.
    });
  });
});
