/*global describe, it, Blob */
/*jshint unused:false */

"use strict";

var expect = require("chai").expect,
    Classes = require("itsa-classes"),
    isNode = (typeof global!=='undefined') && ({}.toString.call(global)==='[object global]') && (!global.document || ({}.toString.call(global.document)!=='[object HTMLDocument]'));

require("../index");

describe("Testing itsa_isObject", function () {

	it("object", function () {
		expect(Object.itsa_isObject({})).to.be.true;
	});

	it("Object.create(null)", function () {
		expect(Object.itsa_isObject(Object.create(null))).to.be.true;
	});

	it("function", function () {
		expect(Object.itsa_isObject(function(){})).to.be.false;
	});

	it("array", function () {
		expect(Object.itsa_isObject([])).to.be.false;
	});

	it("regexp", function () {
		expect(Object.itsa_isObject(/^a/)).to.be.false;
	});

	it("Error", function () {
		expect(Object.itsa_isObject(new Error())).to.be.false;
	});

	it("Date", function () {
		expect(Object.itsa_isObject(new Date)).to.be.false;
	});

	it("boolean", function () {
		expect(Object.itsa_isObject(true)).to.be.false;
	});

	it("number", function () {
		expect(Object.itsa_isObject(1)).to.be.false;
	});

	it("String", function () {
		expect(Object.itsa_isObject("ITSA")).to.be.false;
	});

	it("null", function () {
		expect(Object.itsa_isObject(null)).to.be.false;
	});

	it("undefined", function () {
		expect(Object.itsa_isObject(undefined)).to.be.false;
	});

	it("Promise", function () {
		expect(Object.itsa_isObject(Promise.resolve())).to.be.false;
	});

	it("Blob", function () {
		if (!isNode) {
			expect(Object.itsa_isObject(new Blob(["foo", "bar"]))).to.be.false;
		}
	});

});

describe("Testing itsa_newProto", function () {

	it("new prototype", function () {
		var a = {
				b: 10,
				d: 15
			},
			proto = {
				c: 20,
				d: 25
			},
			newObj;
		newObj = Object.itsa_newProto(a, proto);
		expect(newObj.b).to.be.eql(10);
		expect(newObj.c).to.be.eql(20);
		expect(newObj.d).to.be.eql(15);
	});

	it("no inteference prototypes", function () {
		var a = {
				b: 10
			},
			proto = {
				c: 20
			},
			newObj1, newObj2;
		newObj1 = Object.itsa_newProto(a, proto);
		newObj2 = Object.itsa_newProto(a, proto);
		newObj1.b = 15;
		expect(newObj1.b).to.be.eql(15);
		expect(newObj1.c).to.be.eql(20);
		expect(newObj2.b).to.be.eql(10);
		expect(newObj2.c).to.be.eql(20);
		proto.c = 25;
		expect(newObj1.c).to.be.eql(25);
		expect(newObj2.c).to.be.eql(25);
	});

	it("check merge", function () {
		var a = {
				b: [10]
			},
			proto = {
				c: 20
			},
			newObj;
		newObj = Object.itsa_newProto(a, proto);
		a.b[0] = 15;
		expect(newObj.b[0]).to.be.eql(15);
	});

	it("check clone", function () {
		var a = {
				b: [10]
			},
			proto = {
				c: 20
			},
			newObj;
		newObj = Object.itsa_newProto(a, proto, true);
		a.b[0] = 15;
		expect(newObj.b[0]).to.be.eql(10);
	});

});

