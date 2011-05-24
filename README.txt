Params.js is class that has an API for getting, setting, and unsetting URL query params
without destroying any existing query params.

It doesn't do anything fancy like serializing nested objects.

Building:

To watch the coffee file for changes and build the js:

coffee -wc params.coffee

Testing:

Testing uses qunit. Open tests.html and tests.min.html.

API:

First, make an instance of Params.js. By default, it uses window.location, but
you can pass an alternate, similar object to 'window.location' while making an
instance.

var params = new Params();

get(key)
  Returns the value of the key

set(object or key, value)
  If an object is the argument, then it will copy all of the object's
  properties to the params.

  If a key and value is passed, then it will make a new param with the given
  key and value.

  It returns either the object it was passed, or the key's value.

unset(key)
  Removes the key and value pair from the params.
  Returns the pair's value.

href()
  Returns a string that is a full URL, similar to window.location.href.

search()
  Returns a string that is just the params, in a serialized form, similar to
  window.location.search.

