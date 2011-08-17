(function() {
  (function(root) {
    return root.Params = function(_location) {
      var href, pair, search, set, unset, validate, _buildPairs, _i, _len, _pairs, _params, _prefix, _search, _set, _validations;
      if (_location == null) {
        _location = location;
      }
      _search = _location.search;
      _prefix = _location.protocol + '//' + _location.host + _location.pathname;
      _params = {};
      _pairs = [];
      _set = function(key, value) {
        _params[key] = value;
        _buildPairs();
        return value;
      };
      _buildPairs = function() {
        var key;
        return _pairs = (function() {
          var _results;
          _results = [];
          for (key in _params) {
            _results.push("" + key + "=" + _params[key]);
          }
          return _results;
        })();
      };
      href = function() {
        return _prefix + search();
      };
      search = function() {
        if (_pairs.length > 0) {
          return "?" + _pairs.join('&');
        } else {
          return "";
        }
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
        _buildPairs();
        return value;
      };
      _validations = [
        function(string) {
          return typeof string === 'string';
        }, function(string) {
          if (string.length > 0) {
            return string.match(/^\?/);
          } else {
            return true;
          }
        }, function(string) {
          return !string.match(/&$/);
        }
      ];
      validate = function(string) {
        var valid, validation, _i, _len;
        valid = true;
        for (_i = 0, _len = _validations.length; _i < _len; _i++) {
          validation = _validations[_i];
          valid = validation(string);
          if (!valid) {
            break;
          }
        }
        return valid;
      };
      if (!(validate(_search))) {
        throw "Initializing Params with invalid location.search.";
      }
      if (_search.indexOf('?') >= 0) {
        _search = _search.slice(1, _search.length).split('&');
        for (_i = 0, _len = _search.length; _i < _len; _i++) {
          pair = _search[_i];
          pair = pair.split('=');
          _params[pair[0]] = pair[1];
        }
        _buildPairs();
      }
      return {
        href: href,
        search: search,
        get: function(key) {
          return _params[key];
        },
        set: set,
        unset: unset,
        validate: validate
      };
    };
  })(this);
}).call(this);
