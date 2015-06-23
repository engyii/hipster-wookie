'use strict';
var fs = require('fs');
var path = require('path');
var phantom = require('phantom');

exports.index = function*(next) {
	this.status = 200;
  this.body = [];
};

exports.shot = function*(next) {
	var self = this;
	var imgPath = path.resolve(global.imgRoot, this.params.sid + '.jpg');
	console.log(this.params.sid);
	console.log(imgPath);
	 yield function(done) {
		phantom.create(function (ph) {
		  ph.createPage(function (page) {
		    page.open(decodeURIComponent(self.params.sid), function (status) {
		      console.log("opened? ", status);
					page.render( imgPath, {format: 'jpeg', quality: '100'}, function() {
						ph.exit();
						done();
					});
		    });
		  });
		});
	};

	this.status = 200;
	this.type = path.extname(imgPath);
	this.body = fs.createReadStream(imgPath);
};

function stat(file) {
  return function (done) {
    fs.stat(file, done);
  };
}
