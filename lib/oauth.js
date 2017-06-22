'use strict'
const _ = require('lodash');
const URL = require('url');

const contextPieces = ['state'];

module.exports = function oauth() {
  return function(link) {
    let oauth = new OAuth(link);
    link.registerInterface('oauth', oauth)
  };
}


class OAuth {
  //TODO add unit tests?
  constructor(link) {
    this.link = link;
  }

  extractContext(req) {
    return _(contextPieces)
      .map(function (piece) {
        let parsed = (req.query ? req.query[piece] : null) || (req.body ? req.body[piece] : null);
        return [piece, parsed];
      })
      .fromPairs()
      .value();
  }

  redirectURL(uuid, res) {
    let base = _.get(this.link.chain.config, 'auth.redirectUrl');
    let uri = URL.parse(base, true);
    delete uri.search;
    uri.hash = _(contextPieces)
      .map(piece => [piece, res.locals.context[piece]])
      .concat([['token_type', 'Bearer'],['access_token', uuid]])
      .map(x => `${x[0]}=${x[1]}`)
      .value()
      .join('&');
    return uri.format();
  }

  contextifyURL(fullPath, res) {
    let uri = URL.parse(fullPath, true);
    delete uri.search;
    contextPieces.forEach(function (piece) {
      return uri.query[piece] = res.locals.context[piece];
    });
    return uri.format();
  }
}
