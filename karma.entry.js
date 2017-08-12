/**
 * Include everything under /src that ends in 'test.js' into the test context.
 */
const testsContext = require.context('./src', true, /.spec.js$/);
testsContext.keys().forEach(testsContext);
