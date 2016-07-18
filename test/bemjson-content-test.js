var test = require('./fixtures')().test;

describe('BEMJSON content', function() {

  it('should render block by default as div', function () {
    test(function() {
      }, [{ content: 'Hello, ddsl!' }],
          ['div', null, ['span', null, 'Hello, ddsl!']]);
  });
  // #6
  xit('should render block by default as div', function () {
    test(function() {
      }, [{ content: 'Hello, ddsl!' }],
          ['div', null, 'Hello, ddsl!']);
  });

  it('should render content as array', function() {
    test(function() {
      }, { tag: 'section', content: [
          { block: 'b1' },
          { block: 'b2' }
        ] }, [ 'section', null,
          ['div', { className: 'b1' }],
          ['div', { className: 'b2' }]]);
  });

  it('should render children with different types', function() {
    test(function() {
      block('b1')(
        content()(function() {
          return [
            's1',
            { elem: 'e1', content: 's' },
            's2',
            { elem: 'e2', content: 's' }
          ];
        })
      );
    }, { block: 'b1' },
      ['div', { className: 'b1' }, 's1',
        ['div', { className: 'b1__e1' }, 's'], 's2',
        ['div', { className: 'b1__e2' }, 's']]);
  });

  it('should not render `undefined`', function () {
    test(function() {
      }, [undefined, undefined, { block: 'bb' }, undefined],
        ['div', { className: 'bb' }]);
  });
});
