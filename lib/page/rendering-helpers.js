'use strict';
const _ = require('lodash');
const url = require('url');
const html = require('../utils/html');

module.exports = function(link,page,options,res) {
  const environment = link.chain.config;
  return {
    scripts: scripts,
    styles: styles,
    path: path,
    asset_path: asset_path,
    form: form,
    img: img,
  };

  function path(parts) {
    let fullPath;
    if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
      fullPath = `${environment.apiGateway.base}${_.trimStart(parts,'/')}`;
    } else {
      fullPath = `/${_.trimStart(parts,'/')}`;
    }

    //Include the context elements to be carried forward so that eventually we can do the oauth redirect with these
    return link.require('oauth').contextifyURL(fullPath,res);
    // TODO: Some kind of more generic system for registering path alterations?
  }

  function asset_path(parts) {
    if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
      return `${environment.assets.base}${_.trimStart(parts,'/')}`;
    }

    return `/${_.trimStart(parts,'/')}`;
  }

  function scripts() {
    return `<script type="text/javascript" src="${asset_path('/js/scripts.js')}"></script>`;
  }
  function styles() {
    return `<link type="text/css" rel="stylesheet" href="${asset_path('/css/main.css')}">`;
  }

  function img(name, attrs) {
    return html.renderTag('img',Object.assign({
      src: asset_path(`img/${name}`)
    }, attrs));
  }

  function form() {
    var fields = link.require('fields');
    var sb = `<form method="POST">`
      + fields.map(field => field.renderHTML()).join('\n')
      + '</form>';
    return sb;
  }


  /*
    <form class="phone-number-form" method="post">
      <div class="form-group">
        <div class="form-row">
          <input type="tel" name="phone" class="numeric" placeholder="Phone number" required minlength="12" maxlength="12" pattern="^\d{3}-\d{3}-\d{3}$"/>
        </div>
        <div class="form-row">
          <button type="submit" class="btn orange" disabled>Save</button>
        </div>
        <div class="form-row">
          <input type="checkbox" id="text-opt" name="text-opt" required>
          <label for="text-opt">Yes, I am opting to receive texts from Tide.com</label>
        </div>
      </div>
    </form>
    */

}
