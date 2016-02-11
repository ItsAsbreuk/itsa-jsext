/**
 *
 * Pollyfils for often used functionality for Objects
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 * @module js-ext
 * @submodule lib/object.js
 * @class Object
 *
*/

"use strict";

var TYPES = {
       "undefined" : true,
       "number" : true,
       "boolean" : true,
       "string" : true,
       "[object Function]" : true,
       "[object RegExp]" : true,
       "[object Array]" : true,
       "[object Date]" : true,
       "[object Error]" : true,
       "[object Blob]" : true,
       "[object Promise]" : true // DOES NOT WORK in all browsers
    },

    FUNCTION = "function",

    // Define configurable, writable and non-enumerable props
    // if they don't exist.
    defineProperty = function (object, name, method, force) {
        if (!force && (name in object)) {
            return;
        }
        Object.defineProperty(object, name, {
            configurable: true,
            enumerable: false,
            writable: true,
            value: method
        });
    },

    defineProperties = function (object, map, force) {
        var names = Object.keys(map),
            l = names.length,
            i = -1,
            name;
        while (++i < l) {
            name = names[i];
            defineProperty(object, name, map[name], force);
        }
    },

    cloneObj = function(obj, descriptors) {
        var copy, i, len, value;

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            len = obj.length;
            for (i=0; i<len; i++) {
                value = obj[i];
                copy[i] = (Object.itsa_isObject(value) || Array.isArray(value)) ? cloneObj(value, descriptors) : value;
            }
            return copy;
        }

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Object
        if (Object.itsa_isObject(obj)) {
            return obj.itsa_deepClone(descriptors);
        }

        return obj;
    },

    valuesAreTheSame = function(value1, value2) {
        var same, i, len;
        // complex values need to be inspected differently:
        if (Object.itsa_isObject(value1)) {
            same = Object.itsa_isObject(value2) ? value1.itsa_sameValue(value2) : false;
        }
        else if (Array.isArray(value1)) {
            if (Array.isArray(value2)) {
                len = value1.length;
                if (len===value2.length) {
                    same = true;
                    for (i=0; same && (i<len); i++) {
                        same = valuesAreTheSame(value1[i], value2[i]);
                    }
                }
                else {
                    same = false;
                }
            }
            else {
                same = false;
            }
        }
        else if (value1 instanceof Date) {
            same = (value2 instanceof Date) ? (value1.getTime()===value2.getTime()) : false;
        }
        else {
            same = (value1===value2);
        }
        return same;
    },

    deepCloneObj = function (source, target, descriptors, proto) {
        var m = target || Object.create(proto || Object.getPrototypeOf(source)),
            keys = Object.getOwnPropertyNames(source),
            l = keys.length,
            i = -1,
            key, value, propDescriptor;
        // loop through the members:
        while (++i < l) {
            key = keys[i];
            value = source[key];
            if (descriptors) {
                propDescriptor = Object.getOwnPropertyDescriptor(source, key);
                if (propDescriptor.writable) {
                    Object.defineProperty(m, key, propDescriptor);
                }
                if ((Object.itsa_isObject(value) || Array.isArray(value)) && ((typeof propDescriptor.get)!==FUNCTION) && ((typeof propDescriptor.set)!==FUNCTION)) {
                    m[key] = cloneObj(value, descriptors);
                }
                else {
                    m[key] = value;
                }
            }
            else {
                m[key] = (Object.itsa_isObject(value) || Array.isArray(value)) ? cloneObj(value, descriptors) : value;
            }
        }
        return m;
    };


