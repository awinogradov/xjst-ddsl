'use strict';

const ddsl = require('./ddsl');
const bundle = require('./ddsl/bundle');
const Compiler = require('bem-xjst/lib/compiler').Compiler;

module.exports = function compiler(templates) {
  ddsl.source = bundle;
  const compiler = new Compiler(ddsl);

  return compiler.generate(templates, {
    engine: 'DDSL',
    exportName: 'DDSL'
  });
}
