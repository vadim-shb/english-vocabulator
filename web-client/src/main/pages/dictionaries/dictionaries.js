'use strict';

angular.module('webClient').controller('DictionariesController', function($scope, $http, userService) {
    $http.get('/api/user/' + userService.getUser().id + '/dictionaries')
        .then(function(response) {

        })

});