describe("Testing object instance methods", function () {
	var obj = {a:1, b:2, c:3},
		obj2 = {
			c: {
				c1: {c1a: 30}
			},
			d: 5
		},
		deepObj = {
			a: 1,
			b: [10, true, "Modules", {b1: true}, ["first item"], new Date(2015, 1, 1, 12, 30, 0, 0)],
			c: new Date(2015, 2, 1, 12, 30, 0, 0),
			d: {
				d1: 1,
				d2: true,
				d3: "ITSA modules",
				d4: new Date(2015, 3, 1, 12, 30, 0, 0),
				d5: {
						d51: true
					},
				d6: [
						"more modules"
					]
			},
			e: true,
			f: "ITSA"
		};
	it("itsa_each", function () {
		var a = "";
		obj.itsa_each(function (value, key) {
			a+=value + key;
		});
		expect(a).be.equal("1a2b3c");
	});
	it("itsa_each w/ context", function () {
		var A = Classes.createClass(function() {
			this.count = 0;
		},{
			go: function () {
				obj.itsa_each(function () {
					this.count++;
				}, this);
			}
		});
		var a = new A();
		a.go();
		expect(a.count).eql(3);
   });
	it("itsa_some", function () {
		var count = 0;
		expect(obj.itsa_some(function (item, key) {
			count++;
			return item === key;
		})).to.be.false;
		expect(count).eql(3);
		count = 0;
		expect({a:1,b:"b",c:3}.itsa_some(function (item, key) {
			count++;
			return item === key;
		})).to.be.true;
		expect(count).eql(2);
	});
	it("itsa_keys", function () {
		expect(obj.itsa_keys()).be.eql(Object.keys(obj));
	});
	it("itsa_values", function () {
		expect(obj.itsa_values()).eql([1,2,3]);
	});
	it("itsa_isEmpty", function () {
		expect(obj.itsa_isEmpty()).be.false;
		expect({}.itsa_isEmpty()).be.true;
	});
	it("itsa_sameValue", function () {
		var deepObj2 = {
			a: 1,
			b: [10, true, "Modules", {b1: true}, ["first item"], new Date(2015, 1, 1, 12, 30, 0, 0)],
			c: new Date(2015, 2, 1, 12, 30, 0, 0),
			d: {
				d1: 1,
				d2: true,
				d3: "ITSA modules",
				d4: new Date(2015, 3, 1, 12, 30, 0, 0),
				d5: {
						d51: true
					},
				d6: [
						"more modules"
					]
			},
			e: true,
			f: "ITSA"
		};
		expect(deepObj.itsa_sameValue(deepObj2)).to.be.true;
		deepObj2.d.d1 = 2;
		expect(deepObj.itsa_sameValue(deepObj2)).to.be.false;
	});
	// it("map", function () {
	// 	expect(obj.map(function (value, key) {
	// 		return key + value;
	// 	})).be.eql({a:"a1",b:"b2",c:"c3"});
	// 	expect(obj.map(function (value, key) {
	// 		return (key == "b"?undefined:key + value);
	// 	})).be.eql({a:"a1", c:"c3"});
	// });
	it("itsa_shallowClone", function () {
		var a = obj.itsa_shallowClone();
		expect(a).be.eql(obj);
		expect(a===obj).to.be.false;
		a.a = 42;
		expect(a).not.be.eql(obj);
		expect(a.a).be.equal(42);
		expect(obj.a).be.equal(1);
	});
	it("itsa_deepClone", function () {
		var a = deepObj.itsa_deepClone();
		expect(a).be.eql(deepObj);
		expect(a===deepObj).to.be.false;

		a.a = 42;
		expect(a.a).be.equal(42);
		expect(deepObj.a).be.equal(1);

		a.b[0] = 2;
		a.b[1] = 5;
		a.b[2] = 20;
		a.b[3].b1 = false;
		a.b[4][0] = "second item";
		a.b[5] = new Date(2016, 1, 1, 12, 30, 0, 0);
		expect(a.b).to.be.eql([2, 5, 20, {b1: false}, ["second item"], new Date(2016, 1, 1, 12, 30, 0, 0)]);
		expect(deepObj.b).to.be.eql([10, true, "Modules", {b1: true}, ["first item"], new Date(2015, 1, 1, 12, 30, 0, 0)]);

		a.c = "ITSA";
		expect(a.c).be.equal("ITSA");
		expect(deepObj.c).to.be.eql(new Date(2015, 2, 1, 12, 30, 0, 0));

		a.e = "Mod";
		expect(a.e).be.equal("Mod");
		expect(deepObj.e).be.equal(true);

		a.d.d1 = 2;
		a.d.d2 = 3;
		a.d.d3 = 4;
		a.d.d4 = 5;
		a.d.d5.d51 = 6;
		a.d.d6[0] = 7;
		expect(a.d).to.be.eql({d1:2, d2:3, d3:4, d4:5, d5: {d51: 6}, d6: [7]});
		expect(deepObj.d).to.be.eql({d1:1, d2:true, d3:"ITSA modules", d4:new Date(2015, 3, 1, 12, 30, 0, 0), d5: {d51: true}, d6: ["more modules"]});

		a.f = 4;
		expect(a.f).be.equal(4);
		expect(deepObj.f).be.equal("ITSA");

		a.h = 10;
		expect(deepObj.h===undefined).to.be.true;

		deepObj.i = 10;
		expect(a.i===undefined).to.be.true;
		delete deepObj.i;
	});

	it("itsa_emptyObject", function () {
		var obj = {a:1,b:2,c:3};
		obj.itsa_emptyObject();
		expect(obj.itsa_keys()).be.eql([]);
	});

	describe("itsa_defineData", function () {
		it("new data", function () {
			var obj = {a:1,b:2,c:3},
				newObj = {d:4,e:[5]};
			obj.itsa_defineData(newObj);
			newObj.e[1] = 6;
			expect(obj).be.eql(newObj);
			expect(obj===newObj).to.be.false;
		});
		it("new data cloned", function () {
			var obj = {a:1,b:2,c:3},
				newObj = {d:4,e:[5]};
			obj.itsa_defineData(newObj, true);
			newObj.e[1] = 6;
			expect(obj).not.be.eql(newObj);
			expect(obj===newObj).to.be.false;
		});
	});

	describe("itsa_merge", function () {
		it("simple", function () {
			var a = {};
			expect(a.itsa_merge(obj)).be.eql(obj);
			expect(a).be.eql(obj);
		});
		it("empty values", function () {
			var a = {},
				b = {
					b1: null,
					b2: undefined,
					b3: 0,
					b4: ""
				};
			expect(a.itsa_merge(b)).be.eql(b);
			expect(a).be.eql(b);
		});
		it("existing, not forced",  function () {
			var a = {b:42};
			a.itsa_merge(obj);
			expect(a).be.eql({a:1,b:42,c:3});
		});
		it("existing, forced",  function () {
			var a = {b:42};
			a.itsa_merge(obj, {force: true});
			expect(a).be.eql(obj);
		});
		it("deep objects, not forced",  function () {
			var originalObj = {
				a:1,
				b: {
					b1: {b1a: 10, b1b: 20},
					b2: {b2a: 10, b2b: 20}
				},
				c: {
					c1: {c1a: 10, c1b: 20},
					c2: {c2a: 10, c2b: 20}
				},
				d: 4
			};
			var expectedObj = {
				a:1,
				b: {
					b1: {b1a: 10, b1b: 20},
					b2: {b2a: 10, b2b: 20}
				},
				c: {
					c1: {c1a: 10, c1b: 20},
					c2: {c2a: 10, c2b: 20}
				},
				d: 4
			};
			originalObj.itsa_merge(obj2);
			expect(originalObj).be.eql(expectedObj);
		});
		it("deep objects, forced",  function () {
			var originalObj = {
				a:1,
				b: {
					b1: {b1a: 10, b1b: 20},
					b2: {b2a: 10, b2b: 20}
				},
				c: {
					c1: {c1a: 10, c1b: 20},
					c2: {c2a: 10, c2b: 20}
				},
				d: 4
			};
			var expectedObj = {
				a:1,
				b: {
					b1: {b1a: 10, b1b: 20},
					b2: {b2a: 10, b2b: 20}
				},
				c: {
					c1: {c1a: 30}
				},
				d: 5
			};
			originalObj.itsa_merge(obj2, {force: true});
			expect(originalObj).be.eql(expectedObj);
		});
		it("deep objects, deep-forced",  function () {
			var originalObj = {
				a:1,
				b: {
					b1: {b1a: 10, b1b: 20},
					b2: {b2a: 10, b2b: 20}
				},
				c: {
					c1: {c1a: 10, c1b: 20},
					c2: {c2a: 10, c2b: 20}
				},
				d: 4
			};
			var expectedObj = {
				a:1,
				b: {
					b1: {b1a: 10, b1b: 20},
					b2: {b2a: 10, b2b: 20}
				},
				c: {
					c1: {c1a: 30, c1b: 20},
					c2: {c2a: 10, c2b: 20}
				},
				d: 5
			};
			originalObj.itsa_merge(obj2, {force: "deep"});
			expect(originalObj).be.eql(expectedObj);
		});
		it("undefined source", function () {
			var a = {b:42};
			a.itsa_merge(undefined);
			expect(a).eql({b:42});
		});

	});
	describe("Object.itsa_merge", function () {
		it("should mix them up, b should not be overwritten", function () {
			expect(Object.itsa_merge(
				{a:1,b:2,c:3},
				{b:5,d:4}
			)).be.eql({a:1,b:2,c:3,d:4});
		});
		it("nulls should be skipped", function () {
			expect(Object.itsa_merge(undefined,{a:1,b:2})).be.eql({a:1,b:2});
		});
	});

});

