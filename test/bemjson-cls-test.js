const assert = require('assert');
var compile = require('./fixtures')().compile;

describe('BEMJSON cls', function() {
  it('should not return undefined as cls value', function() {
    assert.deepEqual(compile('').apply({
      cls: undefined
    }), ['div', null]);
  });

  it('should not return null as cls value', function() {
    assert.deepEqual(compile('').apply({
      cls: null
    }), ['div', null]);
  });

  it('should return Number as cls value', function() {
    assert.deepEqual(compile('').apply({
      cls: -100
    }), ['div', { className: '-100' }]);
  });

  it('should not return zero as cls value', function() {
    assert.deepEqual(compile('').apply({
      cls: 0
    }), ['div', null]);
  });

  it('should not return NaN as cls value', function() {
    assert.deepEqual(compile('').apply({
      cls: NaN }), ['div', null]);
  });

  it('should return String as cls value', function() {
    assert.deepEqual(compile('').apply({
      cls: 'name'
    }), ['div', { className: 'name' }]);
  });

  it('should not return empty string as cls value', function() {
    assert.deepEqual(compile('').apply({
      cls: ''
    }), ['div', null]);
  });

  it('should return true as cls value', function() {
    assert.deepEqual(compile('').apply({
      cls: true
    }), ['div', { className: 'true' }]);
  });

  it('should not return false as cls value', function() {
    assert.deepEqual(compile('').apply({
      cls: false }), ['div', null]);
  });

  it('should return Array as cls value', function() {
    assert.deepEqual(compile('').apply({
      cls: []
    }), ['div', { className: '' }]);
  });

  it('should not return Object as cls value', function() {
    assert.deepEqual(compile('').apply({
      cls: { a: 1, b: 2 }
    }), ['div', { className: '[object Object]' }]);
  });

  it('should trim cls', function() {
    assert.deepEqual(compile('').apply({
      cls: '   hello    '
    }), ['div', { className: 'hello' }]);
  });

  it('should escape cls', function() {
    assert.deepEqual(compile('').apply({
      block: 'b',
      cls: '">'
    }), ['div', { className: 'b &quot;>' }]);
  });
});
