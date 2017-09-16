/* eslint-disable func-names, prefer-arrow-callback */

import { describe, it } from 'mocha';
import { expect } from 'chai';

import UrlParser from './UrlParser';

describe('UrlParser', function () {
  it('parses group, projcet, and issue number', function () {
    const url = 'https://example.com:11/myGroup/myProject/issues/5';
    const parser = new UrlParser(url);

    expect(parser.getProject()).to.equal('myProject');
    expect(parser.getGroup()).to.equal('myGroup');
    expect(parser.getIssueNr()).to.equal('5');
    expect(parser.getAllData()).to.deep.equal({
      group: 'myGroup',
      instance: 'https://example.com:11/',
      project: 'myProject',
      issue: '5',
    });
  });

  it('parses instance when other stuff isn\'t defined', function () {
    const url = 'https://example.com:11/#myGroup/myProject/issues/5'; // everything after the hash is not the path!
    const parser = new UrlParser(url);

    expect(parser.getInstanceKey()).to.equal('https://example.com:11/');
    expect(parser.getProject()).to.be.null;
    expect(parser.getGroup()).to.be.null;
    expect(parser.getIssueNr()).to.be.null;
  });
});
