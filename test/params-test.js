var vows = require('vows'),
assert = require('assert');

var Params = require('../params.js').Params;

var cheapcadaversURL = "http://www.cheapcadavers.com/?rick=moranis&bumblebee=tuna&hash[some_key]=someValue";
var stubLocation = {
    href:     cheapcadaversURL,
    search:   "?rick=moranis&bumblebee=tuna&hash[some_key]=someValue",
    protocol: "http:",
    host:     "www.cheapcadavers.com",
    pathname: "/"
};

function makeParamsWithStub(){
    return new Params(stubLocation);
}

vows.describe('Params').addBatch({
    'initialization': {
        'with a location': {
            "don't error": function(){
                assert.doesNotThrow(makeParamsWithStub, Error);
            }
        },
        'can make array params': function(){
            var p = new Params({
                href:     cheapcadaversURL,
                search:   "?rick=moranis&bumblebee=tuna&hash[some_key]=someValue&foo=x&foo=y",
                protocol: "http:",
                host:     "www.cheapcadavers.com",
                pathname: "/"
            });
            assert.deepEqual(p.get('foo'), ['x', 'y'])
            assert.isArray(p.get('foo'))
        }
    /*'without a location': {
      "don't error": function(){
      assert.doesNotThrow(function(){
      return new Params();
      }, Error);
      }
  },*/
},
'API: instance methods': {
    topic: makeParamsWithStub,
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
    },
    'set()': {
        'Can set a key that is a string or number, and returns the value that is being set.': function(params){
            assert.equal(params.set('porkchop', 'sandwiches'), params);
            assert.equal(params.get('porkchop'), 'sandwiches');
            assert.equal(params.set(341, 'baloney'), params);
            assert.equal(params.get(341), 'baloney');
        },
        'Can accept an object': function(params){
            var blort = {
                smoo: 123,
                lamb: 'da',
                123:  'asdf'
            };
            assert.equal(params.set(blort), params);
            assert.equal(params.get('smoo'), 123);
            assert.equal(params.get('lamb'), 'da');
            assert.equal(params.get(123), 'asdf');
            assert.equal(params.get('123'), 'asdf');
        },
        'Can set a single param pair, and get it back out.': function(params){
            var value = 'gunz';
            params.set('lazer', value);
            assert.equal(params.get('lazer'), value);
            assert.notEqual(params.get('lazer'), undefined);
            assert.isTrue(!!params.get('lazer'));
        },
        'Can set an array, and get it back out': function(params){
            var arr = ['a', 'b'];
            params.set('my_array', arr);
            var got = params.get('my_array');

            assert.deepEqual(got, arr);
        },
        'is chainable': function(params){
            assert.equal(params.set('visa', 1234567890123456).set('mastercard', 'abcabcabcabcdddd'), params);
            assert.equal(params.get('visa'), 1234567890123456);
            assert.equal(params.get('mastercard'), 'abcabcabcabcdddd');
        },
        'raises an error with an unsupported data type': function(params){
            assert.throws(function(){
                params.set(function(){}, 'blort');
            });
            assert.throws(function(){
                params.set(false, 'blort');
            });
        }
    },
    'search()': {
        topic: makeParamsWithStub,
        'should return just the params': function(params){
            params.set('sky', 'blue');
            assert.equal(params.search(), stubLocation.search + '&sky=blue');
        },
        'for arrays, should set key multiple times': function(params){
            params.set('foo', ['a', 'b']);
            assert.equal(params.search(), stubLocation.search + '&sky=blue&foo=a&foo=b');
        }
    },
    'href()': {
        topic: makeParamsWithStub,
        'should return an href with the updated params.': function(params){
            params.set('sky', 'blue');
            assert.equal(params.href(), stubLocation.href + '&sky=blue');
        },
        'for arrays, should set key multiple times': function(params){
            params.set('foo', ['a', 'b']);
            assert.equal(params.href(), stubLocation.href + '&sky=blue&foo=a&foo=b');
        }
    },
    'unset()': {
        topic: makeParamsWithStub,
        'should return params object and params should not include it.': function(params){
            assert.equal(params.unset('sky'), params);
            assert.equal(params.get('sky'), undefined);
            assert.equal(params.search().indexOf('sky'), -1);
        },
        'href() should not include a key that has been removed.': function(params){
            assert.equal(params.href(), stubLocation.href);
            params.unset('rick');
            assert.equal(params.href(), "http://www.cheapcadavers.com/?bumblebee=tuna&hash[some_key]=someValue");
            params.unset('hash[some_key]');
            assert.equal(params.href(), "http://www.cheapcadavers.com/?bumblebee=tuna");
            params.unset('bumblebee');
            assert.equal(params.href(), "http://www.cheapcadavers.com/");
        }
    },
    'validate()': {
        'validates a single string argument': function(params){
            assert.ok(params.validate("?foo=bar"));
            assert.ok(params.validate("?foo=bar&baz=wat"));
            assert.ok(params.validate(""));
        },
        "should fail if the wrong data type is passed in": function(params){
            assert.ok(!params.validate(undefined));
            assert.ok(!params.validate(false));
            assert.ok(!params.validate(true));
            assert.ok(!params.validate(324));
            assert.ok(!params.validate(/someregexp/));
            assert.ok(!params.validate([]));
            assert.ok(!params.validate({huh:'wat'}));
        },
        "should fail if doesnt start with ?": function(params){
            assert.ok(!params.validate("Xfoo=bar&baz=wat"));
            assert.ok(!params.validate("&foo=bar&baz=wat"));
            assert.ok(!params.validate("&foo=bar&baz=wat&"));
        },
        'should fail if it ends with a &': function(params){
            assert.ok(!params.validate('?foo=bar&baz=wat&'));
        },
        "should warn if location.search appears invalid": function(params){
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

            assert.throws(function(){
                makeParamsFromInvalidObject();
            }, "Initializing Params with invalid location.search.");
        }
    },
    'object()': {
        "should return an object of the params": function(params){
            var obj = params.object();
            assert.equal(obj.bumblebee, 'tuna');
            assert.equal(obj['hash[some_key]'], 'someValue');
            assert.equal(obj.rick, 'moranis');
            assert.equal((typeof obj), 'object');
        },
        "returned object should not be the internal params": function(params){
            var obj = params.object();
            assert.ok(params._params !== obj);

            // modify returned object
            obj.q = 'nowai';

            // assert that the internal one didn't get changed
            assert.ok(obj.q !== params.object().q);
            assert.isUndefined(params._params.q);
            assert.isUndefined(params.object().q);
        }
    }
},
'API: static methods': {
    'Params.parse()': {
        "should turn a param string into an object": function(){
            var paramString = "?foo=bar&wart=hog";
            var obj = {
                foo: 'bar',
                wart: 'hog'
            };
            assert.deepEqual(Params.parse(paramString), obj);
        },
        "should return an empty object if the provided string is blank": function(){
            assert.deepEqual(Params.parse(''), {});
        },
        "should decode encoded strings": function(){
            var paramString = "start=2012-4-1&end=2012-4-10&sort=rating_count%2Cdesc&tz=CDT&page=1";
            var obj = {
                start: '2012-4-1',
                end: '2012-4-10',
                sort: 'rating_count,desc',
                tz: 'CDT',
                page: '1'
            };
            assert.deepEqual(Params.parse(paramString), obj);
        },
        "should decode array parameters": function(){
            var paramString = "foo=a&foo=b";
            var obj = { foo: ['a', 'b'] };
            assert.deepEqual(Params.parse(paramString), obj);
        }
    }
}
}).export(module);
