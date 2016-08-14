'use strict';

var fs = require('fs');
var Compiler = require('bem-xjst/lib/compiler').Compiler;

var ddsl = require('./ddsl');

module.exports = function compiler(templates, settings) {
  ddsl.source = fs.readFileSync(require.resolve('./ddsl/bundle'), 'utf-8');
  var compiler = new Compiler(ddsl);

  var options = settings || {};
  options.engine = 'DDSL';
  options.exportName = 'DDSL';

  return compiler.generate(templates, options);
};
