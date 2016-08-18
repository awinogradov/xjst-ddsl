var test = require('./fixtures')().test;

describe('BEMJSON block', function() {
  it('should render block by default as div', function () {
    test(function() {
      }, [
        { block: 'b' }
      ], ['div', { className: 'b' }]);
  });

  it('should not preserve block on tag', function () {
    test(function() {
      }, [
        {
          block: 'b1',
          content: {
            tag: 'span',
            content: {
              block: 'b2'
            }
          }
        }
      ], ['div', { className: 'b1' },
          ['span', null,
            ['div', { className: 'b2' }]]]);
  });

  it('should inherit block from the parent, and reset it back', function() {
    test(function() {
      }, {
        block: 'b2',
        content: [
          { block: 'b1', content: { elem: 'e1' } },
          { elem: 'e1' }
        ]
      }, ['div', { className: 'b2' },
          ['div', { className: 'b1' },
            ['div', { className: 'b1__e1' }]],
          ['div', { className: 'b2__e1' }]]);
  });

  it('should preserve block on next BEM entity', function() {
    test(function() {
      }, [
        {
          block: 'b1',
          content: {
            tag: 'span',
            content: {
              elem: 'e1'
            }
          }
        }
      ], ['div', { className: 'b1' }, ['span', null, ['div', { className: 'b1__e1' }]]]);
  });

  it('should not preserve block/elem on tag', function() {
    test(function() {
      }, [
        {
          block: 'b1',
          content: {
            elem: 'e1',
            content: {
              tag: 'span',
              content: {
                block: 'b2'
              }
            }
          }
        }
      ], ['div', { className: 'b1' },
          ['div', { className: 'b1__e1' },
            ['span', null,
              ['div', { className: 'b2'}]]]]);
  });
});
