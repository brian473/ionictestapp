// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('ionicApp', ['ionic']);
var image;
var images = [];

app.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}]);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.controller("PhotoListCtrl", function($scope, $state, Camera) {
  $scope.photos = images;

  $scope.takePicture = function() {
    console.log('Getting camera');
    Camera.getPicture({
      quality: 75,
      targetWidth: 100,
      targetHeight: 100,
    }).then(function(imageURI) {
      console.log(imageURI);
      image = imageURI;
      $scope.lastPhoto = imageURI;
      $state.transitionTo('submit');
    }, function(err) {
      console.err(err);
    });
  };

});

app.controller("SubmitCtrl", function($scope, $state) {

  $scope.lastPhoto = image;
  $scope.addImage = function() {
    var newImage = {};
    newImage.photo = $scope.lastPhoto;
    newImage.caption = $scope.inputCaption;
    images.splice(0, 0, newImage);
    $state.transitionTo('list');
  };

});


app.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
});

app.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

        .state('list', {
          url: '/',
          templateUrl: 'templates/list.html',
	  controller: 'PhotoListCtrl'
        })
	.state('submit', {
	  url: '/submit',
	  templateUrl: 'templates/submit.html',
	  controller: 'SubmitCtrl'
	});

	$urlRouterProvider.otherwise('/');
});
