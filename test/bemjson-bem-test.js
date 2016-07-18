var test = require('./fixtures')().test;

describe('BEMJSON bem', function() {
  it('should not render class if bem equals false', function () {
    test(function() {},
      { block: 'b', bem: false }, ['div', null]);
  });

  it('should render class if bem equals false and cls field is set', function () {
    test(function() {},
      { cls: 'test', bem: false }, ['div', { className: 'test' }]);
  });

  it('should render class if bem equals true', function () {
    test(function() {},
      { block: 'b', bem: true }, ['div', { className: 'b' }]);
  });

  it('should render class if bem equals undefined', function() {
    test(function() {},
      { block: 'b', bem: undefined }, ['div', { className: 'b' }]);
  });

  it('should render class if bem equals null', function() {
    test(function() {},
      { block: 'b', bem: null }, ['div', null]);
  });

  it('should render class if bem equals Number', function() {
    test(function() {},
      { block: 'b', bem: 100 }, ['div', { className: 'b' }]);
  });

  it('should render class if bem equals zero', function() {
    test(function() {},
      { block: 'b', bem: 0 }, ['div', null]);
  });

  it('should render class if bem equals NaN', function() {
    test(function() {},
      { block: 'b', bem: NaN }, ['div', null]);
  });

  it('should render class if bem equals String', function() {
    test(function() {},
      { block: 'b', bem: 'skipme' },  ['div', { className: 'b' }]);
  });

  it('should render class if bem equals empty string', function() {
    test(function() {},
      { block: 'b', bem: '' }, ['div', null]);
  });

  it('should not return Array as attrs value', function() {
    test(function() {},
      { block: 'b', bem: [ 1, 2 ] },  ['div', { className: 'b' }]);
  });
});
