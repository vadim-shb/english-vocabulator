'use strict';

angular.module('webClient').controller('EditLearnCollectionController', function($scope, $http, $stateParams, userService) {
    
    function init() {
        refreshNewWord();
        refreshLearnCollection();
        refreshUserWords();
    }
    
    function refreshNewWord() {
        $scope.newWord = {
            word: '',
            meanings: [
                {
                    positionInOrder: 1,
                    meaning: ''
                }
            ]
        };
    }

    function refreshLearnCollection() {
        $http.get('/api/user/' + userService.getUser().id + '/learn-collection/' + $stateParams.learnCollectionId)
            .then(function(response) {
                $scope.learnCollection = response.data.learnCollection;
                $scope.wordsInLearnCollection = response.data.wordsInLearnCollection;
            });
    }
    
    function refreshUserWords() {
        $http.get('/api/user/' + userService.getUser().id + '/words')
            .then(function(response) {
                $scope.userWordMeanings = response.data;
            });
    }
    
    $scope.addToCollection = function(learnCollection, word) {
        $http.post('/api/user/' + userService.getUser().id + '/learn-collection/' + $stateParams.learnCollectionId + '/word/' + word.id) //todo: queue of commands, if internet not available
            .then(function() {
                refreshLearnCollection();
            });
    };
    
    $scope.dropFromCollection = function(learnCollection, word) {
        $http.delete('/api/user/' + userService.getUser().id + '/learn-collection/' + $stateParams.learnCollectionId + '/word/' + word.id)
            .then(function() {
                refreshLearnCollection();
            });
    };

    $scope.addMeaning = function() {
        $scope.newWord.meanings.push(
            {
                positionInOrder: $scope.newWord.meanings.length + 1,
                meaning: ''
            }
        );
    };

    $scope.removeMeaning = function(meaningToRemove) {
        $scope.newWord.meanings.splice(
            $scope.newWord.meanings.indexOf(meaningToRemove), 1
        );
        $scope.newWord.meanings
            .filter(function(meaning) {return meaning.positionInOrder > meaningToRemove.positionInOrder;})
            .forEach(function(meaning) {meaning.positionInOrder -= 1;});
    };

    $scope.saveWord = function(word) {
        $http.post('/api/user/' + userService.getUser().id + '/word', word)
            .then(function(response) {
                var savedWord = response.data;
                refreshNewWord();
                refreshUserWords();
                $scope.addToCollection($scope.learnCollection, savedWord);
                toaster.pop('success', "Word have been saved successfully");
            });
    };

    init();
});