/**
 * Pollyfils for often used functionality for objects
 * @class Object
*/
defineProperties(Object.prototype, {
    /**
     * Loops through all properties in the object.  Equivalent to Array.forEach.
     * The callback is provided with the value of the property, the name of the property
     * and a reference to the whole object itself.
     * The context to run the callback in can be overriden, otherwise it is undefined.
     *
     * @method itsa_each
     * @param fn {Function} Function to be executed on each item in the object.  It will receive
     *                      value {any} value of the property
     *                      key {string} name of the property
     *                      obj {Object} the whole of the object
     * @chainable
     */
    itsa_each: function (fn, context) {
        var obj = this,
            keys = Object.keys(obj),
            l = keys.length,
            i = -1,
            key;
        while (++i < l) {
            key = keys[i];
            fn.call(context || obj, obj[key], key, obj);
        }
        return obj;
    },

    /**
     * Loops through the properties in an object until the callback function returns *truish*.
     * The callback is provided with the value of the property, the name of the property
     * and a reference to the whole object itself.
     * The order in which the elements are visited is not predictable.
     * The context to run the callback in can be overriden, otherwise it is undefined.
     *
     * @method itsa_some
     * @param fn {Function} Function to be executed on each item in the object.  It will receive
     *                      value {any} value of the property
     *                      key {string} name of the property
     *                      obj {Object} the whole of the object
     * @return {Boolean} true if the loop was interrupted by the callback function returning *truish*.
     */
    itsa_some: function (fn, context) {
        var keys = Object.keys(this),
            l = keys.length,
            i = -1,
            key;
        while (++i < l) {
            key = keys[i];
            if (fn.call(context || this, this[key], key, this)) {
                return true;
            }
        }
        return false;
    },

    /*
     * Loops through the properties in an object until the callback assembling a new object
     * with its properties set to the values returned by the callback function.
     * If the callback function returns `undefined` the property will not be copied to the new object.
     * The resulting object will have the same keys as the original, except for those where the callback
     * returned `undefined` which will have dissapeared.
     * The callback is provided with the value of the property, the name of the property
     * and a reference to the whole object itself.
     * The context to run the callback in can be overriden, otherwise it is undefined.
     *
     * @method itsa_map
     * @param fn {Function} Function to be executed on each item in the object.  It will receive
     *                      value {any} value of the property
     *                      key {string} name of the property
     *                      obj {Object} the whole of the object
     * @return {Object} The new object with its properties set to the values returned by the callback function.
     */
    itsa_map: function (fn, context) {
        var keys = Object.keys(this),
            l = keys.length,
            i = -1,
            m = {},
            val, key;
        while (++i < l) {
            key = keys[i];
            val = fn.call(context, this[key], key, this);
            if (val !== undefined) {
                m[key] = val;
            }
        }
        return m;
    },

    /**
     * Returns the keys of the object: the enumerable properties.
     *
     * @method itsa_keys
     * @return {Array} Keys of the object
     */
    itsa_keys: function () {
        return Object.keys(this);
    },

    /**
     * Checks whether the given property is a key: an enumerable property.
     *
     * @method itsa_hasKey
     * @param property {String} the property to check for
     * @return {Boolean} Keys of the object
     */
    itsa_hasKey: function (property) {
        return this.hasOwnProperty(property) && this.propertyIsEnumerable(property);
    },

    /**
     * Returns the number of keys of the object
     *
     * @method itsa_size
     * @param inclNonEnumerable {Boolean} wether to include non-enumeral members
     * @return {Number} Number of items
     */
    itsa_size: function (inclNonEnumerable) {
        return inclNonEnumerable ? Object.getOwnPropertyNames(this).length : Object.keys(this).length;
    },

    /**
     * Loops through the object collection the values of all its properties.
     * It is the counterpart of the [`keys`](#method_keys).
     *
     * @method itsa_values
     * @return {Array} values of the object
     */
    itsa_values: function () {
        var keys = Object.keys(this),
            i = -1,
            len = keys.length,
            values = [];

        while (++i < len) {
            values.push(this[keys[i]]);
        }

        return values;
    },

    /**
     * Returns true if the object has no own members
     *
     * @method itsa_isEmpty
     * @return {Boolean} true if the object is empty
     */
    itsa_isEmpty: function () {
        for (var key in this) {
            if (this.hasOwnProperty(key)) return false;
        }
        return true;
    },

    /**
     * Returns a shallow copy of the object.
     * It does not clone objects within the object, it does a simple, shallow clone.
     * Fast, mostly useful for plain hash maps.
     *
     * @method itsa_shallowClone
     * @param [options.descriptors=false] {Boolean} If true, the full descriptors will be set. This takes more time, but avoids any info to be lost.
     * @return {Object} shallow copy of the original
     */
    itsa_shallowClone: function (descriptors) {
        var instance = this,
            m = Object.create(Object.getPrototypeOf(instance)),
            keys = Object.getOwnPropertyNames(instance),
            l = keys.length,
            i = -1,
            key, propDescriptor;
        while (++i < l) {
            key = keys[i];
            if (descriptors) {
                propDescriptor = Object.getOwnPropertyDescriptor(instance, key);
                if (!propDescriptor.writable) {
                    m[key] = instance[key];
                }
                else {
                    Object.defineProperty(m, key, propDescriptor);
                }
            }
            else {
                m[key] = instance[key];
            }
        }
        return m;
    },

    /**
     * Compares this object with the reference-object whether they have the same value.
     * Not by reference, but their content as simple types.
     *
     * Compares both JSON.stringify objects
     *
     * @method itsa_sameValue
     * @param refObj {Object} the object to compare with
     * @return {Boolean} whether both objects have the same value
     */
    itsa_sameValue: function(refObj) {
        var instance = this,
            keys = Object.getOwnPropertyNames(instance),
            l = keys.length,
            i = -1,
            same, key;
        same = (l===refObj.itsa_size(true));
        // loop through the members:
        while (same && (++i < l)) {
            key = keys[i];
            same = refObj.hasOwnProperty(key) ? valuesAreTheSame(instance[key], refObj[key]) : false;
        }
        return same;
    },

    /**
     * Returns a deep copy of the object.
     * Only handles members of primary types, Dates, Arrays and Objects.
     * Will clone all the properties, also the non-enumerable.
     *
     * @method itsa_deepClone
     * @param [descriptors=false] {Boolean} If true, the full descriptors will be set. This takes more time, but avoids any info to be lost.
     * @param [proto] {Object} Another prototype for the new object.
     * @return {Object} deep-copy of the original
     */
    itsa_deepClone: function (descriptors, proto) {
        return deepCloneObj(this, null, descriptors, proto);
    },

    /**
     * Transforms the object into an array with  'key/value' objects
     *
     * @example
     * {country: 'USA', Continent: 'North America'} --> [{key: 'country', value: 'USA'}, {key: 'Continent', value: 'North America'}]
     *
     * @method itsa_toArray
     * @param [options] {Object}
     * @param [options.key] {String} to overrule the default `key`-property-name
     * @param [options.value] {String} to overrule the default `value`-property-name
     * @return {Array} the transformed Array-representation of the object
     */
    itsa_toArray: function(options) {
        var newArray = [],
            keyIdentifier = (options && options.key) || "key",
            valueIdentifier = (options && options.value) || "value";
        this.itsa_each(function(value, key) {
            var obj = {};
            obj[keyIdentifier] = key;
            obj[valueIdentifier] = value;
            newArray[newArray.length] = obj;
        });
        return newArray;
    },

    /**
     * Merges into this object the properties of the given object.
     * If the second argument is true, the properties on the source object will be overwritten
     * by those of the second object of the same name, otherwise, they are preserved.
     *
     * @method itsa_merge
     * @param obj {Object} Object with the properties to be added to the original object
     * @param [options] {Object}
     * @param [options.force=false] {Boolean} If true, the properties in `obj` will override those of the same name
     *        in the original object
     * @param [options.full=false] {Boolean} If true, also any non-enumerable properties will be merged
     * @param [options.replace=false] {Boolean} If true, only properties that already exist on the instance will be merged (forced replaced). No need to set force as well.
     * @param [options.descriptors=false] {Boolean} If true, the full descriptors will be set. This takes more time, but avoids any info to be lost.
     * @chainable
     */
    itsa_merge: function (obj, options) {
        var instance = this,
            i = -1,
            keys, l, key, force, replace, descriptors, propDescriptor;
        if (!Object.itsa_isObject(obj)) {
            return instance;
        }
        options || (options={});
        keys = options.full ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
        l = keys.length;
        force = options.force;
        replace = options.replace;
        descriptors = options.descriptors;
        // we cannot use obj.each --> obj might be an object defined through Object.create(null) and missing Object.prototype!
        while (++i < l) {
            key = keys[i];
            if ((force && !replace) || (!replace && !(key in instance)) || (replace && (key in instance))) {
                if (descriptors) {
                    propDescriptor = Object.getOwnPropertyDescriptor(obj, key);
                    if (!propDescriptor.writable) {
                        instance[key] = obj[key];
                    }
                    else {
                        Object.defineProperty(instance, key, propDescriptor);
                    }
                }
                else {
                    instance[key] = obj[key];
                }
            }
        }
        return instance;
    },

    /**
     * Sets the properties of `obj` to the instance. This will redefine the object, while remaining the instance.
     * This way, external references to the object-instance remain valid.
     *
     * @method itsa_defineData
     * @param obj {Object} the Object that holds the new properties.
     * @param [clone=false] {Boolean} whether the properties should be cloned
     * @chainable
     */
    itsa_defineData: function(obj, clone) {
        var thisObj = this;
        thisObj.itsa_emptyObject();
        if (clone) {
            deepCloneObj(obj, thisObj, true);
        }
        else {
            thisObj.itsa_merge(obj);
        }
        return thisObj;
    },

    /**
     * Empties the Object by deleting all its own properties (also non-enumerable).
     *
     * @method itsa_emptyObject
     * @chainable
     */
    itsa_emptyObject: function() {
        var thisObj = this,
            props = Object.getOwnPropertyNames(thisObj),
            len = props.length,
            i;
        for (i=0; i<len; i++) {
            delete thisObj[props[i]];
        }
        return thisObj;
    }

});

