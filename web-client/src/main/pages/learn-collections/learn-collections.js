'use strict';

angular.module('webClient').controller('LearnCollectionsController', function($scope, $http, userService) {
    
    function init() {
        refreshLearnCollections();
        
        $scope.newLearnCollection = {
            name: ''
        };
    }
    
    function refreshLearnCollections() {
        $http.get('/api/user/' + userService.getUser().id + '/learn-collections')
            .then(function(response) {
                $scope.learnCollections = response.data;
            });
    }
    
    $scope.createLearnCollection = function(newLearnCollection) {
        $http.post('/api/user/' + userService.getUser().id + '/learn-collection', newLearnCollection)
            .then(function() {
                refreshLearnCollections();
            });
    };

    init();
});