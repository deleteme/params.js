window.Params = (_location)->

  _location = _location or location
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

  url = ->
    pairs = for key of _params
      "#{key}=#{_params[key]}"

    suffix = if pairs.length > 0 then "?" + pairs.join('&') else ""
    _prefix + suffix

  go  = -> open url()

  get = (key)-> _params[key]

  # simple setting of a pair
  _set = (key, value)->
    _params[key] = value

  set = ->
    arg = arguments[0]
    # if a simple pair
    if typeof arg is 'string'
      _set arg, arguments[1]

    else if typeof arg is 'object'
      for key in arg
        _set key, arg[key]
      arg

  unset = (key)->
    value = _params[key]
    delete _params[key]
    value

  {
    url
    go
    get
    set
    unset
  }

