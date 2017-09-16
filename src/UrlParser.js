export default class UrlParser {
  // parser.protocol; // => "http:"
  // parser.host;     // => "example.com:3000"
  // parser.hostname; // => "example.com"
  // parser.port;     // => "3000"
  // parser.pathname; // => "/pathname/"
  // parser.hash;     // => "#hash"
  // parser.search;   // => "?search=test"
  // parser.origin;   // => "http://example.com:3000"

  constructor(string) {
    const parser = document.createElement('a');
    parser.href = string;
    this.parser = parser;
    this.matchUrl = /^\/([^/]+)\/([^/]+)\/issues\/(\d+)/;
  }

  getInstanceKey() {
    return `${this.parser.origin}/`;
  }

  getAllData() {
    const result = this.parser.pathname.match(this.matchUrl);
    if (result instanceof Array && result.length >= 4) {
      const [, group, project, issue] = result;
      return { instance: this.getInstanceKey(), group, project, issue };
    }

    return { instance: this.getInstanceKey(), group: null, project: null, issue: null };
  }

  getProject() {
    return this.getAllData().project;
  }

  getGroup() {
    return this.getAllData().group;
  }

  getIssueNr() {
    return this.getAllData().issue;
  }
}
