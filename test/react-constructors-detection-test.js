'use strict';

const React = require('react');
const constructors = {
  React: React,
  Button: class Button extends React.Component {
    render() {
      return React.createElement('button', {}, 'hi there');
    }
  },
  Link: class Link extends React.Component {
    render() {
      return React.createElement('link', {}, 'hi there');
    }
  },
  FuckTheBit: class FuckTheBit extends React.Component {
    render() {
      return React.createElement('i', {}, 'fuck the bit');
    }
  }
};

const assert = require('assert');
const compile = require('./fixtures')({
  constructors: constructors
}).compile;

const expect = require('chai').expect;

describe('React constructors detection', function() {

  it('should replace block by ReactElement', function () {
    var res = compile('').apply({
      block: 'button'
    });

    expect(res).to.have.property('$$typeof');
    expect(res).to.have.property('props');
    expect(res).to.have.property('type');
    expect(res.type.name).to.be.equal('Button');
  });

  it('should replace blocks by ReactElement\'s in deep of bemjson', function () {
    var res = compile('').apply({
      block: 'b1',
      content: [
        { block: 'b2' },
        { block: 'link' }, // 1
        {
          tag: 'b',
          content: [
            '',
            { block: 'link' }, // 2
            { content: {
              block: 'fuck-the-bit'
            } }
          ]
        }
      ]
    });

    var b1 = res;
    var link1 = b1[3];
    var b = b1[4];
    var link2 = b[2];
    var fuck = b[3][2];

    [link1, link2, fuck].forEach(reactEl => {
      expect(reactEl).to.have.property('$$typeof');
      expect(reactEl).to.have.property('props');
      expect(reactEl).to.have.property('type');
    });
    expect(link1.type.name).to.be.equal('Link');
    expect(link2.type.name).to.be.equal('Link');
    expect(fuck.type.name).to.be.equal('FuckTheBit');
  });

  it('should convert bemjson to props for ReactElement', function () {
    var res = compile('').apply({
      block: 'button',
      mods: { m1: 'm1' },
      text: 'text',
      content: 'content'
    });

    expect(res).to.have.property('props');
    expect(res.props).to.have.property('m1');
    expect(res.props.m1).to.be.equal('m1');
    expect(res.props).to.have.property('text');
    expect(res.props.text).to.be.equal('text');
    expect(res.props).to.have.property('content');
    expect(res.props.children).to.be.equal('content');
  });
});
