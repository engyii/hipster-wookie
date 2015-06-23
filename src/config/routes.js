/**
 * Main application routes
 */

'use strict';

var mount = require('koa-mount');

module.exports = function(app) {

	// YEOMAN INJECT ROUTES BELOW
	app.use(mount('/shots', require('../resources/shots')));
  app.use(mount('/', require('../resources/root')));


};