/**
* Returns true if the item is an object, but no Array, Function, RegExp, Date or Error object
*
* @method itsa_isObject
* @static
* @return {Boolean} true if the object is empty
*/
Object.itsa_isObject = function (item) {
   // cautious: some browsers detect Promises as [object Object] --> we always need to check instance of :(
   return !!(!TYPES[typeof item] && !TYPES[({}.toString).call(item)] && item && (!(item instanceof Promise)));
};

/**
 * Returns a new object resulting of merging the properties of the given objects.
 * The copying is shallow, complex properties will reference the very same object.
 * Properties in later objects do **not overwrite** properties of the same name in earlier objects.
 * If any of the objects is missing, it will be skiped.
 *
 * @example
 *
 *  var foo = function (config) {
 *       config = Object.itsa_merge(config, defaultConfig);
 *  }
 *
 * @method itsa_merge
 * @static
 * @param obj* {Object} Objects whose properties are to be merged
 * @return {Object} new object with the properties merged in.
 */
Object.itsa_merge = function() {
    var m = {};
    Array.prototype.forEach.call(arguments, function (obj) {
        if (obj) m.itsa_merge(obj);
    });
    return m;
};

/**
 * Returns a new object with the prototype specified by `proto`.
 *
 *
 * @method itsa_newProto
 * @static
 * @param obj {Object} source Object
 * @param proto {Object} Object that should serve as prototype
 * @param [clone=false] {Boolean} whether the sourceobject should be deep-cloned. When false, the properties will be merged.
 * @return {Object} new object with the prototype specified.
 */
Object.itsa_newProto = function(obj, proto, clone) {
    return clone ? obj.itsa_deepClone(true, proto) : Object.create(proto).itsa_merge(obj, {force: true});
};

/**
 * Creates a protected property on the object.
 *
 * @method itsa_protectedProp
 * @static
 */
Object.itsa_protectedProp = function(obj, property, value) {
    Object.defineProperty(obj, property, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: value
    });
};