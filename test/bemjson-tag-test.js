var test = require('./fixtures')().test;

describe('BEMJSON tag', function() {
  it('should render default tag as `div`', function() {
    test(function() {
      }, { block: 'b' }, ['div', { className: 'b'}]);
  });

  it('should return html tag', function() {
    test(function() {
      block('btn').def()(function() {
        return this.ctx.tag;
      });
      }, { block: 'btn', tag: 'button' }, 'button');
  });

  it('should render without tag with block mod', function() {
    test(function() {
    }, { tag: false, block: 'bbb', content: 'ok' }, [ 'div', null, 'ok' ]);
  });

  it('should render without tag', function() {
    test(function() {
      }, { tag: false, content: 'ok' }, ['div', null, 'ok']);
  });
});
