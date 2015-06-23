'use strict';
var fs = require('fs');
var path = require('path');
var phantom = require('phantom');

var resourceWait  = 300,
    maxRenderWait = 10000;

exports.index = function*(next) {
	this.status = 200;
  this.body = [];
};

exports.shot = function*(next) {

	var url = decodeURIComponent(this.params.sid);
	var imgPath = path.resolve(global.imgRoot, this.params.sid + '.jpg');


	if (!fs.existsSync(imgPath)) {
		yield function(done) {
			lazyLoadPage(done, url, imgPath)
		};
	}

	this.status = 200;
	this.type = path.extname(imgPath);
	this.body = fs.createReadStream(imgPath);
};

function lazyLoadPage(doneCallback, url, imgPath) {

	phantom.create(function (ph) {

			ph.createPage(function (page) {

			var doRender = function() {
				page.render(imgPath, {format: 'jpeg', quality: '90'}, function() {
					ph.exit();
					doneCallback();
				});
			}

			var count = 0, forcedRenderTimeout, renderTimeout;

			page.set('viewportSize', { width: 1280, height : 1024 });
			page.set('clipRect', { top: 0, left: 0, width: 1280, height: 1024 });

			page.set('onResourceRequested', function (req) {
				count += 1;
				console.log('> ' + req.id + ' - ' + req.url);
				clearTimeout(renderTimeout);
			});

			page.set('onResourceReceived', function (res) {
				if (!res.stage || res.stage === 'end') {
					count -= 1;
					console.log(res.id + ' ' + res.status + ' - ' + res.url);
					if (count === 0) {
						renderTimeout = setTimeout(doRender, resourceWait);
					}
				}
			});

			page.open(url, function (status) {
				if (status !== "success") {
					console.log('Unable to load url', url);
					ph.exit();
					doneCallback();
				} else {
					forcedRenderTimeout = setTimeout(function () {
	          console.log(count);
	          doRender();
	        }, maxRenderWait);
				}
			});
		});
	});
}
