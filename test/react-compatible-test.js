var test = require('./fixtures')().test;

describe('React compatible', function() {

  it('should not render ReactElement', function() {
    test(function() {
      }, {
        block: 'b1',
        content: [
          { $$typeof: 'xxx' },
          { block: 'b2' },
          { $$typeof: 'yyy' }
        ]
      },
      ['div', { className: 'b1' },
        { $$typeof: 'xxx' },
        [ 'div', { className: 'b2' } ],
        { $$typeof: 'yyy' } ]);
  });

  it('should spread children if all of them are ReactElement\'s', function() {
    test(function() {
      }, {
        block: 'b1',
        content: [
          { $$typeof: 'xxx' },
          { $$typeof: 'yyy' }
        ]
      },
      ['div', { className: 'b1' },
        { $$typeof: 'xxx' },
        { $$typeof: 'yyy' }]);
  });

  it('should spread children if one of them is ReactElement', function() {
    test(function() {
      }, {
        block: 'b1',
        content: [
          { block: 'b2' },
          { $$typeof: 'xxx' }
        ]
      },
      ['div', { className: 'b1' },
        ['div', { className: 'b2' }],
          { $$typeof: 'xxx' }]);
  });

  it('should wrap text into container', function() {
    test(function() {
      }, ['str1', 'str2'],
        ['div', null, ['span', null, 'str1'], ['span', null, 'str2']]);
  });
  // #6
  xit('should wrap text into container - #6', function() {
    test(function() {
      }, ['str1', 'str2'],
        ['div', null, 'str1', 'str2']);
  });

  it('should wrap single string with span', function() {
    test(function() {
      }, 'hi there', ['span', null, 'hi there']);
  });
  // #6
  xit('should wrap single string with div - #6', function() {
    test(function() {
      }, 'hi there', ['div', null, 'hi there']);
  });
});
