var Params, root;
root = this;
Params = (function() {
  function Params(_location) {
    var pair, _i, _len, _ref;
    this._location = _location || root.location;
    this._search = this._location.search;
    this._prefix = this._location.protocol + '//' + this._location.host + this._location.pathname;
    this._params = {};
    this._pairs = [];
    if (!(this.validate(this._search))) {
      throw "Initializing Params with invalid location.search.";
    }
    if (this._search.indexOf('?') >= 0) {
      this._search = this._search.slice(1, this._search.length).split('&');
      _ref = this._search;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pair = _ref[_i];
        pair = pair.split('=');
        this._params[pair[0]] = pair[1];
      }
      this._buildPairs();
    }
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
    if (this._pairs.length > 0) {
      return "?" + this._pairs.join('&');
    } else {
      return "";
    }
  };
  Params.prototype.set = function() {
    var arg, key;
    arg = arguments[0];
    if (typeof arg === 'string' || typeof arg === 'number') {
      return this._set(String(arg), arguments[1]);
    } else if (typeof arg === 'object') {
      for (key in arg) {
        this._set(key, arg[key]);
      }
      return arg;
    } else {
      throw "Unexpected data type for: " + arg + ". Should be a string, number, or object";
    }
  };
  Params.prototype.unset = function(key) {
    var value;
    value = this._params[key];
    delete this._params[key];
    this._buildPairs();
    return value;
  };
  Params.prototype._validations = [
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
  Params.prototype.validate = function(string) {
    var valid, validation, _i, _len, _ref;
    valid = true;
    _ref = this._validations;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      validation = _ref[_i];
      valid = validation(string);
      if (!valid) {
        break;
      }
    }
    return valid;
  };
  Params.prototype.get = function(key) {
    return this._params[key];
  };
  return Params;
})();