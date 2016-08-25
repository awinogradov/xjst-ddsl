'use strict';

const assert = require('assert');

const React = require('react');
const camelCase = require('camel-case');
const capitalizableDict = {
  acceptcharset: 'acceptCharset',
  accesskey: 'accessKey',
  allowfullscreen: 'allowFullScreen',
  allowtransparency: 'allowTransparency',
  autocomplete: 'autoComplete',
  autofocus: 'autoFocus',
  autoplay: 'autoPlay',
  cellpadding: 'cellPadding',
  cellspacing: 'cellSpacing',
  charset: 'charSet',
  classid: 'classID',
  class: 'className',
  classname: 'className',
  colspan: 'colSpan',
  contenteditable: 'contentEditable',
  contextmenu: 'contextMenu',
  crossorigin: 'crossOrigin',
  datetime: 'dateTime',
  enctype: 'encType',
  formaction: 'formAction',
  formenctype: 'formEncType',
  formmethod: 'formMethod',
  formnovalidate: 'formNoValidate',
  formtarget: 'formTarget',
  frameborder: 'frameBorder',
  htmlfor: 'htmlFor',
  for: 'htmlFor',
  httpequiv: 'httpEquiv',
  marginheight: 'marginHeight',
  marginwidth: 'marginWidth',
  maxlength: 'maxLength',
  mediagroup: 'mediaGroup',
  novalidate: 'noValidate',
  radiogroup: 'radioGroup',
  readonly: 'readOnly',
  rowspan: 'rowSpan',
  spellcheck: 'spellCheck',
  srcdoc: 'srcDoc',
  srcset: 'srcSet',
  tabindex: 'tabIndex',
  usemap: 'useMap',
  value: 'defaultValue',
  checked: 'defaultChecked'
};
const compile = require('./fixtures')({
  // REACT TRANSFORMATIONS
  generateKeys: true,
  constructor: function (ddsl, context, js) {
    var props = null;
    if (ddsl[1]) {
      props = ddsl[1];
      // capitalize react props
      Object.keys(ddsl[1]).forEach(function (key) {
        if (capitalizableDict[key]) {
          props[capitalizableDict[key]] = ddsl[1][key];
        } else {
          props[key] = ddsl[1][key];
        }
      });
      // objectify inline styles
      if (props.style) {
        props.style = props.style.split(';').reduce((ruleMap, ruleString) => {
          if (ruleString) {
            var rulePair = ruleString.split(/:(.+)/);
            ruleMap[camelCase(rulePair[0].trim())] = rulePair[1].trim();
          }
          return ruleMap;
        }, {});
      }
    }
    // bind events
    if (js) {
      props = Object.assign(props || {}, js);
    }
    // props are second argument
    ddsl[1] = props;
    // return react element to runtime
    return React.createElement.apply(
      React.createElement,
      ddsl
    );
  }
}).compile;

const expect = require('chai').expect;

describe('React transformation', function() {

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
    expect(res.type).to.be.equal('button');
  });

  it('should work with React methods as matchers', function () {
    var res = compile(function() {
      block('button')(
        tag()('button'),
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
    expect(res).to.have.property('props');
    expect(res.props.onHover()).to.be.eq('hover');
    expect(res.type).to.be.equal('button');
  });

  it('should work with React methods from bemjson', function () {
    var res = compile(function() {
    }).apply({
      block: 'button',
      js: {
        onClick: function () {
          return 'click';
        }
      }
    });

    expect(res).to.have.property('$$typeof');
    expect(res).to.have.property('props');
    expect(res.props.onClick()).to.be.eq('click');
  });
});
