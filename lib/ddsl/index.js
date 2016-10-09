'use strict';

var inherits = require('inherits');
var utils = require('bem-xjst/lib/bemxjst/utils');
var BEMXJST = require('bem-xjst/lib/bemxjst');
var BEMHTML = require('bem-xjst/lib/bemhtml');
var Entity = require('bem-xjst/lib/bemhtml/entity').Entity;

function DDSL() {
  BEMXJST.apply(this, arguments);
}

module.exports = DDSL;

DDSL.prototype.exportApply = function exportApply(exports) {

  this.oninit.push(function(exports) {
    // disable escaping
    exports.BEMContext.prototype.xmlEscape = function(noesc) { return noesc; };
  });

  BEMXJST.prototype.exportApply.call(this, exports);
};

DDSL.prototype.isSimpleStringContent = function (content) {
  return Array.isArray(content) &&
    content[0] === 'span' &&
    content[1] === null &&
    typeof content[2] === 'string';
};

DDSL.prototype.isArrayBody = function (body) {
  return Array.isArray(body) && Array.isArray(body[0]);
};

DDSL.prototype.isArrayContent = function (content) {
  return (Array.isArray(content) && content.length < 2) ||
    Array.isArray(content[0]) ||
    Array.isArray(content[1]);
};

DDSL.prototype.isReactElement = function(item) {
  return typeof item === 'object' && item !== null && !!item.$$typeof;
};

DDSL.prototype.resolveContent = function (ddsl, content, context, js) {
  var body = ddsl;

  if (content) {
    if(this.isSimpleStringContent(content) && this.context.ctx) {
      body = ddsl.concat(content.splice(2));
    } else if (this.isArrayContent(content)) {
      body = ddsl.concat(content);
    } else {
      ddsl.push(content);
      body = ddsl;
    }
  }

  return this.options.constructor.call(this, body, context, js);
};

DDSL.prototype.runMany = function runMany(arr) {
  var context = this.context;
  var prevPos = context.position;
  var prevNotNewList = context._notNewList;

  if (prevNotNewList) {
    context._listLength += arr.length - 1;
  } else {
    context.position = 0;
    context._listLength = arr.length;
  }
  context._notNewList = true;
  if (!prevNotNewList) {
    context.position = prevPos;
  }

  var out = arr.filter(function(a) {
    return !!a;
  }).map(function(a) {
    return this._run(a);
  }.bind(this));

  if (out.filter(function(o) {
    return typeof o === 'string';
  }).length === out.length) {
    out = out.join('');
  }

  if (out.length === 0) {
    out = null;
  }

  if (out && out.length === 1) {
    out = out[0];
  }

  if(this.isArrayBody(out) && context.ctx === null) {
    out = ['div', null].concat(out)
  }

  return out;
};

DDSL.prototype.runOne = function runOne(json) {
  if(this.isReactElement(json)) {
    return json;
  }

  if(json.block && this.options.components && this.options.components[json.block]) {
    json.attrs = json.attrs || {};
    json.attrs.__replace = true;
    var props = Object.assign({}, json.mods, json.attrs, json);
    delete props.mods;
    delete props.attrs;
    delete props.block;
    delete props.js;

    return this.resolveContent([json.block, props], null, json, json.js);
  }

  return BEMXJST.prototype.runOne.call(this, json);
};

DDSL.prototype.runSimple = function runSimple(context) {
  this.context._listLength--;
  var res = '';
  var isChild = !!this.context.block ||
    !!(this.context.ctx && this.context.ctx.tag);

  if (!isChild && context) {
    res = ['span', null, context];
  } else {
    res += context;
  }

  return Array.isArray(res) ? this.resolveContent(res, null, context) : res;
};

DDSL.prototype.render = function render(
  context, entity, tag, js, bem, cls, mix, attrs, content
) {
  var ctx = context.ctx;
  var props = null;
  var tagExists = (tag !== false);

  if (tag === undefined || tag === false) {
    tag = 'div';
  }

  var ddsl = [tag, props];

  if(!tagExists) {
    return this.resolveContent(ddsl, content, context, js);
  }

  props = {};

  var isBEM = bem;
  if (isBEM === undefined) {
    if (ctx.bem === undefined) {
      isBEM = entity.block || entity.elem;
    } else {
      isBEM = ctx.bem;
    }
  }
  isBEM = !!isBEM;

  if (cls === undefined) {
    cls = ctx.cls;
  }

  if (!isBEM && !cls) {
    ddsl[1] = this.renderAttrs(props, context, attrs, ctx);
    return this.resolveContent(ddsl, this.renderContent(content, isBEM), context, js);
  }

  if (isBEM && tagExists) {
    var mods = entity.elem ? context.elemMods : context.mods;

    props.className = [entity.jsClass];
    var modsClasses = this.buildModsClasses(entity.block, entity.elem, mods);
    if (modsClasses) {
      props.className.push(modsClasses);
    }

    if (ctx.mix && mix && mix !== ctx.mix) {
      mix = [].concat(mix, ctx.mix);
    }

    if (mix) {
      var mixClasses = this.renderMix(entity, mix, false, false).out;
      mixClasses && props.className.push(mixClasses);
    }

    if(cls) {
      props.className.push(' ', typeof cls === 'string' ?
        utils.attrEscape(cls).trim() : cls);
    }
  } else {
    if (cls) {
      props.className = props.className || [];
      props.className.push(cls.trim ? utils.attrEscape(cls).trim() : cls);
    }
  }

  if(props.className) {
    props.className = props.className.join('');
  }

  ddsl[1] = this.renderAttrs(props, context, attrs, ctx);
  return this.resolveContent(ddsl, this.renderContent(content, isBEM), context, js);
};

DDSL.prototype.renderAttrs = function renderAttrs(
  props, context, attrs, ctx
) {

  if (attrs && attrs.className) {
    props.className += ' ' + ctx.attrs.className;
    delete attrs.className;
  }

  var isObj = function isObj(val) {
    return val && typeof val === 'object' && !Array.isArray(val) &&
      val !== null;
  };

  if (isObj(attrs) || isObj(ctx.attrs)) {
    attrs = utils.extend(attrs, ctx.attrs);

    for (var name in attrs) {
      if (!attrs.hasOwnProperty(name)) {
        continue;
      }
      var attr = attrs[name];
      if (attr === undefined || attr === false || attr === null) continue;

      if (typeof attr === true || typeof attr === 'function' || name === 'style') {
        props[name] = attr;
      } else {
        props[name] = utils.attrEscape(
          utils.isSimple(attr) ? attr : this.context.reapply(attr)
        );
      }
    }
  }

  if(Object.keys(props).length === 0) {
    props = null;
  }

  if(this.options.generateKeys) {
    props = props || {};
    props.key = utils.getUniq();
  }

  return props;
};
