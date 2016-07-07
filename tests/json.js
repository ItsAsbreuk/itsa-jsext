/*global describe, it */
/*jshint unused:false */

"use strict";

var expect = require("chai").expect;

require("../index");

describe("Testing JSON", function () {

    it("JSON.itsa_parseWithDate", function () {
        var date = new Date(1995, 11, 17, 3, 24, 0),
            obj = {
                a: true,
                b: date,
                c: "hello world",
                d: 10.5
            },
            objStringified = JSON.stringify(obj);
        expect(JSON.itsa_parseWithDate(objStringified)).to.be.eql(obj);
    });

    it("JSON.itsa_stringifyNoCycle", function () {
        var a = [],
            expected = "[{\"$ref\":\"$\"}]";
        a[0] = a;
        expect(JSON.itsa_stringifyNoCycle(a)).to.be.eql(expected);
    });

    it("JSON.itsa_parseNoCycle", function () {
        var a = [],
            source = "[{\"$ref\":\"$\"}]";
        a[0] = a;
        expect(JSON.itsa_parseNoCycle(source)).to.be.eql(a);
    });

    it("JSON.itsa_parseNoCycle with Date", function () {
        var a = [],
            b = new Date(),
            stringified;
        a[0] = a;
        a.push(b);
        stringified = JSON.itsa_stringifyNoCycle(a);
        expect(JSON.itsa_parseNoCycleWithDate(stringified)).to.be.eql(a);
    });

    it("JSON.itsa_stringToDates non-cloned", function () {
        var date = new Date(1995, 11, 17, 3, 24, 0),
            obj = {
                a: true,
                b: date,
                c: "hello 'world'",
                d: "hello \"world\"",
                e: 10.5
            },
            objStringified = JSON.stringify(obj),
            objReversed = JSON.parse(objStringified),
            manipulated = JSON.itsa_stringToDates(objReversed);
        expect(manipulated).to.be.eql(obj); // same object
        expect(manipulated===objReversed).to.be.true;
    });

    it("JSON.itsa_stringToDates cloned", function () {
        var date = new Date(1995, 11, 17, 3, 24, 0),
            obj = {
                a: true,
                b: date,
                c: "hello 'world'",
                d: "hello \"world\"",
                e: 10.5
            },
            objStringified = JSON.stringify(obj),
            objReversed = JSON.parse(objStringified),
            manipulated = JSON.itsa_stringToDates(objReversed, true);
        expect(manipulated).to.be.eql(obj); // same object
        expect(manipulated===objReversed).to.be.false;
    });


    it("JSON.itsa_stringToDates deep object non-cloned", function () {
        var date = new Date(1995, 11, 17, 3, 24, 0),
            obj = {
                a: true,
                b: {
                    a: {
                        b: date
                    },
                    b: [
                        date,
                        {
                            a: date
                        },
                        [
                            date
                        ]
                    ]
                },
                c: "hello 'world'",
                d: "hello \"world\"",
                e: 10.5
            },
            objStringified = JSON.stringify(obj),
            objReversed = JSON.parse(objStringified),
            manipulated = JSON.itsa_stringToDates(objReversed);
        expect(manipulated).to.be.eql(obj); // same object
        expect(manipulated===objReversed).to.be.true;
    });

    it("JSON.itsa_stringToDates deep object cloned", function () {
        var date = new Date(1995, 11, 17, 3, 24, 0),
            obj = {
                a: true,
                b: {
                    a: {
                        b: date
                    },
                    b: [
                        date,
                        {
                            a: date
                        },
                        [
                            date
                        ]
                    ]
                },
                c: "hello 'world'",
                d: "hello \"world\"",
                e: 10.5
            },
            objStringified = JSON.stringify(obj),
            objReversed = JSON.parse(objStringified),
            manipulated = JSON.itsa_stringToDates(objReversed, true);
        expect(manipulated).to.be.eql(obj); // same object
        expect(manipulated===objReversed).to.be.false;
    });

});
