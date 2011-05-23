coffee -wc params.coffee

-----
Params

  object
  url

  'http://dc-staging.heroku.com/?mobile_site=true&locale=fr-ca'
  set(object || key, value)
  'http://dc-staging.heroku.com/?mobile_site=true&locale=fr-ca&coords[lat]=30.48'


  unset(key)
  get(key)

  url()
    => returns 'http:domain.com/?blah=fart'

  go()
    window.location.href = @url()



    Params.params.key





    var geolocation ={
      lat: 12,
      lng: 34
    }

    o['geolocation[lat]']

    "geolocation[lat]=12&geolocation[lng]=34"

