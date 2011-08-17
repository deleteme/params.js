(function() {
  (function(root) {
    return root.Params = function(_location) {
      var href, pair, search, set, unset, _i, _len, _params, _prefix, _search, _set;
      if (_location == null) {
        _location = location;
      }
      _search = _location.search;
      _prefix = _location.protocol + '//' + _location.host + _location.pathname;
      _params = {};
      if (_search.indexOf('?') >= 0) {
        _search = _search.slice(1, _search.length).split('&');
        for (_i = 0, _len = _search.length; _i < _len; _i++) {
          pair = _search[_i];
          pair = pair.split('=');
          _params[pair[0]] = pair[1];
        }
      }
      href = function() {
        return _prefix + search();
      };
      search = function() {
        var key, pairs;
        pairs = (function() {
          var _results;
          _results = [];
          for (key in _params) {
            _results.push("" + key + "=" + _params[key]);
          }
          return _results;
        })();
        if (pairs.length > 0) {
          return "?" + pairs.join('&');
        } else {
          return "";
        }
      };
      _set = function(key, value) {
        return _params[key] = value;
      };
      set = function() {
        var arg, key;
        arg = arguments[0];
        if (typeof arg === 'string' || typeof arg === 'number') {
          return _set(String(arg), arguments[1]);
        } else if (typeof arg === 'object') {
          for (key in arg) {
            _set(key, arg[key]);
          }
          return arg;
        } else {
          throw "Unexpected data type for: " + arg + ". Should be a string, number, or object";
        }
      };
      unset = function(key) {
        var value;
        value = _params[key];
        delete _params[key];
        return value;
      };
      return {
        href: href,
        search: search,
        get: function(key) {
          return _params[key];
        },
        set: set,
        unset: unset
      };
    };
  })(this);
}).call(this);
