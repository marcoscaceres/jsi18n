/**
* Howdy! This script "patches" Google Chrome's implementation of the i18n API
* so that it conforms more fully with ECMAScript's Internationalization API.
* In particular it makes Dates.toLocale[Date,Time]String(), and
* Number.toLocaleString() work as defined by the ECMAScript specification.
*
* Simple usage examples:
*   //dates
*   date = new Date();
*   date.toLocaleString("en-us", {weekday: 'long'}); //returns Monday
*   date.toLocaleTimeString("ar"); //returns time in arabic
*   //numbers
*   (123456).toLocaleString("en-us"); // returns "123,456"
*
* Detailed documentation on how to use this script:
*    http://marcoscaceres.github.com/jsi18n/
*
* See also the ECMAScript i18n specs page:
*    http://wiki.ecmascript.org/doku.php?id=globalization:specification_drafts
*
* Copyright (c) 2012, Marcos Cáceres <marcos@marcosc.com>
* MIT License
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
            defaults,
			msg;

        //create a reference to Intl
        global.Intl = global.v8Intl;

        //Check and patch if needed
        localizationTest = date.toLocaleString(lang, props);
        if (localizationTest !== expectedDate) {
            patch('toLocaleString', Date.prototype, global.Intl.DateTimeFormat);
            if (date.toLocaleString(lang, props) !== expectedDate) {
                msg = 'Patched Date.toLocaleString, but browser implementation is buggy.';
				console.warn(msg);
            }
        }

		//Check and patch if needed
        localizationTest = date.toLocaleDateString(lang, props);
        if (localizationTest !== expectedDate) {
            patch('toLocaleDateString', Date.prototype, global.Intl.DateTimeFormat);
            if (date.toLocaleDateString(lang, props) !== expectedDate) {
				msg = 'Patched Date.toLocaleDateString, but browser implementation is buggy.';
                console.warn(msg);
            }
        }

		//Check and patch if needed
        localizationTest = date.toLocaleTimeString(lang, props); 
        if (localizationTest !== expectedTime) {
            defaults = Object.create(null);
            defaults['hour'] = defaults['minute'] = defaults['second'] = 'numeric';
            patch('toLocaleTimeString',
                Date.prototype,
                global.v8Intl.DateTimeFormat,
                defaults);
			if (date.toLocaleTimeString(lang, props) !== expectedTime) {
				msg = 'Patched Date.toLocaleTimeString, but browser implementation is buggy.';
                console.warn(msg);
			}
        }

        //check number formatting support
        if (number.toLocaleString(lang) !== expectedNumber) {
            patch('toLocaleString', Number.prototype, global.v8Intl.NumberFormat);
            if (number.toLocaleString(lang) !== expectedNumber) {
				msg = 'Patched Number.toLocaleString, but browser implementation is buggy.';
                console.warn(msg);
            }
        }

        //monkey patch by keeping native functionality when needed
        function patch(functionName, ofPrototype, i18nformatter, i18nDefaults) {
            //override native function of a given prototype
			//(e.g., Number.prototype['toLocaleString'])
			ofPrototype[functionName] = (function(old, formatter, defaults) {
                //create the patched function, and then return it
				var patchedFunction = function(locales, options) {
					//Call the original "native code" function
                    if (locales === undefined && options === undefined) {
                        return old.call(this);
                    }

					//clean up and normalize values
                    locales = String(locales).split(',');
                    options = Object(options);

                    //set defaults for output, as Chrome does not do this sometimes
                    if (defaults) {
                        for (var i in defaults) {
                            if (!options.hasOwnProperty(i)) {
                                options[i] = defaults[i];
                            }
                        }
                    }

                    //localize and format the object and return result
                    return (new formatter(locales, options)).format(this);
                }
				//monkey patch!
                return patchedFunction;
            }(ofPrototype[functionName], i18nformatter, i18nDefaults));
        }
    }
}(this));
