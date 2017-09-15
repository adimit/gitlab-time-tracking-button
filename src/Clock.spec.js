/* eslint-disable func-names, prefer-arrow-callback */

import sinon from 'sinon';
import sinonTestFactory from 'sinon-test';
import { expect, describe, it } from 'mocha';

import Clock from './Clock';

const sinonTest = sinonTestFactory(sinon);

describe('Clock', function () {
  it('Starts and reports correct time', sinonTest(function () {
    // given
    const fakeTime = sinon.useFakeTimers();
    const clock = new Clock();
    const seconds = 10;

    // when
    clock.start();
    fakeTime.tick(seconds * 1000);

    // then
    expect(clock.getTime()).to.equal(seconds);
    fakeTime.restore();
  }));

  it('Starts and stops on toggle', sinonTest(function () {
    // given
    const clock = new Clock();

    // then
    expect(clock.isRunning()).to.be.false;
    clock.toggle();
    expect(clock.isRunning()).to.be.true;
    clock.toggle();
    expect(clock.isRunning()).to.be.false;
  }));

  it('Resumes correctly after pausing', sinonTest(function () {
    // given
    const fakeTime = sinon.useFakeTimers();
    const clock = new Clock();
    const firstInterval = 5;
    const secondInterval = 7;
    const thirdInterval = 11;

    // when
    clock.start();
    fakeTime.tick(firstInterval * 1000);
    clock.stop();
    fakeTime.tick(secondInterval * 1000);
    clock.start();
    fakeTime.tick(thirdInterval * 1000);

    // then
    expect(clock.getTime()).to.equal(firstInterval + thirdInterval);
    const timeLog = clock.getTimeLog();
    expect(timeLog.length).to.equal(1);
    expect(timeLog[0].duration).to.equal(firstInterval);

    clock.stop();
    expect(clock.getTimeLog()[1].duration).to.equal(thirdInterval);
    fakeTime.restore();
  }));
});
