var test = require('./fixtures')().test;

describe('BEMJSON elemMods', function() {
  it('should support elemMods', function() {
    test(function() {
      }, { block: 'b', elem: 'e', elemMods: { type: 'button' } },
        ['div', { className: 'b__e b__e_type_button'}]);
  });

  it('should take elemMods from BEMJSON', function() {
    test(function() {
      block('b1').elem('e1').content()(function() {
        return this.elemMods.a || 'no';
      });
    }, {
      block: 'b1',
      content: {
        elem: 'e1',
        elemMods: { a: 'yes' }
      }
    }, ['div', { className: 'b1' }, ['div', { className: 'b1__e1 b1__e1_a_yes' }, 'yes']]);
  });

  it('should restore elemMods', function() {
    test(function() {
      block('bbb').elem('e1').content()(function() {
        return this.elemMods.a || 'yes';
      });
    }, {
      block: 'bb',
      content: {
        elem: 'e1',
        elemMods: {
          a: 'no'
        },
        content: {
          block: 'bbb',
          elem: 'e1'
        }
      }
    },
    ['div', { className: 'bb' },
      ['div', { className: 'bb__e1 bb__e1_a_no'},
        ['div', { className: 'bbb__e1'}, 'yes']]]);
  });


  it('should not treat elemMods as mods', function() {
    test(function() {}, {
      block: 'b12',
      elemMods: { m1: 'v1' }
    }, ['div', { className: 'b12'}]);
  });
});
