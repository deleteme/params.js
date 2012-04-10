
(function() {
  var root;
  root = this;
  root.Params = (function() {

    function Params(_location) {
      this._location = _location || root.location;
      this._search = this._location.search;
      this._prefix = this._location.protocol + '//' + this._location.host + this._location.pathname;
      this._params = {};
      this._pairs = [];
      if (!(this.validate(this._search))) {
        throw "Initializing Params with invalid location.search.";
      }
      this._params = Params.parse(this._search);
      this._buildPairs();
    }

    Params.prototype._set = function(key, value) {
      this._params[key] = value;
      this._buildPairs();
      return value;
    };

    Params.prototype._buildPairs = function() {
      var key;
      return this._pairs = (function() {
        var _results;
        _results = [];
        for (key in this._params) {
          _results.push("" + key + "=" + this._params[key]);
        }
        return _results;
      }).call(this);
    };

    Params.prototype.href = function() {
      return this._prefix + this.search();
    };

    Params.prototype.search = function() {
      if (this._pairs.length) {
        return "?" + this._pairs.join('&');
      } else {
        return "";
      }
    };

    Params.prototype.set = function() {
      var arg, key;
      arg = arguments[0];
      if (typeof arg === 'string' || typeof arg === 'number') {
        this._set(String(arg), arguments[1]);
      } else if (typeof arg === 'object') {
        for (key in arg) {
          this._set(key, arg[key]);
        }
      } else {
        throw "Unexpected data type for: " + arg + ". Should be a string, number, or object";
      }
      return this;
    };

    Params.prototype.unset = function(key) {
      var value;
      value = this._params[key];
      delete this._params[key];
      this._buildPairs();
      return this;
    };

    Params.prototype._validations = [
      function(string) {
        return typeof string === 'string';
      }, function(string) {
        if (string.length) {
          return string.match(/^\?/);
        } else {
          return true;
        }
      }, function(string) {
        return !string.match(/&$/);
      }
    ];

    Params.prototype.validate = function(string) {
      var valid, validation, _i, _len, _ref;
      valid = true;
      _ref = this._validations;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        validation = _ref[_i];
        valid = validation(string);
        if (!valid) break;
      }
      return valid;
    };

    Params.prototype.get = function(key) {
      return this._params[key];
    };

    Params.prototype.object = function() {
      var key, obj;
      obj = {};
      for (key in this._params) {
        obj[key] = this._params[key];
      }
      return obj;
    };

    return Params;

  })();
  return root.Params.parse = function(paramString) {
    var pair, paramArray, paramObj, _i, _len;
    paramObj = {};
    paramArray = [];
    if (paramString.length > 1) {
      paramArray = paramString.slice(1 + paramString.indexOf('?'), paramString.length).split('&');
      for (_i = 0, _len = paramArray.length; _i < _len; _i++) {
        pair = paramArray[_i];
        pair = pair.split('=');
        paramObj[pair[0]] = pair[1];
      }
    }
    return paramObj;
  };
})();
