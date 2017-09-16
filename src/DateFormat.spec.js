/* eslint-disable func-names, prefer-arrow-callback, no-mixed-operators */

import { describe, it } from 'mocha';
import { expect } from 'chai';

import DateFormat from './DateFormat';

describe('DateFormat', function () {
  it('Renders the empty string when time === 0', function () {
    expect(DateFormat.precise(0)).to.equal('');
  });

  it('Formats floating points to integer seconds', function () {
    expect(DateFormat.precise(7.0003)).to.equal('7s');
  });

  it('Formats minutes without seconds', function () {
    expect(DateFormat.precise(60 * 11 + 7)).to.equal('0:11');
  });

  it('Formats hours with left-padded minutes without seconds', function () {
    expect(DateFormat.precise(3600 * 3 + 60 * 5 + 7)).to.equal('3:05');
  });

  it('Formats days separately, without seconds', function () {
    expect(DateFormat.precise(8 * 3600 * 11 + 3600 * 3 + 60 * 5 + 7)).to.equal('11d 3:05');
  });
});
