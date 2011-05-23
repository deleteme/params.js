# a small library to create a URL by adding and removing params while
# preserving existing params
window.Params = (_location = location)->

  _search   = _location.search
  _prefix   = _location.protocol + '//' + _location.host + _location.pathname
  _params   = {}

  # build _params keys
  if _search.indexOf('?') >= 0
    # remove the leading ? character, and split on &
    _search = _search[1..._search.length].split('&')
    for pair in _search
      pair = pair.split('=')
      _params[pair[0]] = pair[1]

  # build the full url, similar to location.href
  href = ->
    _prefix + search()

  # build only the params, similar to location.search
  search = ->
    pairs = for key of _params
      "#{key}=#{_params[key]}"
    if pairs.length > 0
      "?" + pairs.join('&')
    else
      ""

  # simple setting of a pair
  _set = (key, value)->
    _params[key] = value

  set = ->
    arg = arguments[0]
    # if a simple pair
    if typeof arg is 'string' or typeof arg is 'number'
      _set String(arg), arguments[1]

    else if typeof arg is 'object'
      for key of arg
        _set key, arg[key]
      arg
    else
      throw "Unexpected data type for: #{arg}. Should be a string, number, or object"

  unset = (key)->
    value = _params[key]
    delete _params[key]
    value

  # export
  {
    href
    search
    get : (key)-> _params[key]
    set
    unset
  }