describe("Testing object itsa_merge methods with descriptors", function () {

	describe("enabled itsa_merge descriptors", function () {
		var obj = {a:1, b:2, c:3},
			deepObj = Object.create({}, {
				a: {
						value: 1
					},
				b: {
						value: [10, true, "Modules", {b1: true}, ["first item"], new Date(2015, 1, 1, 12, 30, 0, 0)]
					},
				c: {
						value: new Date(2015, 2, 1, 12, 30, 0, 0)
					},
				d: {
					value: {
						d1: 1,
						d2: true,
						d3: "ITSA modules",
						d4: new Date(2015, 3, 1, 12, 30, 0, 0),
						d5: {
								d51: true
							},
						d6: [
								"more modules"
							]
						}
					},
				e: {
						value: true
					},
				f: {
						value: "ITSA"
					}
			}),
			deepObjGetters = Object.create({}, {
				a: {
						value: 1
					},
				b: {
						value: [10, true, "Modules", {b1: true}, ["first item"], new Date(2015, 1, 1, 12, 30, 0, 0)]
					},
				c: {
						value: new Date(2015, 2, 1, 12, 30, 0, 0)
					},
				d: {
					value: {
						d1: 1,
						d2: true,
						d3: "ITSA modules",
						d4: new Date(2015, 3, 1, 12, 30, 0, 0),
						d5: {
								d51: true
							},
						d6: [
								"more modules"
							]
						}
					},
				e: {
					value: true
					},
				f: {
						value: "ITSA"
					}
			});

		it("itsa_shallowClone", function () {
			var a = obj.itsa_shallowClone(true);
			expect(a).be.eql(obj);
			expect(a===obj).to.be.false;
			a.a = 42;
			expect(a).not.be.eql(obj);
			expect(a.a).be.equal(42);
			expect(obj.a).be.equal(1);
		});
		it("itsa_deepClone", function () {
			var a = deepObj.itsa_deepClone(true);
			// with propertydescriptors, cloned objects cannot equal exactly:
			expect(a).not.be.eql(deepObj);
			expect(a===deepObj).to.be.false;

			a.a = 42;
			expect(a.a).be.equal(42);
			expect(deepObj.a).be.equal(1);

			a.b[0] = 2;
			a.b[1] = 5;
			a.b[2] = 20;
			a.b[3].b1 = false;
			a.b[4][0] = "second item";
			a.b[5] = new Date(2016, 1, 1, 12, 30, 0, 0);
			expect(a.b).to.be.eql([2, 5, 20, {b1: false}, ["second item"], new Date(2016, 1, 1, 12, 30, 0, 0)]);
			expect(deepObj.b).to.be.eql([10, true, "Modules", {b1: true}, ["first item"], new Date(2015, 1, 1, 12, 30, 0, 0)]);

			a.c = "ITSA";
			expect(a.c).be.equal("ITSA");
			expect(deepObj.c).to.be.eql(new Date(2015, 2, 1, 12, 30, 0, 0));

			a.e = "Mod";
			expect(a.e).be.equal("Mod");
			expect(deepObj.e).be.equal(true);

			a.d.d1 = 2;
			a.d.d2 = 3;
			a.d.d3 = 4;
			a.d.d4 = 5;
			a.d.d5.d51 = 6;
			a.d.d6[0] = 7;
			expect(a.d).to.be.eql({d1:2, d2:3, d3:4, d4:5, d5: {d51: 6}, d6: [7]});
			expect(deepObj.d).to.be.eql({d1:1, d2:true, d3:"ITSA modules", d4:new Date(2015, 3, 1, 12, 30, 0, 0), d5: {d51: true}, d6: ["more modules"]});

			a.f = 4;
			expect(a.f).be.equal(4);
			expect(deepObj.f).be.equal("ITSA");
		});
		it("itsa_deepClone with getters", function () {
			var a = deepObjGetters.itsa_deepClone(true);
			// with propertydescriptors, cloned objects cannot equal exactly:
			expect(a).not.be.eql(deepObj);
			expect(a===deepObj).to.be.false;

			a.a = 42;
			expect(a.a).be.equal(42);
			expect(deepObj.a).be.equal(1);

			a.b[0] = 2;
			a.b[1] = 5;
			a.b[2] = 20;
			a.b[3].b1 = false;
			a.b[4][0] = "second item";
			a.b[5] = new Date(2016, 1, 1, 12, 30, 0, 0);
			expect(a.b).to.be.eql([2, 5, 20, {b1: false}, ["second item"], new Date(2016, 1, 1, 12, 30, 0, 0)]);
			expect(deepObj.b).to.be.eql([10, true, "Modules", {b1: true}, ["first item"], new Date(2015, 1, 1, 12, 30, 0, 0)]);

			a.c = "ITSA";
			expect(a.c).be.equal("ITSA");
			expect(deepObj.c).to.be.eql(new Date(2015, 2, 1, 12, 30, 0, 0));

			a.e = "Mod";
			expect(a.e).be.equal("Mod");
			expect(deepObj.e).be.equal(true);

			a.d.d1 = 2;
			a.d.d2 = 3;
			a.d.d3 = 4;
			a.d.d4 = 5;
			a.d.d5.d51 = 6;
			a.d.d6[0] = 7;
			expect(a.d).to.be.eql({d1:2, d2:3, d3:4, d4:5, d5: {d51: 6}, d6: [7]});
			expect(deepObj.d).to.be.eql({d1:1, d2:true, d3:"ITSA modules", d4:new Date(2015, 3, 1, 12, 30, 0, 0), d5: {d51: true}, d6: ["more modules"]});

			a.f = 4;
			expect(a.f).be.equal(4);
			expect(deepObj.f).be.equal("ITSA");
		});
		describe("itsa_merge", function () {
			it("simple", function () {
				var a = {};
				expect(a.itsa_merge(obj, {descriptors: true})).be.eql(obj);
				expect(a).be.eql(obj);
			});
			it("existing, not forced",  function () {
				var a = {b:42};
				a.itsa_merge(obj, {descriptors: true});
				expect(a).be.eql({a:1,b:42,c:3});
			});
			it("existing, forced",  function () {
				var a = {b:42};
				a.itsa_merge(obj, {force: true, descriptors: true});
				expect(a).be.eql(obj);
			});
			it("undefined source", function () {
				var a = {b:42};
				a.itsa_merge(undefined, {descriptors: true});
				expect(a).eql({b:42});
			});

		});
	});

	describe("disabled itsa_merge descriptors", function () {
		var obj = {a:1, b:2, c:3},
			deepObj = Object.create({}, {
				a: {
						value: 1
					},
				b: {
					value: [10, true, "Modules", {b1: true}, ["first item"], new Date(2015, 1, 1, 12, 30, 0, 0)]
					},
				c: {
						value: new Date(2015, 2, 1, 12, 30, 0, 0)
					},
				d: {
					value: {
						d1: 1,
						d2: true,
						d3: "ITSA modules",
						d4: new Date(2015, 3, 1, 12, 30, 0, 0),
						d5: {
								d51: true
							},
						d6: [
								"more modules"
							]
						}
					},
				e: {
						value: true
					},
				f: {
						value: "ITSA"
					}
			}),
			deepObjGetters = Object.create({}, {
				a: {
						value: 1
					},
				b: {
						value: [10, true, "Modules", {b1: true}, ["first item"], new Date(2015, 1, 1, 12, 30, 0, 0)]
					},
				c: {
						value: new Date(2015, 2, 1, 12, 30, 0, 0)
					},
				d: {
					value: {
						d1: 1,
						d2: true,
						d3: "ITSA modules",
						d4: new Date(2015, 3, 1, 12, 30, 0, 0),
						d5: {
								d51: true
							},
						d6: [
								"more modules"
							]
						}
					},
				e: {
						value: true
					},
				f: {
						value: "ITSA"
					}
			});
		it("itsa_shallowClone", function () {
			var a = obj.itsa_shallowClone();
			expect(a).be.eql(obj);
			expect(a===obj).to.be.false;
			a.a = 42;
			expect(a).not.be.eql(obj);
			expect(a.a).be.equal(42);
			expect(obj.a).be.equal(1);
		});
		it("itsa_deepClone", function () {
			var a = deepObj.itsa_deepClone();
			// with propertydescriptors, cloned objects cannot equal exactly:
			expect(a).not.be.eql(deepObj);
			expect(a===deepObj).to.be.false;

			a.a = 42;
			expect(a.a).be.equal(42);
			expect(deepObj.a).be.equal(1);

			a.b[0] = 2;
			a.b[1] = 5;
			a.b[2] = 20;
			a.b[3].b1 = false;
			a.b[4][0] = "second item";
			a.b[5] = new Date(2016, 1, 1, 12, 30, 0, 0);
			expect(a.b).to.be.eql([2, 5, 20, {b1: false}, ["second item"], new Date(2016, 1, 1, 12, 30, 0, 0)]);
			expect(deepObj.b).to.be.eql([10, true, "Modules", {b1: true}, ["first item"], new Date(2015, 1, 1, 12, 30, 0, 0)]);

			a.c = "ITSA";
			expect(a.c).be.equal("ITSA");
			expect(deepObj.c).to.be.eql(new Date(2015, 2, 1, 12, 30, 0, 0));

			a.e = "Mod";
			expect(a.e).be.equal("Mod");
			expect(deepObj.e).be.equal(true);

			a.d.d1 = 2;
			a.d.d2 = 3;
			a.d.d3 = 4;
			a.d.d4 = 5;
			a.d.d5.d51 = 6;
			a.d.d6[0] = 7;
			expect(a.d).to.be.eql({d1:2, d2:3, d3:4, d4:5, d5: {d51: 6}, d6: [7]});
			expect(deepObj.d).to.be.eql({d1:1, d2:true, d3:"ITSA modules", d4:new Date(2015, 3, 1, 12, 30, 0, 0), d5: {d51: true}, d6: ["more modules"]});

			a.f = 4;
			expect(a.f).be.equal(4);
			expect(deepObj.f).be.equal("ITSA");
		});
		it("itsa_deepClone with getters", function () {
			var a = deepObjGetters.itsa_deepClone();
			// with propertydescriptors, cloned objects cannot equal exactly:
			expect(a).not.be.eql(deepObj);
			expect(a===deepObj).to.be.false;

			a.a = 42;
			expect(a.a).be.equal(42);
			expect(deepObj.a).be.equal(1);

			a.b[0] = 2;
			a.b[1] = 5;
			a.b[2] = 20;
			a.b[3].b1 = false;
			a.b[4][0] = "second item";
			a.b[5] = new Date(2016, 1, 1, 12, 30, 0, 0);
			expect(a.b).to.be.eql([2, 5, 20, {b1: false}, ["second item"], new Date(2016, 1, 1, 12, 30, 0, 0)]);
			expect(deepObj.b).to.be.eql([10, true, "Modules", {b1: true}, ["first item"], new Date(2015, 1, 1, 12, 30, 0, 0)]);

			a.c = "ITSA";
			expect(a.c).be.equal("ITSA");
			expect(deepObj.c).to.be.eql(new Date(2015, 2, 1, 12, 30, 0, 0));

			a.e = "Mod";
			expect(a.e).be.equal("Mod");
			expect(deepObj.e).be.equal(true);

			a.d.d1 = 2;
			a.d.d2 = 3;
			a.d.d3 = 4;
			a.d.d4 = 5;
			a.d.d5.d51 = 6;
			a.d.d6[0] = 7;
			expect(a.d).to.be.eql({d1:2, d2:3, d3:4, d4:5, d5: {d51: 6}, d6: [7]});
			expect(deepObj.d).to.be.eql({d1:1, d2:true, d3:"ITSA modules", d4:new Date(2015, 3, 1, 12, 30, 0, 0), d5: {d51: true}, d6: ["more modules"]});

			a.f = 4;
			expect(a.f).be.equal(4);
			expect(deepObj.f).be.equal("ITSA");
		});
		describe("itsa_merge", function () {
			it("simple", function () {
				var a = {};
				expect(a.itsa_merge(obj)).be.eql(obj);
				expect(a).be.eql(obj);
			});
			it("existing, not forced",  function () {
				var a = {b:42};
				a.itsa_merge(obj);
				expect(a).be.eql({a:1,b:42,c:3});
			});
			it("existing, forced",  function () {
				var a = {b:42};
				a.itsa_merge(obj, {force: true});
				expect(a).be.eql(obj);
			});
			it("existing, replace",  function () {
				var a = {b:42};
				a.itsa_merge(obj, {replace: true});
				expect(a).be.eql({b:2});
			});
			it("undefined source", function () {
				var a = {b:42};
				a.itsa_merge(undefined);
				expect(a).eql({b:42});
			});

		});
	});

});