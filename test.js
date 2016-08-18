'use strict';

// ------------------------------------------
// RUNTIME

const DDSL = require('./lib/ddsl');
const React = require('react');
const ReactDOM = require('react-dom/server');

const runtime = new DDSL({
  constructor: function (ddsl, js) {
    ddsl[1] = Object.assign(ddsl[1] || {}, js);
    return React.createElement.apply(
      React.createElement,
      ddsl
    );
  }
});

var ddslRuntime = {};
runtime.compile('');
runtime.exportApply(ddslRuntime);

// ------------------------------------------
// BLOCK DECLARATION

ddslRuntime.compile(function () {
  block('button')(
    tag()('button'),
    attrs()(function () {
      return { id: this.ctx.id };
    }),
    def()(function () {
      // match props to bemjson
      const ctx = this.ctx;
      const props = ctx.props;
      this.ctx.id = props.id;
      this.mods.theme = props.theme;
      this.ctx.text = props.children;
      return applyNext();
    }),
    js()(function () {
      return {
        changeText: function (text) {
          this.setState({
            text: text
          })
        }
      };
    }),
    onClick()(function () {
      console.log('button');
    }),
    content()(function () {
      return {
        elem: 'text',
        attrs: {
          ref: this.ctx.ref
        },
        content: this.ctx.text
      }
    })
  );

  block('button').elem('text')(
    onClick()(function () {
      this._button.changeText('');
    })
  )
});

// export one block only
class Button extends React.Component {
  render() {
    return ddslRuntime.apply({
      block: 'button',
      ref: function (c) {
        this._button = c;
      },
      props: this.props
    });
  }
}

// ------------------------------------------

console.log(ReactDOM.renderToStaticMarkup(
  // <Button theme='islands' id='the-button'>text</Button>
  React.createElement(Button, {
    theme: 'islands',
    id: 'the-button',
    children: 'text'
  })
));
