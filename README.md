# Howdy

This script "patches" Google Chrome's implementation of the i18n API so that
it conforms more fully with ECMAScript's Internationalization API. In
particular it makes Dates.prototype.toLocale[Date,Time]String(),
String.prototype.localeCompare(), and Number.prototype.toLocaleString() work
as defined by the ECMAScript Internationalization specification.

# How to use it

Note that this script is not meant for production environments. It's just
meant to give you a taste of what the API will be able to do once it becomes
more widely adopted by browsers and other JS-enabled environments, like
Node.js.

    
    
    <script src="https://raw.github.com/marcoscaceres/jsi18n/master/jsi18n_patch.js">
    </script> 

Simple usage examples:

    
    
    //dates
    date = new Date();
    date.toLocaleString("en-us", {weekday: 'long'}); //returns Monday
    date.toLocaleTimeString("ar");    //returns time in arabic
    
    //numbers
    (123456).toLocaleString("en-us"); //returns "123,456"
    
    //currencies
    (123456).toLocaleString("ar", {style: "currency", currency: "USD"});
    //returns "US$ ١٢٣٬٤٥٦٫٠٠"

## Found a bug? want to contribue

Please contribute to our [issues
page](https://github.com/marcoscaceres/jsi18n/issues?sort=created&state=open)
on Github.

## Wanna know more?

We have created some detailed documentation on [how to use the JavaScript
Internationalization API](http://marcoscaceres.github.com/jsi18n/).

Felling like a pro? See also [the ECMAScript Internationalization API specs](h
ttp://wiki.ecmascript.org/doku.php?id=globalization:specification_drafts)

