'use strict';

angular.module('webClient').controller('CreateWordController', function($scope, $http, userService, toaster) {
    
    function init() {
        $scope.word = {
            word: '',
            meanings: [
                {
                    positionInOrder: 1,
                    meaning: ''
                }
            ]
        };
    }
    
    $scope.addMeaning = function() {
        $scope.word.meanings.push(
            {
                positionInOrder: $scope.word.meanings.length + 1,
                meaning: ''
            }
        );
        console.log($scope.word);
    };
    
    $scope.removeMeaning = function(meaningToRemove) {
        $scope.word.meanings.splice(
            $scope.word.meanings.indexOf(meaningToRemove), 1
        );
        $scope.word.meanings
            .filter(function(meaning) {return meaning.positionInOrder > meaningToRemove.positionInOrder;})
            .forEach(function(meaning) {meaning.positionInOrder -= 1;});
    };
    
    $scope.saveWord = function(word) {
        $http.post('/api/word', word)
            .then(function() {
                toaster.pop('success', "Word have been saved successfully");
            });
    };

    init();
});