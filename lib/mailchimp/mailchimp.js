'use strict';

const _ = require('lodash');
const Request = require('request');
Promise = require('bluebird');

class Mailchimp {

  constructor(config) {
     _.assign(this, config);
    this.version = '3.0';
  }

  /**
   * Subscribe to a list
   * See: https://developer.mailchimp.com/documentation/mailchimp/reference/lists/#create-post_lists_list_id
   * @function
   * @param {Object} users [{email ...}] users - Users to be subscribed to the list
   */
  subscribeToList( users) {
    this.structureField(users)
    .then((members) => this.apiSubscribe(members))
    .then(() => console.log('users susbrcribed to Mailchimp'))

    .catch((err)=> console.log('err', err));
  }

  /**
   * For body object parse it to a users readable object for Mailchimp
   * See: Member schema https://api.mailchimp.com/schema/3.0/Lists/Members/Instance.json?_ga=1.212919570.746254371.1479483867
   * @function
   * @param {Object} users [] - body object from login request
   */
  structureField(users) {
    return new Promise((resolve, reject) => {
      let mailchimpFields = ['email_address'];
      let fields = this.fields;

      if (_.isEmpty(fields)) return reject('Plugin fields is empty');

      if (_.isEmpty(mailchimpFields)) return reject('No fields at Mailchimp list');

      fields = _.map(fields, (field) => field.name);
      users = _.isArray(users) ? users : [users];

      users = _(users)
      .map((user) => _.pick(user, fields))
      .map((user) => _.zipObjectDeep(mailchimpFields, _.at(user, fields)))
      .filter((user) => user.email_address)
      .value()
      ;

      if (_.isEmpty(users)) return reject('No structure members to send to mailchimp');
      return resolve(users);
    });
  }

   /**
   * Function to call endpoint for Api susbscribe
   * See: Error glossary https://developer.mailchimp.com/documentation/mailchimp/guides/error-glossary/
   * @function
   * @param {Object} members [] - array of members
   */
  apiSubscribe(members) {
    let listId = this.list;
    let url = `${this.host()}/lists/${listId}`;
    let membersParams = { status: "subscribed" };

    members = _(members)
    .map( (member) => _.assign(member, membersParams))
    .value();

    let data = { members: members, update_existing: true };
    return this.apiRequest('post', url, data);
  }

  /**
   * Function to make a simple API call - options for mailchimp
   * See: Error glossary https://developer.mailchimp.com/documentation/mailchimp/guides/error-glossary/
   * @function
   * @param {string} method - POST, GET, ...
   * @param {string} url - url endpoint
   * @param {Object} body - Body od the request
   */
  apiRequest (method, url, body) {
    return new Promise((resolve, reject) => {
      let options = {
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
        'auth': {
          'user': this.auth.user,
          'pass': this.auth.apiKey,
        },
      };

      if (body) {
        options.form = JSON.stringify(body);
      }

      Request[method](options, function (err, res, body) {
        if (err) {
          reject(err);
        }

        if (res.statusCode != 200) {
          reject(body);
        }

        if (!_.isEmpty(body.errors)) {
          reject(body);
        }

        resolve(body);
      });
    });
  }

  host() {
    return `https://${this.auth.dc}.api.mailchimp.com/${this.version}`;
  }
}

module.exports = Mailchimp;
