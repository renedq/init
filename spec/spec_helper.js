// If you want to add one-time Jasmine configs (like a global beforeEach)
// please add it to jasmineSetup.js, not here.
var fs = require('fs');
var path = require('path');
var specDir = path.dirname(fs.realpathSync(__filename));
require.paths.push(path.join(specDir, '../public/js'));

var jsdom = require("jsdom");
global._ = require("underscore")._;

window = jsdom.jsdom("<html><head><title>Init</title></head><body></body></html>").createWindow();

global.navigator = {
  userAgent: 'jasmine'
};
global.window = window;
global.location = 'http://init.windycitypathfinder.com';
global.document = window.document;

require("jquery");
if (window.$) { 
  global.$ = window.$; 
  global.jQuery = window.jQuery;
}

function isJavaScriptFile(file) {
  return fs.statSync('public/js/' + file).isFile() && (file.slice(-3).toLowerCase() == '.js');
}

function loadScripts(dir, recurse) {
  var scriptsDir = fs.readdirSync('public/js/' + dir);
  _.each(scriptsDir, function(entry) {
    var path = (dir + '/' + entry).replace(/^\//, '');
    if (isJavaScriptFile(path)) {
      require(path);
    }
  });
}

global.openDatabase = function(){};

loadScripts('', false);

_.extend(exports, global);
