'use strict';
const _ = require('lodash');
const path = require('path');
const AWS = require('aws-sdk');
const Promise = require('bluebird');
const debug = require('debug')('chain');

module.exports = function() {
  return function(link) {
    var inter = new DynamoStorage(link);
    link.registerInterface('storage',inter);
  };
}

// A dummy class, but really it just holds all the environment values
class DynamoStorage {
  constructor(link) {
    const environment = link.chain.config;
    this.client = new AWS.DynamoDB.DocumentClient(_.merge({
      apiVersion: '2012-08-10',
    }, environment.aws));
    this.table = environment.dynamoDB.table;
  }

  put(obj) {
    debug('DynamoStorage put: %j', obj)
    return this.client.put({
      TableName: this.table,
      Item: obj,
    }).promise();

  }

  get(id) {
    return this.docClient.getItem({
      TableName: this.table,
      Key: { id },
    }).promise()
      .then(item => item.Item);
  }
}
