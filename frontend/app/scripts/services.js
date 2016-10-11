angular.module("services", [ 'ngResource'])

  .factory("LocalStorage", function($window){
    return {
      set: function(key, value){
        if (angular.isArray(value) || angular.isObject(value)) {
          value = JSON.stringify(value);
        }
        $window.localStorage[key] = value;
      },
      get: function(key){
        return JSON.parse($window.localStorage[key] || '{}');
      },
      clear: function(){
        return localStorage.clear();
      }
    }
  })

  .factory("Utils", function(){
    return {
      isEmpty: function(object){
        return Object.keys(object).length === 0;
      }
    }
  })

  .factory("Login", function($resource, LocalStorage){
    var baseUrl = LocalStorage.get('baseUrl')
    return $resource(baseUrl + '/login/:phone_number', {phone_number: 'phoneNumber'})
  })

  .factory("SignUp", function($resource, LocalStorage){
    var baseUrl = LocalStorage.get('baseUrl')
    return $resource(baseUrl + '/me')
  })

  .factory("Requests", function($resource, $http, LocalStorage){
    var baseUrl = LocalStorage.get('baseUrl')
    $http.defaults.headers.common['X-Auth-Token'] = LocalStorage.get('user').api_key
    return $resource(baseUrl + '/requests/:request', {request: '@request'})
  })

  .factory('Activities', function($resource, $http, LocalStorage){
      var baseUrl = LocalStorage.get('baseUrl')
      $http.defaults.headers.common['X-Auth-Token'] = LocalStorage.get('user').api_key
      return $resource(baseUrl + '/activities')
  })

  .factory('Capsules', function($resource, $http, LocalStorage){
    var baseUrl = LocalStorage.get('baseUrl')
    $http.defaults.headers.common['X-Auth-Token'] = LocalStorage.get('user').api_key
    return $resource(baseUrl + '/capsules')
  })

  .factory('Friends',function($resource, $http, LocalStorage) {
    var baseUrl = LocalStorage.get('baseUrl')
    $http.defaults.headers.common['X-Auth-Token'] = LocalStorage.get('user').api_key
    return $resource(baseUrl + '/friends')
  })

  .factory('Notifications', function($resource, $http, LocalStorage){
      var baseUrl = LocalStorage.get('baseUrl')
      $http.defaults.headers.common['X-Auth-Token'] = LocalStorage.get('user').api_key
      return $resource(baseUrl + '/notifications')
  })

  .factory('Data', function(){
    var cap = {}
    var req = {}
    return {
      setCapsule: function(capsule){
        cap = capsule
      },
      getCapsule: function(){
        return cap
      },
      setRequest: function(request){
        req = request
      },
      getRequest: function(){
        return req
      }
    }
  })
