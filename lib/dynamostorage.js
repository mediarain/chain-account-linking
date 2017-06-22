'use strict';
const _ = require('lodash');
const path = require('path');
const AWS = require('aws-sdk');
const DOC = require('dynamodb-doc');
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
    const dynamodb = new AWS.DynamoDB(_.merge({
      apiVersion: '2012-08-10',
    }, environment.aws));
    this.docClient = new DOC.DynamoDB(dynamodb);
    this.table = environment.dynamoDB.table;
  }

  put(obj) {
    debug('DynamoStorage put: %j', obj)
    return new Promise((resolve, reject) => {
      this.docClient.putItem({
        TableName: this.table,
        Item: obj,
      }, (err, item) => {
        if (err) return reject(err);
        return resolve(item);
      });
    });
  }

  get(id) {
    return new Promise((resolve, reject) => {
      this.docClient.getItem({
        TableName: this.table,
        Key: { id },
      }, (err, item) => {
        if (err) return reject(err);
        return resolve(item.Item);
      });
    });
  }
}
