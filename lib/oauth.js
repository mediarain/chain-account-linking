'use strict'
const _ = require('lodash');
const URL = require('url');

const contextPieces = ['state', 'redirect_uri'];

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

  extractRedirectUri(req) {
    return req.query['redirect_uri'];
  }

  redirectURL(uuid, res) {
    const redirectDomains = _.get(this.link.chain.config, 'auth.redirectDomains');

    if (!_.isArray(redirectDomains) || _.isEmpty(redirectDomains)) {
      throw new Error('redirectDomains is not defined in chain auth');
    }

    let base = _.get(res, 'locals.redirectUri');
    let uri = URL.parse(base, true);

    if (redirectDomains.indexOf(uri.hostname) < 0) {
      throw new Error('Invalid redirect Url');
    }

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
