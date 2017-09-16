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

  it('Allows subscribing to a time feed', sinonTest(function () {
    // given
    const fakeTime = sinon.useFakeTimers();
    const clock = new Clock();
    const spy = this.spy();
    const interval = 7;

    // when
    clock.subscribe(spy);
    clock.start();
    fakeTime.tick(interval * 1000);
    clock.stop();
    fakeTime.tick(interval * 1000);

    // then
    sinon.assert.callCount(spy, interval);
    fakeTime.restore();
  }));

  it('allows for serialisation and deserialisation', function () {
    const fakeTime = sinon.useFakeTimers();
    const clock = new Clock();

    clock.start();
    fakeTime.tick(7 * 1000);
    const { timeLog, currentTime } = clock.serialize();

    const newClock = new Clock({ timeLog, currentTime });
    expect(newClock.isRunning()).to.be.true;
    expect(newClock.getTime()).to.equal(7);
  });
});
