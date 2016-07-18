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

  it('should render without tag', function() {
    test(function() {
      }, { tag: false, content: 'ok' }, [ 'div', null, [ 'span', null, 'ok' ] ]);
  });
  // #6
  xit('should render without tag - #6', function() {
    test(function() {
      }, { tag: false, content: 'ok' }, ['div', null, 'ok']);
  });
});
