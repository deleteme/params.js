# a small library to create a URL by adding and removing params while
# preserving existing params
((root)->

  root.Params = (_location = location)->

    _search = _location.search
    _prefix = _location.protocol + '//' + _location.host + _location.pathname
    _params = {}
    _pairs  = []

    # internal setting of a single pair
    _set = (key, value)->
      _params[key] = value
      _buildPairs()
      value

    # internal helper method to build an array of pairs
    _buildPairs = ->
      _pairs = for key of _params
        "#{key}=#{_params[key]}"

    # build the full url, similar to location.href
    href = ->
      _prefix + search()

    # build only the params, similar to location.search
    search = ->
      if _pairs.length > 0
        "?" + _pairs.join('&')
      else
        ""

    # add data to the params
    # usage:
    # set(key, value) // returns value
    # set({
    #   key: value,
    #   anotherKey: anotherValue
    # }) // returns the object
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

    # removes a pair
    # returns it's value
    unset = (key)->
      value = _params[key]
      delete _params[key]
      _buildPairs()
      value

    # an internal array of validations
    # if it passes the validation, it returns true
    _validations = [
      # it's a string
      (string)-> typeof string is 'string'
      # should start with ?
      (string)-> if string.length > 0 then string.match(/^\?/) else true,
      # it shouldn't end with &
      (string)-> !string.match(/&$/)
    ]

    # validates the internal params
    # or a string passed to it
    validate = (string) ->

      # innocent until proven guilty
      valid = true

      # try each validation
      for validation in _validations
        valid = validation(string)
        if not valid
          break

      valid

    
    # setup
    # warn if invalid object
    unless (validate(_search))
      throw "Initializing Params with invalid location.search."

    # build _params keys
    if _search.indexOf('?') >= 0
      # remove the leading ? character, and split on &
      _search = _search[1..._search.length].split('&')
      for pair in _search
        pair = pair.split('=')
        _params[pair[0]] = pair[1]

      _buildPairs()

    # export
    {
      href
      search
      get : (key)-> _params[key]
      set
      unset
      validate
    }

)(this)
