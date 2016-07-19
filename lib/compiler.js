'use strict';

const fs = require('fs');
const Compiler = require('bem-xjst/lib/compiler').Compiler;

const ddsl = require('./ddsl');

module.exports = function compiler(templates, settings) {
  ddsl.source = fs.readFileSync(require.resolve('./ddsl/bundle'), 'utf-8');
  const compiler = new Compiler(ddsl);

  let options = settings || {};
  options.engine = 'DDSL';
  options.exportName = 'DDSL';

  return compiler.generate(templates, options);
};
