/*global describe, it */
/*jshint unused:false */

"use strict";

require("chai").should();

require("../index");

describe("Testing function instance methods", function () {
    var func = function() {
        return arguments;
    };
    var contextfunc = function() {
        return this;
    };
    describe("itsa_rbind", function () {
        it("added arguments after arguments - same context", function () {
            var rbindfunc = func.itsa_rbind(null, "append");
            rbindfunc("original")[0].should.be.eql("original");
            rbindfunc("original")[1].should.be.eql("append");
        });
        it("added arguments on empty - same context", function () {
            var rbindfunc = func.itsa_rbind(null, "append");
            rbindfunc()[0].should.be.eql("append");
        });
        it("added no arguments - same context", function () {
            var rbindfunc = func.itsa_rbind(null);
            rbindfunc("original")[0].should.be.eql("original");
        });
        it("check nr arguments - same context", function () {
            var rbindfuncEmpty = func.itsa_rbind(null),
                rbindfunc = func.itsa_rbind(null, "append1", "append2");
            /*
            // CAUTIOUS: IE9 thinks "rbindfuncEmpty().length" is an object ??
            // that"s why we changed the next 4 evaluations
            rbindfuncEmpty().length.should.be.eql(0);
            rbindfuncEmpty("first", "second", "third").length.should.be.eql(3);
            rbindfunc().length.should.be.eql(2);
            rbindfunc("first", "second", "third").length.should.be.eql(5);
            */
            (rbindfuncEmpty().length===0).should.be.true;
            (rbindfuncEmpty("first", "second", "third").length===3).should.be.true;
            (rbindfunc().length===2).should.be.true;
            (rbindfunc("first", "second", "third").length===5).should.be.true;
        });

        it("added arguments after arguments - changed context", function () {
            var newthis = {},
                rbindfunc = func.itsa_rbind(newthis, "append");
            rbindfunc("original")[0].should.be.eql("original");
            rbindfunc("original")[1].should.be.eql("append");
        });
        it("added arguments on empty - changed context", function () {
            var newthis = {},
                rbindfunc = func.itsa_rbind(newthis, "append");
            rbindfunc()[0].should.be.eql("append");
        });
        it("added no arguments - changed context", function () {
            var newthis = {},
                rbindfunc = func.itsa_rbind(newthis);
            rbindfunc("original")[0].should.be.eql("original");
        });
        it("check nr arguments - changed context", function () {
            var newthis = {},
                rbindfuncEmpty = func.itsa_rbind(newthis),
                rbindfunc = func.itsa_rbind(newthis, "append1", "append2");
            /*
            // CAUTIOUS: IE9 thinks "rbindfuncEmpty().length" is an object ??
            // that"s why we changed the next 4 evaluations
            rbindfuncEmpty().length.should.be.eql(0);
            rbindfuncEmpty("first", "second", "third").length.should.be.eql(3);
            rbindfunc().length.should.be.eql(2);
            rbindfunc("first", "second", "third").length.should.be.eql(5);
            */
            (rbindfuncEmpty().length===0).should.be.true;
            (rbindfuncEmpty("first", "second", "third").length===3).should.be.true;
            (rbindfunc().length===2).should.be.true;
            (rbindfunc("first", "second", "third").length===5).should.be.true;
        });


        it("check changed context", function () {
            var newthis = {},
                rbindfuncEmpty = contextfunc.itsa_rbind(newthis),
                rbindfunc = contextfunc.itsa_rbind(newthis, "append1", "append2");
            rbindfuncEmpty().should.be.eql(newthis);
            rbindfunc().should.be.eql(newthis);
            rbindfuncEmpty("original").should.be.eql(newthis);
            rbindfunc("original").should.be.eql(newthis);
        });
        it("check retained context", function () {
            var rbindfuncEmpty = contextfunc.itsa_rbind(null),
                rbindfunc = contextfunc.itsa_rbind(null, "append1", "append2"),
                executedFn;
            executedFn = rbindfuncEmpty();
            executedFn.should.be.eql(executedFn);
            executedFn = rbindfunc();
            executedFn.should.be.eql(executedFn);
            executedFn = rbindfuncEmpty("original");
            executedFn.should.be.eql(executedFn);
            executedFn = rbindfunc("original");
            executedFn.should.be.eql(executedFn);
        });
    });
});
