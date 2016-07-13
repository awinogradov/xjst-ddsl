# DDSL Engine for XJST

[![Build Status](https://travis-ci.org/awinogradov/xjst-ddsl.svg?branch=master)](https://travis-ci.org/awinogradov/xjst-ddsl)

> npm i --save-dev xjst-ddsl

## Usage

``` js
'use strict';

const ddsl = require('xjst-ddsl');
const runtime = new ddsl.Engine();

// LIVE
runtime.compile(/* templates */);
runtime.apply(/* bemjson */);

// BUNDLE
const fs = require('fs');

fs.writeFileSync('./bundle.ddsl.js', ddsl.generate(/* templates */));

const compiledTemplates = require('./bundle.ddsl.js');
compiledTemplates.apply(/* bemjson */);
```

[More docs and examples](https://github.com/bem/bem-xjst).

### License MIT
