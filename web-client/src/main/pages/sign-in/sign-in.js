'use strict';

angular.module('webClient').controller('SignInController', function($scope, $http, $state, userService) {
    $scope.credentials={
        username: '',
        password: ''
    };
    
    $scope.signIn = function() {
        $http.post('/api/security/sign-in', $scope.credentials)
            .then(function(response) {
                userService.signIn(response.data.accessToken, response.data.user);
                $state.go('learnCollections');
            });
    };
});