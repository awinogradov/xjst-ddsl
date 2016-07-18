'use strict';

const ddsl = require('..');
const assert = require('assert');

require('chai').should();

module.exports = function(settings) {
    const runtime = new ddsl.Engine();
    const exports = {};

    function compile(fn, options) {
        if (typeof fn !== 'function') {
            options = fn;
            fn = function() {};
        }
        var ddslRuntime = {
            settings: settings || {}
        };
        runtime.compile(fn, options || {});
        runtime.exportApply(ddslRuntime);
        return ddslRuntime;
    }
    exports.compile = compile;

    exports.fail = function fail(fn, regexp) {
        assert.throws(function() {
            runtime.compile(fn);
        }, regexp);
    };

    exports.test = function test(fn, data, expected, options) {
        if (typeof fn !== 'function') {
            options = expected;
            expected = data;
            data = fn;
            fn = function() {};
        }
        if (!options) options = {};

        const template = compile(fn, options);

        var count = options.count || 1;
        for (var i = 0; i < count; i++) {
            try {
                assert.deepEqual(template.apply(data), expected, i);
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        }

        if (options.after) options.after(template);
    };

    return exports;
};
