Params.js takes the suck out of window.location.search.

Params.js is class that has an API for getting, setting, and unsetting URL query params
without destroying any existing query params.

It doesn't do anything fancy like serializing nested objects or attempting to
preserve a particular param order.

### Building

To watch the coffee file for changes and build the js:

`coffee -wcb params.coffee`

### Testing

Testing uses qunit. Open tests.html and tests.min.html.

### API

First, make an instance of `Params`. By default, it uses window.location, but
you can pass an object the constructor that resembles 'window.location'.

```javascript
// plain
var params = new Params();

// with a stubbed location object
var stubbedLocation = {
  href: cheapcadaversURL,
  search: "?rick=moranis&bumblebee=tuna&hash[some_key]=someValue",
  protocol: "http:",
  host: "www.cheapcadavers.com",
  pathname: "/"
};
var fakedParams = new Params(stubbedLocation);
```

### Instance Methods

#### get(key)

Returns the value of the key

#### set(object or key, value)

If an object is the argument, then it will copy all of the object's
properties to the params.

If a key and value is passed, then it will make a new param with the given
key and value.

It returns the params object, making it chainable.

#### unset(key)

Removes the key and value pair from the params.

It returns the params object, it's also chainable.

#### href()

Returns a string that is a full URL, similar to window.location.href.

#### search()

Returns a string that is just the params, in a serialized form, similar to
window.location.search.

#### object()

Returns a shallow copy of the internal _params object.

#### validate(string)

Useful to test if the given string resembles a valid location.search object.
Returns true if it passes.

### Static Methods

#### Params.parse(string)

Creates and returns an object from the query params in the string.

### Change Log:

**v0.5.0** - _November 29, 2011_ - `set` and `unset` methods return the params object, making it chainable.

**v0.4.0** - _September 26, 2011_ - Added `object()` instance method to return an object of the params.

**v0.3.1** - _September 14, 2011_ - `Params.parse()` returns an empty object if it gets an empty string.

**v0.3.0** - _September 14, 2011_ - Using prototypes instead of closures to reduce memory footprint. Added `Params.parse()` static method.

**v0.2.1** - _August 17, 2011_ - Added `validate()` instance method.

