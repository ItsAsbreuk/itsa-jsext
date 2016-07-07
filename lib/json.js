/**
 *
 * Pollyfils for often used functionality for Arrays
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module js-ext
 * @submodule lib/json.js
 * @class JSON
 *
 */

"use strict";

require("./object");
require("./array");
require("./string");

var STRING = "string";

var REVIVER = function(key, value) {
     return ((typeof value==="string") && value.itsa_toDate()) || value;
    },
    px = /^\$(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/,
    objectStringToDates, arrayStringToDates, decycle, retrocycle;

objectStringToDates = function(obj) {
    var date;
    obj.itsa_each(function(value, key) {
        if (typeof value===STRING) {
            (date=value.itsa_toDate()) && (obj[key]=date);
        }
        else if (Object.itsa_isObject(value)) {
            objectStringToDates(value);
        }
        else if (Array.isArray(value)) {
            arrayStringToDates(value);
        }
    });
};

arrayStringToDates = function(array) {
    var i, len, arrayItem, date;
    len = array.length;
    for (i=0; i<len; i++) {
        arrayItem = array[i];
        if (typeof arrayItem===STRING) {
            (date=arrayItem.itsa_toDate()) && (array[i]=date);
        }
        else if (Object.itsa_isObject(arrayItem)) {
            objectStringToDates(arrayItem);
        }
        else if (Array.isArray(arrayItem)) {
            arrayStringToDates(arrayItem);
        }
    }
};

decycle = function(object, replacer) {
    var objects = [];   // Keep a reference to each unique object or array
    var paths = [];     // Keep the path to each unique object or array

    return (function derez(value, path) {
        // The derez function recurses through the object, producing the deep copy.
        var i, nu, isArray;

        // If a replacer function was provided, then call it to get a replacement value.
        if (replacer !== undefined) {
            value = replacer(value);
        }
        isArray = Array.isArray(value);
        if (isArray || Object.itsa_isObject(value)) {
            // If the value is an object or array, look to see if we have already
            // encountered it. If so, return a {"$ref":PATH} object. This is a hard
            // linear search that will get slower as the number of unique objects grows.
            // Someday, this should be replaced with an ES6 WeakMap.
            i = objects.indexOf(value);
            if (i >= 0) {
                return {$ref: paths[i]};
            }
            // Otherwise, accumulate the unique value and its path.
            objects.push(value);
            paths.push(path);
            // If it is an array, replicate the array.
            if (isArray) {
                nu = [];
                value.forEach(function (element, i) {
                    nu[i] = derez(element, path + "[" + i + "]");
                });
            }
            else {
                // If it is an object, replicate the object.
                nu = {};
                value.itsa_each(function(val, key) {
                    nu[key] = derez(
                        val,
                        path + "[" + JSON.stringify(key) + "]"
                    );
                });
            }
            return nu;
        }
        return value;
    }(object, "$"));
};

retrocycle = function($) {
    (function rez(value) {
        // The rez function walks recursively through the object looking for $ref
        // properties. When it finds one that has a value that is a path, then it
        // replaces the $ref object with a reference to the value that is found by
        // the path.
        if (value && (typeof value === "object")) {
            if (Array.isArray(value)) {
                value.forEach(function (element, i) {
                    var path;
                    if ((typeof element === "object") && (element !== null)) {
                        path = element.$ref;
                        if (typeof path === "string" && px.test(path)) {
                            value[i] = eval(path);
                        } else {
                            rez(element);
                        }
                    }
                });
            } else {
                value.itsa_each(function(val, key) {
                    var path;
                    if ((typeof val === "object") && (val !== null)) {
                        path = val.$ref;
                        if ((typeof path === "string") && px.test(path)) {
                            value[key] = eval(path);
                        } else {
                            rez(val);
                        }
                    }
                });
            }
        }
    }($));
    return $;
};

/**
 * Parses a stringified object and creates true `Date` properties.
 *
 * @method itsa_parseWithDate
 * @param stringifiedObj {Number} lower-edgde
 * @return {Number|undefined} the value, forced to be inbetween the edges. Returns `undefined` if `max` is lower than `min`.
 */
JSON.itsa_parseWithDate = function(stringifiedObj) {
    return this.parse(stringifiedObj, REVIVER);
};

/**
* Transforms `String`-properties into true Date-objects in case they match the Date-syntax.
* To be used whenever you have parsed a JSON.stringified object without a Date-reviver.
*
* @method itsa_stringToDates
* @param item {Object|Array} the JSON-parsed object which the date-string fields should be transformed into Dates.
* @param clone {Boolean=false} whether to clone `item` and leave it unspoiled. Cloning means a performancehit,
* better leave it `false`, which will lead into changing `item` which in fact will equal the returnvalue.
* @static
* @return {Object|Array} the transformed item
*/
JSON.itsa_stringToDates = function (item, clone) {
    var newItem = clone ? item.itsa_deepClone() : item;
    if (Object.itsa_isObject(newItem)) {
        objectStringToDates(newItem);
    }
    else if (Array.isArray(newItem)) {
        arrayStringToDates(newItem);
    }
    return newItem;
};

/**
* Inspired by https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
*
* JSON-stringifies an object BUT can handle circular-references.
* This is done by replacing duplicate references with an object of the form:
*
* {"$ref": PATH}
*
* where the PATH is a JSONPath string that locates the first occurance.
*
* @example
*     var a = [];
*     a[0] = a;
*     JSON.itsa_stringifyNoCycle(a);

* produces the string: '[{"$ref":"$"}]'
*
* @method itsa_stringifyNoCycle
* @param value {Any} The value to convert to a JSON string.
* @param [replacer] {Function} A function that alters the behavior of the stringification process,
*                              or an array of String and Number objects that serve as a whitelist for selecting the properties
*                              of the value object to be included in the JSON string. If this value is null or not provided,
*                              all properties of the object are included in the resulting JSON string.
* @param [space] {String|Number} Is used to insert white space into the output JSON string for readability purposes.
*                                If this is a Number, it indicates the number of space characters to use as white space;
*                                this number is capped at 10 if it's larger than that. Values less than 1 indicate that no space should be used.
*                                If this is a String, the string (or the first 10 characters of the string, if it's longer than that) is used
*                                as white space. If this parameter is not provided (or is null), no white space is used* @static
* @return {String} the stringified object
*/
JSON.itsa_stringifyNoCycle = function (value, replacer, space) {
    return JSON.stringify(decycle(value, replacer), null, space);
};


/**
* Inspired by https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
*
* Restore an object that was reduced by `JSON.itsa_stringifyNoCycle`. Members whose values are
* objects of the form
*      {$ref: PATH}
* are replaced with references to the value found by the PATH. This will restore cycles. The object will be mutated.
*
* @example
*     var s = '[{"$ref":"$"}]';
*     itsa_parseNoCycle(s);
*
* @method itsa_parseNoCycle
* @param value {Any} The string to parse as JSON. See the JSON object for a description of JSON syntax.
* @param [reviver] {Function} If a function, prescribes how the value originally produced by parsing is transformed, before being returned.
* @return {Object} the reverted object
*/
JSON.itsa_parseNoCycle = function (stringifiedObj, replacer) {
    return retrocycle(JSON.parse(stringifiedObj, replacer));
};

/**
* Inspired by https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
*
* Restore an object that was reduced by `JSON.itsa_stringifyNoCycle`.
* Parses a stringified object and creates true `Date` properties.
*
* Members whose values are objects of the form
*      {$ref: PATH}
* are replaced with references to the value found by the PATH. This will restore cycles. The object will be mutated.
*
* @example
*     var s = '[{"$ref":"$"}]';
*     itsa_parseNoCycle(s);
*
* @method itsa_parseNoCycleWithDate
* @param value {Any} The string to parse as JSON. See the JSON object for a description of JSON syntax.
* @return {Object} the reverted object
*/
JSON.itsa_parseNoCycleWithDate= function (stringifiedObj) {
    return retrocycle(JSON.itsa_parseWithDate(stringifiedObj));
};
