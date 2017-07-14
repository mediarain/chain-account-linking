'use strict';

const express = require('express');
const path = require('path');
const renderingHelpers = require('./rendering-helpers');
const MobileDetect = require('mobile-detect');
const _ = require('lodash');
const debug = require('debug')('chain');

module.exports = function(link, page, options){
  const router = page.router = express.Router();
  link.chain.app.use('/',router)

  //Render interception
  router.use(function(req,res,next) {
    const renderProxy = res.render;
    res.locals.gaTrackingCode =  link.chain.config.googleAnalytics;
    res.locals.link = link;
    res.locals.content = link.require('content');
    res.render = function(view,options,callback) {
      options = options || {};
      options.helpers = renderingHelpers(link,page,options,res);
      view = link.require('theme').resolveViewPath(view);
      return renderProxy.call(this,view,options,callback);
    }
    next();
  })

  //Keeping track of user state context
  //TODO: This really should be in the oauth module. But having a hard time figuring out how to have it register before the page handlers
  router.use(function (req, res, next) {
    res.locals.context = link.require('oauth').extractContext(req);
    res.locals.redirectUri = link.require('oauth').extractRedirectUri(req);
    next();
  });

  /**
   * Prevent clickjacking
   * X-Frame
   */
  router.use(function(req, res, next){
    res.header('X-Frame-Options','DENY'); // Don't allow frames
    res.header("Content-Security-Policy","frame-ancestors 'none';"); // Don't allow frames
    res.header("Cache-Control","no-cache"); // Disabling Caching recommended by Cigital Pen testers
    next();
  })

  router.get('/',function(req,res){
    res.render('index');
  });

  router.get('/privacy-policy',function(req,res){
    res.render('privacy-policy');
  })

  router.get('/terms-of-use',function(req,res){
    res.render('terms-of-use');
  })

  router.post('/login', function (req,res,next) {
    link.login(_.omit(req.body,['state','client_id']))
      .then(function(user) {
        if (link.request('mailchimp')) {
          link.request('mailchimp').subscribeToList(req.body);
        }

        const redirect = link.require('oauth').redirectURL(user.id, res);
        return res.redirect(redirect);

      })
      .catch(next); //TODO: A universal error page
  })
}
