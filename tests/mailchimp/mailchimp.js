'use strict';

const Mailchimp = require('../../lib/mailchimp/mailchimp');
let chai = require('chai');
let chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const expect = chai.expect;

describe('Mailchimp', () => {
  describe('create list members', () => {
    let mailchimp;
    let conf;
    beforeEach(() => {
    conf = {
      "auth": {
        "user": "some@rain.agency",
        "dc": "zone",
        "apiKey": "apiKey",
      },
      "list": "id",
    };
    conf.fields = [{ name: 'email' }];
    mailchimp = new Mailchimp(conf);
    });

    it('should assign conf to Class Mailchimp', () => {
      expect(mailchimp).to.include(conf);

    });

    it('should create a list of members', () => {
      const body = { email: 'some@rain.agency' };
      const membersExpect = [{ email_address: 'some@rain.agency' }];

      expect(mailchimp.structureField(body)).to.eventually.deep.equal(membersExpect);
    });

    it('should throw error if no members', () => {
      expect(mailchimp.structureField({})).to.eventually.be.rejectedWith("No structure members to send to mailchimp");
    });

    it('should throw error if fields', () => {
      mailchimp.fields = [];
      expect(mailchimp.structureField({})).to.eventually.be.rejectedWith("Plugin fields is empty");
    });

    it('should throw error if fields', () => {
      mailchimp.fields = [];
      expect(mailchimp.structureField({})).to.eventually.be.rejectedWith("Plugin fields is empty");
    });
  });
});
