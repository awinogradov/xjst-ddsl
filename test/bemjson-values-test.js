var test = require('./fixtures')().test;

describe('BEMJSON values', function() {
  it('should work with empty input', function() {
    test(function() {
      }, '', ['span', null, '']);
  });
  // #6
  xit('should work with empty input - #6', function() {
    test(function() {
      }, '', ['div', null, '']);
  });

  it('should work with null input', function() {
    test(function() {
      }, null, ['span', null, '']);
  });
  // #6
  xit('should work with null input - #6', function() {
    test(function() {
      }, null, ['div', null, '']);
  });

  it('should work with 0 input', function() {
    test(function() {
    }, 0, ['span', null, '0']);
  });
  // #6
  xit('should work with 0 input - #6', function() {
    test(function() {
      }, 0, ['div', null, '0']);
  });

  it('should not render `undefined`', function () {
    test(function() {
      }, [
        undefined,
        undefined,
        { block: 'b1' },
        undefined
      ], ['div', { className: 'b1' }]);
  });

  it('should properly save context while render plain html items', function() {
    test(function() {
      }, {
        block: 'aaa',
        content: [
          {
            elem: 'xxx1',
            content: {
              block: 'bbb',
              elem: 'yyy1',
              content: { tag: 'h1', content: 'h 1' }
            }
          },
          {
            elem: 'xxx2'
          }
        ]
      },
        ['div', { className: 'aaa' },
          ['div', { className: 'aaa__xxx1' },
            ['div', { className: 'bbb__yyy1' },
              ['h1', null, 'h 1']]],
          ['div', { className: 'aaa__xxx2' }]]);
  });

  it('should return undefined on failed match', function() {
    test(function() {
      block('b1').content()(function() {
        return { elem: 'e1' };
      });

      block('b1').elem('e1').mod('a', 'b').tag()('span');
    }, { block: 'b1' }, ['div', { className: 'b1' }, ['div', { className: 'b1__e1' }]]);
  });
});
