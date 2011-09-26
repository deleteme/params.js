var cheapcadaversURL = "http://www.cheapcadavers.com/?rick=moranis&bumblebee=tuna&hash[some_key]=someValue";
var stubLocation = {
  href:     cheapcadaversURL,
  search:   "?rick=moranis&bumblebee=tuna&hash[some_key]=someValue",
  protocol: "http:",
  host:     "www.cheapcadavers.com",
  pathname: "/"
};


test("Can be instantiated with an optional _location argument", function(){
  expect(2);
  ok(new Params(stubLocation), "We expect it not to error with a location.");
  ok(new Params(), "We expect it not to error without a location.");
});

var params = new Params(stubLocation);

test("href() should return the private Params href", function(){
  expect(1);
  equals(params.href(), cheapcadaversURL);
});

module("Reading Params");

test("Knows about existing params on init.", function(){
  expect(3);
  equals(params.get('rick'), 'moranis');
  equals(params.get('bumblebee'), 'tuna');
  equals(params.get('hash[some_key]'), 'someValue');
});

test("Returns undefined for undefined keys.", function(){
  expect(1);
  equals(params.get('sandwich'), undefined);
});

module("Setting Params");

test("Can set() a key that's a string or number, and returns the value that's being set.", function(){
  expect(4);
  equals(params.set('porkchop', 'sandwiches'), 'sandwiches');
  equals(params.get('porkchop'), 'sandwiches');
  equals(params.set(341, 'baloney'), 'baloney');
  equals(params.get(341), 'baloney');
});

var paramsWithObject = new Params(stubLocation);
test("Returns an object if it took one.", function(){
  expect(5);
  var blort = {
    smoo: 123,
    lamb: 'da',
    123:  'asdf'
  };
  equals(paramsWithObject.set(blort), blort);
  equals(paramsWithObject.get('smoo'), 123);
  equals(paramsWithObject.get('lamb'), 'da');
  equals(paramsWithObject.get(123), 'asdf');
  equals(paramsWithObject.get('123'), 'asdf');
});

test("Can set a single param pair, and get it back out.", function(){
  expect(2);
  var target = params.set('lazer', 'gunz');
  equals(params.get('lazer'), target);
  notEqual(params.get('lazer'), undefined);
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

test("unset() should return value of key being removed and params shouldn't include it.", function(){
  expect(3);
  equals(building.unset('sky'), 'blue');
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

