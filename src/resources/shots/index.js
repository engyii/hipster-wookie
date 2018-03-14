'use strict';

var controller = require('./shots.controller');
var router = require('koa-router')();
var koaBody = require('koa-body')();

router.post('/', koaBody, controller.shot);
module.exports = router.routes();
