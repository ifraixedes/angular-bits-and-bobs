'use strict';

var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');
var vendorLibs = require('broccoli-bower')();
var srcJSLibs = 'src';

vendorLibs = pickFiles(mergeTrees(vendorLibs), {
  srcDir: '/',
  destDir: '/vendor'
});
srcJSLibs  = pickFiles('src', {
  srcDir: '/',
  destDir: '/js'
});

//libs.push('demo');
//process.exit(0);
module.exports = mergeTrees([vendorLibs, srcJSLibs, 'demo']);

