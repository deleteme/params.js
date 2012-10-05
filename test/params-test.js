var vows = require('vows'),
    assert = require('assert');

var Params = require('../params.js').Params;
console.log(Params);

var cheapcadaversURL = "http://www.cheapcadavers.com/?rick=moranis&bumblebee=tuna&hash[some_key]=someValue";
var stubLocation = {
  href:     cheapcadaversURL,
  search:   "?rick=moranis&bumblebee=tuna&hash[some_key]=someValue",
  protocol: "http:",
  host:     "www.cheapcadavers.com",
  pathname: "/"
};


vows.describe('Params').addBatch({
    'initialization': {
      'with a location': {
          "don't error": function(){
              assert.doesNotThrow(function(){
                return new Params(stubLocation);
              }, Error);
          }
      },
      'without a location': {
          "don't error": function(){
            assert.doesNotThrow(function(){
              return new Params();
            }, Error);
          }
      },
    },
    'API': {
      topic: function(){ return new Params(stubLocation); },
      'href()': {
        'should return the private Params href': function(params){
          assert.equal(params.href(), cheapcadaversURL);
        }
      },
      'get()': {
        'knows about existing params': function(params){
          assert.equal(params.get('rick'), 'moranis');
          assert.equal(params.get('bumblebee'), 'tuna');
          assert.equal(params.get('hash[some_key]'), 'someValue');
        },
        'returns undefined for nonexistent keys': function(params){
          assert.isUndefined(params.get('sandwich'));
        }
      }
    }
}).export(module);

/*



module("Setting Params");

test("Can set() a key that's a string or number, and returns the value that's being set.", function(){
  expect(4);
  equals(params.set('porkchop', 'sandwiches'), params);
  equals(params.get('porkchop'), 'sandwiches');
  equals(params.set(341, 'baloney'), params);
  equals(params.get(341), 'baloney');
});

var paramsWithObject = new Params(stubLocation);
test("Can accept an object", function(){
  expect(5);
  var blort = {
    smoo: 123,
    lamb: 'da',
    123:  'asdf'
  };
  equals(paramsWithObject.set(blort), paramsWithObject);
  equals(paramsWithObject.get('smoo'), 123);
  equals(paramsWithObject.get('lamb'), 'da');
  equals(paramsWithObject.get(123), 'asdf');
  equals(paramsWithObject.get('123'), 'asdf');
});

test("Can set a single param pair, and get it back out.", function(){
  expect(2);
  var value = 'gunz'
  params.set('lazer', value);
  equals(params.get('lazer'), value);
  notEqual(params.get('lazer'), undefined);
});

test("set() is chainable", function(){
  expect(3);
  equals(params.set('visa', 1234567890123456).set('mastercard', 'abcabcabcabcdddd'), params);
  equals(params.get('visa'), 1234567890123456);
  equals(params.get('mastercard'), 'abcabcabcabcdddd');

  // cleanup
  params.unset('visa').unset('mastercard');
});

module('Building search()');
var building = new Params(stubLocation);

test("search() should return just the params.", function(){
  expect(1);
  building.set('sky', 'blue');
  equals(building.search(), stubLocation.search + '&sky=blue');
});

module('Building href');

test("href() should return an href with the updated params.", function(){
  expect(1);
  building.set('sky', 'blue');
  equals(building.href(), stubLocation.href + '&sky=blue');
});

module('Reducing URL Params');

test("unset() should return params object and params shouldn't include it.", function(){
  expect(3);
  equals(building.unset('sky'), building);
  equals(building.get('sky'), undefined);
  equals(building.search().indexOf('sky'), -1);
});

test("href() should not include a key that has been removed.", function(){
  expect(4);
  equals(building.href(), stubLocation.href);

  building.unset('rick');
  equals(building.href(), "http://www.cheapcadavers.com/?bumblebee=tuna&hash[some_key]=someValue");

  building.unset('hash[some_key]');
  equals(building.href(), "http://www.cheapcadavers.com/?bumblebee=tuna");

  building.unset('bumblebee');
  equals(building.href(), "http://www.cheapcadavers.com/");
});

module('Errors!');
test("Should throw an error with an unsupported data type.", function(){
  expect(2);
  raises(function(){
    building.set(function(){}, 'blort');
  });
  raises(function(){
    building.set(false, 'blort');
  });
});

module("validate()");
test("validates a single string argument", function(){
  expect(3);
  // should pass
  ok(params.validate("?foo=bar"));
  ok(params.validate("?foo=bar&baz=wat"));
  ok(params.validate(""));
});

test("should fail if the wrong data type is passed in", function(){
  expect(7);
  ok(!params.validate(undefined));
  ok(!params.validate(false));
  ok(!params.validate(true));
  ok(!params.validate(324));
  ok(!params.validate(/someregexp/));
  ok(!params.validate([]));
  ok(!params.validate({huh:'wat'}));
});

test("should fail if doesnt start with ?", function(){
  expect(3);
  ok(!params.validate("Xfoo=bar&baz=wat"));
  ok(!params.validate("&foo=bar&baz=wat"));
  ok(!params.validate("&foo=bar&baz=wat&"));
});

test("should fail if ends with &", function(){
  expect(1);
  ok(!params.validate("?foo=bar&baz=wat&"));
});

test("should warn if location.search appears invalid", function(){
  expect(1);
  var invalidStubbedLocation = {
    href:     cheapcadaversURL,
    search:   "&rick=moranis&bumblebee=tuna&hash[some_key]=someValue&",
    protocol: "http:",
    host:     "www.cheapcadavers.com",
    pathname: "/"
  };
  var makeParamsFromInvalidObject = function(){
    var invalidParams = new Params(invalidStubbedLocation);
  };
  
  raises(function(){
    makeParamsFromInvalidObject();
  }, "Initializing Params with invalid location.search.");

});


module("object()");
test("should return an object of the params", function(){
  expect(4);
  var obj = params.object();
  equal(obj.bumblebee, 'tuna');
  equal(obj['hash[some_key]'], 'someValue');
  equal(obj.rick, 'moranis');
  equal((typeof obj), 'object');
});
test("returned object should not be the internal params", function(){
  expect(3);
  var obj = params.object();
  obj.q = 'nowai';
  ok(obj.q != params.object().q);
  ok(params.object().q != 'nowai');
  ok(params._params.q != 'nowai');
});

module("Static Methods: #parse()");

test("should turn a param string into an object", function(){
  var paramString = "?foo=bar&wart=hog";
  var obj = {
    foo: 'bar',
    wart: 'hog'
  };
  deepEqual(Params.parse(paramString), obj);
});

test("should return an empty object if the provided string is blank", function(){
  deepEqual(Params.parse(''), {});
});

test("should decode encoded strings", function(){
  var paramString = "start=2012-4-1&end=2012-4-10&sort=rating_count%2Cdesc&tz=CDT&page=1";
  var obj = {
    start: '2012-4-1',
    end: '2012-4-10',
    sort: 'rating_count,desc',
    tz: 'CDT',
    page: '1'
  };
  deepEqual(Params.parse(paramString), obj);
});
*/
