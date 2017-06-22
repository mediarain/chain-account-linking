'use strict';
let Mailchimp = require('./mailchimp');
const _ = require('lodash');

module.exports = function () {
    return function (link) {
      let mailchimpConfig = link.require('environment').get('mailchimp');
      let fields = { fields: link.require('fields') };
      let config = _.assign({}, mailchimpConfig, fields);

      link.registerInterface('mailchimp', new Mailchimp(config));
    };
};
