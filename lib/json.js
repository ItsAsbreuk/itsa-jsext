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
     return ((typeof value==='string') && value.itsa_toDate()) || value;
    },
    objectStringToDates, arrayStringToDates;

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
* @return {Object|Array} the transormed item
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