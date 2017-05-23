'use strict';

/**
 * @ngdoc function
 * @name pandrugsFrontendApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the pandrugsFrontendApp
 */
angular.module('pandrugsFrontendApp')
  .controller('UserCtrl', ['user', '$scope', '$location',
    function (user, $scope, $location) {
      if ($location.search().confirmuuid) {
            user.confirm($location.search().confirmuuid, function(){
              window.alert('Your user has been successfully activated. You can now login.');
              $location.path('/login');
            }, function(){
              window.alert('ERROR: Your user could not be activated.');
            });
      }

      $scope.newUser = false;

      $scope.showRegistration = function () {
        $scope.newUser = true;
      };

      $scope.showLogin = function () {
        $scope.newUser = false;
      };

      $scope.doLogin = function() {
        user.login(
          $scope.login,
          $scope.password,
          function() { $location.path('/'); },
          function() { window.alert('Your login/password was not correct. Please make sure that you have been registered with this login/password'); }
        );
      };

      $scope.register = function() {
        user.register(
          $scope.newlogin,
          $scope.newemail,
          $scope.newpassword,
          function() {
            window.alert('Your user has been now register. We have sent you an email in order to activate it. Please check your inbox');
            $scope.newlogin = '';
            $scope.newemail = '';
            $scope.newpassword = '';
          },
          function() {
            window.alert('An error has occurred during registration. Please contact administrator');
          }
        );
      };

      $scope.currentUser = function() {
        return user.getCurrentUser();
      };

      $scope.logout = function() {
        user.logout();
      };

    }
  ]);
