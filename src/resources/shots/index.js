'use strict';

var controller = require('./shots.controller');
var router = require('koa-router')();

router.get('/', controller.index);
router.get('/:sid', controller.shot);
module.exports = router.routes();
