'use strict';

const React = require('react');

const assert = require('assert');
const compile = require('./fixtures')({
  constructor: function (ddsl, js) {
    console.log(js);
    ddsl[1] = Object.assign(ddsl[1] || {}, js);

    return React.createElement.apply(
      React.createElement,
      ddsl
    );
  }
}).compile;

const expect = require('chai').expect;

describe('React components', function() {

  it('should replace simple bemjson by ReactElement', function () {
    var res = compile('').apply({
      block: 'b1',
      attrs: {id: 'b1', name: 'b1'},
      mods: {m1: 'm1'},
      mix: [{elem: 'e1'}],
      cls: 'b2'
    });

    expect(res).to.have.property('$$typeof');
    expect(res).to.have.property('props');
    expect(res.props.className).to.be.eq('b1 b1_m1_m1 b1__e1 b2');
    expect(res.props.id).to.be.eq('b1');
    expect(res.props.name).to.be.eq('b1');
    expect(res.type).to.be.eq('div');
  });

  it('should replace deep bemjson by ReactElements', function () {
    var res = compile('').apply({
      block: 'b1',
      content: [
        {elem: 'e1', content: {block: 'b3'}},
        {block: 'b2'}
      ]
    });

    expect(res.type).to.be.eq('div');
    expect(res.props.children[0].type).to.be.eq('div');
    expect(res.props.children[0].props.className).to.be.eq('b1__e1');
    expect(res.props.children[0].props.children.type).to.be.eq('div');
    expect(res.props.children[0].props.children.props.className).to.be.eq('b3');
    expect(res.props.children[1].type).to.be.eq('div');
    expect(res.props.children[1].props.className).to.be.eq('b2');
  });

  it('should work with primitives', function () {
    var res = compile('').apply('text');

    expect(res).to.have.property('$$typeof');
    // expect(res).to.have.property('props');
    expect(res.type).to.be.equal('span');
  });

  it('should replace block by ReactElement', function () {
    var res = compile(function() {
      block('button')(
        tag()('button')
      );
    }).apply({
      block: 'button'
    });

    expect(res).to.have.property('$$typeof');
    // expect(res).to.have.property('props');
    expect(res.type).to.be.equal('button');
  });

  it('should work with React methods as matchers', function () {
    var res = compile(function() {
      block('button')(
        tag()('button'),
        onClick()(function () {
          return 'click';
        }),
        onMouseDown()(function () {
          return 'mousedown';
        }),
        js()(function () {
          return this.extend(applyNext(), {
            onHover: function () {
              return 'hover';
            }
          });
        })
      );
    }).apply({
      block: 'button'
    });

    expect(res).to.have.property('$$typeof');
    // expect(res).to.have.property('props');
    expect(res.type).to.be.equal('button');
  });

//   it('should replace blocks by ReactElement\'s in deep of bemjson', function () {
//     var res = compile('').apply({
//       block: 'b1',
//       content: [
//         { block: 'b2' },
//         { block: 'link' }, // 1
//         {
//           tag: 'b',
//           content: [
//             '',
//             { block: 'link' }, // 2
//             { content: {
//               block: 'fuck-the-bit'
//             } }
//           ]
//         }
//       ]
//     });
//
//     var b1 = res;
//     var link1 = b1[3];
//     var b = b1[4];
//     var link2 = b[2];
//     var fuck = b[3][2];
//
//     [link1, link2, fuck].forEach(reactEl => {
//       expect(reactEl).to.have.property('$$typeof');
//       expect(reactEl).to.have.property('props');
//       expect(reactEl).to.have.property('type');
//     });
//     expect(link1.type.name).to.be.equal('Link');
//     expect(link2.type.name).to.be.equal('Link');
//     expect(fuck.type.name).to.be.equal('FuckTheBit');
//   });
//
//   it('should convert bemjson to props for ReactElement', function () {
//     var res = compile('').apply({
//       block: 'button',
//       mods: { m1: 'm1' },
//       text: 'text',
//       content: 'content'
//     });
//
//     expect(res).to.have.property('props');
//     expect(res.props).to.have.property('m1');
//     expect(res.props.m1).to.be.equal('m1');
//     expect(res.props).to.have.property('text');
//     expect(res.props.text).to.be.equal('text');
//     expect(res.props).to.have.property('content');
//     expect(res.props.children).to.be.equal('content');
//   });
});
