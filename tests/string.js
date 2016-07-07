/*global describe, it */
/*jshint unused:false */

"use strict";
var expect = require("chai").expect;

require("../index");

describe("Testing String", function () {

    it("String.itsa_contains", function () {
        expect("Itsa small string".itsa_contains("small")).to.be.true;
        expect("Itsa smallstring".itsa_contains("small")).to.be.true;
        expect("Itsasmall string".itsa_contains("small")).to.be.true;
        expect("Itsasmallstring".itsa_contains("small")).to.be.true;
        expect("small string".itsa_contains("small")).to.be.true;
        expect("smallstring".itsa_contains("small")).to.be.true;
        expect("string small".itsa_contains("small")).to.be.true;
        expect("stringsmall".itsa_contains("small")).to.be.true;
        expect("Itsa small string".itsa_contains("smalle")).to.be.false;
    });

    it("String.itsa_endsWith", function () {
        expect("Itsa small string".itsa_endsWith("string")).to.be.true;
        expect("Itsa small string".itsa_endsWith(" string")).to.be.true;
        expect("Itsa small string".itsa_endsWith("string ")).to.be.false;
        expect("Itsa small string".itsa_endsWith("STRING")).to.be.false;
        expect("Itsa small string".itsa_endsWith("strin")).to.be.false;
        expect("Itsa small string".itsa_endsWith("STRING", true)).to.be.true;
    });

    it("String.itsa_startsWith", function () {
        expect("Itsa small string".itsa_startsWith("Itsa")).to.be.true;
        expect("Itsa small string".itsa_startsWith("Itsa ")).to.be.true;
        expect("Itsa small string".itsa_startsWith(" Itsa")).to.be.false;
        expect("Itsa small string".itsa_startsWith("ITSA")).to.be.false;
        expect("Itsa small string".itsa_startsWith("tsa")).to.be.false;
        expect("Itsa small string".itsa_startsWith("ITSA", true)).to.be.true;
    });

    it("String.itsa_substitute", function () {
        var greeting = "{message} {who}!";
        expect(greeting.itsa_substitute({message: "Hello"})).to.be.eql("Hello !");
    });

    it("String.itsa_substitute retain undefined", function () {
        var greeting = "{message} {who}!";
        expect(greeting.itsa_substitute({message: "Hello"}, true)).to.be.eql("Hello {who}!");
    });

    it("String.itsa_substitute no retain undefined", function () {
        var greeting = "{message} {who}!";
        expect(greeting.itsa_substitute({message: "Hello"}, false)).to.be.eql("Hello !");
    });

    it("String.itsa_toDate", function () {
        var birthday = "2010-02-10T14:45:30.000Z";
        var checkDay = new Date(Date.UTC(2010,1,10,14,45,30,0));
        expect(birthday.itsa_toDate().getTime()).to.be.eql(checkDay.getTime());
    });

    it("String.itsa_trim", function () {
        expect(" Hello World ".itsa_trim()).to.be.eql("Hello World");
    });

    it("String.itsa_trimLeft", function () {
        expect(" Hello World ".itsa_trimLeft()).to.be.eql("Hello World ");
    });

    it("String.itsa_trimRight", function () {
        expect(" Hello World ".itsa_trimRight()).to.be.eql(" Hello World");
    });

    it("String.itsa_replace", function () {
        expect("abcABCabcABC".itsa_replace("B", "z")).to.be.equal("abcAzCabcABC");
    });

    it("String.itsa_replace case-insensitive", function () {
        expect("abcABCabcABC".itsa_replace("B", "z", true)).to.be.equal("azcABCabcABC");
    });

    it("String.itsa_replaceAll", function () {
        expect("abcABCabcABC".itsa_replaceAll("B", "z")).to.be.equal("abcAzCabcAzC");
    });

    it("String.itsa_replaceAll case-insensitive", function () {
        expect("abcABCabcABC".itsa_replaceAll("B", "z", true)).to.be.equal("azcAzCazcAzC");
    });

    it("String.itsa_sentence to generate a sentence", function () {
        expect("hi there".itsa_sentence()).to.be.equal("Hi there");
    });

    it("String.itsa_sentence on an empty string", function () {
        expect("".itsa_sentence()).to.be.equal("");
    });

    it("String.itsa_sentence on one character", function () {
        expect("a".itsa_sentence()).to.be.equal("A");
    });

    it("String.itsa_isValidEmail", function () {
        expect("a@aa.nl".itsa_isValidEmail()).to.be.true;
        expect("a@aa.n".itsa_isValidEmail()).to.be.false;
        expect("a.aa.nl".itsa_isValidEmail()).to.be.false;
        expect("@aa.nl".itsa_isValidEmail()).to.be.false;
        expect("a@nl".itsa_isValidEmail()).to.be.false;
        expect("a@.nl".itsa_isValidEmail()).to.be.false;
        expect("a@a.nl".itsa_isValidEmail()).to.be.false;
        expect("a.a@aa.nl".itsa_isValidEmail()).to.be.true;
        expect(".a@aa.nl".itsa_isValidEmail()).to.be.false;
        expect("a@aa.nl.".itsa_isValidEmail()).to.be.false;
        expect("a.@aa.nl".itsa_isValidEmail()).to.be.false;
        expect("a_@aa.nl".itsa_isValidEmail()).to.be.true;
        expect("_a@aa.nl".itsa_isValidEmail()).to.be.true;
        expect("_@aa.nl".itsa_isValidEmail()).to.be.true;
        expect("a@_a.nl".itsa_isValidEmail()).to.be.false;
        expect("a@a_.nl".itsa_isValidEmail()).to.be.false;
    });

    it("String.itsa_isValidFloat", function () {
        expect("2,20".itsa_isValidFloat()).to.be.false;
        expect("2".itsa_isValidFloat()).to.be.true;
        expect(".20".itsa_isValidFloat()).to.be.true;
        expect("0.20".itsa_isValidFloat()).to.be.true;
        expect("00.20".itsa_isValidFloat()).to.be.false;
        expect("2.0".itsa_isValidFloat()).to.be.true;
        expect("2.00".itsa_isValidFloat()).to.be.true;
        expect("2.".itsa_isValidFloat()).to.be.false;
        expect("2,".itsa_isValidFloat()).to.be.false;
    });

    it("String.itsa_isValidHexaColor", function () {
        expect("333".itsa_isValidHexaColor()).to.be.true;
        expect("3A3".itsa_isValidHexaColor()).to.be.true;
        expect("3F3".itsa_isValidHexaColor()).to.be.true;
        expect("3G3".itsa_isValidHexaColor()).to.be.false;
        expect("".itsa_isValidHexaColor()).to.be.false;
        expect("3".itsa_isValidHexaColor()).to.be.false;
        expect("33".itsa_isValidHexaColor()).to.be.false;
        expect("3333".itsa_isValidHexaColor()).to.be.false;
        expect("33333".itsa_isValidHexaColor()).to.be.false;
        expect("777333".itsa_isValidHexaColor()).to.be.true;
        expect("7773A3".itsa_isValidHexaColor()).to.be.true;
        expect("7773F3".itsa_isValidHexaColor()).to.be.true;
        expect("7773G3".itsa_isValidHexaColor()).to.be.false;
        expect("7773337".itsa_isValidHexaColor()).to.be.false;

        expect("#333".itsa_isValidHexaColor()).to.be.true;
        expect("#3A3".itsa_isValidHexaColor()).to.be.true;
        expect("#3F3".itsa_isValidHexaColor()).to.be.true;
        expect("#3G3".itsa_isValidHexaColor()).to.be.false;
        expect("".itsa_isValidHexaColor()).to.be.false;
        expect("#".itsa_isValidHexaColor()).to.be.false;
        expect("#3".itsa_isValidHexaColor()).to.be.false;
        expect("#33".itsa_isValidHexaColor()).to.be.false;
        expect("#3333".itsa_isValidHexaColor()).to.be.false;
        expect("#33333".itsa_isValidHexaColor()).to.be.false;
        expect("#777333".itsa_isValidHexaColor()).to.be.true;
        expect("#7773A3".itsa_isValidHexaColor()).to.be.true;
        expect("#7773F3".itsa_isValidHexaColor()).to.be.true;
        expect("#7773G3".itsa_isValidHexaColor()).to.be.false;
        expect("#7773337".itsa_isValidHexaColor()).to.be.false;
    });

    it("String.itsa_isValidHexaColor with alpha", function () {
        expect("3333".itsa_isValidHexaColor(true)).to.be.true;
        expect("3A33".itsa_isValidHexaColor(true)).to.be.true;
        expect("3F33".itsa_isValidHexaColor(true)).to.be.true;
        expect("3G33".itsa_isValidHexaColor(true)).to.be.false;
        expect("".itsa_isValidHexaColor(true)).to.be.false;
        expect("3".itsa_isValidHexaColor(true)).to.be.false;
        expect("33".itsa_isValidHexaColor(true)).to.be.false;
        expect("333".itsa_isValidHexaColor(true)).to.be.false;
        expect("33333".itsa_isValidHexaColor(true)).to.be.false;
        expect("333333".itsa_isValidHexaColor(true)).to.be.false;
        expect("77733377".itsa_isValidHexaColor(true)).to.be.true;
        expect("7773A377".itsa_isValidHexaColor(true)).to.be.true;
        expect("7773F377".itsa_isValidHexaColor(true)).to.be.true;
        expect("7773G377".itsa_isValidHexaColor(true)).to.be.false;
        expect("777333777".itsa_isValidHexaColor(true)).to.be.false;
        expect("#3333".itsa_isValidHexaColor(true)).to.be.true;
        expect("#3A33".itsa_isValidHexaColor(true)).to.be.true;
        expect("#3F33".itsa_isValidHexaColor(true)).to.be.true;
        expect("#3G33".itsa_isValidHexaColor(true)).to.be.false;
        expect("".itsa_isValidHexaColor(true)).to.be.false;
        expect("#".itsa_isValidHexaColor(true)).to.be.false;
        expect("#3".itsa_isValidHexaColor(true)).to.be.false;
        expect("#33".itsa_isValidHexaColor(true)).to.be.false;
        expect("#333".itsa_isValidHexaColor(true)).to.be.false;
        expect("#33333".itsa_isValidHexaColor(true)).to.be.false;
        expect("#333333".itsa_isValidHexaColor(true)).to.be.false;
        expect("#3333337".itsa_isValidHexaColor(true)).to.be.false;
        expect("#77733377".itsa_isValidHexaColor(true)).to.be.true;
        expect("#7773A377".itsa_isValidHexaColor(true)).to.be.true;
        expect("#7773F377".itsa_isValidHexaColor(true)).to.be.true;
        expect("#7773G377".itsa_isValidHexaColor(true)).to.be.false;
        expect("#777333777".itsa_isValidHexaColor(true)).to.be.false;
    });

    it("String.itsa_isValidNumber", function () {
        expect("2,20".itsa_isValidNumber()).to.be.false;
        expect("2.20".itsa_isValidNumber()).to.be.false;
        expect("2,2".itsa_isValidNumber()).to.be.false;
        expect("2.2".itsa_isValidNumber()).to.be.false;
        expect("2".itsa_isValidNumber()).to.be.true;
        expect(".2".itsa_isValidNumber()).to.be.false;
        expect(",2".itsa_isValidNumber()).to.be.false;
        expect(".0".itsa_isValidNumber()).to.be.false;
        expect(",2".itsa_isValidNumber()).to.be.false;
        expect("02".itsa_isValidNumber()).to.be.false;
        expect("0".itsa_isValidNumber()).to.be.true;
        expect("00".itsa_isValidNumber()).to.be.false;
        expect("".itsa_isValidNumber()).to.be.false;
        expect("20".itsa_isValidNumber()).to.be.true;
    });

    it("String.itsa_isValidURL", function () {
        expect("htt://a.aa.nl".itsa_isValidURL()).to.be.false;
        expect("http://a.aa.nl".itsa_isValidURL()).to.be.true;
        expect("https://a.aa.nl".itsa_isValidURL()).to.be.true;
        expect("http:/a.aa.nl".itsa_isValidURL()).to.be.false;
        expect("https:/a.aa.nl".itsa_isValidURL()).to.be.false;
        expect("a.aa.nl".itsa_isValidURL()).to.be.true;
        expect("a.aa.n".itsa_isValidURL()).to.be.false;
        expect("a@aa.nl".itsa_isValidURL()).to.be.false;
        expect(".aa.nl".itsa_isValidURL()).to.be.false;
        expect("a.nl".itsa_isValidURL()).to.be.false;
        expect("aa.nl".itsa_isValidURL()).to.be.true;
        expect("a..nl".itsa_isValidURL()).to.be.false;
        expect("a.a.nl".itsa_isValidURL()).to.be.false;
        expect("a.a.aa.nl".itsa_isValidURL()).to.be.true;
        expect(".a.aa.nl".itsa_isValidURL()).to.be.false;
        expect("a.aa.nl.".itsa_isValidURL()).to.be.false;
        expect("a..aa.nl".itsa_isValidURL()).to.be.false;

        expect("http://a.aa.nl".itsa_isValidURL()).to.be.true;
        expect("http://a.aa.n".itsa_isValidURL()).to.be.false;
        expect("http://a@aa.nl".itsa_isValidURL()).to.be.false;
        expect("http://.aa.nl".itsa_isValidURL()).to.be.false;
        expect("http://a.nl".itsa_isValidURL()).to.be.false;
        expect("http://aa.nl".itsa_isValidURL()).to.be.true;
        expect("http://a..nl".itsa_isValidURL()).to.be.false;
        expect("http://a.a.nl".itsa_isValidURL()).to.be.false;
        expect("http://a.a.aa.nl".itsa_isValidURL()).to.be.true;
        expect("http://.a.aa.nl".itsa_isValidURL()).to.be.false;
        expect("http://a.aa.nl.".itsa_isValidURL()).to.be.false;
        expect("http://a..aa.nl".itsa_isValidURL()).to.be.false;

        expect("https://a.aa.nl".itsa_isValidURL()).to.be.true;
        expect("https://a.aa.n".itsa_isValidURL()).to.be.false;
        expect("https://a@aa.nl".itsa_isValidURL()).to.be.false;
        expect("https://.aa.nl".itsa_isValidURL()).to.be.false;
        expect("https://a.nl".itsa_isValidURL()).to.be.false;
        expect("https://aa.nl".itsa_isValidURL()).to.be.true;
        expect("https://a..nl".itsa_isValidURL()).to.be.false;
        expect("https://a.a.nl".itsa_isValidURL()).to.be.false;
        expect("https://a.a.aa.nl".itsa_isValidURL()).to.be.true;
        expect("https://.a.aa.nl".itsa_isValidURL()).to.be.false;
        expect("https://a.aa.nl.".itsa_isValidURL()).to.be.false;
        expect("https://a..aa.nl".itsa_isValidURL()).to.be.false;
    });

    it("String.itsa_isValidURL force http", function () {
        expect("htt://a.aa.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("http://a.aa.nl".itsa_isValidURL({http: true})).to.be.true;
        expect("https://a.aa.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("http:/a.aa.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("https:/a.aa.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("a.aa.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("a.aa.n".itsa_isValidURL({http: true})).to.be.false;
        expect("a@aa.nl".itsa_isValidURL({http: true})).to.be.false;
        expect(".aa.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("a.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("aa.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("a..nl".itsa_isValidURL({http: true})).to.be.false;
        expect("a.a.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("a.a.aa.nl".itsa_isValidURL({http: true})).to.be.false;
        expect(".a.aa.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("a.aa.nl.".itsa_isValidURL({http: true})).to.be.false;
        expect("a..aa.nl".itsa_isValidURL({http: true})).to.be.false;

        expect("http://a.aa.nl".itsa_isValidURL({http: true})).to.be.true;
        expect("http://a.aa.n".itsa_isValidURL({http: true})).to.be.false;
        expect("http://a@aa.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("http://.aa.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("http://a.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("http://aa.nl".itsa_isValidURL({http: true})).to.be.true;
        expect("http://a..nl".itsa_isValidURL({http: true})).to.be.false;
        expect("http://a.a.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("http://a.a.aa.nl".itsa_isValidURL({http: true})).to.be.true;
        expect("http://.a.aa.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("http://a.aa.nl.".itsa_isValidURL({http: true})).to.be.false;
        expect("http://a..aa.nl".itsa_isValidURL({http: true})).to.be.false;

        expect("https://a.aa.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("https://a.aa.n".itsa_isValidURL({http: true})).to.be.false;
        expect("https://a@aa.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("https://.aa.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("https://a.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("https://aa.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("https://a..nl".itsa_isValidURL({http: true})).to.be.false;
        expect("https://a.a.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("https://a.a.aa.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("https://.a.aa.nl".itsa_isValidURL({http: true})).to.be.false;
        expect("https://a.aa.nl.".itsa_isValidURL({http: true})).to.be.false;
        expect("https://a..aa.nl".itsa_isValidURL({http: true})).to.be.false;
    });

    it("String.itsa_isValidURL force https", function () {
        expect("htt://a.aa.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("http://a.aa.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("https://a.aa.nl".itsa_isValidURL({https: true})).to.be.true;
        expect("http:/a.aa.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("https:/a.aa.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("a.aa.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("a.aa.n".itsa_isValidURL({https: true})).to.be.false;
        expect("a@aa.nl".itsa_isValidURL({https: true})).to.be.false;
        expect(".aa.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("a.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("aa.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("a..nl".itsa_isValidURL({https: true})).to.be.false;
        expect("a.a.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("a.a.aa.nl".itsa_isValidURL({https: true})).to.be.false;
        expect(".a.aa.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("a.aa.nl.".itsa_isValidURL({https: true})).to.be.false;
        expect("a..aa.nl".itsa_isValidURL({https: true})).to.be.false;

        expect("http://a.aa.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("http://a.aa.n".itsa_isValidURL({https: true})).to.be.false;
        expect("http://a@aa.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("http://.aa.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("http://a.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("http://aa.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("http://a..nl".itsa_isValidURL({https: true})).to.be.false;
        expect("http://a.a.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("http://a.a.aa.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("http://.a.aa.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("http://a.aa.nl.".itsa_isValidURL({https: true})).to.be.false;
        expect("http://a..aa.nl".itsa_isValidURL({https: true})).to.be.false;

        expect("https://a.aa.nl".itsa_isValidURL({https: true})).to.be.true;
        expect("https://a.aa.n".itsa_isValidURL({https: true})).to.be.false;
        expect("https://a@aa.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("https://.aa.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("https://a.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("https://aa.nl".itsa_isValidURL({https: true})).to.be.true;
        expect("https://a..nl".itsa_isValidURL({https: true})).to.be.false;
        expect("https://a.a.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("https://a.a.aa.nl".itsa_isValidURL({https: true})).to.be.true;
        expect("https://.a.aa.nl".itsa_isValidURL({https: true})).to.be.false;
        expect("https://a.aa.nl.".itsa_isValidURL({https: true})).to.be.false;
        expect("https://a..aa.nl".itsa_isValidURL({https: true})).to.be.false;
    });
});