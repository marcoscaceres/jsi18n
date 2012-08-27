/**
* Copyright (c) 2012, Marcos Cáceres <marcos@marcosc.com>

* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to
* deal in the Software without restriction, including without limitation the
* rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
* NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
* DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
* OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
* OR OTHER DEALINGS IN THE SOFTWARE.
**/
(function(global) {
    'use strict';
    //we check if various API calls are supported using this date
    var date = new Date('1/1/2001'),
        number = 123456,
        lang = ['en'],
        //property used in testing if 18n API is already implemented
        props = {
                weekday: 'long',
                timeZoneName: 'long'
        },
        expectedDate = 'Monday GMT+00:00',
        expectedTime = 'Monday 12:00:00 AM GMT+00:00',
        expectedNumber = '123,456',
        dateTest = (date.toLocaleDateString(lang, props) === expectedDate);

    //check if supported
    if (global.hasOwnProperty('Intl') && dateTest === true) {
        //It's supported, don't need to do anything!
        console.log('i18n appears to be supported.');
        return;
    }

    //Check if Chrome's implementation is available
    if (global.hasOwnProperty('v8Intl')) {
        return patchV8();
    }

    //no match found...
    return console.warn('bummer, i18n API is not supported \u2639');

    /**
     * patchV8
     * monkey-patch the standard functions in V8 to use i18n formatters
     **/
    function patchV8() {
        var localizationTest,
            defaults;

        //create a reference to Intl
        global.Intl = global.v8Intl;

        //Check if toLocaleDateString already supported
        //if not, patch it
        localizationTest = date.toLocaleString(lang, props);
        if (localizationTest !== expectedDate) {
            patch('toLocaleString', Date.prototype, global.Intl.DateTimeFormat);
            if (date.toLocaleString(lang, props) !== expectedDate) {
                console.warn('failed to patch Date.prototype.toLocaleString');
            }
        }

        //test for support of toLocaleDateString
        localizationTest = date.toLocaleDateString(lang, props);
        //Check if toLocaleDateString already supported
        //if not, patch it
        if (localizationTest !== expectedDate) {
            patch('toLocaleDateString', Date.prototype, global.Intl.DateTimeFormat);
            if (date.toLocaleDateString(lang, props) !== expectedDate) {
                console.warn('failed to patch Date.prototype.toLocaleDateString');
            }
        }

        //check number formatting support
        if (number.toLocaleString(lang) !== expectedNumber) {
            patch('toLocaleString', Number.prototype, global.v8Intl.NumberFormat);
            if (number.toLocaleString(lang) !== expectedNumber) {
                console.warn('Failed to patch Number.prototype.toLocaleString');
            }
        }

        //check Time Formatting support
        if (date.toLocaleTimeString(lang, props) !== expectedTime) {
            defaults = Object.create(null);
            defaults['hour'] = defaults['minute'] = defaults['second'] = 'numeric';
            patch('toLocaleTimeString',
                Date.prototype.toLocaleTimeString,
                global.v8Intl.DateTimeFormat,
                defaults);
        }

        //monkey patch by keeping native functionality when needed
        function patch(functionName, ofPrototype, i18nformatter, i18nDefaults) {
            ofPrototype[functionName] = (function(old, formatter, defaults) {
                var patchedFunction = function(locales, options) {
                    if (locales === undefined && options === undefined) {
                        return old.call(this);
                    }
                    //clean up and normalize;
                    locales = String(locales).split(',');
                    options = Object(options);
                    //set defaults for output, as Chrome does not do this
                    if (defaults) {
                        for (var i in defaults) {
                            if (!options.hasOwnProperty(i)) {
                                options[i] = defaults[i];
                            }
                        }
                    }
                    //format and return result;
                    return (new formatter(locales, options)).format(this);
                }
                return patchedFunction;
            }(ofPrototype[functionName], i18nformatter, i18nDefaults));
        }
    }
}(this));
