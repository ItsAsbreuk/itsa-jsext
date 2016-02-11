/*global describe, it */
/*jshint unused:false */

"use strict";

var expect = require("chai").expect;

require("../index");

describe("Testing Math", function () {

    it("Math.itsa_inbetween when lower", function () {
        expect(Math.itsa_inbetween(0, -1, 10)).to.be.eql(0);
    });

    it("Math.itsa_inbetween when higher", function () {
        expect(Math.itsa_inbetween(0, 11, 10)).to.be.eql(10);
    });

    it("Math.itsa_inbetween when inbetween", function () {
        expect(Math.itsa_inbetween(0, 1, 10)).to.be.eql(1);
    });

    it("Math.itsa_inbetween when equals lower-value", function () {
        expect(Math.itsa_inbetween(0, 0, 10)).to.be.eql(0);
    });

    it("Math.itsa_inbetween when equals higher-value", function () {
        expect(Math.itsa_inbetween(0, 10, 10)).to.be.eql(10);
    });

    it("Math.itsa_inbetween when swapped values", function () {
        expect(Math.itsa_inbetween(10, 1, 0)===undefined).to.be.true;
    });

    it("Math.itsa_inbetween when lower with equal values", function () {
        expect(Math.itsa_inbetween(0, -1, 0)).to.be.eql(0);
    });

    it("Math.itsa_inbetween when higher with equal values", function () {
        expect(Math.itsa_inbetween(0, 11, 0)).to.be.eql(0);
    });

    it("Math.itsa_inbetween when inbetween with equal values", function () {
        expect(Math.itsa_inbetween(0, 1, 0)).to.be.eql(0);
    });

    it("Math.itsa_ceilFromZero when positive", function () {
        expect(Math.itsa_ceilFromZero(2.3)).to.be.eql(3);
    });

    it("Math.itsa_ceilFromZero when negative", function () {
        expect(Math.itsa_ceilFromZero(-2.3)).to.be.eql(-3);
    });

    it("Math.itsa_ceilFromZero when zero", function () {
        expect(Math.itsa_ceilFromZero(0)).to.be.eql(0);
    });

    it("Math.itsa_floorToZero when positive", function () {
        expect(Math.itsa_floorToZero(2.3)).to.be.eql(2);
    });

    it("Math.itsa_floorToZero when negative", function () {
        expect(Math.itsa_floorToZero(-2.3)).to.be.eql(-2);
    });

    it("Math.itsa_floorToZero when zero", function () {
        expect(Math.itsa_floorToZero(0)).to.be.eql(0);
    });

});
