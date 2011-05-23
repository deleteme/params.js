(function() {
  window.Params = function(_location) {
    var get, go, pair, set, unset, url, _i, _len, _params, _prefix, _search, _set;
    _location = _location || location;
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
    url = function() {
      var key, pairs, suffix;
      pairs = (function() {
        var _results;
        _results = [];
        for (key in _params) {
          _results.push("" + key + "=" + _params[key]);
        }
        return _results;
      })();
      suffix = pairs.length > 0 ? "?" + pairs.join('&') : "";
      return _prefix + suffix;
    };
    go = function() {
      return open(url());
    };
    get = function(key) {
      return _params[key];
    };
    _set = function(key, value) {
      return _params[key] = value;
    };
    set = function() {
      var arg, key, _i, _len;
      arg = arguments[0];
      if (typeof arg === 'string') {
        return _set(arg, arguments[1]);
      } else if (typeof arg === 'object') {
        for (_i = 0, _len = arg.length; _i < _len; _i++) {
          key = arg[_i];
          _set(key, arg[key]);
        }
        return arg;
      }
    };
    unset = function(key) {
      var value;
      value = _params[key];
      delete _params[key];
      return value;
    };
    return {
      url: url,
      go: go,
      get: get,
      set: set,
      unset: unset
    };
  };
}).call(this);
