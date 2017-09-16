/* eslint-disable func-names, prefer-arrow-callback */
import { beforeEach, expect, describe, it } from 'mocha';
import sinon from 'sinon';

import Server from './Server';

describe('Server API', function () {
  let xhr;
  let requests;

  beforeEach(function () {
    xhr = sinon.useFakeXMLHttpRequest();

    requests = [];

    xhr.onCreate = function (newXhr) {
      requests.push(newXhr);
    };
  });

  it('Makes a successful API call', async function () {
    const apiKey = 'the api key';
    const fakeInstaceManager = { getApiKey: () => apiKey };
    const server = new Server(fakeInstaceManager);

    const resultPromise = server.record(7, {
      instance: 'https://example.com:5/',
      group: 'theGroup',
      issue: '11',
      project: 'theProject',
    });

    expect(requests.length).to.equal(1);

    requests[0].respond(
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify({
        human_time_estimate: null,
        human_total_time_spent: '1h',
        time_estimate: 0,
        total_time_spent: 3600,
      }),
    );

    const response = await resultPromise;

    expect(response.status).to.equal('ok');
    expect(response.totalTimeSpent).to.equal(3600);
  });
});
