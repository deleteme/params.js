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

**get(key)**
Returns the value of the key

**set(object or key, value)**
If an object is the argument, then it will copy all of the object's
properties to the params.

If a key and value is passed, then it will make a new param with the given
key and value.

It returns either the object it was passed, or the key's value.

**unset(key)**
Removes the key and value pair from the params.
Returns the pair's value.

**href()**
Returns a string that is a full URL, similar to window.location.href.

**search()**
Returns a string that is just the params, in a serialized form, similar to
window.location.search.

**validate(string)**
Useful to test if the given string resembles a valid location.search object.
Returns true if it passes.
