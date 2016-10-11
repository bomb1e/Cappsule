angular.module("controllers", ['angularMoment', 'ionic-modal-select', 'ion-datetime-picker'])

  .controller('signupCtrl', function($scope, $state, $http, $timeout, SignUp, LocalStorage, $ionicLoading){
    var avatarUrl = "http://api.adorable.io/avatar/100/"
    $scope.name = null
    $scope.noName = false
    $scope.signup = function(){
      if ($scope.name) {
        $ionicLoading.show()
        var updateMe = new SignUp({name: $scope.name})
        var name = $scope.name.replace(/\s+/g, '');
        updateMe.name = $scope.name
        updateMe.avatar = avatarUrl + name + "@getcappsule.com"
        updateMe.$save(function(response){
          $timeout(function(){
            LocalStorage.set('user', response.data.user)
            console.log(LocalStorage.get('user'));
            $state.go("app.home");
            $ionicLoading.hide()
          })
        })
      }
      else {
        $scope.noName = true
      }
    }
  })


  .controller('loginCtrl', function($rootScope, $scope, $ionicPlatform, Login, $state, $http, LocalStorage, $ionicLoading, $timeout, $ionicHistory){
    console.log(LocalStorage.get('baseUrl'));
    $scope.phoneNumber = null
    $scope.noPhoneNumber = false
    $scope.loginWithNumber = function(){
      if ($scope.phoneNumber) {
        $scope.noPhoneNumber = false
        if(!$scope.noPhoneNumber) {
          $scope.phoneNumberValidator = (typeof $scope.phoneNumber.toString() === "string")
          console.log('phoneNumberValidator', $scope.phoneNumberValidator);
          $scope.phoneNumberValidator &= ($scope.phoneNumber.toString().match(/\d/g).length <= 12)
          console.log('phoneNumberValidator', $scope.phoneNumberValidator);
        }
        console.log('phoneNumberValidator', $scope.phoneNumberValidator);
        console.log('phoneNumber', $scope.phoneNumber);
        if($scope.phoneNumberValidator){
          $ionicLoading.show()
          Login.get({phone_number: $scope.phoneNumber.toString()}, function(response){
            $timeout(function(){
              var user = response.data.user
              LocalStorage.set('user', user)
              $http.defaults.headers.common['X-Auth-Token'] = user.api_key;
              console.log("Token is " + $http.defaults.headers.common['X-Auth-Token']);
              console.log(LocalStorage.get('user'));
              if(response.flag === 301) {
                console.log("going to home");
                $state.go("app.home");
                $ionicLoading.hide()
              }
              else if (response.flag === 300) {
                console.log("going to signup");
                $state.go("signup")
                $ionicLoading.hide()
              }
              $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
            })
          })
        }
      }
      else {
        $scope.noPhoneNumber = true
      }
      console.log('phoneNumberValidator', $scope.phoneNumberValidator);
      console.log('noPhoneNumber', $scope.noPhoneNumber);
    }

    $ionicPlatform.ready(function() {
      // $scope.openDigits = function(){
      //   console.log("open digits");
      //   var digits = new DigitsCordova('Wg5tX7Ml5TtUQKKlkZRh0HlZZ','http://ericgithinji.com'); //Replace with your own consumerKey and your url
      //     digits.open()
      //         .successCallback(function(loginResponse){
      //           console.log("Success");
      //           console.log(loginResponse);
      //           var oAuthHeaders = loginResponse.oauth_echo_headers;
      //           var verifyData = {
      //               authHeader: oAuthHeaders['X-Verify-Credentials-Authorization'],
      //               apiUrl: oAuthHeaders['X-Auth-Service-Provider']
      //           };
      //           console.log(verifyData);
      //           // Verify user from database
      //           // $rootScope.user = UserService.get({phone_number: })
      //
      //         }).failCallback(function(error){
      //           console.log("Failure: " + error);
      //             //error
      //         }).errorCallback(function(error){
      //           console.log("Error: " + error);
      //             //error
      //         })
      //         console.log("Inside digits");
      // }
    });
  })


  .controller('homeCtrl', function($rootScope, $scope, $state, Capsules, $http, $timeout, $window, LocalStorage, Data, Utils){
    console.log("home");
    console.log("token:", $http.defaults.headers.common['X-Auth-Token']);
    $scope.user = LocalStorage.get('user')
    console.log('home user is', $scope.user);
    if (LocalStorage.get('capsules')) $scope.capsules = LocalStorage.get('capsules')
    console.log("local storage capsules", $scope.capsules);
    Capsules.get(function(response){
      $timeout(function(){
        if(response.data.capsules.length > 0){
          $scope.capsules = response.data.capsules
          LocalStorage.set('capsules', JSON.stringify(response.data.capsules))
        }
        console.log("server capsules", $scope.capsules);
      })
    })

    $scope.refresh = function(){
      Capsules.get(function(response){
        $timeout(function(){
          console.log('refresh capsule response', response);
          if(response.data.capsules.length > 0) $scope.capsules = response.data.capsules
          console.log("after refresh", $scope.capsules)
          $scope.$broadcast('scroll.refreshComplete')
        })
      })
    }


    $scope.logCapsule = function(){
      Data.setCapsule(this.capsule)
      console.log('this capsule', this.capsule);
    }

    $scope.getSymbol = function(symbol){
      return 'images/' + symbol + '.png'
    }

    $scope.getLastRequest = function(requests){
      return moment(requests[requests.length - 1].request.accepted_time).fromNow()
    }

  })

  .controller('requestCtrl', function($scope, $state, $http, $timeout, $ionicLoading, Requests, Friends, Activities, moment, LocalStorage, Data){

    $scope.activities = []
    $scope.friends = []
    $scope.sent = true

    Friends.get(function(response){
      $timeout(function(){
        $scope.friends = response.data.friends
        console.log('server friends', $scope.friends);
      })
    })

    Activities.get(function(response){
      $timeout(function(){
        $scope.activities = response.data.activities
        console.log('server activities', $scope.activities);
      })
    })

    $scope.selectedActivity = {
      id: 0,
      title: 'activity'
    }

    $scope.selectedPerson = {
      id: 0,
      name: 'person'
    }

    $scope.betterDateTimes = []
    $scope.selectedDates = []
    moment().format()
    $scope.betterDate = function(datetimeValue){
      console.log(datetimeValue)
      $scope.selectedDates.push(datetimeValue)
      $scope.betterDateTimes.push(moment(datetimeValue).calendar() + ", ")
      // console.log($scope.)
    }
    $scope.changed = function(newValue, oldValue){
      console.log("Changed from " , oldValue , " to " , newValue);
      console.log($scope.selectedActivity,$scope.selectedPerson);
    }

    $scope.send = function(selectedActivity, selectedPerson, selectedDates){
      if(selectedActivity.id !== 0 && selectedPerson.id !== 0 && selectedDates.length > 0){
        var newRequest = new Requests({receiver_id: selectedPerson.id})
        newRequest.activity_id = selectedActivity.id
        newRequest.receiver_id = selectedPerson.id
        newRequest.suggested_times = selectedDates
        console.log(newRequest);
        console.log(JSON.stringify(newRequest))
        $ionicLoading.show()
        newRequest.$save(function(res){
          $timeout(function(){
            if(!res.error){
              $state.go('app.home')
              $ionicLoading.hide()
            }
            if(res.error){
              $scope.sent = false
              $ionicLoading.hide()
            }
          })
        })
      }
    // $scope.validator = ($scope.selectedDates.length > 0)
      // Check whether all fields are filled and give feedback
      // Save request to localStorage
      // POST request to database
      // redirect to home

    }
    var notification = Data.getRequest()
    $scope.sentRequest = {}
    $scope.sentRequest.request = notification.request
    $scope.sentRequest.user = notification.user
    $scope.suggestedTimes = []
    console.log('notification', notification);
    if(notification.notification){
      for($index in notification.request.suggested_times){
        $scope.suggestedTimes.push({
          'moment': moment(notification.request.suggested_times[$index]).calendar(),
          'time': notification.request.suggested_times[$index],
          'checked': false
        })
      }
    }
    console.log('sentRequest', $scope.sentRequest);
    console.log('suggestedTimes', $scope.suggestedTimes);
    $scope.acceptRequest = function(){
      console.log('suggestedTimes', $scope.suggestedTimes);
      $ionicLoading.show()
      var acceptRequest = new Requests({request_id: $scope.sentRequest.request.request.id})
      for($index in $scope.suggestedTimes){
        if($scope.suggestedTimes[$index].checked) acceptRequest.accepted_time = $scope.suggestedTimes[$index].time
      }
      // acceptRequest.$save(function(res){
      //   $timeout(function(){
      //     console.log('accepted response', res);
          console.log('accepted requests', acceptRequest);
          $state.go('app.home')
          $ionicLoading.hide()
        // })
      // })
    }
  })

  .controller('capsulesCtrl', function($scope, $state, Data, moment){
    $scope.capsule = Data.getCapsule()

    $scope.getSymbol = function(symbol){
      return 'images/' + symbol + '.png'
    }

    $scope.getSymbolId = function(activityId){
      console.log('activity', activityId);
      var activity = 'missing';
      if(activityId == 1) activity = 'skype'
      if(activityId == 2) activity = 'whatsapp'
      if(activityId == 3) activity = 'coffee'
      return $scope.getSymbol(activity)
    }

    $scope.prettyDate = function(date){
      console.log('date', date);
      return moment(date).fromNow()
    }
    console.log($scope.capsule);
  })

  .controller('notificationsCtrl', function($scope, Notifications, $timeout, Data, LocalStorage){
    $scope.notifications = LocalStorage.get('notifications')
    Notifications.get(function(response){
      $timeout(function(){
        $scope.notifications = response.data.notifications
        LocalStorage.set('notifications', $scope.notifications)
        console.log(response);
        console.log('notifications', $scope.notifications);
      })
    })
    $scope.openNotification = function(){
      Data.setRequest(this.notification)
      console.log('notfication is', this);
    }
  })

  .controller('popupCtrl', function($scope, $ionicPopup, $timeout){

  })
