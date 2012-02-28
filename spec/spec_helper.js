// If you want to add one-time Jasmine configs (like a global beforeEach)
// please add it to jasmineSetup.js, not here.
var fs = require('fs');
var path = require('path');
var specDir = path.dirname(fs.realpathSync(__filename));
require.paths.push(path.join(specDir, '../public/js'));
require.paths.push(path.join(specDir, '../helpers'));

require('jasmineSetup')(jasmine.getEnv());

var jsdom = require("jsdom");
var _ = require('addons/underscore');
global._ = _;

window = jsdom.jsdom("<html><head><title>Monitoring</title></head><body></body></html>").createWindow();
global.navigator = {
  userAgent: 'jasmine'
};
global.window = window;
global.document = window.document;

function getDescription(suiteOrSpec) {
  if (!suiteOrSpec) {
    return '';
  }
  return getDescription(suiteOrSpec.suite || suiteOrSpec.parentSuite) + suiteOrSpec.description + ' ';
}

global.wireSetup = function (config) {
  _.each(config, function(value, key) {
    value(mon.settings.all()[key]);
  });
};

global.yieldArgs = function() {
  _.each(_.select(arguments, _.isFunction), function(fun) {
    fun();
  });
};

global.yieldArgsWith = function() {
  var otherArgs = arguments;
  return function() {
    _.each(_.select(arguments, _.isFunction), function(fun) {
      fun.apply(this, otherArgs);
    });
  };
};

global.newSpy = function(obj, functionName) {
  obj[functionName] = function() { };
  return spyOn(obj, functionName);
};

function spyOnAll(object) {
  _.each(_.functions(object), function(funcName) {
    spyOn(object, funcName).andCallThrough();
  });
  return object;
}

global.mock = function(ns, func) {
  var mockObj = {};
  var realObj;
  var originalFunc = ns[func];

  spyOn(ns, func).andCallFake(function() {
    realObj = realObj || _.extend(mockObj, spyOnAll(originalFunc.apply(this, arguments)));
    return realObj;
  });

  return mockObj;
};

require("jquery/jquery-1.6.2");
if (window.$) { 
  global.$ = window.$; 
  global.jQuery = window.jQuery;
}

global.$LAB = {
  script: function(scriptName) {
    if (!scriptName.match(/http:/)) {
      require(scriptName.replace(/scripts\//, ''));
    }
    return global.$LAB;
  },
  wait: function() {return global.$LAB;}
};

function isJavaScriptFile(file) {
  return fs.statSync('public/scripts/' + file).isFile() && (file.slice(-3).toLowerCase() == '.js');
}

function loadScripts(dir, recurse) {
  var scriptsDir = fs.readdirSync('public/scripts/' + dir);
  _.each(scriptsDir, function(entry) {
    var path = (dir + '/' + entry).replace(/^\//, '');
    if (isJavaScriptFile(path)) {
      require(path);
    }
  });
}

var beautify = require('beautify-html');

global.inspect = function(thing) {
  console.log();
  console.log(beautify.html(thing.html()));
  return thing;
};

$.extend($.fn, {
  // Convenience method for triggering jQuery keypress events.
  // You can pass in either the key number or the key as a string
  //    $("p").triggerKeyPress(13);
  //    $("p").triggerKeyPress("ENTER");
  //
  triggerKeyPress: function(key) {
    function keyCode(key) {
      var arr = ['A','B','C','D','E','F','G','H','I','J','K','L','M',
                 'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
      return _.indexOf(arr, key.toUpperCase()) + 65;
    }

    var e = jQuery.Event("keypress");
    if(_.isNumber(key)) {
      e.keyCode = key;
    } else {
      e.keyCode = $.ui.keyCode[key] || keyCode(key);
    }
    this.trigger(e);
    return this;
  }
});

loadScripts('addons', false);
loadScripts('jquery', false);
loadScripts('jquery/ui', false);
loadScripts('jquery/flot', true);
loadScripts('', false);
loadScripts('util', true);
loadScripts('data/', true);
loadScripts('ui/', true);
loadScripts('view/', true);
loadScripts('legacy/', true);
require('moditTest');

mon.sting.currentStatus = function(){};

_.extend(exports, global.mon);
