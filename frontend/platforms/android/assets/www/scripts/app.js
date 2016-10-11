angular.module('capsule', ['controllers', 'services', 'ionic', 'ui.router', 'ngCordova'])

.run(function($ionicPlatform, $window, LocalStorage, $state, $cordovaStatusbar) {
  if ($window.location.hostname == "localhost") {
    LocalStorage.set('baseUrl', JSON.stringify('http://localhost:3000'))
  }
  else {
    LocalStorage.set('baseUrl', JSON.stringify('https://cappsule-dev.herokuapp.com'))
  }
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);  // Hide the accessory bar by default
      cordova.plugins.Keyboard.disableScroll(true); //Stops the viewport from snapping when text inputs are focused
    }
    if(window.StatusBar) {
      $cordovaStatusbar.styleHex('#428bdb')
      // StatusBar.styleDefault();
    }

  });
})

.config(function($stateProvider, $urlRouterProvider, $windowProvider) {

  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  $stateProvider.state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  $stateProvider.state('app', {
    url: '/app',
    templateUrl: 'templates/menu.html',
    abstract: true,
    controller: 'appCtrl'
  })

  $stateProvider.state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'homeCtrl'
        }
      }
    })

  $stateProvider.state('app.home.capsules', {
    url: '/capsules',
    templateUrl: 'templates/capsules.html',
    controller: 'capsulesCtrl'
  })

  $stateProvider.state('app.capsules-detail', {
    url: '/capsules/:id',
    views:{
      'menuContent': {
        templateUrl: 'templates/capsules.detail.html',
        controller: 'capsulesCtrl'
      }
    }
  })

  $stateProvider.state('app.new-request', {
      url: '/request/new',
      views: {
        'menuContent': {
          templateUrl: 'templates/new-request.html',
          controller: 'requestCtrl'
        }
      }
    })

    $stateProvider.state('app.accept-request', {
      url: '/request/accept',
      views: {
        'menuContent': {
          templateUrl: 'templates/accept-request.html',
          controller: 'requestCtrl'
        }
      }
    })



  $stateProvider.state('app.notifications', {
    url: '/notifications',
    views: {
      'menuContent': {
        templateUrl: 'templates/notifications.html',
        controller: 'notificationsCtrl'
      }
    }
  })
  var $window = $windowProvider.$get()
  var user = $window.localStorage['user']
  console.log('user', user);
  if(user === undefined){
    $urlRouterProvider.otherwise('/login')
  }
  else {
    $urlRouterProvider.otherwise('/app/home')
  }
})

.controller('appCtrl', function($state, $scope, $ionicSideMenuDelegate, $window, $ionicLoading, $ionicHistory, $timeout){
  $scope.user = JSON.parse($window.localStorage['user'])
  $scope.friends = $window.localStorage['friends'] || '{}'
  console.log('menu user is:', $scope.user);

  $scope.logout = function(){
    console.log("logout");
    $ionicLoading.show({template:'Logging out....'});
    $window.localStorage.clear()
    $timeout(function() {
        $ionicLoading.hide();
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
        $state.go('login');
        }, 30);
  }
  $scope.toggleMenu = function(){
    $ionicSideMenuDelegate.toggleLeft()
    console.log("toggle menu");
  }
})
