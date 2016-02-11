/*global describe, it, beforeEach */
/*jshint unused:false */

"use strict";
var expect = require("chai").expect,
    a, b,
    item0 = {value: 0},
    item1 = {value: 1},
    item2 = {value: 2},
    item3 = {value: 3},
    item4 = {value: 4},
    item5 = {value: 5};

require("../index");

describe("Testing Array", function () {

    // Code to execute before every test.
    beforeEach(function() {
        a = [1,2,3,4,5];
        b = [item1, item2, item3, item4, item5];
    });

    it("Array.itsa_contains", function () {
        expect(a.itsa_contains(3)).to.be.true;
        expect(a.itsa_contains(0)).to.be.false;
        expect(a.itsa_contains(-1)).to.be.false;
        expect(b.itsa_contains(item3)).to.be.true;
        expect(a.itsa_contains(item0)).to.be.false;
        expect(a.itsa_contains(null)).to.be.false;
    });

    it("Array.itsa_replace", function () {
        a.itsa_replace(3,8);
        expect(a.length).to.be.eql(5);
        expect(a.toString()).to.be.eql("1,2,8,4,5");
    });

    it("Array.itsa_replace appended", function () {
        a.itsa_replace(7,8);
        expect(a.length).to.be.eql(6);
        expect(a.toString()).to.be.eql("1,2,3,4,5,8");
    });

    it("Array.itsa_insertAt", function () {
        var newItem = {value: 99};
        b.itsa_insertAt(newItem, 1);
        expect(b.length).to.be.eql(6);
        expect(b).to.be.eql([item1, newItem, item2, item3, item4, item5]);
    });

    it("Array.itsa_insertAt - already available", function () {
        b.itsa_insertAt(item4, 1);
        expect(b.length).to.be.eql(5);
        expect(b).to.be.eql([item1, item4, item2, item3, item5]);
    });

    it("Array.itsa_insertAt - already available same position", function () {
        b.itsa_insertAt(item4, 3);
        expect(b.length).to.be.eql(5);
        expect(b).to.be.eql([item1, item2, item3, item4, item5]);
    });

    it("Array.itsa_insertAt - duplicate already available", function () {
        b.itsa_insertAt(item4, 1, true);
        expect(b.length).to.be.eql(6);
        expect(b).to.be.eql([item1, item4, item2, item3, item4, item5]);
    });

    it("Array.itsa_insertAt - duplicate already available same position", function () {
        b.itsa_insertAt(item4, 3, true);
        expect(b.length).to.be.eql(6);
        expect(b).to.be.eql([item1, item2, item3, item4, item4, item5]);
    });

    it("Array.itsa_shuffle", function () {
        var aBefore = a.toString();
        a.itsa_shuffle();
        b.itsa_shuffle();
        expect(a.length).to.be.eql(5);
        expect(b.length).to.be.eql(5);
        expect(aBefore).not.to.be.eql(a.toString());
        expect(a.itsa_contains(1)).to.be.true;
        expect(a.itsa_contains(2)).to.be.true;
        expect(a.itsa_contains(3)).to.be.true;
        expect(a.itsa_contains(4)).to.be.true;
        expect(a.itsa_contains(5)).to.be.true;
        expect(b.itsa_contains(item1)).to.be.true;
        expect(b.itsa_contains(item2)).to.be.true;
        expect(b.itsa_contains(item3)).to.be.true;
        expect(b.itsa_contains(item4)).to.be.true;
        expect(b.itsa_contains(item5)).to.be.true;
    });

    it("Array.itsa_remove", function () {
        a.itsa_remove(3);
        b.itsa_remove(item3);
        expect(a.length).to.be.eql(4);
        expect(b.length).to.be.eql(4);
        expect(a.itsa_contains(3)).to.be.false;
        expect(b.itsa_contains(item3)).to.be.false;
        expect(a[0]).to.be.eql(1);
        expect(a[1]).to.be.eql(2);
        expect(a[2]).to.be.eql(4);
        expect(a[3]).to.be.eql(5);
        expect(b[0]).to.be.eql(item1);
        expect(b[1]).to.be.eql(item2);
        expect(b[2]).to.be.eql(item4);
        expect(b[3]).to.be.eql(item5);
    });

    it("Array.itsa_deepClone", function () {
        var cloned = b.itsa_deepClone();
        expect(b).be.eql(cloned);
        expect(b===cloned).to.be.false;
    });

    it("Array.itsa_sameValue", function () {
        var c = [item1, item2, item3, item4, item5];
        expect(c.itsa_sameValue(b)).to.be.true;
        expect(c.itsa_sameValue(a)).to.be.false;
    });

    it("Array.itsa_makeEmpty", function () {
        var c = [1, 2, 3];
        c.itsa_makeEmpty();
        expect(c).be.eql([]);
    });

    describe("Array.itsa_defineData", function () {
        it("new data", function () {
            var array = [1, 2, 3],
                newArray = [4, [5]];
            array.itsa_defineData(newArray);
            newArray[1][0] = 6;
            expect(array).be.eql(newArray);
            expect(array===newArray).to.be.false;
        });
        it("new data cloned", function () {
            var array = [1, 2, 3],
                newArray = [4, [5]];
            array.itsa_defineData(newArray, true);
            newArray[1][0] = 6;
            expect(array).not.be.eql(newArray);
            expect(array===newArray).to.be.false;
        });
    });

    describe("itsa_concat", function () {
        it("append without cloning", function () {
            var array = [1, 2, 3],
                newArray = [4, [5]];
            array.itsa_concat(newArray);
            newArray[1][0] = 6;
            expect(array.length).be.eql(5);
            expect(newArray.length).be.eql(2);
            expect(array[0]).be.eql(1);
            expect(array[4][0]).be.eql(6);
            expect(newArray[1][0]).be.eql(6);
        });
        it("append with cloning", function () {
            var array = [1, 2, 3],
                newArray = [4, [5]];
            array.itsa_concat(newArray, false, true);
            newArray[1][0] = 6;
            expect(array.length).be.eql(5);
            expect(newArray.length).be.eql(2);
            expect(array[0]).be.eql(1);
            expect(array[4][0]).be.eql(5);
            expect(newArray[1][0]).be.eql(6);
        });
        it("prepend without cloning", function () {
            var array = [1, 2, 3],
                newArray = [4, [5]];
            array.itsa_concat(newArray, true);
            newArray[1][0] = 6;
            expect(array.length).be.eql(5);
            expect(newArray.length).be.eql(2);
            expect(array[0]).be.eql(4);
            expect(array[1][0]).be.eql(6);
            expect(newArray[1][0]).be.eql(6);
        });
        it("prepend with cloning", function () {
            var array = [1, 2, 3],
                newArray = [4, [5]];
            array.itsa_concat(newArray, true, true);
            newArray[1][0] = 6;
            expect(array.length).be.eql(5);
            expect(newArray.length).be.eql(2);
            expect(array[0]).be.eql(4);
            expect(array[1][0]).be.eql(5);
            expect(newArray[1][0]).be.eql(6);
        });
    });

});
